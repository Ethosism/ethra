import { loadSpec } from "./spec";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function inventory() {
  const phonology = loadSpec().phonology;
  return {
    vowels: new Set<string>(phonology.vowels.map((v: any) => v.symbol)),
    consonants: new Set<string>(phonology.consonants.map((c: any) => c.symbol))
  };
}

export function validateWord(word: string): ValidationResult {
  const { vowels, consonants } = inventory();
  const errors: string[] = [];
  const normalized = word.toLowerCase().trim();

  if (!normalized) {
    return { valid: false, errors: ["word is empty"] };
  }

  for (const segment of normalized.split("-")) {
    if (!segment) {
      errors.push("empty hyphen segment");
      continue;
    }

    let previousWasConsonant = false;
    let hasVowel = false;

    for (const char of segment) {
      const isVowel = vowels.has(char);
      const isConsonant = consonants.has(char);

      if (!isVowel && !isConsonant) {
        errors.push(`invalid symbol '${char}'`);
        previousWasConsonant = false;
        continue;
      }

      if (isVowel) {
        hasVowel = true;
        previousWasConsonant = false;
        continue;
      }

      if (previousWasConsonant) {
        errors.push(`consonant cluster in '${segment}'`);
      }
      previousWasConsonant = true;
    }

    if (!hasVowel) {
      errors.push(`segment '${segment}' has no vowel`);
    }
  }

  return { valid: errors.length === 0, errors };
}
