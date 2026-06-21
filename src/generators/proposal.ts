import { validateWord } from "../core/phonology";
import { flattenLexicon, loadSpec, readSpecYaml } from "../core/spec";
import type { CompoundTerm, RootSpec } from "../core/types";
import { canonicalRoot, generateRoot } from "./derivation";

type ProposalKind = "root" | "compound";

export interface TermProposalOptions {
  field: string;
  kind?: ProposalKind;
  domain?: string;
  register?: string;
  root?: string;
  components?: string[];
  gloss?: string;
  example?: string;
}

export interface ProposedForm {
  pattern: string;
  word: string;
  valid_phonology: boolean;
  errors: string[];
  collision: boolean;
}

export interface TermProposal {
  status: "candidate";
  kind: ProposalKind;
  field: string;
  domain?: string;
  register?: string;
  candidate: Record<string, unknown>;
  governance: {
    lifecycle_status: "candidate";
    satisfied_requirements: string[];
    missing_requirements: string[];
    review_checklist: string[];
  };
  warnings: string[];
  cultural_notes: string[];
}

const proposalPatterns = ["verb", "noun", "adjective", "agent", "object", "civic", "ritual", "intimate", "record", "right", "vow"];

function interleave(consonants: string[], vowel: string): string {
  return consonants.map((consonant, index) => consonant + (index === consonants.length - 1 ? "" : vowel)).join("");
}

function deriveCandidate(consonants: string[], pattern: string): string {
  const base = interleave(consonants, "a");
  const forms: Record<string, string> = {
    verb: base,
    noun: interleave(consonants, "e"),
    adjective: interleave(consonants, "i"),
    agent: `${base}en`,
    object: interleave(consonants, "o"),
    ritual: `ha-${interleave(consonants, "u")}`,
    civic: `${base}-da`,
    intimate: `mi-${base}`,
    record: `${base}-ket`,
    right: `${base}-ret`,
    vow: `${base}-dov`
  };
  return forms[pattern] ?? base;
}

function knownWords(): Set<string> {
  const spec = loadSpec();
  const known = new Set<string>();
  for (const entry of flattenLexicon(spec)) known.add(entry.word.toLowerCase());
  for (const particle of spec.particles.particles) known.add(particle.word.toLowerCase());
  for (const pronoun of spec.pronouns.pronouns) known.add(pronoun.word.toLowerCase());
  for (const root of spec.roots.roots) {
    for (const derived of Object.values(root.derived)) known.add(derived.word.toLowerCase());
  }
  return known;
}

function rootIds(root: RootSpec): string[] {
  return [root.id, root.form, ...(root.aliases ?? [])].map(canonicalRoot);
}

function fieldTokens(field: string): string[] {
  return field
    .toLowerCase()
    .split(/[^a-z]+/)
    .map((token) => token.trim())
    .filter((token) => token.length >= 4);
}

function similarRoots(field: string): RootSpec[] {
  const tokens = fieldTokens(field);
  if (tokens.length === 0) return [];
  return loadSpec().roots.roots
    .map((root) => ({
      root,
      score: tokens.filter((token) => root.semantic_field.toLowerCase().includes(token) || root.core.toLowerCase().includes(token)).length
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.root.id.localeCompare(b.root.id))
    .slice(0, 8)
    .map((item) => item.root);
}

function compoundTerms(): CompoundTerm[] {
  return readSpecYaml<{ terms: CompoundTerm[] }>("compounds.yaml").terms;
}

function governance(requirements: Array<[string, boolean]>) {
  return {
    lifecycle_status: "candidate" as const,
    satisfied_requirements: requirements.filter(([, met]) => met).map(([name]) => name),
    missing_requirements: requirements.filter(([, met]) => !met).map(([name]) => name),
    review_checklist: readSpecYaml<{ review_checklist: string[] }>("governance.yaml").review_checklist
  };
}

export function proposeTerm(options: TermProposalOptions): TermProposal {
  const field = options.field.trim();
  if (!field) {
    throw new Error("--field is required for a term proposal");
  }

  const kind: ProposalKind = options.kind ?? (options.components && options.components.length > 0 ? "compound" : "root");
  const known = knownWords();
  const warnings: string[] = [];
  const culturalNotes = [
    "A proposal is not an accepted Ethra term until governance review admits it.",
    "Prefer compounds when the concept should keep its parts visible; prefer roots for durable semantic fields."
  ];

  if (kind === "compound") {
    const components = (options.components ?? []).map((component) => component.trim().toLowerCase()).filter(Boolean);
    if (components.length < 2) {
      throw new Error("A compound proposal needs at least two --components values.");
    }

    const word = components.join("-");
    const phonology = validateWord(word);
    const acceptedCompound = compoundTerms().find((term) => term.word.toLowerCase() === word);
    const componentReports = components.map((component) => ({
      word: component,
      known: known.has(component),
      valid_phonology: validateWord(component).valid,
      analysis: known.has(component) ? "accepted component" : "not found in accepted lexicon"
    }));
    const unknownComponents = componentReports.filter((component) => !component.known).map((component) => component.word);

    if (!phonology.valid) warnings.push(`Compound phonology failed: ${phonology.errors.join("; ")}`);
    if (acceptedCompound) warnings.push(`Compound already exists as ${acceptedCompound.id}.`);
    if (unknownComponents.length) warnings.push(`Unknown compound components: ${unknownComponents.join(", ")}`);

    return {
      status: "candidate",
      kind,
      field,
      domain: options.domain,
      register: options.register,
      candidate: {
        word,
        meaning: options.gloss ?? field,
        morphology: components.join(" + "),
        components: componentReports,
        valid_phonology: phonology.valid,
        errors: phonology.errors,
        existing_compound: acceptedCompound?.id,
        example: options.example
      },
      governance: governance([
        ["root or compound analysis", true],
        ["domain", Boolean(options.domain)],
        ["register", Boolean(options.register)],
        ["definition", Boolean(options.gloss ?? field)],
        ["example sentence", Boolean(options.example)],
        ["no phonology failure", phonology.valid],
        ["no obvious collision", !acceptedCompound && unknownComponents.length === 0]
      ]),
      warnings,
      cultural_notes: culturalNotes
    };
  }

  const generated = generateRoot(field);
  const rootId = canonicalRoot(options.root ?? generated.root);
  const consonants = rootId.toLowerCase().split("");
  const exactCollisions = loadSpec().roots.roots.filter((root) => rootIds(root).includes(rootId));
  const relatedRoots = similarRoots(field);
  const validRootShape = consonants.length >= 2 && consonants.length <= 4;
  const preview = proposalPatterns.map((pattern): ProposedForm => {
    const word = deriveCandidate(consonants, pattern);
    const phonology = validateWord(word);
    return {
      pattern,
      word,
      valid_phonology: phonology.valid,
      errors: phonology.errors,
      collision: known.has(word.toLowerCase())
    };
  });

  if (!validRootShape) warnings.push("Root proposals should use 2-4 consonants.");
  if (exactCollisions.length) warnings.push(`Root collides with accepted root(s): ${exactCollisions.map((root) => root.id).join(", ")}`);
  const collidedForms = preview.filter((form) => form.collision).map((form) => form.word);
  if (collidedForms.length) warnings.push(`Derived preview collides with accepted words: ${collidedForms.join(", ")}`);
  if (relatedRoots.length) warnings.push(`Review related roots before admission: ${relatedRoots.map((root) => root.id).join(", ")}`);

  return {
    status: "candidate",
    kind,
    field,
    domain: options.domain,
    register: options.register,
    candidate: {
      root: rootId,
      alias: interleave(consonants, "a").toUpperCase(),
      sample: interleave(consonants, "a"),
      generated_from_field: generated,
      valid_root_shape: validRootShape,
      exact_collisions: exactCollisions.map((root) => ({ id: root.id, category: root.category, semantic_field: root.semantic_field })),
      related_roots: relatedRoots.map((root) => ({ id: root.id, category: root.category, semantic_field: root.semantic_field })),
      derived_preview: preview,
      example: options.example
    },
    governance: governance([
      ["root or compound analysis", true],
      ["domain", Boolean(options.domain)],
      ["register", Boolean(options.register)],
      ["definition", Boolean(options.gloss ?? field)],
      ["example sentence", Boolean(options.example)],
      ["no phonology failure", preview.every((form) => form.valid_phonology) && validRootShape],
      ["no obvious collision", exactCollisions.length === 0 && preview.every((form) => !form.collision)]
    ]),
    warnings,
    cultural_notes: culturalNotes
  };
}
