import { loadSpec } from "./spec";
import type { ExampleTranslation } from "./types";

export function listExamples(): ExampleTranslation[] {
  return loadSpec().examples.examples;
}

export function findExample(query: string): ExampleTranslation | undefined {
  const examples = listExamples();
  const number = Number(query);
  if (Number.isInteger(number)) {
    return examples.find((example) => example.number === number);
  }
  const lowered = query.toLowerCase();
  return examples.find((example) => example.english.toLowerCase().includes(lowered));
}
