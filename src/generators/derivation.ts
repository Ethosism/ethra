import { loadSpec } from "../core/spec";
import type { RootSpec } from "../core/types";

const ROOT_VOWELS = new Set(["A", "E", "I", "O", "U"]);

export interface DerivationResult {
  word: string;
  meaning: string;
  morphology: string;
  root: RootSpec;
  pattern: string;
  culturalNotes: string;
}

export function canonicalRoot(input: string): string {
  return input
    .toUpperCase()
    .replace(/[^A-Z]/g, "")
    .split("")
    .filter((char) => !ROOT_VOWELS.has(char))
    .join("");
}

export function findRoot(input: string): RootSpec | undefined {
  const wanted = canonicalRoot(input);
  return loadSpec().roots.roots.find((root) => {
    const ids = [root.id, root.form, ...(root.aliases ?? [])].map(canonicalRoot);
    return ids.includes(wanted);
  });
}

const patternAliases: Record<string, string> = {
  "root-verb": "verb",
  "verb": "verb",
  "noun": "noun",
  "root-noun": "noun",
  "adjective": "adjective",
  "agent": "agent",
  "object": "object",
  "ritual": "ritual",
  "ritual-poetic": "ritual",
  "civic": "civic",
  "civic-legal": "civic",
  "intimate": "intimate",
  "intimate-emotional": "intimate",
  "intimate-imperative": "intimate",
  "process": "process",
  "practice": "process",
  "ongoing": "process",
  "instrument": "instrument",
  "tool": "instrument",
  "place": "place",
  "field": "place",
  "doctrine": "doctrine",
  "theory": "doctrine",
  "collective": "collective",
  "guild": "collective",
  "lack": "lack",
  "absence": "lack",
  "negative": "lack",
  "category": "category",
  "class": "category",
  "discipline": "discipline",
  "training": "discipline",
  "office": "office",
  "mandate": "office",
  "record": "record",
  "archive": "record",
  "right": "right",
  "legal-right": "right",
  "vow": "vow",
  "oath": "vow"
};

export function deriveWord(rootInput: string, patternInput: string): DerivationResult {
  const root = findRoot(rootInput);
  if (!root) {
    throw new Error(`Unknown root '${rootInput}'`);
  }

  const pattern = patternAliases[patternInput] ?? patternInput;
  const derived = root.derived[pattern];

  if (!derived) {
    throw new Error(`Unknown pattern '${patternInput}'. Try: ${Object.keys(root.derived).join(", ")}`);
  }

  const imperativeNote =
    patternInput === "intimate-imperative"
      ? "Use with ke before the word for an explicit plea or command: ke " + derived.word + "."
      : "Ethra derivation keeps the semantic family visible inside the word.";

  return {
    word: derived.word,
    meaning: derived.meaning,
    morphology: `${root.id} root + ${derived.role} pattern`,
    root,
    pattern,
    culturalNotes: imperativeNote
  };
}

export function generateRoot(field: string): { root: string; rationale: string; sample: string } {
  const consonants = [
    ..."bcdfghjklmnprstvwxyz".split("")
  ];
  const cleaned = field.toLowerCase().replace(/[^a-z]/g, "");
  const picked: string[] = [];

  for (const char of cleaned) {
    if (consonants.includes(char) && !picked.includes(char)) {
      picked.push(char);
    }
    if (picked.length === 3) break;
  }

  while (picked.length < 2) {
    picked.push(consonants[(cleaned.length + picked.length * 5) % consonants.length]);
  }

  const root = picked.join("").toUpperCase();
  const sample = picked.map((c, index) => c + (index === picked.length - 1 ? "" : "a")).join("");
  return {
    root,
    sample,
    rationale: `Candidate root from prominent consonants in '${field}'. Add it to spec/roots.yaml before treating it as canonical.`
  };
}
