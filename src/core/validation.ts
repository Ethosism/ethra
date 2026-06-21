import { validateWord } from "./phonology";
import { flattenLexicon, loadSpec, readSpecYaml } from "./spec";
import type { CorpusSpec, DomainsSpec, EthraSpec, CorpusPlanSpec } from "./types";

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
