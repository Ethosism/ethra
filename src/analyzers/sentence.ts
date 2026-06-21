import { validateWord } from "../core/phonology";
import { flattenLexicon, loadSpec, readSpecYaml } from "../core/spec";
import type { CompoundTerm, LexiconEntry, ParticleSpec, PronounSpec } from "../core/types";

type ParseSeverity = "error" | "warning" | "notice";
type ClausePattern = "canonical-svo" | "copular" | "imperative" | "question" | "fragment";

interface SyntaxSpec {
  version: string;
  purpose: string;
  principle: string;
  particle_chain: {
    pre_predicate_types: string[];
    register_types: string[];
    scope_types: string[];
    complement_prepositions: string[];
  };
  parser_limits: string[];
  cultural_notes: string[];
}

interface KnownMaps {
  lexicon: Map<string, LexiconEntry[]>;
  particles: Map<string, ParticleSpec>;
  pronouns: Map<string, PronounSpec>;
  compounds: Map<string, CompoundTerm>;
  words: Set<string>;
}

export interface ParseIssue {
  severity: ParseSeverity;
  code: string;
  message: string;
  token?: string;
}

export interface ParseToken {
  index: number;
  raw: string;
  normalized: string;
  valid_phonology: boolean;
  errors: string[];
  known: boolean;
  classes: string[];
}

export interface ParseSpan {
  role: string;
  start: number;
  end: number;
  text: string;
  tokens: string[];
}

export interface ParsedClause {
  pattern: ClausePattern;
  sentence_mood: ParseSpan[];
  register_markers: ParseSpan[];
  subject?: ParseSpan;
  address?: ParseSpan;
  particle_chain: ParseSpan[];
  predicate?: ParseSpan;
  object?: ParseSpan;
  complements: ParseSpan[];
  scopes: ParseSpan[];
}

export interface SentenceParseReport {
  text: string;
  valid: boolean;
  confidence: number;
  tokens: ParseToken[];
  clause: ParsedClause;
  issues: ParseIssue[];
  parser_notes: string[];
  cultural_notes: string[];
}

function syntaxSpec(): SyntaxSpec {
  return readSpecYaml<SyntaxSpec>("syntax.yaml");
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

function tokenClasses(word: string, maps: KnownMaps): string[] {
  const classes: string[] = [];
  const particle = maps.particles.get(word);
  const pronoun = maps.pronouns.get(word);
  const compound = maps.compounds.get(word);

  if (particle) classes.push(`particle:${particle.type}`);
  if (pronoun) classes.push(`pronoun:${pronoun.person}:${pronoun.stance}`);
  if (compound) classes.push(`compound:${compound.register}`);

  for (const entry of maps.lexicon.get(word) ?? []) {
    classes.push(`lexicon:${entry.part_of_speech}:${entry.category ?? "uncategorized"}`);
  }

  if (!maps.words.has(word) && word.includes("-")) {
    const segments = word.split("-");
    if (segments.every((segment) => maps.words.has(segment))) {
      classes.push("transparent-compound");
    }
  }

  return unique(classes);
}

function span(tokens: ParseToken[], role: string, start: number, end: number): ParseSpan | undefined {
  if (start < 0 || end <= start || start >= tokens.length) return undefined;
  const boundedEnd = Math.min(end, tokens.length);
  const selected = tokens.slice(start, boundedEnd);
  return {
    role,
    start,
    end: boundedEnd,
    text: selected.map((token) => token.normalized).join(" "),
    tokens: selected.map((token) => token.normalized)
  };
}

function particleType(token: ParseToken, maps: KnownMaps): string | undefined {
  return maps.particles.get(token.normalized)?.type;
}

function isParticleType(token: ParseToken | undefined, maps: KnownMaps, types: string[]): boolean {
  if (!token) return false;
  const type = particleType(token, maps);
  return Boolean(type && types.includes(type));
}

function isWord(token: ParseToken | undefined, word: string): boolean {
  return token?.normalized === word;
}

function isSecondPerson(token: ParseToken | undefined, maps: KnownMaps): boolean {
  if (!token) return false;
  const pronoun = maps.pronouns.get(token.normalized);
  return pronoun?.person === "second";
}

function parseTail(
  tokens: ParseToken[],
  maps: KnownMaps,
  rules: SyntaxSpec,
  start: number
): Pick<ParsedClause, "object" | "complements" | "scopes"> {
  const complements: ParseSpan[] = [];
  const scopes: ParseSpan[] = [];
  const objectIndices: number[] = [];
  let cursor = start;

  while (cursor < tokens.length) {
    const token = tokens[cursor];
    if (isParticleType(token, maps, rules.particle_chain.scope_types)) {
      const scope = span(tokens, "scope", cursor, cursor + 1);
      if (scope) scopes.push(scope);
      cursor += 1;
      continue;
    }

    if (rules.particle_chain.complement_prepositions.includes(token.normalized) && cursor + 1 < tokens.length) {
      const complement = span(tokens, "complement", cursor, cursor + 2);
      if (complement) complements.push(complement);
      cursor += 2;
      continue;
    }

    objectIndices.push(cursor);
    cursor += 1;
  }

  const object =
    objectIndices.length > 0
      ? span(tokens, "object", Math.min(...objectIndices), Math.max(...objectIndices) + 1)
      : undefined;

  return { object, complements, scopes };
}

function issueCounts(issues: ParseIssue[]): Record<ParseSeverity, number> {
  return {
    error: issues.filter((issue) => issue.severity === "error").length,
    warning: issues.filter((issue) => issue.severity === "warning").length,
    notice: issues.filter((issue) => issue.severity === "notice").length
  };
}

function confidence(pattern: ClausePattern, issues: ParseIssue[]): number {
  const counts = issueCounts(issues);
  const base = pattern === "fragment" ? 0.35 : 0.92;
  return Math.max(0, Number((base - counts.error * 0.25 - counts.warning * 0.08 - counts.notice * 0.03).toFixed(2)));
}

export function parseSentence(text: string): SentenceParseReport {
  const rules = syntaxSpec();
  const maps = buildKnownMaps();
  const rawTokens = text.split(/\s+/).map((token) => token.trim()).filter(Boolean);
  const issues: ParseIssue[] = [];

  if (rawTokens.length === 0) {
    issues.push({ severity: "error", code: "empty-text", message: "No Ethra text was provided." });
  }

  const tokens: ParseToken[] = rawTokens.map((raw, index) => {
    const normalized = normalizeToken(raw);
    const validation = validateWord(normalized);
    const classes = normalized ? tokenClasses(normalized, maps) : [];
    return {
      index,
      raw,
      normalized,
      valid_phonology: validation.valid,
      errors: validation.errors,
      known: classes.length > 0,
      classes
    };
  });

  for (const token of tokens) {
    if (!token.normalized) {
      issues.push({ severity: "error", code: "empty-token", message: "Token has no readable Ethra letters.", token: token.raw });
      continue;
    }
    if (!token.valid_phonology) {
      issues.push({ severity: "error", code: "phonology", message: token.errors.join("; "), token: token.raw });
    } else if (!token.known) {
      issues.push({
        severity: "warning",
        code: "unknown-token",
        message: `'${token.normalized}' is phonologically possible but not accepted or transparently analyzable.`,
        token: token.raw
      });
    }
  }

  const clause: ParsedClause = {
    pattern: "fragment",
    sentence_mood: [],
    register_markers: [],
    particle_chain: [],
    complements: [],
    scopes: []
  };

  let cursor = 0;
  while (isParticleType(tokens[cursor], maps, rules.particle_chain.register_types)) {
    const marker = span(tokens, "register", cursor, cursor + 1);
    if (marker) clause.register_markers.push(marker);
    cursor += 1;
  }

  if (isWord(tokens[cursor], "ya")) {
    const mood = span(tokens, "sentence-mood", cursor, cursor + 1);
    if (mood) clause.sentence_mood.push(mood);
    clause.pattern = "question";
    cursor += 1;
  }

  if (isWord(tokens[cursor], "ke")) {
    const mood = span(tokens, "sentence-mood", cursor, cursor + 1);
    if (mood) clause.sentence_mood.push(mood);
    clause.pattern = "imperative";
    cursor += 1;

    if (isSecondPerson(tokens[cursor], maps)) {
      clause.address = span(tokens, "address", cursor, cursor + 1);
      cursor += 1;
    }

    clause.predicate = span(tokens, "predicate", cursor, cursor + 1);
    if (clause.predicate) cursor += 1;
    const tail = parseTail(tokens, maps, rules, cursor);
    clause.object = tail.object;
    clause.complements = tail.complements;
    clause.scopes = tail.scopes;
  } else if (cursor < tokens.length) {
    const subjectStart = cursor;
    cursor += 1;

    while (isWord(tokens[cursor], "en") && cursor + 1 < tokens.length) {
      cursor += 2;
    }

    clause.subject = span(tokens, "subject", subjectStart, cursor);

    while (
      cursor < tokens.length &&
      !isWord(tokens[cursor], "e") &&
      isParticleType(tokens[cursor], maps, rules.particle_chain.pre_predicate_types)
    ) {
      const particle = span(tokens, "particle", cursor, cursor + 1);
      if (particle) clause.particle_chain.push(particle);
      cursor += 1;
    }

    if (isWord(tokens[cursor], "e")) {
      clause.pattern = clause.pattern === "question" ? "question" : "copular";
      clause.predicate = span(tokens, "predicate", cursor, cursor + 1);
      cursor += 1;
      const complement = span(tokens, "complement", cursor, tokens.length);
      clause.complements = complement ? [complement] : [];
    } else if (cursor < tokens.length) {
      if (clause.pattern === "fragment") clause.pattern = "canonical-svo";
      let predicateEnd = cursor + 1;
      if (isWord(tokens[predicateEnd], "se") && (predicateEnd + 1 === tokens.length || isParticleType(tokens[predicateEnd + 1], maps, rules.particle_chain.scope_types))) {
        predicateEnd += 1;
      }
      clause.predicate = span(tokens, "predicate", cursor, predicateEnd);
      cursor = predicateEnd;
      const tail = parseTail(tokens, maps, rules, cursor);
      clause.object = tail.object;
      clause.complements = tail.complements;
      clause.scopes = tail.scopes;
    }
  }

  if (!clause.subject && clause.pattern !== "imperative" && tokens.length > 0) {
    issues.push({ severity: "warning", code: "subject-missing", message: "No subject could be identified." });
  }

  if (!clause.predicate && tokens.length > 0) {
    issues.push({ severity: "warning", code: "predicate-missing", message: "No predicate could be identified." });
  }

  return {
    text,
    valid: !issues.some((issue) => issue.severity === "error"),
    confidence: confidence(clause.pattern, issues),
    tokens,
    clause,
    issues,
    parser_notes: [rules.principle, ...rules.parser_limits],
    cultural_notes: rules.cultural_notes
  };
}
