import { validateWord } from "../core/phonology";

export interface CompoundResult {
  word: string;
  meaning: string;
  morphology: string;
  notes: string;
}

export function createCompound(words: string[], gloss?: string): CompoundResult {
  const clean = words.map((word) => word.trim().toLowerCase()).filter(Boolean);

  if (clean.length < 2) {
    throw new Error("A compound needs at least two words.");
  }

  const invalid = clean
    .map((word) => ({ word, result: validateWord(word) }))
    .filter(({ result }) => !result.valid);

  if (invalid.length) {
    const details = invalid.map(({ word, result }) => `${word}: ${result.errors.join("; ")}`).join(" | ");
    throw new Error(`Invalid compound member: ${details}`);
  }

  return {
    word: clean.join("-"),
    meaning: gloss ?? clean.join(" + "),
    morphology: clean.join(" + "),
    notes: "Ethra compounds keep their parts visible. The final member carries the grammatical head unless a civic definition says otherwise."
  };
}
