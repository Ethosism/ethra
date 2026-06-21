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
  roadmapSummary,
  searchCorpus
} = require("../dist/core/civilization.js");
const { dictionaryStats, lookupDictionary } = require("../dist/core/dictionary.js");
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
  assert.ok(summary.current.actual_lexicon_entries >= 39057);
  assert.ok(summary.current.actual_root_families >= 1950);
  assert.ok(summary.current.actual_corpus_items >= 4160);
  assert.ok(summary.current.actual_compound_terms >= 100);
  assert.equal(summary.current.actual_derivation_patterns, 20);
  assert.equal(summary.current.actual_canonical_examples, 20);
  assert.ok(summary.current.cli_commands.includes("search-corpus"));
  assert.ok(summary.current.cli_commands.includes("propose-term"));
  assert.ok(summary.current.cli_commands.includes("style-check"));
  assert.ok(summary.current.cli_commands.includes("parse-sentence"));
  assert.ok(summary.current.cli_commands.includes("lookup-dictionary"));
  assert.ok(summary.current.cli_commands.includes("dictionary-stats"));
  assert.equal(summary.next_milestone.id, "v1.0");
  assert.equal(summary.next_milestone.target_entries, 25000);
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
  assert.equal(corpus.current_items, 4160);
  assert.equal(corpus.remaining_items_v02, 0);
  assert.ok(corpus.tracks.some((track) => track.id === "technical-software"));
  assert.ok(corpus.tracks.every((track) => track.current_items >= 200));
  const trackCounts = new Map(corpus.tracks.map((track) => [track.id, track.current_items]));
  assert.equal(trackCounts.get("daily-dialogues"), 832);
  assert.equal(trackCounts.get("civic-law"), 624);
  assert.equal(trackCounts.get("ritual-vow"), 624);
  assert.equal(trackCounts.get("technical-software"), 832);
  assert.equal(trackCounts.get("literary-poetic"), 832);
  assert.equal(trackCounts.get("learner-graded"), 416);
  assert.ok(governance.root_admission_rules.some((rule) => rule.includes("durable semantic field")));
  assert.ok(governance.review_checklist.some((item) => item.includes("root-depth")));
});

test("recommends the next governed corpus expansion batch", () => {
  const plan = corpusExpansionPlan(120, 6);
  assert.equal(plan.milestone.id, "v1.0");
  assert.equal(plan.current_items, 4160);
  assert.equal(plan.remaining_items_to_milestone, 5840);
  assert.equal(plan.recommended_batch_size, 120);

  const recommendations = new Map(plan.track_recommendations.map((track) => [track.id, track]));
  assert.equal(recommendations.get("daily-dialogues")?.recommended_items, 24);
  assert.equal(recommendations.get("civic-law")?.recommended_items, 18);
  assert.equal(recommendations.get("ritual-vow")?.recommended_items, 18);
  assert.equal(recommendations.get("technical-software")?.recommended_items, 24);
  assert.equal(recommendations.get("literary-poetic")?.recommended_items, 24);
  assert.equal(recommendations.get("learner-graded")?.recommended_items, 12);
  assert.equal(recommendations.get("daily-dialogues")?.next_item_ids[0], "daily-833");
  assert.equal(recommendations.get("civic-law")?.next_item_ids[0], "civic-625");
  assert.equal(recommendations.get("ritual-vow")?.next_item_ids[0], "ritual-625");
  assert.equal(recommendations.get("technical-software")?.next_item_ids[0], "tech-833");
  assert.equal(recommendations.get("technical-software")?.next_item_ids.at(-1), "tech-856");
  assert.equal(recommendations.get("literary-poetic")?.next_item_ids[0], "poetic-833");
  assert.equal(recommendations.get("learner-graded")?.next_item_ids[0], "learner-417");
  assert.equal(plan.domain_pressure[0].id, "science-math");
  assert.ok(plan.domain_pressure.some((domain) => domain.id === "philosophy-metaphysics"));
  assert.ok(plan.domain_pressure.some((domain) => domain.id === "emotion-psychology"));
  assert.ok(plan.domain_pressure.some((domain) => domain.id === "ai-cognition"));
  assert.ok(plan.domain_pressure.some((domain) => domain.id === "nature-ecology"));
});

test("lists and validates reviewed corpus items", () => {
  const technicalItems = listCorpusItems("technical-software");
  assert.equal(technicalItems.length, 832);
  assert.ok(technicalItems.some((item) => item.ethra === "Remetel dak med."));
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
  assert.ok(technicalItems.some((item) => item.ethra === "Dab pat pejeg."));
  assert.ok(technicalItems.some((item) => item.ethra === "Leger dav terex."));
  assert.ok(technicalItems.some((item) => item.ethra === "Peket taw peled."));
  assert.ok(technicalItems.some((item) => item.ethra === "Zeden xap xadal."));
  assert.ok(technicalItems.some((item) => item.ethra === "Pejeg xap xadal."));
  assert.ok(technicalItems.some((item) => item.ethra === "Hes dab pat med."));
  assert.ok(technicalItems.some((item) => item.ethra === "Seg taw peket."));
  assert.ok(technicalItems.some((item) => item.ethra === "Xadal taw mar."));
  assert.ok(technicalItems.some((item) => item.ethra === "Xadal xap pejeg."));
  assert.ok(technicalItems.some((item) => item.ethra === "Tex pat seg."));
  assert.ok(technicalItems.some((item) => item.ethra === "Newer taw ket."));
  assert.ok(technicalItems.some((item) => item.ethra === "Zey xap jev."));
  assert.ok(technicalItems.some((item) => item.ethra === "Den mas med."));
  assert.ok(technicalItems.some((item) => item.ethra === "Reteg taw mar."));
  assert.ok(technicalItems.some((item) => item.ethra === "Lalam nam nem."));
  assert.ok(technicalItems.some((item) => item.ethra === "Tarag pat kav."));
  assert.ok(technicalItems.some((item) => item.ethra === "Pamar taw peb."));
  assert.ok(technicalItems.some((item) => item.ethra === "Radar-tel ap ket."));
  assert.ok(technicalItems.some((item) => item.ethra === "Warat dav mar."));
  assert.ok(technicalItems.some((item) => item.ethra === "Xav xap feh."));
  assert.ok(technicalItems.some((item) => item.ethra === "Sedek ban peyen."));
  assert.ok(technicalItems.some((item) => item.ethra === "Teles xap jetek."));
  assert.ok(technicalItems.some((item) => item.ethra === "Peyen pat mecer."));
  assert.ok(technicalItems.some((item) => item.ethra === "Ganan-ket xap hel."));
  assert.ok(technicalItems.some((item) => item.ethra === "Deves taw debed."));
  assert.ok(technicalItems.some((item) => item.ethra === "Pesew xap legen."));
  assert.ok(technicalItems.some((item) => item.ethra === "Yaman-ket xap hel."));
  assert.ok(technicalItems.some((item) => item.ethra === "Lecek xap xeg."));
  assert.ok(technicalItems.some((item) => item.ethra === "Hewer taw sevec."));
  assert.ok(technicalItems.some((item) => item.ethra === "Kemet kat mer."));
  assert.ok(technicalItems.some((item) => item.ethra === "Peler rah kamat-ket."));
  assert.ok(technicalItems.some((item) => item.ethra === "Bezev rah sevec."));
  assert.ok(technicalItems.some((item) => item.ethra === "Pabal-da mes den."));
  assert.ok(technicalItems.some((item) => item.ethra === "Nelec xap med."));
  assert.ok(technicalItems.some((item) => item.ethra === "Rekec rag sevec."));
  assert.ok(technicalItems.some((item) => item.ethra === "Pemen xap xeg."));
  assert.ok(technicalItems.some((item) => item.ethra === "Pever kat med."));
  assert.ok(technicalItems.some((item) => item.ethra === "Xeber xap xed."));
  assert.ok(technicalItems.some((item) => item.ethra === "Legec mar beged."));
  assert.ok(technicalItems.some((item) => item.ethra === "Nerej kav med."));
  assert.ok(technicalItems.some((item) => item.ethra === "Werekes ban peley."));
  assert.ok(technicalItems.some((item) => item.ethra === "Benex mes med."));
  assert.ok(technicalItems.some((item) => item.ethra === "Helex mak reh."));
  assert.ok(technicalItems.some((item) => item.ethra === "Terebet xap yen."));
  assert.ok(technicalItems.some((item) => item.ethra === "Celeb tar mes."));
  assert.ok(technicalItems.some((item) => item.ethra === "Verenec mes lu den."));
  assert.ok(technicalItems.some((item) => item.ethra === "Nejec mak sevec."));
  assert.ok(technicalItems.some((item) => item.ethra === "Feneten kar med."));
  assert.ok(technicalItems.some((item) => item.ethra === "Repelec xap mer."));
  assert.ok(technicalItems.some((item) => item.ethra === "Feten xap yen."));
  assert.ok(technicalItems.some((item) => item.ethra === "Palacab-ket rah xelep."));
  assert.ok(technicalItems.some((item) => item.ethra === "Notorop mes rag."));
  assert.ok(technicalItems.some((item) => item.ethra === "Sapatar-ket taw den."));
  assert.ok(technicalItems.some((item) => item.ethra === "Garadax-ket pat med."));
  assert.ok(technicalItems.some((item) => item.ethra === "Latanas-ket mes sevec."));
  assert.ok(technicalItems.some((item) => item.ethra === "Rabasat-ket xap sevec."));
  assert.ok(technicalItems.some((item) => item.ethra === "Wavafat-ket rah med."));
  assert.ok(technicalItems.some((item) => item.ethra === "Darafat-ket rah den."));
  assert.ok(technicalItems.some((item) => item.ethra === "Radacat-ket xap den."));
  assert.ok(technicalItems.some((item) => item.ethra === "Sabataj-ket rah mak."));
  assert.ok(technicalItems.some((item) => item.ethra === "Baracax-ket xap den."));
  assert.ok(technicalItems.some((item) => item.ethra === "Bereked rah den."));
  assert.ok(technicalItems.some((item) => item.ethra === "Sabasac-ga xap sevec."));
  assert.ok(technicalItems.some((item) => item.ethra === "Kawap-ket xap nef."));
  assert.ok(technicalItems.some((item) => item.ethra === "Mabaral-ket xap pet."));
  assert.ok(technicalItems.some((item) => item.ethra === "Palamar-tel rah wam."));
  assert.ok(technicalItems.some((item) => item.ethra === "Paragar-ket xap den."));
  assert.ok(technicalItems.some((item) => item.ethra === "Natapar-tel taw nem."));
  assert.ok(technicalItems.some((item) => item.ethra === "Kayanax-ket xap hon."));
  assert.ok(technicalItems.some((item) => item.ethra === "Raragax-tel pat wam."));
  assert.ok(technicalItems.some((item) => item.ethra === "Vayanad-ket taw jew."));
  assert.ok(technicalItems.some((item) => item.ethra === "Daranax-tel rah rag."));
  assert.ok(technicalItems.some((item) => item.ethra === "Radarax-tel rah derenex."));
  assert.ok(technicalItems.some((item) => item.ethra === "Faranas-ket rah mak."));
  assert.ok(technicalItems.some((item) => item.ethra === "Lagatam-tel mes den."));
  assert.ok(technicalItems.some((item) => item.ethra === "Bayasan-ket tar xen."));
  assert.ok(technicalItems.some((item) => item.ethra === "Maiacar-ket rah sepenem."));
  assert.ok(technicalItems.some((item) => item.ethra === "Takanaz-tel ban tokonoz."));
  assert.ok(technicalItems.some((item) => item.ethra === "Eavahar-ket jav med."));
  assert.ok(technicalItems.some((item) => item.ethra === "Garanad-ket xap xeg."));
  assert.ok(technicalItems.some((item) => item.ethra === "Cenewey den pat med."));
  assert.ok(technicalItems.some((item) => item.ethra === "Mexemem pat med."));
  assert.ok(technicalItems.some((item) => item.ethra === "Cahanax-tel rah pat."));
  assert.ok(technicalItems.some((item) => item.ethra === "Casaway-tel map wed."));
  assert.ok(technicalItems.some((item) => item.ethra === "Satakax-ket pat hal."));
  assert.ok(technicalItems.some((item) => item.ethra === "Facahak-tel xap rih."));
  assert.ok(technicalItems.some((item) => item.ethra === "Dabanak-ket tar nem."));

  const report = validateCorpus();
  assert.equal(report.valid, true, JSON.stringify(report.errors, null, 2));
  assert.equal(report.stats.items, 4160);
  assert.equal(report.stats.tracks, 6);
  assert.ok(report.stats.uniqueTerms >= 2313);
});

test("searches reviewed corpus by text and structured filters", () => {
  const exactEthra = searchCorpus({ query: "Den mas med", track: "technical-software", limit: 3 });
  assert.ok(exactEthra.total_matches >= 1);
  assert.equal(exactEthra.matches[0].id, "tech-401");
  assert.ok(exactEthra.matches[0].matched_fields.includes("ethra"));

  const learnerTechnical = searchCorpus({
    query: "data model",
    track: "learner-graded",
    register: "learner-a1",
    limit: 5
  });
  assert.ok(learnerTechnical.matches.some((match) => match.id === "learner-210"));
  assert.ok(learnerTechnical.matches.every((match) => match.item.track === "learner-graded"));
  assert.ok(learnerTechnical.matches.every((match) => match.item.register === "learner-a1"));

  const recognition = searchCorpus({ term: "reh", domain: "philosophy-metaphysics", limit: 7 });
  assert.ok(recognition.total_matches >= recognition.returned_matches);
  assert.ok(recognition.returned_matches <= 7);
  assert.ok(recognition.matches.every((match) => match.item.domain_tags.includes("philosophy-metaphysics")));
  assert.ok(recognition.matches.every((match) => match.item.terms.includes("reh")));

  const noneReturned = searchCorpus({ query: "future", limit: 0 });
  assert.ok(noneReturned.total_matches > 0);
  assert.equal(noneReturned.returned_matches, 0);
  assert.deepEqual(noneReturned.matches, []);

  const materialCulture = searchCorpus({ query: "shirt protects body", track: "daily-dialogues", limit: 5 });
  assert.ok(materialCulture.matches.some((match) => match.id === "daily-569"));
  assert.ok(materialCulture.matches.some((match) => match.item.terms.includes("seheret")));

  const socialRoles = searchCorpus({ query: "carpenter repairs home", track: "daily-dialogues", limit: 5 });
  assert.ok(socialRoles.matches.some((match) => match.id === "daily-593"));
  assert.ok(socialRoles.matches.some((match) => match.item.terms.includes("cerepen")));

  const natureAgriculture = searchCorpus({ query: "dog protects child", track: "daily-dialogues", limit: 5 });
  assert.ok(natureAgriculture.matches.some((match) => match.id === "daily-617"));
  assert.ok(natureAgriculture.matches.some((match) => match.item.terms.includes("keyenex")));

  const securityOperations = searchCorpus({ query: "drone sees border", track: "daily-dialogues", limit: 5 });
  assert.ok(securityOperations.matches.some((match) => match.id === "daily-643"));
  assert.ok(securityOperations.matches.some((match) => match.item.terms.includes("derenex")));

  const scienceMethod = searchCorpus({ query: "lemma protects evidence", track: "daily-dialogues", limit: 5 });
  assert.ok(scienceMethod.matches.some((match) => match.id === "daily-665"));
  assert.ok(scienceMethod.matches.some((match) => match.item.terms.includes("lememex")));

  const labLearner = searchCorpus({ query: "microscope reveals specimen", track: "learner-graded", limit: 5 });
  assert.ok(labLearner.matches.some((match) => match.id === "learner-341"));
  assert.ok(labLearner.matches.some((match) => match.item.terms.includes("meiecer")));

  const aiSafety = searchCorpus({ query: "guardrail protects people", track: "learner-graded", limit: 5 });
  assert.ok(aiSafety.matches.some((match) => match.id === "learner-346"));
  assert.ok(aiSafety.matches.some((match) => match.item.terms.includes("geredel")));

  const aiGrounding = searchCorpus({ query: "grounding protects evidence", track: "learner-graded", limit: 5 });
  assert.ok(aiGrounding.matches.some((match) => match.id === "learner-354"));
  assert.ok(aiGrounding.matches.some((match) => match.item.terms.includes("gerened")));

  const classroomEducation = searchCorpus({ query: "classroom guides attention", track: "daily-dialogues", limit: 5 });
  assert.ok(classroomEducation.matches.some((match) => match.id === "daily-713"));
  assert.ok(classroomEducation.matches.some((match) => match.item.terms.includes("celeser")));

  const technicalEducation = searchCorpus({ query: "remote learning teaches model", track: "technical-software", limit: 5 });
  assert.ok(technicalEducation.matches.some((match) => match.id === "tech-713"));
  assert.ok(technicalEducation.matches.some((match) => match.item.terms.includes("remetel")));

  const integrityLearner = searchCorpus({ query: "integrity protects truth", track: "learner-graded", limit: 5 });
  assert.ok(integrityLearner.matches.some((match) => match.id === "learner-367"));
  assert.ok(integrityLearner.matches.some((match) => match.item.terms.includes("kecemed")));

  const canopyAttention = searchCorpus({ query: "canopy protects attention", track: "daily-dialogues", limit: 5 });
  assert.ok(canopyAttention.matches.some((match) => match.id === "daily-737"));
  assert.ok(canopyAttention.matches.some((match) => match.item.terms.includes("cenewey")));

  const aquiferLearner = searchCorpus({ query: "aquifer carries water", track: "learner-graded", limit: 5 });
  assert.ok(aquiferLearner.matches.some((match) => match.id === "learner-373"));
  assert.ok(aquiferLearner.matches.some((match) => match.item.terms.includes("wekefer")));

  const foodWebLearner = searchCorpus({ query: "food web teaches the people", track: "learner-graded", limit: 5 });
  assert.ok(foodWebLearner.matches.some((match) => match.id === "learner-379"));
  assert.ok(foodWebLearner.matches.some((match) => match.item.terms.includes("fedeweb")));

  const maximumModel = searchCorpus({ query: "maximum guides the model", track: "technical-software", limit: 5 });
  assert.ok(maximumModel.matches.some((match) => match.id === "tech-761"));
  assert.ok(maximumModel.matches.some((match) => match.item.terms.includes("mexemem")));

  const apathyAttention = searchCorpus({ query: "apathy breaks attention", track: "daily-dialogues", limit: 5 });
  assert.ok(apathyAttention.matches.some((match) => match.id === "daily-763"));
  assert.ok(apathyAttention.matches.some((match) => match.item.terms.includes("petehex")));

  const learnerOverwhelm = searchCorpus({ query: "overwhelm breaks attention", track: "learner-graded", limit: 5 });
  assert.ok(learnerOverwhelm.matches.some((match) => match.id === "learner-392"));
  assert.ok(learnerOverwhelm.matches.some((match) => match.item.terms.includes("veleweh")));

  const vendorPrice = searchCorpus({ query: "vendor names price", track: "daily-dialogues", limit: 5 });
  assert.ok(vendorPrice.matches.some((match) => match.id === "daily-785"));
  assert.ok(vendorPrice.matches.some((match) => match.item.terms.includes("veneder")));

  const ritualSupplyChain = searchCorpus({ query: "supply chain carries provision", track: "ritual-vow", limit: 5 });
  assert.ok(ritualSupplyChain.matches.some((match) => match.id === "ritual-605"));
  assert.ok(ritualSupplyChain.matches.some((match) => match.item.terms.includes("ha-cuhunux")));

  const learnerCauseway = searchCorpus({ query: "causeway protects path", track: "learner-graded", limit: 5 });
  assert.ok(learnerCauseway.matches.some((match) => match.id === "learner-404"));
  assert.ok(learnerCauseway.matches.some((match) => match.item.terms.includes("cesewey")));

  const healthGrounding = searchCorpus({ query: "child coughs write cough", track: "daily-dialogues", limit: 5 });
  assert.ok(healthGrounding.matches.some((match) => match.id === "daily-809"));
  assert.ok(healthGrounding.matches.some((match) => match.item.terms.includes("cegehex")));

  const strokeRecord = searchCorpus({ query: "stroke record guides care", track: "technical-software", limit: 5 });
  assert.ok(strokeRecord.matches.some((match) => match.id === "tech-825"));
  assert.ok(strokeRecord.matches.some((match) => match.item.terms.includes("satakax-ket")));

  const factCheckTruth = searchCorpus({ query: "fact-checking protects visible truth", track: "learner-graded", limit: 5 });
  assert.ok(factCheckTruth.matches.some((match) => match.id === "learner-414"));
  assert.ok(factCheckTruth.matches.some((match) => match.item.terms.includes("fecehek")));
});

test("builds dictionary-grade lookup entries with corpus evidence", () => {
  const stats = dictionaryStats(5);
  assert.equal(stats.schema_version, "0.5.8");
  assert.equal(stats.source_counts.lexicon, 39057);
  assert.equal(stats.source_counts.particle, 39);
  assert.equal(stats.source_counts.pronoun, 16);
  assert.equal(stats.source_counts.compound, 100);
  assert.equal(stats.total_entries, 39212);
  assert.equal(stats.root_families, 1950);
  assert.ok(stats.domain_counts["ai-cognition"] >= 10524);
  assert.ok(stats.domain_counts["science-math"] >= 11370);
  assert.ok(stats.domain_counts["conflict-security"] >= 1948);
  assert.ok(stats.domain_counts["education-training"] >= 5522);
  assert.ok(stats.domain_counts["emotion-psychology"] >= 3692);
  assert.ok(stats.domain_counts["family-kinship"] >= 1662);
  assert.ok(stats.domain_counts["nature-ecology"] >= 4590);
  assert.ok(stats.domain_counts["philosophy-metaphysics"] >= 8512);
  assert.ok(stats.domain_counts["law-governance"] >= 11487);
  assert.ok(stats.domain_counts["body-health"] >= 3406);
  assert.ok(stats.domain_counts["media-communication"] >= 7393);
  assert.ok(stats.domain_counts["technology-software"] >= 7276);
  assert.ok(stats.domain_counts["economics-provision"] >= 7684);
  assert.ok(stats.domain_counts["travel-place"] >= 17983);
  assert.ok(stats.corpus_attested_entries >= 2358);
  assert.ok(stats.top_corpus_entries.length <= 5);

  const rah = lookupDictionary({ query: "rah", exact: true, limit: 10 });
  assert.ok(rah.total_matches >= 1);
  assert.ok(rah.matches.some((match) => match.entry.word === "rah" && match.entry.root === "RH"));
  assert.ok(rah.matches.some((match) => match.entry.corpus.frequency > 0));

  const hener = lookupDictionary({ query: "hener", exact: true, limit: 5 });
  assert.equal(hener.total_matches, 1);
  assert.equal(hener.matches[0].entry.root, "HNR");
  assert.ok(hener.matches[0].entry.meanings.includes("honor, public worth"));

  const honor = lookupDictionary({ query: "honor", limit: 30 });
  assert.ok(honor.matches.some((match) => match.entry.root === "HNR" && match.matched_fields.includes("root_family")));

  const compound = lookupDictionary({ query: "future-binding duty", limit: 10 });
  assert.ok(compound.matches.some((match) => match.entry.word === "fer-dev" && match.entry.source === "compound"));

  const bayesian = lookupDictionary({ query: "Bayesian", limit: 10 });
  assert.ok(bayesian.matches.some((match) => match.entry.root === "BYSN"));

  const microscope = lookupDictionary({ query: "microscope", limit: 10 });
  assert.ok(microscope.matches.some((match) => match.entry.root === "MICR"));

  const transformer = lookupDictionary({ query: "transformer", limit: 10 });
  assert.ok(transformer.matches.some((match) => match.entry.root === "TRFM"));

  const grounding = lookupDictionary({ query: "evidence-tied claim", limit: 10 });
  assert.ok(grounding.matches.some((match) => match.entry.root === "GRND"));

  const classroom = lookupDictionary({ query: "classroom", limit: 20 });
  assert.ok(classroom.matches.some((match) => match.entry.root === "CLSR"));

  const mastery = lookupDictionary({ query: "mastery", limit: 20 });
  assert.ok(mastery.matches.some((match) => match.entry.root === "MSTR"));

  const integrity = lookupDictionary({ query: "academic integrity", limit: 20 });
  assert.ok(integrity.matches.some((match) => match.entry.root === "KCMD"));

  const canopy = lookupDictionary({ query: "canopy", limit: 20 });
  assert.ok(canopy.matches.some((match) => match.entry.root === "CNWY"));

  const aquifer = lookupDictionary({ query: "aquifer", limit: 20 });
  assert.ok(aquifer.matches.some((match) => match.entry.root === "WKFR"));

  const keystone = lookupDictionary({ query: "keystone species", limit: 20 });
  assert.ok(keystone.matches.some((match) => match.entry.root === "KSTN"));

  const maximum = lookupDictionary({ query: "maximum", limit: 20 });
  assert.ok(maximum.matches.some((match) => match.entry.root === "MXMM"));

  const homomorphism = lookupDictionary({ query: "homomorphism", limit: 20 });
  assert.ok(homomorphism.matches.some((match) => match.entry.root === "HMRF"));

  const overwhelm = lookupDictionary({ query: "overwhelm", limit: 20 });
  assert.ok(overwhelm.matches.some((match) => match.entry.root === "VLWH"));

  const vendor = lookupDictionary({ query: "vendor", limit: 20 });
  assert.ok(vendor.matches.some((match) => match.entry.root === "VNDR"));

  const liquidity = lookupDictionary({ query: "liquidity", limit: 20 });
  assert.ok(liquidity.matches.some((match) => match.entry.root === "LKDT"));

  const supplyChain = lookupDictionary({ query: "supply chain", limit: 20 });
  assert.ok(supplyChain.matches.some((match) => match.entry.root === "CHNX"));

  const highway = lookupDictionary({ query: "highway", limit: 20 });
  assert.ok(highway.matches.some((match) => match.entry.root === "HWYX"));

  const passenger = lookupDictionary({ query: "passenger", limit: 20 });
  assert.ok(passenger.matches.some((match) => match.entry.root === "PSSG"));

  const defaultObligation = lookupDictionary({ query: "unmet obligation", limit: 20 });
  assert.ok(defaultObligation.matches.some((match) => match.entry.root === "DFLT"));

  const cough = lookupDictionary({ query: "cough", limit: 20 });
  assert.ok(cough.matches.some((match) => match.entry.root === "CGHX"));

  const stroke = lookupDictionary({ query: "stroke", limit: 20 });
  assert.ok(stroke.matches.some((match) => match.entry.root === "STKX"));

  const headline = lookupDictionary({ query: "headline", limit: 20 });
  assert.ok(headline.matches.some((match) => match.entry.root === "HDLN"));

  const factCheck = lookupDictionary({ query: "fact-check", limit: 20 });
  assert.ok(factCheck.matches.some((match) => match.entry.root === "FCHK"));

  const podcast = lookupDictionary({ query: "podcast", limit: 20 });
  assert.ok(podcast.matches.some((match) => match.entry.root === "PDCST"));

  const functor = lookupDictionary({ query: "functor", limit: 20 });
  assert.ok(functor.matches.some((match) => match.entry.root === "FNCT"));

  const ontology = lookupDictionary({ query: "ontology", limit: 20 });
  assert.ok(ontology.matches.some((match) => match.entry.root === "NTLG"));

  const attachment = lookupDictionary({ query: "bonded dependence", limit: 20 });
  assert.ok(attachment.matches.some((match) => match.entry.root === "TCHM"));

  const planner = lookupDictionary({ query: "planner", limit: 20 });
  assert.ok(planner.matches.some((match) => match.entry.root === "PLNR"));

  const childSupport = lookupDictionary({ query: "child support", limit: 20 });
  assert.ok(childSupport.matches.some((match) => match.entry.root === "CHSP"));
});

test("validates expanded root inventory", () => {
  const report = validateSpec();
  assert.equal(report.valid, true, JSON.stringify(report.errors, null, 2));
  assert.equal(report.stats.roots, 1950);
  assert.equal(report.stats.lexiconEntries, 39057);
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
