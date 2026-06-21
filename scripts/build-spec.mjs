import fs from "node:fs";
import path from "node:path";

const outDir = path.resolve("spec");
fs.mkdirSync(outDir, { recursive: true });

function yamlScalar(value) {
  if (value === null) return "null";
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return JSON.stringify(String(value));
}

function toYaml(value, indent = 0) {
  const pad = " ".repeat(indent);
  if (Array.isArray(value)) {
    if (value.length === 0) return "[]";
    return value.map((item) => {
      if (item && typeof item === "object" && !Array.isArray(item)) {
        return `${pad}-\n${toYaml(item, indent + 2)}`;
      }
      return `${pad}- ${yamlScalar(item)}`;
    }).join("\n");
  }
  if (value && typeof value === "object") {
    return Object.entries(value).map(([key, item]) => {
      if (item && typeof item === "object") {
        return `${pad}${key}:\n${toYaml(item, indent + 2)}`;
      }
      return `${pad}${key}: ${yamlScalar(item)}`;
    }).join("\n");
  }
  return `${pad}${yamlScalar(value)}`;
}

function writeYaml(filename, data) {
  fs.writeFileSync(path.join(outDir, filename), `${toYaml(data)}\n`);
}

const phonology = {
  language: "Ethra",
  version: "0.1",
  vowels: [
    { symbol: "a", ipa: "/a/", guide: "father without lengthening" },
    { symbol: "e", ipa: "/e/", guide: "clear e as in bet, slightly tenser" },
    { symbol: "i", ipa: "/i/", guide: "machine" },
    { symbol: "o", ipa: "/o/", guide: "more" },
    { symbol: "u", ipa: "/u/", guide: "rule" }
  ],
  consonants: [
    { symbol: "b", ipa: "/b/", guide: "bat", force: "hard" },
    { symbol: "d", ipa: "/d/", guide: "day", force: "hard" },
    { symbol: "f", ipa: "/f/", guide: "fire", force: "soft" },
    { symbol: "g", ipa: "/g/", guide: "go", force: "hard" },
    { symbol: "h", ipa: "/h/", guide: "house", force: "soft" },
    { symbol: "j", ipa: "/dʒ/", guide: "judge", force: "hard" },
    { symbol: "k", ipa: "/k/", guide: "key", force: "hard" },
    { symbol: "l", ipa: "/l/", guide: "light", force: "soft" },
    { symbol: "m", ipa: "/m/", guide: "mother", force: "soft" },
    { symbol: "n", ipa: "/n/", guide: "name", force: "soft" },
    { symbol: "p", ipa: "/p/", guide: "path", force: "hard" },
    { symbol: "r", ipa: "/ɾ/ or /r/", guide: "tapped or lightly rolled r", force: "soft" },
    { symbol: "s", ipa: "/s/", guide: "see", force: "hard" },
    { symbol: "t", ipa: "/t/", guide: "truth", force: "hard" },
    { symbol: "v", ipa: "/v/", guide: "vow", force: "soft" },
    { symbol: "w", ipa: "/w/", guide: "we", force: "soft" },
    { symbol: "x", ipa: "/x/", guide: "Bach or a strong h; may soften to h in casual speech", force: "hard" },
    { symbol: "y", ipa: "/j/", guide: "yes", force: "soft" },
    { symbol: "z", ipa: "/z/", guide: "zeal", force: "hard" },
    { symbol: "c", ipa: "/ʃ/", guide: "sh as in she; c never means k or s", force: "soft" }
  ],
  romanization_rules: [
    "One written symbol maps to one phoneme.",
    "The letter c always means sh.",
    "The letter j always means the sound in judge.",
    "Hyphen marks compounds, register prefixes, or civic suffixes; it is pronounced as a light boundary.",
    "No silent letters and no English-style alternate spellings."
  ],
  syllable_structure: {
    allowed: ["CV", "CVC", "V", "VC"],
    coda_limit: "A syllable may end in one consonant. Clusters are avoided inside each hyphen segment.",
    examples: ["ra", "rah", "mi-rah", "ba-na", "dav-da"]
  },
  stress_rules: [
    "Stress the first syllable of the main lexical word.",
    "Prefixes such as mi-, ha-, and so- are lighter than the root.",
    "In ritual speech, each hyphen boundary may receive a small secondary beat."
  ],
  sound_registers: {
    soft_intimate: ["m", "n", "l", "r", "v", "w", "y", "h", "c"],
    hard_commanding: ["p", "t", "k", "g", "d", "b", "s", "z", "j", "x"],
    principle: "Soft sounds carry intimacy, memory, grief, mercy, and tenderness. Hard sounds carry command, law, construction, correction, and public action."
  },
  pronunciation_examples: [
    { word: "rah", pronunciation: "RAH", meaning: "see; recognize" },
    { word: "mi-rah", pronunciation: "mi-RAH", meaning: "intimate recognition" },
    { word: "dav-da", pronunciation: "DAV-da", meaning: "civic obligation" },
    { word: "ha-zur", pronunciation: "ha-ZUR", meaning: "solemn ultimate witness" }
  ]
};

const roots = [
  root("RH", ["RAH"], ["r", "h"], "Seeing/knowing", "see, reveal, witness, recognize, truth, face, presence", {
    verb: "to see, reveal, or recognize",
    noun: "recognition; witnessed truth",
    adjective: "visible, recognized, honest",
    agent: "witness; one who recognizes",
    object: "face, visible presence, attested truth",
    ritual: "solemn unveiling before truth",
    civic: "legal testimony or public recognition",
    intimate: "the plea or gift of being fully seen"
  }),
  root("BN", ["BAN"], ["b", "n"], "Building/making", "build, make, form, order, found, establish", {
    verb: "to build, found, or put into order",
    noun: "formed structure; founding order",
    adjective: "well-formed, buildable, ordered",
    agent: "builder, founder, maker",
    object: "built thing; foundation",
    ritual: "consecrated founding act",
    civic: "chartered foundation or institutional order",
    intimate: "to help another become whole in form"
  }),
  root("MR", ["MAR"], ["m", "r"], "Future/civilization", "remember, inherit, preserve, continue, carry identity", {
    verb: "to remember, preserve, or carry forward",
    noun: "memory; carried inheritance",
    adjective: "remembered, continuous, ancestral",
    agent: "keeper of memory; inheritor",
    object: "memorial, inheritance, preserved record",
    ritual: "ancestral remembrance spoken solemnly",
    civic: "public archive or inherited office",
    intimate: "the remembered self held by another"
  }),
  root("VL", ["VAL"], ["v", "l"], "Moral agency", "choose, will, act, author, exercise agency", {
    verb: "to choose or will into action",
    noun: "choice; authored agency",
    adjective: "chosen, voluntary, self-authored",
    agent: "chooser; willing actor",
    object: "chosen path or deliberate act",
    ritual: "solemn choosing before witnesses",
    civic: "recorded consent or public mandate",
    intimate: "the vulnerable statement of true wanting"
  }),
  root("DV", ["DAV"], ["d", "v"], "Moral agency", "duty, vow, trust, obligation, covenant, answerability", {
    verb: "to bind oneself by duty or trust",
    noun: "duty, obligation, covenantal trust",
    adjective: "bound, obligated, entrusted",
    agent: "trustee; vow-keeper",
    object: "burden carried by obligation",
    ritual: "vow spoken as binding speech",
    civic: "legal duty, office, or enforceable obligation",
    intimate: "promise held between persons"
  }),
  root("LB", ["LAB"], ["l", "b"], "Emotion", "heart, inwardness, feeling, sincerity, moral interior", {
    verb: "to feel inwardly and sincerely",
    noun: "heart; inner life",
    adjective: "sincere, inward, heartfelt",
    agent: "one who speaks from the heart",
    object: "felt interior truth",
    ritual: "heart laid open in solemn speech",
    civic: "declared intent or motive",
    intimate: "unguarded inner feeling"
  }),
  root("NR", ["NUR"], ["n", "r"], "Seeing/knowing", "light, clarity, knowledge, consciousness, illumination", {
    verb: "to illuminate or make conscious",
    noun: "light, clarity, knowing",
    adjective: "clear, luminous, conscious",
    agent: "illuminator; teacher of clarity",
    object: "lamp, insight, field of light",
    ritual: "light invoked as witness",
    civic: "transparent public knowledge",
    intimate: "gentle clarity given to another"
  }),
  root("PT", ["PAT"], ["p", "t"], "Time", "path, journey, destiny, direction, way", {
    verb: "to walk, travel, or direct a path",
    noun: "path, route, destiny",
    adjective: "directed, wayfaring, destined",
    agent: "guide or pathmaker",
    object: "road, course, chosen way",
    ritual: "processional journey with meaning",
    civic: "policy direction or public route",
    intimate: "walking with another toward a shared end"
  }),
  root("TR", ["TAR"], ["t", "r"], "Conflict/repair", "repair, heal, correct, restore, make whole again", {
    verb: "to repair, heal, correct, or restore",
    noun: "repair; restoration; correction",
    adjective: "restored, corrected, mended",
    agent: "healer, restorer, corrector",
    object: "mended thing; restoration work",
    ritual: "solemn act of repair",
    civic: "legal correction or restorative judgment",
    intimate: "making right what one has broken"
  }),
  root("NM", ["NAM"], ["n", "m"], "Speech", "speak, name, call, command, bind through words", {
    verb: "to speak, name, call, or command",
    noun: "word, name, speech-act",
    adjective: "spoken, named, callable",
    agent: "speaker, namer, caller",
    object: "name, word, command",
    ritual: "name spoken in solemn register",
    civic: "formal declaration or public command",
    intimate: "name spoken as recognition"
  }),
  root("FR", ["FAR"], ["f", "r"], "Future/civilization", "future, unborn, tomorrow, claim of consequence", {
    verb: "to orient toward the future",
    noun: "future; unborn claimant",
    adjective: "future-facing, not-yet-born",
    agent: "guardian of future consequence",
    object: "future claim or inheritance-to-come",
    ritual: "calling the future as witness",
    civic: "long-horizon public obligation",
    intimate: "promise made for a shared future"
  }),
  root("LM", ["LEM"], ["l", "m"], "Future/civilization", "people, culture, civilization, shared memory", {
    verb: "to form a people or civic body",
    noun: "people; culture; civilization",
    adjective: "civic, cultural, people-bearing",
    agent: "citizen-builder; culture carrier",
    object: "common body or civilizational house",
    ritual: "the people named before memory",
    civic: "public peoplehood or constitutional body",
    intimate: "belonging felt as home among a people"
  }),
  root("SK", ["SAK"], ["s", "k"], "Law/civic life", "justice, measure, fairness, balance, due proportion", {
    verb: "to judge by fair measure",
    noun: "justice; right measure",
    adjective: "just, balanced, proportionate",
    agent: "judge, measurer, arbiter",
    object: "measure, verdict, balance",
    ritual: "justice invoked solemnly",
    civic: "court standard or public law-measure",
    intimate: "fairness inside a close bond"
  }),
  root("RG", ["RAG"], ["r", "g"], "Law/civic life", "rule, govern, institution, civic order", {
    verb: "to govern, regulate, or hold order",
    noun: "rule, governance, institution",
    adjective: "ordered, governed, institutional",
    agent: "governor, steward, office-holder",
    object: "rule, statute, ordered frame",
    ritual: "authority placed under solemn witness",
    civic: "public office or governing rule",
    intimate: "the agreed rule that protects trust"
  }),
  root("KT", ["KAT"], ["k", "t"], "Speech", "write, record, book, code, script, archive", {
    verb: "to write, record, encode, or inscribe",
    noun: "record, book, code, written memory",
    adjective: "written, recorded, encoded",
    agent: "scribe, coder, recorder",
    object: "book, inscription, source code",
    ritual: "sacred or solemn inscription",
    civic: "official record, statute, or registry",
    intimate: "letter or note kept by the heart"
  }),
  root("YS", ["YAS"], ["y", "s"], "Mind", "self, identity, authorship, personhood, ownness", {
    verb: "to become oneself or own an act",
    noun: "self, identity, authored personhood",
    adjective: "personal, self-authored, own",
    agent: "person as responsible author",
    object: "selfhood, signature, own act",
    ritual: "self named before truth",
    civic: "legal personhood or standing",
    intimate: "the self entrusted to another"
  }),
  root("KV", ["KAV"], ["k", "v"], "Moral agency", "power, capability, strength, capacity, effective force", {
    verb: "to be able, empower, or make capable",
    noun: "power, capacity, effective strength",
    adjective: "capable, powerful, enabled",
    agent: "one with power or capacity",
    object: "force, capability, instrument of power",
    ritual: "power placed under oath",
    civic: "delegated authority or public capacity",
    intimate: "strength offered in protection"
  }),
  root("HD", ["HAD"], ["h", "d"], "Ritual/poetry", "beauty, dignity, fittingness, splendor, grace", {
    verb: "to make beautiful, dignified, or fitting",
    noun: "beauty, dignity, fitting splendor",
    adjective: "beautiful, dignified, rightly formed",
    agent: "one who beautifies or dignifies",
    object: "beautiful form or honorable appearance",
    ritual: "beauty shaped for reverence",
    civic: "public dignity or ceremonial form",
    intimate: "beloved beauty seen without possession"
  }),
  root("MV", ["MAV"], ["m", "v"], "Love/intimacy", "love, cherish, cleave, recognize as precious", {
    verb: "to love as recognition and chosen care",
    noun: "love; cherished recognition",
    adjective: "beloved, cherished, precious",
    agent: "lover; one who cherishes",
    object: "beloved one or treasured bond",
    ritual: "vow-love before witnesses",
    civic: "care obligation in family or community law",
    intimate: "direct beloved recognition"
  }),
  root("HN", ["HAN"], ["h", "n"], "Family", "home, family, kin, shelter, household continuity", {
    verb: "to shelter, house, or make kin",
    noun: "home, family, household",
    adjective: "familial, sheltered, kin-bound",
    agent: "kinsman, household keeper",
    object: "homeplace, shelter, kin bond",
    ritual: "household blessing or adoption",
    civic: "recognized family or household status",
    intimate: "the warmth of being held as kin"
  }),
  root("GM", ["GAM"], ["g", "m"], "Body", "body, embodiment, flesh, posture, physical presence", {
    verb: "to embody or give bodily presence",
    noun: "body, embodiment, physical presence",
    adjective: "bodily, embodied, present",
    agent: "embodied person; bearer in flesh",
    object: "body, posture, physical sign",
    ritual: "body placed in posture of vow",
    civic: "recognized bodily presence or custody",
    intimate: "being physically present without evasion"
  }),
  root("NF", ["NAF"], ["n", "f"], "Body", "breath, life, soul, animation, vitality", {
    verb: "to breathe, live, or animate",
    noun: "breath, life, living spirit",
    adjective: "alive, breathing, vital",
    agent: "living being",
    object: "breath, pulse, animating life",
    ritual: "breath offered in prayer or vow",
    civic: "life protected by law",
    intimate: "shared breath or living nearness"
  }),
  root("SN", ["SAN"], ["s", "n"], "Mind", "attention, notice, discern, regard, perceive significance", {
    verb: "to notice, attend, or regard",
    noun: "attention, notice, discernment",
    adjective: "attentive, noticed, discerning",
    agent: "one who attends carefully",
    object: "noticed sign or object of attention",
    ritual: "sacred attention",
    civic: "public notice or formal attention",
    intimate: "careful attention to another's inner life"
  }),
  root("DK", ["DAK"], ["d", "k"], "Mind", "learn, teach, train, discipline, transmit skill", {
    verb: "to learn, teach, train, or discipline",
    noun: "learning, teaching, discipline",
    adjective: "trained, teachable, disciplined",
    agent: "teacher, student, trainer",
    object: "lesson, discipline, learned skill",
    ritual: "teaching recited across generations",
    civic: "public education or professional standard",
    intimate: "patient correction given in love"
  }),
  root("TL", ["TAL"], ["t", "l"], "Technology", "tool, technology, instrument, extension, interface", {
    verb: "to tool, instrument, or extend capacity",
    noun: "tool, technology, instrument",
    adjective: "instrumental, technical, extended",
    agent: "toolmaker, engineer, operator",
    object: "tool, interface, machine",
    ritual: "tool dedicated to right use",
    civic: "public infrastructure or technical standard",
    intimate: "small instrument made for care"
  }),
  root("KR", ["KAR"], ["k", "r"], "Building/making", "craft, create, design, make skillfully, compose", {
    verb: "to craft, create, design, or compose",
    noun: "craft, design, skilled creation",
    adjective: "crafted, designed, skillful",
    agent: "artisan, designer, maker",
    object: "crafted work or design",
    ritual: "crafted offering",
    civic: "designed system or public work",
    intimate: "thing made personally for another"
  }),
  root("MK", ["MAK"], ["m", "k"], "Conflict/repair", "break, conflict, force, wound, oppose", {
    verb: "to break, oppose, wound, or enter conflict",
    noun: "break, conflict, wound, rupture",
    adjective: "broken, opposed, wounded",
    agent: "opponent, breaker, combatant",
    object: "break, weapon, rupture point",
    ritual: "conflict confessed before repair",
    civic: "dispute or charge requiring judgment",
    intimate: "hurt named without concealment"
  }),
  root("SL", ["SAL"], ["s", "l"], "Conflict/repair", "release, forgive, free, loosen, show mercy", {
    verb: "to release, forgive, free, or loosen",
    noun: "release, forgiveness, freedom",
    adjective: "free, released, merciful",
    agent: "one who releases or forgives",
    object: "pardon, release, loosened bond",
    ritual: "mercy spoken as release",
    civic: "pardon, amnesty, or legal release",
    intimate: "forgiveness that does not erase truth"
  }),
  root("TS", ["TAS"], ["t", "s"], "Time", "time, season, sequence, history, timing", {
    verb: "to time, sequence, or place in history",
    noun: "time, season, historical sequence",
    adjective: "timely, historical, sequential",
    agent: "keeper of time or historian",
    object: "moment, season, date",
    ritual: "appointed time kept in ceremony",
    civic: "calendar, term, or public schedule",
    intimate: "a remembered time between persons"
  }),
  root("WD", ["WAD"], ["w", "d"], "Nature", "world, earth, habitat, cosmos, lived environment", {
    verb: "to world, inhabit, or make a habitat",
    noun: "world, earth, inhabited place",
    adjective: "worldly, earthly, environmental",
    agent: "inhabitant or world-keeper",
    object: "land, habitat, world-body",
    ritual: "earth named as witness",
    civic: "territory, environment, or common land",
    intimate: "the shared world of a relationship"
  }),
  root("ND", ["NAD"], ["n", "d"], "Time", "end, boundary, limit, completion, final account", {
    verb: "to end, bound, complete, or bring to account",
    noun: "end, boundary, completion",
    adjective: "complete, final, bounded",
    agent: "finisher, boundary-keeper",
    object: "limit, edge, conclusion",
    ritual: "final accounting spoken solemnly",
    civic: "term limit, boundary, or closure",
    intimate: "the promised end one will not abandon"
  }),
  root("PR", ["PAR"], ["p", "r"], "Law/civic life", "provide, exchange, resource, prosper, stewardship", {
    verb: "to provide, exchange, or steward resources",
    noun: "provision, exchange, prosperity",
    adjective: "provided, resourceful, prosperous",
    agent: "provider, steward, merchant",
    object: "resource, provision, payment",
    ritual: "gift offered under obligation",
    civic: "tax, budget, resource order",
    intimate: "providing for another with care"
  }),
  root("ZR", ["ZUR"], ["z", "r"], "Ritual/poetry", "ultimate witness, sacred awe, judgment, transcendent height", {
    verb: "to stand before ultimate witness",
    noun: "the sacred, ultimate judgment, awe",
    adjective: "sacred, solemn, ultimate",
    agent: "one who invokes ultimate witness",
    object: "altar, oath-place, sacred sign",
    ritual: "direct sacred address",
    civic: "highest constitutional principle",
    intimate: "awe before another person's depth"
  }),
  root("CM", ["CAM"], ["c", "m"], "Ritual/poetry", "peace, wholeness, rest, harmony, ordered quiet", {
    verb: "to make whole, calm, or bring peace",
    noun: "peace, wholeness, harmony",
    adjective: "peaceful, whole, calm",
    agent: "peacemaker, harmonizer",
    object: "settlement, restful order",
    ritual: "peace blessing",
    civic: "settlement or public peace",
    intimate: "quiet safety between persons"
  }),
  root("FL", ["FAL"], ["f", "l"], "Nature", "flow, water, change, adaptation, living motion", {
    verb: "to flow, adapt, or move like water",
    noun: "flow, water, adaptive change",
    adjective: "flowing, adaptive, fluid",
    agent: "one who adapts or carries flow",
    object: "river, stream, current",
    ritual: "water or flow used in purification",
    civic: "adaptive process or supply flow",
    intimate: "feeling allowed to move honestly"
  })
];

function root(id, aliases, consonants, category, semanticField, forms) {
  const derived = {};
  const patternRoles = {
    verb: "action vowel a",
    noun: "concept vowel e",
    adjective: "quality vowel i",
    agent: "actor suffix -en",
    object: "object vowel o",
    ritual: "solemn prefix ha- with u vowels",
    civic: "public/legal suffix -da",
    intimate: "intimate prefix mi-"
  };

  for (const pattern of Object.keys(patternRoles)) {
    const word = derive(consonants, pattern);
    derived[pattern] = {
      word,
      pronunciation: pronounce(word),
      meaning: forms[pattern],
      role: patternRoles[pattern]
    };
  }

  return {
    id,
    form: consonants.map((c) => c.toUpperCase()).join("-"),
    aliases,
    consonants,
    category,
    semantic_field: semanticField,
    core: forms.noun,
    forms,
    derived
  };
}

function interleave(consonants, vowel) {
  return consonants.map((c, index) => c + (index === consonants.length - 1 ? "" : vowel)).join("");
}

function derive(consonants, pattern) {
  if (pattern === "verb") return interleave(consonants, "a");
  if (pattern === "noun") return interleave(consonants, "e");
  if (pattern === "adjective") return interleave(consonants, "i");
  if (pattern === "agent") return `${interleave(consonants, "a")}en`;
  if (pattern === "object") return interleave(consonants, "o");
  if (pattern === "ritual") return `ha-${interleave(consonants, "u")}`;
  if (pattern === "civic") return `${interleave(consonants, "a")}-da`;
  if (pattern === "intimate") return `mi-${interleave(consonants, "a")}`;
  throw new Error(`Unknown pattern ${pattern}`);
}

function pronounce(word) {
  return word.split("-").map((segment, index) => {
    if (index === 0 && ["mi", "ha", "so"].includes(segment)) return segment;
    return segment.toUpperCase();
  }).join("-");
}

const particles = [
  particle("pa", "tense", "past action", "Place before the verb for action before the speech moment.", "Na pa mar dev."),
  particle("nu", "tense", "present or progressive action", "Marks action happening now or currently unfolding.", "Na nu ban kot."),
  particle("fu", "tense", "future action", "Marks action after the speech moment.", "Na fu tar mo mik."),
  particle("ka", "aspect", "completed action", "Marks completion or already-accomplished state.", "Lem ka mar."),
  particle("ga", "aspect", "ongoing or habitual action", "Marks continuing practice or repeated conduct.", "Lem ga naf bi mar."),
  particle("va", "aspect", "intended action", "Marks intended, planned, or conditional action.", "Na va pat ko ti."),
  particle("kan", "moral agency", "can; has capacity", "Capability without permission or duty.", "Na kan kav."),
  particle("lun", "moral agency", "may; is permitted", "Permission granted by a person, law, or fitting order.", "Ta lun pat."),
  particle("wen", "moral agency", "want; desire", "Desire without yet choosing.", "Na wen mav."),
  particle("vel", "moral agency", "choose", "Personal election of a path or duty.", "Na vel dev se."),
  particle("cel", "moral agency", "should; fitting obligation", "Normative pressure from truth, wisdom, or right measure.", "Na cel tar."),
  particle("dom", "moral agency", "owe", "Debt or obligation already standing.", "Na dom dev."),
  particle("dov", "moral agency", "vow", "Self-binding speech before witness.", "Na dov tar mo mik."),
  particle("ten", "moral agency", "am entrusted with", "Duty received from another's trust.", "Na ten hon."),
  particle("mor", "moral agency", "inherited duty", "Duty carried from ancestors, teachers, or history.", "Na mor dev se."),
  particle("tor", "moral agency", "chosen duty", "Duty taken by explicit agency.", "Na tor dev se."),
  particle("ren", "moral agency", "repair what was broken", "Links action to restoration, not mere performance.", "Na ren tar mak."),
  particle("so-na", "scope", "for myself", "Agency limited to self-interest or self-cultivation.", "Na val so-na."),
  particle("so-hen", "scope", "for family", "Agency undertaken for household or kin continuity.", "Na val so-hen."),
  particle("so-lem", "scope", "for people or civilization", "Agency undertaken for the civic people and its future.", "Na val so-lem."),
  particle("so-fer", "scope", "for the future", "Agency under the moral claim of the unborn.", "Na val so-fer."),
  particle("so-rah", "scope", "before truth", "Agency performed under visible truth and judgment.", "Na val so-rah."),
  particle("so-zur", "scope", "before the sacred or ultimate", "Agency under sacred witness; usable by theistic or secular speakers.", "Na dov so-zur."),
  particle("ha", "register", "sacred or solemn speech", "Precedes a sentence or word to raise ritual seriousness.", "Ha na dov."),
  particle("mi", "register", "intimate address", "Marks tenderness, vulnerability, or direct inward address.", "Mi ti rah na."),
  particle("pu", "register", "public or civic address", "Marks speech offered to citizens, institutions, or records.", "Pu na nam dev."),
  particle("ke", "mood", "imperative", "Direct command or plea, softened or sharpened by pronoun/register.", "Ke rah na."),
  particle("ne", "polarity", "not", "Negates the following verb, adjective, or particle chain.", "Na ne val mak."),
  particle("e", "grammar", "is; equals; be", "Analytic copula for identity, class, and definition.", "Mav e reh."),
  particle("bi", "grammar", "by; through", "Marks instrument, means, or sustaining practice.", "Lem naf bi mar."),
  particle("ko", "grammar", "with; alongside", "Marks companionship or coordinated action.", "Na pat ko ti."),
  particle("ad", "grammar", "to; toward; until", "Marks direction, recipient, or limit.", "Na pat ad nad wed."),
  particle("en", "grammar", "of; belonging to", "Possession, source, or dependency.", "Leb en na e kot rih."),
  particle("se", "grammar", "this", "Near demonstrative.", "Na vel dev se."),
  particle("mo", "grammar", "what; that which", "Relative object or nominalized clause.", "Na tar mo mik."),
  particle("ya", "mood", "question", "Marks a direct question without changing word order.", "Ya ta mar?"),
  particle("lo", "register", "respectful softener", "Adds courtesy without lowering truth-content.", "Lo ke nam."),
  particle("sol", "intensity", "real; deep; truly", "Intensifies toward full truth rather than mere volume.", "Ke sol-rah na."),
  particle("ap", "aspect", "open; unhidden", "Marks disclosed or unguarded state.", "Leb en na e ap kot.")
];

function particle(word, type, meaning, usage, example) {
  return { word, pronunciation: pronounce(word), type, meaning, usage, example };
}

const pronouns = [
  pronoun("na", "first", "singular", "self", "I; me", "Unmarked first person.", "Na val."),
  pronoun("nel", "first", "plural", "chosen circle", "we of chosen commitment", "A voluntary we: team, covenant, project.", "Nel ban."),
  pronoun("nen", "first", "plural", "family", "we of household or kin", "A kinship we.", "Nen mor."),
  pronoun("num", "first", "plural", "people", "we as a people", "Civic or civilizational first person.", "Num lem."),
  pronoun("ti", "second", "singular", "intimate beloved", "you, beloved or inwardly close", "Direct tenderness or vulnerability.", "Ti rah na."),
  pronoun("ta", "second", "singular", "friend/equal", "you, friend or equal", "Default equal address.", "Ta val."),
  pronoun("to", "second", "singular", "elder/teacher", "you, elder or teacher", "Respect for instruction or senior responsibility.", "To dak na."),
  pronoun("tu", "second", "singular", "child/student", "you, child or learner", "Careful downward responsibility, not contempt.", "Tu dak."),
  pronoun("te", "second", "singular", "citizen/peer", "you, civic peer", "Public equal address.", "Te pu nam."),
  pronoun("za", "second", "singular", "opponent", "you, opponent", "Conflict address that still names moral standing.", "Za sak so-rah."),
  pronoun("hu", "second", "singular", "sacred addressee", "You, sacred or ultimate addressee", "Prayer, vow, or direct ultimate address.", "Hu rah na."),
  pronoun("tum", "second", "plural", "collective people", "you all; you as a people", "Collective address without erasing persons.", "Tum mar."),
  pronoun("li", "third", "singular", "person", "he, she, they-singular; that person", "Gender-neutral third person.", "Li val."),
  pronoun("lu", "third", "plural", "persons", "they; those persons", "Plural third person.", "Lu ban."),
  pronoun("lo", "third", "singular", "thing", "it; that thing", "Non-personal reference.", "Lo e kot."),
  pronoun("hon", "third", "collective", "household", "the family as a unit", "Family collective when the group acts as one.", "Hon mor.")
];

function pronoun(word, person, number, stance, meaning, use, example) {
  return { word, pronunciation: pronounce(word), person, number, stance, meaning, use, example };
}

const grammar = {
  version: "0.1",
  typology: "Mostly analytic, SVO, root-and-pattern derivation with optional compounding.",
  default_word_order: "Subject - particles - verb - object - scope/complements.",
  core_order_examples: [
    { ethra: "Na vel dev se.", literal: "I choose duty this.", meaning: "I choose this duty." },
    { ethra: "Lem ga naf bi mar.", literal: "People ongoing live through remember.", meaning: "The people survive by remembering." }
  ],
  noun_phrase: {
    possession: "Possessor follows with en or directly after intimate/body nouns: leb en na or leb na.",
    plurality: "Plurality is optional. Add lu after a noun only when plurality matters.",
    definiteness: "Context supplies definiteness; se marks this, te marks civic address, and mo marks a relative object."
  },
  tense_aspect: {
    past: "pa",
    present_progressive: "nu",
    future: "fu",
    completed: "ka",
    ongoing_habitual: "ga",
    intended: "va"
  },
  mood: {
    imperative: "ke",
    question: "ya",
    negation: "ne",
    copula: "e"
  },
  moral_chain: {
    order: "subject + time/aspect + moral particle + verb + object + scope",
    examples: [
      "Na kan tar. = I can repair.",
      "Na lun tar. = I may repair.",
      "Na wen tar. = I want to repair.",
      "Na vel tar. = I choose to repair.",
      "Na cel tar. = I should repair.",
      "Na dom tar. = I owe repair.",
      "Na dov tar. = I vow to repair.",
      "Na mor tar. = I inherited the duty to repair.",
      "Na tor tar. = I chose the duty to repair."
    ]
  },
  relational_register: {
    principle: "Pronouns encode stance, not caste. A speaker can choose a stance to clarify care, respect, opposition, or sacred address.",
    intimate: "ti",
    equal: "ta",
    elder_teacher: "to",
    child_student: "tu",
    civic_peer: "te",
    opponent: "za",
    sacred: "hu",
    collective_people: "tum"
  },
  compounds: {
    format: "word-word-word",
    head: "The final member is the grammatical head unless a civic definition fixes another reading.",
    examples: [
      { word: "fer-dev", meaning: "future-binding duty" },
      { word: "mer-yes", meaning: "memory-carried identity" },
      { word: "rih-leb", meaning: "visible inner truth" },
      { word: "val-dev", meaning: "chosen obligation" },
      { word: "yas-pet", meaning: "self-authored destiny" },
      { word: "mer-tar", meaning: "inherited repair" },
      { word: "ha-sun", meaning: "sacred attention" },
      { word: "lem-val", meaning: "civilization-scale agency" },
      { word: "mav-reh", meaning: "love as recognition" },
      { word: "nem-dev", meaning: "speech that creates obligation" },
      { word: "mi-rah-yes", meaning: "a person fully seen by another" }
    ]
  }
};

const examples = [
  ex(1, "See me.", "Ke rah na.", "Imperative see me.", "See me.", "Ke marks command or plea; rah is the RH action pattern; na is first person object by position.", "The phrase asks for recognition, not only visual attention."),
  ex(2, "Really see me.", "Ke sol-rah na.", "Imperative true-see me.", "Really see me.", "sol- intensifies toward full truth; the compound keeps recognition visible.", "Ethra treats deep seeing as a moral act of attention."),
  ex(3, "My heart is an open book.", "Leb en na e kot rih.", "Heart of me is book visible.", "My heart is an open book.", "Possession uses en; e is the copula; rih is the visible/honest adjective from RH.", "Inner life should be speakable without requiring disguise."),
  ex(4, "I would walk with you to the end of the world.", "Na va pat ko ti ad ned wed.", "I intended walk with beloved-you toward end world.", "I would walk with you to the end of the world.", "va marks intended or conditional action; ko marks companionship; ad marks limit.", "Love is stated as chosen path and shared limit."),
  ex(5, "Remember who you are.", "Ke mar yes ta.", "Imperative remember self you-equal.", "Remember who you are.", "yes is identity/personhood from YS; ta keeps the address equal.", "Identity is treated as memory carried into agency."),
  ex(6, "I choose this duty.", "Na vel dev se.", "I choose duty this.", "I choose this duty.", "vel is moral choice; dev is duty; se marks this.", "The sentence separates desire from chosen obligation."),
  ex(7, "I inherited this duty.", "Na mor dev se.", "I inherited-duty duty this.", "I inherited this duty.", "mor marks inherited duty rather than personal selection.", "The speaker acknowledges obligation received from history."),
  ex(8, "I vow to repair what was broken.", "Na dov tar mo mik.", "I vow repair what broken.", "I vow to repair what was broken.", "dov is vow; mo introduces the relative object; mik is broken from MK.", "Repair becomes binding speech, not a mood."),
  ex(9, "Build what the future has already claimed.", "Ke ban mo fer ka dav.", "Imperative build what future completed bind.", "Build what the future has already claimed.", "ka marks completed claim; dav binds by duty.", "The unborn future is a claimant, not an abstraction."),
  ex(10, "The people survive by remembering.", "Lem ga naf bi mar.", "People ongoing live through remember.", "The people survive by remembering.", "ga marks habitual continuity; bi marks means.", "Culture survives by active memory, not inertia."),
  ex(11, "Love is recognition.", "Mev e reh.", "Love is recognition.", "Love is recognition.", "Both nouns come from root families MV and RH; e defines identity.", "Love is framed as seeing the person truly."),
  ex(12, "A word spoken becomes a burden carried.", "Nem ka nam e dev mor.", "Word completed spoken is duty inherited-carried.", "A spoken word becomes a carried burden.", "ka marks completed speech; dev is obligation; mor marks carried inheritance.", "Speech creates obligation, so careless words are morally expensive."),
  ex(13, "I act for myself.", "Na val so-na.", "I act for-self.", "I act for myself.", "so-na marks scope of agency.", "Ethra can name self-interest without pretending it is universal."),
  ex(14, "I act for my family.", "Na val so-hen.", "I act for-family.", "I act for my family.", "so-hen marks family scope from HN.", "Family is a legitimate but bounded scope of action."),
  ex(15, "I act for my people.", "Na val so-lem.", "I act for-people.", "I act for my people.", "so-lem marks civic/civilizational scope.", "Peoplehood carries memory and duty across generations."),
  ex(16, "I act before truth.", "Na val so-rah.", "I act before-truth.", "I act before truth.", "so-rah marks action under visible truth.", "Agency is accountable to what can be witnessed."),
  ex(17, "The child receives the name and becomes responsible to the future.", "Tu lun nom en li, li fu dav ad fer.", "Child-student receives name of person, that person future binds toward future.", "The child receives the name and becomes responsible to the future.", "tu is child/student address; nom is name; dav makes responsibility explicit.", "Naming enters the child into memory and future duty."),
  ex(18, "Freedom without memory becomes emptiness.", "Sel ne ko mer e xed.", "Freedom not with memory is emptiness.", "Freedom without memory becomes emptiness.", "sel is release/freedom from SL; ne ko means without; xed is an auxiliary lexicon word for emptiness.", "Freedom cut from inheritance loses form and direction."),
  ex(19, "Power without duty becomes corruption.", "Kev ne ko dev e mak-da.", "Power not with duty is break-civic.", "Power without duty becomes corruption.", "kev is power; dev is duty; mak-da marks public corruption/rupture.", "Power must answer to obligation or it decays."),
  ex(20, "A superior culture teaches its people what to notice.", "Lem hid dak lem en li mo san.", "Culture dignified teaches people of it what notice.", "A superior culture teaches its people what to notice.", "hid marks dignified excellence; dak teaches; san notices.", "The highest cultural task is trained attention toward truth, duty, beauty, memory, and consequence.")
];

function ex(number, english, ethra, literal, natural, grammarNotes, culturalNotes) {
  return {
    number,
    english,
    ethra,
    literal_translation: literal,
    natural_translation: natural,
    grammar_notes: grammarNotes,
    cultural_notes: culturalNotes
  };
}

const extraLexicon = [
  word("Particles", "xed", "XED", "noun", "none", "emptiness; void made by severed meaning", "auxiliary philosophical word", "Sel ne ko mer e xed."),
  word("Particles", "ap", "AP", "adjective", "none", "open, disclosed, unhidden", "aspect particle used adjectivally", "Leb en na e ap kot.")
];

function makeLexicon() {
  const categories = {};
  function add(category, entry) {
    categories[category] ??= [];
    categories[category].push(entry);
  }

  for (const pron of pronouns) {
    add("Pronouns", word("Pronouns", pron.word, pron.pronunciation, "pronoun", "none", pron.meaning, `relational stance: ${pron.stance}`, pron.example));
  }

  for (const part of particles) {
    const category = part.type === "moral agency" || part.type === "scope" ? "Moral agency" : "Particles";
    add(category, word(category, part.word, part.pronunciation, "particle", "none", part.meaning, `grammatical particle: ${part.type}`, part.example));
  }

  for (const rootEntry of roots) {
    for (const [pattern, derived] of Object.entries(rootEntry.derived)) {
      const partOfSpeech = {
        verb: "verb",
        noun: "noun",
        adjective: "adjective",
        agent: "noun",
        object: "noun",
        ritual: "ritual formula",
        civic: "civic/legal term",
        intimate: "intimate/emotional term"
      }[pattern];
      add(rootEntry.category, word(
        rootEntry.category,
        derived.word,
        derived.pronunciation,
        partOfSpeech,
        rootEntry.id,
        derived.meaning,
        `${rootEntry.form} root, ${derived.role}`,
        exampleFor(derived.word, pattern)
      ));
    }
  }

  for (const entry of extraLexicon) add(entry.category, entry);
  return { categories };
}

function word(category, wordValue, pronunciation, partOfSpeech, rootValue, meaning, etymology, exampleSentence) {
  return {
    word: wordValue,
    pronunciation,
    part_of_speech: partOfSpeech,
    root: rootValue,
    meaning,
    literal_etymology: etymology,
    example_sentence: exampleSentence,
    category
  };
}

function exampleFor(wordValue, pattern) {
  if (pattern === "verb") return `Na ${wordValue}.`;
  if (pattern === "noun") return `${capitalize(wordValue)} e rih.`;
  if (pattern === "adjective") return `Leb e ${wordValue}.`;
  if (pattern === "agent") return `${capitalize(wordValue)} pu nam.`;
  if (pattern === "object") return `Na rah ${wordValue}.`;
  if (pattern === "ritual") return `Ha ${wordValue}.`;
  if (pattern === "civic") return `Pu ${wordValue}.`;
  if (pattern === "intimate") return `Ti ${wordValue} na.`;
  return `Na nam ${wordValue}.`;
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

writeYaml("phonology.yaml", phonology);
writeYaml("roots.yaml", { roots });
writeYaml("particles.yaml", { particles });
writeYaml("pronouns.yaml", { pronouns });
writeYaml("grammar.yaml", grammar);
writeYaml("lexicon.yaml", makeLexicon());
writeYaml("examples.yaml", { examples });

console.log(`Generated Ethra specs in ${outDir}`);
