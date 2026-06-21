const test = require("node:test");
const assert = require("node:assert/strict");

const { analyzeWord } = require("../dist/analyzers/analyze.js");
const { parseSentence } = require("../dist/analyzers/sentence.js");
const { styleCheck } = require("../dist/analyzers/style.js");
const { findExample } = require("../dist/core/examples.js");
const { flattenLexicon } = require("../dist/core/spec.js");
const { validateWord } = require("../dist/core/phonology.js");
const { createCompound } = require("../dist/generators/compound.js");
const { deriveWord, findRoot } = require("../dist/generators/derivation.js");
const { proposeTerm } = require("../dist/generators/proposal.js");

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

  const hardware = deriveWord("HWR", "noun");
  assert.equal(hardware.word, "hewer");
  assert.equal(hardware.root.id, "HWR");

  const commitRecord = deriveWord("KMT", "record");
  assert.equal(commitRecord.word, "kamat-ket");
  assert.equal(commitRecord.root.id, "KMT");

  const probability = deriveWord("PBL", "noun");
  assert.equal(probability.word, "pebel");
  assert.equal(probability.root.id, "PBL");

  const heritage = deriveWord("HTY", "civic-legal");
  assert.equal(heritage.word, "hatay-da");
  assert.equal(heritage.root.id, "HTY");

  const orchestration = deriveWord("RKC", "noun");
  assert.equal(orchestration.word, "rekec");
  assert.equal(orchestration.root.id, "RKC");

  const permission = deriveWord("PMN", "civic-legal");
  assert.equal(permission.word, "paman-da");
  assert.equal(permission.root.id, "PMN");

  const triage = deriveWord("TRJ", "noun");
  assert.equal(triage.word, "terej");
  assert.equal(triage.root.id, "TRJ");

  const mentalHealth = deriveWord("MHL", "noun");
  assert.equal(mentalHealth.word, "mehel");
  assert.equal(mentalHealth.root.id, "MHL");

  const ecosystem = deriveWord("KLG", "noun");
  assert.equal(ecosystem.word, "keleg");
  assert.equal(ecosystem.root.id, "KLG");

  const experiment = deriveWord("XLP", "noun");
  assert.equal(experiment.word, "xelep");
  assert.equal(experiment.root.id, "XLP");

  const logging = deriveWord("LGC", "record");
  assert.equal(logging.word, "lagac-ket");
  assert.equal(logging.root.id, "LGC");

  const variable = deriveWord("VRB", "noun");
  assert.equal(variable.word, "vereb");
  assert.equal(variable.root.id, "VRB");

  const shirt = deriveWord("SHRT", "noun");
  assert.equal(shirt.word, "seheret");
  assert.equal(shirt.root.id, "SHRT");

  const trousers = deriveWord("TRSR", "noun");
  assert.equal(trousers.word, "tereser");
  assert.equal(trousers.root.id, "TRSR");

  const jacket = deriveWord("JKT", "noun");
  assert.equal(jacket.word, "jeket");
  assert.equal(jacket.root.id, "JKT");

  const shoe = deriveWord("CWH", "noun");
  assert.equal(shoe.word, "ceweh");
  assert.equal(shoe.root.id, "CWH");

  const bread = deriveWord("BRX", "noun");
  assert.equal(bread.word, "berex");
  assert.equal(bread.root.id, "BRX");

  const fruit = deriveWord("FRJ", "noun");
  assert.equal(fruit.word, "ferej");
  assert.equal(fruit.root.id, "FRJ");

  const vegetable = deriveWord("VGJ", "noun");
  assert.equal(vegetable.word, "vegej");
  assert.equal(vegetable.root.id, "VGJ");

  const pillow = deriveWord("PLW", "noun");
  assert.equal(pillow.word, "pelew");
  assert.equal(pillow.root.id, "PLW");

  const soap = deriveWord("SWP", "noun");
  assert.equal(soap.word, "sewep");
  assert.equal(soap.root.id, "SWP");

  const wallet = deriveWord("WLT", "noun");
  assert.equal(wallet.word, "welet");
  assert.equal(wallet.root.id, "WLT");

  const address = deriveWord("DRS", "noun");
  assert.equal(address.word, "deres");
  assert.equal(address.root.id, "DRS");

  const knife = deriveWord("KNF", "noun");
  assert.equal(knife.word, "kenef");
  assert.equal(knife.root.id, "KNF");

  const cup = deriveWord("KWP", "noun");
  assert.equal(cup.word, "kewep");
  assert.equal(cup.root.id, "KWP");

  const umbrella = deriveWord("MBRL", "noun");
  assert.equal(umbrella.word, "meberel");
  assert.equal(umbrella.root.id, "MBRL");

  const carpentry = deriveWord("CRPN", "noun");
  assert.equal(carpentry.word, "cerepen");
  assert.equal(carpentry.root.id, "CRPN");

  const physician = deriveWord("PHYS", "noun");
  assert.equal(physician.word, "peheyes");
  assert.equal(physician.root.id, "PHYS");

  const lawyer = deriveWord("LWRX", "noun");
  assert.equal(lawyer.word, "lewerex");
  assert.equal(lawyer.root.id, "LWRX");

  const programmer = deriveWord("PRGR", "noun");
  assert.equal(programmer.word, "pereger");
  assert.equal(programmer.root.id, "PRGR");

  const warden = deriveWord("WRDN", "noun");
  assert.equal(warden.word, "wereden");
  assert.equal(warden.root.id, "WRDN");

  const dog = deriveWord("KYNX", "noun");
  assert.equal(dog.word, "keyenex");
  assert.equal(dog.root.id, "KYNX");

  const chicken = deriveWord("CHKN", "noun");
  assert.equal(chicken.word, "ceheken");
  assert.equal(chicken.root.id, "CHKN");

  const bee = deriveWord("BYX", "noun");
  assert.equal(bee.word, "beyex");
  assert.equal(bee.root.id, "BYX");

  const farm = deriveWord("FRMX", "noun");
  assert.equal(farm.word, "feremex");
  assert.equal(farm.root.id, "FRMX");

  const vineyard = deriveWord("VYND", "noun");
  assert.equal(vineyard.word, "veyened");
  assert.equal(vineyard.root.id, "VYND");

  const scarcity = deriveWord("SCAX", "noun");
  assert.equal(scarcity.word, "seceaex");
  assert.equal(scarcity.root.id, "SCAX");

  const coordinate = deriveWord("KPTX", "noun");
  assert.equal(coordinate.word, "kepetex");
  assert.equal(coordinate.root.id, "KPTX");

  const idempotence = deriveWord("RPSF", "noun");
  assert.equal(idempotence.word, "repesef");
  assert.equal(idempotence.root.id, "RPSF");

  const formativeAssessment = deriveWord("FMAS", "noun");
  assert.equal(formativeAssessment.word, "femeaes");
  assert.equal(formativeAssessment.root.id, "FMAS");
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

test("parses Ethra sentence clause slots", () => {
  const civicChoice = parseSentence("Pu na vel dev se so-lem.");
  assert.equal(civicChoice.valid, true);
  assert.equal(civicChoice.clause.pattern, "canonical-svo");
  assert.equal(civicChoice.clause.register_markers[0].text, "pu");
  assert.equal(civicChoice.clause.subject.text, "na");
  assert.deepEqual(civicChoice.clause.particle_chain.map((item) => item.text), ["vel"]);
  assert.equal(civicChoice.clause.predicate.text, "dev se");
  assert.deepEqual(civicChoice.clause.scopes.map((item) => item.text), ["so-lem"]);

  const vow = parseSentence("Na dov tar mo mik.");
  assert.equal(vow.clause.pattern, "canonical-svo");
  assert.equal(vow.clause.subject.text, "na");
  assert.deepEqual(vow.clause.particle_chain.map((item) => item.text), ["dov"]);
  assert.equal(vow.clause.predicate.text, "tar");
  assert.equal(vow.clause.object.text, "mo mik");

  const copular = parseSentence("Mav e reh.");
  assert.equal(copular.clause.pattern, "copular");
  assert.equal(copular.clause.subject.text, "mav");
  assert.equal(copular.clause.predicate.text, "e");
  assert.equal(copular.clause.complements[0].text, "reh");

  const imperative = parseSentence("Ke rah na.");
  assert.equal(imperative.clause.pattern, "imperative");
  assert.equal(imperative.clause.sentence_mood[0].text, "ke");
  assert.equal(imperative.clause.predicate.text, "rah");
  assert.equal(imperative.clause.object.text, "na");

  const question = parseSentence("Ya ta mar?");
  assert.equal(question.clause.pattern, "question");
  assert.equal(question.clause.sentence_mood[0].text, "ya");
  assert.equal(question.clause.subject.text, "ta");
  assert.equal(question.clause.predicate.text, "mar");

  const invalid = parseSentence("Na qra dev.");
  assert.equal(invalid.valid, false);
  assert.ok(invalid.issues.some((issue) => issue.code === "phonology"));
});

test("checks Ethra style for register, agency, and phonology", () => {
  const civic = styleCheck({
    text: "Pu na vel dev se so-lem.",
    register: "civic",
    requireMoralAgency: true,
    requireScope: true
  });
  assert.equal(civic.valid, true);
  assert.equal(civic.issue_counts.error, 0);
  assert.equal(civic.issue_counts.warning, 0);
  assert.ok(civic.observed.moral_particles.includes("vel"));
  assert.ok(civic.observed.scope_particles.includes("so-lem"));
  assert.ok(civic.observed.register_markers.includes("pu"));

  const imperative = styleCheck({ text: "Ke rah na." });
  assert.equal(imperative.valid, true);
  assert.ok(imperative.issues.some((issue) => issue.code === "address-implicit"));
  assert.equal(imperative.issues.some((issue) => issue.code === "moral-agency-implicit"), false);

  const weakVow = styleCheck({ text: "Na dov tar mo mik.", requireScope: true });
  assert.equal(weakVow.valid, true);
  assert.ok(weakVow.issues.some((issue) => issue.code === "scope-implicit"));
  assert.ok(weakVow.issues.some((issue) => issue.code === "vow-witness-implicit"));

  const invalid = styleCheck({ text: "Na qra dev." });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.issues.some((issue) => issue.code === "phonology"));
});

test("creates compounds", () => {
  const compound = createCompound(["fer", "dev"], "future-binding duty");
  assert.equal(compound.word, "fer-dev");
  assert.equal(compound.meaning, "future-binding duty");
});

test("creates governed term proposal packets", () => {
  const rootProposal = proposeTerm({
    field: "sacred attention",
    kind: "root",
    root: "RAH",
    domain: "ritual-spiritual",
    register: "ritual",
    gloss: "attention placed before sacred witness",
    example: "Ha rah fen."
  });
  assert.equal(rootProposal.status, "candidate");
  assert.equal(rootProposal.kind, "root");
  assert.equal(rootProposal.candidate.root, "RH");
  assert.ok(rootProposal.warnings.some((warning) => warning.includes("collides")));
  assert.ok(rootProposal.governance.missing_requirements.includes("no obvious collision"));

  const compoundProposal = proposeTerm({
    field: "honor-bound duty",
    kind: "compound",
    components: ["hener", "dev"],
    domain: "philosophy-metaphysics",
    register: "civic",
    gloss: "duty bound to public honor",
    example: "Hener-dev xap lem."
  });
  assert.equal(compoundProposal.kind, "compound");
  assert.equal(compoundProposal.candidate.word, "hener-dev");
  assert.equal(compoundProposal.candidate.valid_phonology, true);
  assert.deepEqual(compoundProposal.governance.missing_requirements, []);
});

test("loads canonical example translations", () => {
  const example = findExample("8");
  assert.equal(example.ethra, "Na dov tar mo mik.");
  assert.match(example.cultural_notes, /Repair/);
});

test("lexicon contains the expanded seed breadth", () => {
  const entries = flattenLexicon();
  const categories = new Set(entries.map((entry) => entry.category));
  assert.ok(entries.length >= 27000);
  assert.ok(entries.some((entry) => entry.word === "hener" && entry.meaning === "honor, public worth"));
  assert.ok(entries.some((entry) => entry.word === "cereg" && entry.meaning === "courage, brave duty"));
  assert.ok(entries.some((entry) => entry.word === "kenen" && entry.meaning === "canon, received standard"));
  assert.ok(entries.some((entry) => entry.word === "lejek" && entry.meaning === "logic, ordered inference"));
  assert.ok(entries.some((entry) => entry.word === "regem" && entry.meaning === "regret, backward sorrow"));
  assert.ok(entries.some((entry) => entry.word === "degen" && entry.meaning === "dignity, intrinsic worth"));
  assert.ok(entries.some((entry) => entry.word === "sedek" && entry.meaning === "software development kit, builder tools"));
  assert.ok(entries.some((entry) => entry.word === "peyen" && entry.meaning === "programming interface"));
  assert.ok(entries.some((entry) => entry.word === "deyet" && entry.meaning === "diet, ordered nourishment"));
  assert.ok(entries.some((entry) => entry.word === "genen" && entry.meaning === "gene, inherited biological instruction"));
  assert.ok(entries.some((entry) => entry.word === "tecew" && entry.meaning === "tissue, living body fabric"));
  assert.ok(entries.some((entry) => entry.word === "bejet" && entry.meaning === "budget, named provision limits"));
  assert.ok(entries.some((entry) => entry.word === "berew" && entry.meaning === "browser, web-reading instrument"));
  assert.ok(entries.some((entry) => entry.word === "temem" && entry.meaning === "atom, smallest chemical unit"));
  assert.ok(entries.some((entry) => entry.word === "ceyet" && entry.meaning === "cell, living unit"));
  assert.ok(entries.some((entry) => entry.word === "keweren" && entry.meaning === "quarantine, protective health separation"));
  assert.ok(entries.some((entry) => entry.word === "peleceb" && entry.meaning === "placebo, inert trial treatment"));
  assert.ok(entries.some((entry) => entry.word === "gelek" && entry.meaning === "glucose, blood sugar"));
  assert.ok(entries.some((entry) => entry.word === "tenet" && entry.meaning === "tenant, lease-bound dweller"));
  assert.ok(entries.some((entry) => entry.word === "nefel" && entry.meaning === "inflation, rising price drift"));
  assert.ok(entries.some((entry) => entry.word === "benex" && entry.meaning === "benchmark, performance standard test"));
  assert.ok(entries.some((entry) => entry.word === "helex" && entry.meaning === "hallucination, fluent false output"));
  assert.ok(entries.some((entry) => entry.word === "celeb" && entry.meaning === "calibration, corrected measure"));
  assert.ok(entries.some((entry) => entry.word === "verenec" && entry.meaning === "variance, measured spread"));
  assert.ok(entries.some((entry) => entry.word === "feten" && entry.meaning === "footnote, supporting lower note"));
  assert.ok(entries.some((entry) => entry.word === "cemenet" && entry.meaning === "commentary, explanatory side-text"));
  assert.ok(entries.some((entry) => entry.word === "debel" && entry.meaning === "duplicate, repeated copy"));
  assert.ok(entries.some((entry) => entry.word === "neterep" && entry.meaning === "entropy, disorder measure"));
  assert.ok(entries.some((entry) => entry.word === "sepeter" && entry.meaning === "spectrum, ordered range"));
  assert.ok(entries.some((entry) => entry.word === "legey" && entry.meaning === "algae, water-growing life"));
  assert.ok(entries.some((entry) => entry.word === "pelenex" && entry.meaning === "pollination, carried plant fertility"));
  assert.ok(entries.some((entry) => entry.word === "letenes" && entry.meaning === "latency, response delay"));
  assert.ok(entries.some((entry) => entry.word === "wevefet" && entry.meaning === "overfitting, excessive training fit"));
  assert.ok(entries.some((entry) => entry.word === "pedegej" && entry.meaning === "pedagogy, teaching method"));
  assert.ok(entries.some((entry) => entry.word === "fedebek" && entry.meaning === "feedback, returned correction"));
  assert.ok(entries.some((entry) => entry.word === "selex" && entry.meaning === "escalation, rising conflict intensity"));
  assert.ok(entries.some((entry) => entry.word === "velenex" && entry.meaning === "violence, harmful force"));
  assert.ok(entries.some((entry) => entry.word === "sepeles" && entry.meaning === "specialist, focused care expert"));
  assert.ok(entries.some((entry) => entry.word === "heyeder" && entry.meaning === "hydration, water balance"));
  assert.ok(entries.some((entry) => entry.word === "fererem" && entry.meaning === "firearm, projectile weapon"));
  assert.ok(entries.some((entry) => entry.word === "derenex" && entry.meaning === "drone, unmanned craft"));
  assert.ok(entries.some((entry) => entry.word === "serevel" && entry.meaning === "surveillance, persistent watch"));
  assert.ok(entries.some((entry) => entry.word === "cehekep" && entry.meaning === "checkpoint, controlled passage"));
  assert.ok(entries.some((entry) => entry.word === "cevelen" && entry.meaning === "civilian, noncombatant person"));
  assert.ok(entries.some((entry) => entry.word === "ferenes" && entry.meaning === "forensics, trace evidence craft"));
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
