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
