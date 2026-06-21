import { validateWord } from "./phonology";
import { flattenLexicon, loadSpec, readSpecYaml } from "./spec";
import type { CompoundsSpec, CorpusSpec, DomainsSpec, EthraSpec, CorpusPlanSpec } from "./types";

export interface ValidationIssue {
  code: string;
  message: string;
  severity: "error" | "warning";
}

export interface SpecValidationReport {
  valid: boolean;
  issueCount: number;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
  stats: {
    roots: number;
    lexiconEntries: number;
    derivationPatterns: number;
    particles: number;
    pronouns: number;
    examples: number;
  };
}

export interface CorpusValidationReport {
  valid: boolean;
  issueCount: number;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
  stats: {
    items: number;
    tracks: number;
    domains: number;
    uniqueTerms: number;
  };
}

export interface CompoundsValidationReport {
  valid: boolean;
  issueCount: number;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
  stats: {
    terms: number;
    accepted: number;
    domains: number;
    registers: number;
  };
}

const allowedReservedOverlaps = new Map<string, string>([
  ["MR.object", "mor is grammaticalized as the inherited-duty particle."],
  ["VL.noun", "vel is grammaticalized as the choice particle."],
  ["DV.object", "dov is grammaticalized as the vow particle."],
  ["TR.object", "tor is grammaticalized as the chosen-duty particle."],
  ["HN.object", "hon is grammaticalized as the household collective pronoun."],
  ["SL.object", "sol is grammaticalized as the truth-intensifying particle."]
]);

function addIssue(issues: ValidationIssue[], severity: ValidationIssue["severity"], code: string, message: string): void {
  issues.push({ severity, code, message });
}

export function validateSpec(spec: EthraSpec = loadSpec()): SpecValidationReport {
  const issues: ValidationIssue[] = [];
  const rootIds = new Map<string, string>();
  const aliases = new Map<string, string>();
  const derivedWords = new Map<string, string>();
  const reservedWords = new Map<string, string>();
  const patternIds = new Set<string>();

  for (const pattern of spec.derivation_patterns.patterns) {
    if (patternIds.has(pattern.id)) {
      addIssue(issues, "error", "duplicate-derivation-pattern", `Derivation pattern '${pattern.id}' appears more than once.`);
    }
    patternIds.add(pattern.id);

    const validation = validateWord(pattern.example_word);
    if (!validation.valid) {
      addIssue(
        issues,
        "error",
        "invalid-pattern-example",
        `Derivation pattern '${pattern.id}' example '${pattern.example_word}' fails phonology: ${validation.errors.join("; ")}.`
      );
    }
  }

  if (spec.derivation_patterns.total_patterns_per_root !== spec.derivation_patterns.patterns.length) {
    addIssue(
      issues,
      "warning",
      "pattern-count-mismatch",
      `Derivation pattern count ${spec.derivation_patterns.total_patterns_per_root} does not match ${spec.derivation_patterns.patterns.length} listed patterns.`
    );
  }

  for (const particle of spec.particles.particles) {
    reservedWords.set(particle.word, `particle:${particle.type}`);
  }

  for (const pronoun of spec.pronouns.pronouns) {
    if (reservedWords.has(pronoun.word)) {
      addIssue(
        issues,
        "warning",
        "reserved-word-overlap",
        `Pronoun '${pronoun.word}' also appears as ${reservedWords.get(pronoun.word)}.`
      );
    }
    reservedWords.set(pronoun.word, `pronoun:${pronoun.stance}`);
  }

  for (const root of spec.roots.roots) {
    if (rootIds.has(root.id)) {
      addIssue(issues, "error", "duplicate-root-id", `Root '${root.id}' duplicates ${rootIds.get(root.id)}.`);
    }
    rootIds.set(root.id, root.semantic_field);

    for (const alias of root.aliases ?? []) {
      if (aliases.has(alias)) {
        addIssue(issues, "error", "duplicate-root-alias", `Alias '${alias}' is shared by ${aliases.get(alias)} and ${root.id}.`);
      }
      aliases.set(alias, root.id);
    }

    for (const [pattern, derived] of Object.entries(root.derived)) {
      if (!patternIds.has(pattern)) {
        addIssue(issues, "error", "unknown-root-pattern", `${root.id}.${pattern} is not listed in derivation-patterns.yaml.`);
      }

      const validation = validateWord(derived.word);
      if (!validation.valid) {
        addIssue(
          issues,
          "error",
          "invalid-derived-form",
          `${root.id}.${pattern} '${derived.word}' fails phonology: ${validation.errors.join("; ")}.`
        );
      }

      const existing = derivedWords.get(derived.word);
      if (existing) {
        addIssue(issues, "error", "duplicate-derived-word", `${root.id}.${pattern} '${derived.word}' duplicates ${existing}.`);
      }
      derivedWords.set(derived.word, `${root.id}.${pattern}`);

      const reserved = reservedWords.get(derived.word);
      if (reserved) {
        const overlapKey = `${root.id}.${pattern}`;
        const allowedReason = allowedReservedOverlaps.get(overlapKey);
        if (allowedReason) {
          addIssue(
            issues,
            "warning",
            "grammaticalized-overlap",
            `${overlapKey} '${derived.word}' overlaps with ${reserved}: ${allowedReason}`
          );
        } else {
          addIssue(issues, "error", "derived-reserved-collision", `${overlapKey} '${derived.word}' collides with ${reserved}.`);
        }
      }
    }

    for (const pattern of patternIds) {
      if (!root.derived[pattern]) {
        addIssue(issues, "error", "missing-root-pattern", `${root.id} is missing derivation pattern '${pattern}'.`);
      }
    }
  }

  const lexiconEntries = flattenLexicon(spec);
  for (const entry of lexiconEntries) {
    const validation = validateWord(entry.word);
    if (!validation.valid) {
      addIssue(
        issues,
        "warning",
        "lexicon-phonology",
        `Lexicon entry '${entry.word}' fails phonology: ${validation.errors.join("; ")}.`
      );
    }
  }

  const errors = issues.filter((issue) => issue.severity === "error");
  const warnings = issues.filter((issue) => issue.severity === "warning");

  return {
    valid: errors.length === 0,
    issueCount: issues.length,
    errors,
    warnings,
    stats: {
      roots: spec.roots.roots.length,
      lexiconEntries: lexiconEntries.length,
      derivationPatterns: spec.derivation_patterns.patterns.length,
      particles: spec.particles.particles.length,
      pronouns: spec.pronouns.pronouns.length,
      examples: spec.examples.examples.length
    }
  };
}

function normalizedTokenSet(spec: EthraSpec): Set<string> {
  const known = new Set<string>();

  for (const entry of flattenLexicon(spec)) {
    known.add(entry.word.toLowerCase());
  }
  for (const particle of spec.particles.particles) {
    known.add(particle.word.toLowerCase());
  }
  for (const pronoun of spec.pronouns.pronouns) {
    known.add(pronoun.word.toLowerCase());
  }
  for (const root of spec.roots.roots) {
    for (const derived of Object.values(root.derived)) {
      known.add(derived.word.toLowerCase());
    }
  }

  return known;
}

function tokenizeEthra(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[.,!?;:()"']/g, " ")
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean);
}

function isKnownToken(token: string, known: Set<string>): boolean {
  if (known.has(token)) return true;
  if (token.includes("-")) {
    return token.split("-").every((part) => known.has(part));
  }
  return false;
}

export function validateCorpus(
  corpus: CorpusSpec = readSpecYaml<CorpusSpec>("corpus.yaml"),
  spec: EthraSpec = loadSpec()
): CorpusValidationReport {
  const issues: ValidationIssue[] = [];
  const known = normalizedTokenSet(spec);
  const plan = readSpecYaml<CorpusPlanSpec>("corpus-plan.yaml");
  const domains = readSpecYaml<DomainsSpec>("domains.yaml");
  const validTracks = new Set(plan.corpus_tracks.map((track) => track.id));
  const validDomains = new Set(domains.domains.map((domain) => domain.id));
  const ids = new Set<string>();
  const uniqueTerms = new Set<string>();

  for (const item of corpus.items) {
    if (ids.has(item.id)) {
      addIssue(issues, "error", "duplicate-corpus-id", `Corpus item '${item.id}' appears more than once.`);
    }
    ids.add(item.id);

    if (!validTracks.has(item.track)) {
      addIssue(issues, "error", "unknown-corpus-track", `${item.id} uses unknown track '${item.track}'.`);
    }

    for (const domain of item.domain_tags) {
      if (!validDomains.has(domain)) {
        addIssue(issues, "error", "unknown-corpus-domain", `${item.id} uses unknown domain tag '${domain}'.`);
      }
    }

    for (const field of ["english", "ethra", "literal", "notes", "register"] as const) {
      if (!item[field]?.trim()) {
        addIssue(issues, "error", "missing-corpus-field", `${item.id} is missing '${field}'.`);
      }
    }

    const tokens = tokenizeEthra(item.ethra);
    for (const token of tokens) {
      if (!isKnownToken(token, known)) {
        addIssue(issues, "error", "unknown-corpus-token", `${item.id} uses unknown Ethra token '${token}'.`);
      }
    }

    for (const term of item.terms) {
      const normalized = term.toLowerCase();
      uniqueTerms.add(normalized);
      if (!isKnownToken(normalized, known)) {
        addIssue(issues, "error", "unknown-corpus-term", `${item.id} lists unknown term '${term}'.`);
      }
    }
  }

  const trackCount = new Set(corpus.items.map((item) => item.track)).size;
  const domainCount = new Set(corpus.items.flatMap((item) => item.domain_tags)).size;
  const errors = issues.filter((issue) => issue.severity === "error");
  const warnings = issues.filter((issue) => issue.severity === "warning");

  return {
    valid: errors.length === 0,
    issueCount: issues.length,
    errors,
    warnings,
    stats: {
      items: corpus.items.length,
      tracks: trackCount,
      domains: domainCount,
      uniqueTerms: uniqueTerms.size
    }
  };
}

export function validateCompounds(
  compounds: CompoundsSpec = readSpecYaml<CompoundsSpec>("compounds.yaml"),
  spec: EthraSpec = loadSpec()
): CompoundsValidationReport {
  const issues: ValidationIssue[] = [];
  const known = normalizedTokenSet(spec);
  const domains = readSpecYaml<DomainsSpec>("domains.yaml");
  const validDomains = new Set(domains.domains.map((domain) => domain.id));
  const validStatuses = new Set(["candidate", "provisional", "accepted", "deprecated", "historical"]);
  const ids = new Set<string>();
  const words = new Set<string>();
  const registers = new Set<string>();
  const usedDomains = new Set<string>();

  for (const term of compounds.terms) {
    known.add(term.word.toLowerCase());
  }

  for (const term of compounds.terms) {
    const word = term.word.toLowerCase();
    registers.add(term.register);

    if (ids.has(term.id)) {
      addIssue(issues, "error", "duplicate-compound-id", `Compound '${term.id}' appears more than once.`);
    }
    ids.add(term.id);

    if (words.has(word)) {
      addIssue(issues, "error", "duplicate-compound-word", `Compound word '${term.word}' appears more than once.`);
    }
    words.add(word);

    if (!validStatuses.has(term.status)) {
      addIssue(issues, "error", "invalid-compound-status", `${term.id} has invalid status '${term.status}'.`);
    }

    if (term.components.length < 2) {
      addIssue(issues, "error", "compound-too-short", `${term.id} must have at least two components.`);
    }

    const expectedWord = term.components.join("-").toLowerCase();
    if (word !== expectedWord) {
      addIssue(issues, "error", "compound-word-mismatch", `${term.id} word '${term.word}' should be '${expectedWord}' from components.`);
    }

    if (!term.components.includes(term.head)) {
      addIssue(issues, "error", "compound-head-missing", `${term.id} head '${term.head}' is not one of its components.`);
    }

    const phonology = validateWord(term.word);
    if (!phonology.valid) {
      addIssue(issues, "error", "compound-phonology", `${term.id} '${term.word}' fails phonology: ${phonology.errors.join("; ")}.`);
    }

    for (const domain of term.domain_tags) {
      usedDomains.add(domain);
      if (!validDomains.has(domain)) {
        addIssue(issues, "error", "unknown-compound-domain", `${term.id} uses unknown domain tag '${domain}'.`);
      }
    }

    for (const component of term.components) {
      if (!isKnownToken(component.toLowerCase(), known)) {
        addIssue(issues, "error", "unknown-compound-component", `${term.id} uses unknown component '${component}'.`);
      }
    }

    for (const token of tokenizeEthra(term.example)) {
      if (!isKnownToken(token, known)) {
        addIssue(issues, "error", "unknown-compound-example-token", `${term.id} example uses unknown token '${token}'.`);
      }
    }
  }

  const errors = issues.filter((issue) => issue.severity === "error");
  const warnings = issues.filter((issue) => issue.severity === "warning");

  return {
    valid: errors.length === 0,
    issueCount: issues.length,
    errors,
    warnings,
    stats: {
      terms: compounds.terms.length,
      accepted: compounds.terms.filter((term) => term.status === "accepted").length,
      domains: usedDomains.size,
      registers: registers.size
    }
  };
}
