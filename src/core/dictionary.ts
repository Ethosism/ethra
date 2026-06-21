import { flattenLexicon, loadSpec, readSpecYaml } from "./spec";
import type { CompoundTerm, CorpusItem, CorpusSpec, LexiconEntry, ParticleSpec, PronounSpec, RootSpec } from "./types";

type DictionarySource = "lexicon" | "particle" | "pronoun" | "compound";

export interface DictionaryEntry {
  id: string;
  word: string;
  source: DictionarySource;
  pronunciation: string;
  part_of_speech: string;
  root?: string;
  root_family?: {
    id: string;
    category: string;
    core: string;
    semantic_field: string;
  };
  pattern?: string;
  register: string;
  domain_tags: string[];
  meanings: string[];
  literal_etymology: string;
  examples: string[];
  corpus: {
    frequency: number;
    frequency_band: "unattested" | "observed" | "active" | "common";
    item_ids: string[];
    tracks: string[];
    registers: string[];
  };
  lifecycle_status: "accepted" | "candidate" | "provisional" | "deprecated" | "historical";
  notes: string[];
}

export interface DictionaryLookupOptions {
  query: string;
  limit?: number;
  exact?: boolean;
}

export interface DictionaryLookupMatch {
  score: number;
  matched_fields: string[];
  entry: DictionaryEntry;
}

export interface DictionaryLookupReport {
  purpose: string;
  query: {
    text: string;
    normalized: string;
    limit: number;
    exact: boolean;
  };
  total_matches: number;
  returned_matches: number;
  matches: DictionaryLookupMatch[];
}

export interface DictionaryStats {
  purpose: string;
  schema_version: string;
  total_entries: number;
  source_counts: Record<DictionarySource, number>;
  root_families: number;
  corpus_attested_entries: number;
  unattested_entries: number;
  domain_counts: Record<string, number>;
  register_counts: Record<string, number>;
  top_corpus_entries: Array<Pick<DictionaryEntry, "word" | "source" | "meanings"> & { frequency: number; item_ids: string[] }>;
}

interface CorpusEvidence {
  frequency: number;
  item_ids: Set<string>;
  tracks: Set<string>;
  registers: Set<string>;
}

interface DerivedMatch {
  root: RootSpec;
  pattern: string;
}

const categoryDomainMap: Record<string, string[]> = {
  "Body": ["body-health"],
  "Building/making": ["daily-life", "technology-software", "art-beauty", "economics-provision", "travel-place"],
  "Conflict/repair": ["conflict-security", "law-governance"],
  "Emotion": ["emotion-psychology"],
  "Family": ["family-kinship"],
  "Future/civilization": ["history-memory", "philosophy-metaphysics", "law-governance"],
  "Law/civic life": ["law-governance", "economics-provision", "travel-place"],
  "Love/intimacy": ["emotion-psychology", "family-kinship"],
  "Mind": ["education-training", "ai-cognition", "philosophy-metaphysics", "science-math", "travel-place"],
  "Moral agency": ["law-governance", "philosophy-metaphysics"],
  "Nature": ["nature-ecology", "travel-place", "science-math"],
  "Particles": ["daily-life"],
  "Pronouns": ["daily-life", "family-kinship"],
  "Ritual/poetry": ["ritual-spiritual", "art-beauty"],
  "Seeing/knowing": ["science-math", "philosophy-metaphysics", "emotion-psychology"],
  "Speech": ["media-communication", "law-governance", "ritual-spiritual", "art-beauty"],
  "Technology": ["technology-software", "ai-cognition", "media-communication"],
  "Time": ["history-memory", "travel-place"]
};

function normalizeToken(token: string): string {
  return token.toLowerCase().replace(/^[^a-z-]+|[^a-z-]+$/g, "");
}

function unique(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

function schemaVersion(): string {
  return readSpecYaml<{ version: string }>("dictionary-schema.yaml").version;
}

function corpusSpec(): CorpusSpec {
  return readSpecYaml<CorpusSpec>("corpus.yaml");
}

function compoundsSpec(): { terms: CompoundTerm[] } {
  return readSpecYaml<{ terms: CompoundTerm[] }>("compounds.yaml");
}

function corpusEvidence(): Map<string, CorpusEvidence> {
  const evidence = new Map<string, CorpusEvidence>();
  const add = (word: string, item: CorpusItem) => {
    const normalized = normalizeToken(word);
    if (!normalized) return;
    const record = evidence.get(normalized) ?? {
      frequency: 0,
      item_ids: new Set<string>(),
      tracks: new Set<string>(),
      registers: new Set<string>()
    };
    record.frequency += 1;
    record.item_ids.add(item.id);
    record.tracks.add(item.track);
    record.registers.add(item.register);
    evidence.set(normalized, record);
  };

  for (const item of corpusSpec().items) {
    for (const token of item.ethra.split(/\s+/)) add(token, item);
    for (const term of item.terms) add(term, item);
  }

  return evidence;
}

function band(frequency: number): DictionaryEntry["corpus"]["frequency_band"] {
  if (frequency >= 10) return "common";
  if (frequency >= 3) return "active";
  if (frequency >= 1) return "observed";
  return "unattested";
}

function evidenceFor(word: string, evidence: Map<string, CorpusEvidence>): DictionaryEntry["corpus"] {
  const record = evidence.get(word);
  const frequency = record?.frequency ?? 0;
  return {
    frequency,
    frequency_band: band(frequency),
    item_ids: [...(record?.item_ids ?? [])].sort((a, b) => a.localeCompare(b)),
    tracks: [...(record?.tracks ?? [])].sort((a, b) => a.localeCompare(b)),
    registers: [...(record?.registers ?? [])].sort((a, b) => a.localeCompare(b))
  };
}

function derivedIndex(roots: RootSpec[]): Map<string, DerivedMatch[]> {
  const index = new Map<string, DerivedMatch[]>();
  for (const root of roots) {
    for (const [pattern, derived] of Object.entries(root.derived)) {
      const matches = index.get(derived.word) ?? [];
      matches.push({ root, pattern });
      index.set(derived.word, matches);
    }
  }
  return index;
}

function rootFamily(root?: RootSpec): DictionaryEntry["root_family"] {
  if (!root) return undefined;
  return {
    id: root.id,
    category: root.category,
    core: root.core,
    semantic_field: root.semantic_field
  };
}

function registerFromPattern(pattern?: string, partOfSpeech?: string, category?: string): string {
  if (pattern === "ritual") return "ritual";
  if (pattern === "civic" || pattern === "right" || partOfSpeech?.includes("legal")) return "civic";
  if (pattern === "intimate") return "intimate";
  if (["process", "instrument", "record", "category", "discipline"].includes(pattern ?? "")) return "technical";
  if (category === "Particles") return "grammar";
  if (category === "Pronouns") return "relational";
  return "plain";
}

function lexiconEntry(
  entry: LexiconEntry,
  index: number,
  derived: Map<string, DerivedMatch[]>,
  evidence: Map<string, CorpusEvidence>
): DictionaryEntry {
  const match = derived.get(entry.word)?.[0];
  const root = match?.root;
  return {
    id: `lexicon:${entry.word}:${index}`,
    word: entry.word,
    source: "lexicon",
    pronunciation: entry.pronunciation,
    part_of_speech: entry.part_of_speech,
    root: entry.root,
    root_family: rootFamily(root),
    pattern: match?.pattern,
    register: registerFromPattern(match?.pattern, entry.part_of_speech, entry.category),
    domain_tags: categoryDomainMap[entry.category ?? ""] ?? [],
    meanings: [entry.meaning],
    literal_etymology: entry.literal_etymology,
    examples: [entry.example_sentence],
    corpus: evidenceFor(entry.word, evidence),
    lifecycle_status: "accepted",
    notes: ["Generated accepted lexicon entry from the current root-pattern system."]
  };
}

function particleEntry(particle: ParticleSpec, index: number, evidence: Map<string, CorpusEvidence>): DictionaryEntry {
  return {
    id: `particle:${particle.word}:${index}`,
    word: particle.word,
    source: "particle",
    pronunciation: particle.pronunciation,
    part_of_speech: `particle:${particle.type}`,
    register: particle.type,
    domain_tags: particle.type === "moral agency" || particle.type === "scope" ? ["philosophy-metaphysics", "law-governance"] : ["daily-life"],
    meanings: [particle.meaning],
    literal_etymology: particle.usage,
    examples: [particle.example],
    corpus: evidenceFor(particle.word, evidence),
    lifecycle_status: "accepted",
    notes: ["Closed-class grammar or moral-grammar item."]
  };
}

function pronounEntry(pronoun: PronounSpec, index: number, evidence: Map<string, CorpusEvidence>): DictionaryEntry {
  return {
    id: `pronoun:${pronoun.word}:${index}`,
    word: pronoun.word,
    source: "pronoun",
    pronunciation: pronoun.pronunciation,
    part_of_speech: `pronoun:${pronoun.person}:${pronoun.number}`,
    register: "relational",
    domain_tags: pronoun.stance.includes("sacred") ? ["ritual-spiritual"] : ["daily-life", "family-kinship"],
    meanings: [pronoun.meaning],
    literal_etymology: pronoun.use,
    examples: [pronoun.example],
    corpus: evidenceFor(pronoun.word, evidence),
    lifecycle_status: "accepted",
    notes: [`Relational stance: ${pronoun.stance}.`]
  };
}

function compoundEntry(compound: CompoundTerm, index: number, evidence: Map<string, CorpusEvidence>): DictionaryEntry {
  return {
    id: `compound:${compound.word}:${index}`,
    word: compound.word,
    source: "compound",
    pronunciation: compound.pronunciation,
    part_of_speech: compound.part_of_speech,
    register: compound.register,
    domain_tags: compound.domain_tags,
    meanings: [compound.meaning],
    literal_etymology: compound.literal,
    examples: [compound.example],
    corpus: evidenceFor(compound.word, evidence),
    lifecycle_status: compound.status,
    notes: [compound.notes, `Components: ${compound.components.join(" + ")}.`, `Head: ${compound.head}.`]
  };
}

export function buildDictionary(): DictionaryEntry[] {
  const spec = loadSpec();
  const evidence = corpusEvidence();
  const derived = derivedIndex(spec.roots.roots);
  const lexiconEntries = flattenLexicon(spec).map((entry, index) => lexiconEntry(entry, index + 1, derived, evidence));
  const particles = spec.particles.particles.map((particle, index) => particleEntry(particle, index + 1, evidence));
  const pronouns = spec.pronouns.pronouns.map((pronoun, index) => pronounEntry(pronoun, index + 1, evidence));
  const compounds = compoundsSpec().terms.map((compound, index) => compoundEntry(compound, index + 1, evidence));
  return [...lexiconEntries, ...particles, ...pronouns, ...compounds];
}

function scoreEntry(entry: DictionaryEntry, query: string, exact: boolean): DictionaryLookupMatch | undefined {
  const fields = new Set<string>();
  let score = 0;

  const word = entry.word.toLowerCase();
  if (word === query) {
    fields.add("word");
    score += 100;
  } else if (!exact && word.startsWith(query)) {
    fields.add("word_prefix");
    score += 80;
  } else if (!exact && word.includes(query)) {
    fields.add("word_substring");
    score += 65;
  }

  if (!exact) {
    if (entry.root?.toLowerCase() === query) {
      fields.add("root");
      score += 85;
    }
    if (entry.meanings.some((meaning) => meaning.toLowerCase().includes(query))) {
      fields.add("meaning");
      score += 55;
    }
    if (entry.literal_etymology.toLowerCase().includes(query)) {
      fields.add("literal_etymology");
      score += 40;
    }
    if (entry.root_family?.semantic_field.toLowerCase().includes(query) || entry.root_family?.core.toLowerCase().includes(query)) {
      fields.add("root_family");
      score += 45;
    }
    if (entry.domain_tags.some((domain) => domain.includes(query))) {
      fields.add("domain");
      score += 35;
    }
  }

  if (score === 0) return undefined;
  score += Math.min(entry.corpus.frequency, 12);
  return { score, matched_fields: [...fields].sort((a, b) => a.localeCompare(b)), entry };
}

export function lookupDictionary(options: DictionaryLookupOptions): DictionaryLookupReport {
  const normalized = options.query.trim().toLowerCase();
  if (!normalized) {
    throw new Error("Dictionary lookup requires a non-empty query.");
  }

  const limit = Number.isFinite(options.limit) && options.limit !== undefined ? Math.max(0, Math.floor(options.limit)) : 20;
  const exact = Boolean(options.exact);
  const matches = buildDictionary()
    .map((entry) => scoreEntry(entry, normalized, exact))
    .filter((match): match is DictionaryLookupMatch => Boolean(match))
    .sort((a, b) => b.score - a.score || b.entry.corpus.frequency - a.entry.corpus.frequency || a.entry.word.localeCompare(b.entry.word));

  return {
    purpose: "Lookup accepted Ethra dictionary entries with root, register, meaning, example, and corpus evidence.",
    query: {
      text: options.query,
      normalized,
      limit,
      exact
    },
    total_matches: matches.length,
    returned_matches: Math.min(limit, matches.length),
    matches: matches.slice(0, limit)
  };
}

export function dictionaryStats(limit = 12): DictionaryStats {
  const entries = buildDictionary();
  const sourceCounts: Record<DictionarySource, number> = {
    lexicon: 0,
    particle: 0,
    pronoun: 0,
    compound: 0
  };
  const domainCounts = new Map<string, number>();
  const registerCounts = new Map<string, number>();

  for (const entry of entries) {
    sourceCounts[entry.source] += 1;
    for (const domain of entry.domain_tags) domainCounts.set(domain, (domainCounts.get(domain) ?? 0) + 1);
    registerCounts.set(entry.register, (registerCounts.get(entry.register) ?? 0) + 1);
  }

  const top = entries
    .filter((entry) => entry.corpus.frequency > 0)
    .sort((a, b) => b.corpus.frequency - a.corpus.frequency || a.word.localeCompare(b.word))
    .slice(0, Math.max(0, Math.floor(limit)))
    .map((entry) => ({
      word: entry.word,
      source: entry.source,
      meanings: entry.meanings,
      frequency: entry.corpus.frequency,
      item_ids: entry.corpus.item_ids.slice(0, 10)
    }));

  return {
    purpose: "Summarize Ethra's dictionary-scale lexical layer and corpus evidence.",
    schema_version: schemaVersion(),
    total_entries: entries.length,
    source_counts: sourceCounts,
    root_families: loadSpec().roots.roots.length,
    corpus_attested_entries: entries.filter((entry) => entry.corpus.frequency > 0).length,
    unattested_entries: entries.filter((entry) => entry.corpus.frequency === 0).length,
    domain_counts: Object.fromEntries([...domainCounts.entries()].sort((a, b) => a[0].localeCompare(b[0]))),
    register_counts: Object.fromEntries([...registerCounts.entries()].sort((a, b) => a[0].localeCompare(b[0]))),
    top_corpus_entries: top
  };
}
