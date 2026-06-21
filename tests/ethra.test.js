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

  const threat = deriveWord("XAC", "noun");
  assert.equal(threat.word, "xec");
  assert.equal(threat.root.id, "XC");

  const database = deriveWord("DB", "record");
  assert.equal(database.word, "dab-ket");
  assert.equal(database.pattern, "record");

  const focus = deriveWord("FAN", "noun");
  assert.equal(focus.word, "fen");
  assert.equal(focus.root.id, "FN");

  const file = deriveWord("HF", "object");
  assert.equal(file.word, "hof");
  assert.equal(file.root.id, "HF");

  const day = deriveWord("DD", "noun");
  assert.equal(day.word, "ded");
  assert.equal(day.root.id, "DD");

  const offering = deriveWord("NAK", "noun");
  assert.equal(offering.word, "nek");
  assert.equal(offering.root.id, "NK");

  const evidence = deriveWord("DAG", "noun");
  assert.equal(evidence.word, "deg");
  assert.equal(evidence.root.id, "DG");

  const algorithm = deriveWord("PZ", "noun");
  assert.equal(algorithm.word, "pez");
  assert.equal(algorithm.root.id, "PZ");

  const care = deriveWord("WY", "verb");
  assert.equal(care.word, "way");
  assert.equal(care.root.id, "WY");

  const analysis = deriveWord("DML", "noun");
  assert.equal(analysis.word, "demel");
  assert.equal(analysis.root.id, "DML");

  const prayer = deriveWord("CC", "noun");
  assert.equal(prayer.word, "cec");
  assert.equal(prayer.root.id, "CC");

  const charter = deriveWord("BRT", "noun");
  assert.equal(charter.word, "beret");
  assert.equal(charter.root.id, "BRT");

  const authentication = deriveWord("KSN", "record");
  assert.equal(authentication.word, "kasan-ket");
  assert.equal(authentication.root.id, "KSN");

  const biodiversity = deriveWord("BDS", "civic-legal");
  assert.equal(biodiversity.word, "badas-da");
  assert.equal(biodiversity.root.id, "BDS");

  const jurisdiction = deriveWord("YRL", "noun");
  assert.equal(jurisdiction.word, "yerel");
  assert.equal(jurisdiction.root.id, "YRL");

  const patch = deriveWord("PCH", "record");
  assert.equal(patch.word, "pacah-ket");
  assert.equal(patch.root.id, "PCH");

  const civilization = deriveWord("CVL", "civic-legal");
  assert.equal(civilization.word, "caval-da");
  assert.equal(civilization.root.id, "CVL");

  const context = deriveWord("CXT", "noun");
  assert.equal(context.word, "cexet");
  assert.equal(context.root.id, "CXT");

  const vulnerability = deriveWord("VLB", "intimate");
  assert.equal(vulnerability.word, "mi-valab");
  assert.equal(vulnerability.root.id, "VLB");

  const conscience = deriveWord("CNS", "record");
  assert.equal(conscience.word, "canas-ket");
  assert.equal(conscience.root.id, "CNS");

  const continuity = deriveWord("CNT", "civic-legal");
  assert.equal(continuity.word, "canat-da");
  assert.equal(continuity.root.id, "CNT");

  const contract = deriveWord("KNC", "noun");
  assert.equal(contract.word, "kenec");
  assert.equal(contract.root.id, "KNC");

  const request = deriveWord("RKS", "noun");
  assert.equal(request.word, "rekes");
  assert.equal(request.root.id, "RKS");

  const network = deriveWord("NWR", "noun");
  assert.equal(network.word, "newer");
  assert.equal(network.root.id, "NWR");

  const syllabus = deriveWord("SYB", "noun");
  assert.equal(syllabus.word, "seyeb");
  assert.equal(syllabus.root.id, "SYB");

  const kidney = deriveWord("KDN", "noun");
  assert.equal(kidney.word, "keden");
  assert.equal(kidney.root.id, "KDN");

  const appeal = deriveWord("PLT", "noun");
  assert.equal(appeal.word, "pelet");
  assert.equal(appeal.root.id, "PLT");

  const deployment = deriveWord("DPY", "verb");
  assert.equal(deployment.word, "dapay");
  assert.equal(deployment.root.id, "DPY");

  const validation = deriveWord("VLD", "noun");
  assert.equal(validation.word, "veled");
  assert.equal(validation.root.id, "VLD");

  const vector = deriveWord("VKR", "noun");
  assert.equal(vector.word, "veker");
  assert.equal(vector.root.id, "VKR");

  const clinic = deriveWord("KLC", "noun");
  assert.equal(clinic.word, "kelec");
  assert.equal(clinic.root.id, "KLC");

  const grid = deriveWord("GDR", "noun");
  assert.equal(grid.word, "geder");
  assert.equal(grid.root.id, "GDR");

  const publication = deriveWord("PBC", "noun");
  assert.equal(publication.word, "pebec");
  assert.equal(publication.root.id, "PBC");

  const motivation = deriveWord("MTV", "noun");
  assert.equal(motivation.word, "metev");
  assert.equal(motivation.root.id, "MTV");

  const being = deriveWord("YNT", "noun");
  assert.equal(being.word, "yenet");
  assert.equal(being.root.id, "YNT");

  const meaning = deriveWord("MYS", "noun");
  assert.equal(meaning.word, "meyes");
  assert.equal(meaning.root.id, "MYS");

  const ethics = deriveWord("THK", "noun");
  assert.equal(ethics.word, "tehek");
  assert.equal(ethics.root.id, "THK");

  const conversation = deriveWord("CNV", "noun");
  assert.equal(conversation.word, "cenev");
  assert.equal(conversation.root.id, "CNV");

  const languageModel = deriveWord("LLM", "noun");
  assert.equal(languageModel.word, "lelem");
  assert.equal(languageModel.root.id, "LLM");

  const embedding = deriveWord("MBD", "noun");
  assert.equal(embedding.word, "mebed");
  assert.equal(embedding.root.id, "MBD");

  const religion = deriveWord("RLG", "noun");
  assert.equal(religion.word, "releg");
  assert.equal(religion.root.id, "RLG");

  const calendar = deriveWord("KLD", "noun");
  assert.equal(calendar.word, "keled");
  assert.equal(calendar.root.id, "KLD");

  const battery = deriveWord("BTY", "noun");
  assert.equal(battery.word, "betey");
  assert.equal(battery.root.id, "BTY");
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
  assert.ok(entries.length >= 20000);
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
