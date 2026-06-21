export type RootForms = Record<string, string>;

export interface RootSpec {
  id: string;
  form: string;
  aliases?: string[];
  consonants: string[];
  category: string;
  semantic_field: string;
  core: string;
  forms: RootForms;
  derived: Record<string, {
    word: string;
    pronunciation: string;
    meaning: string;
    role: string;
  }>;
}

export interface ParticleSpec {
  word: string;
  pronunciation: string;
  type: string;
  meaning: string;
  usage: string;
  example: string;
}

export interface PronounSpec {
  word: string;
  pronunciation: string;
  person: string;
  number: string;
  stance: string;
  meaning: string;
  use: string;
  example: string;
}

export interface LexiconEntry {
  word: string;
  pronunciation: string;
  part_of_speech: string;
  root: string;
  meaning: string;
  literal_etymology: string;
  example_sentence: string;
  category?: string;
}

export interface ExampleTranslation {
  number: number;
  english: string;
  ethra: string;
  literal_translation: string;
  natural_translation: string;
  grammar_notes: string;
  cultural_notes: string;
}

export interface EthraSpec {
  phonology: any;
  roots: { roots: RootSpec[] };
  particles: { particles: ParticleSpec[] };
  pronouns: { pronouns: PronounSpec[] };
  grammar: any;
  lexicon: { categories: Record<string, LexiconEntry[]> };
  examples: { examples: ExampleTranslation[] };
}

export interface RoadmapMilestone {
  id: string;
  name: string;
  target_entries: number;
  target_roots: number;
  target_corpus_items: number;
  objectives: string[];
  exit_criteria: string[];
}

export interface RoadmapSpec {
  version: string;
  purpose: string;
  principle: string;
  current_state: {
    release: string;
    lexicon_entries: number;
    root_families: number;
    corpus_items: number;
    canonical_examples: number;
    cli_commands: string[];
  };
  scale_targets: Record<string, any>;
  milestones: RoadmapMilestone[];
  expansion_formula: Record<string, any>;
  non_goals: string[];
}

export interface DomainSpec {
  id: string;
  name: string;
  target_roots_v02: number;
  target_entries_v02: number;
  target_entries_v10: number;
  registers: string[];
  priority: string;
  required_fields: string[];
  moral_questions: string[];
}

export interface DomainsSpec {
  version: string;
  purpose: string;
  coverage_rule: string;
  domains: DomainSpec[];
}

export interface CorpusTrackSpec {
  id: string;
  name: string;
  target_items_v02: number;
  target_items_v10: number;
  artifact_path: string;
  item_shape: string[];
  examples: string[];
}

export interface CorpusPlanSpec {
  version: string;
  purpose: string;
  principle: string;
  corpus_tracks: CorpusTrackSpec[];
  quality_gates: string[];
  metrics: Record<string, string>;
}

export interface GovernanceSpec {
  version: string;
  purpose: string;
  authority_model: Record<string, any>;
  term_lifecycle: Array<Record<string, any>>;
  root_admission_rules: string[];
  compound_admission_rules: string[];
  borrowing_rules: string[];
  grammar_change_rules: string[];
  review_checklist: string[];
}

export interface CorpusItem {
  id: string;
  track: string;
  domain_tags: string[];
  register: string;
  english: string;
  ethra: string;
  literal: string;
  notes: string;
  terms: string[];
}

export interface CorpusSpec {
  version: string;
  purpose: string;
  items: CorpusItem[];
}
