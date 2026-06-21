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
  assert.ok(summary.current.actual_lexicon_entries >= 47057);
  assert.ok(summary.current.actual_root_families >= 2350);
  assert.ok(summary.current.actual_corpus_items >= 5240);
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
  assert.equal(corpus.current_items, 5240);
  assert.equal(corpus.remaining_items_v02, 0);
  assert.ok(corpus.tracks.some((track) => track.id === "technical-software"));
  assert.ok(corpus.tracks.every((track) => track.current_items >= 200));
  const trackCounts = new Map(corpus.tracks.map((track) => [track.id, track.current_items]));
  assert.equal(trackCounts.get("daily-dialogues"), 1048);
  assert.equal(trackCounts.get("civic-law"), 786);
  assert.equal(trackCounts.get("ritual-vow"), 786);
  assert.equal(trackCounts.get("technical-software"), 1048);
  assert.equal(trackCounts.get("literary-poetic"), 1048);
  assert.equal(trackCounts.get("learner-graded"), 524);
  assert.ok(governance.root_admission_rules.some((rule) => rule.includes("durable semantic field")));
  assert.ok(governance.review_checklist.some((item) => item.includes("root-depth")));
});

test("recommends the next governed corpus expansion batch", () => {
  const plan = corpusExpansionPlan(120, 6);
  assert.equal(plan.milestone.id, "v1.0");
  assert.equal(plan.current_items, 5240);
  assert.equal(plan.remaining_items_to_milestone, 4760);
  assert.equal(plan.recommended_batch_size, 120);

  const recommendations = new Map(plan.track_recommendations.map((track) => [track.id, track]));
  assert.equal(recommendations.get("daily-dialogues")?.recommended_items, 24);
  assert.equal(recommendations.get("civic-law")?.recommended_items, 18);
  assert.equal(recommendations.get("ritual-vow")?.recommended_items, 18);
  assert.equal(recommendations.get("technical-software")?.recommended_items, 24);
  assert.equal(recommendations.get("literary-poetic")?.recommended_items, 24);
  assert.equal(recommendations.get("learner-graded")?.recommended_items, 12);
  assert.equal(recommendations.get("daily-dialogues")?.next_item_ids[0], "daily-1049");
  assert.equal(recommendations.get("civic-law")?.next_item_ids[0], "civic-787");
  assert.equal(recommendations.get("ritual-vow")?.next_item_ids[0], "ritual-787");
  assert.equal(recommendations.get("technical-software")?.next_item_ids[0], "tech-1049");
  assert.equal(recommendations.get("technical-software")?.next_item_ids.at(-1), "tech-1072");
  assert.equal(recommendations.get("literary-poetic")?.next_item_ids[0], "poetic-1049");
  assert.equal(recommendations.get("learner-graded")?.next_item_ids[0], "learner-525");
  assert.equal(plan.domain_pressure[0].id, "nature-ecology");
  assert.ok(plan.domain_pressure.some((domain) => domain.id === "philosophy-metaphysics"));
  assert.ok(plan.domain_pressure.some((domain) => domain.id === "emotion-psychology"));
  assert.ok(plan.domain_pressure.some((domain) => domain.id === "ai-cognition"));
  assert.ok(plan.domain_pressure.some((domain) => domain.id === "nature-ecology"));
});

test("lists and validates reviewed corpus items", () => {
  const technicalItems = listCorpusItems("technical-software");
  assert.equal(technicalItems.length, 1048);
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
  assert.ok(technicalItems.some((item) => item.ethra === "Fenecet taw den."));
  assert.ok(technicalItems.some((item) => item.ethra === "Menedex dav den."));
  assert.ok(technicalItems.some((item) => item.ethra === "Feretex rah seg."));
  assert.ok(technicalItems.some((item) => item.ethra === "Senepet xap den."));
  assert.ok(technicalItems.some((item) => item.ethra === "Secefel ban dak."));
  assert.ok(technicalItems.some((item) => item.ethra === "Faradag-ket xap den."));
  assert.ok(technicalItems.some((item) => item.ethra === "Tarafac-ket pat den."));
  assert.ok(technicalItems.some((item) => item.ethra === "Iamagar-ket pat den."));
  assert.ok(technicalItems.some((item) => item.ethra === "Daiaman-ket ban med."));
  assert.ok(technicalItems.some((item) => item.ethra === "Cafasac-ket rah den."));
  assert.ok(technicalItems.some((item) => item.ethra === "Varafay-ket xap reles."));
  assert.ok(technicalItems.some((item) => item.ethra === "Sabasad-ket rah kav."));
  assert.ok(technicalItems.some((item) => item.ethra === "Sacaaax-ket rah hal."));
  assert.ok(technicalItems.some((item) => item.ethra === "Natarax-ket nam may."));
  assert.ok(technicalItems.some((item) => item.ethra === "Kapatax-ket nam wed."));
  assert.ok(technicalItems.some((item) => item.ethra === "Vanaxar-ket pat jav."));
  assert.ok(technicalItems.some((item) => item.ethra === "Eanatar-ket rah den."));
  assert.ok(technicalItems.some((item) => item.ethra === "Banacah-ket nam mas."));
  assert.ok(technicalItems.some((item) => item.ethra === "Oavafat-ket rah kav."));
  assert.ok(technicalItems.some((item) => item.ethra === "Aabalat-ket rah med."));
  assert.ok(technicalItems.some((item) => item.ethra === "Eaxaoar-ket dav rag."));
  assert.ok(technicalItems.some((item) => item.ethra === "Dasanaf-ket mak lem."));
  assert.ok(technicalItems.some((item) => item.ethra === "Manapay-ket pat may."));
  assert.ok(technicalItems.some((item) => item.ethra === "Darasaf-ket xap fer."));
  assert.ok(technicalItems.some((item) => item.ethra === "Bajacaf-ket pat med."));
  assert.ok(technicalItems.some((item) => item.ethra === "Daharax-ket xap hal."));
  assert.ok(technicalItems.some((item) => item.ethra === "Davasax-ket rah kav."));
  assert.ok(technicalItems.some((item) => item.ethra === "Waracal-ket xap xeg."));
  assert.ok(technicalItems.some((item) => item.ethra === "Madacad-ket pat med."));
  assert.ok(technicalItems.some((item) => item.ethra === "Datacad-ket taw den."));
  assert.ok(technicalItems.some((item) => item.ethra === "Falafam-ket xap rekeset."));
  assert.ok(technicalItems.some((item) => item.ethra === "Paratal-ket xap den."));
  assert.ok(technicalItems.some((item) => item.ethra === "Rafalad-ket pat hal."));
  assert.ok(technicalItems.some((item) => item.ethra === "Ranabak-ket dak lem."));
  assert.ok(technicalItems.some((item) => item.ethra === "Salagan-ket dav serevec."));
  assert.ok(technicalItems.some((item) => item.ethra === "Dapalay-ket taw den."));
  assert.ok(technicalItems.some((item) => item.ethra === "Cataxaw-ket xap mer."));
  assert.ok(technicalItems.some((item) => item.ethra === "Takabaj-ket taw den."));
  assert.ok(technicalItems.some((item) => item.ethra === "Halacan-ket rah xeg."));
  assert.ok(technicalItems.some((item) => item.ethra === "Talacal-ket taw dev."));
  assert.ok(technicalItems.some((item) => item.ethra === "Raaagax-ket xap den."));
  assert.ok(technicalItems.some((item) => item.ethra === "Vadabax-ket xap den."));

  const report = validateCorpus();
  assert.equal(report.valid, true, JSON.stringify(report.errors, null, 2));
  assert.equal(report.stats.items, 5240);
  assert.equal(report.stats.tracks, 6);
  assert.equal(report.stats.domains, 18);
  assert.ok(report.stats.uniqueTerms >= 3215);
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

  const plannerPath = searchCorpus({ query: "planner names the path", track: "daily-dialogues", limit: 5 });
  assert.ok(plannerPath.matches.some((match) => match.id === "daily-833"));
  assert.ok(plannerPath.matches.some((match) => match.item.terms.includes("pelener")));

  const monadContext = searchCorpus({ query: "monad binds context", track: "technical-software", limit: 5 });
  assert.ok(monadContext.matches.some((match) => match.id === "tech-834"));
  assert.ok(monadContext.matches.some((match) => match.item.terms.includes("menedex")));

  const boundaryLove = searchCorpus({ query: "boundary protects love", track: "learner-graded", limit: 5 });
  assert.ok(boundaryLove.matches.some((match) => match.id === "learner-420"));
  assert.ok(boundaryLove.matches.some((match) => match.item.terms.includes("benedey")));

  const childSupportDuty = searchCorpus({ query: "child support carries duty", track: "learner-graded", limit: 5 });
  assert.ok(childSupportDuty.matches.some((match) => match.id === "learner-427"));
  assert.ok(childSupportDuty.matches.some((match) => match.item.terms.includes("cehesep")));

  const refrigeratorProvision = searchCorpus({ query: "refrigerator protects provision", track: "daily-dialogues", limit: 5 });
  assert.ok(refrigeratorProvision.matches.some((match) => match.id === "daily-857"));
  assert.ok(refrigeratorProvision.matches.some((match) => match.item.terms.includes("feredeg")));

  const evictionDuty = searchCorpus({ query: "eviction filing protects duty", track: "civic-law", limit: 5 });
  assert.ok(evictionDuty.matches.some((match) => match.id === "civic-643"));
  assert.ok(evictionDuty.matches.some((match) => match.item.terms.includes("eavacax-da")));

  const cemeteryNames = searchCorpus({ query: "cemetery remembers names", track: "literary-poetic", limit: 5 });
  assert.ok(cemeteryNames.matches.some((match) => match.id === "poetic-857"));
  assert.ok(cemeteryNames.matches.some((match) => match.item.terms.includes("cemetey")));

  const dimensionModel = searchCorpus({ query: "dimension names the model", track: "daily-dialogues", limit: 5 });
  assert.ok(dimensionModel.matches.some((match) => match.id === "daily-881"));
  assert.ok(dimensionModel.matches.some((match) => match.item.terms.includes("deiemen")));

  const deforestationReport = searchCorpus({ query: "deforestation report reveals harm", track: "civic-law", limit: 5 });
  assert.ok(deforestationReport.matches.some((match) => match.id === "civic-664"));
  assert.ok(deforestationReport.matches.some((match) => match.item.terms.includes("dafaras-da")));

  const learnerCeasefire = searchCorpus({ query: "ceasefire binds force", track: "learner-graded", limit: 5 });
  assert.ok(learnerCeasefire.matches.some((match) => match.id === "learner-452"));
  assert.ok(learnerCeasefire.matches.some((match) => match.item.terms.includes("cefeier")));

  const scarcityNeed = searchCorpus({ query: "scarcity names need", track: "daily-dialogues", limit: 5 });
  assert.ok(scarcityNeed.matches.some((match) => match.id === "daily-905"));
  assert.ok(scarcityNeed.matches.some((match) => match.item.terms.includes("seceaex")));

  const emissionsHarm = searchCorpus({ query: "emissions reveal harm", track: "learner-graded", limit: 5 });
  assert.ok(emissionsHarm.matches.some((match) => match.id === "learner-458"));
  assert.ok(emissionsHarm.matches.some((match) => match.item.terms.includes("mesesen")));

  const idempotenceRelease = searchCorpus({ query: "idempotence protects release", track: "learner-graded", limit: 5 });
  assert.ok(idempotenceRelease.matches.some((match) => match.id === "learner-461"));
  assert.ok(idempotenceRelease.matches.some((match) => match.item.terms.includes("repesef")));

  const entropyEmptiness = searchCorpus({ query: "entropy reveals emptiness", track: "daily-dialogues", limit: 5 });
  assert.ok(entropyEmptiness.matches.some((match) => match.id === "daily-929"));
  assert.ok(entropyEmptiness.matches.some((match) => match.item.terms.includes("eeneter")));

  const overfittingRisk = searchCorpus({ query: "overfitting log reveals risk", track: "technical-software", limit: 5 });
  assert.ok(overfittingRisk.matches.some((match) => match.id === "tech-949"));
  assert.ok(overfittingRisk.matches.some((match) => match.item.terms.includes("oavafat-ket")));

  const benchmarkMeasure = searchCorpus({ query: "benchmark names measure", track: "learner-graded", limit: 5 });
  assert.ok(benchmarkMeasure.matches.some((match) => match.id === "learner-476"));
  assert.ok(benchmarkMeasure.matches.some((match) => match.item.terms.includes("beneceh")));

  const subsidiarityPeople = searchCorpus({ query: "subsidiarity protects people", track: "daily-dialogues", limit: 5 });
  assert.ok(subsidiarityPeople.matches.some((match) => match.id === "daily-953"));
  assert.ok(subsidiarityPeople.matches.some((match) => match.item.terms.includes("sebeder")));

  const monetaryPolicy = searchCorpus({ query: "monetary policy log guides money", track: "technical-software", limit: 5 });
  assert.ok(monetaryPolicy.matches.some((match) => match.id === "tech-969"));
  assert.ok(monetaryPolicy.matches.some((match) => match.item.terms.includes("manapay-ket")));

  const credibilityEvidence = searchCorpus({ query: "credibility protects evidence", track: "learner-graded", limit: 5 });
  assert.ok(credibilityEvidence.matches.some((match) => match.id === "learner-488"));
  assert.ok(credibilityEvidence.matches.some((match) => match.item.terms.includes("ceredeb")));

  const qualia = searchCorpus({ query: "qualia reveals inner life", track: "daily-dialogues", limit: 5 });
  assert.ok(qualia.matches.some((match) => match.id === "daily-977"));
  assert.ok(qualia.matches.some((match) => match.item.terms.includes("keleyex")));

  const modelCard = searchCorpus({ query: "model card log guides model", track: "technical-software", limit: 5 });
  assert.ok(modelCard.matches.some((match) => match.id === "tech-999"));
  assert.ok(modelCard.matches.some((match) => match.item.terms.includes("madacad-ket")));

  const habeasCorpus = searchCorpus({ query: "habeas corpus protects justice", track: "learner-graded", limit: 5 });
  assert.ok(habeasCorpus.matches.some((match) => match.id === "learner-496"));
  assert.ok(habeasCorpus.matches.some((match) => match.item.terms.includes("hebesec")));

  const formRecord = searchCorpus({ query: "form protects record", track: "daily-dialogues", limit: 5 });
  assert.ok(formRecord.matches.some((match) => match.id === "daily-1001"));
  assert.ok(formRecord.matches.some((match) => match.item.terms.includes("feremel")));

  const portalLog = searchCorpus({ query: "portal log protects data", track: "technical-software", limit: 5 });
  assert.ok(portalLog.matches.some((match) => match.id === "tech-1008"));
  assert.ok(portalLog.matches.some((match) => match.item.terms.includes("paratal-ket")));

  const backfillMemory = searchCorpus({ query: "backfill repairs memory", track: "learner-graded", limit: 5 });
  assert.ok(backfillMemory.matches.some((match) => match.id === "learner-512"));
  assert.ok(backfillMemory.matches.some((match) => match.item.terms.includes("bekefel")));

  const blendedFamily = searchCorpus({ query: "blended family protects child", track: "daily-dialogues", limit: 5 });
  assert.ok(blendedFamily.matches.some((match) => match.id === "daily-1025"));
  assert.ok(blendedFamily.matches.some((match) => match.item.terms.includes("belefem")));

  const contextWindow = searchCorpus({ query: "context-window log protects memory", track: "technical-software", limit: 5 });
  assert.ok(contextWindow.matches.some((match) => match.id === "tech-1025"));
  assert.ok(contextWindow.matches.some((match) => match.item.terms.includes("cataxaw-ket")));

  const victimServices = searchCorpus({ query: "victim services repairs care", track: "learner-graded", limit: 5 });
  assert.ok(victimServices.matches.some((match) => match.id === "learner-524"));
  assert.ok(victimServices.matches.some((match) => match.item.terms.includes("vecesev")));
});

test("builds dictionary-grade lookup entries with corpus evidence", () => {
  const stats = dictionaryStats(5);
  assert.equal(stats.schema_version, "0.5.8");
  assert.equal(stats.source_counts.lexicon, 47057);
  assert.equal(stats.source_counts.particle, 39);
  assert.equal(stats.source_counts.pronoun, 16);
  assert.equal(stats.source_counts.compound, 100);
  assert.equal(stats.total_entries, 47212);
  assert.equal(stats.root_families, 2350);
  assert.ok(stats.domain_counts["ai-cognition"] >= 12884);
  assert.ok(stats.domain_counts["art-beauty"] >= 6685);
  assert.ok(stats.domain_counts["science-math"] >= 13570);
  assert.ok(stats.domain_counts["conflict-security"] >= 2348);
  assert.ok(stats.domain_counts["daily-life"] >= 2799);
  assert.ok(stats.domain_counts["education-training"] >= 6842);
  assert.ok(stats.domain_counts["emotion-psychology"] >= 4272);
  assert.ok(stats.domain_counts["family-kinship"] >= 1842);
  assert.ok(stats.domain_counts["history-memory"] >= 1593);
  assert.ok(stats.domain_counts["nature-ecology"] >= 5350);
  assert.ok(stats.domain_counts["philosophy-metaphysics"] >= 10092);
  assert.ok(stats.domain_counts["law-governance"] >= 13807);
  assert.ok(stats.domain_counts["body-health"] >= 3406);
  assert.ok(stats.domain_counts["media-communication"] >= 8893);
  assert.ok(stats.domain_counts["ritual-spiritual"] >= 3970);
  assert.ok(stats.domain_counts["technology-software"] >= 8776);
  assert.ok(stats.domain_counts["economics-provision"] >= 8664);
  assert.ok(stats.domain_counts["travel-place"] >= 22403);
  assert.ok(stats.corpus_attested_entries >= 3260);
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

  const refrigerator = lookupDictionary({ query: "refrigerator", limit: 20 });
  assert.ok(refrigerator.matches.some((match) => match.entry.root === "FRDG"));

  const eviction = lookupDictionary({ query: "eviction", limit: 20 });
  assert.ok(eviction.matches.some((match) => match.entry.root === "EVCX"));

  const laborUnion = lookupDictionary({ query: "labor union", limit: 20 });
  assert.ok(laborUnion.matches.some((match) => match.entry.root === "LBRN"));

  const referendum = lookupDictionary({ query: "referendum", limit: 20 });
  assert.ok(referendum.matches.some((match) => match.entry.root === "RFRD"));

  const copyright = lookupDictionary({ query: "copyright", limit: 20 });
  assert.ok(copyright.matches.some((match) => match.entry.root === "CPYR"));

  const traffic = lookupDictionary({ query: "traffic", limit: 20 });
  assert.ok(traffic.matches.some((match) => match.entry.root === "TRFC"));

  const cemetery = lookupDictionary({ query: "cemetery", limit: 20 });
  assert.ok(cemetery.matches.some((match) => match.entry.root === "CMTY"));

  const artifact = lookupDictionary({ query: "artifact", limit: 20 });
  assert.ok(artifact.matches.some((match) => match.entry.root === "ARTF"));

  const dimension = lookupDictionary({ query: "dimension", limit: 20 });
  assert.ok(dimension.matches.some((match) => match.entry.root === "DIMN"));

  const necessity = lookupDictionary({ query: "necessity", limit: 20 });
  assert.ok(necessity.matches.some((match) => match.entry.root === "NCST"));

  const disgust = lookupDictionary({ query: "disgust", limit: 20 });
  assert.ok(disgust.matches.some((match) => match.entry.root === "DGST"));

  const reforestation = lookupDictionary({ query: "reforestation", limit: 20 });
  assert.ok(reforestation.matches.some((match) => match.entry.root === "RFRS"));

  const confidenceScore = lookupDictionary({ query: "confidence score", limit: 20 });
  assert.ok(confidenceScore.matches.some((match) => match.entry.root === "CFSC"));

  const asylum = lookupDictionary({ query: "asylum", limit: 20 });
  assert.ok(asylum.matches.some((match) => match.entry.root === "ASYL"));

  const ceasefire = lookupDictionary({ query: "ceasefire", limit: 20 });
  assert.ok(ceasefire.matches.some((match) => match.entry.root === "CFIR"));

  const scarcity = lookupDictionary({ query: "scarcity", limit: 20 });
  assert.ok(scarcity.matches.some((match) => match.entry.root === "SCAX"));

  const equityStake = lookupDictionary({ query: "equity stake", limit: 20 });
  assert.ok(equityStake.matches.some((match) => match.entry.root === "KSX"));

  const coordinate = lookupDictionary({ query: "kepetex", exact: true, limit: 20 });
  assert.ok(coordinate.matches.some((match) => match.entry.root === "KPTX"));

  const sequestration = lookupDictionary({ query: "sequestration", limit: 20 });
  assert.ok(sequestration.matches.some((match) => match.entry.root === "SKST"));

  const idempotence = lookupDictionary({ query: "repeat-safe action", limit: 20 });
  assert.ok(idempotence.matches.some((match) => match.entry.root === "RPSF"));

  const formativeAssessment = lookupDictionary({ query: "formative assessment", limit: 20 });
  assert.ok(formativeAssessment.matches.some((match) => match.entry.root === "FMAS"));

  const entropy = lookupDictionary({ query: "entropy", limit: 20 });
  assert.ok(entropy.matches.some((match) => match.entry.root === "ENTR"));

  const pragmatics = lookupDictionary({ query: "meaning-in-use", limit: 20 });
  assert.ok(pragmatics.matches.some((match) => match.entry.root === "PRGX"));

  const overfitting = lookupDictionary({ query: "overfitting", limit: 20 });
  assert.ok(overfitting.matches.some((match) => match.entry.root === "OVFT"));

  const nitrogen = lookupDictionary({ query: "nitrogen", limit: 20 });
  assert.ok(nitrogen.matches.some((match) => match.entry.root === "NTRG"));

  const dueProcess = lookupDictionary({ query: "due process", limit: 20 });
  assert.ok(dueProcess.matches.some((match) => match.entry.root === "DPRS"));

  const disinformation = lookupDictionary({ query: "disinformation", limit: 20 });
  assert.ok(disinformation.matches.some((match) => match.entry.root === "DSNF"));

  const monetaryPolicy = lookupDictionary({ query: "monetary policy", limit: 20 });
  assert.ok(monetaryPolicy.matches.some((match) => match.entry.root === "MNPY"));

  const publicTrust = lookupDictionary({ query: "public trust", limit: 20 });
  assert.ok(publicTrust.matches.some((match) => match.entry.root === "PTRS"));

  const fiduciaryDuty = lookupDictionary({ query: "fiduciary duty", limit: 20 });
  assert.ok(fiduciaryDuty.matches.some((match) => match.entry.root === "FDCY"));

  const qualia = lookupDictionary({ query: "qualia", limit: 20 });
  assert.ok(qualia.matches.some((match) => match.entry.root === "KLYX"));

  const intentionality = lookupDictionary({ query: "intentionality", limit: 20 });
  assert.ok(intentionality.matches.some((match) => match.entry.root === "NTNL"));

  const objectiveFunction = lookupDictionary({ query: "objective function", limit: 20 });
  assert.ok(objectiveFunction.matches.some((match) => match.entry.root === "BJCF"));

  const biomarker = lookupDictionary({ query: "biomarker", limit: 20 });
  assert.ok(biomarker.matches.some((match) => match.entry.root === "BMRK"));

  const microbiome = lookupDictionary({ query: "microbiome", limit: 20 });
  assert.ok(microbiome.matches.some((match) => match.entry.root === "MCRB"));

  const modelCard = lookupDictionary({ query: "model card", limit: 20 });
  assert.ok(modelCard.matches.some((match) => match.entry.root === "MDCD"));

  const safetyCase = lookupDictionary({ query: "safety case", limit: 20 });
  assert.ok(safetyCase.matches.some((match) => match.entry.root === "SFTC"));

  const arbitration = lookupDictionary({ query: "arbitration", limit: 20 });
  assert.ok(arbitration.matches.some((match) => match.entry.root === "YRBT"));

  const habeasCorpus = lookupDictionary({ query: "habeas corpus", limit: 20 });
  assert.ok(habeasCorpus.matches.some((match) => match.entry.root === "HBSC"));

  const warCrime = lookupDictionary({ query: "war crime", limit: 20 });
  assert.ok(warCrime.matches.some((match) => match.entry.root === "WCRM"));

  const application = lookupDictionary({ query: "submitted request", limit: 20 });
  assert.ok(application.matches.some((match) => match.entry.root === "PPLN"));

  const eligibility = lookupDictionary({ query: "eligibility", limit: 20 });
  assert.ok(eligibility.matches.some((match) => match.entry.root === "YLGB"));

  const benefit = lookupDictionary({ query: "owed provision", limit: 20 });
  assert.ok(benefit.matches.some((match) => match.entry.root === "BNFT"));

  const helpDesk = lookupDictionary({ query: "help desk", limit: 20 });
  assert.ok(helpDesk.matches.some((match) => match.entry.root === "HLDP"));

  const ticket = lookupDictionary({ query: "tracked work unit", limit: 20 });
  assert.ok(ticket.matches.some((match) => match.entry.root === "TCKT"));

  const servicePortal = lookupDictionary({ query: "service doorway", limit: 20 });
  assert.ok(servicePortal.matches.some((match) => match.entry.root === "PRTL"));

  const refill = lookupDictionary({ query: "renewed supply", limit: 20 });
  assert.ok(refill.matches.some((match) => match.entry.root === "RFLD"));

  const runbook = lookupDictionary({ query: "operational instruction record", limit: 20 });
  assert.ok(runbook.matches.some((match) => match.entry.root === "RNBK"));

  const serviceLevel = lookupDictionary({ query: "service-level agreement", limit: 20 });
  assert.ok(serviceLevel.matches.some((match) => match.entry.root === "SLGN"));

  const backfill = lookupDictionary({ query: "later gap filling", limit: 20 });
  assert.ok(backfill.matches.some((match) => match.entry.root === "BKFL"));

  const blendedFamily = lookupDictionary({ query: "blended family", limit: 30 });
  assert.ok(blendedFamily.matches.some((match) => match.entry.root === "BLFM"));

  const obsession = lookupDictionary({ query: "obsession", limit: 30 });
  assert.ok(obsession.matches.some((match) => match.entry.root === "BSSN"));

  const rubric = lookupDictionary({ query: "explicit judgment frame", limit: 30 });
  assert.ok(rubric.matches.some((match) => match.entry.root === "RBRX"));

  const contextWindow = lookupDictionary({ query: "context window", limit: 30 });
  assert.ok(contextWindow.matches.some((match) => match.entry.root === "CTXW"));

  const hallucination = lookupDictionary({ query: "fluent false output", limit: 30 });
  assert.ok(hallucination.matches.some((match) => match.entry.root === "HLCN"));

  const wetland = lookupDictionary({ query: "water-held land", limit: 30 });
  assert.ok(wetland.matches.some((match) => match.entry.root === "WTLN"));

  const incidentCommand = lookupDictionary({ query: "incident command", limit: 30 });
  assert.ok(incidentCommand.matches.some((match) => match.entry.root === "NCMD"));

  const victimServices = lookupDictionary({ query: "victim services", limit: 30 });
  assert.ok(victimServices.matches.some((match) => match.entry.root === "VCSV"));
});

test("validates expanded root inventory", () => {
  const report = validateSpec();
  assert.equal(report.valid, true, JSON.stringify(report.errors, null, 2));
  assert.equal(report.stats.roots, 2350);
  assert.equal(report.stats.lexiconEntries, 47057);
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
