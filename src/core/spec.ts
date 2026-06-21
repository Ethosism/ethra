import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";
import type { EthraSpec, LexiconEntry } from "./types";

let cache: EthraSpec | undefined;

export function specDir(): string {
  return process.env.ETHRA_SPEC_DIR ?? path.resolve(__dirname, "../../spec");
}

export function readSpecYaml<T>(filename: string): T {
  const filePath = path.join(specDir(), filename);
  return YAML.parse(fs.readFileSync(filePath, "utf8")) as T;
}

export function loadSpec(): EthraSpec {
  if (!cache) {
    cache = {
      phonology: readSpecYaml("phonology.yaml"),
      roots: readSpecYaml("roots.yaml"),
      particles: readSpecYaml("particles.yaml"),
      pronouns: readSpecYaml("pronouns.yaml"),
      grammar: readSpecYaml("grammar.yaml"),
      lexicon: readSpecYaml("lexicon.yaml"),
      examples: readSpecYaml("examples.yaml")
    };
  }
  return cache;
}

export function resetSpecCache(): void {
  cache = undefined;
}

export function flattenLexicon(spec = loadSpec()): LexiconEntry[] {
  return Object.entries(spec.lexicon.categories).flatMap(([category, entries]) =>
    entries.map((entry) => ({ ...entry, category }))
  );
}
