import { validateWord } from "../core/phonology";
import { flattenLexicon, loadSpec, readSpecYaml } from "../core/spec";
import type { CompoundTerm, LexiconEntry, ParticleSpec, PronounSpec } from "../core/types";

type IssueSeverity = "error" | "warning" | "notice";

interface StyleSpec {
  version: string;
  purpose: string;
  principle: string;
  register_expectations: Record<string, { markers: string[]; rationale: string }>;
  moral_scope: {
    agency_particles: string[];
    binding_particles: string[];
    scope_particles: string[];
    future_scope_particles: string[];
    witness_scope_particles: string[];
  };
  relational_address: {
    second_person_pronouns: string[];
    principle: string;
  };
  compound_guidance: {
    max_segments_before_notice: number;
    principle: string;
  };
}

export interface StyleCheckOptions {
  text: string;
  register?: string;
  requireMoralAgency?: boolean;
  requireScope?: boolean;
}

export interface StyleToken {
  raw: string;
  normalized: string;
  valid_phonology: boolean;
  errors: string[];
  known: boolean;
  roles: string[];
}

export interface StyleIssue {
  severity: IssueSeverity;
  code: string;
  message: string;
  token?: string;
  suggestion?: string;
}

export interface StyleCheckReport {
  text: string;
  requested_register?: string;
  valid: boolean;
  score: number;
  issue_counts: Record<IssueSeverity, number>;
  observed: {
    moral_particles: string[];
    binding_particles: string[];
    scope_particles: string[];
    register_markers: string[];
    pronouns: string[];
    second_person_pronouns: string[];
    transparent_compounds: string[];
  };
  tokens: StyleToken[];
  issues: StyleIssue[];
  suggestions: string[];
  cultural_notes: string[];
}

interface KnownMaps {
  lexicon: Map<string, LexiconEntry[]>;
  particles: Map<string, ParticleSpec>;
  pronouns: Map<string, PronounSpec>;
  compounds: Map<string, CompoundTerm>;
  words: Set<string>;
}

function styleSpec(): StyleSpec {
  return readSpecYaml<StyleSpec>("style.yaml");
}

function normalizeToken(token: string): string {
  return token.toLowerCase().replace(/^[^a-z-]+|[^a-z-]+$/g, "");
}

function unique(values: string[]): string[] {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}

function buildKnownMaps(): KnownMaps {
  const spec = loadSpec();
  const lexicon = new Map<string, LexiconEntry[]>();
  const particles = new Map<string, ParticleSpec>();
  const pronouns = new Map<string, PronounSpec>();
  const compounds = new Map<string, CompoundTerm>();
  const words = new Set<string>();

  for (const entry of flattenLexicon(spec)) {
    const entries = lexicon.get(entry.word) ?? [];
    entries.push(entry);
    lexicon.set(entry.word, entries);
    words.add(entry.word);
  }

  for (const particle of spec.particles.particles) {
    particles.set(particle.word, particle);
    words.add(particle.word);
  }

  for (const pronoun of spec.pronouns.pronouns) {
    pronouns.set(pronoun.word, pronoun);
    words.add(pronoun.word);
  }

  for (const compound of readSpecYaml<{ terms: CompoundTerm[] }>("compounds.yaml").terms) {
    compounds.set(compound.word, compound);
    words.add(compound.word);
  }

  return { lexicon, particles, pronouns, compounds, words };
}

function tokenRoles(word: string, maps: KnownMaps): string[] {
  const roles: string[] = [];
  const particle = maps.particles.get(word);
  const pronoun = maps.pronouns.get(word);
  const compound = maps.compounds.get(word);

  if (particle) roles.push(`particle:${particle.type}`);
  if (pronoun) roles.push(`pronoun:${pronoun.person}:${pronoun.stance}`);
  if (compound) roles.push(`compound:${compound.register}`);

  for (const entry of maps.lexicon.get(word) ?? []) {
    roles.push(`lexicon:${entry.part_of_speech}:${entry.category ?? "uncategorized"}`);
  }

  if (!maps.words.has(word) && word.includes("-")) {
    const segments = word.split("-");
    if (segments.every((segment) => maps.words.has(segment))) {
      roles.push("transparent-compound");
    }
  }

  return unique(roles);
}

function markerMatches(word: string, marker: string): boolean {
  if (marker.endsWith("-")) return word.startsWith(marker);
  if (marker.startsWith("-")) return word.endsWith(marker);
  return word === marker;
}

function observedRegisterMarkers(tokens: string[], spec: StyleSpec): string[] {
  const markers = new Set<string>();
  for (const word of tokens) {
    for (const expectation of Object.values(spec.register_expectations)) {
      for (const marker of expectation.markers) {
        if (markerMatches(word, marker)) markers.add(marker);
      }
    }
  }
  return [...markers].sort((a, b) => a.localeCompare(b));
}

function issueCounts(issues: StyleIssue[]): Record<IssueSeverity, number> {
  return {
    error: issues.filter((issue) => issue.severity === "error").length,
    warning: issues.filter((issue) => issue.severity === "warning").length,
    notice: issues.filter((issue) => issue.severity === "notice").length
  };
}

function score(counts: Record<IssueSeverity, number>): number {
  return Math.max(0, 100 - counts.error * 25 - counts.warning * 10 - counts.notice * 3);
}

export function styleCheck(options: StyleCheckOptions): StyleCheckReport {
  const rules = styleSpec();
  const maps = buildKnownMaps();
  const rawTokens = options.text.split(/\s+/).map((token) => token.trim()).filter(Boolean);
  const issues: StyleIssue[] = [];

  if (rawTokens.length === 0) {
    issues.push({
      severity: "error",
      code: "empty-text",
      message: "No Ethra text was provided.",
      suggestion: "Pass a sentence with --text."
    });
  }

  const tokens: StyleToken[] = rawTokens.map((raw) => {
    const normalized = normalizeToken(raw);
    const validation = validateWord(normalized);
    const roles = normalized ? tokenRoles(normalized, maps) : [];
    const known = roles.length > 0;
    return {
      raw,
      normalized,
      valid_phonology: validation.valid,
      errors: validation.errors,
      known,
      roles
    };
  });

  for (const token of tokens) {
    if (!token.normalized) {
      issues.push({
        severity: "error",
        code: "empty-token",
        message: "A token has no readable Ethra letters after punctuation is removed.",
        token: token.raw
      });
      continue;
    }
    if (!token.valid_phonology) {
      issues.push({
        severity: "error",
        code: "phonology",
        message: token.errors.join("; "),
        token: token.raw,
        suggestion: "Use only Ethra symbols and avoid consonant clusters inside a hyphen segment."
      });
    }
    if (token.valid_phonology && !token.known) {
      issues.push({
        severity: "warning",
        code: "unknown-token",
        message: `'${token.normalized}' is phonologically possible but not in the accepted lexicon, particles, pronouns, or compounds.`,
        token: token.raw,
        suggestion: "Use propose-term for candidate terminology or add corpus evidence before admission."
      });
    }
    if (token.normalized.split("-").length > rules.compound_guidance.max_segments_before_notice) {
      issues.push({
        severity: "notice",
        code: "long-compound",
        message: `'${token.normalized}' has many visible segments.`,
        token: token.raw,
        suggestion: "Consider whether a shorter compound or new root would preserve cadence better."
      });
    }
  }

  const words = tokens.map((token) => token.normalized).filter(Boolean);
  const moralParticles = words.filter((word) => rules.moral_scope.agency_particles.includes(word));
  const bindingParticles = words.filter((word) => rules.moral_scope.binding_particles.includes(word));
  const scopeParticles = words.filter((word) => rules.moral_scope.scope_particles.includes(word));
  const pronouns = words.filter((word) => maps.pronouns.has(word));
  const secondPersonPronouns = words.filter((word) => rules.relational_address.second_person_pronouns.includes(word));
  const registerMarkers = observedRegisterMarkers(words, rules);
  const transparentCompounds = tokens
    .filter((token) => token.roles.includes("transparent-compound"))
    .map((token) => token.normalized);

  const requestedRegister = options.register?.toLowerCase();
  if (requestedRegister) {
    const expectation = rules.register_expectations[requestedRegister];
    if (!expectation) {
      issues.push({
        severity: "warning",
        code: "unknown-register",
        message: `'${requestedRegister}' is not a configured style-check register.`,
        suggestion: `Known registers: ${Object.keys(rules.register_expectations).join(", ")}.`
      });
    } else if (!words.some((word) => expectation.markers.some((marker) => markerMatches(word, marker)))) {
      issues.push({
        severity: "warning",
        code: "register-marker-missing",
        message: `Requested ${requestedRegister} register, but no expected marker was found.`,
        suggestion: `Expected one of: ${expectation.markers.join(", ")}. ${expectation.rationale}`
      });
    }
  }

  const firstWord = words[0];
  const hasFirstPerson = firstWord ? maps.pronouns.get(firstWord)?.person === "first" : false;
  const hasActionScope = scopeParticles.length > 0;
  if (hasFirstPerson && moralParticles.length === 0) {
    issues.push({
      severity: options.requireMoralAgency ? "warning" : "notice",
      code: "moral-agency-implicit",
      message: "First-person speech has no explicit moral-agency particle.",
      suggestion: "Use kan, lun, wen, vel, cel, dom, dov, ten, mor, tor, or ren when agency is morally relevant."
    });
  }

  if (options.requireMoralAgency && moralParticles.length === 0 && !hasFirstPerson) {
    issues.push({
      severity: "warning",
      code: "required-moral-agency-missing",
      message: "This check requires explicit moral agency, but no moral-agency particle was found.",
      suggestion: "Add an agency particle or disable --require-moral-agency."
    });
  }

  if (bindingParticles.length > 0 && scopeParticles.length === 0) {
    issues.push({
      severity: options.requireScope ? "warning" : "notice",
      code: "scope-implicit",
      message: `Binding moral particle(s) ${unique(bindingParticles).join(", ")} appear without action scope.`,
      suggestion: "Add so-na, so-hen, so-lem, so-fer, so-rah, or so-zur when the scale of obligation matters."
    });
  }

  if (options.requireScope && !hasActionScope) {
    issues.push({
      severity: "warning",
      code: "required-scope-missing",
      message: "This check requires action scope, but no scope particle was found.",
      suggestion: "Add a scope marker such as so-na, so-hen, so-lem, so-fer, so-rah, or so-zur."
    });
  }

  if (words.includes("dov") && !words.some((word) => rules.moral_scope.witness_scope_particles.includes(word))) {
    issues.push({
      severity: "notice",
      code: "vow-witness-implicit",
      message: "A vow appears without an explicit truth or sacred witness scope.",
      suggestion: "Use so-rah or so-zur when the witness should be grammatically visible."
    });
  }

  if (words.includes("ke") && secondPersonPronouns.length === 0) {
    issues.push({
      severity: "notice",
      code: "address-implicit",
      message: "Imperative speech has an implicit addressee.",
      suggestion: "Add ti, ta, to, tu, te, za, hu, or tum when relational stance matters."
    });
  }

  if (requestedRegister === "ritual" && secondPersonPronouns.length > 0 && !secondPersonPronouns.includes("hu")) {
    issues.push({
      severity: "notice",
      code: "ritual-address-not-sacred",
      message: "Ritual register is requested, but the address pronoun is not sacred.",
      suggestion: "Use hu if the addressee is ultimate or sacred; keep the current pronoun if the ritual is addressed to a human witness."
    });
  }

  const counts = issueCounts(issues);
  const suggestions = unique(issues.map((issue) => issue.suggestion).filter((suggestion): suggestion is string => Boolean(suggestion)));

  return {
    text: options.text,
    requested_register: requestedRegister,
    valid: counts.error === 0,
    score: score(counts),
    issue_counts: counts,
    observed: {
      moral_particles: unique(moralParticles),
      binding_particles: unique(bindingParticles),
      scope_particles: unique(scopeParticles),
      register_markers: registerMarkers,
      pronouns: unique(pronouns),
      second_person_pronouns: unique(secondPersonPronouns),
      transparent_compounds: unique(transparentCompounds)
    },
    tokens,
    issues,
    suggestions,
    cultural_notes: [
      rules.principle,
      rules.relational_address.principle,
      rules.compound_guidance.principle
    ]
  };
}
