const test = require("node:test");
const assert = require("node:assert/strict");

const {
  compoundSummary,
  corpusExpansionPlan,
  corpusSummary,
  domainCoverageReport,
  listCompounds,
  listCorpusItems,
  listDomains,
  loadDerivationPatterns,
  loadGovernance,
  loadRoadmap,
  roadmapSummary
} = require("../dist/core/civilization.js");
const { validateCompounds, validateCorpus, validateSpec } = require("../dist/core/validation.js");

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
  assert.equal(summary.current.actual_compound_terms, summary.current.compound_terms);
  assert.equal(summary.current.actual_derivation_patterns, summary.current.derivation_patterns);
  assert.ok(summary.current.actual_lexicon_entries >= 20000);
  assert.ok(summary.current.actual_root_families >= 1000);
  assert.ok(summary.current.actual_corpus_items >= 1740);
  assert.ok(summary.current.actual_compound_terms >= 100);
  assert.equal(summary.current.actual_derivation_patterns, 20);
  assert.equal(summary.current.actual_canonical_examples, 20);
  assert.equal(summary.next_milestone.id, "v0.5");
  assert.equal(summary.next_milestone.target_entries, 10000);
});

test("loads productive derivation pattern catalog", () => {
  const patterns = loadDerivationPatterns();
  assert.equal(patterns.total_patterns_per_root, 20);
  assert.equal(patterns.patterns.length, 20);
  assert.ok(patterns.patterns.some((pattern) => pattern.id === "instrument" && pattern.example_word === "rah-tel"));
  assert.ok(patterns.patterns.some((pattern) => pattern.id === "right" && pattern.register === "legal"));
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
  assert.equal(corpus.current_items, 1740);
  assert.equal(corpus.remaining_items_v02, 0);
  assert.ok(corpus.tracks.some((track) => track.id === "technical-software"));
  assert.ok(corpus.tracks.every((track) => track.current_items >= 193));
  const trackCounts = new Map(corpus.tracks.map((track) => [track.id, track.current_items]));
  assert.equal(trackCounts.get("daily-dialogues"), 339);
  assert.equal(trackCounts.get("civic-law"), 266);
  assert.equal(trackCounts.get("ritual-vow"), 266);
  assert.equal(trackCounts.get("technical-software"), 338);
  assert.equal(trackCounts.get("literary-poetic"), 338);
  assert.equal(trackCounts.get("learner-graded"), 193);
  assert.ok(governance.root_admission_rules.some((rule) => rule.includes("durable semantic field")));
  assert.ok(governance.review_checklist.some((item) => item.includes("root-depth")));
});

test("recommends the next governed corpus expansion batch", () => {
  const plan = corpusExpansionPlan(120, 6);
  assert.equal(plan.milestone.id, "v0.5");
  assert.equal(plan.current_items, 1740);
  assert.equal(plan.remaining_items_to_milestone, 260);
  assert.equal(plan.recommended_batch_size, 120);

  const recommendations = new Map(plan.track_recommendations.map((track) => [track.id, track]));
  assert.equal(recommendations.get("daily-dialogues")?.recommended_items, 28);
  assert.equal(recommendations.get("civic-law")?.recommended_items, 16);
  assert.equal(recommendations.get("ritual-vow")?.recommended_items, 16);
  assert.equal(recommendations.get("technical-software")?.recommended_items, 28);
  assert.equal(recommendations.get("literary-poetic")?.recommended_items, 29);
  assert.equal(recommendations.get("learner-graded")?.recommended_items, 3);
  assert.equal(recommendations.get("daily-dialogues")?.next_item_ids[0], "daily-340");
  assert.equal(recommendations.get("civic-law")?.next_item_ids[0], "civic-267");
  assert.equal(recommendations.get("ritual-vow")?.next_item_ids[0], "ritual-267");
  assert.equal(recommendations.get("technical-software")?.next_item_ids[0], "tech-339");
  assert.equal(recommendations.get("technical-software")?.next_item_ids.at(-1), "tech-366");
  assert.equal(recommendations.get("literary-poetic")?.next_item_ids[0], "poetic-339");
  assert.equal(recommendations.get("learner-graded")?.next_item_ids[0], "learner-194");
  assert.equal(plan.domain_pressure[0].id, "science-math");
  assert.ok(plan.domain_pressure.some((domain) => domain.id === "nature-ecology"));
});

test("lists and validates reviewed corpus items", () => {
  const technicalItems = listCorpusItems("technical-software");
  assert.equal(technicalItems.length, 338);
  assert.ok(technicalItems.some((item) => item.ethra === "Mef xap den."));
  assert.ok(technicalItems.some((item) => item.ethra === "Dab-ket e rih."));
  assert.ok(technicalItems.some((item) => item.ethra === "Hef wav xet."));
  assert.ok(technicalItems.some((item) => item.ethra === "Koh mas kej."));
  assert.ok(technicalItems.some((item) => item.ethra === "Den-kez kat tet."));
  assert.ok(technicalItems.some((item) => item.ethra === "Vey xap zex."));
  assert.ok(technicalItems.some((item) => item.ethra === "Res vax kaw."));
  assert.ok(technicalItems.some((item) => item.ethra === "Zex kat zes."));
  assert.ok(technicalItems.some((item) => item.ethra === "Vey vaz gep."));
  assert.ok(technicalItems.some((item) => item.ethra === "Xav-ket xap pec."));
  assert.ok(technicalItems.some((item) => item.ethra === "Dab vax kaw."));
  assert.ok(technicalItems.some((item) => item.ethra === "Xav-fek xap hef."));
  assert.ok(technicalItems.some((item) => item.ethra === "Kesen xap zex."));
  assert.ok(technicalItems.some((item) => item.ethra === "Xedel dak med."));
  assert.ok(technicalItems.some((item) => item.ethra === "Cemer dag hef."));
  assert.ok(technicalItems.some((item) => item.ethra === "Cexet pat xedel."));
  assert.ok(technicalItems.some((item) => item.ethra === "Bejes xaj med."));
  assert.ok(technicalItems.some((item) => item.ethra === "Xepel vax rex."));
  assert.ok(technicalItems.some((item) => item.ethra === "Mebeg xaj feres."));
  assert.ok(technicalItems.some((item) => item.ethra === "Newer pat meseg."));
  assert.ok(technicalItems.some((item) => item.ethra === "Ferew xap newer."));
  assert.ok(technicalItems.some((item) => item.ethra === "Seceh nam den."));
  assert.ok(technicalItems.some((item) => item.ethra === "Rekes kaw perec."));
  assert.ok(technicalItems.some((item) => item.ethra === "Jewet xap secek."));
  assert.ok(technicalItems.some((item) => item.ethra === "Depey warat leweg."));
  assert.ok(technicalItems.some((item) => item.ethra === "Lelem nam nem."));
  assert.ok(technicalItems.some((item) => item.ethra === "Mebed taw meyes."));
  assert.ok(technicalItems.some((item) => item.ethra === "Gewet xap rekes."));
  assert.ok(technicalItems.some((item) => item.ethra === "Betey kav kebed."));
  assert.ok(technicalItems.some((item) => item.ethra === "Tel xap gem."));
  assert.ok(technicalItems.some((item) => item.ethra === "New xap den."));
  assert.ok(technicalItems.some((item) => item.ethra === "Xav xap den."));
  assert.ok(technicalItems.some((item) => item.ethra === "Kelef nam gec."));
  assert.ok(technicalItems.some((item) => item.ethra === "Xedel xap yes."));
  assert.ok(technicalItems.some((item) => item.ethra === "Xadal-da mar den."));
  assert.ok(technicalItems.some((item) => item.ethra === "Lelem vax pey."));
  assert.ok(technicalItems.some((item) => item.ethra === "Tehek xap lelem."));
  assert.ok(technicalItems.some((item) => item.ethra === "Pejeg xap den."));
  assert.ok(technicalItems.some((item) => item.ethra === "Peb pat med."));
  assert.ok(technicalItems.some((item) => item.ethra === "Newer taw masag."));
  assert.ok(technicalItems.some((item) => item.ethra === "Tex xap rekes."));
  assert.ok(technicalItems.some((item) => item.ethra === "Zey pat med."));
  assert.ok(technicalItems.some((item) => item.ethra === "Reber xap jev."));
  assert.ok(technicalItems.some((item) => item.ethra === "Peket taw meseg."));
  assert.ok(technicalItems.some((item) => item.ethra === "Tex xap feh."));
  assert.ok(technicalItems.some((item) => item.ethra === "Neb nam den."));
  assert.ok(technicalItems.some((item) => item.ethra === "Xeg xap pejeg."));
  assert.ok(technicalItems.some((item) => item.ethra === "Peb pat kelef."));
  assert.ok(technicalItems.some((item) => item.ethra === "Kebed nam meseg."));
  assert.ok(technicalItems.some((item) => item.ethra === "Pejeg xap mas."));
  assert.ok(technicalItems.some((item) => item.ethra === "Terex taw mey."));
  assert.ok(technicalItems.some((item) => item.ethra === "Zey xap vel."));
  assert.ok(technicalItems.some((item) => item.ethra === "Zeden xap med."));
  assert.ok(technicalItems.some((item) => item.ethra === "Dab xap xeg."));
  assert.ok(technicalItems.some((item) => item.ethra === "Newer taw peket."));
  assert.ok(technicalItems.some((item) => item.ethra === "Secek ap heg."));
  assert.ok(technicalItems.some((item) => item.ethra === "Tam xap tep."));

  const report = validateCorpus();
  assert.equal(report.valid, true, JSON.stringify(report.errors, null, 2));
  assert.equal(report.stats.items, 1740);
  assert.equal(report.stats.tracks, 6);
  assert.ok(report.stats.uniqueTerms >= 905);
});

test("validates expanded root inventory", () => {
  const report = validateSpec();
  assert.equal(report.valid, true, JSON.stringify(report.errors, null, 2));
  assert.equal(report.stats.roots, 1000);
  assert.equal(report.stats.lexiconEntries, 20057);
  assert.equal(report.stats.derivationPatterns, 20);
});

test("lists and validates curated compound terminology", () => {
  const summary = compoundSummary();
  assert.equal(summary.terms, 100);
  assert.equal(summary.accepted_terms, 100);
  assert.ok(summary.domain_counts["technology-software"] >= 10);

  const technicalCompounds = listCompounds("technology-software");
  assert.ok(technicalCompounds.some((term) => term.word === "den-dev"));

  const report = validateCompounds();
  assert.equal(report.valid, true, JSON.stringify(report.errors, null, 2));
  assert.equal(report.stats.terms, 100);
  assert.equal(report.stats.accepted, 100);
  assert.ok(report.stats.domains >= 15);
});
