const test = require("node:test");
const assert = require("node:assert/strict");

const {
  corpusSummary,
  domainCoverageReport,
  listCorpusItems,
  listDomains,
  loadGovernance,
  loadRoadmap,
  roadmapSummary
} = require("../dist/core/civilization.js");
const { validateCorpus, validateSpec } = require("../dist/core/validation.js");

test("loads the civilizational-scale roadmap", () => {
  const roadmap = loadRoadmap();
  assert.equal(roadmap.milestones[0].id, "v0.2");
  assert.equal(roadmap.milestones.at(-1).id, "civilizational-scale");
  assert.ok(roadmap.non_goals.some((item) => item.includes("copy English")));
});

test("summarizes current progress against roadmap targets", () => {
  const summary = roadmapSummary();
  assert.equal(summary.current.actual_lexicon_entries, summary.current.lexicon_entries);
  assert.equal(summary.current.actual_root_families, summary.current.root_families);
  assert.equal(summary.current.actual_corpus_items, summary.current.corpus_items);
  assert.ok(summary.current.actual_lexicon_entries >= 1000);
  assert.ok(summary.current.actual_root_families >= 150);
  assert.ok(summary.current.actual_corpus_items >= 100);
  assert.equal(summary.current.actual_canonical_examples, 20);
  assert.equal(summary.next_milestone.target_entries, 1000);
});

test("lists highest-priority expansion domains", () => {
  const domains = listDomains("highest");
  assert.ok(domains.length >= 5);
  assert.ok(domains.some((domain) => domain.id === "law-governance"));
  assert.ok(domains.every((domain) => domain.priority === "highest"));
});

test("reports domain coverage gaps", () => {
  const report = domainCoverageReport();
  const technology = report.find((domain) => domain.id === "technology-software");
  assert.ok(technology);
  assert.equal(technology.target_entries_v02, 160);
  assert.ok(technology.gap_to_v02 >= 0);
});

test("loads corpus and governance programs", () => {
  const corpus = corpusSummary();
  const governance = loadGovernance();
  assert.equal(corpus.current_items, 100);
  assert.equal(corpus.remaining_items_v02, 0);
  assert.ok(corpus.tracks.some((track) => track.id === "technical-software"));
  assert.ok(governance.root_admission_rules.some((rule) => rule.includes("durable semantic field")));
  assert.ok(governance.review_checklist.some((item) => item.includes("root-depth")));
});

test("lists and validates reviewed corpus items", () => {
  const technicalItems = listCorpusItems("technical-software");
  assert.equal(technicalItems.length, 15);
  assert.ok(technicalItems.some((item) => item.ethra === "Mef xap den."));

  const report = validateCorpus();
  assert.equal(report.valid, true, JSON.stringify(report.errors, null, 2));
  assert.equal(report.stats.items, 100);
  assert.equal(report.stats.tracks, 6);
  assert.ok(report.stats.uniqueTerms >= 120);
});

test("validates expanded root inventory", () => {
  const report = validateSpec();
  assert.equal(report.valid, true, JSON.stringify(report.errors, null, 2));
  assert.equal(report.stats.roots, 152);
  assert.equal(report.stats.lexiconEntries, 1273);
});
