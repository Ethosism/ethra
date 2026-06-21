const test = require("node:test");
const assert = require("node:assert/strict");

const { analyzeWord } = require("../dist/analyzers/analyze.js");
const { findExample } = require("../dist/core/examples.js");
const { flattenLexicon } = require("../dist/core/spec.js");
const { validateWord } = require("../dist/core/phonology.js");
const { createCompound } = require("../dist/generators/compound.js");
const { deriveWord, findRoot } = require("../dist/generators/derivation.js");

test("validates simple Ethra phonology", () => {
  assert.equal(validateWord("rah").valid, true);
  assert.equal(validateWord("mi-rah").valid, true);
  assert.equal(validateWord("dav-da").valid, true);
});

test("rejects invalid forms", () => {
  assert.equal(validateWord("rtha").valid, false);
  assert.equal(validateWord("qa").valid, false);
  assert.throws(() => deriveWord("ZZZ", "verb"), /Unknown root/);
});

test("looks up roots by aliases and derives words", () => {
  const root = findRoot("RAH");
  assert.equal(root.id, "RH");

  const result = deriveWord("RAH", "intimate-imperative");
  assert.equal(result.word, "mi-rah");
  assert.equal(result.pattern, "intimate");
  assert.match(result.culturalNotes, /ke mi-rah/);

  const tool = deriveWord("RAH", "tool");
  assert.equal(tool.word, "rah-tel");
  assert.equal(tool.pattern, "instrument");

  const legalRight = deriveWord("RAH", "legal-right");
  assert.equal(legalRight.word, "rah-ret");
  assert.equal(legalRight.pattern, "right");
});

test("analyzes known words", () => {
  const analysis = analyzeWord("mi-rah");
  assert.equal(analysis.validPhonology, true);
  assert.ok(analysis.matches.some((match) => match.root === "RH"));
  assert.ok(analysis.morphology.some((line) => line.includes("compound/prefixed")));

  const instrument = analyzeWord("rah-tel");
  assert.equal(instrument.validPhonology, true);
  assert.ok(instrument.matches.some((match) => match.pattern === "instrument"));
});

test("creates compounds", () => {
  const compound = createCompound(["fer", "dev"], "future-binding duty");
  assert.equal(compound.word, "fer-dev");
  assert.equal(compound.meaning, "future-binding duty");
});

test("loads canonical example translations", () => {
  const example = findExample("8");
  assert.equal(example.ethra, "Na dov tar mo mik.");
  assert.match(example.cultural_notes, /Repair/);
});

test("lexicon contains the expanded seed breadth", () => {
  const entries = flattenLexicon();
  const categories = new Set(entries.map((entry) => entry.category));
  assert.ok(entries.length >= 3000);
  for (const category of [
    "Pronouns",
    "Particles",
    "Moral agency",
    "Family",
    "Body",
    "Mind",
    "Emotion",
    "Seeing/knowing",
    "Speech",
    "Time",
    "Nature",
    "Building/making",
    "Law/civic life",
    "Technology",
    "Ritual/poetry",
    "Love/intimacy",
    "Conflict/repair",
    "Future/civilization"
  ]) {
    assert.ok(categories.has(category), `missing category ${category}`);
  }
});
