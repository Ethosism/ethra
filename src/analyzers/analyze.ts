import { flattenLexicon, loadSpec } from "../core/spec";
import { validateWord } from "../core/phonology";

export interface Analysis {
  input: string;
  validPhonology: boolean;
  matches: any[];
  morphology: string[];
  errors: string[];
}

export function analyzeWord(input: string): Analysis {
  const word = input.trim().toLowerCase();
  const validation = validateWord(word);
  const spec = loadSpec();
  const lexiconMatches = flattenLexicon(spec).filter((entry) => entry.word === word);
  const particleMatches = spec.particles.particles.filter((entry) => entry.word === word);
  const pronounMatches = spec.pronouns.pronouns.filter((entry) => entry.word === word);
  const rootMatches = spec.roots.roots.flatMap((root) =>
    Object.entries(root.derived)
      .filter(([, value]) => value.word === word)
      .map(([pattern, value]) => ({ root: root.id, pattern, ...value }))
  );

  const morphology: string[] = [];
  if (word.includes("-")) {
    morphology.push(`compound/prefixed form: ${word.split("-").join(" + ")}`);
  }
  for (const match of rootMatches) {
    morphology.push(`${match.root} root in ${match.pattern} pattern`);
  }

  return {
    input: word,
    validPhonology: validation.valid,
    matches: [...lexiconMatches, ...particleMatches, ...pronounMatches, ...rootMatches],
    morphology,
    errors: validation.errors
  };
}
