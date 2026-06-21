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

const derivationPatterns = {
  version: "0.2.2",
  purpose: "Productive root-pattern morphology for growing Ethra without word-by-word English copying.",
  principle: "Every root can generate action, concept, quality, persons, objects, registers, institutions, disciplines, records, rights, vows, and absences while keeping the root family audible.",
  total_patterns_per_root: 20,
  patterns: [
    {
      id: "verb",
      label: "action",
      role: "action vowel a",
      surface_template: "C-a-C",
      part_of_speech: "verb",
      semantic_function: "root action or enactment",
      register: "plain",
      example_root: "RH",
      example_word: "rah"
    },
    {
      id: "noun",
      label: "concept",
      role: "concept vowel e",
      surface_template: "C-e-C",
      part_of_speech: "noun",
      semantic_function: "core concept, state, or field",
      register: "plain",
      example_root: "RH",
      example_word: "reh"
    },
    {
      id: "adjective",
      label: "quality",
      role: "quality vowel i",
      surface_template: "C-i-C",
      part_of_speech: "adjective",
      semantic_function: "quality or condition of the root",
      register: "plain",
      example_root: "RH",
      example_word: "rih"
    },
    {
      id: "agent",
      label: "actor",
      role: "actor suffix -en",
      surface_template: "action + -en",
      part_of_speech: "noun",
      semantic_function: "person or system that performs the root action",
      register: "plain",
      example_root: "RH",
      example_word: "rahen"
    },
    {
      id: "object",
      label: "object",
      role: "object vowel o",
      surface_template: "C-o-C",
      part_of_speech: "noun",
      semantic_function: "object, result, or visible instance of the root",
      register: "plain",
      example_root: "RH",
      example_word: "roh"
    },
    {
      id: "ritual",
      label: "solemn form",
      role: "solemn prefix ha- with u vowels",
      surface_template: "ha- + C-u-C",
      part_of_speech: "ritual formula",
      semantic_function: "root placed into sacred, vow, ceremonial, or poetic cadence",
      register: "ritual",
      example_root: "RH",
      example_word: "ha-ruh"
    },
    {
      id: "civic",
      label: "public/legal term",
      role: "public/legal suffix -da",
      surface_template: "action + -da",
      part_of_speech: "civic/legal term",
      semantic_function: "root formalized for public, legal, institutional, or administrative use",
      register: "civic",
      example_root: "RH",
      example_word: "rah-da"
    },
    {
      id: "intimate",
      label: "emotional form",
      role: "intimate prefix mi-",
      surface_template: "mi- + action",
      part_of_speech: "intimate/emotional term",
      semantic_function: "root in direct personal, vulnerable, or beloved address",
      register: "intimate",
      example_root: "RH",
      example_word: "mi-rah"
    },
    {
      id: "process",
      label: "ongoing practice",
      role: "process suffix -ga",
      surface_template: "action + -ga",
      part_of_speech: "noun",
      semantic_function: "ongoing process, habit, craft, or practice of the root",
      register: "technical",
      example_root: "RH",
      example_word: "rah-ga"
    },
    {
      id: "instrument",
      label: "tool",
      role: "instrument suffix -tel",
      surface_template: "action + -tel",
      part_of_speech: "noun",
      semantic_function: "instrument, tool, medium, or interface used to enact the root",
      register: "technical",
      example_root: "RH",
      example_word: "rah-tel"
    },
    {
      id: "place",
      label: "field/place",
      role: "place suffix -wed",
      surface_template: "action + -wed",
      part_of_speech: "noun",
      semantic_function: "place, field, arena, or site where the root is enacted",
      register: "public",
      example_root: "RH",
      example_word: "rah-wed"
    },
    {
      id: "doctrine",
      label: "theory",
      role: "doctrine suffix -lek",
      surface_template: "action + -lek",
      part_of_speech: "noun",
      semantic_function: "doctrine, theory, explanatory frame, or school of the root",
      register: "scholarly",
      example_root: "RH",
      example_word: "rah-lek"
    },
    {
      id: "collective",
      label: "collective body",
      role: "collective suffix -lem",
      surface_template: "action + -lem",
      part_of_speech: "noun",
      semantic_function: "collective, guild, people, or organized body around the root",
      register: "civic",
      example_root: "RH",
      example_word: "rah-lem"
    },
    {
      id: "lack",
      label: "absence",
      role: "negative prefix ne-",
      surface_template: "ne- + action",
      part_of_speech: "noun",
      semantic_function: "absence, lack, deprivation, or negation of the root field",
      register: "analytic",
      example_root: "RH",
      example_word: "ne-rah"
    },
    {
      id: "category",
      label: "class",
      role: "category suffix -gec",
      surface_template: "action + -gec",
      part_of_speech: "noun",
      semantic_function: "category, type, class, or named kind defined by the root",
      register: "technical",
      example_root: "RH",
      example_word: "rah-gec"
    },
    {
      id: "discipline",
      label: "training",
      role: "discipline suffix -dak",
      surface_template: "action + -dak",
      part_of_speech: "noun",
      semantic_function: "teaching, study, discipline, or trained art of the root",
      register: "educational",
      example_root: "RH",
      example_word: "rah-dak"
    },
    {
      id: "office",
      label: "office",
      role: "office suffix -xaf",
      surface_template: "action + -xaf",
      part_of_speech: "noun",
      semantic_function: "office, public role, mandate, or authorized stewardship of the root",
      register: "civic",
      example_root: "RH",
      example_word: "rah-xaf"
    },
    {
      id: "record",
      label: "record",
      role: "record suffix -ket",
      surface_template: "action + -ket",
      part_of_speech: "noun",
      semantic_function: "record, document, archive, log, or written evidence of the root",
      register: "civic",
      example_root: "RH",
      example_word: "rah-ket"
    },
    {
      id: "right",
      label: "right",
      role: "right suffix -ret",
      surface_template: "action + -ret",
      part_of_speech: "noun",
      semantic_function: "right, claim, protected standing, or answerable entitlement in the root field",
      register: "legal",
      example_root: "RH",
      example_word: "rah-ret"
    },
    {
      id: "vow",
      label: "binding vow",
      role: "vow suffix -dov",
      surface_template: "action + -dov",
      part_of_speech: "noun",
      semantic_function: "vow, oath, pledged obligation, or self-binding promise concerning the root",
      register: "ritual/legal",
      example_root: "RH",
      example_word: "rah-dov"
    }
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
  }),
  root("FD", ["FAD"], ["f", "d"], "Body", "food, nourishment, feeding, sustenance, bodily provision", {
    verb: "to feed, nourish, or sustain bodily life",
    noun: "food, nourishment, sustenance",
    adjective: "nourishing, edible, sustaining",
    agent: "feeder, nourisher, cook, provider of food",
    object: "meal, ration, food-object",
    ritual: "meal blessed as shared sustenance",
    civic: "public food provision or ration duty",
    intimate: "feeding another as care"
  }),
  root("CR", ["CAR"], ["c", "r"], "Body", "cover, cloth, garment, concealment, protection", {
    verb: "to cover, clothe, veil, or protect by covering",
    noun: "cloth, clothing, cover",
    adjective: "covered, clothed, protected",
    agent: "one who clothes or covers",
    object: "garment, veil, covering",
    ritual: "ritual garment or solemn covering",
    civic: "uniform, public covering, or protective standard",
    intimate: "covering another in tenderness or modesty"
  }),
  root("CP", ["CAP"], ["c", "p"], "Body", "sleep, rest, recovery, bodily renewal", {
    verb: "to sleep, rest, or recover",
    noun: "sleep, rest, recovery",
    adjective: "rested, sleeping, restorative",
    agent: "sleeper or one who keeps rest",
    object: "bed, rest-place, recovery period",
    ritual: "rest kept as sacred restoration",
    civic: "protected rest period or labor-rest rule",
    intimate: "resting safely near another"
  }),
  root("PN", ["PAN"], ["p", "n"], "Body", "pain, hurt, warning, bodily distress", {
    verb: "to hurt, ache, or signal distress",
    noun: "pain, hurt, distress signal",
    adjective: "painful, hurting, distressed",
    agent: "one who suffers pain or signals harm",
    object: "wound-signal, ache, point of pain",
    ritual: "pain named before witness",
    civic: "injury claim or public harm record",
    intimate: "pain entrusted to another's care"
  }),
  root("HL", ["HAL"], ["h", "l"], "Body", "health, care, wellness, bodily integrity", {
    verb: "to care for health or preserve wellness",
    noun: "health, wellness, bodily integrity",
    adjective: "healthy, cared-for, whole in body",
    agent: "caregiver, healer, health-keeper",
    object: "care plan, remedy, health condition",
    ritual: "health blessing or care vow",
    civic: "public health duty or medical care standard",
    intimate: "care given to preserve another's life"
  }),
  root("BR", ["BAR"], ["b", "r"], "Family", "birth, beginning, emergence, generational arrival", {
    verb: "to be born, bring forth, or begin",
    noun: "birth, beginning, emergence",
    adjective: "born, beginning, emergent",
    agent: "newborn, birth-giver, origin-bearer",
    object: "birth event, beginning point",
    ritual: "birth named before household and future",
    civic: "birth record or recognized beginning",
    intimate: "the arrival of a child into care"
  }),
  root("DT", ["DAT"], ["d", "t"], "Family", "death, mortality, loss of life, final departure", {
    verb: "to die, end bodily life, or mourn mortality",
    noun: "death, mortality, final departure",
    adjective: "dead, mortal, death-bound",
    agent: "the dead one or mourner of death",
    object: "grave, death record, final body",
    ritual: "mourning speech before memory",
    civic: "death record or public mortality duty",
    intimate: "grief for a beloved life ended"
  }),
  root("KD", ["KAD"], ["k", "d"], "Family", "kinline, descent, childline, generational bond", {
    verb: "to descend, be kin, or continue a line",
    noun: "kinline, descent, generational bond",
    adjective: "descended, kin-bound, lineage-bearing",
    agent: "descendant, kin-bearer, line-carrier",
    object: "lineage mark or descent record",
    ritual: "lineage named before ancestors and future",
    civic: "recognized descent or kinship status",
    intimate: "belonging felt through kin memory"
  }),
  root("SP", ["SAP"], ["s", "p"], "Family", "sibling, peer-bond, side-by-side kinship", {
    verb: "to stand as sibling or peer-kin",
    noun: "sibling, peer-kin, side bond",
    adjective: "sibling-like, side-by-side, peer-bound",
    agent: "sibling or peer-kin",
    object: "sibling bond or shared household place",
    ritual: "sibling bond blessed or named",
    civic: "sibling status or household relation",
    intimate: "side-by-side loyalty"
  }),
  root("JW", ["JAW"], ["j", "w"], "Emotion", "joy, gladness, delight, uplifted life", {
    verb: "to rejoice, delight, or brighten inwardly",
    noun: "joy, gladness, delight",
    adjective: "joyful, glad, delighted",
    agent: "one who rejoices or brings joy",
    object: "joyful event or delight-object",
    ritual: "joy offered in festival or blessing",
    civic: "public celebration or shared gladness",
    intimate: "private joy recognized by another"
  }),
  root("GF", ["GAF"], ["g", "f"], "Emotion", "grief, mourning, sorrow, loss held in memory", {
    verb: "to grieve, mourn, or hold sorrow",
    noun: "grief, mourning, sorrow",
    adjective: "grieving, sorrowful, mourned",
    agent: "mourner or grief-bearer",
    object: "loss named by grief",
    ritual: "mourning spoken before memory",
    civic: "public mourning or memorial duty",
    intimate: "sorrow entrusted without concealment"
  }),
  root("XR", ["XAR"], ["x", "r"], "Emotion", "fear, dread, danger-sense, guarded attention", {
    verb: "to fear, dread, or sense danger",
    noun: "fear, dread, danger-sense",
    adjective: "afraid, guarded, danger-aware",
    agent: "one who fears or watches for danger",
    object: "feared thing or danger sign",
    ritual: "fear confessed before courage",
    civic: "threat warning or risk notice",
    intimate: "fear named to one trusted"
  }),
  root("ZG", ["ZAG"], ["z", "g"], "Emotion", "anger, heat, indignation, forceful refusal", {
    verb: "to anger, burn inwardly, or refuse forcefully",
    noun: "anger, indignation, hot refusal",
    adjective: "angry, heated, indignant",
    agent: "one who bears anger or protests",
    object: "offense that awakens anger",
    ritual: "anger placed under truth before action",
    civic: "public grievance or protest",
    intimate: "anger spoken without abandonment"
  }),
  root("CB", ["CAB"], ["c", "b"], "Emotion", "shame, concealment, exposed fault, inward recoil", {
    verb: "to feel shame, recoil, or conceal fault",
    noun: "shame, exposed fault, inward recoil",
    adjective: "ashamed, concealed, exposed in fault",
    agent: "one who bears shame or hides fault",
    object: "shameful act or hidden fault",
    ritual: "shame confessed for repair",
    civic: "public fault or dishonor record",
    intimate: "shame received without erasing truth"
  }),
  root("RT", ["RAT"], ["r", "t"], "Law/civic life", "right, claim, entitlement, just standing", {
    verb: "to claim rightly or grant standing",
    noun: "right, claim, rightful standing",
    adjective: "rightful, claim-bearing, entitled by justice",
    agent: "right-holder or claimant",
    object: "recognized right or claim",
    ritual: "right named before truth",
    civic: "legal right or formal entitlement",
    intimate: "the right to be treated as fully seen"
  }),
  root("XF", ["XAF"], ["x", "f"], "Law/civic life", "office, charge, mandate, entrusted public role", {
    verb: "to hold office, charge, or mandate",
    noun: "office, charge, public mandate",
    adjective: "official, mandated, charge-bearing",
    agent: "office-holder, mandate-bearer",
    object: "office, commission, public charge",
    ritual: "office received under solemn witness",
    civic: "formal office or delegated mandate",
    intimate: "a charge entrusted personally"
  }),
  root("JV", ["JAV"], ["j", "v"], "Law/civic life", "judgment, verdict, evaluation, discerned decision", {
    verb: "to judge, evaluate, or decide by discernment",
    noun: "judgment, verdict, evaluation",
    adjective: "judged, evaluated, verdict-bearing",
    agent: "judge, evaluator, decision-bearer",
    object: "verdict, rating, evaluation record",
    ritual: "judgment spoken before ultimate witness",
    civic: "court verdict or official evaluation",
    intimate: "discernment spoken carefully to another"
  }),
  root("KP", ["KAP"], ["k", "p"], "Law/civic life", "contract, pact, agreement, exchanged obligation", {
    verb: "to contract, agree, or bind by exchange",
    noun: "contract, pact, agreement",
    adjective: "contracted, agreed, pact-bound",
    agent: "contractor, party to agreement",
    object: "contract document or pact term",
    ritual: "pact made before witnesses",
    civic: "formal contract or enforceable agreement",
    intimate: "agreement kept between trusted persons"
  }),
  root("ZT", ["ZAT"], ["z", "t"], "Law/civic life", "authority, command, delegated force, right to direct", {
    verb: "to authorize, command, or direct by delegated force",
    noun: "authority, command, delegated force",
    adjective: "authorized, commanding, directive",
    agent: "authority-bearer or commander",
    object: "order, authorization, directive",
    ritual: "authority submitted to solemn witness",
    civic: "public authority or lawful command",
    intimate: "trusted authority used for protection"
  }),
  root("DN", ["DAN"], ["d", "n"], "Technology", "data, given record, encoded fact, stored signal", {
    verb: "to encode, store, or give as data",
    noun: "data, encoded record, stored fact",
    adjective: "encoded, data-bearing, stored",
    agent: "data keeper or recorder",
    object: "datum, dataset, stored signal",
    ritual: "record preserved before memory",
    civic: "public data record or registry datum",
    intimate: "personal record held in trust"
  }),
  root("NW", ["NAW"], ["n", "w"], "Technology", "network, connection, link, distributed relation", {
    verb: "to network, connect, or link",
    noun: "network, connection, distributed relation",
    adjective: "networked, connected, linked",
    agent: "connector, network node, link-maker",
    object: "link, node, connection path",
    ritual: "bonds named as a living network",
    civic: "public network or infrastructure link",
    intimate: "connection kept across distance"
  }),
  root("MF", ["MAF"], ["m", "f"], "Technology", "machine, mechanism, function, engineered process", {
    verb: "to mechanize, automate, or make function",
    noun: "machine, mechanism, function",
    adjective: "mechanical, functional, automated",
    agent: "machine, operator, automating agent",
    object: "mechanism, device, running function",
    ritual: "machine dedicated to right use",
    civic: "regulated machine or public mechanism",
    intimate: "tool made to reduce another's burden"
  }),
  root("MD", ["MAD"], ["m", "d"], "Technology", "model, representation, schema, simplified world", {
    verb: "to model, represent, or schematize",
    noun: "model, representation, schema",
    adjective: "modeled, representative, schematic",
    agent: "modeler or representational system",
    object: "model, diagram, schema",
    ritual: "image of order used for teaching",
    civic: "official model or planning schema",
    intimate: "a simplified picture used to be understood"
  }),
  root("XP", ["XAP"], ["x", "p"], "Technology", "security, protection, boundary defense, guarded access", {
    verb: "to secure, guard, or protect access",
    noun: "security, protection, guarded boundary",
    adjective: "secure, protected, access-guarded",
    agent: "guardian, security system, protector",
    object: "lock, credential, protected boundary",
    ritual: "boundary guarded under vow",
    civic: "public security or access rule",
    intimate: "protection of another's entrusted privacy"
  }),
  root("RJ", ["RAJ"], ["r", "j"], "Mind", "reason, inference, logic, accountable thought", {
    verb: "to reason, infer, or think accountably",
    noun: "reason, inference, logic",
    adjective: "rational, reasoned, inferential",
    agent: "reasoner, thinker, analyst",
    object: "argument, inference, reasoned account",
    ritual: "reason submitted before truth",
    civic: "public rationale or official reasoning",
    intimate: "thinking honestly with another"
  }),
  root("SM", ["SAM"], ["s", "m"], "Mind", "simulation, image-play, possible world, rehearsal", {
    verb: "to simulate, rehearse, or imagine a possible world",
    noun: "simulation, rehearsal, possible world",
    adjective: "simulated, imagined, rehearsed",
    agent: "simulator, imaginer, rehearsal-maker",
    object: "scenario, simulation, possible case",
    ritual: "imagined judgment used for preparation",
    civic: "policy simulation or public scenario",
    intimate: "shared imagining of a possible life"
  }),
  root("MY", ["MAY"], ["m", "y"], "Law/civic life", "money, value token, unit of exchange, priced trust", {
    verb: "to price, pay, or tokenize value",
    noun: "money, value token, exchange unit",
    adjective: "monetary, priced, value-bearing",
    agent: "payer, treasurer, value-keeper",
    object: "coin, price, payment unit",
    ritual: "gift or payment placed under duty",
    civic: "currency, public payment, or tax unit",
    intimate: "provision offered without reducing love to price"
  }),
  root("XB", ["XAB"], ["x", "b"], "Law/civic life", "trade, exchange, market, reciprocal transfer", {
    verb: "to trade, exchange, or transfer reciprocally",
    noun: "trade, exchange, market transfer",
    adjective: "traded, exchanged, reciprocal",
    agent: "trader, exchanger, market actor",
    object: "trade good or exchange term",
    ritual: "exchange blessed under fairness",
    civic: "market rule or formal exchange",
    intimate: "exchange of gifts without hidden debt"
  }),
  root("WK", ["WAK"], ["w", "k"], "Building/making", "work, labor, task, effort given to form", {
    verb: "to work, labor, or perform a task",
    noun: "work, labor, task",
    adjective: "working, laboring, task-bound",
    agent: "worker, laborer, task-bearer",
    object: "task, job, work product",
    ritual: "work offered as duty",
    civic: "labor office, public task, or work standard",
    intimate: "work done for one beloved"
  }),
  root("GW", ["GAW"], ["g", "w"], "Law/civic life", "gift, grant, generosity, unpriced transfer", {
    verb: "to give, grant, or transfer generously",
    noun: "gift, grant, generosity",
    adjective: "given, generous, grant-bearing",
    agent: "giver, donor, grantor",
    object: "gift, grant, offering",
    ritual: "gift offered before witness",
    civic: "grant, public gift, or subsidy",
    intimate: "gift given as recognition"
  }),
  root("MN", ["MAN"], ["m", "n"], "Nature", "matter, material, substance, tangible stuff", {
    verb: "to materialize or give substance",
    noun: "matter, material, substance",
    adjective: "material, substantial, tangible",
    agent: "material bearer or substance-maker",
    object: "material, substance, physical stuff",
    ritual: "matter honored as formed world",
    civic: "public material or resource classification",
    intimate: "substance shaped by care"
  }),
  root("NJ", ["NAJ"], ["n", "j"], "Nature", "energy, vigor, activation, capacity in motion", {
    verb: "to energize, activate, or set in motion",
    noun: "energy, vigor, activation",
    adjective: "energetic, activated, vigorous",
    agent: "energizer or active force",
    object: "energy source or activation event",
    ritual: "energy dedicated to right action",
    civic: "public energy supply or power standard",
    intimate: "vigor offered for another's need"
  }),
  root("BV", ["BAV"], ["b", "v"], "Nature", "life-form, biology, organism, living pattern", {
    verb: "to live as an organism or biologically form",
    noun: "life-form, biology, organism",
    adjective: "biological, organismic, life-formed",
    agent: "organism or living form",
    object: "biological body or living pattern",
    ritual: "life-form named before care",
    civic: "biological classification or life-protection rule",
    intimate: "living vulnerability recognized"
  }),
  root("NB", ["NAB"], ["n", "b"], "Mind", "number, count, quantity, ordered amount", {
    verb: "to count, number, or quantify",
    noun: "number, count, quantity",
    adjective: "numbered, quantitative, counted",
    agent: "counter, accountant, enumerator",
    object: "number, count, quantity mark",
    ritual: "count recited for memory",
    civic: "official count, census, or quantity standard",
    intimate: "number kept because one person matters"
  }),
  root("MS", ["MAS"], ["m", "s"], "Mind", "measure, proof, experiment, tested proportion", {
    verb: "to measure, test, or prove by proportion",
    noun: "measure, proof, experiment",
    adjective: "measured, tested, proven",
    agent: "measurer, tester, experimenter",
    object: "measure, proof, experiment record",
    ritual: "measure placed under truth",
    civic: "public standard or official test",
    intimate: "careful measure before judgment"
  }),
  root("PB", ["PAB"], ["p", "b"], "Mind", "chance, probability, uncertain outcome, risk distribution", {
    verb: "to estimate chance or distribute risk",
    noun: "chance, probability, risk distribution",
    adjective: "probable, uncertain, risk-bearing",
    agent: "risk-estimator or probability judge",
    object: "probability, chance event, risk model",
    ritual: "uncertainty confessed before action",
    civic: "risk assessment or probability standard",
    intimate: "uncertainty named honestly"
  }),
  root("PL", ["PAL"], ["p", "l"], "Nature", "plant, growth, cultivation, rooted life", {
    verb: "to plant, grow, cultivate, or root",
    noun: "plant, growth, cultivation",
    adjective: "planted, growing, cultivated",
    agent: "planter, grower, cultivator",
    object: "plant, seedling, cultivated field",
    ritual: "planting done as future vow",
    civic: "agriculture, crop, or land-use standard",
    intimate: "growth tended patiently"
  }),
  root("WH", ["WAH"], ["w", "h"], "Nature", "air, wind, atmosphere, shared breath-world", {
    verb: "to breathe as air moves or ventilate",
    noun: "air, wind, atmosphere",
    adjective: "airy, wind-borne, atmospheric",
    agent: "wind-bearer or air-mover",
    object: "wind, airspace, breath-field",
    ritual: "breath-world invoked as witness",
    civic: "air quality or atmosphere standard",
    intimate: "shared air and nearness"
  }),
  root("FC", ["FAC"], ["f", "c"], "Nature", "fire, heat, transformation, consuming light", {
    verb: "to burn, heat, transform by fire",
    noun: "fire, heat, consuming light",
    adjective: "fiery, heated, transformative",
    agent: "fire-bearer or heat source",
    object: "flame, hearth, heat event",
    ritual: "fire used for purification or vow",
    civic: "public heat, energy, or fire-safety rule",
    intimate: "warmth kept for another"
  }),
  root("CG", ["CAG"], ["c", "g"], "Ritual/poetry", "song, cadence, chant, patterned voice", {
    verb: "to sing, chant, or shape cadence",
    noun: "song, cadence, chant",
    adjective: "sung, cadenced, chant-like",
    agent: "singer, chanter, cadence-keeper",
    object: "song, chant, melodic line",
    ritual: "ritual chant or solemn song",
    civic: "public anthem or ceremonial song",
    intimate: "song offered to the beloved"
  }),
  root("JM", ["JAM"], ["j", "m"], "Ritual/poetry", "image, icon, representation seen as form", {
    verb: "to image, depict, or make visible form",
    noun: "image, icon, visual representation",
    adjective: "imaged, iconic, depictive",
    agent: "image-maker, artist, icon-bearer",
    object: "image, icon, visual sign",
    ritual: "image used in solemn remembrance",
    civic: "public image, emblem, or seal",
    intimate: "image kept as memory of another"
  }),
  root("RB", ["RAB"], ["r", "b"], "Speech", "story, narrative, account, meaning carried in sequence", {
    verb: "to tell, narrate, or account in sequence",
    noun: "story, narrative, account",
    adjective: "narrative, storied, account-bearing",
    agent: "storyteller, narrator, account-giver",
    object: "story, account, narrative record",
    ritual: "founding story recited before memory",
    civic: "official account or public narrative",
    intimate: "life-story entrusted to another"
  }),
  root("VB", ["VAB"], ["v", "b"], "Ritual/poetry", "blessing, good-speaking, favor spoken as duty", {
    verb: "to bless, favor, or speak good over",
    noun: "blessing, spoken favor, good-speech",
    adjective: "blessed, favored, spoken-good",
    agent: "blesser or favor-speaker",
    object: "blessing, benediction, favor-word",
    ritual: "formal blessing",
    civic: "public commendation or honorable grant",
    intimate: "blessing spoken over one beloved"
  }),
  root("GN", ["GAN"], ["g", "n"], "Future/civilization", "origin, source, beginning cause, ancestry point", {
    verb: "to originate, source, or begin from",
    noun: "origin, source, beginning cause",
    adjective: "original, source-bearing, originative",
    agent: "originator, founder, source-bearer",
    object: "source, origin point, founding cause",
    ritual: "origin remembered before descendants",
    civic: "founding source or constitutional origin",
    intimate: "where a shared life began"
  }),
  root("LX", ["LAX"], ["l", "x"], "Future/civilization", "loss, absence, rupture in continuity, what is missing", {
    verb: "to lose, lack, or become absent",
    noun: "loss, absence, missing continuity",
    adjective: "lost, absent, lacking",
    agent: "one who loses or bears absence",
    object: "lost thing, absence, missing record",
    ritual: "loss named before memory",
    civic: "loss record, public deficit, or missing duty",
    intimate: "absence felt in the heart"
  }),
  root("CT", ["CAT"], ["c", "t"], "Building/making", "city, settlement, public dwelling, built common place", {
    verb: "to urbanize, settle, or make public dwelling",
    noun: "city, settlement, public dwelling",
    adjective: "urban, settled, city-bearing",
    agent: "city-builder, settler, urban steward",
    object: "city, town, public settlement",
    ritual: "city founded before memory and future",
    civic: "municipality or public settlement",
    intimate: "the city held as shared home"
  }),
  root("BD", ["BAD"], ["b", "d"], "Law/civic life", "border, boundary, threshold, rightful edge", {
    verb: "to border, bound, or set a threshold",
    noun: "border, boundary, threshold",
    adjective: "bordered, bounded, threshold-marked",
    agent: "border-keeper or boundary-setter",
    object: "border, gate, threshold mark",
    ritual: "boundary named before crossing",
    civic: "legal border, boundary, or jurisdiction edge",
    intimate: "personal boundary spoken clearly"
  }),
  root("MP", ["MAP"], ["m", "p"], "Mind", "map, plan, spatial representation, route memory", {
    verb: "to map, plan, or represent spatially",
    noun: "map, plan, route representation",
    adjective: "mapped, planned, spatially represented",
    agent: "mapper, planner, route-maker",
    object: "map, plan, route chart",
    ritual: "journey map blessed before departure",
    civic: "public map, plan, or zoning chart",
    intimate: "shared plan for where to go together"
  }),
  root("SG", ["SAG"], ["s", "g"], "Speech", "signal, message, sign, transmitted notice", {
    verb: "to signal, message, or send notice",
    noun: "signal, message, transmitted sign",
    adjective: "signaled, messaged, transmitted",
    agent: "messenger, signaler, transmitter",
    object: "message, signal, sign",
    ritual: "signal used as solemn sign",
    civic: "public notice or transmitted alert",
    intimate: "small sign sent to be recognized"
  }),
  root("CZ", ["CAZ"], ["c", "z"], "Speech", "silence, withholding, quiet, unsaid presence", {
    verb: "to silence, withhold speech, or keep quiet",
    noun: "silence, withholding, quiet",
    adjective: "silent, withheld, quiet",
    agent: "silent one or keeper of quiet",
    object: "silence, unsaid word, quiet interval",
    ritual: "solemn silence before memory or judgment",
    civic: "right of silence or withheld public record",
    intimate: "quiet presence without evasion"
  }),
  ...foundationSeedRoots(),
  ...publicCultureRoots(),
  ...institutionalScaleRoots(),
  ...humanDepthRoots(),
  ...publicInstitutionRoots(),
  ...infrastructureScaleRoots(),
  ...civilizationalClosureRoots(),
  ...v1StabilityRoots(),
  ...v1CoverageRoots(),
  ...v1BreadthRoots(),
  ...v1DomainDepthRoots(),
  ...v1EntryGateRoots(),
  ...v1InstitutionalDepthRoots(),
  ...v1DomainBreadthRoots(),
  ...v1MaterialCultureRoots(),
  ...v1SocialRoleRoots(),
  ...v1NatureAgricultureRoots(),
  ...v1SecurityOperationsRoots(),
  ...v1ScientificMethodRoots()
];

function root(id, aliases, consonants, category, semanticField, forms) {
  const derived = {};
  const patternRoles = Object.fromEntries(derivationPatterns.patterns.map((pattern) => [pattern.id, pattern.role]));

  for (const pattern of Object.keys(patternRoles)) {
    const word = derive(consonants, pattern);
    derived[pattern] = {
      word,
      pronunciation: pronounce(word),
      meaning: forms[pattern] ?? derivedMeaning(forms, pattern),
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

function derivedMeaning(forms, pattern) {
  const concept = forms.noun;
  const action = forms.verb;
  const templates = {
    process: `ongoing process, practice, or craft of: ${action}`,
    instrument: `instrument, tool, medium, or interface for: ${action}`,
    place: `place, arena, or field where this root is enacted: ${concept}`,
    doctrine: `doctrine, theory, or explanatory frame of: ${concept}`,
    collective: `collective body, guild, or people organized around: ${concept}`,
    lack: `absence, negation, or deprivation of: ${concept}`,
    category: `category, class, or type defined by: ${concept}`,
    discipline: `teaching, training, or disciplined study of: ${concept}`,
    office: `office, mandate, or authorized stewardship concerning: ${concept}`,
    record: `record, archive, log, or written evidence of: ${concept}`,
    right: `right, claim, or protected standing concerning: ${concept}`,
    vow: `vow, oath, or pledged obligation concerning: ${concept}`
  };
  return templates[pattern] ?? concept;
}

function foundationSeedRoots() {
  const seeds = [
    ["BG", "Body", "blood, circulation, kin vitality, pulse, living red sign", "bleed, circulate, or mark living kinship", "blood, circulation, vital red sign", "blood-bearing, circulatory, vital", "carries blood or treats circulation", "blood, pulse mark, blood record", "blood record, medical sample, or kin evidence", "living blood recognized as vulnerability"],
    ["VG", "Body", "vessel, vein, channel, inner passage, bodily transport", "carry through a vessel or channel", "vessel, vein, bodily channel", "vessel-bearing, channeled, circulatory", "keeps or repairs a vessel", "vein, vessel, channel", "medical vessel record or transport rule", "inner passage protected by care"],
    ["JL", "Body", "joint, limb, movement hinge, bodily articulation", "bend, join, or move by a limb", "joint, limb, bodily hinge", "jointed, limbed, articulated", "moves or treats a limb", "limb, joint, hinge point", "mobility standard or injury record", "movement helped by another"],
    ["RC", "Body", "organ, part, function, bodily system, inner member", "function as an organ or organize bodily parts", "organ, bodily part, functional system", "organic, functional, part-bearing", "keeps a bodily function", "organ, organ-system, functional part", "medical organ record or care category", "inner part treated with tenderness"],
    ["YN", "Body", "medicine, remedy, treatment, healing art, clinical care", "treat, medicate, or remedy illness", "medicine, remedy, treatment", "medicinal, treated, remedial", "heals by treatment", "medicine, remedy, treatment dose", "medical protocol or treatment right", "remedy offered in trust"],
    ["CN", "Body", "contact, touch, consent, bodily boundary, permitted nearness", "touch, contact, or permit bodily nearness", "contact, touch, consent boundary", "touched, consenting, contact-bearing", "touches or guards contact", "touch, contact point, consent mark", "consent record or contact rule", "touch welcomed without coercion"],
    ["TF", "Body", "temperature, fever, heat of body, thermal condition", "warm, cool, or fever in the body", "temperature, fever, body heat", "thermal, fevered, heat-bearing", "measures or treats temperature", "fever mark, temperature reading", "health temperature record", "body heat noticed in care"],
    ["LN", "Body", "skin, surface, boundary of body, tactile face", "skin, surface, or protect bodily boundary", "skin, surface, bodily boundary", "skinned, surfaced, tactile", "cares for the skin or surface", "skin, surface, touch-field", "medical skin record or safety boundary", "skin treated as personal presence"],
    ["PG", "Family", "parent, nurture, origin-care, household authority", "parent, nurture, or guide a child", "parenthood, nurture, origin-care", "parental, nurturing, origin-caring", "parent or nurturer", "parent role, nurture act", "legal parenthood or custody duty", "parental care held in love"],
    ["SD", "Family", "marriage, union, spouse-bond, joined household", "join as spouses or form a household union", "marriage, union, spouse-bond", "married, joined, spouse-bound", "spouse or union-keeper", "marriage bond, union vow", "marriage record or household union status", "chosen union kept tenderly"],
    ["FT", "Family", "friendship, loyal equal, chosen companion, trusted peer", "befriend, accompany, or keep loyal equality", "friendship, chosen companionship", "friendly, loyal, companionate", "friend or loyal companion", "friendship bond, companion path", "recognized association or civic fellowship", "chosen nearness without possession"],
    ["YD", "Family", "adoption, receiving as kin, chosen descent, house-entry", "adopt, receive as kin, or enter a household", "adoption, received kinship", "adopted, received, kin-made", "adopter or adopted kin", "adoption bond, received child", "adoption status or kinship record", "being welcomed as one's own"],
    ["WL", "Family", "elderhood, age, senior memory, mature counsel", "age, advise, or stand as elder", "elderhood, age, mature counsel", "elder, aged, counsel-bearing", "elder or senior guide", "elder seat, counsel word", "elder office or senior duty", "age honored through care"],
    ["YC", "Family", "youth, childhood, early growth, learner season", "grow as a child or keep youth", "youth, childhood, early growth", "young, childlike, early-growing", "child or youth-bearer", "youth season, childhood mark", "youth status or child-protection rule", "young life protected by tenderness"],
    ["HM", "Family", "hearth, table, household center, shared warmth", "gather at hearth or make household warmth", "hearth, table, household center", "hearth-bound, warm, table-shared", "hearth-keeper or table host", "hearth, table, shared center", "household provision standard", "warmth of shared table"],
    ["DC", "Emotion", "doubt, hesitation, uncertainty felt inwardly, tested trust", "doubt, hesitate, or test inward certainty", "doubt, hesitation, inward uncertainty", "doubtful, hesitant, uncertain", "doubter or careful questioner", "doubt, question-point", "formal objection or uncertainty note", "doubt spoken without fear"],
    ["FY", "Emotion", "hope, expectancy, forward trust, light ahead", "hope, expect, or lean toward good future", "hope, expectancy, forward trust", "hopeful, expected, future-trusting", "one who hopes or encourages hope", "hope sign, expected good", "public hope or declared expectation", "hope shared with the beloved"],
    ["VN", "Emotion", "trust, confidence, reliance, held faith", "trust, rely, or give confidence", "trust, confidence, reliance", "trusted, confident, reliable", "trustee, trusted one, confidant", "trust bond, reliance mark", "legal trust or fiduciary reliance", "confidence placed in another"],
    ["LG", "Emotion", "longing, hunger, desire stretched over distance", "long, yearn, or hunger for", "longing, yearning, distance-desire", "longing, hungry, yearning", "one who longs or hungers", "desired distance, yearning object", "claim of need or petition", "yearning named honestly"],
    ["BT", "Emotion", "courage, firmness, brave standing, fear-governed action", "stand bravely or govern fear", "courage, brave firmness", "brave, firm, courage-bearing", "one who stands with courage", "brave act, firm stand", "public courage or defense commendation", "courage offered for another"],
    ["ZN", "Emotion", "zeal, drive, ardor, energized commitment", "burn with zeal or drive commitment", "zeal, ardor, committed drive", "zealous, ardent, driven", "zeal-bearer or committed actor", "ardor, drive, motivating fire", "public campaign or declared cause", "ardor disciplined by love"],
    ["WR", "Emotion", "wonder, astonishment, reverent curiosity, awakened attention", "wonder, marvel, or awaken curiosity", "wonder, astonishment, reverent curiosity", "wondering, astonished, curious", "wonderer or awakener of curiosity", "marvel, wonder-sign", "public marvel or inquiry prompt", "wonder shared in nearness"],
    ["YW", "Emotion", "calm, steadiness, settled breath, unshaken feeling", "calm, steady, or settle breath", "calm, steadiness, settled breath", "calm, steady, settled", "one who steadies or calms", "calm state, settled breath", "public calm order or de-escalation duty", "quiet steadiness given to another"],
    ["CK", "Law/civic life", "court, hearing, forum, place of judgment", "hold court, hear, or bring to forum", "court, hearing, public forum", "courtly, heard, forum-bound", "court officer or hearing keeper", "court, hearing, public forum", "legal court or hearing record", "being heard without evasion"],
    ["GL", "Law/civic life", "tax, contribution, common share, civic provision", "tax, contribute, or gather common share", "tax, contribution, common share", "taxed, contributive, common-funded", "taxpayer or collector", "tax, levy, contribution", "tax law or public contribution", "shared burden acknowledged plainly"],
    ["TV", "Law/civic life", "punishment, penalty, consequence, answer for harm", "punish, penalize, or impose consequence", "punishment, penalty, consequence", "punitive, penal, consequence-bearing", "punisher, penal judge, consequence-bearer", "penalty, sentence, consequence", "legal punishment or sentence", "consequence named without cruelty"],
    ["RW", "Law/civic life", "citizenship, membership, civic belonging, public standing", "citizen, enroll, or grant civic membership", "citizenship, civic membership", "citizenly, enrolled, public-standing", "citizen or civic member", "citizen status, membership mark", "citizenship record or public standing", "belonging to a people"],
    ["BJ", "Law/civic life", "budget, allocation, planned provision, counted resource", "budget, allocate, or plan provision", "budget, allocation, planned resource", "budgeted, allocated, provision-planned", "allocator, treasurer, budget keeper", "budget line, allocation", "public budget or appropriation", "resources planned for care"],
    ["FV", "Law/civic life", "property, possession, stewardship, held thing", "own, hold, or steward property", "property, possession, stewardship", "owned, held, stewarded", "owner or steward", "property, held thing, asset", "property right or stewardship record", "what is held without worship"],
    ["YG", "Law/civic life", "vote, selection, civic choice, counted consent", "vote, select, or count consent", "vote, civic selection, counted consent", "voted, selected, consent-counted", "voter or selector", "vote, ballot, selection mark", "election record or voting right", "choice made visible among peers"],
    ["PC", "Law/civic life", "privacy, guarded self, protected inward boundary", "privatize, shield, or protect inward boundary", "privacy, guarded self-boundary", "private, shielded, inward-guarded", "privacy keeper or protector", "private field, sealed record", "privacy right or confidentiality rule", "the self protected from misuse"],
    ["XG", "Law/civic life", "evidence, exhibit, proof-object, shown ground", "evidence, exhibit, or ground a claim", "evidence, exhibit, shown ground", "evident, exhibited, claim-grounding", "evidence keeper or exhibitor", "exhibit, proof-object", "legal evidence or exhibit record", "proof handled with care"],
    ["JN", "Law/civic life", "jury, council, deliberating body, collective judgment", "deliberate as council or jury", "jury, council, deliberating body", "juried, counciled, deliberative", "juror, council member", "jury panel, council seat", "jury service or council record", "judgment shared among peers"],
    ["VM", "Technology", "prompt, invocation, input that calls a system", "prompt, invoke, or call a system", "prompt, invocation, system input", "prompted, invoked, input-bearing", "prompter or invoker", "prompt, input call", "recorded prompt or invocation log", "careful call made to another mind"],
    ["YR", "Technology", "algorithm, procedure, ordered method, repeatable path", "algorithmize, procedurize, or order method", "algorithm, procedure, ordered method", "algorithmic, procedural, repeatable", "algorithm-maker or procedure keeper", "algorithm, procedure, method-step", "technical procedure or standard method", "method shared without concealment"],
    ["ZY", "Technology", "alignment, fit, value-direction, directed agreement", "align, fit, or direct values", "alignment, fit, directed agreement", "aligned, fitting, value-directed", "aligner or fit-maker", "alignment mark, fit relation", "safety alignment or policy fit", "agreement kept with inner truth"],
    ["HG", "Technology", "interface, display, meeting surface, human-system face", "interface, display, or make a meeting surface", "interface, display, system face", "interfaced, displayed, face-bearing", "interface designer or display keeper", "screen, interface, display surface", "public interface or accessibility standard", "surface made to be understood"],
    ["JC", "Technology", "sensor, detector, instrument of notice, measured perception", "sense, detect, or instrument notice", "sensor, detector, measured perception", "sensing, detected, instrumented", "sensor, detector, observer device", "sensor reading, detection sign", "safety sensor or inspection standard", "attention extended by tool"],
    ["TX", "Technology", "protocol, handshake, ordered exchange, communication rule", "protocolize, handshake, or regulate exchange", "protocol, handshake, communication rule", "protocol-bound, exchanged, rule-ordered", "protocol keeper or exchange agent", "protocol frame, handshake", "network protocol or public standard", "agreed exchange that protects trust"],
    ["WV", "Technology", "storage, cache, saved state, retained data", "store, cache, or retain data", "storage, cache, retained state", "stored, cached, retained", "storekeeper or cache system", "storage place, cache, saved state", "data retention rule or archive standard", "memory held safely"],
    ["FK", "Technology", "key, credential, access sign, unlocking trust", "key, credential, or unlock access", "key, credential, access sign", "keyed, credentialed, access-bearing", "key holder or credential keeper", "key, token, credential", "access credential or key registry", "trust token guarded closely"],
    ["GY", "Technology", "agent, delegated actor, task-performing system", "act as agent or delegate action", "agent, delegated actor", "agentic, delegated, task-performing", "agent or delegated system", "agent process, delegated task", "registered agent or delegated authority", "helpful agency held accountable"],
    ["XZ", "Technology", "error, fault, failure signal, broken process", "error, fail, or signal fault", "error, fault, failure signal", "faulted, failed, erroneous", "error reporter or faulting process", "error, fault, exception", "incident report or failure record", "failure admitted for repair"],
    ["BP", "Technology", "backup, redundancy, preserved copy, recovery reserve", "back up, copy, or preserve reserve", "backup, redundancy, recovery reserve", "backed-up, redundant, preserved", "backup keeper or redundancy system", "backup copy, recovery image", "retention policy or backup standard", "copy kept so memory survives"],
    ["ZM", "Mind", "zero, null, absence in count, mathematical nothing", "zero, null, or set count to none", "zero, null, counted absence", "zeroed, null, absent-in-count", "one who zeros or nulls", "zero mark, null value", "official zero value or null record", "nothing named without nihilism"],
    ["GC", "Mind", "category, class, kind, named group", "categorize, classify, or group by kind", "category, class, kind", "categorical, classified, kind-bearing", "classifier or category maker", "category label, class", "classification standard or legal category", "being named in the right kind"],
    ["VT", "Mind", "variable, parameter, changeable term, open value", "vary, parameterize, or hold open value", "variable, parameter, changeable term", "variable, parametric, changeable", "one who varies or sets parameters", "variable, parameter, open value", "technical parameter or variable record", "change named without betrayal"],
    ["DF", "Mind", "definition, boundary of meaning, precise saying", "define, delimit, or make meaning precise", "definition, meaning boundary", "defined, precise, delimited", "definer or meaning keeper", "definition, term boundary", "official definition or standard term", "meaning clarified between persons"],
    ["LK", "Mind", "theory, explanatory frame, pattern of causes", "theorize, frame, or explain causes", "theory, explanatory frame", "theoretical, framed, cause-patterned", "theorist or frame maker", "theory, model of causes", "public theory or academic frame", "explanation offered humbly"],
    ["XN", "Mind", "uncertainty, unknown range, unsolved question", "remain uncertain or mark unknown range", "uncertainty, unknown range", "uncertain, unknown, question-bearing", "uncertainty keeper or questioner", "unknown range, uncertainty mark", "risk disclosure or uncertainty note", "not knowing confessed honestly"],
    ["YK", "Mind", "function, mapping, relation of input to result", "function, map, or relate input to result", "function, mapping, input-result relation", "functional, mapped, relational", "function maker or mapper", "function, mapping, relation rule", "technical function or mathematical mapping", "relation made intelligible"],
    ["BS", "Mind", "base, foundation, premise, starting ground", "base, found, or set premise", "base, foundation, premise", "basic, foundational, premise-bearing", "founder or premise keeper", "base, premise, foundation point", "official premise or foundational rule", "ground named before trust"],
    ["WF", "Mind", "wave, frequency, oscillation, patterned recurrence", "wave, oscillate, or recur by frequency", "wave, frequency, oscillation", "wavelike, frequent, oscillating", "wave source or frequency keeper", "wave, signal frequency", "frequency standard or spectrum record", "recurrence felt in breath"],
    ["GR", "Nature", "animal, beast, creature, moving life-form", "animalize, move as creature, or herd", "animal, creature, moving life", "animal, creaturely, beast-like", "animal or keeper of animals", "animal, herd, creature body", "animal protection or classification", "creaturely life recognized"],
    ["YV", "Nature", "seed, germ, potential life, beginning growth", "seed, germinate, or hold potential life", "seed, germ, potential life", "seeded, germinal, potential", "sower or seed keeper", "seed, germ, planted beginning", "seed stock or agriculture record", "small beginning protected"],
    ["JP", "Nature", "sea, ocean, deep water, vast flow", "sail, sea, or move in deep water", "sea, ocean, deep water", "oceanic, sea-borne, deep-flowing", "sailor or sea keeper", "sea, ocean, deep water body", "maritime law or ocean stewardship", "vastness felt beside another"],
    ["BK", "Nature", "stone, mineral, hard earth, enduring matter", "harden, stone, or mineralize", "stone, mineral, hard earth", "stony, mineral, enduring", "stoneworker or mineral keeper", "stone, mineral, rock body", "mineral right or building stone standard", "endurance held in the hand"],
    ["HS", "Nature", "weather, climate, sky condition, changing air", "weather, climate, or condition the sky", "weather, climate, sky condition", "weathered, climatic, sky-conditioned", "weather watcher or climate keeper", "weather sign, climate record", "public weather alert or climate standard", "shared sky noticed together"],
    ["ZW", "Nature", "storm, violent weather, disruptive force", "storm, surge, or disrupt like weather", "storm, violent weather, disruptive force", "storming, turbulent, disruptive", "storm bearer or emergency watcher", "storm, surge, hazard", "storm warning or emergency order", "danger weathered together"],
    ["LF", "Nature", "leaf, foliage, green surface, plant breath", "leaf, unfold, or grow foliage", "leaf, foliage, green surface", "leafy, green, foliage-bearing", "leaf bearer or plant keeper", "leaf, foliage, green sign", "botanical record or crop foliage standard", "green life tended closely"],
    ["WT", "Nature", "wood, forest, timber, living material", "wood, forest, or gather timber", "wood, forest, timber", "wooden, forested, timber-bearing", "forester or woodworker", "wood, timber, forest stand", "forest law or timber stewardship", "shelter grown over time"],
    ["LC", "Ritual/poetry", "rhythm, beat, meter, patterned time in speech", "rhythm, beat, or shape meter", "rhythm, beat, poetic meter", "rhythmic, metered, beat-bearing", "rhythm keeper or drummer", "beat, meter, cadence mark", "ceremonial meter or performance standard", "shared pulse of speech"],
    ["TY", "Ritual/poetry", "performance, drama, enacted story, public showing", "perform, dramatize, or enact story", "performance, drama, enacted story", "performed, dramatic, enacted", "performer or actor", "performance, drama, stage act", "public performance license or ceremony", "truth enacted before another"],
    ["DP", "Ritual/poetry", "poem, verse, compressed beauty, shaped utterance", "poem, versify, or compress beauty", "poem, verse, shaped utterance", "poetic, versed, compressed", "poet or verse maker", "poem, verse line", "public poem or ceremonial text", "beauty spoken closely"],
    ["RK", "Time", "event, occurrence, happening, marked change", "happen, occur, or mark an event", "event, occurrence, marked change", "eventful, occurring, change-marked", "event witness or recorder", "event, occurrence, record point", "public event record or incident log", "what happened held between us"],
    ["YT", "Time", "era, period, age, named season of history", "periodize, age, or name an era", "era, period, historical age", "periodic, era-bound, age-marked", "historian of an era", "era, period, age mark", "official term or historical period", "a season remembered together"],
    ["WM", "Time", "exile, distance from home, displacement, away-memory", "exile, displace, or live away from home", "exile, displacement, away-memory", "exiled, displaced, away-bound", "exile or displaced one", "exile place, displacement record", "asylum, exile status, or migration record", "distance from home carried in heart"],
    ["XC", "Conflict/repair", "threat, menace, impending harm, warned danger", "threaten, menace, or signal impending harm", "threat, menace, impending harm", "threatening, menacing, danger-bearing", "warns of or brings threat", "threat sign, menace, danger warning", "public threat notice or security warning", "danger named so care can begin"],
    ["XW", "Conflict/repair", "defense, shield, guarded resistance, protective force", "defend, shield, or resist harm", "defense, shield, guarded resistance", "defensive, shielded, protective", "defends or shields the vulnerable", "shield, defense line, protective barrier", "legal defense or public protection duty", "protection offered without domination"],
    ["KX", "Conflict/repair", "weapon, arms, force-tool, instrument of harm or defense", "arm, weaponize, or bear force", "weapon, arms, force-tool", "armed, weapon-bearing, force-ready", "bears or controls weapons", "weapon, arm, force instrument", "weapons law or authorized force record", "force held with fear and restraint"],
    ["HX", "Conflict/repair", "harm, damage, injury done by action", "harm, damage, or injure", "harm, damage, injury", "harmful, damaging, injurious", "harms or records harm", "harm done, injury, damage mark", "harm report or liability record", "hurt confessed without evasion"],
    ["ZK", "Conflict/repair", "enemy, hostile force, active adversary", "oppose as hostile or make enemy", "enemy, hostile force, adversary", "hostile, enemy-facing, adversarial", "stands as hostile adversary", "enemy force, hostile party", "declared enemy or hostile actor", "the opponent still seen as morally answerable"],
    ["GX", "Conflict/repair", "attack, assault, strike, forceful initiative", "attack, assault, or strike", "attack, assault, strike", "attacking, assaultive, strike-bearing", "attacks or initiates force", "attack act, assault, strike", "assault charge or attack report", "the blow named before repair"],
    ["XD", "Conflict/repair", "capture, arrest, seizure, restraint of movement", "capture, arrest, seize, or restrain", "capture, arrest, seizure", "captured, restrained, seized", "captures or lawfully restrains", "captive, arrest, restraint order", "arrest record or custody order", "restraint handled with dignity"],
    ["JT", "Conflict/repair", "strategy, campaign, ordered contest plan", "strategize, campaign, or plan contest", "strategy, campaign, contest plan", "strategic, campaign-shaped, tactical", "plans a campaign or contest", "strategy, campaign plan, tactic", "public strategy or defense plan", "a hard path chosen with counsel"],
    ["PJ", "Conflict/repair", "patrol, watch, guard route, protective circuit", "patrol, watch, or guard by moving", "patrol, watch, guard route", "patrolling, watchful, guard-bound", "patrols or keeps watch", "patrol route, watch post", "public patrol or guard duty", "watch kept so others may rest"],
    ["VR", "Conflict/repair", "victory, prevailed contest, won protection", "prevail, win, or secure victory", "victory, prevailed contest", "victorious, prevailing, won", "wins or secures victory", "victory mark, won contest", "official victory or resolved contest", "relief after danger has passed"],
    ["CW", "Conflict/repair", "truce, ceasefire, restrained conflict, held peace", "truce, cease fire, or restrain conflict", "truce, ceasefire, restrained conflict", "truced, restrained, ceasefire-bound", "keeps truce or restrains force", "truce agreement, ceasefire line", "ceasefire order or armistice record", "a pause protected for repair"],
    ["ZL", "Conflict/repair", "danger, hazard, exposed risk, unsafe condition", "endanger, hazard, or expose to risk", "danger, hazard, exposed risk", "dangerous, hazardous, unsafe", "marks or carries danger", "hazard, danger point, risk sign", "hazard warning or safety violation", "risk named to protect the beloved"],
    ["DX", "Conflict/repair", "surrender, yielding, laying down force", "surrender, yield, or lay down force", "surrender, yielding, force laid down", "surrendered, yielded, disarmed", "surrenders or receives surrender", "surrender act, yielded weapon", "surrender record or disarmament term", "letting go when pride must end"],
    ["SY", "Conflict/repair", "intelligence, spycraft, hidden notice in conflict", "gather intelligence, spy, or observe covertly", "intelligence, spycraft, covert notice", "covert, intelligence-bearing, hidden-watchful", "gathers intelligence or spies", "intelligence report, covert sign", "intelligence file or surveillance warrant", "hidden knowledge handled with conscience"],
    ["FX", "Conflict/repair", "fortification, stronghold, prepared defense", "fortify, entrench, or make stronghold", "fortification, stronghold, prepared defense", "fortified, entrenched, stronghold-bearing", "fortifies or keeps a stronghold", "fort, barrier, defended place", "fortification standard or defense works", "shelter made strong for those inside"],
    ["DL", "Law/civic life", "debt, liability, owed balance, unsettled account", "indebt, charge, or hold liable", "debt, liability, owed balance", "indebted, liable, account-bound", "owes or accounts for debt", "debt, liability, balance due", "debt record or legal liability", "what one owes named plainly"],
    ["TB", "Law/civic life", "treaty, pact between peoples, public accord", "treaty, accord, or bind peoples by pact", "treaty, public accord, interpeople pact", "treatied, accorded, pact-bound", "keeps or negotiates treaty", "treaty text, accord, public pact", "ratified treaty or diplomatic accord", "peace promised beyond the household"],
    ["DR", "Body", "drink, liquid nourishment, thirst answer", "drink, water, or give liquid nourishment", "drink, liquid nourishment", "drinkable, thirst-answering, liquid", "gives or takes drink", "drink, cup, liquid portion", "public water provision or beverage standard", "need answered with care"],
    ["FB", "Body", "cooking, prepared food, meal-making heat", "cook, prepare food, or make a meal", "cooking, prepared meal, meal-making", "cooked, prepared, meal-bearing", "cooks or prepares food", "meal, cooked portion, prepared dish", "food preparation standard or kitchen record", "meal made as care"],
    ["FG", "Nature", "grain, bread-staple, stored nourishment seed", "grain, mill, or make staple food", "grain, bread-staple, stored nourishment", "grain-bearing, staple, bread-ready", "grows or stores grain", "grain, bread, staple store", "grain standard or public food reserve", "daily bread remembered with thanks"],
    ["HB", "Body", "hunger, appetite, bodily need for food", "hunger, crave food, or need nourishment", "hunger, appetite, food-need", "hungry, appetite-bearing, unfed", "hungers or feeds the hungry", "hunger pang, appetite, food need", "hunger report or food-aid claim", "need spoken before shame"],
    ["WC", "Body", "cleanliness, washing, removal of dirt or stain", "clean, wash, or remove dirt", "cleanliness, washing, unstained state", "clean, washed, unstained", "cleans or washes", "wash, clean surface, removed stain", "sanitation standard or cleaning record", "care shown by making clean"],
    ["HR", "Building/making", "room, chamber, bounded interior space", "room, chamber, or make interior space", "room, chamber, interior space", "roomed, chambered, interior", "keeps or prepares a room", "room, chamber, private interior", "housing room standard or occupancy record", "a place made ready for nearness"],
    ["KC", "Body", "taste, flavor, savor, discerned food quality", "taste, flavor, or savor", "taste, flavor, savor", "tasted, flavorful, savory", "tastes or judges flavor", "flavor, taste mark, savor", "food quality standard or taste note", "the small pleasure of shared food"],
    ["FS", "Body", "smell, scent, odor, breath-borne sign", "smell, scent, or carry odor", "smell, scent, odor", "scented, odorous, smell-bearing", "smells or tracks scent", "scent, odor, smell sign", "odor notice or environmental smell report", "the remembered scent of home"],
    ["TW", "Building/making", "carrying, transport, bearing a load", "carry, transport, or bear a load", "carrying, transport, burden-bearing", "carried, transported, load-bearing", "carries or transports", "load, carried thing, transport unit", "transport duty or freight record", "the burden carried for another"],
    ["SC", "Mind", "school, learning house, organized instruction", "school, instruct, or gather learners", "school, learning house, instruction body", "schooled, instructional, learner-gathering", "keeps school or instructs learners", "school, class, instruction place", "school charter or education record", "a place where growth is protected"],
    ["LV", "Mind", "lesson, taught unit, remembered instruction", "lesson, teach a unit, or receive instruction", "lesson, taught unit, instruction memory", "lessoned, instructed, teachable", "gives or receives a lesson", "lesson, assignment, taught unit", "curriculum unit or lesson record", "a truth handed from teacher to learner"],
    ["XM", "Mind", "examination, trial of knowledge, tested mastery", "examine, test, or prove learning", "examination, test, knowledge trial", "examined, tested, assessed", "examines or is examined", "exam, test, assessment mark", "formal examination or assessment record", "being tested without humiliation"],
    ["MT", "Mind", "mastery, mature skill, practiced command", "master, become skilled, or command a craft", "mastery, mature skill, practiced command", "mastered, skilled, practiced", "masters or mentors a craft", "mastered skill, competency mark", "credentialed mastery or professional standard", "skill ripened by patient effort"],
    ["NY", "Mind", "question, inquiry, asked opening", "question, inquire, or open investigation", "question, inquiry, asked opening", "questioning, inquiring, open", "asks or investigates", "question, inquiry prompt", "official inquiry or research question", "honest asking without accusation"],
    ["VW", "Mind", "exercise, drill, repeated practice for formation", "exercise, drill, or practice repeatedly", "exercise, drill, repeated practice", "practiced, drilled, exercise-shaped", "trains by repetition", "exercise, drill, practice set", "training exercise or practice requirement", "repetition that forms the self"],
    ["SV", "Technology", "server, service node, system that responds", "serve requests, host, or respond as system", "server, service node, response system", "server-side, hosted, service-bearing", "serves requests or hosts a system", "server, service node, host", "server standard or service record", "help offered through reliable response"],
    ["DB", "Technology", "database, structured store, queryable memory", "database, store structurally, or make queryable", "database, structured store, queryable memory", "database-backed, structured, queryable", "keeps structured data", "database, table store, record set", "database registry or data store standard", "memory arranged so it can answer"],
    ["CD", "Technology", "computation, calculation, machine reckoning", "compute, calculate, or reckon by machine", "computation, calculation, reckoning", "computed, calculated, computational", "computes or calculates", "computed result, calculation step", "computation log or calculation standard", "careful reckoning before action"],
    ["KL", "Technology", "encryption, secrecy by key, protected encoding", "encrypt, conceal by key, or encode secretly", "encryption, keyed secrecy, protected encoding", "encrypted, key-protected, concealed", "encrypts or guards coded secrecy", "ciphertext, encrypted message", "encryption standard or cryptographic record", "secrecy kept for rightful trust"],
    ["NX", "Technology", "search, index, retrieval of stored memory", "search, index, or retrieve records", "search, index, retrieval", "indexed, searchable, retrieved", "searches or indexes memory", "index, search result, retrieval path", "search log or indexing standard", "finding what memory has kept"],
    ["SR", "Technology", "software, application, executable instruction body", "software, make application, or package code", "software, application, instruction body", "software-based, executable, app-bearing", "builds or maintains software", "application, software package, executable", "software release or application registry", "tool made to serve a human task"],
    ["ZH", "Technology", "automation, self-running process, delegated repetition", "automate, self-run, or delegate repetition", "automation, self-running process", "automated, self-running, delegated", "automates or supervises automation", "automated process, job, routine", "automation policy or job record", "delegated repetition kept answerable"],
    ["MB", "Law/civic life", "purchase, buying, acquired exchange", "buy, purchase, or acquire by exchange", "purchase, buying, acquired exchange", "purchased, bought, exchange-acquired", "buys or procures", "purchase, bought item, order", "purchase order or procurement record", "need met by fair exchange"],
    ["TC", "Law/civic life", "price, cost, counted exchange demand", "price, cost, or set exchange demand", "price, cost, counted demand", "priced, costly, cost-bearing", "prices or calculates cost", "price, cost, quoted amount", "price list or cost record", "the cost named before consent"],
    ["ZV", "Law/civic life", "credit, loan, trust extended over time", "credit, lend, or extend trust over time", "credit, loan, delayed trust", "credited, loaned, trust-extended", "lends or extends credit", "loan, credit line, borrowed amount", "loan agreement or credit record", "trust that must remember its burden"],
    ["RP", "Law/civic life", "wealth, abundance, surplus, stored provision", "enrich, prosper, or gather surplus", "wealth, abundance, surplus provision", "wealthy, abundant, surplus-bearing", "stewards or gathers wealth", "wealth, reserve, surplus", "wealth declaration or asset record", "abundance held for duty"],
    ["NG", "Law/civic life", "poverty, shortage, unmet provision need", "impoverish, lack provision, or fall short", "poverty, shortage, unmet need", "poor, scarce, provision-lacking", "bears poverty or responds to need", "shortage, poverty mark, unmet need", "poverty report or aid eligibility", "need seen without contempt"],
    ["ST", "Law/civic life", "store, shop, stock, commercial place", "store, stock, or sell from a shop", "store, shop, commercial stock", "stored, stocked, shop-kept", "keeps shop or manages stock", "shop, storehouse, stock item", "commercial license or inventory record", "provision kept within reach"],
    ["HT", "Nature", "mountain, height, high land, ascent", "heighten, climb, or stand as mountain", "mountain, height, high land", "high, mountainous, elevated", "climbs or keeps high land", "mountain, summit, high place", "mountain boundary or elevation record", "height approached with humility"],
    ["RV", "Time", "arrival, reaching, coming into presence", "arrive, reach, or come into presence", "arrival, reaching, presence reached", "arrived, reached, present", "arrives or receives arrival", "arrival point, reached place", "arrival record or entry notice", "coming near after distance"],
    ["VD", "Time", "departure, leaving, going away from presence", "depart, leave, or go away", "departure, leaving, going away", "departed, leaving, outbound", "departs or sends away", "departure point, exit, leaving act", "departure record or exit notice", "leaving named without disappearance"],
    ["VC", "Technology", "vehicle, carrier, moving conveyance", "vehicle, convey, or move by carrier", "vehicle, carrier, conveyance", "vehicular, carried, conveyance-bound", "drives or maintains a vehicle", "vehicle, conveyance, carrier", "vehicle registration or transport standard", "a carrier trusted with bodies"],
    ["YX", "Time", "distance, remoteness, far separation", "distance, separate, or make remote", "distance, remoteness, far separation", "distant, remote, far", "measures or crosses distance", "distance mark, far place, interval", "distance record or remote access rule", "far-nearness held by memory"],
    ["FW", "Nature", "farm, cultivated land, provision field", "farm, cultivate land, or steward crops", "farm, cultivated land, provision field", "farmed, cultivated, field-bearing", "farms or stewards crops", "farm, field, cultivated plot", "agriculture parcel or farm standard", "land tended for future mouths"],
    ["YF", "Nature", "fish, water-creature, harvested life from water", "fish, harvest water-life, or live as fish", "fish, water-creature, aquatic harvest", "fish-bearing, aquatic, water-living", "fishes or keeps water-life", "fish, catch, aquatic body", "fishery rule or aquatic harvest record", "life taken from water with restraint"],
    ["HC", "Nature", "river, stream, flowing path of water", "river, stream, or flow in a channel", "river, stream, watercourse", "riverine, streamed, flowing", "keeps or crosses a river", "river, stream, watercourse", "waterway boundary or river standard", "water path remembered by a people"],
    ["GB", "Nature", "soil, ground, fertile earth, walked surface", "soil, ground, or make fertile earth", "soil, ground, fertile earth", "soiled, grounded, fertile", "keeps soil or works ground", "soil, ground, field surface", "soil classification or land record", "earth held in the hand"],
    ["GS", "Nature", "grass, pasture, low green cover", "grass, pasture, or cover with low growth", "grass, pasture, low green cover", "grassy, pastoral, low-growing", "keeps pasture or grassland", "grass, pasture, grazing field", "pasture rule or grassland record", "soft green under ordinary steps"],
    ["FN", "Seeing/knowing", "focus, concentration, directed attention, centered notice", "focus, concentrate, or direct attention", "focus, concentration, directed attention", "focused, concentrated, attention-centered", "focuses or keeps attention", "focus point, concentration field", "attention standard or focus requirement", "attention given without distraction"],
    ["PW", "Seeing/knowing", "perception, awareness, awake notice, sensed field", "perceive, become aware, or notice awake", "perception, awareness, sensed field", "aware, perceptive, awake-noticing", "perceives or awakens notice", "perception, awareness mark", "public awareness notice or perception record", "being awake to another's presence"],
    ["JR", "Seeing/knowing", "discernment, distinction, recognized difference", "discern, distinguish, or recognize difference", "discernment, distinction, difference recognized", "discerning, distinct, difference-bearing", "discerns or distinguishes", "distinction, difference mark", "official distinction or classification record", "difference noticed without contempt"],
    ["BC", "Speech", "broadcast, publication, public sending of speech", "broadcast, publish, or send speech publicly", "broadcast, publication, public message", "broadcasted, published, publicly sent", "broadcaster or publisher", "broadcast, published notice", "public broadcast or publication record", "a word sent beyond the room"],
    ["FM", "Speech", "rumor, report, unverified carried speech", "rumor, report, or carry unverified speech", "rumor, report, carried speech", "reported, rumored, carried", "reports or spreads rumor", "report, rumor, carried claim", "public report or rumor notice", "a claim handled before certainty"],
    ["GT", "Speech", "grammar, syntax, ordered speech structure", "grammar, order speech, or arrange syntax", "grammar, syntax, speech order", "grammatical, syntactic, ordered", "grammarian or syntax keeper", "grammar rule, syntactic frame", "language standard or grammatical rule", "ordered speech that protects meaning"],
    ["JY", "Speech", "translation, interpretation, meaning carried across tongues", "translate, interpret, or carry meaning across speech", "translation, interpretation", "translated, interpreted, cross-spoken", "translator or interpreter", "translation text, interpreted meaning", "certified translation or interpretation record", "meaning carried faithfully between persons"],
    ["MW", "Ritual/poetry", "music, melody, patterned sound, voiced beauty", "make music, sing melody, or shape sound", "music, melody, patterned sound", "musical, melodic, sound-shaped", "musician or melody keeper", "melody, tune, music line", "public music or performance record", "sound that carries feeling"],
    ["SZ", "Speech", "symbol, sign, emblem, compressed meaning", "symbolize, mark, or carry compressed meaning", "symbol, sign, emblem", "symbolic, emblematic, sign-bearing", "symbol-maker or sign keeper", "symbol, emblem, sign mark", "official symbol or public emblem", "meaning held in a small form"],
    ["XT", "Speech", "text, readable content, written thread of meaning", "text, write content, or make readable thread", "text, readable content, written thread", "textual, readable, content-bearing", "text maker or editor", "text, content, written passage", "official text or publication content", "words held for later reading"],
    ["PD", "Speech", "print, publication page, reproduced written form", "print, reproduce text, or publish on page", "print, printed page, reproduction", "printed, reproduced, page-bound", "printer or publisher", "printed page, copy, edition", "print record or publication issue", "a word made durable for many hands"],
    ["PH", "Speech", "phone, distant voice, call carried through a tool", "phone, call, or carry voice at distance", "phone, call, distant voice", "phoned, voice-carried, distant-speaking", "caller or voice carrier", "call, phone line, distant voice", "call record or communication standard", "a voice reaching across distance"],
    ["DW", "Building/making", "door, entry, closeable passage, household threshold", "door, enter, or make a closeable passage", "door, entry, closeable passage", "doored, enterable, thresholded", "door keeper or entry maker", "door, entry panel, threshold passage", "building entry or access standard", "a threshold opened in trust"],
    ["GH", "Building/making", "gate, portal, controlled public entry", "gate, open portal, or control entry", "gate, portal, controlled entry", "gated, portal-bound, entry-controlled", "gatekeeper or portal maker", "gate, portal, entry control", "public gate or access checkpoint", "entry guarded without contempt"],
    ["WB", "Building/making", "wall, enclosure, protective boundary", "wall, enclose, or make boundary", "wall, enclosure, protective boundary", "walled, enclosed, boundary-bearing", "wall builder or boundary keeper", "wall, enclosure, boundary line", "building wall or zoning boundary", "protection that does not erase welcome"],
    ["LP", "Building/making", "lamp, light-tool, carried clarity", "lamp, light, or carry clarity by tool", "lamp, light-tool, carried clarity", "lamp-lit, illuminated, clarity-bearing", "lamp keeper or light bearer", "lamp, light device, carried flame", "lighting standard or public lamp record", "small clarity kept for another"],
    ["GP", "Building/making", "package, container, wrapped carried thing", "package, wrap, contain, or prepare for carrying", "package, container, wrapped load", "packaged, contained, wrapped", "packager or container keeper", "package, container, parcel", "shipping package or container record", "a thing prepared to travel safely"],
    ["HK", "Building/making", "hook, attachment, fastening point, held link", "hook, attach, fasten, or catch", "hook, attachment, fastening point", "hooked, attached, fastened", "attaches or fastens", "hook, clasp, attachment point", "fastening standard or attachment record", "holding without grasping too hard"],
    ["GD", "Nature", "garden, cultivated beauty, tended green place", "garden, tend, or cultivate beauty", "garden, cultivated beauty, tended place", "gardened, cultivated, tended-green", "gardener or tender of green place", "garden, tended plot, cultivated beauty", "public garden or land-care record", "beauty grown by patience"],
    ["GG", "Mind", "graph, chart, visible relation, drawn structure", "graph, chart, or draw relation", "graph, chart, visible relation", "graphed, charted, relation-drawn", "graphs or charts relations", "graph, chart, plotted relation", "official chart or analytic graph", "relation made visible to thought"],
    ["LT", "Future/civilization", "legacy, tradition, carried form across time", "legacy, transmit tradition, or carry form forward", "legacy, tradition, inherited form", "traditional, legacy-bearing, carried-forward", "tradition bearer or legacy keeper", "legacy object, tradition form", "heritage standard or legacy record", "what the future receives from memory"],
    ["MJ", "Future/civilization", "monument, memorial structure, public memory made visible", "monumentalize, memorialize, or make public memory visible", "monument, memorial, public memory", "monumental, memorial, publicly remembered", "memorial maker or keeper", "monument, memorial marker", "public monument or heritage record", "memory given durable form"],
    ["BM", "Future/civilization", "custom, habit of a people, repeated cultural form", "customize, habituate, or keep cultural practice", "custom, habit, cultural practice", "customary, habitual, culture-shaped", "keeps custom or forms habit", "custom, habit, repeated practice", "public custom or cultural practice record", "ordinary repetition that teaches belonging"],
    ["ZF", "Future/civilization", "generation, age-cohort, people born into one season", "generate, form a cohort, or stand as generation", "generation, cohort, age-born people", "generational, cohort-bound, age-marked", "generation bearer or cohort member", "generation, cohort mark", "demographic cohort or generational record", "the living bridge between ancestors and future"],
    ["LR", "Family", "lineage, descent line, succession of kin", "line, descend, or carry succession", "lineage, descent, succession", "lineal, descended, succession-bearing", "lineage keeper or descendant", "lineage mark, descent record", "succession record or descent claim", "the family line remembered without possession"],
    ["MH", "Love/intimacy", "mercy, compassion, tenderness toward weakness", "show mercy, have compassion, or soften toward weakness", "mercy, compassion, tender regard", "merciful, compassionate, tender", "one who shows mercy", "mercy act, compassionate response", "clemency record or mercy petition", "strength made gentle before suffering"],
    ["YL", "Love/intimacy", "affection, tenderness, warm nearness", "show affection, tend tenderly, or draw near warmly", "affection, tenderness, warm nearness", "affectionate, tender, warm-near", "one who gives affection", "affection sign, tender gesture", "recognized bond or care note", "warmth offered without demand"],
    ["VF", "Love/intimacy", "embrace, holding, bodily shelter of another", "embrace, hold, or shelter bodily", "embrace, holding, bodily shelter", "embraced, held, sheltering", "embraces or holds protectively", "embrace, held body, sheltering gesture", "care restraint or protective hold record", "nearness that protects without owning"],
    ["WG", "Love/intimacy", "welcome, hospitality, received nearness", "welcome, host, or receive into nearness", "welcome, hospitality, received nearness", "welcoming, hospitable, received", "host or welcomer", "welcome, hospitality act", "public reception or hospitality standard", "opening the house without losing its order"],
    ["BL", "Love/intimacy", "belonging, attachment, being held in a circle", "belong, attach, or hold within a circle", "belonging, attachment, held circle", "belonging, attached, circle-held", "belongs or receives belonging", "belonging mark, attachment bond", "membership record or belonging claim", "the relief of having a place"],
    ["LY", "Love/intimacy", "loyalty, fidelity, faithful standing with another", "be loyal, keep fidelity, or stand faithfully", "loyalty, fidelity, faithful standing", "loyal, faithful, fidelity-bearing", "loyal one or faithful keeper", "loyal act, fidelity bond", "formal loyalty or allegiance record", "staying when staying is chosen"],
    ["RM", "Body", "hand, grasp, manual action, held power", "hand, grasp, or act manually", "hand, grasp, manual action", "manual, grasped, hand-bearing", "grasps or works by hand", "hand, grip, manual mark", "manual act or handprint record", "touch shaped into agency"],
    ["TG", "Body", "tongue, taste-speech organ, mouth movement", "tongue, taste, or speak by mouth movement", "tongue, taste-speech organ", "tongued, oral, taste-speaking", "uses tongue or oral speech", "tongue, oral gesture, taste organ", "oral record or speech organ note", "the body where taste and speech meet"],
    ["SB", "Body", "shoulder, support, carried weight", "shoulder, support, or bear weight", "shoulder, support, weight-bearing place", "shouldered, supportive, load-bearing", "supports or shoulders burden", "shoulder, carried load, support point", "injury support or load standard", "a body made to carry with another"],
    ["BH", "Body", "bone, skeleton, inner frame, hard support", "bone, frame, or harden support", "bone, skeleton, inner frame", "bony, skeletal, frame-bearing", "sets or studies bone", "bone, skeleton part, hard frame", "medical bone record or skeletal standard", "the hidden frame that lets the body stand"],
    ["HP", "Body", "ear, hearing, listening organ, received sound", "hear, listen, or receive sound", "ear, hearing, received sound", "heard, listening, sound-receiving", "listener or hearer", "ear, hearing mark, received sound", "hearing record or acoustic standard", "receiving another before answering"],
    ["HW", "Body", "hair, fiber, fine covering, bodily thread", "hair, cover with fiber, or thread finely", "hair, fiber, bodily thread", "haired, fibrous, threadlike", "keeps or tends hair", "hair, fiber, fine strand", "hair record or fiber sample", "the small covering of bodily presence"],
    ["DS", "Nature", "desert, dry land, sparse place, thirst field", "desert, dry, or become sparse land", "desert, dry land, sparse place", "desert, dry, sparse", "travels or keeps desert land", "desert, dry field, sparse place", "desert boundary or dryland record", "a place that teaches need"],
    ["PX", "Nature", "ice, frost, frozen water, hard cold", "freeze, ice, or harden with cold", "ice, frost, frozen water", "icy, frozen, frost-bearing", "freezes or keeps ice", "ice, frost, frozen surface", "ice warning or cold storage record", "water made still by cold"],
    ["JB", "Nature", "bird, winged creature, sky-moving life", "bird, fly, or move as winged life", "bird, winged creature, sky life", "winged, birdlike, sky-moving", "bird keeper or winged creature", "bird, wing, sky creature", "bird protection or avian record", "life that makes distance light"],
    ["ML", "Nature", "moon, month, night measure, reflected light", "moon, month, or measure night", "moon, month, night measure", "lunar, monthly, night-marked", "moon watcher or calendar keeper", "moon, month mark, night light", "lunar calendar or month record", "borrowed light over remembered nights"],
    ["SF", "Nature", "snow, snowfall, white cold covering", "snow, fall as white cold, or cover with snow", "snow, snowfall, cold covering", "snowy, snow-covered, cold-white", "snow watcher or winter keeper", "snow, snowfall, white cover", "snow alert or winter record", "quiet cold over the road"],
    ["GJ", "Nature", "valley, low passage, land held between heights", "valley, lower, or pass between heights", "valley, low passage, between-heights land", "valleyed, low, between-heights", "keeps or crosses a valley", "valley, lowland passage", "valley boundary or terrain record", "a sheltered path below pride"],
    ["GK", "Nature", "cloud, vapor, gathered sky-water", "cloud, vapor, or gather in the sky", "cloud, vapor, gathered sky-water", "clouded, vaporous, sky-gathered", "cloud watcher or weather keeper", "cloud, vapor mass, sky cover", "cloud forecast or weather record", "water waiting above the fields"],
    ["ZD", "Nature", "dust, dry powder, fine earth in air", "dust, powder, or scatter fine earth", "dust, dry powder, fine earth", "dusty, powdered, fine-earth", "dusts or gathers dust", "dust, powder, fine earth mark", "dust warning or particulate record", "earth small enough to enter breath"],
    ["JF", "Nature", "flower, bloom, visible plant beauty", "flower, bloom, or open in beauty", "flower, bloom, plant beauty", "flowering, blooming, beautiful-green", "flower bearer or gardener", "flower, bloom, blossom", "botanical bloom or flower record", "beauty opened by rooted patience"],
    ["KW", "Technology", "query, request, asked input to a system", "query, request, or ask a system", "query, request, system question", "queried, requested, ask-shaped", "queries or requests", "query, request, input question", "query log or request record", "a question sent to structured memory"],
    ["KM", "Technology", "kernel, core process, operating center", "kernel, core, or govern a central process", "kernel, core process, operating center", "kernel-level, core, central", "keeps the operating core", "kernel, core module, operating center", "system kernel or core process record", "the hidden center that must answer"],
    ["HF", "Technology", "file, stored document, named data object", "file, store as document, or name data object", "file, stored document, named data object", "filed, stored, document-named", "files or keeps named data", "file, document object, named data", "file registry or document record", "memory named so it can be found"],
    ["VJ", "Technology", "virtual presence, simulated environment, screen-world", "virtualize, simulate presence, or make screen-world", "virtual presence, simulated environment", "virtual, simulated, screen-world", "virtualizes or simulates environment", "virtual space, simulated presence", "virtual environment or simulation record", "distance made present by tool"],
    ["DD", "Time", "day, date, daylight cycle, ordinary counted time", "day, date, or mark the daylight cycle", "day, date, daylight cycle", "daily, dated, day-marked", "keeps dates or counts days", "day, date mark, daylight span", "calendar date or public day record", "ordinary time received with care"],
    ["HH", "Time", "hour, short measure, appointed moment", "hour, time, or mark a short appointed measure", "hour, appointed moment, short measure", "hourly, appointed, moment-marked", "keeps hours or marks appointments", "hour, time mark, appointment moment", "official hour or appointment record", "a small time kept for another"],
    ["TM", "Time", "schedule, calendar order, arranged sequence of duties", "schedule, calendar, or arrange duties by time", "schedule, calendar order, arranged duty sequence", "scheduled, calendared, time-ordered", "schedules or keeps the calendar", "schedule, calendar slot, arranged time", "public schedule or agenda record", "time arranged so promises can be kept"],
    ["TP", "Time", "pause, break, interval, held rest between actions", "pause, break, or hold interval", "pause, break, interval", "paused, intervaled, rest-marked", "pauses or keeps interval", "pause, break, rest interval", "official recess or work break record", "rest protected inside work"],
    ["TT", "Time", "deadline, due time, appointed limit", "set deadline, come due, or mark appointed limit", "deadline, due time, appointed limit", "due, deadline-bound, limit-marked", "keeps or enforces deadlines", "deadline, due mark, appointed limit", "filing deadline or legal due date", "the time that makes speech answerable"],
    ["TZ", "Time", "delay, waiting, postponed action", "delay, wait, or postpone", "delay, waiting, postponement", "delayed, waiting, postponed", "delays or waits", "delay, waiting period, postponement", "public delay notice or extension record", "waiting named without evasion"],
    ["LD", "Time", "lateness, after-time, missed appointment", "be late, arrive after time, or miss appointment", "lateness, after-time, missed time", "late, after-due, time-missed", "arrives late or bears lateness", "late mark, missed time", "late filing or tardiness record", "the humility of arriving after promise"],
    ["RD", "Time", "return, coming back, restored presence", "return, come back, or restore presence", "return, coming back, restored presence", "returned, back, restored-present", "returns or receives return", "return point, coming-back act", "return record or reentry notice", "coming back without pretending absence was nothing"],
    ["BB", "Body", "brain, nervous center, embodied thought", "brain, nerve, or centralize bodily thought", "brain, nervous center, embodied thought", "neural, brain-bearing, nervous", "keeps or studies the brain", "brain, nerve center, neural mark", "medical brain record or neurological standard", "thought held in vulnerable flesh"],
    ["BF", "Body", "muscle, strength tissue, bodily force", "muscle, strengthen, or tense bodily force", "muscle, strength tissue, bodily force", "muscular, strengthened, force-bearing", "strengthens or works muscle", "muscle, tendon force, strength mark", "muscle record or physical therapy standard", "strength that must serve care"],
    ["BW", "Body", "back, spine, rear support, carried posture", "back, support, or bear from behind", "back, spine, rear support", "backed, spinal, support-bearing", "supports or treats the back", "back, spine, rear support mark", "spine record or back injury standard", "the unseen support of standing"],
    ["BX", "Body", "illness, sickness, disorder of health", "sicken, become ill, or mark disorder", "illness, sickness, health disorder", "ill, sick, disordered", "bears or treats illness", "illness sign, sickness, disorder mark", "medical diagnosis or illness record", "weakness that calls for care"],
    ["BY", "Body", "fatigue, tiredness, spent bodily force", "tire, fatigue, or spend bodily force", "fatigue, tiredness, spent force", "tired, fatigued, spent", "tires or restores the tired", "fatigue state, tired body", "fatigue record or rest requirement", "the body asking for mercy"],
    ["BZ", "Body", "scar, healed wound, remembered harm in flesh", "scar, heal with mark, or bear wound-memory", "scar, healed wound, flesh memory", "scarred, healed-marked, wound-remembering", "bears or treats scars", "scar, healed mark, wound memory", "scar record or injury history", "harm remembered without staying open"],
    ["FF", "Body", "eye, visual organ, bodily window of seeing", "eye, look, or receive vision bodily", "eye, visual organ, bodily sight", "eyed, visual, sight-bearing", "sees by the eye or treats vision", "eye, visual mark, sight organ", "vision record or eye-care standard", "the body opening toward recognition"],
    ["FP", "Body", "foot, step, grounded movement organ", "foot, step, or move by grounded limb", "foot, step, grounded movement", "footed, stepped, ground-moving", "steps or treats the foot", "foot, step mark, track", "foot injury or walking standard", "the body keeping faith with the road"],
    ["GV", "Emotion", "gratitude, thanks, received good remembered", "thank, receive gratefully, or remember good", "gratitude, thanks, received good", "grateful, thankful, good-remembering", "gives thanks or receives gratefully", "thanks, gratitude act", "public commendation or thanks record", "memory of good turned into speech"],
    ["GZ", "Emotion", "guilt, answerable fault, inward debt for wrong", "feel guilt, become answerable, or mark fault inwardly", "guilt, answerable fault, inward debt", "guilty, answerable, fault-bearing", "bears guilt or names fault", "guilt mark, fault confession", "plea or culpability record", "the heart refusing to hide wrong"],
    ["HJ", "Emotion", "humility, low standing before truth, teachable smallness", "humble, lower oneself, or stand teachable", "humility, low standing, teachable smallness", "humble, teachable, low-standing", "humbles self or teaches humility", "humble act, low seat", "public humility or apology record", "strength kneeling before truth"],
    ["HV", "Emotion", "envy, resentful wanting, wounded comparison", "envy, resent, or want through comparison", "envy, resentful wanting, wounded comparison", "envious, resentful, comparison-wounded", "envies or heals envy", "envy mark, resentful desire", "conflict motive or grievance record", "desire that forgot gratitude"],
    ["HY", "Emotion", "laughter, humor, released delight", "laugh, joke, or release delight", "laughter, humor, released delight", "laughing, humorous, delight-released", "laughs or makes humor", "laugh, joke, humorous sign", "public humor or performance record", "delight loosening the heart"],
    ["JD", "Emotion", "pride, self-height, dignity at risk of vanity", "take pride, heighten self, or risk vanity", "pride, self-height, dignity", "proud, self-heightened, dignified", "bears pride or humbles pride", "pride act, honor height", "public pride or status claim", "dignity that must answer to truth"],
    ["JH", "Emotion", "patience, long steadiness, endured waiting", "be patient, endure, or hold steady through waiting", "patience, long steadiness, endured waiting", "patient, enduring, steady", "waits patiently or teaches endurance", "patience act, endured delay", "extension or patience record", "steadiness that refuses bitterness"],
    ["JG", "Family", "neighbor, nearby household, adjacent social duty", "neighbor, dwell nearby, or act in local nearness", "neighbor, nearby household, local nearness", "neighboring, nearby, local", "neighbor or local helper", "neighbor house, nearby person", "neighborhood record or local duty", "the person close enough to become duty"],
    ["JJ", "Family", "guest, received person, temporary household member", "guest, visit, or receive temporarily", "guest, visitor, received person", "guesting, visiting, received", "guest or visitor", "guest place, visit mark", "guest record or visitor status", "one welcomed without being possessed"],
    ["JK", "Family", "host, one who receives, keeper of welcome", "host, receive, or keep welcome", "host, receiver, keeper of welcome", "hosting, receiving, welcome-keeping", "hosts or receives guests", "host role, receiving place", "hospitality duty or host record", "the household made answerable by welcome"],
    ["JS", "Future/civilization", "community, local people, shared place-body", "community, gather locally, or form shared place", "community, local people, shared place-body", "communal, local, place-shared", "community member or local builder", "community, local body, neighborhood people", "municipal community or local association", "peoplehood at walking distance"],
    ["JX", "Law/civic life", "market, trading place, public exchange field", "market, trade publicly, or gather exchange", "market, trading place, exchange field", "marketed, commercial, exchange-gathered", "merchant or market keeper", "market, stall, exchange field", "market license or commercial district", "provision tested by public trust"],
    ["JZ", "Building/making", "workplace, workshop, place of ordered labor", "workplace, workshop, or gather labor", "workplace, workshop, labor place", "workplace-bound, workshop-made, labor-gathered", "worker or workshop keeper", "workplace, workshop, labor room", "workplace standard or labor site record", "a room where effort becomes form"],
    ["KB", "Mind", "belief, conviction, held claim about reality", "believe, hold conviction, or trust a claim", "belief, conviction, held claim", "believed, convicted, claim-held", "believer or conviction keeper", "belief statement, held claim", "belief disclosure or doctrinal record", "a claim held inside the self"],
    ["KF", "Mind", "idea, concept, mental seed, thought-form", "ideate, conceive, or form a thought", "idea, concept, thought-form", "conceptual, idea-bearing, thought-formed", "thinker or idea maker", "idea, concept mark, thought seed", "concept note or intellectual property record", "a seed carried by the mind"],
    ["KG", "Mind", "grade, mark, assessed level, learning measure", "grade, mark, or assess level", "grade, mark, assessed level", "graded, marked, level-measured", "grader or assessor", "grade, mark, score", "assessment record or educational grade", "measure used carefully on learners"],
    ["KH", "Mind", "research, investigation, disciplined search for knowledge", "research, investigate, or search disciplined knowledge", "research, investigation, disciplined inquiry", "researched, investigative, inquiry-bound", "researcher or investigator", "research question, investigation path", "research record or study protocol", "search made accountable to truth"],
    ["KJ", "Mind", "hypothesis, tentative claim, testable saying", "hypothesize, propose, or make testable claim", "hypothesis, tentative claim, testable saying", "hypothetical, tentative, testable", "proposes or tests hypothesis", "hypothesis, proposed claim", "research hypothesis or trial premise", "a claim humble enough to be tested"],
    ["KK", "Mind", "formal calculation, calculus, abstract reckoning", "calculate formally, model, or reckon abstractly", "formal calculation, calculus, abstract reckoning", "formal, calculated, abstract", "formal calculator or modeler", "calculation, formula, formal step", "formula record or mathematical procedure", "thought disciplined by number"],
    ["KS", "Mind", "cause, causation, reason why, source of change", "cause, explain, or trace source of change", "cause, causation, reason why", "causal, cause-bearing, explanatory", "causes or traces cause", "cause mark, causal chain", "causal finding or investigation record", "the why that makes judgment possible"],
    ["KY", "Mind", "pattern, recurring form, recognized structure", "pattern, recur, or recognize structure", "pattern, recurring form, structure", "patterned, recurring, structured", "patterns or recognizes form", "pattern, template, structure", "standard pattern or design record", "memory seeing form in repetition"],
    ["KZ", "Mind", "note, annotation, small memory mark", "note, annotate, or mark small memory", "note, annotation, small memory mark", "noted, annotated, memory-marked", "note-taker or annotator", "note, annotation, marginal mark", "case note or annotation record", "a small word saved against forgetting"],
    ["LH", "Nature", "rain, falling water, sky-given flow", "rain, water from sky, or receive falling water", "rain, falling water, sky flow", "rainy, watered, sky-falling", "rain watcher or water keeper", "rain, rainfall, wet sign", "rain alert or weather record", "water arriving from above"],
    ["LJ", "Nature", "insect, small winged or crawling life", "insect, swarm, or move as small life", "insect, small crawling life", "insect-like, small-living, crawling", "insect keeper or observer", "insect, swarm, small creature", "insect record or pest notice", "small life that changes the field"],
    ["LL", "Nature", "lake, still water, held basin", "lake, pool, or hold water still", "lake, still water, basin", "lake-like, still-water, basin-held", "keeps or crosses a lake", "lake, pond, water basin", "lake boundary or water quality record", "water resting where land receives it"],
    ["LS", "Nature", "lightning, sudden sky-fire, bright strike", "lightning, flash, or strike with sky-fire", "lightning, sky-fire, sudden flash", "lightning-bright, storm-struck, flashing", "watches lightning or marks strike", "lightning, flash, strike mark", "storm alert or electrical strike record", "clarity too sudden to hold"],
    ["LW", "Nature", "plant-root, underground hold, source of growth", "root, take hold underground, or anchor growth", "plant-root, underground hold, growth source", "rooted, underground, anchoring", "roots or tends roots", "root, tuber, underground hold", "botanical root or crop record", "hidden holding that lets life rise"],
    ["LZ", "Nature", "volcano, fire mountain, eruptive earth", "volcano, erupt, or release earth-fire", "volcano, fire mountain, eruptive earth", "volcanic, eruptive, fire-mountain", "erupts or studies volcanoes", "volcano, eruption, lava source", "volcanic hazard or geology record", "earth remembering its fire"],
    ["MC", "Nature", "metal, ore, hard worked matter", "metal, mine, or harden worked matter", "metal, ore, hard material", "metallic, ore-bearing, hard-worked", "metalworker or miner", "metal, ore, ingot", "metal standard or mineral record", "hard earth made useful"],
    ["MG", "Nature", "magnet, attraction, drawing force in matter", "magnetize, attract, or draw by force", "magnet, attraction, drawing force", "magnetic, attracted, force-drawn", "magnetizes or draws", "magnet, magnetic field, attraction mark", "magnetic standard or field record", "matter reaching for matter"],
    ["NC", "Ritual/poetry", "ceremony, rite, ordered solemn action", "ceremonialize, rite, or order solemn action", "ceremony, rite, solemn order", "ceremonial, ritual, solemnly ordered", "ceremony keeper or ritual actor", "ceremony, rite, solemn sequence", "public ceremony or rite record", "action shaped so memory can enter"],
    ["NH", "Ritual/poetry", "festival, feast, communal sacred joy", "festival, feast, or gather sacred joy", "festival, feast, communal joy", "festive, feast-bound, communal", "festival keeper or celebrant", "festival, feast day, celebration", "public festival or holiday record", "joy made large enough for a people"],
    ["NK", "Ritual/poetry", "offering, sacrifice, gift placed before witness", "offer, sacrifice, or place gift before witness", "offering, sacrifice, witnessed gift", "offered, sacrificial, witness-given", "offers or keeps offering", "offering, sacrifice gift", "ritual offering or donation record", "gift made serious by witness"],
    ["NP", "Ritual/poetry", "dance, embodied rhythm, patterned movement", "dance, move rhythmically, or embody meter", "dance, embodied rhythm, patterned movement", "dancing, rhythmic, movement-shaped", "dancer or movement keeper", "dance, step pattern, movement line", "public dance or performance license", "the body speaking in rhythm"],
    ["DG", "Seeing/knowing", "evidence, proof-sign, shown support for a claim", "evidence, show support, or make proof visible", "evidence, proof-sign, shown support", "evident, proof-bearing, support-shown", "bears evidence or shows proof", "evidence mark, proof support", "evidence filing or evidentiary record", "the sign offered so another can trust what is seen"],
    ["DH", "Seeing/knowing", "doubt, suspended assent, honest uncertainty before proof", "doubt, withhold assent, or suspend judgment", "doubt, suspended assent, honest uncertainty", "doubtful, unassented, proof-waiting", "doubts or tests assent", "doubt mark, open question", "formal objection or unresolved proof notice", "humility before what is not yet seen"],
    ["DJ", "Seeing/knowing", "comparison, contrast, side-by-side recognition", "compare, contrast, or recognize by side relation", "comparison, contrast, side relation", "comparative, contrasted, side-seen", "compares or contrasts", "comparison mark, contrast pair", "comparative finding or review record", "seeing one thing honestly beside another"],
    ["WX", "Seeing/knowing", "interpretation, meaning-read, sense drawn from signs", "interpret, read meaning, or draw sense from signs", "interpretation, meaning-read, sense", "interpreted, meaning-bearing, sense-read", "interprets or reads meaning", "interpretation, reading, sense claim", "official interpretation or explanatory note", "helping another understand what a sign asks"],
    ["DY", "Seeing/knowing", "hiddenness, concealment, veiled truth, guarded visibility", "hide, conceal, veil, or guard visibility", "hiddenness, concealment, veiled truth", "hidden, concealed, veiled", "hides or guards visibility", "hidden thing, veil, concealed sign", "sealed record or confidential matter", "the right measure of what should not yet be exposed"],
    ["DZ", "Moral agency", "accountability, answerability, consequence-bearing agency", "answer for, become accountable, or bear consequence", "accountability, answerability, consequence-bearing", "accountable, answerable, consequence-bound", "answers for action or bears consequence", "account, consequence, answerable act", "accountability report or responsibility finding", "the self standing where its act can be named"],
    ["FH", "Moral agency", "consent, assent, freely given permission", "consent, assent, or give permission freely", "consent, assent, free permission", "consenting, assenting, freely permitted", "consents or grants permission", "consent act, free assent", "consent record or authorization form", "yes spoken without coercion"],
    ["FJ", "Moral agency", "refusal, no, rejected claim, guarded boundary", "refuse, reject, or say no", "refusal, no, rejected claim", "refused, rejected, no-bound", "refuses or protects a boundary", "refusal act, rejected claim", "denial notice or formal refusal", "no spoken clearly enough to protect the self"],
    ["FZ", "Moral agency", "restraint, self-command, withheld force, disciplined limit", "restrain, self-command, or withhold force", "restraint, self-command, disciplined limit", "restrained, self-commanded, limited", "restrains self or limits force", "restraint act, withheld force", "use-of-force limit or restraint order", "strength held back for the sake of right measure"],
    ["HZ", "Love/intimacy", "trust, reliance, vulnerable confidence", "trust, rely, or place confidence vulnerably", "trust, reliance, vulnerable confidence", "trusted, reliable, confidence-bearing", "trusts or keeps reliance", "trust bond, reliance mark", "trust record or fiduciary reliance", "the courage to lean without surrendering sight"],
    ["WY", "Love/intimacy", "care, tending, protective attention, daily keeping", "care, tend, or keep protectively", "care, tending, protective attention", "cared-for, tended, protectively kept", "cares or tends another", "care act, tending, protection given", "care plan or guardianship record", "attention made practical for another's good"],
    ["MM", "Family", "motherhood, maternal care, origin-tenderness", "mother, nurture maternally, or give origin-care", "motherhood, maternal care, origin-tenderness", "maternal, mothering, origin-tender", "mothers or keeps maternal care", "mother, maternal bond, origin-care", "maternal status or birth-care record", "first shelter remembered in tenderness"],
    ["MX", "Family", "fatherhood, paternal charge, protective origin-duty", "father, guard paternally, or give origin-duty", "fatherhood, paternal charge, origin-duty", "paternal, fathering, origin-bound", "fathers or keeps paternal charge", "father, paternal bond, origin-duty", "paternal status or guardianship record", "strength made answerable to those it begins"],
    ["MZ", "Family", "ancestor, forebear, remembered source-person", "ancestor, forebear, or stand as remembered source", "ancestor, forebear, remembered source", "ancestral, forebearing, source-remembered", "bears ancestry or keeps forebears", "ancestor, forebear, source-person", "genealogy record or ancestral standing", "a remembered life still giving shape"],
    ["WJ", "Family", "descendant, child-to-come, future kin", "descend, receive lineage, or stand as future kin", "descendant, future kin, child-to-come", "descended, future-kin, lineage-received", "descends or bears future kinship", "descendant, future child, lineage receiver", "descendant record or succession notice", "the future made personal inside the house"],
    ["WP", "Family", "clan, extended kin, wider household circle", "clan, gather extended kin, or widen household", "clan, extended kin, wider household", "clan-bound, extended-kin, house-widened", "keeps clan or gathers extended kin", "clan circle, kin group, wider house", "clan record or kinship association", "belonging widened without losing names"],
    ["NS", "Body", "mouth, eating-speech opening, bodily gate of words", "mouth, eat, or open bodily speech", "mouth, eating-speech opening", "mouthed, oral, speech-open", "uses the mouth or keeps oral care", "mouth, oral opening, bite-speech gate", "dental-oral record or mouth-care standard", "the body gate where need and word meet"],
    ["NT", "Body", "nose, breath-scent organ, face-breath passage", "nose, smell, or breathe by face passage", "nose, breath-scent organ", "nasal, scent-bearing, breath-passing", "uses or treats the nose", "nose, scent passage, breath mark", "nasal record or scent notice", "breath finding the world before speech"],
    ["NV", "Body", "face, expression, seen personhood, social presence", "face, express, or present oneself visibly", "face, expression, seen personhood", "faced, expressive, presence-bearing", "faces or reads expression", "face, expression, visible person", "identity image or facial record", "the self offered to be recognized"],
    ["NZ", "Speech", "voice, vocal presence, sounded self", "voice, vocalize, or sound the self", "voice, vocal presence, sounded self", "voiced, vocal, sound-present", "voices or carries vocal sound", "voice, vocal line, sounded presence", "voice record or public audio statement", "the self made audible to another"],
    ["PF", "Body", "pulse, heartbeat, living rhythm, vital beat", "pulse, beat, or mark living rhythm", "pulse, heartbeat, living rhythm", "pulsed, beating, rhythm-alive", "keeps pulse or measures heartbeat", "pulse mark, heartbeat, vital beat", "vital-sign record or pulse standard", "life counted by a quiet beat"],
    ["PK", "Body", "stomach, digestion, inward food-fire", "digest, stomach, or turn food inward", "stomach, digestion, inward food-fire", "digestive, stomach-held, inward-fed", "digests or treats the stomach", "stomach, digestion sign, gut", "digestive record or nutrition standard", "food becoming strength in hidden work"],
    ["PM", "Body", "dose, prescribed measure, medicine amount", "dose, prescribe measure, or administer medicine amount", "dose, prescribed measure, medicine amount", "dosed, prescribed, measure-given", "doses or prescribes measure", "dose, medicine amount, measured remedy", "prescription record or dosage order", "care measured so help does not become harm"],
    ["PP", "Body", "tooth, bite, hard mouth edge", "tooth, bite, or cut by mouth edge", "tooth, bite, hard mouth edge", "toothed, biting, mouth-hard", "bites or treats teeth", "tooth, bite mark, dental edge", "dental record or bite mark", "the small hardness that begins nourishment"],
    ["PS", "Body", "symptom, illness sign, body warning", "symptom, show illness, or warn by body sign", "symptom, illness sign, body warning", "symptomatic, sign-bearing, warning-bodied", "shows or reads symptoms", "symptom, warning mark, illness sign", "clinical symptom record or triage note", "the body speaking before collapse"],
    ["PV", "Body", "pregnancy, gestation, carried unborn life", "gestate, carry unborn life, or become pregnant", "pregnancy, gestation, carried unborn life", "pregnant, gestating, life-carried", "gestates or cares for pregnancy", "pregnancy, womb-carried life, gestation sign", "prenatal record or pregnancy care standard", "the future carried inside the body"],
    ["PY", "Technology", "prompt, instruction input, directed request to a system", "prompt, instruct, or direct system input", "prompt, instruction input, directed request", "prompted, instructed, input-directed", "prompts or designs prompts", "prompt, instruction input, request text", "prompt log or system instruction record", "speech aimed at delegated power"],
    ["PZ", "Technology", "algorithm, ordered procedure, repeatable decision path", "algorithmize, order procedure, or define repeatable path", "algorithm, ordered procedure, decision path", "algorithmic, procedural, path-ordered", "designs algorithms or follows procedure", "algorithm, procedure, decision path", "algorithm specification or procedure record", "choice made repeatable enough to audit"],
    ["RF", "Technology", "cache, working memory, temporary stored state", "cache, buffer, or hold temporary state", "cache, working memory, temporary state", "cached, buffered, temporarily stored", "caches or manages working memory", "cache, buffer, temporary store", "cache record or temporary-state log", "memory held near action"],
    ["RL", "Technology", "interface, control surface, contact layer between systems", "interface, control, or mediate system contact", "interface, control surface, contact layer", "interface-level, controlled, contact-layered", "interfaces or keeps control surfaces", "interface, control panel, contact layer", "interface standard or control record", "where power becomes touchable"],
    ["RR", "Technology", "execution, run, active process, performed code", "run, execute, or perform code", "execution, run, active process", "running, executed, process-active", "runs code or executes process", "run, execution instance, active process", "execution log or run record", "a command becoming action"],
    ["RS", "Technology", "server, service host, answering machine presence", "serve, host service, or answer requests", "server, service host, answering presence", "server-side, hosted, service-bearing", "serves or hosts requests", "server, service, host process", "service registry or server record", "a machine made answerable to callers"],
    ["RX", "Technology", "error, exception, system fault, broken process signal", "error, except, or signal system fault", "error, exception, system fault", "errant, exceptional, fault-signaled", "errors or handles exceptions", "error, exception, fault signal", "error report or incident ticket", "brokenness made visible for repair"],
    ["RY", "Technology", "version, release, named change state", "version, release, or name change state", "version, release, named change", "versioned, released, change-named", "versions or releases systems", "version, release mark, change state", "release record or version registry", "change remembered so users are not deceived"],
    ["RZ", "Technology", "backup, redundancy, preserved copy against loss", "backup, duplicate, or preserve redundant copy", "backup, redundancy, preserved copy", "backed-up, redundant, copy-preserved", "backs up or keeps redundancy", "backup, duplicate, preserved copy", "backup record or recovery copy", "memory protected against forgetting by failure"],
    ["SH", "Mind", "skill, competence, practiced ability", "skill, train competence, or become able by practice", "skill, competence, practiced ability", "skilled, competent, practiced", "keeps skill or trains competence", "skill, competence mark, practiced ability", "credential or skill record", "ability earned by repeated care"],
    ["SJ", "Mind", "reading, literacy, receiving written meaning", "read, become literate, or receive written meaning", "reading, literacy, written meaning", "literate, read, text-receiving", "reads or teaches literacy", "reading act, written meaning", "literacy record or reading assessment", "seeing another mind through signs"],
    ["SS", "Mind", "science, systematic knowledge, disciplined inquiry body", "scientize, systematize knowledge, or inquire by discipline", "science, systematic knowledge, inquiry body", "scientific, systematic, inquiry-ordered", "does science or keeps systematic inquiry", "science claim, systematic finding", "scientific standard or research field record", "truth-seeking made communal and repeatable"],
    ["SW", "Mind", "laboratory, inquiry place, controlled test field", "laboratory, test in place, or control inquiry field", "laboratory, inquiry place, test field", "laboratory-bound, tested, place-controlled", "keeps a laboratory or tests in place", "laboratory, test site, inquiry field", "laboratory record or safety protocol", "a place built so questions can answer"],
    ["SX", "Mind", "equation, formal relation, balanced symbolic claim", "equate, balance formally, or state symbolic relation", "equation, formal relation, balanced claim", "equational, balanced, formally related", "equates or solves formal relation", "equation, formula relation, balance mark", "equation record or mathematical claim", "a balance of signs that must hold"],
    ["TD", "Mind", "curriculum, course, ordered path of learning", "curriculum, course, or order learning path", "curriculum, course, learning path", "curricular, coursed, learning-ordered", "designs curriculum or keeps a course", "curriculum, course unit, learning path", "curriculum standard or course record", "memory arranged for the growth of another"],
    ["TH", "Mind", "mentor, guide, eldering instruction", "mentor, guide, or instruct through mature nearness", "mentor, guide, eldering instruction", "mentored, guided, elder-taught", "mentors or guides learners", "mentor, guidance act, eldering counsel", "mentorship record or advisory role", "authority made patient enough to teach"],
    ["TJ", "Mind", "student, apprentice, disciplined learner", "study, apprentice, or learn under discipline", "student, apprentice, disciplined learner", "student-like, apprenticed, discipline-learning", "studies or receives apprenticeship", "student, apprentice, learning role", "student record or apprenticeship status", "humility organized toward mastery"],
    ["TK", "Speech", "language, speech system, shared grammar of a people", "language, speak as a system, or make shared grammar", "language, speech system, shared grammar", "linguistic, language-bearing, grammar-shared", "speaks or studies language", "language, tongue-system, grammar body", "language standard or official terminology record", "a people remembering through speakable form"],
    ["VH", "Building/making", "bridge, crossing structure, joined passage over division", "bridge, cross by structure, or join separated paths", "bridge, crossing structure, joined passage", "bridged, crossing, path-joined", "bridges or keeps crossings", "bridge, crossing, joined passage", "bridge permit or crossing infrastructure record", "a path built where separation could have ruled"],
    ["VK", "Building/making", "street, road within settlement, public way", "street, road, or make public way", "street, settlement road, public way", "streeted, roaded, public-way", "keeps roads or makes streets", "street, road, public way", "street record or public right-of-way", "shared path inside common life"],
    ["VP", "Building/making", "station, stop, service hub, place of arrival and departure", "station, stop, or gather service at a hub", "station, stop, service hub", "stationed, stopped, hub-gathered", "keeps a station or service hub", "station, stop, hub point", "station record or transit hub registry", "a place that makes coming and going orderly"],
    ["VS", "Law/civic life", "vote, ballot, civic choice counted publicly", "vote, ballot, or count civic choice", "vote, ballot, civic choice", "voted, balloted, civically chosen", "votes or counts ballots", "vote, ballot, counted choice", "election record or ballot standard", "choice made public enough to bind a people"],
    ["VV", "Technology", "automation agent, bot, delegated process", "automate, delegate process, or act as bot", "automation agent, bot, delegated process", "automated, bot-like, delegated", "automates or runs delegated process", "bot, automated agent, delegated process", "automation registry or bot record", "power acting at a distance under another's duty"],
    ["VX", "Speech", "answer, reply, response returned to speech", "answer, reply, or return response", "answer, reply, returned response", "answered, responsive, reply-bearing", "answers or replies", "answer, response, reply word", "official answer or response record", "speech returning to meet speech"],
    ["DML", "Seeing/knowing", "analysis, careful division, meaning separated into parts", "analyze, divide carefully, or separate meaning into parts", "analysis, careful division, meaning-parts", "analytic, divided-carefully, part-seen", "analyzes or keeps careful division", "analysis result, divided meaning", "analytic report or review record", "love of truth patient enough to take a claim apart"],
    ["KNL", "Love/intimacy", "comfort, consolation, suffering met with nearness", "comfort, console, or meet suffering with nearness", "comfort, consolation, suffering-nearness", "comforting, consoling, suffering-near", "comforts or consoles", "comfort act, consolation word", "care note or consolation record", "nearness given where repair is not yet possible"],
    ["NLR", "Body", "neck, throat, voice passage, vulnerable connection", "neck, throat, or hold the head-body passage", "neck, throat, voice passage", "throated, necked, passage-bearing", "uses or treats the throat", "neck, throat, voice passage", "throat record or airway standard", "the vulnerable passage between breath and speech"],
    ["NNS", "Family", "grandparent, elder kin, ancestry care", "grandparent, elder-kin, or carry ancestry care", "grandparent, elder kin, ancestry care", "grandparental, elder-kin, ancestry-caring", "keeps grandparental care", "grandparent, elder kin bond", "grandparent status or elder-care record", "memory made tender toward the young"],
    ["RNN", "Conflict/repair", "reconciliation, restored relation, peace after truth", "reconcile, restore relation, or make peace after truth", "reconciliation, restored relation", "reconciled, relation-restored, peace-made", "reconciles or restores relation", "reconciliation act, restored bond", "settlement record or reconciliation agreement", "repair made social, not merely technical"],
    ["TNL", "Moral agency", "stewardship, guardianship, entrusted keeping", "steward, guard entrusted goods, or keep on behalf", "stewardship, guardianship, entrusted keeping", "stewarded, guarded, trust-kept", "stewards or keeps in trust", "stewardship act, guardianship charge", "guardianship order or stewardship mandate", "power held for what cannot protect itself"],
    ["WNL", "Emotion", "hope, awaited good, future trust", "hope, await good, or lean toward future trust", "hope, awaited good, future trust", "hopeful, awaiting, future-trusting", "hopes or keeps hope", "hope sign, awaited good", "public hope or recovery outlook record", "the heart facing the future without lying"],
    ["CLN", "Mind", "prudence, practical wisdom, careful counsel", "be prudent, counsel carefully, or judge means wisely", "prudence, practical wisdom, careful counsel", "prudent, wise-in-practice, carefully counseled", "counsels prudently or keeps practical wisdom", "counsel, prudent judgment", "advisory opinion or prudence record", "thought measured by consequence before action"],
    ["VY", "Technology", "protocol, ordered communication rule, shared procedure", "protocol, set communication rule, or order procedure", "protocol, communication rule, shared procedure", "protocol-bound, rule-ordered, interoperable", "keeps protocols or sets procedures", "protocol, rule exchange, procedure", "technical protocol or interoperability standard", "agreement made precise enough for systems to answer"],
    ["VZ", "Technology", "compression, compact encoding, condensed form", "compress, encode compactly, or condense form", "compression, compact encoding, condensed form", "compressed, compact, condensed", "compresses or encodes compactly", "compressed object, compact code", "compression standard or encoded archive", "memory made small without losing truth"],
    ["WS", "Building/making", "window, light-opening, framed view", "window, frame view, or open wall to light", "window, light-opening, framed view", "windowed, view-framed, light-open", "keeps windows or frames view", "window, opening, framed light", "window record or building aperture standard", "a wall taught to receive light"],
    ["WW", "Nature", "weather, sky-state, changing air condition", "weather, change as sky-state, or mark air condition", "weather, sky-state, air condition", "weathered, atmospheric, sky-changing", "watches weather or keeps forecast", "weather sign, sky-state", "weather report or climate observation", "the shared air showing its mood"],
    ["WZ", "Nature", "tree, woody life, standing rooted body", "tree, grow woody, or stand rooted", "tree, woody life, rooted body", "tree-like, woody, rooted-standing", "plants or tends trees", "tree, trunk, woody body", "tree record or forestry standard", "patience made tall by roots"],
    ["XH", "Law/civic life", "penalty, sanction, imposed consequence", "penalize, sanction, or impose consequence", "penalty, sanction, imposed consequence", "penal, sanctioned, consequence-imposed", "sanctions or assigns penalty", "penalty, sanction, consequence", "sentence record or penalty order", "consequence named so power does not wander"],
    ["XJ", "Conflict/repair", "alarm, warning, urgent danger signal", "alarm, warn urgently, or signal danger", "alarm, warning, danger signal", "alarmed, warning, danger-signaled", "warns or raises alarm", "alarm, warning sign", "emergency alert or warning record", "fear made useful before harm arrives"],
    ["XK", "Law/civic life", "case, legal matter, dispute file", "case, file matter, or bring dispute into record", "case, legal matter, dispute file", "case-bound, filed, dispute-recorded", "keeps cases or files matters", "case, matter, dispute file", "case docket or legal matter record", "conflict made legible for judgment"],
    ["XL", "Body", "head, skull, upper seat of perception", "head, lead bodily, or hold upper perception", "head, skull, upper perception seat", "headed, cranial, upper-seated", "uses or treats the head", "head, skull, cranial sign", "head injury or neurological intake record", "the body's high room of attention"],
    ["XS", "Time", "queue, turn order, waiting sequence", "queue, wait in turn, or order by sequence", "queue, turn order, waiting sequence", "queued, turn-ordered, sequence-waiting", "queues or keeps turn order", "queue, turn, ordered line", "service queue or turn record", "waiting made fair by order"],
    ["XV", "Technology", "encryption, sealed encoding, protected meaning", "encrypt, seal meaning, or protect by code", "encryption, sealed encoding, protected meaning", "encrypted, sealed, code-protected", "encrypts or guards encoded meaning", "ciphertext, sealed code", "encryption standard or key record", "hiddenness made accountable to trust"],
    ["XX", "Conflict/repair", "shock, blast, sudden rupture, violent break", "shock, blast, or rupture suddenly", "shock, blast, sudden rupture", "shocked, blasted, rupture-sudden", "causes shock or studies blast", "shock, blast mark, rupture event", "blast report or trauma incident record", "breakage arriving before the heart can prepare"],
    ["XY", "Nature", "star, far light, night-fixed point", "star, shine afar, or mark night point", "star, far light, night point", "starry, far-lit, night-marked", "watches stars or charts far light", "star, far light mark", "astronomical record or star chart", "a distant light keeping direction"],
    ["YB", "Nature", "animal, creature, moving nonhuman life", "animal, move as creature, or keep living creature", "animal, creature, nonhuman life", "animal, creaturely, living-moving", "keeps animals or studies creatures", "animal, creature, living body", "animal record or welfare standard", "life that shares the world without human speech"],
    ["YH", "Body", "arm, reach, extended limb of action", "arm, reach, or extend bodily agency", "arm, reach, extended limb", "armed, reaching, limb-extended", "reaches or treats the arm", "arm, reach, limb mark", "arm injury or reach standard", "the body making distance touchable"],
    ["YJ", "Emotion", "wonder, surprise, sudden opening of attention", "wonder, be surprised, or open attention suddenly", "wonder, surprise, sudden attention", "wondering, surprised, attention-opened", "wonders or awakens surprise", "wonder sign, surprise event", "discovery note or surprise finding", "attention startled into humility"],
    ["YM", "Nature", "mountain, height, summit, raised land", "mountain, rise high, or stand as summit", "mountain, height, summit", "mountainous, high, summit-bearing", "climbs or keeps mountains", "mountain, summit, highland", "mountain boundary or elevation record", "earth lifting the eye"],
    ["YP", "Nature", "fish, water creature, swimming life", "fish, swim as creature, or keep water life", "fish, water creature, swimming life", "fishlike, aquatic, swimming", "fishes or tends water creatures", "fish, aquatic body, catch", "fishery record or aquatic life standard", "life moving where breath cannot stay"],
    ["YY", "Mind", "dream, sleeping image, inward night-world", "dream, imagine in sleep, or carry night image", "dream, sleeping image, inward night-world", "dreamed, sleep-imaged, inward", "dreams or studies dreams", "dream image, night vision", "dream report or sleep-study note", "the hidden theatre of the sleeping self"],
    ["YZ", "Nature", "stone, rock, hard earth, enduring matter", "stone, harden as rock, or build with stone", "stone, rock, hard earth", "stony, rocky, hard-earth", "works stone or keeps rock", "stone, rock, hard matter", "stone standard or geology record", "earth made patient enough to carry memory"],
    ["ZB", "Law/civic life", "citizenship, civic membership, public belonging", "citizen, admit to civic body, or belong publicly", "citizenship, civic membership", "citizen-bound, civic, publicly belonging", "acts as citizen or grants civic standing", "citizen, membership mark", "citizenship record or civic status", "belonging made answerable to a people"],
    ["ZJ", "Law/civic life", "leadership, public direction, guiding authority", "lead, direct publicly, or guide authority", "leadership, public direction, guiding authority", "leading, directive, authority-guiding", "leads or directs public work", "leader, directive, public guide", "leadership office or directive record", "direction that must answer to those led"],
    ["ZP", "Law/civic life", "wage, salary, earned provision for labor", "wage, pay for labor, or earn provision", "wage, salary, labor provision", "waged, salaried, labor-paid", "pays wages or earns by labor", "wage, salary, pay record", "wage record or labor compensation standard", "provision tied to work without reducing the worker"],
    ["ZS", "Speech", "letter, written character, small script sign", "letter, spell, or mark written character", "letter, written character, script sign", "lettered, written-character, script-marked", "letters or spells signs", "letter, character, script mark", "orthographic standard or character record", "a small sign carrying voice across time"],
    ["ZX", "Technology", "endpoint, exposed service point, addressable interface", "endpoint, expose service, or address interface point", "endpoint, service point, addressable interface", "endpoint-bound, addressable, exposed", "keeps endpoints or exposes service", "endpoint, address, service point", "API endpoint record or service address", "where a system agrees to be called"],
    ["ZZ", "Conflict/repair", "coercion, forced will, pressure without consent", "coerce, force will, or pressure without consent", "coercion, forced will, nonconsent pressure", "coerced, forced, pressure-bound", "coerces or resists coercion", "coercive act, forced pressure", "coercion complaint or force review", "power acting where consent was absent"],
    ["ZC", "Ritual/poetry", "color, hue, visible tone, beauty of difference", "color, hue, or mark visible tone", "color, hue, visible tone", "colored, hued, tone-visible", "colors or studies hue", "color, hue mark, pigment", "color standard or design palette record", "difference made visible without division"],
    ["CF", "Building/making", "floor, ground surface, walked interior base", "floor, ground, or make walked base", "floor, ground surface, walked base", "floored, ground-level, base-walked", "makes or keeps floors", "floor, ground surface, interior base", "floor plan or surface standard", "the held surface beneath ordinary action"],
    ["CH", "Building/making", "roof, overhead shelter, upper covering", "roof, cover overhead, or shelter above", "roof, overhead shelter, upper covering", "roofed, sheltered-above, upper-covered", "roofs or keeps overhead shelter", "roof, covering, upper shelter", "roof standard or shelter record", "protection from above made ordinary"],
    ["CJ", "Building/making", "seat, chair, resting support", "seat, chair, or give resting support", "seat, chair, resting support", "seated, chaired, rest-supported", "seats or makes chairs", "seat, chair, support place", "seat record or public seating standard", "a small structure for receiving the tired body"],
    ["CS", "Nature", "seed, germ, beginning life stored small", "seed, germinate, or store beginning life", "seed, germ, beginning life", "seeded, germinal, life-stored", "seeds or keeps seed", "seed, germ, seed grain", "seed record or agricultural standard", "the future folded into smallness"],
    ["CV", "Nature", "forest, many trees, wooded living place", "forest, gather trees, or become wooded", "forest, wooded place, many trees", "forested, wooded, tree-gathered", "keeps forests or tends woodland", "forest, woodland, tree body", "forest boundary or conservation record", "many rooted lives making a place"],
    ["CX", "Nature", "ocean, great water, salt world", "ocean, sea, or move as great water", "ocean, great water, salt world", "oceanic, sea-wide, salt-water", "keeps oceans or crosses sea", "ocean, sea, great water", "marine record or sea boundary", "water large enough to humble direction"],
    ["CY", "Future/civilization", "myth, founding image, symbolic memory of a people", "myth, found by image, or carry symbolic memory", "myth, founding image, symbolic memory", "mythic, founding-imaged, memory-symbolic", "tells myth or keeps founding image", "myth, founding image, symbolic story", "heritage record or founding narrative", "memory made image so a people can remember itself"],
    ["CC", "Ritual/poetry", "prayer, addressed solemn speech, lifted request", "pray, address solemnly, or lift request", "prayer, solemn address, lifted request", "prayerful, solemn-addressed, lifted", "prays or keeps prayer", "prayer, petition, solemn request", "public invocation or prayer record", "speech that knows it is not alone"]
  ];

  return seeds.map(([id, category, semanticField, action, concept, quality, agent, object, civic, intimate]) =>
    seedRoot(id, category, semanticField, action, concept, quality, agent, object, civic, intimate)
  );
}

function publicCultureRoots() {
  const seeds = [
    ["BRT", "Law/civic life", "constitution, charter, founding law, civic covenant", "charter, constitutionalize, or bind public order by founding law", "constitution, charter, founding law", "constitutional, chartered, founding-law", "keeps constitutional order", "charter text, founding clause, constitutional article", "constitutional charter or founding-law record", "the public promise one lives inside"],
    ["CLV", "Law/civic life", "statute, enacted law, codified rule, legislative text", "legislate, enact statute, or codify rule", "statute, enacted law, codified rule", "statutory, enacted, law-coded", "drafts or keeps statutes", "statute text, enacted clause", "statutory record or legislative act", "law made speakable enough to trust"],
    ["DKT", "Law/civic life", "ordinance, local rule, municipal order, place-bound law", "ordain locally, municipalize, or set place-bound rule", "ordinance, local rule, municipal order", "ordinanced, local-law, municipality-bound", "keeps local ordinances", "ordinance notice, municipal clause", "municipal ordinance or local rule record", "shared place given a clear rule"],
    ["FRM", "Law/civic life", "policy, framework, public method, governing approach", "frame policy, set approach, or govern by method", "policy, framework, governing approach", "policy-framed, method-bound, public", "frames policy or keeps public method", "policy frame, governing method", "public policy or framework record", "care made deliberate before action"],
    ["GVN", "Law/civic life", "administration, public management, civic execution, service order", "administer, manage publicly, or execute civic service", "administration, public management", "administrative, managed, service-ordered", "administers public service", "administrative act, service order", "administrative record or public management rule", "order kept so people are not forgotten"],
    ["HJR", "Law/civic life", "department, ministry, public bureau, organized office", "departmentalize, minister, or organize public work", "department, ministry, public bureau", "departmental, ministerial, bureau-bound", "keeps a department or ministry", "bureau, department, ministry unit", "department charter or ministry record", "public work given a named house"],
    ["KLM", "Law/civic life", "license, credentialed permission, certified ability", "license, credential, or certify permission", "license, credentialed permission", "licensed, credentialed, permitted", "licenses or holds credentials", "license mark, credential", "license registry or credential standard", "permission held visibly"],
    ["LDP", "Law/civic life", "permit, authorized passage, specific public leave", "permit, authorize passage, or grant specific leave", "permit, authorized passage", "permitted, authorized, leave-granted", "issues or keeps permits", "permit paper, authorization token", "permit record or public authorization", "a yes bounded by responsibility"],
    ["MRC", "Law/civic life", "census, population count, public enumeration", "census, enumerate, or count a people publicly", "census, population count", "censused, enumerated, people-counted", "keeps census or counts population", "census entry, population mark", "census record or public enumeration", "being counted without being reduced"],
    ["NPV", "Law/civic life", "audit, account review, public verification", "audit, review accounts, or verify public use", "audit, account review", "audited, reviewed, account-visible", "audits accounts", "audit finding, account mark", "audit report or verification record", "trust checked without contempt"],
    ["PDM", "Law/civic life", "procurement, public acquisition, purchased provision", "procure, acquire publicly, or purchase for common use", "procurement, public acquisition", "procured, acquired, public-purchased", "keeps procurement", "procurement order, acquisition item", "procurement record or public purchase standard", "buying made answerable to the common good"],
    ["RSK", "Law/civic life", "inspection, scrutiny, public checking, safety review", "inspect, scrutinize, or check publicly", "inspection, scrutiny, public check", "inspected, scrutinized, check-bearing", "inspects public safety", "inspection mark, review finding", "inspection record or safety review", "careful seeing before harm"],
    ["TJV", "Law/civic life", "appeal, review of judgment, second hearing", "appeal, review judgment, or seek second hearing", "appeal, judgment review", "appealed, reviewed, second-heard", "appeals or reviews judgment", "appeal petition, review claim", "appeal record or review docket", "judgment humble enough to be heard again"],
    ["VDR", "Law/civic life", "infrastructure, public works, durable civic support", "infrastructure, build public works, or support civic life", "infrastructure, public works", "infrastructural, public-work, support-bearing", "keeps public works", "public work, infrastructure asset", "infrastructure registry or public works plan", "the hidden support under common life"],
    ["XMR", "Law/civic life", "public health, collective care, civic prevention", "protect public health or organize collective care", "public health, collective care", "public-health, preventive, care-ordered", "keeps public health", "health notice, prevention act", "public health order or prevention record", "care widened beyond the household"],
    ["ZLT", "Law/civic life", "emergency management, crisis order, public readiness", "manage emergency, prepare crisis order, or coordinate readiness", "emergency management, crisis readiness", "emergency-ready, crisis-ordered, coordinated", "coordinates emergency readiness", "emergency plan, crisis signal", "emergency order or readiness record", "fear organized before panic"],
    ["BCN", "Law/civic life", "compliance, conformity to rule, audited obedience", "comply, bring into rule, or verify conformity", "compliance, rule conformity", "compliant, rule-conforming, verified", "keeps compliance", "compliance mark, conformity report", "compliance filing or enforcement record", "obedience made inspectable"],
    ["DVG", "Law/civic life", "regulation, administrative rule, supervised standard", "regulate, supervise standard, or constrain public practice", "regulation, supervised standard", "regulated, supervised, standard-bound", "regulates or supervises standards", "regulation clause, standard limit", "regulatory rule or supervision record", "power narrowed for safety"],
    ["HPC", "Law/civic life", "transparency, open record, public visibility", "make transparent, open records, or render visible to the public", "transparency, open record", "transparent, open-record, publicly visible", "keeps transparency", "open record, visibility notice", "transparency report or open-record standard", "nothing hidden where trust requires sight"],
    ["KNP", "Law/civic life", "petition, public request, addressed grievance", "petition, request publicly, or address grievance", "petition, public request", "petitioned, requested, grievance-bearing", "petitions or receives grievances", "petition text, grievance request", "petition record or grievance filing", "a small voice given public form"],
    ["BDK", "Technology", "compiler, source transformation, executable making", "compile, transform source, or make executable form", "compiler, source transformation", "compiled, transformed, executable-made", "compiles source", "compiled output, build artifact", "compiler standard or build record", "thought made runnable"],
    ["FRS", "Technology", "parser, syntax reader, structured input", "parse, read structure, or segment input", "parser, syntax reader", "parsed, structured, syntax-read", "parses input", "parse tree, structured input", "parser report or syntax standard", "confusion divided into order"],
    ["GTH", "Technology", "runtime, execution environment, active system world", "run within environment or sustain execution world", "runtime, execution environment", "runtime-bound, active, environment-held", "keeps runtimes", "runtime instance, active environment", "runtime record or execution environment standard", "a world made for action"],
    ["HLM", "Technology", "module, component, separable code part", "modularize, componentize, or separate code part", "module, component, code part", "modular, componented, separable", "keeps modules", "module unit, component file", "module registry or component standard", "a part made clear enough to trust"],
    ["JKR", "Technology", "library, reusable code, shared technical memory", "library, reuse code, or share technical memory", "library, reusable code", "library-based, reusable, shared-code", "keeps libraries", "library package, reusable unit", "software library record or reuse standard", "memory offered as tool"],
    ["KSN", "Technology", "authentication, identity proof, access verification", "authenticate, prove identity, or verify access", "authentication, identity proof", "authenticated, identity-proven, access-verified", "authenticates identity", "authentication token, proof sign", "authentication log or identity-proof standard", "being known before entry"],
    ["LTV", "Technology", "authorization, granted access, permitted capability", "authorize access or grant capability", "authorization, granted access", "authorized, access-granted, capability-bound", "authorizes access", "authorization grant, access scope", "authorization policy or access record", "permission fitted to duty"],
    ["MNT", "Technology", "sandbox, isolated environment, guarded experiment", "sandbox, isolate environment, or guard experiment", "sandbox, isolated environment", "sandboxed, isolated, guard-bounded", "keeps sandboxes", "sandbox instance, isolated test", "sandbox policy or isolation record", "freedom held inside a boundary"],
    ["NDR", "Technology", "deployment, release placement, system rollout", "deploy, place release, or roll out system", "deployment, release placement", "deployed, released, rollout-bound", "deploys systems", "deployment event, rollout point", "deployment record or release placement", "change sent into the world carefully"],
    ["PLS", "Technology", "pipeline, staged process, ordered automation flow", "pipeline, stage process, or order automation flow", "pipeline, staged process", "pipelined, staged, flow-ordered", "keeps pipelines", "pipeline stage, process lane", "pipeline record or automation standard", "work moving step by step"],
    ["RCM", "Technology", "telemetry, remote measure, observed system signal", "send telemetry, measure remotely, or observe system signal", "telemetry, remote measure", "telemetric, remotely measured, signal-bearing", "keeps telemetry", "telemetry event, remote signal", "telemetry log or observability standard", "distant behavior made visible"],
    ["SBT", "Technology", "log, trace, event memory, system witness", "log, trace, or witness system events", "log, trace, event memory", "logged, traced, event-recorded", "keeps logs or traces events", "log entry, trace event", "logging standard or trace record", "a machine learning to remember what it did"],
    ["TMR", "Technology", "checkpoint, saved state, recovery moment", "checkpoint, save state, or mark recovery moment", "checkpoint, saved state", "checkpointed, saved, recovery-ready", "keeps checkpoints", "checkpoint image, saved moment", "checkpoint record or recovery standard", "a pause that protects return"],
    ["VKT", "Technology", "vector, directed quantity, embedded direction", "vectorize, direct quantity, or encode direction", "vector, directed quantity", "vectorial, directed, quantity-bearing", "vectors or keeps directed quantities", "vector value, direction mark", "vector standard or embedding record", "meaning pointed in space"],
    ["WDG", "Technology", "embedding, encoded relation-space, machine meaning position", "embed, place in relation-space, or encode meaning position", "embedding, relation-space", "embedded, relation-coded, position-bearing", "embeds meaning", "embedding vector, relation point", "embedding record or model-space standard", "nearness made calculable"],
    ["XDL", "Technology", "dataset, collected data body, training collection", "dataset, collect data, or form training body", "dataset, collected data body", "dataset-bound, collected, training-ready", "keeps datasets", "dataset row, collection body", "dataset registry or training data record", "many facts gathered under duty"],
    ["YFR", "Technology", "container, portable environment, packaged execution", "containerize, package environment, or make execution portable", "container, portable environment", "containerized, portable, packaged", "keeps containers", "container image, portable system", "container registry or portability standard", "a small world carried safely"],
    ["ZDN", "Technology", "synchronization, shared state, timed agreement", "synchronize, align state, or make timed agreement", "synchronization, shared state", "synchronized, state-aligned, time-agreed", "synchronizes systems", "sync event, shared-state mark", "synchronization log or state agreement", "many actors keeping one time"],
    ["CMR", "Technology", "digital signature, attested code, signed trust", "sign digitally, attest code, or bind identity to artifact", "digital signature, attested code", "signed, attested, identity-bound", "signs artifacts", "signature mark, attestation", "signature record or attestation standard", "a name placed where trust is needed"],
    ["DPC", "Technology", "dependency, required component, borrowed support", "depend, require component, or bind to borrowed support", "dependency, required component", "dependent, required, support-bound", "keeps dependencies", "dependency link, required package", "dependency record or supply-chain standard", "needing another part without shame"],
    ["BCR", "Mind", "chemistry, material relation, combining substance", "chemize, combine substances, or study material relation", "chemistry, material relation", "chemical, combinatory, substance-bound", "studies chemistry", "chemical relation, compound sign", "chemistry standard or lab record", "matter meeting matter"],
    ["DFR", "Mind", "physics, force relation, motion law, material order", "physics, model force, or study material motion", "physics, force relation", "physical, force-bound, motion-ordered", "studies physics", "force relation, motion law", "physics record or measurement standard", "the world's strength made intelligible"],
    ["GMS", "Mind", "statistics, aggregate measure, many-count inference", "statisticize, aggregate measures, or infer from many counts", "statistics, aggregate measure", "statistical, aggregate, many-count", "keeps statistics", "statistic, aggregate result", "statistical report or public metric", "many cases heard without losing pattern"],
    ["HPR", "Mind", "geometry, shape measure, spatial relation", "geometrize, measure shape, or reason spatially", "geometry, shape measure", "geometric, shape-measured, spatial", "studies geometry", "geometric figure, spatial proof", "geometry standard or spatial record", "space given clean thought"],
    ["JVL", "Mind", "biology, life study, organism knowledge", "study life, classify organisms, or reason biologically", "biology, life study", "biological, organism-studying, life-bound", "studies biology", "biological finding, organism note", "biology record or life-science standard", "life approached with disciplined wonder"],
    ["KTD", "Mind", "ecology, relation of life and place, living system study", "ecologize, study life-place relation, or reason systemically", "ecology, life-place relation", "ecological, relational, habitat-aware", "studies ecology", "ecological relation, habitat model", "ecology report or conservation standard", "living relation noticed before use"],
    ["LRC", "Mind", "survey, structured inquiry, distributed question", "survey, question structurally, or gather responses", "survey, structured inquiry", "surveyed, response-gathered, question-ordered", "keeps surveys", "survey form, response set", "survey record or public inquiry standard", "asking many without flattening persons"],
    ["MHP", "Mind", "interview, elicited account, guided witness", "interview, elicit account, or guide witness", "interview, elicited account", "interviewed, elicited, witness-guided", "conducts interviews", "interview transcript, witness account", "interview record or testimony protocol", "a question that makes room for a person"],
    ["NPX", "Mind", "theorem, demonstrated claim, proven relation", "theoremize, demonstrate claim, or bind proof relation", "theorem, demonstrated claim", "theorematic, demonstrated, proof-bound", "proves theorems", "theorem statement, demonstrated relation", "theorem record or formal proof standard", "truth made patient enough to stand"],
    ["PJG", "Mind", "proof, demonstration, reasoned support, formal warrant", "prove, demonstrate, or warrant by reason", "proof, demonstration", "proven, demonstrated, warranted", "proves or demonstrates", "proof step, warrant mark", "proof record or evidentiary standard", "support offered without force"],
    ["SMC", "Mind", "semantics, meaning relation, sense structure", "semanticize, relate meanings, or structure sense", "semantics, meaning relation", "semantic, meaning-bound, sense-structured", "keeps semantics", "semantic relation, sense unit", "semantic standard or terminology record", "meaning handled carefully"],
    ["TCN", "Mind", "concept, abstraction, thought-unit, grasped form", "conceptualize, abstract, or form thought-unit", "concept, abstraction", "conceptual, abstract, thought-formed", "forms concepts", "concept unit, abstract form", "concept record or analytic definition", "a form held by the mind"],
    ["WPR", "Mind", "critique, evaluative analysis, disciplined judgment", "critique, evaluate, or judge analytically", "critique, evaluative analysis", "critical, evaluative, judgment-trained", "critiques or evaluates", "critique note, evaluative finding", "review report or critical standard", "judgment used for repair, not vanity"],
    ["XTS", "Mind", "taxonomy, ordered classes, named classification system", "taxonomize, order classes, or name classification system", "taxonomy, ordered classes", "taxonomic, class-ordered, named", "keeps taxonomies", "taxon, classification branch", "taxonomy record or classification standard", "difference ordered without contempt"],
    ["YLD", "Mind", "literacy, read-write competence, script fluency", "make literate, read-write fluently, or train script competence", "literacy, read-write competence", "literate, script-fluent, text-capable", "teaches literacy", "literacy act, script skill", "literacy standard or education record", "letters becoming agency"],
    ["BDS", "Nature", "biodiversity, many-life variety, ecological richness", "diversify life, protect variety, or count living difference", "biodiversity, many-life variety", "biodiverse, variety-rich, many-life", "keeps biodiversity", "species variety, living difference", "biodiversity record or conservation index", "difference kept alive"],
    ["DRT", "Nature", "drought, water absence, dry season, thirst of land", "drought, dry, or endure water absence", "drought, water absence", "droughted, dry, thirst-bearing", "watches drought", "drought sign, dry season mark", "drought alert or water restriction", "land thirst noticed before loss"],
    ["FLD", "Nature", "flood, overflowing water, inundation, excess flow", "flood, overflow, or cover by water", "flood, overflowing water", "flooded, overflowing, inundated", "watches floods", "flood mark, inundation event", "flood warning or water emergency record", "too much flow becoming danger"],
    ["HBT", "Nature", "habitat, living place, dwelling ecology", "habitat, make living place, or sustain dwelling ecology", "habitat, living place", "habitable, life-placed, ecology-bound", "keeps habitat", "habitat zone, living place", "habitat record or land-use protection", "a home wider than human walls"],
    ["KST", "Nature", "coast, shore, edge of land and sea", "coast, shore, or mark land-sea edge", "coast, shore, land-sea edge", "coastal, shore-bound, edge-water", "keeps coasts", "shoreline, coastal edge", "coastal boundary or shore record", "where firmness meets change"],
    ["LPN", "Nature", "pollution, contamination, poisoned mixture, spoiled commons", "pollute, contaminate, or spoil shared matter", "pollution, contamination", "polluted, contaminated, spoiled", "tracks pollution", "pollution mark, contaminant", "pollution report or contamination rule", "shared life harmed by hidden mixture"],
    ["MST", "Nature", "ecosystem, living network, interdependent habitat", "ecosystem, interrelate life, or sustain living network", "ecosystem, living network", "ecosystemic, interdependent, habitat-bound", "keeps ecosystems", "ecosystem relation, living web", "ecosystem assessment or stewardship record", "many lives answering one another"],
    ["NRV", "Nature", "conservation, preservation of living commons, guarded continuity", "conserve, preserve commons, or guard living continuity", "conservation, living preservation", "conserved, preserved, continuity-guarded", "keeps conservation", "conservation act, preserved area", "conservation order or protected-area record", "restraint for what cannot speak"],
    ["PWT", "Nature", "waste, discard, leftover matter, misused remainder", "waste, discard, or leave remainder", "waste, discard, leftover matter", "wasted, discarded, remaindered", "handles waste", "waste object, discard pile", "waste record or disposal standard", "what use leaves behind"],
    ["RCL", "Nature", "recycling, return of matter, reused cycle", "recycle, return matter, or make reused cycle", "recycling, matter return", "recycled, returned, cycle-used", "recycles matter", "recycled object, reuse cycle", "recycling standard or circular-use record", "matter given another duty"],
    ["SRS", "Nature", "resource, usable provision, common material stock", "resource, stock provision, or make usable material", "resource, usable provision", "resourced, usable, stock-bearing", "keeps resources", "resource stock, provision unit", "resource registry or allocation standard", "use remembered as stewardship"],
    ["TVL", "Nature", "livestock, tended animals, provision creatures", "tend livestock, herd provision animals, or keep domesticated life", "livestock, tended animals", "livestock-bearing, herded, provision-creature", "keeps livestock", "herd animal, provision creature", "livestock record or animal husbandry standard", "creatures under human care"],
    ["WLD", "Nature", "wilderness, untamed land, unbuilt living place", "wild, keep unbuilt land, or dwell beyond settlement", "wilderness, untamed land", "wild, unbuilt, untamed", "keeps wilderness", "wild place, unbuilt land", "wilderness boundary or protected land record", "land not reduced to use"],
    ["XRM", "Nature", "erosion, wearing away, slow loss of land", "erode, wear away, or mark slow land loss", "erosion, wearing away", "eroded, worn, loss-bearing", "tracks erosion", "erosion scar, worn edge", "erosion report or soil-loss standard", "loss that arrives grain by grain"],
    ["ZHG", "Nature", "harvest, gathered yield, seasonal taking", "harvest, gather yield, or take in season", "harvest, gathered yield", "harvested, gathered, season-taken", "harvests or keeps yield", "harvest yield, gathered crop", "harvest record or crop report", "taking after patient tending"],
    ["BLD", "Ritual/poetry", "altar, offering table, solemn focal place", "altar, make offering place, or focus solemn giving", "altar, offering table", "altar-bound, offering-centered, solemn", "keeps an altar", "altar place, offering table", "ritual altar record or sacred site note", "a place where giving becomes visible"],
    ["DLC", "Ritual/poetry", "incense, fragrant smoke, rising memory", "incense, perfume smoke, or raise fragrant memory", "incense, fragrant smoke", "incensed, fragrant, smoke-rising", "keeps incense", "incense smoke, fragrant offering", "ritual incense rule or offering record", "memory made breath-visible"],
    ["FVN", "Ritual/poetry", "procession, ordered movement, public solemn path", "process, move ceremonially, or order a public path", "procession, solemn path", "processional, ordered, path-bound", "leads procession", "procession line, ritual path", "procession permit or ceremonial order", "many bodies walking one memory"],
    ["GRT", "Ritual/poetry", "hymn, praise song, lifted communal voice", "hymn, praise, or lift communal voice", "hymn, praise song", "hymnic, praised, lifted-voice", "sings hymns", "hymn verse, praise line", "hymn record or liturgical song", "gratitude given melody"],
    ["HVC", "Ritual/poetry", "confession, fault spoken, truth before repair", "confess, speak fault, or expose truth for repair", "confession, spoken fault", "confessed, fault-spoken, repair-facing", "confesses or receives confession", "confession word, fault statement", "confession record or restorative statement", "truth laid down so repair can begin"],
    ["JDN", "Ritual/poetry", "pilgrimage, sacred journey, vow path", "pilgrimage, journey solemnly, or walk vow path", "pilgrimage, sacred journey", "pilgrim, journey-bound, vow-walking", "walks pilgrimage", "pilgrimage route, sacred journey", "pilgrimage record or sacred travel notice", "distance made into devotion"],
    ["KPL", "Ritual/poetry", "parable, teaching story, moral image", "parable, teach by story, or make moral image", "parable, teaching story", "parabolic, story-taught, moral-imaged", "tells parables", "parable tale, teaching image", "parable record or teaching narrative", "truth carried by a small story"],
    ["LMT", "Ritual/poetry", "lament, grief song, public sorrow", "lament, sing grief, or carry public sorrow", "lament, grief song", "lamenting, grief-sung, sorrow-public", "laments or leads lament", "lament line, grief song", "lament record or mourning rite", "sorrow given shape"],
    ["MTR", "Ritual/poetry", "metaphor, carried meaning, image bridge", "metaphor, carry meaning, or bridge images", "metaphor, carried meaning", "metaphoric, image-bridged, meaning-carried", "makes metaphors", "metaphor image, meaning bridge", "metaphor note or poetic figure record", "one thing carrying another into sight"],
    ["NHS", "Ritual/poetry", "proverb, compact wisdom, remembered saying", "proverb, compress wisdom, or carry remembered saying", "proverb, compact wisdom", "proverbial, compact, wisdom-bearing", "keeps proverbs", "proverb line, wisdom saying", "proverb record or cultural saying", "memory small enough to travel"],
    ["PCT", "Ritual/poetry", "theatre, drama, enacted story, public role-play", "dramatize, stage, or enact story publicly", "theatre, drama, enacted story", "dramatic, staged, role-enacted", "stages drama", "scene, dramatic act", "performance record or theatre permit", "truth rehearsed in borrowed faces"],
    ["RVC", "Ritual/poetry", "sculpture, carved form, shaped image", "sculpt, carve, or shape image in matter", "sculpture, carved form", "sculpted, carved, matter-shaped", "sculpts images", "sculpture piece, carved form", "art object record or sculpture register", "matter taught to hold beauty"],
    ["BLC", "Speech", "journalism, public report, civic narration", "report publicly, journal, or narrate civic events", "journalism, public report", "journalistic, reported, civic-narrated", "reports publicly", "public article, news account", "press record or public report standard", "events told for public memory"],
    ["DCP", "Speech", "debate, contested speech, argued public difference", "debate, contest speech, or argue difference publicly", "debate, contested speech", "debated, contested, argument-bearing", "debates publicly", "debate turn, argument exchange", "debate record or public forum rule", "difference made speakable without violence"],
    ["FJM", "Speech", "editorial judgment, curated publication, speech selection", "edit, curate speech, or judge publication", "editorial judgment, curated publication", "edited, curated, publication-judged", "edits public speech", "editorial note, curated text", "editorial record or publication standard", "speech chosen under responsibility"],
    ["GNS", "Speech", "testimony, sworn account, witnessed speech", "testify, give sworn account, or speak as witness", "testimony, sworn account", "testimonial, sworn, witness-spoken", "testifies or receives testimony", "testimony statement, witness account", "testimony record or witness standard", "memory placed under truth"],
    ["HVD", "Speech", "dialogue, reciprocal speech, shared inquiry", "dialogue, converse reciprocally, or inquire together", "dialogue, reciprocal speech", "dialogic, reciprocal, inquiry-shared", "keeps dialogue", "dialogue turn, shared question", "dialogue record or facilitation standard", "speech that leaves room for the other"],
    ["JXT", "Speech", "publication, released text, public distribution", "publish, release text, or distribute publicly", "publication, released text", "published, released, distributed", "publishes texts", "publication item, released page", "publication record or distribution standard", "private thought entering public memory"],
    ["KVB", "Speech", "translation memory, reusable phrasing, cross-language archive", "store translation memory or reuse cross-language phrasing", "translation memory, reusable phrasing", "translation-memory, reusable, cross-language", "keeps translation memory", "translation unit, reusable phrase", "translation memory record or localization standard", "meaning remembered across tongues"],
    ["LZG", "Speech", "glossary, terminology list, named domain words", "gloss, list terms, or organize domain words", "glossary, terminology list", "glossed, terminological, term-listed", "keeps glossaries", "glossary entry, term list", "terminology record or glossary standard", "names arranged for shared work"],
    ["BCD", "Body", "diagnosis, named illness, clinical recognition", "diagnose, name illness, or recognize clinical pattern", "diagnosis, named illness", "diagnosed, clinically named, pattern-seen", "diagnoses illness", "diagnosis note, clinical finding", "diagnosis record or clinical code", "suffering given a usable name"],
    ["DHC", "Body", "clinic, care site, ordinary medical house", "clinic, receive care, or organize treatment site", "clinic, care site", "clinical, care-site, treatment-ready", "keeps a clinic", "clinic room, care visit", "clinic record or care-site standard", "a small house for repair of bodies"],
    ["FGN", "Body", "infection, contagion, invading sickness", "infect, spread contagion, or track invading sickness", "infection, contagion", "infected, contagious, sickness-bearing", "tracks infection", "infection mark, contagion event", "infection report or public health notice", "harm moving between bodies"],
    ["HLV", "Body", "vaccine, trained immunity, preventive remedy", "vaccinate, train immunity, or prevent illness", "vaccine, trained immunity", "vaccinated, immune-trained, preventive", "vaccinates or keeps immunity", "vaccine dose, immunity mark", "vaccination record or immunization standard", "protection taught before danger"],
    ["JPN", "Body", "rehabilitation, restored function, practiced recovery", "rehabilitate, restore function, or practice recovery", "rehabilitation, restored function", "rehabilitated, function-restored, recovery-practiced", "rehabilitates bodies", "rehab exercise, recovery stage", "rehabilitation record or recovery plan", "healing made patient through practice"],
    ["KCN", "Family", "childcare, guarded youth, daily tending", "care for children, guard youth, or tend daily growth", "childcare, guarded youth", "childcare-bound, youth-guarding, tender", "keeps childcare", "childcare act, youth care", "childcare standard or guardian record", "daily care given to the future"],
    ["LSD", "Family", "burial, body-return, family mourning rite", "bury, return body, or keep mourning rite", "burial, body-return", "buried, returned, mourning-bound", "keeps burial rites", "grave act, burial place", "burial record or cemetery notice", "the family returning a body to memory"],
    ["MND", "Family", "household council, family deliberation, kin decision", "council as household, deliberate by kin, or decide family duty", "household council, kin deliberation", "counciled, kin-deliberated, family-bound", "keeps household council", "family decision, council word", "custody meeting or household decision record", "kin speech before action"],
    ["NCH", "Family", "caregiving, daily assistance, dependent support", "caregive, assist daily, or support dependence", "caregiving, daily assistance", "caregiving, assisted, dependence-supporting", "gives daily care", "care act, assistance task", "caregiving record or support plan", "strength lent without humiliation"],
    ["PRG", "Family", "inheritance transfer, succession, goods carried across generations", "inherit, transfer succession, or carry goods across generations", "inheritance transfer, succession", "inherited, successorial, generation-carried", "keeps succession", "inheritance item, succession mark", "inheritance record or succession filing", "what the dead leave under duty"]
  ];

  return seeds.map(([id, category, semanticField, action, concept, quality, agent, object, civic, intimate]) =>
    seedRoot(id, category, semanticField, action, concept, quality, agent, object, civic, intimate)
  );
}

function institutionalScaleRoots() {
  const seeds = [
    ["YRL", "Law/civic life", "jurisdiction, legal scope, authority over place or matter", "hold jurisdiction, define legal scope, or assign authority", "jurisdiction, legal scope", "jurisdictional, scope-bound, authority-defined", "keeps jurisdiction or defines legal scope", "jurisdiction boundary, legal scope mark", "jurisdictional order or venue record", "the question of who may rightly answer"],
    ["PRT", "Law/civic life", "precedent, remembered ruling, guiding prior judgment", "set precedent, cite prior ruling, or guide by remembered judgment", "precedent, prior ruling", "precedential, remembered, judgment-guiding", "keeps precedent or cites prior judgment", "precedent case, prior ruling", "precedent record or case-law standard", "memory teaching judgment humility"],
    ["MDM", "Law/civic life", "mandate, delegated command, authorized public charge", "mandate, delegate command, or charge with authority", "mandate, delegated charge", "mandated, delegated, authority-charged", "holds a mandate or delegates charge", "mandate letter, authorized charge", "mandate record or delegation order", "power received as burden"],
    ["LSB", "Law/civic life", "liability, answerable burden, legal responsibility for harm", "bear liability, assign responsibility, or answer for harm", "liability, answerable burden", "liable, answerable, burden-bearing", "bears liability or assigns responsibility", "liability claim, answerable burden", "liability finding or responsibility record", "harm that must find an answer"],
    ["WRN", "Law/civic life", "warrant, authorized search or seizure, written public leave", "warrant, authorize search, or grant coercive leave", "warrant, written authority", "warranted, authorized, search-bound", "issues or serves warrants", "warrant paper, authority token", "warrant record or judicial authorization", "force forced to show its paper"],
    ["SPN", "Law/civic life", "subpoena, compelled testimony, formal summons to answer", "subpoena, summon formally, or compel testimony", "subpoena, formal summons", "subpoenaed, summoned, testimony-bound", "summons or receives compelled witness", "subpoena notice, formal summons", "subpoena record or witness summons", "a public call that cannot be ignored"],
    ["NDK", "Law/civic life", "indictment, formal accusation, charged public wrong", "indict, accuse formally, or charge public wrong", "indictment, formal accusation", "indicted, formally accused, charge-bearing", "brings indictment or receives charge", "indictment count, accusation text", "indictment record or charge filing", "accusation made visible before judgment"],
    ["VRD", "Law/civic life", "verdict, declared finding, judgment spoken by authority", "render verdict, declare finding, or speak judgment", "verdict, declared finding", "verdict-bound, found, judgment-spoken", "renders verdict or keeps findings", "verdict text, finding statement", "verdict record or judgment finding", "judgment made answerable by speech"],
    ["CST", "Law/civic life", "custody, guarded care, lawful holding of person or child", "hold custody, guard lawfully, or care under authority", "custody, guarded care", "custodial, guarded, care-held", "keeps custody or guards under law", "custody order, guarded person", "custody record or guardianship order", "holding that must justify its care"],
    ["KWT", "Law/civic life", "equity, fair share, correction beyond rigid rule", "make equitable, balance fair share, or correct rigid rule", "equity, fair share", "equitable, fair-shared, balance-corrected", "keeps equity or balances claims", "equity claim, fair share", "equity ruling or fair-share record", "law remembering the person inside the rule"],
    ["CLT", "Law/civic life", "collateral, pledged security, asset held against debt", "collateralize, pledge security, or secure debt by asset", "collateral, pledged security", "collateralized, pledged, debt-secured", "keeps collateral or secures pledges", "collateral asset, pledged security", "collateral filing or secured-asset record", "trust guarded by a held thing"],
    ["NSR", "Law/civic life", "insurance, risk pool, shared protection against loss", "insure, pool risk, or protect against loss", "insurance, shared risk protection", "insured, risk-pooled, loss-protected", "insures or keeps risk pools", "insurance policy, protection claim", "insurance record or risk-pool standard", "many carrying one possible loss"],
    ["PNC", "Law/civic life", "pension, earned future provision, elder labor memory", "pension, provide after labor, or fund elder support", "pension, earned future provision", "pensioned, provisioned, labor-remembered", "keeps pensions or funds elder support", "pension payment, retirement provision", "pension record or earned-benefit standard", "work remembered when strength declines"],
    ["NVC", "Law/civic life", "invoice, billed claim, named amount owed for provision", "invoice, bill, or name amount owed", "invoice, billed claim", "invoiced, billed, amount-named", "issues invoices or records claims", "invoice line, billed amount", "invoice record or payable claim", "cost spoken before resentment"],
    ["RCT", "Law/civic life", "receipt, proof of exchange, remembered payment", "receipt, acknowledge exchange, or record payment", "receipt, proof of exchange", "receipted, acknowledged, payment-recorded", "keeps receipts or acknowledges payment", "receipt note, payment proof", "receipt record or exchange evidence", "exchange remembered so trust can rest"],
    ["PYR", "Law/civic life", "payroll, wage list, organized labor payment", "payroll, list wages, or organize labor payment", "payroll, wage list", "payrolled, wage-listed, labor-paid", "keeps payroll or pays workers", "payroll entry, wage line", "payroll record or wage-payment standard", "labor named before provision moves"],
    ["LSS", "Law/civic life", "lease, rented use, temporary property stewardship", "lease, rent use, or grant temporary stewardship", "lease, rented use", "leased, rented, temporary-stewarded", "leases property or keeps rental use", "lease term, rented space", "lease agreement or rental record", "use granted without pretending to own"],
    ["DVD", "Law/civic life", "dividend, distributed surplus, share of gain", "divide surplus, distribute gain, or pay share", "dividend, distributed surplus", "dividend-bearing, distributed, share-paid", "distributes dividends or receives share", "dividend payment, surplus share", "dividend record or distribution statement", "surplus returned under rule"],
    ["BNK", "Law/civic life", "bankruptcy, failed solvency, public debt reckoning", "enter bankruptcy, reckon insolvency, or order failed debts", "bankruptcy, insolvency reckoning", "bankrupt, insolvent, debt-reckoned", "keeps bankruptcy or orders insolvency", "bankruptcy case, insolvency estate", "bankruptcy filing or debt-restructuring record", "failure counted so repair can begin"],
    ["TRF", "Law/civic life", "tariff, border tax, trade gate contribution", "tariff, tax crossing trade, or price border exchange", "tariff, border tax", "tariffed, border-taxed, trade-gated", "sets tariffs or keeps trade gates", "tariff schedule, border levy", "tariff code or customs record", "trade made answerable at the boundary"],
    ["BDW", "Technology", "bandwidth, carrying capacity, channel width for signal", "allocate bandwidth, widen channel, or carry signal capacity", "bandwidth, signal capacity", "bandwidth-bound, capacity-bearing, channel-wide", "keeps bandwidth or measures capacity", "bandwidth measure, channel capacity", "bandwidth record or network capacity standard", "room made for messages to arrive"],
    ["LTC", "Technology", "latency, delayed response, time between call and answer", "lag, delay response, or measure latency", "latency, response delay", "latent, delayed, response-slow", "measures latency or reduces delay", "latency reading, delay interval", "latency report or performance standard", "waiting made visible enough to fix"],
    ["SSN", "Technology", "session, bounded interaction, remembered temporary state", "session, bind interaction, or hold temporary state", "session, bounded interaction", "sessional, state-bound, temporary", "keeps sessions or manages state", "session token, interaction state", "session record or state-management rule", "a meeting remembered only as long as needed"],
    ["NSP", "Technology", "namespace, named scope, collision-avoiding term field", "namespace, scope names, or prevent naming collision", "namespace, named scope", "namespaced, scoped, collision-guarded", "keeps namespaces or scopes names", "namespace prefix, scoped name", "namespace registry or naming standard", "names given rooms so they do not fight"],
    ["TRX", "Technology", "transaction, atomic exchange, committed system change", "transact, commit exchange, or bind system change atomically", "transaction, atomic exchange", "transactional, committed, exchange-bound", "keeps transactions or commits changes", "transaction event, commit unit", "transaction log or atomicity standard", "change that must either stand whole or not stand"],
    ["SRL", "Technology", "serialization, ordered encoding, data made transferable", "serialize, encode in order, or make data transferable", "serialization, ordered encoding", "serialized, encoded, transfer-ready", "serializes data or keeps encodings", "serialized form, encoded stream", "serialization format or transfer standard", "memory made small enough to travel"],
    ["BRN", "Technology", "branch, divergent line of change, alternate work path", "branch, diverge work, or make alternate change line", "branch, divergent change line", "branched, divergent, work-split", "keeps branches or manages divergence", "branch name, alternate line", "branch record or version-control path", "change allowed to explore without losing origin"],
    ["MRJ", "Technology", "merge, joined change, reconciled divergent work", "merge, reconcile changes, or join divergent work", "merge, reconciled change", "merged, reconciled, joined", "merges branches or resolves divergence", "merge commit, joined change", "merge record or reconciliation standard", "separate work made answerable together"],
    ["PCH", "Technology", "patch, small repair change, applied correction", "patch, repair by change, or apply correction", "patch, repair change", "patched, corrected, repair-applied", "patches systems or applies fixes", "patch file, correction unit", "patch record or maintenance release", "small repair sent before larger harm"],
    ["RPS", "Technology", "repository, versioned store, shared source memory", "repository, store source, or share versioned memory", "repository, versioned store", "repository-bound, versioned, source-kept", "keeps repositories or stewards source", "repository path, source store", "repository record or source-control standard", "shared memory for making together"],
    ["THD", "Technology", "thread, concurrent path, running line of execution", "thread, run concurrently, or split execution path", "thread, concurrent path", "threaded, concurrent, execution-split", "keeps threads or manages concurrency", "thread id, execution line", "thread record or concurrency standard", "many actions sharing one machine time"],
    ["BRS", "Technology", "browser, navigating client, interface for public web", "browse, navigate client-side, or render public web", "browser, navigating client", "browser-based, navigated, client-rendered", "keeps browsers or navigates web", "browser tab, client view", "browser standard or client-compatibility record", "a window moving through public memory"],
    ["FRT", "Technology", "frontend, user-facing layer, visible system surface", "front, render user-facing layer, or make system visible", "frontend, visible system surface", "frontend, user-facing, display-bound", "keeps frontends or designs surfaces", "frontend component, visible layer", "frontend standard or interface record", "the face a tool shows to a person"],
    ["BKN", "Technology", "backend, hidden service layer, supporting system depth", "back, serve hidden layer, or support visible system", "backend, service layer", "backend, hidden, service-bearing", "keeps backends or serves system depth", "backend service, hidden layer", "backend standard or service record", "hidden work that must still answer"],
    ["WFL", "Technology", "workflow, ordered work path, repeatable task movement", "workflow, order tasks, or move work through stages", "workflow, ordered work path", "workflow-bound, staged, task-ordered", "keeps workflows or orders tasks", "workflow step, task path", "workflow record or process standard", "work given a path so people can trust it"],
    ["GNM", "Mind", "genome, hereditary code, biological inheritance map", "genome, map heredity, or read biological code", "genome, hereditary code", "genomic, hereditary, code-bearing", "studies genomes or maps heredity", "genome sequence, heredity map", "genomic record or heredity standard", "inheritance written in living matter"],
    ["STR", "Mind", "astronomy, star study, ordered sky knowledge", "study stars, map the sky, or reason astronomically", "astronomy, star study", "astronomical, sky-measured, star-ordered", "studies astronomy or maps sky", "star chart, sky measure", "astronomy record or celestial standard", "attention lifted beyond the household roof"],
    ["GLJ", "Mind", "geology, earth layer study, deep material time", "study geology, read earth layers, or reason by deep time", "geology, earth layer study", "geological, earth-layered, deep-time", "studies geology or reads earth layers", "geologic layer, earth record", "geology survey or mineral record", "stone remembering time before speech"],
    ["NVR", "Mind", "neuroscience, nerve study, embodied cognition knowledge", "study nerves, map cognition, or reason neurologically", "neuroscience, nerve study", "neuroscientific, nerve-mapped, cognition-bound", "studies neuroscience or maps nerves", "neural finding, nerve map", "neuroscience record or clinical research standard", "thought approached through vulnerable flesh"],
    ["PTK", "Mind", "particle, small physical unit, counted matter point", "particle, divide matter, or track small units", "particle, small matter unit", "particulate, unit-small, matter-counted", "studies particles or tracks matter units", "particle event, small unit", "particle record or physics standard", "the small refusing to be ignored"],
    ["KWM", "Mind", "quantum, discrete state, measured possibility of matter", "quantize, measure discrete state, or reason by possibility", "quantum, discrete state", "quantized, discrete, possibility-measured", "studies quantum states or measures discreteness", "quantum state, discrete measure", "quantum record or measurement standard", "possibility forced to answer by measure"],
    ["RLT", "Mind", "relativity, frame relation, observer-bound measure", "relativize, compare frames, or measure by observer relation", "relativity, frame relation", "relative, frame-bound, observer-measured", "studies relativity or compares frames", "reference frame, relative measure", "relativity record or frame standard", "measure humbled by position"],
    ["XTM", "Mind", "atom, indivisible unit, basic matter body", "atomize, divide to basic unit, or study atoms", "atom, basic matter unit", "atomic, basic, unit-bodied", "studies atoms or handles atomic units", "atom body, atomic unit", "atomic record or material standard", "matter named at its small root"],
    ["MLK", "Mind", "molecule, bonded matter group, chemical body", "molecularize, bond atoms, or study matter groups", "molecule, bonded matter group", "molecular, bonded, group-bodied", "studies molecules or tracks bonds", "molecule body, bonded group", "molecular record or chemistry standard", "small bonds making shared form"],
    ["CLL", "Mind", "cell, living unit, basic body of life", "cell, divide life, or study living units", "cell, living unit", "cellular, living-unit, divided", "studies cells or keeps cell cultures", "cell body, living unit", "cell record or biology standard", "life small enough to hold"],
    ["DRV", "Mind", "derivative, rate of change, local motion of quantity", "derive rate, measure change, or track local motion", "derivative, rate of change", "derived, rate-measured, change-local", "calculates derivatives or measures change", "derivative term, rate value", "derivative record or calculus standard", "change made answerable at a point"],
    ["NTG", "Mind", "integral, accumulated whole, summed continuity", "integrate, accumulate, or sum continuous parts", "integral, accumulated whole", "integral, accumulated, continuity-summed", "integrates parts or sums continuity", "integral value, accumulated area", "integral record or calculus standard", "many smalls remembered as one"],
    ["MTX", "Mind", "matrix, ordered array, relational number field", "matrix, arrange arrays, or calculate relation fields", "matrix, ordered array", "matrixed, arrayed, relation-ordered", "keeps matrices or arranges arrays", "matrix cell, array field", "matrix record or linear algebra standard", "relations held in a disciplined table"],
    ["TPL", "Mind", "topology, continuity shape, relation under deformation", "topologize, study continuous shape, or preserve relation through change", "topology, continuity shape", "topological, continuous, deformation-stable", "studies topology or tracks continuity", "topological space, continuity relation", "topology record or spatial standard", "form remembered through bending"],
    ["XVM", "Mind", "axiom, first claim, unproven starting ground", "axiomatize, set first claim, or begin proof from ground", "axiom, first claim", "axiomatic, first-claimed, proof-grounding", "sets axioms or keeps first claims", "axiom statement, starting claim", "axiom record or formal-system standard", "the beginning that must be confessed"],
    ["NTM", "Body", "anatomy, bodily structure, mapped living form", "study anatomy, map body, or reason by bodily structure", "anatomy, bodily structure", "anatomical, body-mapped, structure-aware", "studies anatomy or maps bodily form", "anatomy chart, body structure", "anatomy record or clinical structure standard", "the body seen without shame"],
    ["THR", "Body", "therapy, guided healing practice, restored function through care", "therapize, guide healing, or restore function through care", "therapy, guided healing", "therapeutic, guided, healing-practiced", "practices therapy or guides healing", "therapy session, guided practice", "therapy record or care plan", "repair made patient and personal"],
    ["SRJ", "Body", "surgery, invasive repair, skilled cutting for healing", "operate surgically, cut for repair, or heal by skilled intervention", "surgery, invasive repair", "surgical, invasive, repair-cut", "performs surgery or assists operation", "surgical act, operation site", "surgery record or operative consent", "harmful cutting justified only by healing"],
    ["PHR", "Body", "pharmacy, medicine store, prepared remedy stewardship", "pharmacy, prepare medicine, or steward remedies", "pharmacy, remedy store", "pharmaceutical, remedy-kept, medicine-prepared", "keeps pharmacy or prepares medicine", "pharmacy dose, prepared remedy", "pharmacy record or medication standard", "remedy guarded before it enters the body"],
    ["TRM", "Body", "trauma, wound shock, injury carried into memory", "traumatize, suffer wound shock, or carry injury memory", "trauma, wound shock", "traumatic, shock-wounded, memory-injured", "treats trauma or bears wound shock", "trauma mark, injury memory", "trauma record or emergency care note", "hurt that continues asking to be seen"],
    ["MMN", "Body", "immunity, defended life, trained bodily protection", "immunize, defend bodily life, or train protection", "immunity, bodily protection", "immune, defended, protection-trained", "keeps immunity or trains protection", "immune response, protection mark", "immunity record or public health standard", "the body remembering danger wisely"],
    ["NFD", "Body", "nutrition, nourishment pattern, food made into strength", "nourish, feed well, or order food for strength", "nutrition, nourishment pattern", "nutritive, nourished, strength-fed", "nourishes or studies nutrition", "nutrition plan, nourishment measure", "nutrition record or food-care standard", "food treated as future strength"],
    ["DSB", "Body", "disability, impaired function, body difference needing access", "disable, adapt for impairment, or name access need", "disability, impaired function", "disabled, impaired, access-needing", "supports disability access or names impairment", "disability status, access need", "disability record or accessibility right", "difference answered with design"],
    ["HSP", "Body", "hospice, end-of-life care, sheltered dying", "hospice, shelter dying, or keep end-of-life care", "hospice, end-of-life care", "hospice-bound, dying-sheltered, end-care", "keeps hospice or accompanies dying", "hospice room, end-care place", "hospice record or palliative care plan", "death met without abandonment"],
    ["PDK", "Body", "epidemic, spreading illness, public contagion event", "epidemic, spread illness publicly, or track contagion event", "epidemic, spreading illness", "epidemic, contagious, publicly spreading", "tracks epidemics or coordinates response", "epidemic wave, contagion event", "epidemic report or public health order", "sickness that makes private life public"],
    ["HBR", "Building/making", "harbor, sheltered port, protected arrival by water", "harbor, shelter vessels, or protect water arrival", "harbor, sheltered port", "harbored, sheltered, port-bound", "keeps harbors or shelters vessels", "harbor dock, port shelter", "harbor record or port authority standard", "arrival protected from rough water"],
    ["RYP", "Building/making", "airport, flight port, civic threshold for air travel", "airport, gather flights, or order air arrival", "airport, flight port", "airport-bound, flight-gathered, air-threshold", "keeps airports or orders flights", "airport gate, flight terminal", "airport record or aviation standard", "a public threshold for lifted distance"],
    ["TXN", "Building/making", "tunnel, underground passage, hidden crossing through matter", "tunnel, bore passage, or cross through earth", "tunnel, underground passage", "tunneled, underground, passage-bored", "builds tunnels or keeps underground passages", "tunnel bore, underground route", "tunnel record or safety standard", "a path made through what seemed solid"],
    ["RYL", "Building/making", "rail, guided track, fixed path for shared transport", "rail, guide by track, or move on fixed path", "rail, guided track", "railed, track-guided, fixed-path", "keeps railways or guides track", "rail line, track segment", "rail record or transit standard", "movement disciplined for many bodies"],
    ["GRD", "Building/making", "grid, linked infrastructure net, distributed support pattern", "grid, link infrastructure, or distribute support", "grid, linked support net", "gridded, linked, distributed", "keeps grids or links support", "grid node, networked support", "utility grid or infrastructure standard", "hidden support shared across a people"],
    ["PRP", "Building/making", "pipe, conduit, carried flow, built channel", "pipe, conduit, or carry flow through channel", "pipe, conduit", "piped, channeled, flow-carried", "keeps pipes or channels flow", "pipe segment, conduit", "pipe record or utility conduit standard", "what carries need without being seen"],
    ["DMR", "Building/making", "dam, reservoir wall, held water for public use", "dam, hold water, or make reservoir wall", "dam, reservoir wall", "dammed, water-held, reservoir-bound", "keeps dams or holds water", "dam wall, reservoir gate", "dam record or water-control standard", "restraint built for future thirst"],
    ["SWR", "Building/making", "sewer, waste channel, hidden sanitation path", "sewer, channel waste, or remove foul flow", "sewer, sanitation channel", "sewered, waste-channeled, sanitation-hidden", "keeps sewers or channels waste", "sewer line, waste conduit", "sewer record or sanitation standard", "unclean matter carried without denial"],
    ["PWR", "Building/making", "power plant, generation site, civic energy house", "generate power, house energy, or sustain utility production", "power plant, energy house", "power-plant, generation-bound, utility-bearing", "keeps power plants or generates civic energy", "power unit, generation site", "power plant record or utility generation standard", "shared strength made into service"],
    ["WRH", "Building/making", "warehouse, stored goods house, provision reserve", "warehouse, store goods, or keep provision reserve", "warehouse, goods storehouse", "warehoused, stored, reserve-kept", "keeps warehouses or stores provision", "warehouse bay, stored goods", "warehouse record or inventory standard", "provision waiting in ordered shelter"],
    ["NST", "Future/civilization", "institution, durable role house, public continuity structure", "institutionalize, house roles, or preserve public continuity", "institution, durable role house", "institutional, role-housed, continuity-bearing", "keeps institutions or houses roles", "institution office, role structure", "institution charter or continuity record", "memory given a working body"],
    ["CNN", "Future/civilization", "canon, accepted inheritance, teaching body of works", "canonize, receive inheritance, or bind teaching works", "canon, accepted inheritance", "canonical, received, teaching-bound", "keeps canon or receives works", "canonical work, accepted text", "canon record or curricular inheritance", "what a people agrees to keep reading"],
    ["DSR", "Future/civilization", "diaspora, scattered people, identity carried through distance", "scatter as diaspora, carry identity, or keep peoplehood abroad", "diaspora, scattered people", "diasporic, scattered, identity-carried", "keeps diaspora memory or carries peoplehood abroad", "diaspora house, scattered community", "diaspora record or civic outreach", "belonging stretched without breaking"],
    ["MGR", "Future/civilization", "migration, movement of people, settlement-shaping passage", "migrate, move peoples, or reshape settlement by passage", "migration, people movement", "migratory, moving, settlement-shaping", "keeps migration records or guides passage", "migration route, movement wave", "migration record or resettlement standard", "home moving under necessity and hope"],
    ["STL", "Future/civilization", "settlement, founded dwelling, new civic planting", "settle, found dwelling, or plant civic life", "settlement, founded dwelling", "settled, founded, dwelling-planted", "keeps settlements or guides founding", "settlement site, new dwelling", "settlement charter or land record", "a beginning that must become responsible"],
    ["RPL", "Future/civilization", "republic, public thing, people-governed order", "republicanize, govern publicly, or hold common power", "republic, public order", "republican, public-held, people-governed", "keeps republics or serves public order", "republic office, common power", "republic charter or public-order record", "power held where citizens can answer it"],
    ["DPL", "Future/civilization", "diplomacy, envoy speech, peace-seeking public relation", "diplomize, send envoys, or speak between peoples", "diplomacy, envoy speech", "diplomatic, envoy-bound, relation-seeking", "keeps diplomacy or sends envoys", "diplomatic note, envoy mission", "diplomatic record or foreign-service standard", "speech walking where armies must not"],
    ["TRT", "Future/civilization", "treaty, inter-people vow, public peace bond", "treaty, bind peoples, or vow peace publicly", "treaty, inter-people bond", "treatied, inter-people, peace-bound", "keeps treaties or binds peoples", "treaty clause, peace bond", "treaty record or international obligation", "a vow large enough for peoples"],
    ["MBS", "Future/civilization", "embassy, envoy house, protected foreign presence", "embassy, house envoys, or protect foreign presence", "embassy, envoy house", "embassy-bound, envoy-housed, foreign-protected", "keeps embassies or hosts envoys", "embassy office, envoy house", "embassy record or diplomatic site standard", "hospitality made public between peoples"],
    ["CVL", "Future/civilization", "civilization, durable people-order, memory-bearing public life", "civilize, order public life, or carry people-memory durably", "civilization, durable people-order", "civilizational, durable, memory-bearing", "keeps civilization or orders public life", "civilizational form, public inheritance", "civilizational record or public-continuity standard", "a people living long enough to answer the future"],
    ["SNT", "Speech", "sentence, complete utterance, bounded thought in words", "sentence, bound thought, or speak complete utterance", "sentence, complete utterance", "sentential, complete, utterance-bound", "forms sentences or bounds thought", "sentence line, complete utterance", "sentence record or grammar standard", "thought given a finished breath"],
    ["PRF", "Speech", "paragraph, grouped sentences, developed written thought", "paragraph, group sentences, or develop written thought", "paragraph, sentence group", "paragraphic, grouped, thought-developed", "keeps paragraphs or develops text", "paragraph block, thought unit", "paragraph standard or document structure", "a thought given room to mature"],
    ["TTL", "Speech", "title, named heading, public face of a work", "title, head a work, or name public face", "title, named heading", "titled, headed, work-named", "titles works or keeps headings", "title line, named heading", "title record or catalog standard", "the small name before the larger memory"],
    ["CTN", "Speech", "citation, sourced reference, named debt to prior speech", "cite, source reference, or name debt to prior speech", "citation, sourced reference", "cited, sourced, reference-bound", "cites sources or keeps references", "citation note, source pointer", "citation record or scholarly standard", "memory paying its debts"],
    ["NTC", "Speech", "annotation, marginal note, teaching mark beside text", "annotate, note beside text, or teach by margin", "annotation, marginal note", "annotated, margin-marked, text-beside", "annotates texts or keeps notes", "annotation mark, margin note", "annotation record or editorial standard", "careful attention left for another reader"],
    ["FRN", "Speech", "forum, public speech place, gathered civic exchange", "forum, gather speech, or open civic exchange", "forum, public speech place", "forensic, forum-bound, exchange-gathered", "keeps forums or gathers public speech", "forum thread, public exchange", "forum record or public-meeting standard", "a place where difference must speak"],
    ["MNF", "Speech", "manifesto, declared program, public statement of intent", "manifest, declare program, or state intent publicly", "manifesto, declared program", "manifest, program-declared, intent-public", "writes manifestos or declares programs", "manifesto text, program statement", "manifesto record or public-declaration standard", "intention made visible enough to judge"],
    ["DCR", "Speech", "decree, authoritative pronouncement, command entered into record", "decree, pronounce authority, or enter command into record", "decree, authoritative pronouncement", "decreed, pronounced, authority-spoken", "issues decrees or records commands", "decree text, authority command", "decree record or official pronouncement", "command made public so it can answer"],
    ["SFR", "Speech", "satire, corrective ridicule, comic exposure of folly", "satirize, expose folly, or correct by comic speech", "satire, corrective ridicule", "satirical, folly-exposing, comic-corrective", "satirizes folly or keeps comic critique", "satire line, exposed folly", "satire record or protected comic speech", "laughter sharpened for truth"],
    ["PLM", "Speech", "polemic, forceful argument, public contest of claims", "polemize, argue forcefully, or contest claims publicly", "polemic, forceful argument", "polemical, contested, argument-driven", "writes polemic or contests claims", "polemic text, contested claim", "polemic record or public controversy", "conflict kept in words"],
    ["DTR", "Conflict/repair", "deterrence, prevented attack, restrained enemy by consequence", "deter, prevent attack, or restrain by consequence", "deterrence, prevented attack", "deterrent, restrained, consequence-backed", "keeps deterrence or prevents attack", "deterrent signal, prevented strike", "deterrence policy or defense posture", "force held so force need not be used"],
    ["CSF", "Conflict/repair", "ceasefire, stopped fighting, temporary mercy line", "ceasefire, stop fighting, or hold temporary peace", "ceasefire, stopped fighting", "ceasefire-bound, fighting-stopped, mercy-lined", "keeps ceasefire or monitors fighting stop", "ceasefire line, pause order", "ceasefire agreement or monitoring record", "a pause where repair may enter"],
    ["SGJ", "Conflict/repair", "siege, encircled pressure, city held under force", "siege, encircle, or pressure a place by force", "siege, encircled pressure", "besieged, encircled, pressure-held", "lays siege or endures encirclement", "siege line, encircled city", "siege record or protection order", "pressure that makes civilians visible"],
    ["RKN", "Conflict/repair", "reconnaissance, scouting notice, danger seen before action", "reconnoiter, scout, or notice danger before action", "reconnaissance, scouting notice", "reconnoitered, scouted, danger-seen", "scouts or keeps reconnaissance", "recon report, scouting sign", "reconnaissance record or security observation", "seeing before striking"],
    ["SBJ", "Conflict/repair", "sabotage, hidden damage, broken system by hostile hand", "sabotage, damage secretly, or break hostilely", "sabotage, hidden damage", "sabotaged, hidden-broken, hostile", "sabotages or investigates hidden damage", "sabotage mark, hidden break", "sabotage report or security incident", "a break that hides its hand"],
    ["SPJ", "Conflict/repair", "espionage, covert seeing, secret intelligence gathering", "spy, gather covertly, or see in secrecy", "espionage, covert seeing", "espionage-bound, covert, secret-seeing", "spies or counters espionage", "spy report, covert finding", "espionage record or intelligence rule", "hidden sight under moral danger"],
    ["RFG", "Conflict/repair", "refuge, sheltered escape, protected place from harm", "refuge, shelter escape, or protect from harm", "refuge, sheltered escape", "refuge-bound, sheltered, harm-protected", "keeps refuge or shelters escape", "refuge place, safe shelter", "refuge record or asylum protection", "safety given before asking worthiness"],
    ["VCT", "Conflict/repair", "evacuation, ordered removal from danger, protected departure", "evacuate, remove from danger, or order protected departure", "evacuation, protected departure", "evacuated, danger-removed, departure-protected", "evacuates or coordinates departure", "evacuation route, removal order", "evacuation record or emergency transport plan", "leaving made an act of care"],
    ["SHD", "Conflict/repair", "shield, protective barrier, defended surface before harm", "shield, interpose protection, or defend by barrier", "shield, protective barrier", "shielded, barriered, protected", "shields or keeps barriers", "shield wall, protective surface", "shield standard or defense equipment record", "strength placed between harm and the vulnerable"],
    ["MNC", "Conflict/repair", "munition, prepared war material, stored force", "munition, prepare force, or store war material", "munition, prepared war material", "munitioned, force-stored, war-prepared", "keeps munitions or prepares force", "munition store, prepared weapon", "munition record or arms-control standard", "force counted before it escapes duty"]
  ];

  return seeds.map(([id, category, semanticField, action, concept, quality, agent, object, civic, intimate]) =>
    seedRoot(id, category, semanticField, action, concept, quality, agent, object, civic, intimate)
  );
}

function humanDepthRoots() {
  const seeds = [
    ["CXT", "Seeing/knowing", "context, surrounding meaning, field that frames recognition", "contextualize, frame by surroundings, or read surrounding meaning", "context, surrounding meaning", "contextual, framed, surrounding-aware", "keeps context or frames meaning", "context field, surrounding clue", "context record or interpretive frame", "the room around what someone says"],
    ["PSR", "Seeing/knowing", "perspective, viewpoint, angle of seeing", "perspect, take viewpoint, or see from an angle", "perspective, viewpoint", "perspectival, viewpoint-bound, angle-aware", "keeps perspectives or shifts viewpoint", "viewpoint mark, angle of regard", "perspective note or review standpoint", "another angle held without surrendering truth"],
    ["SLN", "Seeing/knowing", "salience, noticeable importance, figure rising from field", "make salient, notice importance, or raise figure from field", "salience, noticeable importance", "salient, importance-marked, figure-raised", "marks salience or notices importance", "salience mark, noticed feature", "priority note or salience standard", "what asks to be noticed first"],
    ["BJS", "Seeing/knowing", "bias, tilted judgment, hidden preference in seeing", "bias, tilt judgment, or prefer hiddenly", "bias, tilted judgment", "biased, tilted, preference-bent", "detects bias or bears tilted seeing", "bias mark, hidden preference", "bias disclosure or review note", "the angle one must confess"],
    ["HRC", "Seeing/knowing", "heuristic, useful shortcut, provisional rule for thought", "use heuristic, shortcut judgment, or guide by provisional rule", "heuristic, useful shortcut", "heuristic, provisional, shortcut-guided", "keeps heuristics or tests shortcuts", "heuristic rule, provisional guide", "heuristic record or decision aid", "a quick path that must remember humility"],
    ["NTL", "Seeing/knowing", "intuition, pre-articulate knowing, felt recognition", "intuit, sense before proof, or recognize tacitly", "intuition, felt recognition", "intuitive, tacit, pre-articulate", "intuits or tests tacit knowledge", "intuition sign, felt clue", "intuition note or preliminary judgment", "knowing that arrives before words"],
    ["FLC", "Seeing/knowing", "fallacy, broken inference, deceptive seeming", "fallaciously infer, deceive by form, or break reasoning", "fallacy, broken inference", "fallacious, deceptive, inference-broken", "finds fallacies or reasons falsely", "fallacy type, broken argument", "fallacy finding or reasoning defect", "thought wearing the clothes of truth"],
    ["VRF", "Seeing/knowing", "verification, checked truth, confirmation by repeated witness", "verify, check truth, or confirm by witness", "verification, checked truth", "verified, checked, witness-confirmed", "verifies or checks claims", "verification mark, confirmed claim", "verification record or audit note", "trust strengthened by returning to see again"],
    ["SPM", "Seeing/knowing", "assumption, taken premise, untested starting belief", "assume, take premise, or begin from untested belief", "assumption, taken premise", "assumed, premise-held, untested", "keeps assumptions or names premises", "assumption note, premise token", "assumption register or model premise", "the hidden beginning that should be named"],
    ["CRT", "Seeing/knowing", "certainty, settled knowing, firm assent after judgment", "certify inwardly, settle knowing, or give firm assent", "certainty, settled knowing", "certain, settled, assent-firm", "settles certainty or tests firm assent", "certainty mark, settled claim", "certainty standard or confidence declaration", "rest after truth has answered enough"],
    ["GNP", "Seeing/knowing", "ignorance, unknowing, blind gap in recognition", "ignore, remain unknowing, or mark a blind gap", "ignorance, blind gap", "ignorant, unknowing, gap-blind", "names ignorance or uncovers blind gaps", "unknown gap, ignorance mark", "knowledge-gap report or disclosure", "not knowing without pretending sight"],
    ["XPR", "Seeing/knowing", "expertise, trained knowing, disciplined competence", "gain expertise, train knowing, or judge by practiced skill", "expertise, trained knowing", "expert, trained, competence-bearing", "keeps expertise or practices trained judgment", "expert finding, skill mark", "expert review or credential record", "knowledge ripened by long work"],
    ["LNS", "Seeing/knowing", "lens, filter, selected frame of attention", "lens, filter, or frame attention through a chosen medium", "lens, selected filter", "lensed, filtered, frame-selected", "keeps lenses or filters attention", "lens frame, attention filter", "lens note or analytic filter", "the chosen glass between self and world"],
    ["MBG", "Seeing/knowing", "ambiguity, double meaning, unresolved interpretive fork", "make ambiguous, fork meaning, or leave interpretation unresolved", "ambiguity, double meaning", "ambiguous, forked, unresolved", "finds ambiguity or holds double meaning", "ambiguous sign, interpretive fork", "ambiguity note or drafting issue", "where meaning asks for patience"],
    ["CLF", "Seeing/knowing", "clarification, made-clear meaning, removed confusion", "clarify, remove confusion, or make meaning clear", "clarification, made-clear meaning", "clarified, clear, confusion-removed", "clarifies meaning or removes confusion", "clarifying note, clear statement", "clarification record or public correction", "care given to another mind"],
    ["XPL", "Seeing/knowing", "explanation, unfolded reason, cause made speakable", "explain, unfold reason, or make cause speakable", "explanation, unfolded reason", "explanatory, unfolded, cause-spoken", "explains or keeps causes speakable", "explanation text, cause account", "explanatory memorandum or rationale", "truth made patient for another"],
    ["RLV", "Seeing/knowing", "relevance, bearing on question, meaning that matters", "make relevant, bear on a question, or show what matters", "relevance, bearing on question", "relevant, question-bearing, mattering", "marks relevance or sorts what matters", "relevance mark, material fact", "relevance ruling or admissibility note", "what belongs to the present question"],
    ["KRT", "Seeing/knowing", "criterion, judging standard, measure for discernment", "criterion, set standard, or judge by measure", "criterion, judging standard", "criterial, standard-bound, measure-guided", "sets criteria or judges by standard", "criterion item, standard mark", "criterion record or evaluation rubric", "the measure declared before judgment"],
    ["BSV", "Seeing/knowing", "observation, attended seeing, recorded notice", "observe, attend carefully, or record notice", "observation, attended seeing", "observed, attended, notice-recorded", "observes or keeps notices", "observation note, noticed event", "observation record or field note", "seeing that accepts responsibility"],
    ["GST", "Seeing/knowing", "gist, grasped whole, compressed sense of meaning", "grasp gist, compress sense, or hold the whole lightly", "gist, grasped whole", "gist-bearing, sense-grasped, compressed", "grasps gist or summarizes sense", "gist note, compressed sense", "summary record or briefing point", "the whole held without crushing detail"],
    ["VLB", "Love/intimacy", "vulnerability, open risk, exposed need before another", "be vulnerable, open risk, or expose need truthfully", "vulnerability, open risk", "vulnerable, open, risk-bearing", "bears vulnerability or protects openness", "vulnerable place, exposed need", "vulnerability disclosure or care note", "the door opened before trust is proven"],
    ["TDR", "Love/intimacy", "tenderness, gentle strength, softness toward another's fragility", "be tender, soften strength, or touch fragility gently", "tenderness, gentle strength", "tender, gentle, fragility-aware", "gives tenderness or protects fragility", "tender act, gentle touch", "care standard or tenderness note", "strength becoming careful near another"],
    ["DVT", "Love/intimacy", "devotion, devoted presence, love made durable by practice", "devote, remain present, or make love durable", "devotion, durable presence", "devoted, durable, presence-kept", "keeps devotion or remains present", "devotion act, kept presence", "devotional vow or care obligation", "staying shaped into daily action"],
    ["CHR", "Love/intimacy", "cherishing, precious regard, active keeping of beloved worth", "cherish, regard as precious, or keep beloved worth", "cherishing, precious regard", "cherished, precious, worth-held", "cherishes or protects beloved worth", "cherished sign, precious token", "care preference or protected interest", "worth held close without possession"],
    ["FRG", "Love/intimacy", "forgiveness, released debt, restored nearness after wrong", "forgive, release debt, or restore nearness after wrong", "forgiveness, released debt", "forgiving, released, debt-loosened", "forgives or receives forgiveness", "forgiveness word, released debt", "forgiveness agreement or restorative note", "release that still remembers truth"],
    ["MTL", "Love/intimacy", "mutuality, reciprocal care, two-sided recognition", "mutualize, answer care, or recognize reciprocally", "mutuality, reciprocal care", "mutual, reciprocal, two-sided", "keeps mutuality or answers care", "mutual act, reciprocal bond", "mutual obligation or reciprocal record", "love answering rather than consuming"],
    ["NRS", "Love/intimacy", "nearness, closeness, shared inward distance reduced", "draw near, keep closeness, or reduce inward distance", "nearness, closeness", "near, close, inwardly present", "draws near or keeps closeness", "near place, closeness mark", "recognized close relation or proximity note", "distance made gentle"],
    ["WNS", "Love/intimacy", "woundedness, hurt carried into relation, pain needing recognition", "wound inwardly, carry hurt, or ask pain to be recognized", "woundedness, carried hurt", "wounded, hurt, recognition-needing", "bears woundedness or tends hurt", "wound memory, hurt sign", "harm statement or care need", "pain asking not to be dismissed"],
    ["LVD", "Love/intimacy", "belovedness, being loved, received precious standing", "be beloved, receive love, or stand as precious", "belovedness, received love", "beloved, loved, precious-received", "receives belovedness or names beloved standing", "beloved sign, love mark", "recognized intimate standing or care status", "worth received from another's gaze"],
    ["KSR", "Love/intimacy", "kiss, mouth-sign of affection, embodied recognition", "kiss, mark affection, or recognize by mouth-sign", "kiss, embodied affection sign", "kissed, affection-marked, embodied", "kisses or receives affection sign", "kiss mark, mouth-sign", "consent-bound affection note", "tender speech made bodily"],
    ["CRS", "Love/intimacy", "caress, gentle touch, comforting bodily attention", "caress, touch gently, or comfort by bodily attention", "caress, gentle touch", "caressed, gentle-touched, comforted", "caresses or comforts by touch", "caress act, gentle hand", "care touch record or consent note", "attention carried by the hand"],
    ["PRM", "Love/intimacy", "promise, intimate pledge, future word given to another", "promise, pledge future word, or bind care personally", "promise, intimate pledge", "promised, pledged, future-bound", "keeps promises or gives intimate pledge", "promise word, pledge sign", "promise record or care commitment", "a future placed in another's hands"],
    ["SXN", "Love/intimacy", "eros, bodily desire, generative intimate pull", "desire bodily, draw erotically, or honor generative pull", "eros, bodily desire", "erotic, desire-drawn, generative", "bears eros or guards desire", "erotic sign, desire mark", "consent-bound intimacy record", "desire disciplined by recognition"],
    ["RVN", "Love/intimacy", "reverence, honored nearness, awe before personal depth", "revere, honor nearness, or hold awe before depth", "reverence, honored nearness", "reverent, honored, depth-aware", "reveres or guards honored nearness", "reverence sign, honored address", "honorific relation or dignity note", "awe lowered gently toward a person"],
    ["CMT", "Love/intimacy", "commitment, chosen staying, durable relational decision", "commit, choose staying, or make relation durable", "commitment, chosen staying", "committed, durable, staying-chosen", "keeps commitment or chooses staying", "commitment word, durable bond", "commitment record or relational obligation", "the decision to remain answerable"],
    ["CNS", "Moral agency", "conscience, inward witness, moral knowing that accuses or clears", "act by conscience, witness inwardly, or test moral knowing", "conscience, inward witness", "conscientious, inward-witnessed, morally awake", "keeps conscience or tests inward witness", "conscience signal, inward charge", "conscience claim or moral exemption record", "truth speaking inside the self"],
    ["VRT", "Moral agency", "virtue, practiced excellence, stable moral strength", "practice virtue, strengthen excellence, or habituate the good", "virtue, practiced excellence", "virtuous, excellent, habit-formed", "keeps virtue or trains moral strength", "virtue act, excellence habit", "virtue standard or character record", "good made steady by practice"],
    ["VYS", "Moral agency", "vice, corrupted habit, practiced deformation of agency", "fall into vice, corrupt habit, or deform agency by repetition", "vice, corrupted habit", "vicious, corrupted, habit-deformed", "bears vice or repairs corrupted habit", "vice act, corrupt habit", "misconduct pattern or vice report", "wrong made easy by repetition"],
    ["NTR", "Moral agency", "integrity, undivided self, alignment of word and act", "keep integrity, remain undivided, or align word with act", "integrity, undivided self", "integral, undivided, word-act-aligned", "keeps integrity or tests alignment", "integrity mark, aligned act", "integrity statement or ethics record", "the self not split from its word"],
    ["TMT", "Moral agency", "temptation, attractive wrong, desire pulling against duty", "tempt, face temptation, or be pulled from duty", "temptation, attractive wrong", "tempted, duty-pulled, desire-drawn", "tempts or resists temptation", "temptation sign, attractive wrong", "conflict-of-interest note or temptation warning", "desire asking to rule"],
    ["RPN", "Moral agency", "repentance, turned will, grief becoming changed action", "repent, turn will, or change after moral grief", "repentance, turned will", "repentant, turned, grief-changed", "repents or receives repentance", "repentance act, turned path", "repentance statement or restorative filing", "sorrow refusing to stay only sorrow"],
    ["BDN", "Moral agency", "obedience, heard command enacted, willing answer to authority", "obey, hear command, or answer authority in action", "obedience, enacted command", "obedient, command-heard, authority-answering", "obeys or keeps command", "obedience act, command answer", "compliance record or obedience duty", "the act of letting rightful speech govern"],
    ["DLG", "Moral agency", "delegation, entrusted agency, power assigned to another", "delegate, entrust agency, or assign power", "delegation, entrusted agency", "delegated, entrusted, power-assigned", "delegates or receives agency", "delegated charge, assigned power", "delegation record or authority assignment", "power handed over with memory attached"],
    ["KNS", "Moral agency", "consequence, moral aftermath, result that answers action", "consequent, bear aftermath, or answer action by result", "consequence, moral aftermath", "consequential, aftermath-bearing, result-bound", "bears consequence or traces aftermath", "consequence mark, result burden", "impact finding or consequence record", "the answer action cannot silence"],
    ["SKR", "Moral agency", "sacrifice, costly giving, loss accepted for higher duty", "sacrifice, give costly, or accept loss for duty", "sacrifice, costly giving", "sacrificial, costly, duty-given", "sacrifices or receives costly giving", "sacrifice gift, accepted loss", "sacrifice record or public dedication", "loss chosen under a greater claim"],
    ["RZL", "Moral agency", "resolve, firm will, settled choice under pressure", "resolve, firm will, or settle choice under pressure", "resolve, firm will", "resolved, firm, pressure-settled", "keeps resolve or strengthens will", "resolve word, firm decision", "resolution record or declared intent", "choice refusing to scatter"],
    ["DSC", "Moral agency", "discipline, trained self-command, formed freedom", "discipline, train self-command, or form freedom", "discipline, trained self-command", "disciplined, trained, freedom-formed", "keeps discipline or trains self-command", "discipline practice, training rule", "disciplinary record or formation standard", "freedom taught to hold shape"],
    ["NGL", "Moral agency", "negligence, failed care, duty omitted through inattention", "neglect, fail care, or omit duty through inattention", "negligence, failed care", "negligent, care-failed, duty-omitting", "neglects or investigates failed care", "negligence mark, omitted duty", "negligence finding or care failure", "absence that becomes harm"],
    ["CMP", "Moral agency", "complicity, shared guilt, participation in another's wrong", "be complicit, share guilt, or participate in wrong", "complicity, shared guilt", "complicit, guilt-shared, wrong-joined", "bears complicity or names shared guilt", "complicity link, shared fault", "complicity finding or accountability record", "standing near wrong as if innocent"],
    ["MRT", "Moral agency", "merit, earned standing, desert joined to action", "merit, earn standing, or deserve by action", "merit, earned standing", "merited, earned, desert-bearing", "earns merit or judges desert", "merit mark, earned claim", "merit record or qualification standard", "honor that must remember its work"],
    ["YRR", "Time", "year, annual cycle, long counted season", "year, count annually, or mark long season", "year, annual cycle", "yearly, annual, long-counted", "keeps years or marks annual cycles", "year mark, annual span", "year record or annual term", "time large enough to test promises"],
    ["WKK", "Time", "week, seven-day rhythm, ordinary cycle of labor and rest", "week, count weekly, or order labor-rest rhythm", "week, labor-rest cycle", "weekly, rhythm-counted, ordinary", "keeps weeks or orders weekly rhythm", "week mark, weekly span", "weekly schedule or work-rest record", "small cycle of duty and return"],
    ["MTH", "Time", "month, lunar measure, named season within year", "month, count by month, or name season within year", "month, lunar measure", "monthly, moon-counted, season-named", "keeps months or marks monthly time", "month mark, lunar span", "monthly record or billing period", "time held under borrowed light"],
    ["NHT", "Time", "night, dark span, rest and hiddenness of day", "night, darken, or pass through rest span", "night, dark span", "nightly, dark, rest-bound", "keeps night watch or marks dark span", "night watch, dark interval", "night record or watch schedule", "time when attention lowers its voice"],
    ["DWN", "Time", "dawn, first light, beginning of visible day", "dawn, begin light, or open visible day", "dawn, first light", "dawning, first-lit, beginning-visible", "watches dawn or marks first light", "dawn sign, first light", "dawn watch or opening time", "the day becoming answerable"],
    ["DSK", "Time", "dusk, fading light, threshold into night", "dusk, fade light, or enter night threshold", "dusk, fading light", "dusky, fading, threshold-dark", "watches dusk or marks fading light", "dusk sign, evening threshold", "dusk watch or closing time", "the day giving back its certainty"],
    ["DRN", "Time", "duration, held span, time occupied by action", "endure in time, measure duration, or hold a span", "duration, held span", "durational, held, span-bound", "measures duration or keeps spans", "duration mark, held interval", "duration record or service term", "how long a promise occupies the world"],
    ["CYK", "Time", "cycle, recurring turn, pattern returning through time", "cycle, recur, or turn through patterned return", "cycle, recurring turn", "cyclic, recurring, return-patterned", "keeps cycles or marks recurrence", "cycle mark, returning turn", "cycle record or maintenance interval", "return without forgetting change"],
    ["NVS", "Time", "anniversary, remembered date, return of meaningful time", "anniversary, return by date, or remember a marked day", "anniversary, remembered date", "anniversary-marked, date-returned, remembered", "keeps anniversaries or marks remembered days", "anniversary date, memorial return", "anniversary record or observance date", "time coming back carrying a name"],
    ["KRN", "Time", "chronicle, ordered account, history told in sequence", "chronicle, order events, or tell history in sequence", "chronicle, ordered account", "chronicled, sequenced, history-told", "keeps chronicles or orders events", "chronicle entry, sequence account", "chronicle record or historical register", "memory walking in order"],
    ["TMP", "Time", "tempo, pace, lived speed of action", "tempo, pace action, or set lived speed", "tempo, pace", "tempoed, paced, speed-shaped", "keeps tempo or sets pace", "tempo mark, pace beat", "tempo note or performance timing", "the felt speed of becoming"],
    ["TML", "Time", "timeliness, fit moment, action arriving when due", "be timely, fit the moment, or arrive when due", "timeliness, fit moment", "timely, moment-fit, due-arrived", "keeps timeliness or judges due arrival", "timeliness mark, fit moment", "timeliness finding or deadline compliance", "care shown by arriving in season"],
    ["NXY", "Emotion", "anxiety, restless fear, uncertain threat in the body", "feel anxiety, grow restless, or fear uncertainly", "anxiety, restless fear", "anxious, restless, uncertainty-threatened", "bears anxiety or calms uncertainty", "anxiety sign, restless fear", "clinical anxiety note or stress report", "fear without a clear face"],
    ["RSN", "Emotion", "resentment, remembered grievance, bitterness against perceived debt", "resent, hold grievance, or bitterly remember debt", "resentment, remembered grievance", "resentful, grievance-held, bitter", "bears resentment or releases grievance", "resentment mark, grievance memory", "grievance note or conflict risk", "memory refusing repair"],
    ["DGS", "Emotion", "disgust, recoil from corruption, bodily moral refusal", "feel disgust, recoil, or refuse corruption bodily", "disgust, corruption recoil", "disgusted, recoiling, corruption-refusing", "bears disgust or names corruption", "disgust sign, recoil response", "sanitation complaint or moral hazard note", "the body saying no before argument"],
    ["RLF", "Emotion", "relief, burden lifted, danger passing from the heart", "feel relief, lift burden, or pass out of danger", "relief, lifted burden", "relieved, lifted, danger-passed", "brings relief or receives burden lifted", "relief breath, lifted burden", "relief record or aid response", "the heart finding room again"],
    ["DSP", "Emotion", "despair, hope collapse, future felt as closed", "despair, lose hope, or feel future closed", "despair, collapsed hope", "despairing, hope-collapsed, future-closed", "bears despair or guards against collapse", "despair sign, closed future", "crisis note or despair risk", "when tomorrow disappears from the heart"],
    ["MLN", "Emotion", "melancholy, soft sorrow, low inward weather", "feel melancholy, soften sorrow, or dwell in low inward weather", "melancholy, soft sorrow", "melancholic, soft-sorrowed, inward-low", "bears melancholy or sings low sorrow", "melancholy mood, low weather", "mood note or poetic register", "sorrow without a single wound"],
    ["LNL", "Emotion", "loneliness, unshared presence, ache for recognized nearness", "feel lonely, lack shared presence, or ache for nearness", "loneliness, unshared presence", "lonely, unshared, nearness-lacking", "bears loneliness or offers presence", "loneliness sign, unshared room", "care need or isolation note", "presence without witness"],
    ["MBL", "Emotion", "ambivalence, divided feeling, inward double pull", "feel ambivalent, divide feeling, or hold double pull", "ambivalence, divided feeling", "ambivalent, divided, double-pulled", "bears ambivalence or names mixed feeling", "ambivalence mark, divided pull", "preference note or consent concern", "the heart answering twice"],
    ["BTR", "Emotion", "bitterness, hardened hurt, grief turned sharp", "grow bitter, harden hurt, or sharpen grief", "bitterness, hardened hurt", "bitter, hardened, hurt-sharp", "bears bitterness or softens hardened hurt", "bitter word, hardened hurt", "conflict note or repair barrier", "pain that has learned teeth"],
    ["CRY", "Emotion", "curiosity, seeking interest, hunger to know", "be curious, seek, or hunger to know", "curiosity, seeking interest", "curious, seeking, knowledge-hungry", "bears curiosity or awakens inquiry", "curious question, seeking sign", "inquiry note or research interest", "desire turned toward truth"],
    ["WYR", "Emotion", "awe, vastness felt, humbled attention before greatness", "feel awe, widen attention, or become humbled before greatness", "awe, humbled vastness", "awed, vastness-struck, humbled", "bears awe or awakens vast attention", "awe sign, vastness mark", "ceremonial awe or public dignity note", "attention kneeling without losing sight"],
    ["RGT", "Emotion", "regret, backward sorrow, wish joined to consequence", "regret, sorrow backward, or wish after consequence", "regret, backward sorrow", "regretful, consequence-sorrowed, backward-looking", "bears regret or names missed action", "regret word, missed path", "remorse note or corrective statement", "memory asking action to learn"],
    ["CSN", "Family", "cousin, side-kin, branch relation beyond sibling", "cousin, relate as side-kin, or keep branch kinship", "cousin, side-kin", "cousinly, side-kin, branch-related", "keeps cousin bonds or names side-kin", "cousin bond, branch relation", "kinship record or collateral relation", "family near enough to remember branch"],
    ["VNC", "Family", "aunt-uncle, elder side-kin, parental sibling care", "aunt or uncle, keep elder side-kin care, or guide as parental sibling", "aunt-uncle, elder side-kin", "avuncular, side-elder, kin-guiding", "keeps aunt-uncle care or guides side-kin", "aunt-uncle role, side-elder bond", "kinship record or guardian relation", "elder care beside the parent"],
    ["NPH", "Family", "niece-nephew, younger side-kin, sibling-child bond", "niece or nephew, receive younger side-kin, or care for sibling's child", "niece-nephew, younger side-kin", "niece-nephew, side-young, sibling-child", "keeps niece-nephew bonds or tends side-young", "niece-nephew bond, sibling-child relation", "kinship record or collateral descent", "the child of one's side-memory"],
    ["WDL", "Family", "widowhood, spouse-loss, household bond after death", "be widowed, carry spouse-loss, or keep bond after death", "widowhood, spouse-loss", "widowed, spouse-lost, bond-remembering", "bears widowhood or supports spouse-loss", "widowhood mark, lost-spouse bond", "survivor status or bereavement record", "love continuing after one voice leaves"],
    ["RPH", "Family", "orphanhood, parent-loss, child without origin shelter", "be orphaned, lose parent-shelter, or protect parentless child", "orphanhood, parent-loss", "orphaned, parentless, shelter-lacking", "bears orphanhood or shelters parentless children", "orphan status, lost-parent bond", "orphan care record or guardianship status", "a child whose roof must become communal"],
    ["SPC", "Family", "spouse, covenant partner, joined household person", "spouse, stand as partner, or keep household covenant", "spouse, covenant partner", "spousal, partnered, covenant-joined", "keeps spousehood or stands as partner", "spouse bond, partner role", "spousal status or marriage record", "the chosen other inside household duty"],
    ["GRN", "Family", "guardian, protective custodian, adult answerable for another", "guard as guardian, take custody, or answer for another's care", "guardian, protective custodian", "guardianship, protective, custody-bound", "keeps guardianship or protects another", "guardian role, custody bond", "guardianship record or care authority", "authority justified by protection"],
    ["NLW", "Family", "in-law, joined kin by marriage, household bridge relation", "join as in-law, bridge households, or keep marriage kinship", "in-law, joined kin", "in-law, joined, household-bridging", "keeps in-law bonds or bridges households", "in-law relation, marriage kin", "affinity record or marriage-kin status", "family made by chosen union"],
    ["SRN", "Family", "surname, family name, inherited public kin sign", "surname, carry family name, or mark inherited kin", "surname, family name", "surnamed, kin-named, inherited", "keeps surnames or records family name", "surname mark, family name", "name record or family registry", "a small word carrying many dead"],
    ["GPR", "Family", "godparent, vowed kin-guide, ritual guardian of a child", "godparent, vow kin-guidance, or guard a child ritually", "godparent, vowed kin-guide", "godparental, vowed, child-guiding", "keeps godparent duty or vows kin-guidance", "godparent bond, vowed guide", "sponsor record or ritual guardianship", "chosen kin standing before the future"],
    ["FST", "Ritual/poetry", "fast, chosen hunger, bodily restraint for attention", "fast, choose hunger, or restrain appetite for attention", "fast, chosen hunger", "fasting, restrained, hunger-chosen", "keeps fasts or guides bodily restraint", "fast day, chosen hunger", "fast observance or ritual discipline", "need made visible before witness"],
    ["VGL", "Ritual/poetry", "vigil, wakeful watch, night attention beside memory", "vigil, keep watch, or remain wakeful beside memory", "vigil, wakeful watch", "vigilant, wakeful, watch-kept", "keeps vigil or watches through night", "vigil watch, wakeful hour", "vigil record or memorial watch", "love refusing to sleep alone"],
    ["RLC", "Ritual/poetry", "relic, remaining sign, matter carrying memory", "relic, preserve remnant, or carry memory in matter", "relic, remaining sign", "relic-bearing, remnant, memory-mattered", "keeps relics or preserves remnants", "relic object, memory remnant", "relic record or heritage object", "matter refusing to forget"],
    ["PSH", "Ritual/poetry", "psalm, sacred song, voiced praise and lament", "psalm, sing sacredly, or voice praise and lament", "psalm, sacred song", "psalmic, sacred-sung, praise-lament", "keeps psalms or sings sacred song", "psalm line, sacred verse", "psalm record or liturgical text", "song addressed beyond the room"],
    ["SNY", "Ritual/poetry", "sanctuary, protected holy place, refuge before witness", "sanctuary, shelter solemnly, or protect holy place", "sanctuary, protected holy place", "sanctuary-bound, protected, holy", "keeps sanctuary or shelters solemnly", "sanctuary room, protected altar", "sanctuary record or protected site", "a place where fear lowers its weapon"],
    ["RDN", "Ritual/poetry", "ordination, appointed sacred office, solemnly placed duty", "ordain, appoint sacred office, or place duty solemnly", "ordination, appointed sacred office", "ordained, appointed, office-solemn", "ordains or receives sacred office", "ordination act, appointed office", "ordination record or sacred appointment", "a duty laid on the shoulders before witness"],
    ["NNT", "Ritual/poetry", "anointing, oil-marked blessing, consecrated touch", "anoint, mark with oil, or consecrate by touch", "anointing, oil-marked blessing", "anointed, oil-marked, consecrated", "anoints or keeps consecrated touch", "anointing oil, consecration mark", "anointing record or ritual blessing", "touch made solemn by promise"],
    ["BSL", "Ritual/poetry", "absolution, released fault, ritual word of restoration", "absolve, release fault, or speak restoration ritually", "absolution, released fault", "absolved, released, restored", "absolves or receives released fault", "absolution word, released fault", "absolution record or restorative rite", "release spoken after truth has stood"],
    ["RNW", "Future/civilization", "renewal, renaissance, old strength becoming new", "renew, revive culture, or make old strength new", "renewal, renaissance", "renewed, revived, made-new", "renews culture or restores old strength", "renewal act, renaissance sign", "renewal program or cultural restoration", "memory taking a new breath"],
    ["DCL", "Future/civilization", "decline, civil weakening, loss of ordered vitality", "decline, weaken civilly, or lose ordered vitality", "decline, civil weakening", "declining, weakened, vitality-losing", "tracks decline or resists civil weakening", "decline sign, lost vitality", "decline report or continuity risk", "when a people forgets how to stand"],
    ["RFM", "Future/civilization", "reform, corrected institution, renewal by principled change", "reform, correct institution, or renew by principle", "reform, principled correction", "reformed, corrected, principle-renewed", "reforms institutions or corrects practice", "reform measure, corrected rule", "reform act or institutional correction", "repair made public without despising inheritance"],
    ["MSN", "Future/civilization", "mission, sent purpose, shared work toward future claim", "mission, send purpose, or bind shared work to future claim", "mission, sent purpose", "missional, sent, purpose-bound", "keeps mission or sends shared work", "mission statement, sent charge", "mission charter or strategic purpose", "a future task carried by present hands"],
    ["FTR", "Future/civilization", "frontier, edge of settlement, unknown future boundary", "frontier, move to edge, or meet unknown boundary", "frontier, unknown boundary", "frontier, edge-bound, future-facing", "keeps frontiers or explores boundary", "frontier edge, settlement boundary", "frontier record or expansion standard", "the edge where courage must become wisdom"],
    ["STN", "Future/civilization", "standard, shared norm, durable measure for common life", "standardize, set norm, or hold shared measure", "standard, shared norm", "standardized, norm-bound, measure-held", "keeps standards or sets shared measure", "standard mark, norm text", "standard record or public specification", "a measure a people agrees to remember"],
    ["HML", "Future/civilization", "homeland, remembered land, place of people-origin", "homeland, root a people, or remember origin land", "homeland, remembered land", "homeland-bound, origin-rooted, remembered", "keeps homeland memory or roots peoplehood", "homeland place, origin land", "homeland record or heritage claim", "land carried inside the name of a people"],
    ["CNT", "Future/civilization", "continuity, unbroken carrying, identity through change", "continue, carry unbroken, or preserve identity through change", "continuity, unbroken carrying", "continuous, carried, identity-preserving", "keeps continuity or carries identity", "continuity thread, unbroken line", "continuity plan or succession standard", "change held by memory so it does not dissolve"]
  ];

  return seeds.map(([id, category, semanticField, action, concept, quality, agent, object, civic, intimate]) =>
    seedRoot(id, category, semanticField, action, concept, quality, agent, object, civic, intimate)
  );
}

function publicInstitutionRoots() {
  const seeds = [
    ["KNC", "Law/civic life", "contract, binding agreement, enforceable exchange of promises", "contract, bind agreement, or enter enforceable exchange", "contract, binding agreement", "contractual, bound, promise-exchanged", "keeps contracts or drafts agreements", "contract text, agreement clause", "contract record or enforceable agreement", "promises made clear enough to carry"],
    ["CLZ", "Law/civic life", "clause, bounded provision, sentence of law or contract", "clause, bound provision, or divide legal speech", "clause, bounded provision", "clausal, provision-bound, text-divided", "keeps clauses or drafts provisions", "clause text, provision line", "contract clause or statutory provision", "a small boundary inside a serious word"],
    ["XMD", "Law/civic life", "amendment, changed law, corrected public text", "amend, alter law, or correct public text", "amendment, changed law", "amended, altered, text-corrected", "amends law or keeps corrections", "amendment text, change article", "constitutional amendment or text revision", "memory willing to repair its own words"],
    ["RFD", "Law/civic life", "referendum, public question, direct civic decision", "referendum, put question to people, or decide directly", "referendum, public question", "referendal, people-asked, directly decided", "keeps referenda or frames public questions", "referendum ballot, public question", "referendum record or direct vote", "a people asked without hiding the burden"],
    ["DST", "Law/civic life", "district, governed area, local public division", "district, divide public area, or assign local scope", "district, governed area", "districted, local, area-bound", "keeps districts or draws local divisions", "district map, local area", "district boundary or electoral division", "place made answerable by name"],
    ["MYR", "Law/civic life", "mayor, municipal executive, city steward", "mayor, govern city, or steward municipal work", "mayor, city steward", "mayoral, municipal, city-governing", "serves as mayor or keeps municipal office", "mayor office, city executive", "mayoral order or municipal office record", "one face answerable for a city"],
    ["CNL", "Law/civic life", "council, deliberating public body, shared local judgment", "council, deliberate publicly, or govern by gathered judgment", "council, public deliberating body", "council-bound, deliberative, gathered", "keeps councils or deliberates publicly", "council seat, deliberation table", "council record or public meeting minutes", "many voices made responsible together"],
    ["CMN", "Law/civic life", "commission, assigned public body, entrusted investigation", "commission, assign public body, or investigate under mandate", "commission, assigned public body", "commissioned, assigned, mandate-gathered", "keeps commissions or receives public assignment", "commission report, assigned body", "commission charter or investigative record", "trust gathered for a specific question"],
    ["GNC", "Law/civic life", "agency, administrative organ, delegated public actor", "agency, administer by organ, or delegate public action", "agency, delegated public organ", "agency-bound, delegated, administrative", "keeps agencies or acts administratively", "agency office, delegated organ", "agency rule or administrative docket", "power made visible through a named servant"],
    ["ZNG", "Law/civic life", "zoning, land-use order, place-shaped permission", "zone, order land use, or assign place permissions", "zoning, land-use order", "zoned, land-ordered, use-bound", "keeps zoning or orders land use", "zoning map, use district", "zoning code or land-use permit", "shared place protected from careless appetite"],
    ["RGY", "Law/civic life", "registry, official list, public memory of standing", "register officially, list standing, or keep public memory", "registry, official list", "registered, listed, officially remembered", "keeps registries or records standing", "registry entry, official list", "registry record or public roll", "a name held where duty can find it"],
    ["TRB", "Law/civic life", "tribunal, formal hearing body, specialized judgment", "tribunal, hear formally, or judge by appointed body", "tribunal, formal hearing body", "tribunal-bound, appointed, formally heard", "keeps tribunals or hears specialized cases", "tribunal panel, hearing body", "tribunal record or appointed hearing", "judgment given a room and a limit"],
    ["JDG", "Law/civic life", "adjudication, dispute judgment, authoritative decision", "adjudicate, decide dispute, or settle claim by authority", "adjudication, dispute judgment", "adjudicated, decided, claim-settled", "adjudicates disputes or keeps decisions", "adjudication order, decided claim", "adjudication record or judgment order", "conflict brought to a responsible answer"],
    ["MTN", "Law/civic life", "motion, procedural request, formal step in public process", "move procedurally, file request, or advance formal step", "motion, procedural request", "motioned, procedural, request-filed", "files motions or keeps procedure", "motion paper, procedural step", "motion record or procedural filing", "a request walking under rule"],
    ["DPT", "Law/civic life", "deputy, delegated officer, second actor under authority", "deputize, serve delegated office, or act under authority", "deputy, delegated officer", "deputized, delegated, office-second", "serves as deputy or delegates office", "deputy office, delegated badge", "deputy appointment or authority record", "authority borrowed with an answer attached"],
    ["SRF", "Law/civic life", "sheriff, local peace officer, county enforcement steward", "sheriff, keep local peace, or enforce public order", "sheriff, local peace officer", "sheriff-bound, local, peace-keeping", "serves as sheriff or keeps local enforcement", "sheriff badge, peace office", "sheriff record or enforcement writ", "force made local and answerable"],
    ["PRL", "Law/civic life", "parole, conditional release, supervised return to civic life", "parole, release conditionally, or supervise return", "parole, conditional release", "paroled, conditional, supervised-returning", "keeps parole or supervises release", "parole term, release condition", "parole record or supervision order", "freedom returned with memory of harm"],
    ["PRS", "Law/civic life", "prison, lawful confinement, public custody after judgment", "imprison, confine lawfully, or hold after judgment", "prison, lawful confinement", "imprisoned, confined, judgment-held", "keeps prisons or guards custody", "prison cell, confinement place", "prison record or custody sentence", "confinement that must still remember personhood"],
    ["LBR", "Law/civic life", "labor, work, human effort joined to provision", "labor, work, or give effort toward provision", "labor, human work", "laboring, work-bound, effort-given", "labors or organizes work", "labor hour, work effort", "labor record or employment standard", "effort that must not be reduced to price"],
    ["CPT", "Law/civic life", "capital, invested stock, stored productive capacity", "capitalize, invest stock, or store productive capacity", "capital, productive stock", "capitalized, invested, capacity-stored", "keeps capital or invests stock", "capital account, invested stock", "capital record or investment standing", "stored power that must answer to use"],
    ["NTS", "Law/civic life", "interest, price of time, debt growth, attentive stake", "interest, accrue debt-time, or hold stake", "interest, debt-time price", "interest-bearing, accruing, stake-held", "keeps interest or holds stake", "interest charge, stake mark", "interest rate or finance disclosure", "time charging a debt to remember itself"],
    ["RVJ", "Law/civic life", "revenue, incoming public or business provision", "receive revenue, gather income, or count incoming provision", "revenue, incoming provision", "revenue-bearing, incoming, provision-counted", "keeps revenue or gathers income", "revenue line, incoming amount", "revenue report or income record", "provision arriving under an account"],
    ["PFT", "Law/civic life", "profit, surplus gain, remainder after cost", "profit, gain surplus, or record remainder after cost", "profit, surplus gain", "profitable, surplus, gain-bearing", "keeps profit or receives surplus", "profit line, surplus amount", "profit statement or surplus record", "gain that must remember its source"],
    ["SVG", "Law/civic life", "savings, stored provision, future reserve", "save provision, reserve value, or store against future need", "savings, future reserve", "saved, reserved, provision-stored", "keeps savings or builds reserve", "savings account, reserve store", "savings record or reserve account", "present restraint serving later need"],
    ["LWN", "Law/civic life", "loan, lent provision, return-bound trust", "loan, lend provision, or receive return-bound trust", "loan, lent provision", "loaned, lent, return-bound", "loans provision or receives debt trust", "loan note, lent amount", "loan agreement or repayment record", "help that expects an answer in time"],
    ["CRN", "Law/civic life", "currency, trusted medium, public token of exchange", "currency, circulate tokens, or mediate exchange", "currency, exchange medium", "current, tokened, exchange-bearing", "keeps currency or circulates tokens", "currency unit, exchange token", "currency record or monetary standard", "trust made portable"],
    ["XCG", "Law/civic life", "exchange, reciprocal transfer, trade between parties", "exchange, trade reciprocally, or transfer between parties", "exchange, reciprocal transfer", "exchanged, reciprocal, transfer-bound", "keeps exchanges or trades reciprocally", "exchange act, traded item", "exchange record or trade settlement", "giving and receiving made visible"],
    ["SPL", "Law/civic life", "supply, available provision, provided stock", "supply, provide stock, or make provision available", "supply, available provision", "supplied, available, stock-provided", "supplies goods or keeps provision", "supply stock, provided item", "supply record or provision standard", "readiness stored for need"],
    ["DMN", "Law/civic life", "demand, called-for need, market or civic claim", "demand, call for provision, or claim need", "demand, called-for need", "demanded, needed, claim-called", "keeps demand or calls need", "demand signal, need claim", "demand forecast or public claim", "need made loud enough to answer"],
    ["NVT", "Law/civic life", "investment, provision committed for future return", "invest, commit provision, or fund future return", "investment, committed provision", "invested, committed, future-funded", "invests provision or keeps commitments", "investment stake, committed fund", "investment record or capital commitment", "trust placed where future may answer"],
    ["MFG", "Law/civic life", "manufacturing, organized making, production at scale", "manufacture, produce at scale, or organize making", "manufacturing, scaled production", "manufactured, produced, scale-made", "manufactures goods or keeps production", "manufactured item, production run", "manufacturing record or production standard", "making multiplied under responsibility"],
    ["NVY", "Law/civic life", "inventory, counted stock, remembered goods", "inventory, count stock, or remember goods", "inventory, counted stock", "inventoried, counted, stock-remembered", "keeps inventory or counts goods", "inventory entry, stock item", "inventory record or stock ledger", "things remembered before they are needed"],
    ["NWR", "Technology", "network, linked system, many nodes in relation", "network, link systems, or route relation among nodes", "network, linked system", "networked, linked, node-related", "keeps networks or links systems", "network node, linked route", "network record or topology map", "many endpoints learning to answer together"],
    ["PKT", "Technology", "packet, bounded message unit, carried network fragment", "packetize, bound message, or carry network fragment", "packet, message unit", "packetized, bounded, fragment-carried", "keeps packets or segments messages", "packet frame, message fragment", "packet trace or network unit record", "a small message traveling with its address"],
    ["SCK", "Technology", "socket, connection endpoint, opened channel", "socket, open channel, or bind connection endpoint", "socket, connection endpoint", "socketed, connected, channel-open", "keeps sockets or opens channels", "socket handle, connection point", "socket record or connection endpoint", "where two systems agree to listen"],
    ["FRW", "Technology", "firewall, guarded boundary, filtered network threshold", "firewall, filter traffic, or guard network boundary", "firewall, filtered boundary", "firewalled, filtered, boundary-guarded", "keeps firewalls or filters traffic", "firewall rule, guarded threshold", "firewall policy or network security record", "a gate that asks traffic to justify itself"],
    ["DMY", "Technology", "domain, named internet realm, authority scope in network", "domain, name realm, or assign network scope", "domain, named network realm", "domain-bound, named, scope-held", "keeps domains or assigns network scope", "domain name, realm label", "domain registry or DNS record", "a public name where machines can find trust"],
    ["SCH", "Technology", "schema, structured shape, data contract", "schema, shape data, or declare structure", "schema, data shape", "schematic, structured, shape-declared", "keeps schemas or declares structure", "schema field, data shape", "schema record or data contract", "form declared before memory enters"],
    ["PLD", "Technology", "payload, carried content, message body", "payload, carry content, or send message body", "payload, carried content", "payload-bearing, carried, content-held", "keeps payloads or carries content", "payload body, carried data", "payload record or message body", "what a vessel actually carries"],
    ["RKS", "Technology", "request, directed system call, asked operation", "request, call operation, or ask a system", "request, system call", "requested, called, operation-asked", "keeps requests or calls operations", "request body, operation call", "request log or API call", "an asking made precise enough for a machine"],
    ["JWT", "Technology", "token, signed claim, portable access proof", "tokenize, sign claim, or carry access proof", "token, signed claim", "tokenized, signed, access-bearing", "keeps tokens or signs claims", "token string, access proof", "token record or signed credential", "permission made small enough to travel"],
    ["HSH", "Technology", "hash, fixed digest, integrity mark", "hash, digest data, or mark integrity", "hash, fixed digest", "hashed, digested, integrity-marked", "keeps hashes or checks integrity", "hash value, digest mark", "hash record or integrity checksum", "memory given a fingerprint"],
    ["PRX", "Technology", "proxy, intermediary service, delegated network face", "proxy, mediate requests, or stand as network intermediary", "proxy, intermediary service", "proxied, mediated, intermediary", "keeps proxies or mediates requests", "proxy endpoint, intermediary face", "proxy record or routing intermediary", "one system answering through another"],
    ["LNK", "Technology", "link, reference connection, traversable relation", "link, connect reference, or make traversable relation", "link, reference connection", "linked, referenced, traversable", "keeps links or connects references", "link target, reference edge", "link record or hyperlink relation", "a path hidden inside a word"],
    ["STK", "Technology", "stack, layered system, ordered technical pile", "stack, layer systems, or order technical support", "stack, layered system", "stacked, layered, support-ordered", "keeps stacks or layers systems", "stack frame, system layer", "stack trace or technology stack", "many layers holding one action"],
    ["MSG", "Technology", "message, sent data, communicative unit between systems", "message, send data, or pass communicative unit", "message, sent data", "messaged, sent, communication-bearing", "keeps messages or sends data", "message body, sent unit", "message queue record or transport event", "speech taught to cross systems"],
    ["PRC", "Technology", "process, running task, managed execution unit", "process, run task, or manage execution unit", "process, running task", "processed, running, task-bound", "keeps processes or manages execution", "process id, task instance", "process record or operating-system task", "an action given a remembered body"],
    ["RBT", "Technology", "robot, embodied automation, machine actor in the world", "robotize, automate bodily, or act as machine in world", "robot, embodied automation", "robotic, embodied, machine-acting", "keeps robots or automates bodies", "robot unit, machine body", "robot registry or automation safety record", "delegated power given hands"],
    ["SYB", "Mind", "syllabus, declared learning path, course promise", "syllabus, declare course, or order learning path", "syllabus, course promise", "syllabic, course-declared, learning-ordered", "keeps syllabi or declares courses", "syllabus page, course plan", "syllabus record or course notice", "a promise made to learners before work begins"],
    ["DGR", "Mind", "degree, certified learning, public mark of study", "degree, certify learning, or mark completed study", "degree, certified learning", "degreed, certified, study-marked", "grants degrees or keeps certification", "degree title, study certificate", "degree record or academic credential", "study remembered in public form"],
    ["DPM", "Mind", "diploma, graduation document, learned standing record", "diploma, document graduation, or certify learned standing", "diploma, graduation document", "diplomaed, graduated, standing-certified", "keeps diplomas or certifies graduation", "diploma sheet, graduation record", "diploma registry or graduation certificate", "a learner's passage made visible"],
    ["THS", "Mind", "thesis, argued claim, sustained scholarly proposition", "thesis, argue claim, or sustain proposition", "thesis, argued claim", "thesis-bound, argued, proposition-held", "writes theses or examines claims", "thesis statement, argued proposition", "thesis record or scholarly submission", "a claim accepting the burden of proof"],
    ["LCT", "Mind", "lecture, formal teaching speech, ordered instruction", "lecture, teach formally, or order instruction by speech", "lecture, formal teaching speech", "lectured, taught, instruction-ordered", "lectures or keeps teaching speech", "lecture note, teaching hour", "lecture record or class session", "knowledge spoken for prepared attention"],
    ["SMR", "Mind", "seminar, guided discussion, small circle of inquiry", "seminar, guide discussion, or gather inquiry circle", "seminar, guided inquiry circle", "seminar-bound, guided, discussion-shaped", "keeps seminars or guides discussion", "seminar table, inquiry session", "seminar record or discussion course", "learning close enough to answer back"],
    ["WRK", "Mind", "workshop, practical learning room, making-based instruction", "workshop, teach by making, or practice craft together", "workshop, practical learning room", "workshop-bound, practical, craft-taught", "keeps workshops or teaches by making", "workshop bench, practice session", "workshop record or practical training", "hands learning what speech began"],
    ["RBR", "Mind", "rubric, evaluation grid, declared criteria for judgment", "rubric, grid criteria, or declare evaluation measure", "rubric, evaluation grid", "rubric-bound, criterial, judgment-declared", "keeps rubrics or declares criteria", "rubric row, evaluation cell", "rubric record or grading standard", "judgment that tells learners its measure"],
    ["TTR", "Mind", "tutor, individual guide, close teaching helper", "tutor, guide individually, or help learning closely", "tutor, individual guide", "tutored, guided, learner-close", "tutors or receives individual guidance", "tutor session, close lesson", "tutoring record or learning support", "teaching near enough to notice confusion"],
    ["KYZ", "Mind", "quiz, small test, quick knowledge check", "quiz, test briefly, or check knowledge quickly", "quiz, small test", "quizzed, tested, quick-checked", "keeps quizzes or tests briefly", "quiz item, quick check", "quiz record or knowledge check", "a small judgment before larger failure"],
    ["PRJ", "Mind", "project, organized work, purposeful task body", "project, organize task, or carry purposeful work", "project, organized work", "projected, organized, task-bound", "keeps projects or organizes work", "project plan, task body", "project record or work plan", "purpose given a body in time"],
    ["HMK", "Mind", "homework, carried lesson, study returned to household", "homework, carry lesson home, or practice outside class", "homework, carried lesson", "homeworked, practiced, house-carried", "keeps homework or assigns practice", "homework task, carried exercise", "homework record or practice assignment", "school following the learner into ordinary time"],
    ["HSG", "Building/making", "housing, dwellings, shelter provision for persons", "house, provide shelter, or organize dwellings", "housing, shelter provision", "housed, sheltered, dwelling-provided", "keeps housing or provides shelter", "housing unit, dwelling stock", "housing record or shelter standard", "roof made into public duty"],
    ["DWL", "Building/making", "dwelling, lived shelter, personal place of rest", "dwell, live in shelter, or keep a resting place", "dwelling, lived shelter", "dwelling, lived-in, shelter-held", "dwells or keeps a home-place", "dwelling room, lived shelter", "dwelling permit or residence record", "a place where the self can lower its guard"],
    ["MSM", "Building/making", "museum, public memory house, curated heritage place", "museum, house memory, or curate heritage publicly", "museum, public memory house", "museum-bound, curated, heritage-held", "keeps museums or curates heritage", "museum gallery, heritage object", "museum record or collection register", "memory given walls and light"],
    ["PRK", "Building/making", "park, public green, shared rest place", "park, make public green, or protect shared rest", "park, public green", "parked, green, rest-shared", "keeps parks or tends public green", "park path, green place", "park record or public open-space plan", "rest made civic without becoming idle"],
    ["PLZ", "Building/making", "plaza, public square, open civic meeting place", "plaza, open square, or gather public meeting place", "plaza, public square", "plaza-bound, open, civic-gathered", "keeps plazas or opens public squares", "plaza stone, public square", "plaza plan or public-space record", "a city making room for faces"],
    ["HTL", "Building/making", "hotel, temporary lodging, hosted travel shelter", "hotel, lodge temporarily, or host travelers", "hotel, temporary lodging", "hoteled, lodged, traveler-hosted", "keeps hotels or hosts travelers", "hotel room, lodging place", "hotel license or lodging record", "strangers received under ordered hospitality"],
    ["RNT", "Building/making", "restaurant, public meal house, prepared hospitality", "restaurant, serve meals publicly, or host prepared food", "restaurant, public meal house", "restaurant-bound, meal-serving, hosted", "keeps restaurants or serves public meals", "restaurant table, public meal", "restaurant license or food-service record", "hunger welcomed without kinship proof"],
    ["HPL", "Building/making", "hospital, major healing house, organized acute care", "hospitalize, house acute care, or organize major healing", "hospital, major healing house", "hospital-bound, acute-care, healing-organized", "keeps hospitals or receives acute care", "hospital ward, care bed", "hospital record or care institution", "a city admitting bodily fragility"],
    ["CRH", "Building/making", "courthouse, judgment house, public place of law", "courthouse, house judgment, or gather law in place", "courthouse, judgment house", "courthouse-bound, legal, judgment-housed", "keeps courthouses or houses hearings", "courtroom, judgment hall", "courthouse record or judicial building", "law given a visible dwelling"],
    ["GDN", "Building/making", "garden, tended growth place, small cultivated nature", "garden, tend growth, or cultivate small living place", "garden, tended growth place", "gardened, cultivated, growth-tended", "keeps gardens or tends growth", "garden bed, cultivated plot", "garden plan or public horticulture record", "patience made green near the hand"],
    ["CRB", "Nature", "carbon, life-bearing element, stored organic matter", "carbonize, track carbon, or hold life-bearing matter", "carbon, life-bearing element", "carbonic, organic, element-bound", "keeps carbon accounts or studies carbon", "carbon mark, organic element", "carbon record or emissions inventory", "life's dark ledger in matter"],
    ["XGN", "Nature", "oxygen, breath element, life-sustaining air", "oxygenate, breathe element, or sustain life by air", "oxygen, breath element", "oxygenated, breath-bearing, air-sustained", "keeps oxygen or measures breath air", "oxygen level, breath element", "oxygen record or air-quality standard", "the invisible gift entering the body"],
    ["NRG", "Nature", "energy, work capacity, usable force in systems", "energize, store work capacity, or move usable force", "energy, work capacity", "energetic, force-bearing, work-capable", "keeps energy or measures work capacity", "energy unit, stored force", "energy record or utility measure", "power before it chooses a form"],
    ["SPY", "Nature", "species, kind of living beings, reproductive life class", "species, classify life, or name living kind", "species, living kind", "specific, life-classed, kind-bearing", "keeps species records or classifies life", "species name, living class", "species record or biodiversity listing", "a kind of life asking not to vanish"],
    ["EVL", "Nature", "evolution, inherited change, life adapting through descent", "evolve, change by descent, or adapt life through inheritance", "evolution, inherited change", "evolved, descended, adapting", "studies evolution or traces descent", "evolutionary branch, adapted trait", "evolution record or lineage model", "memory changing inside living bodies"],
    ["GNT", "Nature", "genetics, inherited trait study, family code of life", "geneticize, study inherited traits, or trace family code", "genetics, inherited trait study", "genetic, inherited, trait-coded", "studies genetics or keeps trait records", "genetic marker, inherited trait", "genetic record or inheritance analysis", "lineage written smaller than a name"],
    ["CRP", "Nature", "crop, cultivated yield, field food brought to harvest", "crop, cultivate yield, or gather field food", "crop, cultivated yield", "cropped, cultivated, harvest-bound", "keeps crops or cultivates yield", "crop row, field yield", "crop report or agricultural record", "earth answering patient labor"],
    ["YRG", "Nature", "irrigation, guided water, thirst-answering channel", "irrigate, guide water, or answer land thirst", "irrigation, guided water", "irrigated, watered, channel-guided", "keeps irrigation or guides water", "irrigation channel, watered field", "irrigation record or water-use permit", "water taught where need is"],
    ["SLR", "Nature", "solar light, sun power, day-source energy", "solarize, gather sun power, or mark day-source light", "solar light, sun power", "solar, sun-powered, day-lit", "keeps solar systems or gathers sun energy", "solar panel, sun mark", "solar record or renewable-energy standard", "daylight made useful without owning the sun"],
    ["WND", "Nature", "wind, moving air, invisible force across place", "wind, move air, or carry force invisibly", "wind, moving air", "windy, air-moving, invisible-force", "keeps wind records or measures air movement", "wind gust, air current", "wind report or turbine record", "the world touching without hands"],
    ["NWL", "Speech", "novel, long invented story, sustained narrative world", "novel, narrate long story, or sustain invented world", "novel, long story", "novelistic, narrated, world-sustained", "writes novels or keeps long narrative", "novel chapter, story world", "novel record or literary catalog", "a made world teaching the real one"],
    ["XSY", "Speech", "essay, attempted thought, exploratory prose argument", "essay, attempt thought, or explore claim in prose", "essay, exploratory argument", "essayistic, attempted, prose-shaped", "writes essays or tests claims", "essay paragraph, exploratory claim", "essay record or submitted argument", "thought walking before it hardens"],
    ["RKV", "Speech", "archive, preserved record body, kept public memory", "archive, preserve records, or keep public memory", "archive, preserved record body", "archival, preserved, memory-kept", "keeps archives or preserves records", "archive box, preserved file", "archive catalog or retention record", "memory protected from the hurry of use"],
    ["MNL", "Speech", "manual, practical guide, ordered instruction text", "manualize, guide practice, or write ordered instruction", "manual, practical guide", "manual, guided, instruction-ordered", "keeps manuals or writes guides", "manual page, instruction step", "manual record or operational guide", "help written before confusion arrives"],
    ["DSN", "Ritual/poetry", "design, intentional form, beauty joined to use", "design, shape intentionally, or join beauty to use", "design, intentional form", "designed, intentional, use-shaped", "designs forms or keeps design", "design sketch, intentional form", "design record or specification", "beauty made answerable to purpose"],
    ["YMG", "Ritual/poetry", "image, visual form, seen representation", "image, represent visually, or give visible form", "image, visual form", "imaged, visual, represented", "makes images or keeps visual form", "image frame, visual sign", "image record or visual asset", "sight carrying more than itself"],
    ["FLM", "Ritual/poetry", "film, moving image, recorded visual story", "film, record moving image, or tell by visual sequence", "film, moving image", "filmic, moving-image, recorded", "makes films or keeps moving images", "film frame, visual sequence", "film record or public screening", "time seen moving in memory"],
    ["MSC", "Ritual/poetry", "music, ordered sound, felt pattern in tone", "music, order sound, or make felt tone pattern", "music, ordered sound", "musical, tonal, pattern-heard", "makes music or keeps songcraft", "music phrase, tone pattern", "music record or performance license", "feeling given disciplined sound"],
    ["PHT", "Ritual/poetry", "photograph, light-captured image, remembered moment", "photograph, capture light, or record moment visually", "photograph, light-captured image", "photographic, light-captured, moment-held", "takes photographs or keeps images", "photograph print, captured moment", "photograph record or image evidence", "light refusing to let a moment vanish"],
    ["RMR", "Speech", "rumor, unverified report, wandering public claim", "rumor, spread unverified report, or carry wandering claim", "rumor, unverified report", "rumored, unverified, claim-wandering", "spreads rumors or checks unverified claims", "rumor trace, loose report", "rumor notice or misinformation review", "speech moving faster than responsibility"],
    ["HRT", "Body", "heart organ, blood pump, bodily center of pulse", "heart, pump blood, or keep pulse center", "heart organ, pulse center", "cardiac, heart-bound, pulse-centered", "keeps hearts or treats cardiac function", "heart chamber, pulse organ", "cardiac record or heart-care standard", "the bodily drum beneath the inner heart"],
    ["LNG", "Body", "lung, breath organ, air exchange chamber", "breathe by lung, oxygenate, or exchange air", "lung, breath organ", "pulmonary, breath-bound, air-exchanging", "keeps lungs or treats breathing", "lung lobe, breath chamber", "lung record or respiratory standard", "the body receiving world as breath"],
    ["BCT", "Body", "bacteria, small living agent, microbial life", "bacterialize, host microbes, or track bacterial life", "bacteria, microbial life", "bacterial, microbial, small-living", "studies bacteria or tracks microbes", "bacterial culture, microbe", "bacteria record or infection culture", "life small enough to harm or help unseen"],
    ["VRS", "Body", "virus, invasive code of sickness, replicating pathogen", "viralize, infect by virus, or track replicating pathogen", "virus, replicating pathogen", "viral, replicating, invasive", "studies viruses or tracks infection", "viral load, pathogen particle", "virus record or virology report", "a small invader using life to multiply"],
    ["HRM", "Body", "hormone, body signal, chemical messenger", "hormonize, signal chemically, or regulate body by messenger", "hormone, chemical messenger", "hormonal, signaled, body-regulating", "keeps hormone records or studies signals", "hormone level, chemical signal", "hormone record or endocrine measure", "the body speaking through hidden messengers"],
    ["GLN", "Body", "gland, secretion organ, body signal source", "gland, secrete, or release body signals", "gland, secretion organ", "glandular, secretory, signal-sourcing", "keeps glands or treats secretion organs", "gland tissue, secretion source", "gland record or endocrine finding", "a small hidden house of bodily speech"],
    ["NRB", "Body", "nerve, signal fiber, bodily message path", "nerve, signal bodily, or carry sensation", "nerve, signal fiber", "neural, signal-bearing, sensation-carrying", "keeps nerves or treats signal paths", "nerve fiber, sensation line", "nerve record or neurological finding", "the body sending news to itself"],
    ["PSY", "Mind", "psyche, inner pattern, mental life under care", "psychologize, attend mental life, or map inner pattern", "psyche, mental life", "psychic, mental, inner-patterned", "keeps psychological care or studies psyche", "psyche profile, inner pattern", "psychology record or mental-health note", "the inward life needing disciplined mercy"],
    ["BWL", "Body", "bowel, lower digestion, hidden passage of nourishment", "digest by bowel, move waste, or keep lower passage", "bowel, lower digestion", "bowel-bound, digestive, hidden-passage", "keeps bowel care or treats digestion", "bowel tract, lower passage", "bowel record or digestive finding", "hidden work that must not be shamed"],
    ["KDN", "Body", "kidney, blood filter, cleansing organ", "kidney, filter blood, or cleanse bodily fluid", "kidney, blood filter", "renal, filtering, cleansing", "keeps kidney care or treats filtering", "kidney tissue, blood filter", "kidney record or renal function", "the body quietly separating what must leave"]
  ];

  return seeds.map(([id, category, semanticField, action, concept, quality, agent, object, civic, intimate]) =>
    seedRoot(id, category, semanticField, action, concept, quality, agent, object, civic, intimate)
  );
}

function infrastructureScaleRoots() {
  const seeds = [
    ["PLT", "Law/civic life", "appeal, higher review, judgment re-opened under rule", "appeal, seek higher review, or reopen judgment under rule", "appeal, higher review", "appealed, review-bound, judgment-reopened", "appeals or reviews higher judgment", "appeal brief, review petition", "appellate filing or review order", "judgment given a second hearing without contempt"],
    ["LGT", "Law/civic life", "litigation, formal dispute process, argument under court rule", "litigate, argue formally, or carry dispute through court process", "litigation, formal dispute process", "litigated, court-bound, process-argued", "litigates or manages formal disputes", "litigation file, procedural dispute", "litigation record or court-process docket", "conflict taught to walk by rules"],
    ["KMP", "Law/civic life", "complaint, filed grievance, public claim of wrong", "complain formally, file grievance, or name wrong for judgment", "complaint, filed grievance", "complaint-bound, grieved, wrong-named", "files complaints or receives grievances", "complaint count, grievance text", "complaint filing or administrative grievance", "pain made public enough to answer"],
    ["FRD", "Law/civic life", "fraud, deceptive gain, false trust used for taking", "defraud, deceive for gain, or corrupt trust by falsehood", "fraud, deceptive gain", "fraudulent, deceptive, trust-corrupting", "defrauds or detects deception", "fraud scheme, false claim", "fraud charge or financial deception record", "trust stolen by a dressed lie"],
    ["BRB", "Law/civic life", "bribery, purchased judgment, payment bent against duty", "bribe, sell judgment, or bend office by payment", "bribery, purchased judgment", "bribed, corruptly paid, judgment-bent", "bribes or resists purchased judgment", "bribe payment, corrupt inducement", "bribery charge or ethics disclosure", "price trying to sit where duty belongs"],
    ["NGC", "Law/civic life", "negligence, careless failure, duty omitted by inattention", "neglect duty, fail by carelessness, or omit required care", "negligence, careless failure", "negligent, careless, duty-omitting", "neglects duty or judges carelessness", "negligent act, omitted care", "negligence claim or duty-of-care finding", "harm born from what was not noticed"],
    ["TWT", "Law/civic life", "tort, civil wrong, private harm made legally answerable", "commit tort, civilly wrong, or make private harm answerable", "tort, civil wrong", "tortious, civilly wrongful, harm-answerable", "brings tort claims or judges civil wrongs", "tort claim, civil injury", "tort filing or civil liability record", "private harm brought into public measure"],
    ["PLN", "Law/civic life", "plaintiff, claimant in court, harmed party seeking judgment", "stand as plaintiff, bring claim, or seek judgment for harm", "plaintiff, court claimant", "plaintiff-bound, claiming, judgment-seeking", "brings claims as plaintiff", "plaintiff name, claimant role", "plaintiff record or party designation", "the wounded speaker entering rule"],
    ["DFN", "Law/civic life", "defendant, answering party, accused or claimed-against person", "defend against claim, answer accusation, or stand as defendant", "defendant, answering party", "defendant-bound, accused, answer-summoned", "defends claims or answers accusation", "defendant name, answer role", "defendant record or party designation", "one summoned to answer without being erased"],
    ["VCN", "Law/civic life", "eviction, lawful removal from dwelling, housing possession conflict", "evict, remove from dwelling, or contest housing possession", "eviction, dwelling removal", "evicted, removal-bound, possession-contested", "evicts or defends housing possession", "eviction notice, removal order", "eviction filing or housing court record", "a roof taken only under answerable rule"],
    ["MRG", "Law/civic life", "mortgage, land-secured loan, dwelling debt covenant", "mortgage, secure debt by dwelling, or finance land under pledge", "mortgage, land-secured loan", "mortgaged, pledged, dwelling-secured", "keeps mortgages or lends against dwellings", "mortgage note, secured dwelling debt", "mortgage record or land-secured filing", "home and debt forced to remember each other"],
    ["BND", "Law/civic life", "bond, pledged guarantee, surety promise under risk", "bond, guarantee, or pledge surety under risk", "bond, pledged guarantee", "bonded, guaranteed, surety-bound", "keeps bonds or pledges guarantee", "bond instrument, surety pledge", "bond filing or public debt instrument", "trust given a numbered promise"],
    ["LGR", "Law/civic life", "ledger, ordered account book, remembered exchange column", "ledger, account, or enter exchange in ordered columns", "ledger, account book", "ledgered, accounted, column-kept", "keeps ledgers or audits accounts", "ledger line, account column", "ledger record or official account", "exchange remembered so provision can answer"],
    ["FND", "Law/civic life", "fund, pooled provision, dedicated resource body", "fund, pool provision, or dedicate resources to purpose", "fund, pooled provision", "funded, pooled, purpose-dedicated", "funds purposes or stewards pooled provision", "fund account, pooled resource", "fund charter or dedicated account", "many small provisions becoming one duty"],
    ["SHN", "Law/civic life", "shareholder, equity holder, one with stake in corporate gain", "hold shares, claim equity, or bear stake in corporate provision", "shareholder, equity holder", "shareholding, equity-bound, stake-bearing", "holds shares or represents equity stake", "share certificate, equity stake", "shareholder register or ownership notice", "gain-bearing power that must still answer"],
    ["CRR", "Law/civic life", "corporation, chartered legal body, collective person for enterprise", "incorporate, charter enterprise, or act as legal body", "corporation, chartered legal body", "corporate, chartered, enterprise-bodied", "incorporates or governs legal enterprise bodies", "corporate charter, legal entity", "corporation registry or charter record", "a made person that must not forget real persons"],
    ["NPF", "Law/civic life", "nonprofit, mission body, provision held without private surplus claim", "form nonprofit, hold mission property, or serve without surplus claim", "nonprofit, mission body", "nonprofit, mission-bound, surplus-restrained", "keeps nonprofit missions or governs charities", "nonprofit charter, mission fund", "nonprofit filing or exempt-entity record", "provision disciplined by purpose instead of appetite"],
    ["SBY", "Law/civic life", "subsidy, public support, provision added to sustain chosen good", "subsidize, support publicly, or add provision by policy", "subsidy, public support", "subsidized, supported, policy-funded", "grants subsidies or receives public support", "subsidy payment, support line", "subsidy record or public support program", "shared provision choosing what should survive"],
    ["BNS", "Law/civic life", "business, organized exchange work, enterprise seeking provision", "do business, organize exchange work, or run enterprise", "business, organized enterprise", "businesslike, enterprise-bound, exchange-organized", "keeps businesses or organizes enterprise", "business unit, enterprise activity", "business license or enterprise registry", "work arranged to meet need through exchange"],
    ["SRV", "Law/civic life", "service, useful work offered to another, provision by action", "serve, provide useful work, or answer need by action", "service, useful offered work", "service-bound, useful, need-answering", "serves others or manages service work", "service act, service order", "service contract or public service record", "work becoming care in another's direction"],
    ["PRD", "Law/civic life", "product, made good, provision object offered for use", "produce goods, make product, or offer made provision", "product, made good", "produced, product-bound, use-offered", "produces goods or manages products", "product unit, made good", "product record or safety listing", "making that must answer to use"],
    ["RTL", "Law/civic life", "retail, direct sale, provision offered to final user", "retail, sell directly, or offer goods to final users", "retail, direct sale", "retailed, user-facing, directly sold", "retails goods or keeps shops", "retail item, shop sale", "retail license or consumer sale record", "exchange close enough to see the buyer"],
    ["WSL", "Law/civic life", "wholesale, bulk exchange, provision moved between suppliers", "wholesale, trade in bulk, or move provision between suppliers", "wholesale, bulk exchange", "wholesale, bulk-traded, supplier-bound", "keeps wholesale trade or supplies retailers", "wholesale lot, bulk order", "wholesale invoice or supply contract", "many goods moved before they become personal"],
    ["CLD", "Technology", "cloud, remote compute field, rented machine presence beyond local sight", "cloud, host remotely, or move compute beyond local machine", "cloud, remote compute field", "cloud-based, remote-hosted, elastic", "keeps cloud systems or hosts remotely", "cloud service, remote compute zone", "cloud account or hosting record", "a machine house seen only through trust"],
    ["DPY", "Technology", "deployment, release into use, code sent to a living system", "deploy, release code, or send system change into use", "deployment, released system change", "deployed, released, use-entering", "deploys systems or manages releases", "deployment event, release unit", "deployment log or release record", "a change crossing from workshop to consequence"],
    ["CNF", "Technology", "configuration, set operating choice, system shaped by declared settings", "configure, set options, or shape operation by declared settings", "configuration, declared settings", "configured, setting-bound, operation-shaped", "configures systems or keeps settings", "config file, setting value", "configuration record or system setting", "choice made durable inside a tool"],
    ["BLT", "Technology", "build artifact, compiled made-object, system form produced from source", "build, compile artifact, or produce runnable form from source", "build artifact, produced system form", "built, compiled, artifact-bearing", "builds artifacts or manages build systems", "build output, compiled artifact", "build record or artifact manifest", "making that leaves evidence before running"],
    ["RND", "Technology", "rendering, visible output, computed form shown to a person", "render, draw output, or make computed form visible", "rendering, visible output", "rendered, visible-computed, output-shaped", "renders output or keeps display pipelines", "render frame, output surface", "render log or visual output record", "computation becoming visible enough to judge"],
    ["LWG", "Technology", "logging, event record stream, machine memory of what happened", "log events, record operations, or keep machine memory", "logging, event record stream", "logged, event-kept, operation-remembered", "logs events or maintains observability records", "log line, event stream", "logging policy or operational record", "machines taught to remember their acts"],
    ["TRC", "Technology", "trace, path evidence, followed operation across systems", "trace, follow execution, or record path evidence", "trace, path evidence", "traced, path-recorded, operation-followed", "traces operations or reads path evidence", "trace id, execution path", "trace record or distributed span", "an action leaving footprints through machines"],
    ["DMP", "Technology", "dump, diagnostic snapshot, raw state exposed for repair", "dump state, snapshot memory, or expose raw diagnostics", "dump, diagnostic snapshot", "dumped, diagnostic, state-exposed", "dumps state or inspects diagnostics", "memory dump, state snapshot", "dump file or diagnostic record", "hidden state laid bare so repair can begin"],
    ["FLG", "Technology", "flag, switchable feature marker, conditional system choice", "flag, mark feature state, or switch behavior conditionally", "flag, feature marker", "flagged, switchable, condition-marked", "keeps flags or controls feature states", "feature flag, state marker", "flag registry or rollout control", "a small sign deciding how power behaves"],
    ["PLG", "Technology", "plugin, added capability, extension joined to a host system", "plug in, extend host, or add capability by module", "plugin, added capability", "pluggable, host-joined, extension-bearing", "writes plugins or manages extensions", "plugin module, extension hook", "plugin manifest or extension record", "a guest tool entering a larger house"],
    ["MDL", "Technology", "module, bounded code part, replaceable unit of function", "modularize, bound code, or divide system into units", "module, bounded code part", "modular, unit-bound, replaceable", "keeps modules or divides code by function", "module file, code unit", "module manifest or package unit", "a small room in the house of code"],
    ["PKG", "Technology", "package, versioned bundle, distributed unit of software", "package, bundle code, or distribute versioned units", "package, versioned bundle", "packaged, bundled, distributable", "packages software or manages bundles", "package archive, versioned bundle", "package registry or dependency record", "a wrapped promise of working code"],
    ["DPN", "Technology", "dependency, needed external support, borrowed code relation", "depend, require support, or bind software to external provision", "dependency, required support", "dependent, required, support-bound", "keeps dependencies or audits required support", "dependency edge, required package", "dependency graph or software bill of materials", "help that becomes risk when forgotten"],
    ["VNR", "Technology", "environment, surrounding runtime conditions, system world of execution", "environmentalize, set runtime conditions, or shape execution world", "environment, runtime conditions", "environmental, runtime-bound, context-shaped", "keeps environments or controls runtime conditions", "environment variable, runtime context", "environment record or deployment context", "the world a system believes it inhabits"],
    ["SCR", "Technology", "script, executable written sequence, small commanded program", "script, write executable sequence, or automate ordered commands", "script, executable sequence", "scripted, command-written, automation-ready", "writes scripts or runs command sequences", "script file, command sequence", "script record or automation task", "speech sharpened until a machine obeys"],
    ["TPT", "Technology", "template, reusable form, shaped blank awaiting content", "template, reuse form, or shape a blank for later filling", "template, reusable form", "templated, reusable, blank-shaped", "keeps templates or fills reusable forms", "template file, reusable slot", "template library or form record", "a prepared shape that asks for truth"],
    ["NDX", "Technology", "index, lookup structure, ordered path into stored memory", "index, build lookup, or order memory for search", "index, lookup structure", "indexed, lookup-ordered, search-ready", "indexes data or keeps lookup structures", "index entry, lookup key", "index record or search catalog", "memory given handles so attention can find it"],
    ["SRH", "Technology", "search, query through memory, directed finding among records", "search, query memory, or find records by sign", "search, directed finding", "searched, query-bound, memory-seeking", "searches records or builds search systems", "search query, result list", "search log or retrieval index", "attention moving through stored memory"],
    ["RDR", "Technology", "reader, input interpreter, system that receives encoded form", "read input, interpret encoded form, or receive data through an interface", "reader, input interpreter", "reader-bound, input-receiving, interpreted", "reads input or maintains reader systems", "reader device, input parser", "reader record or ingest interface", "a tool that receives before it answers"],
    ["WRT", "Technology", "writer, output producer, system that commits encoded form", "write output, commit encoded form, or produce persistent data", "writer, output producer", "writer-bound, output-committing, persistent", "writes output or maintains writer systems", "writer process, output sink", "writer log or persistence interface", "a tool that leaves memory behind"],
    ["VLD", "Technology", "validation, rule check, declared form tested before trust", "validate, check rules, or test declared form before acceptance", "validation, rule check", "validated, rule-checked, acceptance-tested", "validates inputs or keeps rule checks", "validation error, check result", "validation report or schema conformance record", "trust paused until form answers"],
    ["TST", "Technology", "test, controlled check, expected behavior put under witness", "test, check behavior, or place system under controlled witness", "test, controlled check", "tested, checked, witness-controlled", "tests systems or maintains test suites", "test case, expected result", "test report or quality gate", "truth rehearsed before consequence"],
    ["VKR", "Mind", "vector, directed quantity, magnitude with orientation", "vectorize, represent direction, or carry magnitude with orientation", "vector, directed quantity", "vectorial, directed, magnitude-bearing", "works with vectors or maps directed quantities", "vector value, direction mark", "vector record or mathematical object", "quantity taught to point somewhere"],
    ["SCL", "Mind", "scalar, magnitude alone, quantity without direction", "scale, measure magnitude, or treat quantity without direction", "scalar, undirected magnitude", "scalar, magnitude-only, scale-bound", "works with scalars or measures magnitude", "scalar value, scale number", "scalar record or mathematical object", "amount confessed before direction is added"],
    ["TNS", "Mind", "tensor, structured quantity, relation across many directions", "tensorize, arrange relations, or measure multi-directional structure", "tensor, structured quantity", "tensorial, multi-directional, relation-arranged", "works with tensors or keeps structured quantities", "tensor field, multi-index value", "tensor record or model parameter", "relations dense enough to need discipline"],
    ["GPH", "Mind", "graph, nodes and edges, relation made countable", "graph, connect nodes, or represent relations by edges", "graph, node-edge relation", "graphed, connected, relation-counted", "graphs relations or analyzes networks", "graph node, edge set", "graph record or network model", "relationship drawn so structure can answer"],
    ["NRM", "Mind", "norm, standard measure, expected form or magnitude", "norm, standardize, or measure deviation from expected form", "norm, standard measure", "normal, standardized, expectation-bound", "keeps norms or measures deviation", "norm value, standard form", "norm record or compliance standard", "expectation made visible enough to challenge"],
    ["LYM", "Mind", "limit, approached boundary, value neared by disciplined sequence", "limit, approach boundary, or reason by nearing value", "limit, approached boundary", "limiting, boundary-nearing, sequence-bound", "works with limits or studies convergence", "limit value, boundary approach", "limit record or analytic result", "the edge understood by patient approach"],
    ["PRV", "Mind", "proof, demonstrated truth, claim forced to answer by reason", "prove, demonstrate, or make claim answerable by reason", "proof, demonstrated truth", "proved, demonstrated, reason-bound", "proves claims or checks demonstrations", "proof step, demonstrated claim", "proof record or formal demonstration", "truth made walkable step by step"],
    ["DGT", "Mind", "digit, written number sign, small count mark", "digitize, mark number, or encode count as signs", "digit, number sign", "digital, digit-marked, count-encoded", "digitizes records or handles number signs", "digit glyph, numeric character", "digit record or numeric encoding", "count given a small visible body"],
    ["SMP", "Mind", "sample, selected part, partial evidence drawn from a whole", "sample, select part, or infer from partial evidence", "sample, selected part", "sampled, selected, partial-evident", "samples populations or keeps specimens", "sample unit, selected case", "sample record or specimen log", "a small part asked to speak for more"],
    ["DSL", "Mind", "distribution, spread of values, pattern across many cases", "distribute, model spread, or describe values across cases", "distribution, value spread", "distributed, spread-patterned, case-wide", "models distributions or tracks value spread", "distribution curve, spread pattern", "distribution record or statistical model", "many differences shaped into visible form"],
    ["MTM", "Mind", "mathematics, formal quantity discipline, number-relation knowledge", "mathematize, reason formally, or study quantity relations", "mathematics, formal quantity discipline", "mathematical, formal, relation-numbered", "does mathematics or teaches formal quantity", "mathematical statement, formal relation", "mathematics record or curriculum standard", "reason purified until quantity must answer"],
    ["KLK", "Mind", "calculus, disciplined change measure, limit-based mathematics", "calculate change, use calculus, or reason by limits and accumulation", "calculus, change measure", "calculus-bound, limit-shaped, change-measured", "calculates with calculus or teaches change measure", "calculus expression, change relation", "calculus record or analytic method", "change made exact without denying motion"],
    ["FRC", "Mind", "fraction, divided whole, part-to-whole number relation", "fraction, divide whole, or name part-to-whole relation", "fraction, divided whole", "fractional, divided, part-whole", "works with fractions or teaches division of wholes", "fraction mark, divided amount", "fraction record or proportional notation", "a whole remembered inside its part"],
    ["SRY", "Mind", "series, ordered sum, sequence accumulated toward pattern", "series, order terms, or sum sequence toward pattern", "series, ordered sum", "serial, ordered, accumulation-bound", "works with series or studies ordered sums", "series term, summed sequence", "series record or analytic expression", "many moments asking whether they become one"],
    ["RTY", "Mind", "ratio, proportional relation, one quantity answering another", "ratio, compare proportion, or relate quantities by measure", "ratio, proportional relation", "ratioed, proportional, measure-related", "keeps ratios or compares proportions", "ratio value, proportional mark", "ratio record or measurement relation", "one amount learning its meaning from another"],
    ["LJB", "Mind", "algebra, symbolic relation discipline, unknowns handled by rule", "algebraize, manipulate symbols, or solve unknown relations", "algebra, symbolic relation discipline", "algebraic, symbolic, relation-ruled", "does algebra or teaches symbolic relation", "algebra expression, unknown variable", "algebra record or formal equation", "the unknown invited into law"],
    ["GMR", "Mind", "geometry, shape measure, spatial relation discipline", "geometrize, measure shape, or reason by spatial relation", "geometry, shape measure", "geometric, spatial, shape-measured", "does geometry or maps spatial relations", "geometric figure, spatial proof", "geometry record or design measurement", "space taught to give reasons"],
    ["DMS", "Mind", "dimension, measurable extent, axis of description", "dimension, extend measure, or name an axis of description", "dimension, measurable extent", "dimensional, extended, axis-bound", "measures dimensions or names axes", "dimension value, axis mark", "dimension record or spatial parameter", "extent made speakable"],
    ["KLC", "Body", "clinic, local healing office, first-place care", "clinic, treat locally, or organize first-place care", "clinic, local healing office", "clinical, local-care, first-treatment", "keeps clinics or offers first-place care", "clinic room, care office", "clinic record or outpatient visit", "healing near enough to enter ordinary life"],
    ["NRC", "Body", "nursing, bedside care, skilled bodily attending", "nurse, attend bedside, or sustain healing by skilled care", "nursing, bedside care", "nursing, care-skilled, bedside-attentive", "nurses patients or coordinates bedside care", "nursing note, care round", "nursing record or care assignment", "attention given a disciplined hand"],
    ["MBC", "Body", "ambulance, emergency transport, moving care under urgency", "ambulance, transport urgently, or bring care while moving", "ambulance, emergency transport", "ambulance-bound, urgent-moving, care-carrying", "drives ambulances or keeps emergency transport", "ambulance unit, emergency ride", "ambulance dispatch or emergency transport record", "care arriving before the room is ready"],
    ["RSP", "Body", "respiration, breath exchange, air entering and leaving life", "respire, exchange breath, or support air movement in the body", "respiration, breath exchange", "respiratory, breath-exchanging, air-bound", "supports respiration or measures breathing", "respiration rate, breath exchange", "respiratory record or ventilation note", "life opening and closing to the world"],
    ["BPR", "Body", "blood pressure, vessel force, living circulation under measure", "measure blood pressure, pressurize vessels, or track circulation force", "blood pressure, vessel force", "blood-pressure, vessel-pressed, circulation-measured", "keeps blood pressure readings or treats pressure", "pressure cuff reading, vessel force", "blood-pressure record or hypertension note", "force inside the body counted before it harms"],
    ["DNT", "Body", "dentistry, tooth care, mouth-bone repair discipline", "practice dentistry, care for teeth, or repair mouth bones", "dentistry, tooth care", "dental, tooth-caring, mouth-repairing", "keeps dentistry or treats teeth", "dental chart, tooth repair", "dental record or oral-care plan", "small pain met before it governs speech"],
    ["KNR", "Body", "cancer, uncontrolled growth, body order broken by multiplying life", "cancer, grow uncontrolled, or treat malignant disorder", "cancer, uncontrolled growth", "cancerous, malignant, order-breaking", "treats cancer or tracks malignant growth", "tumor finding, cancer cell", "oncology record or cancer diagnosis", "life's power forgetting its limit"],
    ["SKL", "Body", "skeleton, bone frame, hidden bodily architecture", "skeletonize, frame by bone, or support body structure", "skeleton, bone frame", "skeletal, bone-framed, structure-hidden", "keeps skeletal care or studies bone frames", "skeleton joint, bone frame", "skeletal record or orthopedic image", "the quiet architecture that lets flesh stand"],
    ["FCT", "Body", "fracture, broken bone, structural bodily rupture", "fracture, break bone, or repair structural bodily rupture", "fracture, broken bone", "fractured, bone-broken, structure-ruptured", "treats fractures or records bone breaks", "fracture line, broken bone", "fracture record or orthopedic finding", "hardness confessing it can break"],
    ["RHB", "Body", "rehabilitation, restored function, disciplined return after injury", "rehabilitate, restore function, or train return after injury", "rehabilitation, restored function", "rehabilitative, function-restoring, return-trained", "rehabilitates patients or guides functional return", "rehab plan, restored motion", "rehabilitation record or therapy course", "repair practiced until ability returns"],
    ["SLV", "Body", "saliva, mouth moisture, first fluid of digestion and speech", "salivate, moisten mouth, or begin digestion by mouth fluid", "saliva, mouth moisture", "salivary, mouth-moist, digestion-beginning", "studies saliva or treats salivary function", "saliva sample, mouth fluid", "saliva record or oral diagnostic sample", "the body preparing speech and food together"],
    ["LVR", "Body", "liver, cleansing organ, chemical steward of blood and food", "liver, metabolize, or cleanse blood by hidden chemistry", "liver, chemical steward", "hepatic, cleansing, metabolism-bound", "keeps liver care or studies metabolism", "liver panel, hepatic tissue", "liver record or metabolic finding", "hidden labor separating nourishment from harm"],
    ["BDR", "Body", "bladder, stored urine, bodily vessel of release timing", "bladder, store urine, or govern bodily release timing", "bladder, urine vessel", "bladder-bound, urinary, release-timed", "keeps bladder care or treats urinary storage", "bladder scan, urine vessel", "bladder record or urology note", "the body waiting for a fitting moment"],
    ["PRZ", "Body", "parasite, taking life-form, organism living from another's body", "parasitize, take from host, or track dependent harmful life", "parasite, taking life-form", "parasitic, host-dependent, taking", "studies parasites or treats infestation", "parasite organism, host burden", "parasite record or infection finding", "need corrupted into taking without answer"],
    ["GDR", "Building/making", "grid, distributed infrastructure mesh, ordered service network", "grid, connect infrastructure, or organize service mesh", "grid, infrastructure mesh", "gridded, mesh-bound, service-ordered", "keeps grids or plans infrastructure meshes", "grid node, service mesh", "grid map or utility network record", "many supports arranged so ordinary life can trust them"],
    ["SWG", "Building/making", "sewer, waste-water channel, hidden sanitation passage", "sewer, channel waste-water, or maintain sanitation passage", "sewer, sanitation channel", "sewered, waste-channelled, sanitation-hidden", "keeps sewers or repairs sanitation channels", "sewer line, waste-water channel", "sewer record or sanitation permit", "the hidden path that keeps public life clean"],
    ["DMM", "Building/making", "dam, held water wall, restrained force for future use", "dam, hold water, or restrain flow for stored purpose", "dam, held water wall", "dammed, water-held, force-restrained", "keeps dams or manages stored water", "dam wall, reservoir gate", "dam safety record or water-control permit", "force stopped so later need may drink"],
    ["RLY", "Building/making", "railway, guided track system, heavy path of public movement", "rail, guide transit, or move by track system", "railway, guided track system", "railed, track-guided, transit-bound", "keeps railways or runs track transit", "rail line, track segment", "railway record or transit authority filing", "a path made strong enough for many bodies"],
    ["BSN", "Nature", "basin, gathered water hollow, land shaped to receive flow", "basin, gather water, or shape land to receive flow", "basin, water hollow", "basined, gathered, flow-receiving", "maps basins or manages watershed hollows", "river basin, receiving hollow", "basin survey or watershed record", "land opening itself to what descends"],
    ["RSR", "Building/making", "reservoir, stored water body, public reserve of flow", "reservoir, store water, or hold flow for future provision", "reservoir, stored water body", "reserved, water-stored, provision-held", "keeps reservoirs or manages stored water", "reservoir level, stored water", "reservoir record or public water reserve", "water remembered for thirst not yet arrived"],
    ["PPL", "Building/making", "pipeline, carried-flow conduit, hidden provision route", "pipeline, conduct flow, or carry provision through sealed route", "pipeline, flow conduit", "pipelined, conduit-bound, provision-carried", "keeps pipelines or conducts resources", "pipeline segment, sealed conduit", "pipeline permit or utility route record", "a road for what cannot walk"],
    ["TRN", "Building/making", "transit, organized public movement, shared passage system", "transit, move publicly, or organize shared passage", "transit, public movement", "transit-bound, shared-moving, passage-organized", "keeps transit or plans public movement", "transit route, shared ride", "transit schedule or public mobility record", "movement made common without losing persons"],
    ["WST", "Nature", "waste, discarded remainder, provision after use needing judgment", "waste, discard remainder, or handle used provision responsibly", "waste, discarded remainder", "wasted, discarded, remainder-bound", "manages waste or studies discarded provision", "waste stream, discarded material", "waste record or disposal permit", "what remains still asking for duty"],
    ["RCY", "Nature", "recycling, returned material, waste re-entering use", "recycle, return material, or restore waste to use", "recycling, returned material", "recycled, returned, reuse-bound", "recycles material or manages reuse streams", "recycling bin, returned material", "recycling record or reuse standard", "discarded matter invited back into service"],
    ["PLL", "Nature", "pollution, corrupted environment, waste where life must breathe", "pollute, corrupt environment, or introduce harmful waste", "pollution, corrupted environment", "polluted, corrupted, waste-burdened", "pollutes or measures environmental harm", "pollution plume, contaminated place", "pollution report or environmental violation", "carelessness entering the shared breath-world"],
    ["MNG", "Nature", "mining, extracted earth, hidden material brought by force", "mine, extract earth, or bring hidden material into use", "mining, earth extraction", "mined, extracted, earth-opened", "mines resources or regulates extraction", "mine shaft, extracted ore", "mining permit or mineral extraction record", "taking from depth under the gaze of consequence"],
    ["PNT", "Ritual/poetry", "painting, colored surface image, sight shaped by hand", "paint, color surface, or make image by pigment", "painting, colored image", "painted, colored, surface-shaped", "paints images or keeps painted works", "painting panel, color layer", "painting record or collection entry", "color held still so attention can return"],
    ["DRW", "Ritual/poetry", "drawing, line image, form traced before color or mass", "draw, trace line, or shape image by mark", "drawing, line image", "drawn, line-marked, form-traced", "draws forms or keeps sketches", "drawing line, sketch sheet", "drawing record or design sketch", "the first visible path of a thought"],
    ["SCT", "Ritual/poetry", "sculpture, shaped volume, matter given visible dignity", "sculpt, shape volume, or give matter visible form", "sculpture, shaped volume", "sculpted, volumetric, matter-shaped", "sculpts forms or keeps sculpture", "sculpture body, carved form", "sculpture record or public art registry", "matter taught to stand as meaning"],
    ["TYP", "Speech", "typography, visible letter form, speech arranged for the eye", "typeset, shape letters, or arrange written speech visibly", "typography, letter form", "typographic, letter-shaped, eye-arranged", "sets type or designs letter forms", "typeface line, letter form", "typography standard or publication style", "speech given a face on the page"],
    ["FNT", "Speech", "font, reusable letter body, chosen voice of writing", "font, choose type body, or give writing a visible voice", "font, letter body", "fonted, type-bodied, writing-voiced", "designs fonts or selects type bodies", "font file, letter glyph", "font license or type asset record", "the sound of writing before it is read"],
    ["DTD", "Speech", "editing, revision craft, text corrected before public memory", "edit, revise text, or correct speech before release", "editing, revision craft", "edited, revised, correction-shaped", "edits texts or keeps revision standards", "edited draft, revision mark", "editorial record or publication revision", "speech accepting repair before it binds"],
    ["PBC", "Speech", "publication, released text, speech entered into public memory", "publish, release text, or enter speech into public memory", "publication, released text", "published, released, public-memory-bound", "publishes works or manages releases", "publication issue, released work", "publication record or public notice", "private thought stepping into answerable light"],
    ["KMR", "Ritual/poetry", "camera, image-capturing instrument, framed witness of light", "camera, frame light, or capture image through instrument", "camera, image-capturing instrument", "camera-bound, framed, light-capturing", "uses cameras or keeps image instruments", "camera lens, image device", "camera record or visual evidence device", "attention given a mechanical eye"],
    ["GLL", "Ritual/poetry", "gallery, image room, public place for visual attention", "gallery, display images, or gather visual works for attention", "gallery, image room", "gallery-bound, displayed, attention-gathered", "keeps galleries or curates visual works", "gallery wall, displayed work", "gallery record or exhibition register", "a room arranged so seeing becomes serious"],
    ["KRY", "Speech", "critique, disciplined judgment, care that names fault and merit", "critique, judge carefully, or name fault and merit under discipline", "critique, disciplined judgment", "critical, judged, merit-fault-aware", "critiques works or keeps critical standards", "critique note, review judgment", "critical review or editorial assessment", "judgment serving repair instead of vanity"],
    ["MTV", "Emotion", "motivation, moving reason, desire joined to directed action", "motivate, move action, or join desire to directed reason", "motivation, moving reason", "motivated, desire-directed, action-moving", "motivates action or studies driving reasons", "motive force, action reason", "motivation note or behavioral assessment", "the heart finding a reason to move"]
  ];

  return seeds.map(([id, category, semanticField, action, concept, quality, agent, object, civic, intimate]) =>
    seedRoot(id, category, semanticField, action, concept, quality, agent, object, civic, intimate)
  );
}

function civilizationalClosureRoots() {
  const seeds = [
    ["YNT", "Mind", "being, existence, real presence, what stands as actual", "be, exist, or name what stands as real", "being, existence", "existent, real, being-bound", "studies being or guards reality claims", "existent thing, real presence", "identity status or existence record", "another's reality received without reduction"],
    ["BKM", "Time", "becoming, emergence through change, identity in motion", "become, emerge through change, or enter new form", "becoming, emergent change", "becoming, emergent, change-borne", "tracks becoming or guides transitions", "becoming event, changed state", "transition record or status-change notice", "the self allowed to change without being abandoned"],
    ["MYS", "Mind", "meaning, significance, sense carried by sign or act", "mean, signify, or carry sense", "meaning, significance", "meaningful, significant, sense-bearing", "interprets meaning or keeps significance", "meaning field, signified sense", "official meaning or interpretive note", "what an act carries into the heart"],
    ["VLR", "Moral agency", "value, worth, ranked good, reason for care", "value, appraise worth, or rank goods", "value, worth", "valuable, worthy, good-ranked", "values goods or judges worth", "value mark, worth claim", "valuation record or public value statement", "the reason something asks to be protected"],
    ["THK", "Moral agency", "ethics, right conduct, disciplined judgment of action", "judge conduct, practice ethics, or order action by the good", "ethics, right conduct", "ethical, conduct-bound, good-answering", "keeps ethical judgment or teaches right conduct", "ethical rule, conduct case", "ethics opinion or conduct standard", "the question of what love permits power to do"],
    ["PDX", "Mind", "paradox, true-seeming conflict, tension that demands deeper seeing", "paradox, hold tension, or expose a deeper conflict of claims", "paradox, truth-tension", "paradoxical, tension-bearing, deeper-seeking", "works through paradoxes or teaches difficult tension", "paradox statement, tensioned claim", "paradox note or interpretive exception", "a knot in thought asking for patience"],
    ["KRD", "Mind", "contradiction, incompatible claims, broken truth relation", "contradict, oppose claims, or reveal incompatible assertions", "contradiction, incompatible claims", "contradictory, incompatible, claim-opposed", "detects contradictions or argues opposing claims", "contradiction pair, incompatible statement", "contradiction record or inconsistency finding", "speech breaking against itself"],
    ["NLG", "Mind", "analogy, likeness across difference, teaching by patterned comparison", "analogize, compare likeness, or teach by patterned resemblance", "analogy, patterned likeness", "analogous, likeness-bearing, comparison-shaped", "makes analogies or studies resemblance", "analogy pair, comparison bridge", "analogy note or interpretive comparison", "one truth lending its shape to another"],
    ["XNT", "Mind", "distinction, contrast, boundary between meanings", "distinguish, contrast, or set meanings apart", "distinction, meaning contrast", "distinct, contrasted, boundary-marked", "makes distinctions or guards contrasts", "distinction mark, contrast line", "classification distinction or legal contrast", "the care that refuses to blur persons or duties"],
    ["RFR", "Speech", "reference, pointing relation, sign directed toward an object", "refer, point by sign, or direct attention toward an object", "reference, pointing relation", "referential, directed, object-pointing", "keeps references or directs attention by signs", "reference target, citation pointer", "reference record or cross-reference", "a word turning the face toward what matters"],
    ["DCT", "Speech", "dictionary, ordered word memory, public store of meanings", "dictionary, order words, or preserve meanings in a lookup body", "dictionary, ordered word memory", "dictionary-bound, word-ordered, meaning-kept", "keeps dictionaries or orders word meanings", "dictionary entry, word definition", "dictionary record or terminology standard", "a people's memory made searchable"],
    ["LXY", "Speech", "lexicon, accepted word stock, living inventory of speech", "lexicalize, admit words, or organize accepted speech stock", "lexicon, accepted word stock", "lexical, accepted, word-stocked", "keeps lexicons or admits terms", "lexicon entry, accepted term", "lexicon registry or term admission record", "the words a culture agrees to carry"],
    ["YDM", "Speech", "idiom, fixed expression, meaning beyond literal pieces", "idiomize, fix expression, or speak meaning beyond parts", "idiom, fixed expression", "idiomatic, fixed, beyond-literal", "uses idioms or explains fixed expressions", "idiom phrase, expression body", "idiom record or style note", "memory hiding inside familiar speech"],
    ["PRB", "Speech", "proverb, compressed wisdom, remembered sentence for conduct", "proverb, compress wisdom, or teach by remembered sentence", "proverb, compressed wisdom", "proverbial, wisdom-compressed, memory-shaped", "keeps proverbs or teaches compressed wisdom", "proverb line, wisdom sentence", "proverb record or civic maxim", "an ancestor's counsel made small enough to carry"],
    ["NXN", "Speech", "syntax, sentence order, relation of words in structured speech", "syntax, order sentences, or arrange words by relation", "syntax, sentence order", "syntactic, ordered, relation-bound", "studies syntax or orders sentences", "syntax tree, word relation", "syntax rule or grammar standard", "words learning where they stand with one another"],
    ["SMK", "Speech", "semantics, meaning system, relation between signs and sense", "semanticize, map meanings, or study sign-sense relation", "semantics, meaning system", "semantic, sense-bound, sign-related", "studies semantics or maps meaning fields", "semantic field, sense relation", "semantic standard or term-meaning record", "speech asking what it truly carries"],
    ["PYG", "Speech", "paragraph, bounded thought unit, prose step in argument", "paragraph, bound thought, or divide prose into ordered units", "paragraph, thought unit", "paragraphic, bounded, prose-ordered", "writes paragraphs or edits thought units", "paragraph block, prose step", "paragraph record or publication unit", "a thought given room to breathe"],
    ["KPY", "Speech", "copy, duplicate text, reproduced message or artifact", "copy, duplicate, or reproduce text and artifacts", "copy, duplicate text", "copied, duplicated, reproduced", "copies texts or manages reproductions", "copy page, duplicate artifact", "copy record or reproduction license", "memory repeated without pretending to be origin"],
    ["BBL", "Speech", "bibliography, source list, named trail of consulted memory", "bibliograph, list sources, or keep consulted memory", "bibliography, source list", "bibliographic, source-listed, memory-trailed", "keeps bibliographies or traces sources", "source list, bibliography entry", "bibliographic record or citation list", "gratitude made visible to prior speech"],
    ["LBY", "Building/making", "library, public book house, shared learning memory", "library, house books, or order shared learning memory", "library, public book house", "library-bound, book-kept, learning-shared", "keeps libraries or stewards public books", "library shelf, book collection", "library record or public collection", "a quiet house where a people remembers"],
    ["NWS", "Speech", "news, current report, public notice of recent events", "news, report current events, or notify the public", "news, current report", "newsworthy, current, publicly reported", "reports news or verifies current events", "news item, current report", "news record or public bulletin", "what happened arriving at the shared table"],
    ["JRN", "Speech", "journal, periodic record, dated writing of inquiry or events", "journal, record periodically, or write dated inquiry", "journal, periodic record", "journaled, dated, inquiry-kept", "keeps journals or edits periodic records", "journal issue, dated entry", "journal archive or publication record", "thought returning on appointed days"],
    ["MGZ", "Speech", "magazine, curated periodical, public bundle of essays and images", "magazine, curate periodical work, or gather public features", "magazine, curated periodical", "magazine-bound, curated, periodic", "edits magazines or curates features", "magazine issue, feature spread", "magazine record or periodical license", "public attention arranged for repeated return"],
    ["BLG", "Speech", "blog, public log, serial personal or institutional note", "blog, log publicly, or publish serial notes", "blog, public log", "blogged, serial, public-noted", "blogs or maintains public logs", "blog post, serial note", "blog archive or public web log", "a voice keeping record in open air"],
    ["CNV", "Speech", "conversation, reciprocal speech, turn-taking exchange of persons", "converse, exchange speech, or keep turn-taking dialogue", "conversation, reciprocal speech", "conversational, reciprocal, turn-taking", "converses or hosts dialogue", "conversation turn, dialogue thread", "conversation record or meeting transcript", "speech that lets another answer"],
    ["DYR", "Law/civic life", "deliberation, slow public reasoning, judgment before decision", "deliberate, reason together, or slow judgment before decision", "deliberation, public reasoning", "deliberative, slow-judging, counsel-bound", "deliberates or facilitates public reasoning", "deliberation session, counsel record", "deliberation minutes or public consultation", "power made to wait for thought"],
    ["PTY", "Law/civic life", "party, organized civic faction, political body seeking power", "party, organize faction, or seek power through civic contest", "party, civic faction", "partisan, organized, power-seeking", "keeps parties or organizes political factions", "party platform, faction body", "party registration or platform record", "a group naming how it would govern"],
    ["LBB", "Law/civic life", "lobbying, persuasion of office, organized petition near power", "lobby, petition office, or persuade public authority", "lobbying, office persuasion", "lobbied, petitioning, power-near", "lobbies officials or records influence", "lobby brief, influence contact", "lobby disclosure or influence record", "desire approaching power with a visible name"],
    ["CBN", "Law/civic life", "cabinet, executive council, appointed governing circle", "cabinet, counsel executive power, or appoint governing circle", "cabinet, executive council", "cabinet-bound, appointed, executive-counseling", "serves in cabinets or appoints governing circles", "cabinet seat, executive portfolio", "cabinet appointment or executive order record", "power forced to hear several chairs"],
    ["MNS", "Law/civic life", "ministry, public department, governed field of service", "minister, administer a public field, or serve through office", "ministry, public department", "ministerial, departmental, service-bound", "serves ministries or administers public fields", "ministry office, service portfolio", "ministry record or departmental mandate", "office named by the service it owes"],
    ["BRC", "Law/civic life", "bureaucracy, rule office system, administrative machinery of public work", "bureaucratize, administer by offices, or process public work through rules", "bureaucracy, office system", "bureaucratic, office-bound, procedure-heavy", "works in bureaucracy or reforms office systems", "bureau form, administrative channel", "bureaucratic procedure or administrative record", "necessary order in danger of forgetting faces"],
    ["RFP", "Law/civic life", "refugee, displaced protected person, one seeking shelter across borders", "seek refuge, protect displaced persons, or recognize refugee standing", "refugee, displaced protected person", "refugee-bound, displaced, shelter-seeking", "protects refugees or adjudicates refuge claims", "refugee claim, protected status", "refugee record or asylum proceeding", "a person whose home was broken but not their name"],
    ["VSY", "Law/civic life", "visa, permitted entry, temporary crossing authorization", "visa, authorize entry, or permit temporary crossing", "visa, entry permission", "visa-bearing, entry-authorized, temporary", "issues visas or seeks entry permission", "visa stamp, entry document", "visa record or border authorization", "welcome made conditional and inspectable"],
    ["PPT", "Law/civic life", "passport, identity travel document, public proof of crossing personhood", "passport, document travel identity, or prove personhood across borders", "passport, travel identity document", "passport-bound, documented, border-recognized", "issues passports or verifies travel identity", "passport page, identity document", "passport record or travel credential", "a name carried through gates"],
    ["MJR", "Law/civic life", "majority, greater number, counted public more", "majoritize, hold greater number, or decide by counted more", "majority, greater number", "majority-held, greater, count-dominant", "counts majorities or governs by greater number", "majority vote, greater side", "majority report or election result", "the many that must still answer to the one"],
    ["MNR", "Law/civic life", "minority, lesser number, protected smaller voice", "stand as minority, protect lesser number, or record smaller voice", "minority, lesser number", "minority-held, smaller, voice-protected", "represents minorities or protects smaller voices", "minority report, smaller side", "minority status or dissent record", "the few refusing disappearance inside the count"],
    ["PLC", "Law/civic life", "police, civil order force, public safety guardianship", "police, keep civil order, or enforce public safety", "police, civil order force", "policed, order-keeping, safety-bound", "serves police or oversees civil order", "police unit, safety patrol", "police report or public safety order", "force walking closest to ordinary faces"],
    ["LLM", "Technology", "language model, learned speech system, statistical text engine", "model language, generate text, or learn speech patterns from data", "language model, learned speech system", "model-based, text-generating, learned", "trains language models or audits generated speech", "model output, generated text", "model card or AI system record", "borrowed speech that must answer to truth"],
    ["NRL", "Technology", "neural network, layered learned relation system, weighted cognition machine", "network neurons, learn weights, or compute by layered relation", "neural network, learned relation system", "neural, layered, weight-learned", "trains neural networks or studies learned relations", "neural layer, weight matrix", "neural model record or training artifact", "pattern memory built from many small adjustments"],
    ["TRG", "Technology", "training, model formation, repeated examples shaping capability", "train models, shape capability, or fit behavior through examples", "training, model formation", "trained, example-shaped, capability-formed", "trains models or manages training runs", "training run, example set", "training log or model formation record", "repetition turning memory into power"],
    ["CRL", "Technology", "crawler, traversing indexer, system that walks links for memory", "crawl links, traverse records, or gather indexable pages", "crawler, traversing indexer", "crawled, traversing, index-gathering", "runs crawlers or audits link traversal", "crawler job, fetched page", "crawler log or indexing policy", "attention automated into wandering"],
    ["MDR", "Technology", "moderation, boundary judgment, speech filtered for public safety", "moderate content, judge boundaries, or filter speech for safety", "moderation, boundary judgment", "moderated, filtered, boundary-judged", "moderates content or audits public speech filters", "moderation queue, flagged item", "moderation record or safety policy", "public speech meeting the question of harm"],
    ["RWF", "Technology", "reinforcement, reward-shaped learning, behavior guided by consequence", "reinforce behavior, shape learning by reward, or train through consequence", "reinforcement, reward-shaped learning", "reinforced, reward-shaped, consequence-trained", "uses reinforcement or audits reward systems", "reward signal, reinforcement step", "reinforcement log or training policy", "consequence teaching power what to repeat"],
    ["RTG", "Technology", "retrieval, memory fetching, bringing stored knowledge into action", "retrieve memory, fetch records, or bring stored knowledge to use", "retrieval, memory fetching", "retrieved, fetched, memory-called", "builds retrieval systems or fetches records", "retrieved passage, memory result", "retrieval log or search evidence", "memory answering when called"],
    ["PMR", "Technology", "parameter, learned setting, tunable value governing behavior", "parameterize, tune settings, or govern behavior by learned value", "parameter, tunable value", "parametric, tunable, behavior-governing", "tunes parameters or audits learned settings", "parameter value, model weight", "parameter record or configuration note", "a small value steering large action"],
    ["MBD", "Technology", "embedding, dense representation, meaning placed in vector space", "embed meaning, place representation, or encode relation densely", "embedding, dense representation", "embedded, vector-placed, relation-dense", "creates embeddings or audits representation spaces", "embedding vector, representation point", "embedding record or retrieval index", "meaning folded into number"],
    ["KLF", "Technology", "classification, label assignment, category decision by rule or model", "classify, assign labels, or decide categories by rule", "classification, label assignment", "classified, label-bound, category-decided", "classifies records or audits labels", "classification label, category decision", "classification report or taxonomy record", "judgment made into a name"],
    ["LDR", "Technology", "loader, intake system, component that brings data or code into use", "load data, bring code into use, or intake records", "loader, intake system", "loaded, intake-bound, use-brought", "builds loaders or manages intake systems", "loader module, input stream", "loader record or import job", "a doorway for memory entering action"],
    ["KRL", "Technology", "controller, governing component, system part that directs behavior", "control systems, direct behavior, or govern components", "controller, governing component", "controlled, directive, component-governing", "builds controllers or manages control loops", "controller process, control signal", "controller record or automation policy", "delegated command that must stay answerable"],
    ["GPY", "Technology", "accelerator, parallel compute engine, specialized power for heavy work", "accelerate compute, parallelize work, or use specialized processing", "accelerator, parallel compute engine", "accelerated, parallel, compute-specialized", "uses accelerators or schedules parallel compute", "compute accelerator, parallel unit", "accelerator record or hardware allocation", "power multiplied for tasks too heavy for one path"],
    ["GWT", "Technology", "gateway, controlled entrance, service boundary between systems", "gateway, mediate entrance, or control crossing between systems", "gateway, service entrance", "gateway-bound, entrance-controlled, mediated", "keeps gateways or governs system crossings", "gateway endpoint, entrance rule", "gateway record or ingress policy", "a gate where systems must introduce themselves"],
    ["KTR", "Technology", "connector, integration link, component joining services or tools", "connect services, integrate tools, or join systems by component", "connector, integration link", "connected, integrated, service-joined", "builds connectors or manages integrations", "connector module, integration link", "connector record or integration manifest", "a handshake given a durable body"],
    ["LNZ", "Technology", "lens, interpretive filter, optical or analytic focus surface", "lens, focus view, or filter perception through a surface", "lens, focus filter", "lensed, focused, filtered", "uses lenses or builds analytic filters", "lens glass, focus filter", "lens record or model-view filter", "attention shaped before it reaches truth"],
    ["BCH", "Mind", "biochemistry, living chemistry, molecular processes of life", "study biochemistry, trace living molecules, or explain life by chemical process", "biochemistry, living chemistry", "biochemical, molecular, life-processed", "studies biochemistry or tests living molecules", "biochemical pathway, molecular finding", "biochemistry record or lab assay", "life read through the bonds inside matter"],
    ["NZM", "Nature", "enzyme, catalytic life molecule, body helper of transformation", "enzymize, catalyze life reaction, or speed transformation in bodies", "enzyme, catalytic molecule", "enzymatic, catalytic, transformation-helping", "studies enzymes or measures catalytic action", "enzyme level, catalytic protein", "enzyme record or metabolic assay", "small help that lets life change"],
    ["PTN", "Nature", "protein, folded life molecule, working body of cells", "proteinize, fold life matter, or build cellular work bodies", "protein, folded life molecule", "protein-bound, folded, cellular-working", "studies proteins or tracks cellular work bodies", "protein chain, folded molecule", "protein record or molecular assay", "matter folded into bodily service"],
    ["FNG", "Nature", "fungus, networked decomposer life, hidden mycelial organism", "fungus, decompose, or grow as mycelial network", "fungus, mycelial life", "fungal, decomposing, networked", "studies fungi or cultivates mycelial life", "fungal body, mycelium thread", "fungus record or ecological finding", "hidden life returning death to soil"],
    ["GLC", "Nature", "glacier, moving ice body, slow stored water of mountains", "glaciate, move as ice, or store water in slow frozen body", "glacier, moving ice body", "glacial, ice-moving, slow-watered", "studies glaciers or tracks frozen water", "glacier face, ice field", "glacier survey or climate record", "time made visible in ice"],
    ["SPH", "Nature", "sphere, globe, rounded world-body or domain of influence", "spherize, enclose as globe, or name a rounded domain", "sphere, rounded domain", "spherical, enclosed, domain-bound", "studies spheres or maps bounded domains", "sphere body, influence field", "sphere record or jurisdictional domain", "a world held in a single curve"],
    ["RDX", "Nature", "radiation, emitted energy, invisible force carried outward", "radiate, emit energy, or carry invisible force outward", "radiation, emitted energy", "radiant, emitted, force-bearing", "measures radiation or controls emitted energy", "radiation dose, emitted ray", "radiation record or exposure standard", "power traveling where hands cannot see"],
    ["GRV", "Nature", "gravity, drawing force, mass relation that pulls bodies together", "gravitate, draw bodies, or measure mass attraction", "gravity, drawing force", "gravitational, drawing, mass-bound", "studies gravity or measures attraction", "gravity field, falling measure", "gravity record or physical constant", "the world teaching bodies to answer one another"],
    ["LKT", "Nature", "electricity, charged flow, usable force through circuit", "electrify, charge flow, or move force through circuit", "electricity, charged flow", "electric, charged, circuit-flowing", "keeps electrical systems or measures charge", "electric current, charged line", "electrical record or utility standard", "invisible fire taught to serve"],
    ["PZM", "Nature", "plasma, ionized matter, charged luminous state", "plasma, ionize matter, or hold charged luminous state", "plasma, ionized matter", "plasmic, ionized, luminous-charged", "studies plasma or controls ionized matter", "plasma field, charged gas", "plasma record or physics observation", "matter loosened into shining force"],
    ["SKY", "Nature", "sky, overhead expanse, weather-light field above a people", "sky, open overhead, or mark the upper expanse", "sky, overhead expanse", "skyward, overhead, upper-open", "watches skies or reads overhead signs", "sky field, horizon vault", "sky observation or aviation condition", "the common roof no one owns"],
    ["MPT", "Emotion", "empathy, felt-with understanding, inward answer to another's state", "empathize, feel with, or understand another inwardly", "empathy, felt-with understanding", "empathic, felt-with, inward-answering", "empathizes or teaches felt understanding", "empathy response, shared feeling", "empathy note or care assessment", "another's pain making a room inside the heart"],
    ["HMR", "Emotion", "humor, shared lightness, laughter that reveals proportion", "humor, make lightness, or restore proportion through laughter", "humor, shared lightness", "humorous, light, proportion-restoring", "uses humor or studies comic timing", "joke, comic turn", "humor record or performance note", "joy finding a side door through heaviness"],
    ["YRN", "Emotion", "irony, reversed expectation, meaning bent against surface speech", "ironize, reverse expectation, or bend meaning against surface", "irony, reversed expectation", "ironic, reversed, surface-bent", "uses irony or interprets reversed meaning", "ironic line, reversed signal", "irony note or literary interpretation", "speech smiling at its own mask"],
    ["DXP", "Emotion", "despair, collapsed hope, future felt as closed", "despair, lose future trust, or collapse inward hope", "despair, collapsed hope", "despairing, hope-collapsed, future-closed", "despairs or treats collapsed hope", "despair sign, closed-future feeling", "crisis note or despair assessment", "the heart unable to see a path"],
    ["TRS", "Emotion", "curiosity, question-hunger, desire to know what is hidden", "be curious, hunger for questions, or seek hidden knowledge", "curiosity, question-hunger", "curious, question-hungry, seeking", "asks curiously or cultivates inquiry", "curiosity spark, question pull", "inquiry note or learner curiosity record", "wonder leaning forward"],
    ["KND", "Moral agency", "kindness, gentle good action, care made small and immediate", "act kindly, soften help, or give gentle good", "kindness, gentle good action", "kind, gentle, care-active", "practices kindness or teaches gentle action", "kind act, gentle help", "care standard or kindness commendation", "goodness close enough to touch"],
    ["GRS", "Moral agency", "generosity, open-handed provision, giving beyond strict claim", "give generously, open provision, or exceed owed measure", "generosity, open-handed provision", "generous, open-handed, more-than-owed", "gives generously or stewards open provision", "generous gift, open provision", "donation record or public benefaction", "provision refusing to stop at calculation"],
    ["FRL", "Emotion", "frustration, blocked will, effort meeting resistant limit", "frustrate, be blocked, or meet resistant limit", "frustration, blocked will", "frustrated, blocked, resistance-bound", "bears frustration or removes blocked paths", "frustration sign, blocked effort", "service complaint or blocked-process note", "desire striking a wall"],
    ["TNR", "Emotion", "tone, emotional coloring, felt register of speech or act", "tone speech, color feeling, or set emotional register", "tone, emotional coloring", "tonal, emotionally colored, register-bearing", "sets tone or reads emotional coloring", "tone mark, felt register", "tone note or communication assessment", "how speech arrives before its words"],
    ["NDM", "Emotion", "numbness, dulled feeling, protective absence of sensation", "numb, dull feeling, or protect by reducing sensation", "numbness, dulled feeling", "numb, dulled, feeling-muted", "bears numbness or treats dulled feeling", "numb place, muted feeling", "clinical numbness record or trauma note", "the heart lowering its lights to survive"],
    ["MRR", "Seeing/knowing", "mirror, reflected image, surface returning visible presence", "mirror, reflect image, or return visible presence", "mirror, reflected image", "mirrored, reflected, image-returning", "uses mirrors or interprets reflection", "mirror surface, reflected face", "mirror record or optical device standard", "the face returned so the self can answer"],
    ["CLK", "Time", "clock, measured time device, public instrument of hours", "clock, measure hours, or mark time by device", "clock, time device", "clocked, hour-measured, time-instrumental", "keeps clocks or measures hours", "clock face, time reading", "clock record or timing standard", "time given a visible hand"],
    ["GLS", "Building/making", "glass, transparent hard material, made clarity surface", "glass, make transparent material, or harden clarity into surface", "glass, transparent material", "glassy, transparent, hard-clear", "works glass or keeps transparent surfaces", "glass pane, clear vessel", "glass standard or material record", "clarity made touchable and breakable"],
    ["PLK", "Building/making", "plastic, moldable synthetic material, shaped durable matter", "plasticize, mold synthetic matter, or shape durable flexible form", "plastic, moldable synthetic material", "plastic, molded, synthetic", "works plastic or manages synthetic materials", "plastic part, molded form", "plastic standard or waste-material record", "convenience that must answer to its afterlife"],
    ["FBR", "Body", "fabric, woven cloth, flexible material for covering and use", "weave fabric, cloth material, or make flexible covering", "fabric, woven cloth", "fabric, woven, flexible", "weaves fabric or stewards textile work", "fabric sheet, woven cloth", "textile record or garment material standard", "many threads agreeing to shelter"],
    ["PPR", "Speech", "paper, writing sheet, thin memory surface", "paper, make sheet, or carry writing on thin surface", "paper, writing sheet", "papered, sheet-bound, writable", "keeps paper records or makes writing surfaces", "paper page, written sheet", "paper record or document medium", "memory made light enough to pass hand to hand"],
    ["KBD", "Technology", "keyboard, input board, hand-speech interface for machines", "keyboard, input by keys, or give hand-speech to machines", "keyboard, input board", "keyboarded, keyed, input-bearing", "uses keyboards or designs input boards", "keyboard key, input board", "keyboard record or accessibility input device", "fingers turning thought into signs"],
    ["TSK", "Building/making", "desk, work surface, bounded place for writing and tools", "desk, arrange work surface, or hold writing tools in place", "desk, work surface", "desk-bound, work-surfaced, tool-held", "keeps desks or prepares work surfaces", "desk top, work station", "desk assignment or workplace record", "a small field where attention sits"],
    ["KHR", "Building/making", "chair, seat with back, individual resting support", "chair, seat a person, or support rest in upright posture", "chair, backed seat", "chaired, seated, support-backed", "keeps chairs or presides from a seat", "chair seat, support frame", "chair assignment or accessibility seating record", "rest shaped for a single body"],
    ["SHL", "Building/making", "shelf, raised storage plane, ordered place for kept things", "shelve, store visibly, or order things on raised plane", "shelf, storage plane", "shelved, stored, raised-ordered", "shelves goods or keeps storage planes", "shelf row, storage board", "shelf record or inventory location", "memory lifted where the hand can find it"],
    ["BKS", "Building/making", "box, bounded container, small portable holding form", "box, contain, or make portable bounded holding", "box, bounded container", "boxed, contained, portable-bound", "boxes goods or manages containers", "box lid, container space", "box record or shipping container", "a small room that travels"],
    ["WRC", "Technology", "wire, conductive line, thin path for signal or power", "wire, conduct signal, or bind devices by thin line", "wire, conductive line", "wired, conductive, signal-threaded", "wires systems or maintains conductors", "wire strand, circuit line", "wiring record or electrical route", "a thread carrying invisible work"],
    ["HYM", "Ritual/poetry", "hymn, solemn song, praise shaped by communal voice", "hymn, sing praise, or shape solemn communal song", "hymn, solemn song", "hymnic, praised, communal-sung", "sings hymns or keeps solemn songs", "hymn line, praise song", "hymn record or liturgical song", "many voices lifting one reverence"],
    ["PSL", "Ritual/poetry", "psalm, prayer-song, poetic address of grief, praise, or trust", "psalm, pray in song, or shape poetic sacred address", "psalm, prayer-song", "psalmic, prayer-sung, trust-shaped", "sings psalms or keeps prayer songs", "psalm verse, prayer line", "psalm record or ritual reading", "the heart singing where speech alone is too thin"],
    ["TMB", "Ritual/poetry", "temple, sacred house, built place of ultimate attention", "temple, house sacred attention, or build a place of worship", "temple, sacred house", "templed, sacred-housed, attention-built", "keeps temples or builds sacred houses", "temple hall, worship place", "temple record or protected sacred site", "stone arranged so awe can enter"],
    ["PGM", "Ritual/poetry", "pilgrimage, sacred journey, path taken for memory and vow", "pilgrimage, journey solemnly, or walk toward sacred memory", "pilgrimage, sacred journey", "pilgrim, journey-bound, vow-walking", "makes pilgrimage or guides sacred journeys", "pilgrimage route, vow path", "pilgrimage permit or ritual itinerary", "the feet learning what the heart promised"],
    ["CND", "Ritual/poetry", "candle, small ritual flame, kept light for attention or mourning", "candle, keep small flame, or mark attention by light", "candle, ritual flame", "candle-lit, flame-kept, attention-marked", "keeps candles or tends small ritual flames", "candle wick, small flame", "candle record or memorial light", "a little fire refusing forgetfulness"],
    ["RLG", "Ritual/poetry", "religion, ordered ultimate practice, communal binding to sacred meaning", "religion, bind practice to ultimate meaning, or order sacred life communally", "religion, ultimate practice", "religious, sacred-bound, practice-ordered", "keeps religious practice or studies sacred communities", "religious rite, sacred rule", "religious status or protected practice record", "a people arranging life before what it holds ultimate"],
    ["SBN", "Ritual/poetry", "symbol, visible carrier of larger meaning, sign thick with memory", "symbolize, carry meaning visibly, or make memory into sign", "symbol, meaning-bearing sign", "symbolic, meaning-thick, memory-carried", "uses symbols or interprets visible meaning", "symbol mark, emblem form", "symbol register or public emblem", "a small shape carrying more than itself"],
    ["MSY", "Ritual/poetry", "mystery, hidden depth, truth not exhausted by explanation", "mystify, hold hidden depth, or approach truth beyond explanation", "mystery, hidden depth", "mysterious, hidden-deep, explanation-exceeding", "keeps mysteries or teaches reverent limits", "mystery sign, hidden depth", "mystery note or protected ritual teaching", "truth keeping enough shadow to stay alive"],
    ["NDC", "Ritual/poetry", "incense, scented offering smoke, rising mark of prayer or memory", "incense, scent offering, or raise smoke in solemn attention", "incense, scented offering smoke", "incensed, smoke-scented, offering-risen", "tends incense or prepares scented offerings", "incense smoke, ritual scent", "incense record or ceremonial material", "breath made visible for reverence"],
    ["VGN", "Ritual/poetry", "veneration, reverent honoring, attention paid to what carries memory", "venerate, honor reverently, or attend to memory-bearing dignity", "veneration, reverent honoring", "venerated, revered, memory-honored", "venerates or guards honored memory", "veneration act, honored sign", "heritage protection or public honor record", "love bowing without possession"],
    ["TBL", "Building/making", "table, shared surface, place for meal, work, or council", "table, set shared surface, or gather work and meal in one place", "table, shared surface", "tabled, surface-shared, gathering-ready", "keeps tables or sets shared work surfaces", "table edge, shared board", "table assignment or meeting record", "a surface where bodies and words meet"],
    ["KLD", "Time", "calendar, ordered days, public memory of appointed time", "calendar, order days, or set appointed times", "calendar, ordered days", "calendared, date-ordered, appointed", "keeps calendars or schedules public time", "calendar day, appointment grid", "calendar record or public schedule", "time remembered before it arrives"],
    ["WHL", "Building/making", "wheel, turning support, circular tool of movement", "wheel, turn movement, or carry by circular support", "wheel, turning support", "wheeled, turning, movement-bearing", "keeps wheels or designs rolling supports", "wheel rim, axle turn", "wheel record or vehicle part standard", "motion made round enough to carry weight"],
    ["BTY", "Technology", "battery, stored electric provision, portable reserve of charge", "battery, store charge, or provide portable electric reserve", "battery, stored charge", "battery-powered, charge-stored, portable", "keeps batteries or manages stored charge", "battery cell, charge reserve", "battery record or energy storage standard", "light held for a future need"]
  ];

  return seeds.map(([id, category, semanticField, action, concept, quality, agent, object, civic, intimate]) =>
    seedRoot(id, category, semanticField, action, concept, quality, agent, object, civic, intimate)
  );
}

function v1StabilityRoots() {
  const seeds = [
    ["HNR", "Moral agency", "honor, public worth, dignity proven by answerable action", "honor, dignify, or make worth visible by action", "honor, public worth", "honorable, dignity-bearing, worth-shown", "keeps honor or guards dignity", "honor mark, dignity sign", "honor record or public commendation", "worth recognized without flattery"],
    ["TPN", "Moral agency", "temperance, measured desire, appetite held under right order", "temper desire, measure appetite, or restrain excess", "temperance, measured desire", "temperate, appetite-measured, excess-restrained", "keeps temperance or moderates desire", "temperance act, restrained appetite", "conduct limit or sobriety standard", "desire made gentle enough for trust"],
    ["CRG", "Moral agency", "courage, fear-governed action, brave duty under danger", "take courage, act through fear, or guard duty under danger", "courage, brave duty", "courageous, fear-facing, duty-brave", "keeps courage or strengthens the fearful", "courage act, brave stand", "commendation for courage or duty-under-danger record", "fear held by a larger love"],
    ["HBL", "Moral agency", "humility, truthful smallness, teachable standing before reality", "humble oneself, receive correction, or stand truthfully small", "humility, teachable smallness", "humble, teachable, self-measured", "keeps humility or receives correction", "humble act, received correction", "conflict-deescalation or correction record", "the self becoming small enough to hear"],
    ["PVS", "Moral agency", "perseverance, continued duty, faithful endurance under strain", "persevere, continue duty, or endure strain faithfully", "perseverance, continued duty", "persevering, enduring, strain-faithful", "keeps perseverance or carries work through strain", "perseverance act, endured burden", "service-continuity or hardship-duty record", "staying when feeling has become thin"],
    ["FDL", "Moral agency", "fidelity, faithful keeping, truth of word maintained through time", "keep faith, remain true, or preserve word through time", "fidelity, faithful keeping", "faithful, kept, word-true", "keeps fidelity or tests faithfulness", "fidelity sign, kept pledge", "fidelity record or trust compliance", "the promise still present after ease leaves"],
    ["RZP", "Moral agency", "responsibility, charge accepted, agency that answers for outcomes", "take responsibility, accept charge, or answer for outcomes", "responsibility, accepted charge", "responsible, charge-accepted, outcome-answering", "bears responsibility or assigns charge", "responsibility mark, accepted charge", "responsibility assignment or accountability filing", "the self standing near what it caused"],
    ["SBR", "Moral agency", "sobriety, clear restraint, undrunken judgment and disciplined appetite", "sober, clear judgment, or restrain appetite from confusion", "sobriety, clear restraint", "sober, clear, appetite-disciplined", "keeps sobriety or restores clear judgment", "sobriety act, clear restraint", "sobriety standard or impairment finding", "clarity kept for those who trust us"],
    ["KTY", "Moral agency", "equity, fair standing, adjusted justice for unequal burdens", "make equitable, adjust fairness, or restore standing proportionally", "equity, adjusted fairness", "equitable, burden-aware, standing-restored", "keeps equity or adjusts unfair burden", "equity measure, restored standing", "equity review or proportional remedy", "fairness that sees the person before the rule"],
    ["NBL", "Moral agency", "nobility, high conduct, dignity joined to service rather than vanity", "act nobly, raise conduct, or bind dignity to service", "nobility, high conduct", "noble, service-dignified, high-conduct", "keeps nobility or raises conduct", "noble act, dignified service", "public honor or service-rank record", "height lowered into service"],
    ["ADM", "Love/intimacy", "admiration, delighted regard, love seeing excellence without envy", "admire, regard excellence, or delight without envy", "admiration, delighted regard", "admiring, excellence-seeing, envy-free", "admires or receives admiration", "admiration sign, delighted regard", "commendation or protected interest note", "joy at another's brightness"],
    ["RYN", "Love/intimacy", "reunion, restored nearness, separated persons meeting again", "reunite, restore nearness, or meet again after separation", "reunion, restored nearness", "reunited, near-again, separation-healed", "reunites or receives return", "reunion moment, restored meeting", "family reunification or return record", "distance ending without erasing what it taught"],
    ["SLC", "Love/intimacy", "solace, comfort given in sorrow, nearness that shelters grief", "console, give solace, or shelter grief by presence", "solace, grief-comfort", "consoled, comforted, grief-sheltered", "consoles or receives solace", "solace word, comfort act", "care response or bereavement support record", "presence soft enough for sorrow"],
    ["RDL", "Love/intimacy", "reliability, dependable presence, trust proven by repeated return", "be reliable, return dependably, or prove presence by repetition", "reliability, dependable presence", "reliable, return-proven, dependable", "keeps reliability or depends faithfully", "reliable act, dependable return", "reliability record or care-continuity standard", "love arriving when promised"],
    ["NRD", "Love/intimacy", "need, vulnerable lack, what asks to be received without contempt", "need, lack vulnerably, or ask care without contempt", "need, vulnerable lack", "needed, vulnerable, care-asking", "bears need or receives another's lack", "need sign, vulnerable request", "care need or support eligibility record", "lack trusted enough to speak"],
    ["KVN", "Love/intimacy", "confiding, entrusted inward speech, secret placed in faithful hearing", "confide, entrust inward speech, or receive a secret faithfully", "confiding, entrusted speech", "confided, entrusted, inward-spoken", "confides or receives confidence", "confidence word, entrusted secret", "confidential relation or care disclosure", "a hidden word placed in safe hearing"],
    ["KNN", "Future/civilization", "canon, received standard text, memory chosen for transmission", "canonize, preserve standard memory, or choose text for transmission", "canon, received standard", "canonical, transmitted, standard-kept", "keeps canon or judges transmission", "canonical text, received standard", "canon record or official text register", "memory selected for those not yet born"],
    ["DYP", "Future/civilization", "diaspora, scattered peoplehood, memory carried outside homeland", "diasporize, scatter as people, or carry homeland memory abroad", "diaspora, scattered peoplehood", "diasporic, scattered, homeland-remembering", "keeps diaspora memory or lives scattered peoplehood", "diaspora community, scattered house", "diaspora registry or overseas community record", "home carried when land is far"],
    ["HRG", "Future/civilization", "heritage, inherited treasure, received form that asks stewardship", "inherit heritage, steward received form, or transmit cultural treasure", "heritage, inherited treasure", "heritage-bearing, received, stewardship-asking", "keeps heritage or transmits received form", "heritage object, inherited treasure", "heritage register or preservation duty", "a gift old enough to command care"],
    ["LNJ", "Future/civilization", "lineage, descent line, named continuity through persons", "lineage, trace descent, or preserve named continuity", "lineage, descent line", "lineal, descent-bearing, continuity-named", "keeps lineage or traces descent", "lineage mark, descent record", "genealogical record or succession line", "memory walking through names"],
    ["MFT", "Future/civilization", "founding myth, origin story, memory-image that gives a people direction", "myth-found, tell origin image, or give direction by founding story", "founding myth, origin story", "mythic, origin-bearing, direction-giving", "keeps founding stories or tests origin images", "founding tale, origin image", "civic myth record or public origin narrative", "a beginning made memorable enough to guide"],
    ["CMW", "Future/civilization", "commonwealth, shared provision, people ordered around mutual good", "commonwealth, share provision, or order goods for the people", "commonwealth, shared provision", "commonwealth-bound, shared, people-provisioning", "keeps commonwealth or stewards shared provision", "commonwealth good, shared provision", "public trust or commonwealth charter", "what belongs to us because it serves more than us"],
    ["DTV", "Conflict/repair", "deterrence, restrained threat, force held to prevent harm", "deter, restrain threat, or prevent harm by visible readiness", "deterrence, restrained threat", "deterring, threat-restrained, harm-preventing", "deters harm or keeps readiness restrained", "deterrent sign, restrained force", "deterrence policy or threat-prevention record", "strength shown so repair need not begin with blood"],
    ["NGT", "Conflict/repair", "negotiation, conflict speech, settlement sought without surrendering truth", "negotiate, seek settlement, or speak through conflict", "negotiation, settlement speech", "negotiated, settlement-seeking, conflict-spoken", "negotiates or mediates settlement", "negotiation term, settlement offer", "settlement record or negotiation protocol", "speech standing between force and repair"],
    ["PTL", "Conflict/repair", "patrol, protective watch, moving guard over a vulnerable boundary", "patrol, watch protectively, or guard by moving attention", "patrol, protective watch", "patrolling, watchful, boundary-guarding", "patrols or keeps protective watch", "patrol route, watch report", "patrol order or public safety route", "attention walking where harm might enter"],
    ["HST", "Conflict/repair", "hostility, active enmity, relation bent toward harm", "be hostile, turn against, or carry enmity toward harm", "hostility, active enmity", "hostile, enmity-bearing, harm-turned", "bears hostility or detects enmity", "hostile act, enmity sign", "hostility finding or threat assessment", "relation forgetting the other's face"],
    ["RSC", "Conflict/repair", "rescue, urgent saving, intervention before loss becomes final", "rescue, save urgently, or intervene before final loss", "rescue, urgent saving", "rescued, saved, loss-interrupted", "rescues or coordinates urgent saving", "rescue act, saved person", "rescue record or emergency intervention", "help arriving before absence closes"],
    ["KRM", "Conflict/repair", "crisis, decisive danger, time of compressed consequence", "enter crisis, decide under danger, or compress consequence into urgent action", "crisis, decisive danger", "critical, danger-compressed, urgent", "handles crisis or bears decisive danger", "crisis point, urgent danger", "crisis declaration or emergency record", "the hour when delay becomes a choice"],
    ["LJK", "Seeing/knowing", "logic, ordered inference, relation of reasons that must hold", "reason logically, order inference, or test relation by rule", "logic, ordered inference", "logical, rule-bound, reason-ordered", "keeps logic or tests inference", "logical form, inference step", "logic standard or reasoning audit", "thought answering to form"],
    ["NFR", "Seeing/knowing", "inference, conclusion drawn, meaning carried from evidence", "infer, draw conclusion, or carry meaning from evidence", "inference, drawn conclusion", "inferred, evidence-carried, conclusion-drawn", "infers or checks conclusions", "inference step, conclusion mark", "inference record or analytic finding", "seeing what follows without pretending it was seen directly"],
    ["KRR", "Seeing/knowing", "correlation, patterned co-occurrence, relation seen without claiming cause", "correlate, track co-occurrence, or mark pattern without cause", "correlation, patterned co-occurrence", "correlated, co-occurring, pattern-seen", "keeps correlations or marks patterns", "correlation mark, paired pattern", "correlation report or statistical relation", "two signs walking together without yet naming why"],
    ["FZT", "Seeing/knowing", "forecast, disciplined foresight, probable future made visible", "forecast, estimate future, or make probability visible ahead", "forecast, disciplined foresight", "forecasted, future-estimated, probability-seen", "forecasts or tests foresight", "forecast sign, future estimate", "forecast report or planning estimate", "tomorrow approached with humility"],
    ["XMN", "Seeing/knowing", "examination, tested attention, careful inspection before judgment", "examine, inspect carefully, or test attention before judgment", "examination, careful inspection", "examined, inspected, judgment-ready", "examines or keeps inspection", "examination note, inspected object", "inspection record or examination standard", "attention refusing to hurry past truth"],
    ["KZL", "Seeing/knowing", "causality, because-chain, source relation of event and consequence", "causalize, trace because, or link event to consequence", "causality, because-chain", "causal, because-linked, consequence-traced", "traces causes or judges because-relations", "cause chain, causal link", "causal finding or responsibility analysis", "the path by which one act reaches another"],
    ["FRK", "Time", "frequency, repeated rate, how often action returns", "frequent, repeat by rate, or count how often action returns", "frequency, repeated rate", "frequent, rate-counted, return-measured", "keeps frequency or measures recurrence", "frequency mark, rate count", "frequency record or monitoring interval", "the rhythm by which duty returns"],
    ["NTV", "Time", "interval, space between times, measured pause that separates events", "interval, space times, or measure pause between events", "interval, measured pause", "intervallic, spaced, pause-measured", "keeps intervals or measures pauses", "interval mark, between-time", "interval record or scheduling gap", "the between that gives events shape"],
    ["PCK", "Time", "epoch, long marked age, historical span with a name", "epoch, mark an age, or name a long historical span", "epoch, named age", "epochal, age-marked, history-named", "keeps epochs or names historical ages", "epoch mark, named span", "periodization record or historical era", "time large enough to receive a name"],
    ["WTN", "Time", "waiting, patient delay, readiness held before due arrival", "wait, delay patiently, or hold readiness before arrival", "waiting, patient delay", "waiting, patient, readiness-held", "waits or keeps readiness", "waiting period, readiness pause", "waiting-list or deferred action record", "desire sitting until the right hour"],
    ["SML", "Time", "simultaneity, shared moment, events held in one time", "synchronize as moment, happen together, or hold events in one time", "simultaneity, shared moment", "simultaneous, together-timed, moment-shared", "marks simultaneity or coordinates shared time", "simultaneous event, shared moment", "coordination record or concurrent event notice", "many actions breathing in one now"],
    ["NCL", "Family", "side-elder kin, aunt or uncle, household guidance beside parents", "stand as side-elder kin, aunt, uncle, or guide beside parents", "side-elder kin, aunt-uncle care", "avuncular, side-elder, kin-guiding", "keeps side-elder kinship or guides beside parents", "aunt-uncle role, side-elder bond", "kinship record or guardianship-adjacent duty", "care arriving from beside the parent"],
    ["KZN", "Family", "cousinhood, lateral kin, same-generation household extension", "stand as cousin, widen lateral kin, or keep same-generation bond", "cousinhood, lateral kin", "cousin-like, lateral, same-generation", "keeps cousinhood or lateral kinship", "cousin bond, lateral kin mark", "kinship record or collateral relation", "family widening sideways"],
    ["GXN", "Family", "guardianship, protective kin-duty, care authority for the vulnerable", "guard as kin, hold protective duty, or care by authorized trust", "guardianship, protective kin-duty", "guardian-bound, protective, trust-authorized", "guards dependents or keeps protective kin-duty", "guardian role, protective charge", "guardianship order or dependent-care record", "authority made tender by dependence"],
    ["BRD", "Family", "birthright, inherited standing, claim received by birth and memory", "birthright, receive inherited standing, or carry claim by birth", "birthright, inherited standing", "birthright-bearing, inherited, claim-received", "keeps birthright or judges inherited standing", "birthright claim, inherited mark", "birthright record or inheritance standing", "a beginning that arrives already carrying duty"],
    ["KDV", "Family", "custody, held care, lawful keeping of a child or dependent", "custody, keep in care, or hold lawful responsibility for a dependent", "custody, held care", "custodial, care-held, responsibility-bound", "keeps custody or receives dependent care", "custody order, held charge", "custody record or care placement", "holding someone without possession"],
    ["CLM", "Emotion", "calm, settled feeling, inward quiet after fear lowers", "calm, settle feeling, or lower fear into quiet", "calm, settled feeling", "calm, settled, fear-lowered", "calms or receives settled quiet", "calm breath, settled mood", "deescalation note or emotional-stability record", "the heart becoming spacious again"],
    ["PNJ", "Emotion", "panic, sudden fear flood, body alarm outrunning judgment", "panic, flood with fear, or lose judgment to alarm", "panic, fear flood", "panicked, alarm-flooded, judgment-outrun", "panics or steadies panic", "panic sign, fear surge", "crisis note or panic-risk record", "fear arriving faster than thought"],
    ["BDM", "Emotion", "boredom, underfilled attention, desire for meaningful engagement", "feel boredom, underfill attention, or hunger for engagement", "boredom, underfilled attention", "bored, underfilled, engagement-hungry", "bears boredom or restores engagement", "boredom sign, empty attention", "engagement note or morale finding", "attention asking for worthy weight"],
    ["JLS", "Emotion", "jealousy, guarded comparison, fear of losing beloved regard", "feel jealousy, guard comparison, or fear losing regard", "jealousy, guarded comparison", "jealous, comparison-guarded, regard-fearing", "bears jealousy or repairs comparison", "jealousy sign, guarded regard", "relational-risk note or conflict flag", "fear counting another's nearness"],
    ["SRT", "Emotion", "serenity, deep settled peace, inward order beyond immediate control", "be serene, settle deeply, or receive peace beyond control", "serenity, deep settled peace", "serene, deeply settled, peace-ordered", "keeps serenity or teaches deep peace", "serenity breath, settled presence", "wellbeing note or contemplative register", "peace that no longer needs to hurry"],
    ["RGM", "Emotion", "regret, backward sorrow, memory of choice asking repair", "regret, sorrow backward, or let memory ask repair", "regret, backward sorrow", "regretful, backward-sorrowing, repair-asking", "bears regret or receives remorse", "regret word, backward sorrow", "remorse statement or restorative note", "memory turning the will toward repair"]
  ];

  return seeds.map(([id, category, semanticField, action, concept, quality, agent, object, civic, intimate]) =>
    seedRoot(id, category, semanticField, action, concept, quality, agent, object, civic, intimate)
  );
}

function v1CoverageRoots() {
  const seeds = [
    ["DGN", "Moral agency", "dignity, intrinsic worth, personhood that must not be reduced to use", "dignify, protect worth, or refuse reduction of a person to utility", "dignity, intrinsic worth", "dignified, worth-bearing, personhood-protected", "guards dignity or restores visible worth", "dignity sign, protected worth", "dignity finding or protected-person standard", "the worth that asks to be seen before function"],
    ["BLY", "Moral agency", "blame, culpability, fault assigned after truthful judgment", "blame, assign fault, or name culpability after evidence", "blame, culpability", "blameworthy, fault-named, culpability-bearing", "assigns blame or receives culpability truthfully", "blame mark, fault finding", "culpability record or fault determination", "wrong named without contempt"],
    ["RVL", "Seeing/knowing", "revelation, disclosure, hidden truth brought into witness", "reveal, disclose, or bring hidden truth into witness", "revelation, disclosure", "revealed, disclosed, witness-brought", "reveals or receives disclosure", "revealed sign, disclosed truth", "disclosure record or transparency filing", "what was hidden becoming safe enough to face"],
    ["NDL", "Moral agency", "neglect, omitted care, duty left undone by inattention", "neglect, omit care, or leave duty undone by inattention", "neglect, omitted care", "neglectful, care-omitted, duty-left", "neglects care or detects omission", "neglect act, omitted duty", "neglect finding or care-failure record", "absence of care felt as a wound"],
    ["RFS", "Moral agency", "refusal, principled no, boundary spoken against wrongful demand", "refuse, say no, or set boundary against wrongful demand", "refusal, principled no", "refusing, boundary-spoken, wrongful-demand-resistant", "refuses or upholds a principled no", "refusal word, boundary mark", "refusal record or consent-withheld notice", "a no that protects the self without hiding"],
    ["SDK", "Technology", "software development kit, bundled tools for making systems", "kit software tools, prepare development instruments, or package builder interfaces", "software development kit, builder tools", "kit-bound, tool-bundled, development-ready", "maintains development kits or equips builders", "development kit, tool bundle", "SDK package record or developer-tool standard", "tools gathered so making can begin"],
    ["VNP", "Technology", "private network tunnel, protected path through public infrastructure", "tunnel network privately, protect traffic, or join systems through guarded path", "private network tunnel", "private-tunneled, protected-path, traffic-guarded", "keeps private tunnels or protects network passage", "private tunnel, guarded network path", "VPN access record or protected-network policy", "a hidden path opened only to the trusted"],
    ["DNS", "Technology", "domain name resolution, public naming that finds network place", "resolve names, map domains, or find network place by public name", "domain name resolution", "name-resolved, domain-mapped, place-found", "resolves names or maintains naming tables", "domain record, name mapping", "DNS record or naming-zone authority", "a name finding where it is meant to arrive"],
    ["XML", "Technology", "structured markup, tagged text carrying machine-readable form", "mark up, tag structure, or encode text for machine reading", "structured markup, tagged text", "marked-up, tagged, machine-readable", "marks structure or maintains tagged text", "markup document, tagged field", "XML schema record or markup interchange standard", "text wearing its structure visibly"],
    ["CSS", "Technology", "presentation style sheet, visible form separated from content", "style presentation, cascade visible rules, or separate form from content", "presentation style sheet", "styled, cascaded, form-separated", "styles interfaces or keeps presentation rules", "style rule, presentation sheet", "style-sheet standard or visual-rule record", "appearance disciplined without hiding meaning"],
    ["TLS", "Technology", "transport security, encrypted trust for messages in motion", "secure transport, encrypt passage, or protect messages in motion", "transport security", "encrypted, transport-secured, trust-carried", "secures transport or maintains encrypted channels", "secure channel, transport certificate", "TLS policy or encrypted-channel record", "trust placed around a moving word"],
    ["HTT", "Technology", "hypertext transfer, request and response across the web", "transfer hypertext, request resources, or answer across the web", "hypertext transfer", "web-transferred, request-bound, response-carried", "transfers web resources or keeps request-response service", "web request, transferred resource", "HTTP transaction record or web-service standard", "a call sent through the public web and answered"],
    ["HTP", "Technology", "hyperlink path, addressable web relation between texts", "link hypertext, make addressable paths, or connect web texts", "hyperlink path", "hyperlinked, addressable, web-connected", "keeps hyperlinks or designs addressable paths", "hyperlink, web address path", "link record or addressability standard", "one text reaching toward another by name"],
    ["JTK", "Technology", "signed access token, compact credential passed between systems", "tokenize access, sign credentials, or pass compact proof between systems", "signed access token", "signed, token-bound, access-proving", "issues signed tokens or validates access proof", "access token, signed credential", "token record or authorization credential standard", "permission carried as a small witnessed sign"],
    ["JSN", "Technology", "structured data object, readable machine exchange form", "structure data as objects, serialize exchange, or carry fields between systems", "structured data object", "serialized, field-bearing, exchange-readable", "keeps structured data or serializes exchange objects", "data object, field bundle", "JSON document record or data-exchange standard", "meaning placed in named fields"],
    ["RLS", "Technology", "release, published version, change made available under record", "release, publish version, or make change available under record", "release, published version", "released, published, version-available", "releases systems or governs publication", "release artifact, version publication", "release note or deployment approval record", "change allowed to leave the workshop"],
    ["RMM", "Technology", "working memory module, volatile system memory used during action", "hold working memory, allocate volatile state, or support action with temporary memory", "working memory module", "volatile, working-memory, action-held", "manages working memory or allocates volatile state", "memory module, temporary state", "RAM allocation record or memory-capacity standard", "memory that helps work and then lets go"],
    ["RWM", "Technology", "read-only memory, preserved device instruction that should not drift", "preserve read-only memory, store firmware, or keep device instruction stable", "read-only memory", "read-only, firmware-kept, drift-resistant", "keeps firmware memory or preserves stable instruction", "firmware image, read-only store", "ROM record or device-firmware standard", "memory kept so the machine remembers how to begin"],
    ["PYN", "Technology", "programming interface, callable boundary between systems", "interface programs, expose calls, or define callable boundaries", "programming interface", "callable, interface-bound, boundary-defined", "keeps interfaces or defines callable contracts", "API endpoint, callable boundary", "API contract or interface specification", "a doorway made for trustworthy calls"],
    ["GYF", "Technology", "graphical user interface, visible control surface for a system", "make graphical interface, surface controls, or guide users by visible form", "graphical user interface", "graphical, user-facing, control-surfaced", "designs interfaces or keeps visible controls", "interface screen, control surface", "GUI standard or accessibility review", "a machine made visible enough to touch with attention"],
    ["KBR", "Technology", "message broker, routed exchange point for distributed systems", "broker messages, route events, or mediate distributed exchange", "message broker", "brokered, routed, exchange-mediated", "brokers messages or maintains event routing", "broker queue, routed exchange", "message-broker record or event-routing standard", "a trusted middle path for many voices"],
    ["DKR", "Technology", "container runtime, isolated image execution for portable systems", "run containers, isolate images, or execute portable systems", "container runtime", "containerized, isolated, image-executed", "runs containers or maintains portable execution", "container image, runtime unit", "container-runtime record or image-execution policy", "a small bounded house for a working process"],
    ["CCH", "Technology", "client cookie, small state token remembered between requests", "set cookies, remember client state, or carry small request memory", "client cookie, request-state token", "cookie-bound, state-remembered, request-linked", "keeps client state or manages cookies", "cookie token, client state", "cookie consent record or client-state policy", "a tiny memory asking not to become hidden control"],
    ["TKN", "Technology", "token, symbolic credential, countable sign of access or meaning", "tokenize, issue symbolic credentials, or mark access with a countable sign", "token, symbolic credential", "tokenized, credential-bearing, sign-counted", "issues tokens or validates symbolic credentials", "token sign, credential marker", "token registry or access-token record", "a small sign that must answer for what it opens"],
    ["WKC", "Technology", "webhook callback, event call sent when a system changes", "webhook, call back on events, or notify systems by change", "webhook callback", "event-called, callback-bound, change-notifying", "keeps webhooks or sends callback events", "webhook call, event notice", "webhook subscription record or callback policy", "a system remembering to speak when something happens"],
    ["TCS", "Mind", "thesis, sustained claim, argument submitted to discipline", "form a thesis, sustain a claim, or submit argument to disciplined judgment", "thesis, sustained claim", "thesis-bearing, claim-sustained, argument-submitted", "sustains a thesis or examines a claim", "thesis statement, defended claim", "thesis record or academic submission", "a claim willing to be tested in public"],
    ["LCR", "Speech", "lecture, formal teaching speech, knowledge ordered for hearing", "lecture, teach formally, or order knowledge for public hearing", "lecture, formal teaching speech", "lecturing, formally taught, hearing-ordered", "lectures or receives formal teaching", "lecture text, teaching address", "lecture record or course-session notice", "knowledge shaped for those who have come to learn"],
    ["HMW", "Mind", "homework, assigned practice carried outside the lesson place", "assign homework, practice away, or carry learning beyond the lesson", "homework, assigned practice", "assigned, practice-carried, lesson-extended", "assigns homework or keeps practice", "homework task, practice sheet", "homework record or learning-assignment policy", "learning following the student home"],
    ["KWZ", "Mind", "quiz, brief test of attention and recall", "quiz, briefly test recall, or check attention in small form", "quiz, brief recall test", "quizzed, recall-checked, attention-tested", "quizzes or receives brief testing", "quiz item, recall check", "quiz record or assessment notice", "a small question guarding against forgetting"],
    ["CRD", "Law/civic life", "card credential, portable claim to payment, identity, or membership", "card, credential, or carry portable proof of claim", "card credential", "carded, credentialed, portable-claim-bearing", "issues cards or verifies portable credentials", "card, credential token", "card record or credential registry", "a claim small enough to carry"],
    ["CSH", "Law/civic life", "cash, immediate money, payment not waiting on later trust", "cash, pay immediately, or settle exchange with ready money", "cash, immediate money", "cash-paid, immediate, ready-settled", "keeps cash or settles immediate exchange", "cash payment, ready money", "cash receipt or immediate-payment record", "value placed in the hand without delay"],
    ["CHRT", "Seeing/knowing", "chart, visual data display, relation made visible for judgment", "chart, display data, or make relations visible for judgment", "chart, visual data display", "charted, data-visible, relation-displayed", "charts data or reads visual relations", "chart, plotted display", "chart record or data-visualization standard", "numbers given a face so attention can compare"],
    ["DLT", "Family", "adulthood, mature responsibility, standing after formation", "adult, mature in responsibility, or take standing after formation", "adulthood, mature responsibility", "adult, mature, responsibility-standing", "stands as adult or guides maturity", "adult role, mature standing", "adult-status record or age-of-responsibility rule", "freedom old enough to answer"],
    ["TNN", "Family", "adolescence, threshold youth, person between childhood and adulthood", "adolesce, stand in threshold youth, or move toward mature responsibility", "adolescence, threshold youth", "adolescent, threshold-standing, maturity-approaching", "guides adolescents or bears threshold youth", "teen role, youth threshold", "youth-status record or adolescent-care standard", "a person becoming faster than the world can name"],
    ["DRG", "Body", "drug, medicinal or controlled substance with power over the body", "drug, medicate, or administer substance with bodily power", "drug, medicinal substance", "medicinal, substance-bound, body-affecting", "administers drugs or stewards medicinal substances", "drug dose, controlled substance", "prescription record or controlled-substance registry", "power entering the body and asking for wisdom"],
    ["SLP", "Body", "sleep, bodily rest, lowered wakefulness for restoration", "sleep, rest bodily, or lower wakefulness for restoration", "sleep, bodily rest", "sleeping, rested, wakefulness-lowered", "sleeps or guards rest", "sleep interval, rest state", "sleep record or rest-health standard", "the body trusting the world enough to close its eyes"],
    ["XRC", "Body", "exercise, trained bodily effort for strength and health", "exercise, train the body, or strengthen through disciplined effort", "exercise, bodily training", "exercised, trained, strength-building", "exercises or trains bodily effort", "exercise set, training act", "exercise prescription or fitness record", "strength made by repeated willing"],
    ["SRG", "Body", "surgery, invasive healing, cutting done for restoration", "perform surgery, heal invasively, or cut for restoration", "surgery, invasive healing", "surgical, healing-cut, restoration-bound", "performs surgery or stewards invasive care", "surgical procedure, healing cut", "surgery record or operative consent", "a wound made so a deeper wound can close"],
    ["XRY", "Body", "x-ray imaging, hidden structure made visible by penetrating light", "x-ray, image hidden structure, or see inward form by penetrating light", "x-ray imaging", "x-rayed, structure-visible, inward-imaged", "images hidden structure or reads x-rays", "x-ray image, radiographic view", "imaging report or radiology record", "light entering where the eye cannot go"],
    ["GRF", "Emotion", "grief, love wounded by loss, memory aching for presence", "grieve, ache from loss, or carry love after absence", "grief, love-wounded loss", "grieving, loss-aching, love-wounded", "grieves or shelters another's grief", "grief sign, mourning word", "bereavement note or grief-care record", "love continuing after the face is gone"],
    ["WRY", "Emotion", "worry, anxious care, attention circling possible harm", "worry, circle possible harm, or hold anxious care", "worry, anxious care", "worried, harm-circling, care-anxious", "worries or steadies anxious care", "worry sign, anxious thought", "risk concern or anxiety note", "care unable to find rest"],
    ["FTH", "Ritual/poetry", "faith, entrusted trust, loyalty held before complete proof", "have faith, entrust trust, or remain loyal before complete proof", "faith, entrusted trust", "faithful, trust-entrusted, proof-waiting", "keeps faith or receives entrusted trust", "faith sign, trust pledge", "faith statement or trust-commitment record", "trust walking before sight has finished"],
    ["MCR", "Technology", "microservice, small bounded service in a distributed system", "compose microservices, bound service units, or divide system work into service parts", "microservice, bounded service", "service-bounded, distributed, small-unit", "maintains microservices or divides service work", "service unit, bounded endpoint", "microservice registry or service-boundary record", "a small servant made accountable for one task"],
    ["DYW", "Speech", "audio, heard media, sound carried for later hearing", "record audio, carry sound, or make speech available to hearing", "audio, heard media", "audible, sound-carried, hearing-ready", "records audio or stewards heard media", "audio file, sound record", "audio archive or accessibility record", "a voice kept so hearing can return"],
    ["SMN", "Mind", "seminar, shared advanced lesson, disciplined inquiry among learners", "seminar, inquire together, or teach by shared advanced exchange", "seminar, shared advanced lesson", "seminar-bound, inquiry-shared, advanced-learning", "leads seminars or joins disciplined inquiry", "seminar session, shared inquiry", "seminar record or graduate-course notice", "learning sharpened by many attentive minds"],
    ["VDY", "Speech", "video, moving image record, seen event carried across time", "record video, carry moving image, or preserve seen events", "video, moving image record", "videoed, moving-image, event-preserved", "records video or stewards moving images", "video file, moving image", "video archive or public-recording policy", "a sight taught to travel through time"],
    ["DBG", "Technology", "debugging, fault-finding in systems, error made repairable", "debug, find faults, or make errors repairable", "debugging, system fault-finding", "debugged, fault-found, repairable", "debugs systems or traces defects", "debug trace, fault note", "debug report or defect-resolution record", "patience walking through failure until the cause speaks"],
    ["RVW", "Seeing/knowing", "review, second looking, judgment after careful return", "review, look again, or judge after careful return", "review, second looking", "reviewed, return-seen, judgment-ready", "reviews work or receives second judgment", "review note, second reading", "review record or approval checkpoint", "attention returning because first sight was not enough"],
    ["DYT", "Body", "diet, ordered nourishment, habitual pattern of eating", "diet, order nourishment, or govern eating habits", "diet, ordered nourishment", "dietary, nourishment-ordered, eating-governed", "keeps diet or guides nourishment", "diet plan, nourishment pattern", "dietary record or nutrition standard", "care choosing what the body will become"],
    ["GNN", "Body", "gene, inherited biological instruction, bodily memory across generations", "mark genes, carry biological inheritance, or trace bodily memory across generations", "gene, inherited biological instruction", "genetic, inherited, body-memory-bearing", "studies genes or traces biological inheritance", "gene marker, inherited sequence", "genetic record or inheritance-risk note", "body memory older than the self"]
  ];

  return seeds.map(([id, category, semanticField, action, concept, quality, agent, object, civic, intimate]) =>
    seedRoot(id, category, semanticField, action, concept, quality, agent, object, civic, intimate)
  );
}

function v1BreadthRoots() {
  const seeds = [
    ["TCW", "Body", "tissue, living body fabric, cells joined into function", "tissue, join body fabric, or form living structure from cells", "tissue, living body fabric", "tissue-bound, cellular, body-woven", "studies tissue or repairs living structure", "tissue sample, body fabric", "pathology record or tissue-consent standard", "the body woven tightly enough to hold life"],
    ["BKT", "Body", "bacteria, microbial life, small organisms that can help or harm", "bacterialize, cultivate microbes, or guard against harmful microbes", "bacteria, microbial life", "bacterial, microbial, small-life-bearing", "studies bacteria or guards against infection", "bacterial culture, microbe sample", "infection-control record or microbial safety standard", "unseen life asking for careful boundaries"],
    ["MTB", "Body", "metabolism, bodily conversion, food and energy changed into life", "metabolize, convert nourishment, or turn energy into bodily life", "metabolism, bodily conversion", "metabolic, energy-converting, nourishment-turned", "studies metabolism or guides bodily conversion", "metabolic measure, energy pathway", "metabolic panel or nutrition-care record", "the hidden fire by which food becomes strength"],
    ["HRN", "Body", "hormone, body signal, chemical message regulating change", "signal hormonally, regulate bodily change, or carry chemical instruction", "hormone, body signal", "hormonal, regulated, chemical-message-bearing", "studies hormones or regulates bodily signals", "hormone marker, chemical signal", "endocrine record or hormone-treatment standard", "a quiet message moving through the body"],
    ["WTL", "Nature", "wetland, water-soil threshold, living margin between land and water", "wetland, hold water-soil threshold, or preserve marsh life", "wetland, water-soil threshold", "wetland, marsh-bound, water-soil", "keeps wetlands or restores marsh thresholds", "wetland basin, marsh habitat", "wetland protection record or watershed rule", "land soft enough to remember water"],
    ["RSTR", "Building/making", "restaurant, public meal house, shared eating under service", "serve meals publicly, host diners, or order shared eating", "restaurant, public meal house", "restaurant-bound, meal-serving, diner-hosting", "serves diners or stewards public meals", "dining room, public table", "restaurant license or food-service record", "a table widened beyond the household"],
    ["KTC", "Building/making", "kitchen, food-making room, hearth ordered for nourishment", "kitchen, prepare food, or order household making around nourishment", "kitchen, food-making room", "kitchen-bound, food-making, hearth-ordered", "keeps kitchens or prepares household nourishment", "kitchen tool, food-making place", "kitchen inspection or food-safety standard", "the room where care becomes food"],
    ["BTH", "Building/making", "bathroom, washing room, private place of bodily cleaning", "bathe, wash privately, or order bodily cleaning space", "bathroom, washing room", "bathroom-bound, washed, privacy-kept", "keeps washing rooms or guards bodily privacy", "bath, washing station", "sanitation record or bathroom access standard", "privacy given water and dignity"],
    ["SLD", "Nature", "island, land surrounded by water, bounded dwelling-place", "island, surround land by water, or dwell within a bounded place", "island, water-bounded land", "islanded, water-bounded, apart-standing", "keeps islands or maps bounded land", "island shore, bounded land", "island jurisdiction or coastal-protection record", "a world held apart by water"],
    ["VLJ", "Law/civic life", "village, small settlement, face-known civic life", "village, settle in small community, or order face-known civic life", "village, small settlement", "village-bound, neighbor-known, small-settled", "keeps villages or stewards local settlement", "village square, local settlement", "village charter or local-service record", "a people small enough for names to matter"],
    ["NCR", "Law/civic life", "insurance, pooled risk, promise of repair after loss", "insure, pool risk, or promise repair after loss", "insurance, pooled risk", "insured, risk-pooled, loss-repairing", "insures or stewards pooled risk", "insurance policy, risk pool", "insurance contract or claims record", "many households standing near one future wound"],
    ["NVST", "Law/civic life", "investment, entrusted capital, provision placed toward future return", "invest, entrust capital, or place provision toward future return", "investment, entrusted capital", "invested, capital-entrusted, future-returning", "invests or stewards capital entrusted to the future", "investment stake, capital trust", "investment disclosure or fiduciary record", "provision sent ahead to work before us"],
    ["BJT", "Law/civic life", "budget, named limits, provision ordered before spending", "budget, set limits, or order provision before spending", "budget, named provision limits", "budgeted, limit-named, provision-ordered", "budgets or stewards spending limits", "budget line, spending limit", "budget record or public appropriation", "desire taught to count before taking"],
    ["RCP", "Law/civic life", "receipt, proof of exchange, small record of what was given", "receipt, record exchange, or prove what was given", "receipt, exchange proof", "receipted, exchange-recorded, proof-bearing", "issues receipts or keeps exchange proof", "receipt slip, exchange record", "receipt record or payment evidence", "a small memory that protects trust"],
    ["DVS", "Technology", "device, hardware unit, made tool with bounded function", "device, configure hardware, or make a bounded tool work", "device, hardware unit", "device-bound, hardware-made, function-bounded", "maintains devices or configures hardware", "device unit, appliance", "device registry or hardware-compliance record", "a tool with its own small body"],
    ["BRW", "Technology", "browser, web-reading instrument, interface for traversing linked texts", "browse, read the web, or traverse linked texts by interface", "browser, web-reading instrument", "browser-bound, web-reading, link-traversing", "browses or maintains web-reading tools", "browser window, web client", "browser support record or web-accessibility standard", "a window taught to walk through texts"],
    ["PSW", "Technology", "password, secret access word, hidden sign for entry", "password, guard access by secret word, or verify entry through hidden sign", "password, secret access word", "password-bound, secret, access-guarded", "keeps passwords or verifies secret access", "password phrase, secret credential", "password policy or credential record", "a word hidden so a door can know its speaker"],
    ["LGN", "Technology", "login, entry session, named arrival into a system", "log in, enter a system, or begin a named session", "login, entry session", "logged-in, session-entered, named-arrival", "logs in or maintains entry sessions", "login prompt, entry session", "login record or access audit", "a threshold crossed by a named self"],
    ["NTF", "Technology", "notification, attention signal, message asking to be noticed", "notify, signal attention, or send a noticed message", "notification, attention signal", "notified, attention-signaled, message-sent", "notifies or manages alerts", "notification alert, attention message", "notification record or alert policy", "a small call pulling attention toward consequence"],
    ["DBD", "Technology", "dashboard, control display, gathered measures for action", "dashboard, gather measures, or display controls for action", "dashboard, control display", "dashboarded, measure-gathered, control-visible", "keeps dashboards or gathers action measures", "dashboard panel, control display", "dashboard record or monitoring standard", "many signs brought into one field of attention"],
    ["TRNL", "Technology", "terminal, command line, text gate for system action", "terminal, command by text, or act through a system gate", "terminal, command line", "terminal-bound, text-commanded, system-gated", "uses terminals or maintains command environments", "terminal prompt, command gate", "terminal access record or shell policy", "a narrow gate where words move machines"],
    ["JRY", "Law/civic life", "jury, sworn judging body, citizens gathered to weigh truth", "jury, judge as citizens, or weigh truth in a sworn body", "jury, sworn judging body", "juried, citizen-judged, truth-weighed", "serves on juries or stewards citizen judgment", "jury panel, sworn body", "jury summons or trial-record standard", "the people gathered to listen before judgment"],
    ["WLF", "Law/civic life", "welfare, public care, provision for vulnerable life", "welfare, provide public care, or guard vulnerable life by policy", "welfare, public care", "welfare-bound, publicly cared-for, vulnerability-guarding", "stewards welfare or receives public care", "welfare benefit, public support", "welfare record or public-care standard", "the people refusing to abandon the vulnerable"],
    ["KYC", "Law/civic life", "customer verification, identity check for trusted exchange", "verify customers, check identity, or guard exchange against hidden fraud", "customer verification, identity check", "verified, identity-checked, exchange-guarded", "verifies customers or audits exchange identity", "identity check, verification file", "customer-verification record or anti-fraud rule", "commerce asking who stands behind the name"],
    ["DCK", "Technology", "dock, attachment station, place where systems or vessels connect", "dock, attach systems, or bring vessels into connection", "dock, attachment station", "docked, attached, connection-stationed", "docks vessels or connects systems", "dock port, attachment station", "dock record or connection standard", "a place made for arrival to become joining"],
    ["WHS", "Building/making", "warehouse, stored provision, large house for goods before use", "warehouse, store goods, or keep provision before distribution", "warehouse, stored provision", "warehoused, stored, provision-kept", "keeps warehouses or stores provision", "warehouse bay, stored goods", "warehouse inventory or storage-safety record", "a house where future use waits"],
    ["CHN", "Building/making", "chain, linked sequence, many parts held in order", "chain, link parts, or hold many steps in ordered sequence", "chain, linked sequence", "chained, linked, sequence-held", "chains steps or stewards linked systems", "chain link, ordered sequence", "supply-chain record or custody chain", "many small bindings making one path"],
    ["TMM", "Nature", "atom, smallest chemical unit, matter counted at hidden scale", "atomize, mark smallest matter, or count chemical units", "atom, smallest chemical unit", "atomic, unit-bound, matter-counted", "studies atoms or traces matter units", "atom mark, matter unit", "atomic record or material-safety standard", "matter made small enough for thought to count"],
    ["TMC", "Nature", "element, chemical kind, matter family in ordered table", "elementalize, classify matter, or name chemical kinds", "element, chemical kind", "elemental, matter-classed, table-ordered", "studies elements or classifies matter", "element symbol, chemical kind", "element record or laboratory-material standard", "a family of matter with a name"],
    ["CYT", "Body", "cell, living unit, small body capable of life process", "cell, form living units, or trace small bodies of life", "cell, living unit", "cellular, living-unit, life-process-bearing", "studies cells or repairs cellular life", "cell sample, living unit", "cell record or biomedical consent standard", "a little room where life keeps working"],
    ["MLC", "Nature", "molecule, bonded atoms, matter relation made stable", "molecularize, bond atoms, or trace stable matter relations", "molecule, bonded atoms", "molecular, atom-bonded, matter-related", "studies molecules or traces chemical bonds", "molecule structure, bonded unit", "molecular record or chemical-analysis standard", "atoms holding hands long enough to matter"],
    ["YMN", "Body", "immunity, bodily defense memory, protection learned against harm", "immunize, defend bodily memory, or learn protection against infection", "immunity, bodily defense memory", "immune, defense-remembering, infection-guarded", "studies immunity or strengthens defense memory", "immune response, protection marker", "immunity record or vaccination standard", "the body remembering how to refuse harm"],
    ["MJN", "Nature", "migration, seasonal movement, life traveling by inherited pattern", "migrate, move seasonally, or follow inherited travel pattern", "migration, seasonal movement", "migratory, season-moving, pattern-following", "migrates or tracks seasonal movement", "migration path, seasonal route", "migration record or habitat-protection rule", "memory moving through bodies across distance"],
    ["RYF", "Nature", "reef, living sea barrier, coral city under water", "reef, build living sea barrier, or shelter life under water", "reef, living sea barrier", "reef-bound, coral-sheltered, sea-living", "keeps reefs or restores coral barriers", "reef shelf, coral shelter", "reef protection record or marine habitat rule", "a city of life below the waves"],
    ["WLDN", "Nature", "wildland, uncultivated land, living place not fully governed by human order", "wildland, leave land uncultivated, or preserve unmanaged life", "wildland, uncultivated land", "wildland, unmanaged, human-order-light", "keeps wildlands or studies unmanaged life", "wildland tract, uncultivated place", "wildland reserve or fire-management record", "land still speaking before our plans"],
    ["DVN", "Law/civic life", "dividend, shared return, profit distributed to holders", "dividend, distribute return, or share profit by claim", "dividend, shared return", "dividend-bearing, return-shared, claim-distributed", "distributes dividends or accounts shared return", "dividend payment, return share", "dividend record or investor-distribution notice", "gain returning to those who carried risk"],
    ["TRV", "Law/civic life", "tariff, border tax, charge placed on crossing goods", "tariff, tax crossing goods, or price a border exchange", "tariff, border tax", "tariffed, border-priced, crossing-charged", "sets tariffs or audits crossing charges", "tariff line, border charge", "tariff schedule or customs record", "a border asking exchange to answer publicly"],
    ["PRY", "Law/civic life", "property, held claim, thing stewarded under recognized standing", "own property, hold claim, or steward a thing under recognized standing", "property, held claim", "propertied, claim-held, stewardship-bound", "holds property or judges standing claims", "property parcel, held thing", "property record or title registry", "what is held with duty, not merely possessed"],
    ["NVD", "Law/civic life", "invoice, payment request, named account of what is owed", "invoice, request payment, or name an account of what is owed", "invoice, payment request", "invoiced, account-named, payment-asked", "issues invoices or settles named accounts", "invoice bill, payment request", "invoice record or accounts-payable standard", "a request that names the debt before trust thins"],
    ["BCL", "Technology", "bicycle, two-wheel vehicle, human-powered motion", "bicycle, move by two wheels, or carry self by human power", "bicycle, two-wheel vehicle", "bicycled, two-wheeled, human-powered", "rides bicycles or keeps human-powered vehicles", "bicycle frame, two-wheel vehicle", "bicycle lane record or mobility-safety standard", "a small machine moved by the body's will"],
    ["TXY", "Law/civic life", "taxi, hired ride, public vehicle serving individual travel", "taxi, hire a ride, or carry persons by public fare", "taxi, hired ride", "taxi-bound, fare-hired, person-carrying", "drives taxis or governs hired rides", "taxi car, hired vehicle", "taxi license or ride-fare record", "a public road made briefly personal"],
    ["LDG", "Building/making", "lodging, temporary dwelling, paid shelter for travelers", "lodge, shelter travelers, or keep temporary dwelling", "lodging, temporary dwelling", "lodged, temporary-sheltered, traveler-kept", "keeps lodging or hosts travelers", "lodging room, guest shelter", "lodging license or guest-safety record", "a borrowed home for a passing night"],
    ["TWL", "Body", "towel, drying cloth, fabric for water after washing", "towel, dry with cloth, or carry water from the body", "towel, drying cloth", "toweled, dried, water-carried", "keeps towels or dries after washing", "towel cloth, drying fabric", "sanitation record or linen standard", "cloth receiving water from skin"],
    ["WSH", "Body", "washing, cleansing with water, bodily and household cleaning", "wash, cleanse with water, or remove uncleanness by care", "washing, cleansing with water", "washed, cleansed, water-cleared", "washes or keeps cleansing practice", "wash basin, cleansing act", "washing standard or sanitation record", "water used so dignity can return to touch"],
    ["SHP", "Law/civic life", "shop, small trade place, public room of buying and selling", "shop, trade in small place, or offer goods for public exchange", "shop, small trade place", "shop-bound, trade-offered, public-exchange", "keeps shops or trades goods", "shop counter, trade room", "shop license or retail record", "a room where need meets provision"],
    ["CTF", "Law/civic life", "certificate, attested credential, document proving status or completion", "certify, attest status, or issue proof of completion", "certificate, attested credential", "certified, attested, status-proven", "certifies or verifies credentials", "certificate document, attestation", "certificate registry or credential standard", "a public word saying the work has been seen"],
    ["SYN", "Technology", "session, bounded interaction, active period of system relation", "session, begin bounded interaction, or hold active system relation", "session, bounded interaction", "session-bound, active, relation-held", "keeps sessions or manages active interactions", "session token, active relation", "session record or timeout policy", "a temporary relation with a machine"],
    ["TBB", "Technology", "tab, small workspace, browser-held surface among many", "tab, open a small workspace, or hold many surfaces in one window", "tab, small workspace", "tabbed, workspace-held, window-contained", "uses tabs or manages workspace surfaces", "browser tab, workspace surface", "tab state record or interface standard", "one small page kept among many"],
    ["TRD", "Technology", "thread, concurrent strand, ordered line of work or conversation", "thread, run concurrent work, or follow an ordered strand", "thread, concurrent strand", "threaded, strand-ordered, concurrent", "keeps threads or traces ordered strands", "thread id, work strand", "thread trace or concurrency record", "one line of action inside a larger making"],
    ["LCK", "Technology", "lock, access closure, mechanism that prevents unchosen entry", "lock, close access, or prevent unchosen entry", "lock, access closure", "locked, access-closed, entry-guarded", "locks systems or stewards closures", "lock keyway, access barrier", "lock record or access-control standard", "a no built into a door"]
  ];

  return seeds.map(([id, category, semanticField, action, concept, quality, agent, object, civic, intimate]) =>
    seedRoot(id, category, semanticField, action, concept, quality, agent, object, civic, intimate)
  );
}

function v1DomainDepthRoots() {
  const seeds = [
    ["HWR", "Technology", "hardware, physical computing device, material machine substrate", "handle hardware, provision devices, or make computation bodily", "hardware, physical computing substrate", "hardware-bound, material, device-bearing", "keeps hardware or stewards device fleets", "hardware device, machine component", "hardware inventory or device stewardship record", "the machine made tangible enough to repair"],
    ["FMW", "Technology", "firmware, embedded instruction, low-level device memory", "flash firmware, embed instruction, or govern devices from within", "firmware, embedded device instruction", "firmware-bound, embedded, low-level", "keeps firmware or audits embedded instruction", "firmware image, device instruction", "firmware release or embedded-system standard", "hidden instruction that still must answer"],
    ["KMT", "Technology", "commit, accepted change, recorded unit of source memory", "commit changes, record source work, or bind code to history", "commit, recorded source change", "committed, recorded, source-bound", "commits code or keeps source history", "commit hash, change unit", "commit record or version-control evidence", "a small act made answerable to future builders"],
    ["PLR", "Technology", "pull request, reviewed change proposal, collaborative code petition", "open a pull request, request review, or submit change for joining", "pull request, reviewed change proposal", "review-pending, proposed, join-seeking", "opens pull requests or reviews proposed changes", "pull request thread, change petition", "pull request record or review gate", "work asking to be seen before it enters the shared body"],
    ["SVC", "Technology", "service, running capability, bounded system function offered to others", "serve through software, expose capability, or operate a bounded function", "service, running system capability", "service-bound, operating, capability-offering", "keeps services or operates system functions", "service endpoint, running capability", "service-level record or operational mandate", "power offered only while it remains reliable"],
    ["RLB", "Technology", "rollback, restored prior state, reversal after failed change", "roll back change, restore prior state, or undo failed release", "rollback, restored prior state", "rolled-back, restored, failure-reversed", "performs rollbacks or guards recovery", "rollback point, restored version", "rollback record or recovery procedure", "humility built into making"],
    ["VZN", "Technology", "visualization, data made visible, pattern shown for judgment", "visualize data, render patterns, or make measures visible", "visualization, visible data pattern", "visualized, rendered, pattern-shown", "creates visualizations or interprets data displays", "chart view, rendered pattern", "visualization standard or public data display", "number given a face so attention can answer"],
    ["BZV", "Technology", "observability, instrumented seeing, system made inspectable", "observe systems, instrument traces, or make operations inspectable", "observability, instrumented system seeing", "observable, instrumented, inspectable", "keeps observability or reads system signals", "telemetry signal, observation surface", "observability record or operational evidence rule", "hidden work agreeing to be witnessed"],
    ["KFT", "Technology", "keyfile, secret-bearing credential file, guarded access material", "keep keyfiles, guard credentials, or authorize by secret material", "keyfile, guarded credential material", "keyfile-bound, credentialed, access-guarded", "keeps keyfiles or stewards credential files", "keyfile path, secret credential", "credential custody record or keyfile rotation rule", "trust held in a file that must not be careless"],
    ["WBS", "Technology", "websocket, live channel, persistent two-way web relation", "open websockets, stream live messages, or keep persistent web channels", "websocket, live two-way channel", "websocket-bound, live, channel-held", "keeps websockets or manages live channels", "websocket connection, live stream", "websocket record or realtime protocol standard", "conversation made continuous between machines"],
    ["WSR", "Technology", "web server, public request answerer, hosted speech machine", "serve web requests, host public pages, or answer network calls", "web server, public request answerer", "server-bound, hosted, request-answering", "keeps web servers or hosts public services", "web server process, hosted endpoint", "server log or hosting standard", "a machine that answers when the public knocks"],
    ["KLS", "Technology", "cluster, coordinated machines, shared compute body", "cluster machines, coordinate nodes, or distribute compute work", "cluster, coordinated compute body", "clustered, distributed, node-bound", "keeps clusters or coordinates machine groups", "cluster node, compute group", "cluster record or orchestration standard", "many machines disciplined into one answer"],
    ["HSN", "Technology", "hashing, digest, integrity fingerprint, fixed proof of content", "hash content, digest data, or prove integrity by fingerprint", "hashing, integrity digest", "hashed, digested, fingerprinted", "hashes data or verifies integrity proofs", "hash digest, content fingerprint", "hash record or integrity check standard", "memory compressed into a mark of honesty"],
    ["MDC", "Technology", "metadata, data about data, context carried beside record", "metadata, annotate records, or carry context beside data", "metadata, contextual data about data", "metadata-bearing, annotated, context-kept", "keeps metadata or annotates records", "metadata field, record context", "metadata schema or archival description rule", "a record remembering how it should be read"],
    ["FSN", "Technology", "filesystem, ordered file space, named storage hierarchy", "organize filesystems, store paths, or order named storage", "filesystem, named storage hierarchy", "filesystem-bound, path-ordered, stored", "keeps filesystems or stewards storage trees", "file path, storage node", "filesystem record or storage policy", "memory given rooms and corridors"],
    ["BLB", "Technology", "blob, opaque binary object, stored unstructured content", "store blobs, carry opaque data, or preserve binary objects", "blob, opaque binary content", "blob-like, binary, unstructured", "keeps blobs or manages object storage", "blob object, binary payload", "blob store record or object-retention rule", "what is kept before it can be interpreted"],
    ["PBL", "Mind", "probability, measured uncertainty, possible outcome under discipline", "probabilize, weigh uncertainty, or reason by possible outcomes", "probability, disciplined uncertainty", "probable, uncertain-measured, outcome-weighed", "calculates probability or judges uncertainty", "probability value, outcome weight", "probability model or risk evidence record", "not knowing made honest enough to guide action"],
    ["CMX", "Mind", "complexity, many-part relation, difficulty of ordered understanding", "complexify, measure complexity, or reason across many relations", "complexity, many-part relation", "complex, many-related, difficult-to-order", "studies complexity or simplifies many-part systems", "complex system, relation tangle", "complexity assessment or systems report", "many duties refusing false simplicity"],
    ["LNR", "Mind", "linearity, proportional relation, straight change and its limits", "linearize, measure proportion, or test straight relation", "linearity, proportional relation", "linear, proportional, straight-changing", "studies linearity or detects nonlinear break", "linear model, proportional path", "linearity finding or model assumption record", "a straight promise checked against the world"],
    ["CHM", "Mind", "chemistry, material transformation, substances bonded and changed", "study chemistry, transform substances, or reason by material bonds", "chemistry, material transformation", "chemical, substance-bound, transformation-bearing", "studies chemistry or stewards substances", "chemical compound, reaction vessel", "chemical record or material safety standard", "matter meeting matter under accountable change"],
    ["BYL", "Mind", "biology, living systems, ordered study of life", "study biology, classify life, or reason by living systems", "biology, living systems study", "biological, life-system, organismic", "studies biology or keeps living classifications", "biological sample, living system", "biology record or life-science standard", "life seen as order rather than mere material"],
    ["VLV", "Nature", "evolution, inherited change, life altered across generations", "evolve, adapt by inheritance, or trace generational change", "evolution, inherited change", "evolved, adaptive, generation-shaped", "studies evolution or traces inherited change", "evolutionary line, adaptive trait", "evolution record or biodiversity history", "memory written by life into future bodies"],
    ["PHS", "Mind", "physics, force and matter, measured structure of natural power", "study physics, measure forces, or reason by matter and motion", "physics, measured matter and force", "physical, force-measured, matter-bound", "studies physics or measures natural force", "physical system, force measurement", "physics record or measurement standard", "power humbled by measure"],
    ["STB", "Mind", "stability, resistance to disturbance, persistence under pressure", "stabilize, resist disturbance, or test persistence under pressure", "stability, pressure-resistant persistence", "stable, disturbance-resistant, persistent", "stabilizes systems or measures resilience", "stable state, resilience margin", "stability report or safety margin record", "what remains answerable when shaken"],
    ["NLC", "Mind", "nucleus, central body, core around which parts are ordered", "nucleate, center a system, or order parts around a core", "nucleus, central ordering body", "nuclear, centered, core-bound", "studies nuclei or keeps core structures", "nucleus, system core", "nuclear record or core-safety rule", "the center that must not pretend to be the whole"],
    ["GLB", "Nature", "globe, planet-scale whole, world held as one body", "globalize, view planet-scale, or bind local acts to the whole world", "globe, planet-scale whole", "global, planet-wide, whole-world", "works globally or keeps planet-scale measures", "globe map, planetary body", "global standard or planet-scale account", "local action seen under the world's face"],
    ["RGL", "Law/civic life", "regulation, public rule for recurring conduct, administered boundary", "regulate conduct, set recurring rule, or administer public boundaries", "regulation, recurring public rule", "regulated, rule-bound, administered", "regulates conduct or stewards rule systems", "regulation text, compliance boundary", "regulatory code or administrative rule", "power slowed into inspectable rule"],
    ["TND", "Law/civic life", "tender, public bid, offered provision under procurement rule", "tender bids, solicit provision, or offer service under rule", "tender, public bid", "tendered, bid-offered, procurement-bound", "tenders bids or evaluates procurement offers", "tender document, public bid", "tender record or procurement notice", "provision asking to be chosen in public light"],
    ["DBT", "Law/civic life", "debt, owed provision, obligation measured in exchange", "owe debt, lend against future payment, or reckon owed provision", "debt, owed provision", "indebted, owed, exchange-bound", "keeps debts or settles owed provision", "debt note, balance owed", "debt record or repayment obligation", "the future claimed by past provision"],
    ["CPN", "Law/civic life", "compensation, repair payment, provision answering harm or labor", "compensate, pay for labor, or repair harm through provision", "compensation, answering provision", "compensated, paid, harm-answering", "compensates labor or calculates repair payment", "compensation amount, repair payment", "compensation order or wage remedy record", "provision saying the cost was seen"],
    ["RCN", "Conflict/repair", "reconstruction, rebuilding after damage, public repair of broken order", "reconstruct, rebuild after damage, or restore broken public form", "reconstruction, post-break repair", "reconstructed, rebuilt, damage-repaired", "reconstructs damaged systems or stewards public rebuilding", "reconstruction plan, rebuilt structure", "reconstruction mandate or disaster-repair record", "repair large enough for a whole people to enter again"],
    ["RGN", "Law/civic life", "region, bounded public area, named administrative or cultural field", "regionalize, govern an area, or name a bounded public field", "region, bounded public area", "regional, area-bound, public-field", "keeps regions or administers bounded areas", "regional map, public area", "regional jurisdiction or planning record", "place treated as a responsibility"],
    ["LCL", "Law/civic life", "locality, near civic place, immediate public belonging", "localize, govern nearby, or root action in a near place", "locality, near civic place", "local, nearby, place-rooted", "keeps local offices or serves nearby publics", "local district, neighborhood place", "local ordinance or municipal record", "duty close enough to know faces"],
    ["KBF", "Building/making", "cupboard, household storage, kept place for ordinary provision", "store in cupboards, keep household goods, or order small provision", "cupboard, household storage", "cupboard-kept, stored, household-ordered", "keeps cupboards or orders household stores", "cupboard shelf, stored provision", "household inventory or storage standard", "ordinary provision remembered in its place"],
    ["CWR", "Body", "shower, cleansing spray, water falling for bodily renewal", "shower, cleanse by spray, or rinse the body with falling water", "shower, cleansing spray", "showered, rinsed, water-cleansed", "keeps showers or washes by spray", "shower stall, cleansing water", "sanitation fixture record or bathing standard", "water falling so the body can begin again"],
    ["GRC", "Law/civic life", "grocery, everyday provisions, small market of food and household need", "grocery-shop, provision households, or trade ordinary necessities", "grocery, everyday provision market", "grocery-bound, provisioned, household-supplying", "keeps groceries or provisions households", "grocery item, provision shelf", "grocery license or food-supply record", "need meeting provision before hunger becomes fear"],
    ["LND", "Body", "laundry, washed fabric, household cycle of clothing care", "launder, wash fabric, or renew household cloth", "laundry, washed household fabric", "laundered, fabric-cleaned, household-renewed", "keeps laundry or washes household cloth", "laundry load, washed garment", "laundry standard or textile sanitation record", "care returning dignity to what touches skin"],
    ["KRW", "Travel/place", "commute, repeated work journey, daily path between home and labor", "commute, repeat the work path, or travel between home and labor", "commute, repeated work journey", "commuting, repeated, work-path", "commutes or organizes work journeys", "commute route, work path", "commute record or transit planning measure", "labor's path remembered by the body"],
    ["NRT", "Speech", "narrative, ordered story, meaning carried through sequence", "narrate, order story, or carry meaning through sequence", "narrative, ordered story", "narrative, story-ordered, sequence-bearing", "narrates events or shapes stories", "narrative arc, story sequence", "narrative record or public account", "memory learning how one thing followed another"],
    ["RHT", "Speech", "rhetoric, persuasive speech, form that moves public judgment", "speak rhetorically, persuade, or shape judgment by form", "rhetoric, persuasive speech craft", "rhetorical, persuasive, form-moving", "uses rhetoric or studies persuasive speech", "rhetorical figure, persuasive turn", "rhetoric record or civic speech standard", "speech carrying power and therefore owing truth"],
    ["GNR", "Ritual/poetry", "genre, form-kind, shared expectation for art or speech", "genre, classify by form, or write within a shared kind", "genre, form-kind", "generic, form-kind, expectation-bound", "keeps genres or teaches form-kinds", "genre label, form family", "genre standard or publication category", "a tradition's doorway into new making"],
    ["DRM", "Ritual/poetry", "drama, enacted story, conflict shown through embodied speech", "dramatize, stage story, or enact conflict before attention", "drama, enacted story", "dramatic, staged, conflict-shown", "performs drama or writes staged conflict", "dramatic scene, staged act", "drama record or performance license", "conflict given form so a people can see itself"],
    ["THY", "Ritual/poetry", "theology, disciplined speech about the sacred, doctrine before ultimate witness", "theologize, reason about sacred witness, or order doctrine of ultimate things", "theology, disciplined sacred speech", "theological, sacred-reasoned, witness-bound", "studies theology or keeps sacred doctrine", "theological claim, doctrine of witness", "theological record or sacred teaching standard", "awe made careful enough to teach"],
    ["WLK", "Body", "walking, gait, ordinary movement by foot and balance", "walk, move by foot, or keep bodily pace", "walking, gait, footed movement", "walking, gaited, pace-bearing", "walks or teaches gait and balance", "walk path, gait step", "mobility record or pedestrian standard", "a body choosing a path one step at a time"],
    ["RCPY", "Building/making", "recipe, ordered making instruction, remembered way to prepare food or craft", "recipe, order preparation, or preserve making steps", "recipe, ordered preparation memory", "recipe-bound, step-ordered, preparation-kept", "keeps recipes or teaches preparation steps", "recipe card, making instruction", "recipe record or food-preparation standard", "care made repeatable without losing the hand"],
    ["FRZ", "Nature", "freezing, cold solidification, water or matter held by cold", "freeze, solidify by cold, or preserve through low temperature", "freezing, cold solidification", "frozen, cold-held, solidified", "freezes goods or studies cold change", "ice point, frozen state", "cold-chain record or freezing standard", "stillness forced by cold until warmth returns"],
    ["HTY", "Future/civilization", "heritage, carried public inheritance, cultural memory entrusted forward", "preserve heritage, steward public inheritance, or carry culture forward", "heritage, entrusted cultural inheritance", "heritage-bearing, inherited, culture-carried", "keeps heritage or stewards inherited culture", "heritage site, inherited treasure", "heritage registry or preservation mandate", "the past asking not to be wasted"],
    ["MPR", "Seeing/knowing", "map, representation of relation, place or system made navigable", "map relations, represent place, or make a system navigable", "map, navigable representation", "mapped, represented, relation-shown", "maps places or systems", "map layer, representation", "map record or spatial data standard", "attention arranged so a path can be chosen"],
    ["SNG", "Ritual/poetry", "song, voiced melody, memory carried by tune", "sing, voice melody, or carry memory by tune", "song, voiced melody", "sung, melodic, voice-carried", "sings or keeps songs", "song line, melody body", "song archive or performance record", "truth made memorable by breath"],
    ["RYT", "Ritual/poetry", "rhythm, patterned beat, time made bodily and repeatable", "rhythm, beat time, or pattern movement by recurring stress", "rhythm, patterned beat", "rhythmic, beat-patterned, time-bodied", "keeps rhythm or teaches patterned beat", "rhythm pattern, beat cycle", "rhythm notation or performance standard", "time entering the body so memory can move"]
  ];

  return seeds.map(([id, category, semanticField, action, concept, quality, agent, object, civic, intimate]) =>
    seedRoot(id, category, semanticField, action, concept, quality, agent, object, civic, intimate)
  );
}

function v1EntryGateRoots() {
  const seeds = [
    ["RKC", "Technology", "orchestration, coordinated services, many tools ordered into one action", "orchestrate services, coordinate tools, or order many actions together", "orchestration, coordinated service order", "orchestrated, coordinated, many-action", "orchestrates services or coordinates tools", "orchestration plan, coordinated run", "orchestration record or operational mandate", "many helpers made answerable to one purpose"],
    ["PMN", "Technology", "permission, access grant, authorized capability boundary", "permit access, grant capability, or constrain entry by rule", "permission, access grant", "permitted, authorized, access-bound", "grants permissions or stewards access boundaries", "permission flag, access grant", "permission record or authorization policy", "a yes that remembers the boundary around it"],
    ["PVR", "Technology", "provenance, origin trail, source lineage of data or artifact", "trace provenance, prove origin, or carry source lineage", "provenance, source lineage", "provenance-bearing, origin-traced, source-kept", "keeps provenance or verifies source lineage", "provenance trail, origin proof", "provenance record or evidence chain", "memory that refuses to hide where it came from"],
    ["CPL", "Law/civic life", "compliance, answerable conformity to rule, duty met under inspection", "comply, conform to rule, or prove duty under inspection", "compliance, answerable rule-conformity", "compliant, rule-answering, inspected", "keeps compliance or inspects rule-conformity", "compliance mark, rule evidence", "compliance filing or regulatory attestation", "obedience made visible enough to judge"],
    ["DZR", "Law/civic life", "disclosure, required revelation, public making-known of relevant truth", "disclose, reveal required truth, or make relevant facts public", "disclosure, required revelation", "disclosed, publicly revealed, relevance-bound", "makes disclosures or receives public facts", "disclosure statement, revealed fact", "disclosure record or transparency requirement", "truth brought out before silence can deceive"],
    ["ZNV", "Law/civic life", "zoning, land-use boundary, civic placement of activity", "zone land, assign civic use, or bound public placement", "zoning, civic land-use order", "zoned, place-bound, use-assigned", "sets zoning or stewards land-use boundaries", "zone map, permitted use", "zoning ordinance or land-use record", "place given duties before it is built upon"],
    ["PMT", "Law/civic life", "permit, licensed permission, formal authorization for an act", "permit formally, license action, or authorize under public rule", "permit, licensed permission", "permitted, licensed, formally authorized", "issues permits or verifies licenses", "permit document, license grant", "permit record or licensing condition", "permission carrying a public name"],
    ["SNK", "Law/civic life", "sanction, formal consequence, authorized penalty or recognition", "sanction, penalize, or formally recognize under authority", "sanction, formal consequence", "sanctioned, penalized, authority-marked", "imposes sanctions or records formal consequence", "sanction order, penalty mark", "sanction record or disciplinary finding", "consequence made public so power cannot pretend"],
    ["RDV", "Law/civic life", "ordinance, local rule, civic instruction for near common life", "ordain locally, set municipal rule, or instruct civic conduct", "ordinance, local civic rule", "ordinance-bound, local, rule-instructed", "keeps ordinances or drafts local rules", "ordinance text, local rule", "municipal ordinance or local code record", "the near rule that must know nearby faces"],
    ["TRJ", "Body", "triage, urgent sorting, priority of care under scarcity", "triage, sort urgency, or assign care priority", "triage, urgent care priority", "triaged, urgency-sorted, priority-bound", "performs triage or assigns care priority", "triage tag, urgency class", "triage record or emergency-care standard", "scarcity forced to answer to life"],
    ["VTS", "Body", "vital signs, life readings, essential measures of bodily state", "measure vital signs, read life markers, or track bodily state", "vital signs, essential life readings", "vital, life-measured, state-bearing", "measures vital signs or tracks life readings", "vital reading, life marker", "vital-sign record or clinical observation", "life made visible before care acts"],
    ["NFK", "Body", "infection, invading illness, contagion entering bodily order", "infect, carry contagion, or track invading illness", "infection, invading illness", "infected, contagious, invasion-bearing", "treats infections or tracks contagion", "infection site, contagion event", "infection report or isolation order", "the body naming what entered without welcome"],
    ["LRG", "Body", "allergy, immune refusal, bodily over-answer to contact", "react allergically, refuse by immune warning, or mark harmful contact", "allergy, immune refusal", "allergic, immune-reactive, contact-warning", "treats allergies or reads immune warnings", "allergy marker, reactive contact", "allergy record or exposure warning", "a no spoken by the body before the will"],
    ["BPP", "Body", "blood pressure, circulation force, measured vessel strain", "measure blood pressure, press circulation, or track vessel force", "blood pressure, circulation force", "pressure-measured, circulatory, vessel-strained", "measures blood pressure or monitors circulation force", "pressure reading, vessel strain", "blood-pressure record or clinical threshold", "hidden force in the body made countable"],
    ["SCN", "Body", "screening, early detection, search for hidden risk before harm", "screen, detect early, or search for hidden risk", "screening, early detection", "screened, risk-seeking, early-detected", "screens patients or detects hidden risk", "screening test, risk signal", "screening record or preventive-care standard", "care looking before pain has a voice"],
    ["SYM", "Body", "syndrome, sign pattern, clustered condition recognized together", "recognize syndrome, cluster signs, or name a pattern of illness", "syndrome, clustered sign pattern", "syndromic, sign-clustered, pattern-bound", "diagnoses syndromes or studies sign clusters", "syndrome pattern, condition cluster", "syndrome record or diagnostic classification", "many small warnings seen as one shape"],
    ["MHL", "Emotion", "mental health, inward wellness, cared pattern of mind and feeling", "care for mental health, restore inward wellness, or steady feeling", "mental health, inward wellness", "mentally healthy, inwardly cared, feeling-steady", "keeps mental health or guides inward care", "mental-health state, inward care plan", "mental-health record or care right", "the inner life protected as real life"],
    ["KNSL", "Emotion", "counseling, guided listening, repair through truthful speech", "counsel, listen under discipline, or guide repair by speech", "counseling, guided truthful listening", "counseled, listened-to, repair-guided", "counsels persons or keeps guided listening", "counseling session, repair dialogue", "counseling record or therapeutic consent", "speech making room for pain to become answerable"],
    ["KLG", "Nature", "ecosystem, living web, interdependent habitat order", "ecologize, read ecosystems, or care for living interdependence", "ecosystem, living interdependence", "ecological, interdependent, habitat-bound", "studies ecosystems or stewards living webs", "ecosystem web, habitat relation", "ecosystem survey or conservation standard", "many lives refusing to be counted alone"],
    ["SPX", "Nature", "species, living kind, lineage class of shared form", "class species, trace living kinds, or protect lineage forms", "species, living kind", "species-bound, lineage-classed, form-sharing", "studies species or protects living kinds", "species record, lineage class", "species registry or biodiversity protection", "a kind of life asking not to vanish unnamed"],
    ["WTB", "Nature", "watershed, water boundary, land ordered by flow", "watershed, trace water boundaries, or govern land by flow", "watershed, water-flow boundary", "watershed-bound, flow-ordered, basin-shaped", "studies watersheds or stewards water boundaries", "watershed map, flow basin", "watershed plan or water-right boundary", "land remembering where water will go"],
    ["STLX", "Technology", "satellite, orbiting observer, high instrument watching earth or signal", "satellite, orbit, or observe from above by instrument", "satellite, orbiting observer", "satellite-linked, orbiting, high-witness", "operates satellites or reads orbital instruments", "satellite link, orbital sensor", "satellite record or orbital license", "an eye above that must still answer below"],
    ["NRJ", "Mind", "energy, measured capacity for work, force available to change", "energize, measure work capacity, or transfer usable force", "energy, measured work capacity", "energetic, capacity-bearing, force-measured", "measures energy or stewards usable force", "energy unit, work capacity", "energy record or resource standard", "power made countable before it is spent"],
    ["KYL", "Nature", "cycle, returning process, recurrent pattern across time", "cycle, recur, or return through patterned sequence", "cycle, returning pattern", "cyclical, recurring, return-shaped", "tracks cycles or stewards recurrent processes", "cycle step, recurrence loop", "cycle record or seasonal pattern", "return that teaches memory to expect"],
    ["XLP", "Mind", "experiment, tested trial, question placed under measure", "experiment, test by trial, or place a question under measure", "experiment, measured trial", "experimental, trial-bound, question-tested", "experiments or designs measured trials", "experiment run, test condition", "experiment record or research protocol", "curiosity disciplined enough to answer"],
    ["MNTX", "Technology", "maintenance, kept repair, ongoing stewardship of working systems", "maintain, keep in repair, or steward working order", "maintenance, ongoing repair stewardship", "maintained, kept, repair-stewarded", "maintains systems or plans repair cycles", "maintenance task, service interval", "maintenance record or operational duty", "repair before failure becomes dramatic"],
    ["PLY", "Technology", "pipeline, ordered processing flow, staged movement of work or data", "pipeline, stage processing, or move work through ordered flow", "pipeline, staged processing flow", "pipelined, staged, flow-ordered", "keeps pipelines or stages data work", "pipeline stage, processing path", "pipeline record or deployment flow", "work taught to move without losing its name"],
    ["TLW", "Technology", "toolchain, linked tools, build sequence for making systems", "toolchain, link tools, or order build instruments", "toolchain, linked build tools", "toolchain-bound, instrument-linked, build-ordered", "keeps toolchains or links build tools", "toolchain step, build instrument", "toolchain record or build standard", "many tools made responsible to one craft"],
    ["XBR", "Technology", "sandbox, isolated execution, protected test boundary", "sandbox, isolate execution, or test within protected bounds", "sandbox, isolated test boundary", "sandboxed, isolated, protected-testing", "keeps sandboxes or isolates risky execution", "sandbox environment, test boundary", "sandbox policy or isolation record", "freedom for experiment without freedom to harm"],
    ["RSPN", "Technology", "response, system answer, returned result to a request or event", "respond, return result, or answer a request", "response, returned system answer", "responsive, returned, answer-bearing", "handles responses or measures answer behavior", "response body, returned result", "response log or service-level answer", "a machine word that must meet the call"],
    ["FRMN", "Speech", "forum, public discussion place, structured exchange of many voices", "forum, host public discussion, or structure many-voice exchange", "forum, public discussion place", "forum-bound, public, many-voiced", "hosts forums or moderates public exchange", "forum thread, discussion room", "forum record or public-comment venue", "a room where speech must let others answer"],
    ["KYN", "Ritual/poetry", "cinema, moving image story, public seeing through framed motion", "cinematize, make moving images, or tell by framed motion", "cinema, moving image story", "cinematic, moving-image, frame-bound", "makes cinema or curates moving images", "film scene, moving image", "cinema archive or screening license", "a people dreaming with open eyes"],
    ["STG", "Ritual/poetry", "stage, performance place, raised field for embodied speech", "stage performance, raise embodied speech, or place action before attention", "stage, performance place", "staged, performance-bound, attention-raised", "stages works or keeps performance spaces", "stage floor, performance field", "stage record or venue permit", "a place where action agrees to be seen"],
    ["PRFM", "Ritual/poetry", "performance, embodied presentation, practiced act before witness", "perform, present bodily, or enact practiced work before witness", "performance, embodied presentation", "performed, embodied, witness-facing", "performs or directs embodied presentation", "performance act, presented work", "performance record or public program", "practice becoming answerable to attention"],
    ["LYR", "Ritual/poetry", "lyric, sung line, compressed feeling shaped for voice", "lyricize, write sung lines, or shape feeling for voice", "lyric, sung line", "lyrical, voice-shaped, feeling-compressed", "writes lyrics or studies sung lines", "lyric line, voice phrase", "lyric archive or song-text record", "feeling made small enough for breath"],
    ["NGR", "Technology", "ingress, entry flow, incoming traffic or passage into a system", "ingress, receive incoming flow, or govern entry traffic", "ingress, incoming entry flow", "ingress-bound, incoming, entry-governed", "keeps ingress or manages incoming traffic", "ingress route, entry request", "ingress rule or network entry record", "the gate where outside becomes answerable inside"],
    ["WRKS", "Mind", "workshop, practical learning place, hands-on training through making", "workshop, train by making, or gather practical learners", "workshop, hands-on learning place", "workshop-bound, practical, making-taught", "leads workshops or trains through making", "workshop session, practice table", "workshop record or training attendance", "knowledge made honest by the hand"],
    ["RBC", "Mind", "rubric, assessment frame, visible standard for judging work", "rubricate, set assessment standards, or judge by visible criteria", "rubric, assessment standard", "rubric-bound, criteria-visible, assessment-shaped", "keeps rubrics or judges by criteria", "rubric row, assessment mark", "rubric record or grading standard", "judgment that shows its measure before it speaks"],
    ["TWD", "Mind", "tutorial, guided lesson, stepwise instruction for a learner", "tutor, guide stepwise, or teach through directed practice", "tutorial, guided lesson", "tutorial, step-guided, learner-directed", "tutors learners or writes guided lessons", "tutorial step, guided practice", "tutorial record or learner support note", "teaching walking beside the learner"],
    ["BGD", "Technology", "bug, defect, small fault that breaks expected behavior", "bug, defect, or expose faulty behavior", "bug, software defect", "buggy, defective, behavior-broken", "finds bugs or triages defects", "bug report, faulty case", "bug record or defect ticket", "the small break asking not to be ignored"],
    ["MPL", "Law/civic life", "marketplace, public exchange field, governed place of many providers", "marketplace, gather exchange, or govern many-provider provision", "marketplace, governed exchange field", "marketplace-bound, exchange-gathered, provider-many", "keeps marketplaces or governs exchange fields", "marketplace stall, provider listing", "marketplace rule or platform policy", "many needs and provisions made visible together"],
    ["FDN", "Law/civic life", "funding, provisioned capital, resource set aside for future work", "fund, provision capital, or set resources aside for work", "funding, provisioned capital", "funded, provision-backed, resource-set", "funds work or stewards capital provision", "funding grant, capital pool", "funding agreement or grant record", "future work receiving present trust"],
    ["SPNX", "Law/civic life", "sponsorship, named support, patronage that carries responsibility", "sponsor, support publicly, or attach one's name to provision", "sponsorship, named public support", "sponsored, name-backed, support-bearing", "sponsors work or stewards named support", "sponsor mark, support pledge", "sponsorship agreement or disclosure record", "help that accepts being seen"],
    ["NTN", "Law/civic life", "notarization, public attestation, witnessed authenticity of a record", "notarize, attest publicly, or witness record authenticity", "notarization, public attestation", "notarized, attested, witness-certified", "notarizes records or verifies public authenticity", "notary mark, attested record", "notarization record or witness seal", "a public eye placed on a private signature"],
    ["FLW", "Law/civic life", "filing, submitted record, document entered into public process", "file documents, submit records, or enter a case into process", "filing, submitted public record", "filed, submitted, process-entered", "files records or receives submissions", "filing packet, submitted document", "case filing or administrative submission", "speech entering the machinery of answerability"],
    ["DLY", "Law/civic life", "delivery, fulfilled transfer, handoff that completes an obligation", "deliver, hand off, or fulfill transfer of goods or message", "delivery, fulfilled transfer", "delivered, transferred, obligation-completing", "delivers goods or records handoffs", "delivery note, handoff event", "delivery record or service completion", "promise arriving in another's hands"],
    ["VRB", "Mind", "variable, named changing value, symbol that can hold difference", "vary, name a changing value, or bind difference to a symbol", "variable, named changing value", "variable, change-bearing, symbol-bound", "uses variables or models changing values", "variable name, changing value", "variable declaration or model parameter", "change given a name so thought can hold it"],
    ["LGC", "Technology", "logging, event record, chronological memory of system action", "log events, record operations, or keep chronological system memory", "logging, event memory", "logged, event-recorded, chronological", "keeps logs or audits event memory", "log line, event entry", "log record or retention policy", "a machine remembering what it did"],
    ["HYP", "Technology", "hyperlink, directed web reference, traversable relation between records", "hyperlink, connect records, or make references traversable", "hyperlink, traversable reference", "hyperlinked, reference-bound, traversable", "keeps hyperlinks or connects records", "hyperlink target, web reference", "link record or citation route", "a path hidden inside a word"],
    ["RDM", "Mind", "randomness, unchosen variation, non-determined selection under rule", "randomize, vary without choice, or sample under chance", "randomness, unchosen variation", "random, chance-shaped, non-determined", "uses randomness or studies chance variation", "random seed, chance sample", "randomization record or sampling protocol", "chance confessed instead of disguised as will"]
  ];

  return seeds.map(([id, category, semanticField, action, concept, quality, agent, object, civic, intimate]) =>
    seedRoot(id, category, semanticField, action, concept, quality, agent, object, civic, intimate)
  );
}

function v1InstitutionalDepthRoots() {
  const seeds = [
    ["KWRN", "Body", "quarantine, protective separation, time-bound isolation for public health", "quarantine, separate for health, or bound contact during contagion", "quarantine, protective health separation", "quarantined, separated, contact-bound", "keeps quarantine or stewards protective separation", "quarantine period, separation order", "quarantine order or public-health boundary", "distance accepted so the vulnerable may live"],
    ["PLCB", "Body", "placebo, inert treatment, care-shaped expectation under trial", "placebo, control expectation, or test treatment meaning", "placebo, inert trial treatment", "placebo-bound, expectation-shaped, treatment-neutral", "keeps placebo controls or studies expectation effects", "placebo dose, control treatment", "placebo arm or clinical trial control", "hope tested without being mocked"],
    ["PRGN", "Body", "prognosis, forecast of illness, expected course of care", "prognose, forecast illness, or name expected course", "prognosis, expected health course", "prognostic, forecasted, care-course", "makes prognoses or communicates expected course", "prognosis note, expected outcome", "prognosis record or care forecast", "future spoken carefully beside suffering"],
    ["RFY", "Body", "referral, directed care handoff, guided passage to another steward", "refer care, direct a patient, or hand off responsibility", "referral, directed care handoff", "referred, care-directed, handoff-bound", "refers patients or receives care handoffs", "referral note, care direction", "referral record or specialist authorization", "care admitting another hand is needed"],
    ["NPT", "Body", "inpatient, person received into institutional care, resident treatment", "admit inpatient, receive into care, or treat under residence", "inpatient, resident care person", "inpatient, admitted, residence-treated", "receives care as inpatient or stewards admitted patients", "inpatient stay, admitted case", "inpatient record or admission status", "a sick person housed under duty"],
    ["KNTR", "Body", "contraindication, warning against treatment, care-limiting danger", "contraindicate, warn against treatment, or block harmful remedy", "contraindication, treatment warning", "contraindicated, warning-bound, remedy-limited", "records contraindications or guards against harmful treatment", "contraindication flag, treatment block", "contraindication record or safety warning", "a no that protects care from becoming harm"],
    ["GLK", "Body", "glucose, blood sugar, metabolic fuel measure", "measure glucose, regulate blood sugar, or track metabolic fuel", "glucose, blood sugar", "glucose-measured, metabolic, sugar-bearing", "measures glucose or stewards metabolic readings", "glucose reading, blood sugar value", "glucose record or metabolic threshold", "fuel in the blood made visible for care"],
    ["PTNT", "Body", "patient, person under care, sufferer received by duty", "patient, receive care, or stand under treatment", "patient, person under care", "patient, care-received, treatment-bound", "receives care as patient or advocates for patients", "patient case, care person", "patient record or care standing", "a person before illness is a file"],
    ["TNT", "Law/civic life", "tenant, dwelling-holder under lease, housed person with standing", "tenant, lease dwelling, or hold residence by agreement", "tenant, lease-bound dweller", "tenant-held, lease-bound, housed", "keeps tenancy or protects tenants", "tenant unit, leasehold case", "tenant right or housing record", "home held under another's title yet still worthy"],
    ["LNDL", "Law/civic life", "landlord, property steward over rented dwelling, housing power under duty", "landlord, lease property, or steward rented housing", "landlord, rental property steward", "landlord-bound, leasing, housing-power", "leases dwellings or stewards rental property", "landlord notice, rental authority", "landlord registry or housing duty record", "ownership that must answer to shelter"],
    ["NFL", "Law/civic life", "inflation, rising prices, provision losing measure over time", "inflate prices, lose measure, or track provision drift", "inflation, rising price drift", "inflationary, price-rising, measure-eroding", "tracks inflation or stewards price stability", "inflation rate, price drift", "inflation report or monetary stability measure", "money confessing that its promise has thinned"],
    ["XPN", "Law/civic life", "expense, cost incurred, provision spent for work or care", "expense, spend cost, or record incurred provision", "expense, incurred cost", "expensed, cost-incurred, provision-spent", "records expenses or authorizes costs", "expense line, incurred charge", "expense report or reimbursable cost", "what work asks provision to bear"],
    ["PRMM", "Law/civic life", "premium, paid protection price, recurring cost of coverage", "premium, price coverage, or sustain protection payments", "premium, coverage payment", "premium-paid, coverage-priced, recurring", "sets premiums or pays coverage costs", "premium bill, coverage charge", "premium notice or insurance payment record", "protection priced before trouble arrives"],
    ["DDC", "Law/civic life", "deductible, first burden before coverage, shared risk threshold", "deduct, set coverage threshold, or bear first risk", "deductible, shared risk threshold", "deductible-bound, thresholded, first-burden", "sets deductibles or bears first risk", "deductible amount, threshold burden", "deductible clause or coverage threshold", "the first cost that reveals who carries risk"],
    ["XRW", "Law/civic life", "escrow, held trust, third-party custody until condition is met", "escrow, hold in trust, or release on condition", "escrow, conditional held trust", "escrowed, condition-held, trust-kept", "keeps escrow or releases held trust", "escrow account, conditional holding", "escrow record or custody condition", "trust held still until promise is proven"],
    ["RRS", "Law/civic life", "arrears, overdue debt, unpaid obligation carried past its time", "fall into arrears, carry overdue debt, or record unpaid obligation", "arrears, overdue obligation", "overdue, arrears-bound, unpaid", "tracks arrears or answers overdue duty", "arrears balance, overdue line", "arrears notice or delinquency record", "a promise still walking after its appointed day"],
    ["WRNT", "Law/civic life", "warranty, repair promise, assurance attached to made goods", "warrant quality, promise repair, or assure a made thing", "warranty, repair assurance", "warrantied, assured, repair-promised", "issues warranties or keeps repair assurance", "warranty claim, assurance mark", "warranty record or product obligation", "a maker's word following the object home"],
    ["RFND", "Law/civic life", "refund, returned payment, reversal of provision after unmet exchange", "refund, return payment, or reverse failed exchange", "refund, returned payment", "refunded, payment-returned, exchange-reversed", "issues refunds or receives returned payment", "refund credit, returned amount", "refund record or consumer remedy", "money walking back when exchange failed"],
    ["DPRC", "Law/civic life", "depreciation, value decline, aging loss recorded over time", "depreciate, record value decline, or age an asset by measure", "depreciation, measured value decline", "depreciated, value-lowered, time-worn", "tracks depreciation or values aging assets", "depreciation entry, value decline", "depreciation schedule or asset record", "time writing honestly on possession"],
    ["PRBT", "Law/civic life", "probation, conditional freedom, supervised repair after judgment", "probate conduct, supervise conditionally, or test freedom under duty", "probation, conditional supervised freedom", "probationary, supervised, condition-bound", "supervises probation or lives under conditions", "probation term, supervision condition", "probation order or conditional release record", "freedom given back with witnesses still near"],
    ["NJN", "Law/civic life", "injunction, court order restraining or compelling action", "enjoin, restrain by order, or compel under court command", "injunction, court restraint order", "enjoined, restrained, order-bound", "seeks injunctions or enforces court restraint", "injunction text, restraint order", "injunction record or court command", "power stopped before harm can finish speaking"],
    ["FDT", "Law/civic life", "affidavit, sworn written statement, testimony bound to signature", "affidavit, swear in writing, or bind testimony by signature", "affidavit, sworn written statement", "affidavit-bound, sworn, signed", "makes affidavits or receives sworn statements", "affidavit page, sworn statement", "affidavit record or sworn evidence", "a signature standing under truth"],
    ["DPS", "Law/civic life", "deposition, recorded witness examination, testimony before trial", "depose, examine witness, or record testimony before judgment", "deposition, recorded witness examination", "deposed, examined, testimony-recorded", "conducts depositions or gives recorded testimony", "deposition transcript, witness examination", "deposition record or pretrial testimony", "a witness answered before the room of judgment"],
    ["CNSS", "Law/civic life", "consensus, shared assent, agreement formed without erasing persons", "consense, form shared assent, or find common judgment", "consensus, shared agreement", "consensual, agreement-formed, shared", "builds consensus or records shared assent", "consensus statement, common finding", "consensus record or deliberative agreement", "many voices finding one answer without vanishing"],
    ["KLTN", "Law/civic life", "coalition, allied public group, temporary union for action", "coalition, ally publicly, or join forces for civic action", "coalition, allied public group", "coalitional, allied, action-joined", "builds coalitions or stewards allied action", "coalition pact, allied bloc", "coalition agreement or public alliance record", "separate wills carrying one work for a season"],
    ["KWRM", "Law/civic life", "quorum, minimum assembly, enough persons to bind a public act", "quorum, gather sufficient assembly, or validate collective action", "quorum, sufficient assembly", "quorate, assembly-sufficient, vote-ready", "keeps quorum or verifies assembly standing", "quorum count, sufficient presence", "quorum record or meeting validity", "presence counted before power may speak"],
    ["SDW", "Building/making", "sidewalk, pedestrian way, walking edge of public road", "sidewalk, pave walking edge, or guide foot traffic", "sidewalk, pedestrian path", "sidewalked, foot-guided, street-edged", "builds sidewalks or stewards pedestrian ways", "sidewalk segment, walking edge", "sidewalk standard or pedestrian access record", "the road making room for the unarmored body"],
    ["NTSX", "Building/making", "intersection, crossing point, meeting of roads and decisions", "intersect, cross paths, or govern road meeting", "intersection, crossing point", "intersecting, cross-bound, path-meeting", "manages intersections or designs crossings", "intersection node, crossing point", "intersection plan or traffic control record", "paths admitting they must answer each other"],
    ["PRKG", "Building/making", "parking, placed vehicle rest, temporary holding of movement", "park vehicles, hold movement, or assign standing space", "parking, vehicle standing space", "parked, standing, vehicle-held", "manages parking or assigns standing space", "parking space, vehicle hold", "parking permit or curb allocation", "movement disciplined enough to stop"],
    ["SBW", "Building/making", "subway, underground public transit, buried civic movement", "subway, move underground, or carry people below the street", "subway, underground transit", "subway-bound, underground, transit-carried", "operates subways or stewards underground transit", "subway line, underground route", "subway map or transit authority record", "the city carrying people beneath its noise"],
    ["BSS", "Building/making", "bus, shared road vehicle, public carriage by route", "bus, carry by shared route, or serve public stops", "bus, shared route vehicle", "bus-bound, route-shared, stop-served", "drives buses or stewards route carriage", "bus stop, route vehicle", "bus schedule or transit service record", "a road promise made affordable to many"],
    ["BNX", "Technology", "benchmark, comparison test, standard workload for measured performance", "benchmark, compare performance, or test against standard load", "benchmark, performance standard test", "benchmarked, comparison-tested, standard-loaded", "keeps benchmarks or measures performance", "benchmark run, standard workload", "benchmark record or performance evidence", "power asked to show its measure"],
    ["LDRB", "Technology", "leaderboard, ranked display, public ordering of measured performance", "leaderboard, rank publicly, or display ordered results", "leaderboard, public rank display", "leaderboarded, ranked, display-ordered", "keeps leaderboards or publishes ranks", "leaderboard row, public rank", "leaderboard record or competition standing", "ambition made visible before comparison"],
    ["HLX", "Technology", "hallucination, false generated claim, fluent error without grounding", "hallucinate output, fabricate fluently, or generate ungrounded claim", "hallucination, fluent false output", "hallucinated, ungrounded, fluent-false", "detects hallucinations or guards generated claims", "hallucinated answer, false generation", "hallucination report or model-risk record", "speech that sounds alive while severed from truth"],
    ["TRBT", "Technology", "attribution, source credit, assigned origin of work or claim", "attribute, assign source, or credit origin", "attribution, source credit", "attributed, source-assigned, credit-bearing", "attributes sources or audits origin credit", "attribution note, source credit", "attribution record or provenance credit", "memory giving a name back to its maker"],
    ["CLB", "Technology", "calibration, tuned measure, correction of instrument against standard", "calibrate, tune measurement, or align instrument to standard", "calibration, corrected measure", "calibrated, standard-tuned, measure-corrected", "calibrates instruments or stewards measurement standards", "calibration curve, tuning mark", "calibration record or inspection standard", "attention corrected before it claims certainty"],
    ["VRNC", "Mind", "variance, spread of values, measured difference across cases", "vary statistically, measure spread, or track dispersion", "variance, measured spread", "variant, spread-measured, dispersion-bearing", "measures variance or explains statistical spread", "variance value, dispersion measure", "variance record or statistical disclosure", "difference counted without panic"],
    ["RNK", "Mind", "ranking, ordered comparison, placed standing among alternatives", "rank, order by comparison, or assign standing", "ranking, ordered comparison", "ranked, ordered, comparison-placed", "ranks items or stewards ordered standing", "rank position, ordered place", "ranking record or selection standard", "judgment admitting the ladder it uses"],
    ["NJC", "Conflict/repair", "injection, malicious insertion, forced entry into process or body", "inject, insert forcefully, or push hidden command into a process", "injection, forced insertion", "injected, force-inserted, hidden-entry", "detects injections or guards against forced insertion", "injection payload, inserted command", "injection report or security incident", "a hidden entry that tries to make speech obey"],
    ["FNTN", "Technology", "fine-tuning, model adjustment, learned adaptation under targeted training", "fine-tune, adapt model, or adjust behavior by targeted training", "fine-tuning, targeted model adjustment", "fine-tuned, adapted, target-trained", "fine-tunes models or stewards adaptation runs", "fine-tuning run, adaptation set", "fine-tuning record or model-change audit", "teaching that must remember what it changes"],
    ["BTC", "Technology", "batch, grouped work unit, many items processed as one", "batch, group work, or process items together", "batch, grouped work unit", "batched, grouped, many-as-one", "runs batches or groups processing work", "batch job, grouped unit", "batch record or processing window", "many small tasks admitted as one burden"],
    ["RPLC", "Technology", "replication, repeated copy, synchronized survival across nodes", "replicate, copy across nodes, or preserve by synchronized repetition", "replication, synchronized copying", "replicated, copied, node-synchronized", "keeps replication or audits synchronized copies", "replica, copied node", "replication record or durability policy", "memory refusing to live in only one place"],
    ["WRCT", "Mind", "worksheet, guided practice page, learner work made visible", "worksheet, guide practice, or make learner work inspectable", "worksheet, guided practice page", "worksheet-bound, guided, practice-visible", "writes worksheets or reviews learner practice", "worksheet item, practice page", "worksheet record or classroom evidence", "practice placed where correction can find it"],
    ["FTN", "Speech", "footnote, lower note, source or qualification beneath main text", "footnote, qualify text, or place source beneath speech", "footnote, supporting lower note", "footnoted, qualified, source-beneath", "writes footnotes or keeps textual qualifications", "footnote mark, source note", "footnote record or citation support", "humility written below the confident line"],
    ["CMNT", "Speech", "commentary, explanatory speech beside a received text", "comment, explain beside text, or steward inherited meaning", "commentary, explanatory side-text", "commentarial, explained, text-beside", "writes commentary or interprets received text", "commentary note, explanatory gloss", "commentary record or editorial apparatus", "a later voice answering an earlier word"],
    ["PGN", "Speech", "pagination, ordered page numbering, navigable sequence in a text", "paginate, number pages, or make text navigable by order", "pagination, ordered page sequence", "paginated, numbered, page-ordered", "paginates texts or stewards page order", "page number, pagination mark", "pagination record or publication standard", "memory given steps so others can return"],
    ["TLN", "Speech", "outline, skeletal plan, ordered shape before full speech", "outline, sketch structure, or arrange speech before filling", "outline, structured speech plan", "outlined, skeletal, plan-ordered", "outlines arguments or drafts structure", "outline heading, structural note", "outline record or planning draft", "a thought showing its bones before its skin"],
    ["PNDX", "Speech", "appendix, attached supporting matter, extra record after main text", "append, attach support, or place evidence after main text", "appendix, attached support record", "appended, attached, support-after", "appends evidence or keeps support matter", "appendix item, supporting record", "appendix record or supplementary filing", "truth that waits behind the main word"],
    ["BSTR", "Speech", "abstract, compressed summary, essence of a longer work", "abstract, compress meaning, or summarize a larger work", "abstract, compressed summary", "abstracted, compressed, essence-kept", "writes abstracts or compresses larger work", "abstract paragraph, compressed summary", "abstract record or publication summary", "a long labor made small enough to enter"],
    ["DBL", "Technology", "duplicate, repeated copy, identity conflict among records", "duplicate, repeat copy, or detect doubled identity", "duplicate, repeated copy", "duplicated, doubled, identity-repeated", "deduplicates records or detects doubled identity", "duplicate record, repeated item", "duplicate report or deduplication record", "a second copy asking whether it is memory or noise"]
  ];

  return seeds.map(([id, category, semanticField, action, concept, quality, agent, object, civic, intimate]) =>
    seedRoot(id, category, semanticField, action, concept, quality, agent, object, civic, intimate)
  );
}

function v1DomainBreadthRoots() {
  const seeds = [
    ["NTRP", "Mind", "entropy, disorder measure, loss of available order in a system", "measure entropy, track disorder, or reckon lost usable order", "entropy, disorder measure", "entropic, disorder-measured, order-losing", "measures entropy or stewards disorder accounts", "entropy value, disorder reading", "entropy record or thermodynamic disclosure", "order confessing where its strength has gone"],
    ["SPTR", "Mind", "spectrum, ordered range, spread of signals, traits, or measured states", "spectrum, spread across range, or classify measured continua", "spectrum, ordered range", "spectral, range-spread, continuum-bearing", "keeps spectra or reads measured ranges", "spectrum band, measured range", "spectrum record or classification standard", "difference seen without being forced into one box"],
    ["WLNG", "Mind", "wavelength, distance of a wave cycle, measured spacing of recurrence", "measure wavelength, track wave spacing, or compare recurrent distance", "wavelength, wave-cycle distance", "wavelength-bound, cycle-spaced, recurrence-measured", "measures wavelengths or compares wave spacing", "wavelength band, cycle distance", "wavelength record or signal standard", "rhythm given a length the hand can count"],
    ["MPLT", "Mind", "amplitude, measured height, strength of wave or variation", "measure amplitude, scale variation, or track signal strength", "amplitude, measured signal height", "amplitudinal, strength-measured, height-bearing", "measures amplitude or stewards signal strength", "amplitude value, signal height", "amplitude record or monitoring threshold", "force rising high enough to be noticed"],
    ["FYS", "Mind", "phase, cycle position, timed relation inside recurrence", "phase, align cycles, or mark position in recurrence", "phase, cycle position", "phased, cycle-positioned, relation-timed", "tracks phases or aligns cycles", "phase mark, cycle position", "phase record or synchronization standard", "a moment understood by where it stands in return"],
    ["SMTR", "Mind", "symmetry, mirrored order, balanced relation across transformation", "symmetrize, compare mirrored order, or preserve balance through change", "symmetry, mirrored order", "symmetric, balance-preserved, mirror-ordered", "studies symmetry or tests balanced relations", "symmetry line, invariant relation", "symmetry record or design standard", "beauty proving that change did not erase form"],
    ["KRLT", "Mind", "correlation, measured co-relation, variables moving together without proof of cause", "correlate, compare co-movement, or test linked variation", "correlation, measured co-relation", "correlated, co-moving, relation-measured", "measures correlations or audits co-variation", "correlation coefficient, linked variation", "correlation report or statistical disclosure", "nearness counted without pretending to be cause"],
    ["SMPL", "Mind", "sample, selected part, representative portion used for judgment", "sample, select a part, or infer carefully from a portion", "sample, selected representative part", "sampled, selected, portion-bearing", "samples populations or keeps representative portions", "sample set, selected portion", "sampling record or evidence standard", "a small part asked not to lie about the whole"],
    ["CNST", "Mind", "constant, fixed value, stable term across change", "hold constant, fix a value, or compare change against stability", "constant, fixed value", "constant, fixed, change-resistant", "keeps constants or fixes comparison values", "constant term, fixed value", "constant record or measurement standard", "what stays still so change can be seen"],
    ["GRDX", "Mind", "gradient, directional change, slope of increase or decrease", "grade by slope, measure gradient, or track directional change", "gradient, directional change", "gradient, slope-measured, direction-changing", "measures gradients or stewards change fields", "gradient vector, slope mark", "gradient record or optimization trace", "change pointing where it is going"],
    ["NRMX", "Mind", "norm, standard length or expected form, reference measure for comparison", "normalize, set a norm, or compare against expected form", "norm, reference standard", "normal, normalized, standard-measured", "normalizes values or stewards reference standards", "norm value, expected form", "normalization record or reference standard", "measure admitting the shape it expects"],
    ["YNTX", "Mind", "unit, counted measure, named one for comparison and exchange", "unitize, count by units, or name a measure-one", "unit, counted measure", "unitary, counted, measure-one", "keeps units or defines measure standards", "unit mark, counted one", "unit record or metrology standard", "one made honest enough for many to compare"],
    ["LGY", "Nature", "algae, water-growing photosynthetic life, small green makers", "algaize, cultivate algae, or track water-grown life", "algae, water-growing life", "algal, water-grown, light-fed", "studies algae or stewards water-grown life", "algae bloom, water-life sample", "algae survey or water-quality record", "small green life turning light into breath"],
    ["PLNX", "Nature", "pollination, carried fertility, transfer that lets plants bear fruit", "pollinate, carry fertility, or steward plant reproduction", "pollination, carried plant fertility", "pollinated, fertility-carried, fruit-bearing", "pollinates plants or protects pollination paths", "pollination event, fertile transfer", "pollination record or habitat protection", "life needing another wing before it can continue"],
    ["PRDY", "Nature", "predator, hunting life, eater that shapes the living web", "prey upon, hunt, or regulate ecology through predation", "predator, hunting life", "predatory, hunting, web-shaping", "hunts as predator or studies predation", "predator sign, hunting event", "predator record or wildlife management", "hunger that still belongs to order"],
    ["PRYB", "Nature", "prey, vulnerable life hunted within a living web", "be prey, flee predation, or carry vulnerability in ecology", "prey, hunted vulnerable life", "prey-bound, vulnerable, hunted", "studies prey or protects vulnerable populations", "prey sign, vulnerable animal", "prey record or conservation measure", "life seen where danger has teeth"],
    ["SLNT", "Nature", "salinity, salt measure, mineral concentration in water or soil", "measure salinity, salt water, or track mineral concentration", "salinity, salt concentration", "saline, salt-measured, mineral-bearing", "measures salinity or stewards salt balance", "salinity reading, salt mark", "salinity record or water-quality standard", "water remembering the mineral it carries"],
    ["CMPS", "Nature", "compost, returning organic matter, decay turned into provision", "compost, return organic matter, or steward decay into fertility", "compost, fertile returned matter", "composted, decay-returned, soil-feeding", "keeps compost or stewards fertile return", "compost pile, returned matter", "compost record or waste-to-soil standard", "death taught to feed the garden"],
    ["NVSX", "Nature", "invasive species, displaced life spreading beyond balance", "invade ecologically, spread beyond balance, or track harmful introduction", "invasive species, unbalanced introduced life", "invasive, introduced, balance-breaking", "tracks invasive species or restores ecological balance", "invasive population, introduced spread", "invasive-species report or containment order", "life out of place asking repair from the whole web"],
    ["CNSV", "Nature", "conservation, guarded continuity of land, species, or living systems", "conserve, guard living continuity, or preserve ecological inheritance", "conservation, guarded living continuity", "conserved, protected, continuity-kept", "conserves habitats or stewards living inheritance", "conservation area, protected continuity", "conservation mandate or stewardship record", "the future asking the present not to spend the world"],
    ["PRST", "Nature", "parasite, life feeding from a host, dependency that can harm balance", "parasitize, feed from a host, or track harmful dependence", "parasite, host-feeding life", "parasitic, host-bound, dependence-feeding", "studies parasites or treats host dependence", "parasite load, host-feeding organism", "parasite record or public-health finding", "need that forgot reciprocity"],
    ["SMBX", "Nature", "symbiosis, mutual living relation, different lives sustaining one another", "symbiose, live mutually, or sustain across difference", "symbiosis, mutual living relation", "symbiotic, mutual, interdependent", "studies symbiosis or stewards mutual relations", "symbiotic pair, mutual relation", "symbiosis record or ecological finding", "difference becoming a covenant of survival"],
    ["LTNS", "Technology", "latency, delay before response, time cost in a system", "measure latency, delay response, or track waiting in a system", "latency, response delay", "latent, delayed, wait-measured", "measures latency or reduces system delay", "latency value, response wait", "latency report or service-level record", "waiting made visible so power cannot hide slowness"],
    ["TRPT", "Technology", "throughput, completed work rate, flow of processed units over time", "measure throughput, process at rate, or track completed flow", "throughput, completed work rate", "throughput-bound, flow-measured, rate-bearing", "measures throughput or stewards processing flow", "throughput value, processed flow", "throughput report or capacity standard", "work counted by what actually passes through"],
    ["RBST", "Technology", "robustness, strength under variation, system remaining useful under stress", "make robust, test stress, or preserve function under variation", "robustness, stress-resistant usefulness", "robust, stress-tested, variation-resistant", "tests robustness or builds resilient systems", "robustness margin, stress case", "robustness report or safety assurance", "strength that has met disorder and stayed useful"],
    ["WVFT", "Technology", "overfitting, model clinging too closely to training memory", "overfit, memorize too closely, or fail to generalize from training", "overfitting, excessive training fit", "overfit, memorized, generalization-weak", "detects overfitting or audits model generalization", "overfit model, memorized pattern", "overfitting report or validation warning", "memory pretending it has become understanding"],
    ["NDFT", "Technology", "underfitting, model failing to learn enough structure", "underfit, learn too little, or miss the pattern needed for judgment", "underfitting, insufficient learned structure", "underfit, pattern-weak, learning-thin", "detects underfitting or improves model capacity", "underfit model, weak pattern", "underfitting report or training warning", "humility where the model has not yet learned enough"],
    ["DRFT", "Technology", "drift, model or data shift, changed conditions weakening prior judgment", "drift, shift conditions, or track model decay over time", "drift, changing data condition", "drifting, shifted, condition-changed", "tracks drift or repairs stale models", "drift signal, shifted distribution", "drift report or model-monitoring record", "the world moving while the judgment stayed still"],
    ["SRLZ", "Technology", "serialization, data made portable by ordered representation", "serialize, order data for transfer, or make state portable", "serialization, ordered portable data", "serialized, transfer-ordered, state-portable", "serializes data or audits portable state", "serialized payload, ordered data form", "serialization record or interface contract", "memory folded small enough to travel"],
    ["MTRC", "Technology", "metric, operational measure, named number used to judge systems", "metricize, name measures, or judge systems by tracked numbers", "metric, operational measure", "metric, measure-named, system-counted", "keeps metrics or audits operational measures", "metric value, tracked number", "metric report or service standard", "a number made responsible for what it claims to show"],
    ["NMLY", "Technology", "anomaly, unexpected pattern, deviation requiring attention", "mark anomaly, detect deviation, or investigate unexpected pattern", "anomaly, unexpected deviation", "anomalous, unexpected, deviation-marked", "detects anomalies or investigates deviations", "anomaly event, deviation mark", "anomaly report or incident trigger", "the strange asking whether it is warning or wonder"],
    ["RDCT", "Technology", "redaction, protected removal, hidden part of a record for duty or safety", "redact, remove protected parts, or hide data under rule", "redaction, protected removal", "redacted, protected, removal-marked", "redacts records or guards sensitive data", "redacted field, protected removal", "redaction log or privacy record", "silence used as duty rather than evasion"],
    ["PDGJ", "Mind", "pedagogy, teaching method, disciplined art of forming learners", "teach by method, shape pedagogy, or order learning practice", "pedagogy, teaching method", "pedagogical, method-taught, learner-forming", "keeps pedagogy or trains teachers", "pedagogical method, teaching pattern", "pedagogy standard or teacher-training record", "careful form given to another mind's becoming"],
    ["FDBK", "Mind", "feedback, returned information for correction or growth", "give feedback, return correction, or guide change by response", "feedback, returned correction", "feedback-bearing, response-guided, correction-returned", "gives feedback or stewards response cycles", "feedback note, returned signal", "feedback record or assessment response", "speech returning so action can improve"],
    ["RMDX", "Mind", "remediation, targeted correction, teaching repair after weakness is found", "remediate, correct weakness, or teach repair after assessment", "remediation, targeted learning repair", "remedial, correction-focused, weakness-seen", "remediates learning gaps or designs correction", "remediation plan, correction lesson", "remediation record or learner support plan", "repair refusing to shame the unfinished mind"],
    ["PRKC", "Mind", "practice drill, repeated exercise that makes skill reliable", "practice by drill, repeat exercise, or strengthen skill through return", "practice drill, repeated exercise", "practiced, drilled, repetition-shaped", "keeps drills or trains repeated skill", "drill item, repeated exercise", "practice record or training standard", "humility repeated until ability can answer"],
    ["XPLN", "Speech", "explanation, clarified account, speech that makes relation understandable", "explain, clarify relation, or make a cause understandable", "explanation, clarified account", "explanatory, clarified, relation-shown", "explains causes or gives clarified accounts", "explanation note, clarified relation", "explanation record or public rationale", "truth turning its face toward the learner"],
    ["TTRG", "Mind", "tutoring, close guided teaching, one learner helped by direct attention", "tutor, guide closely, or teach by direct attention", "tutoring, close guided teaching", "tutored, guided, attention-close", "tutors learners or receives close guidance", "tutoring session, guided practice", "tutoring record or learner-support duty", "teaching brought near enough to see the person"],
    ["DTND", "Mind", "attendance, present participation, showing up for shared learning or duty", "attend, mark presence, or participate by being there", "attendance, present participation", "attending, present, participation-marked", "keeps attendance or shows up to duty", "attendance mark, presence record", "attendance record or participation requirement", "presence counted because absence also teaches"],
    ["SKLR", "Mind", "scholarship, disciplined study and support for learning", "study as scholar, fund learning, or preserve disciplined inquiry", "scholarship, disciplined study support", "scholarly, study-supported, inquiry-bound", "keeps scholarship or supports learners", "scholarship award, study support", "scholarship record or academic support", "a culture paying attention to minds not yet formed"],
    ["SLX", "Conflict/repair", "escalation, rising conflict intensity, harm moving toward greater force", "escalate, intensify conflict, or track rising danger", "escalation, rising conflict intensity", "escalated, intensified, danger-rising", "tracks escalation or warns against rising conflict", "escalation step, rising danger", "escalation report or conflict threshold", "the moment when force asks for a wiser hand"],
    ["VLNX", "Conflict/repair", "violence, harmful force against body, person, or order", "violate by force, harm violently, or name destructive coercion", "violence, harmful force", "violent, harm-forcing, coercive", "uses violence or prevents harmful force", "violent act, harmful force", "violence report or protection order", "power severed from duty and turned against life"],
    ["SBTJ", "Conflict/repair", "sabotage, hidden damage, deliberate breaking from within a system", "sabotage, damage secretly, or break function from within", "sabotage, hidden deliberate damage", "sabotaged, secretly damaged, function-broken", "detects sabotage or commits hidden damage", "sabotage act, hidden break", "sabotage report or security incident", "betrayal choosing the shadow side of making"],
    ["BRCX", "Technology", "breach, broken boundary, unauthorized crossing of protected space", "breach, cross unlawfully, or break a protected boundary", "breach, broken protected boundary", "breached, boundary-broken, access-violated", "detects breaches or crosses protected boundaries", "breach event, boundary break", "breach notice or incident record", "a wall confessing where trust was entered"],
    ["RNSM", "Conflict/repair", "ransom, coercive holding for payment, hostage exchange demand", "ransom, hold coercively, or demand payment for release", "ransom, coercive release price", "ransomed, held, release-priced", "demands ransom or negotiates release", "ransom demand, coercive price", "ransom report or extortion case", "need twisted into a price for freedom"],
    ["PRPG", "Speech", "propaganda, manipulative public speech, persuasion severed from truth", "propagandize, manipulate publics, or spread speech without truth-duty", "propaganda, manipulative public speech", "propagandistic, manipulative, truth-severed", "makes propaganda or audits manipulative speech", "propaganda claim, manipulative message", "propaganda record or media-integrity finding", "speech using the people instead of serving them"],
    ["SPLS", "Body", "specialist, focused care expert, narrow steward of difficult need", "specialize care, refer to expertise, or focus practice on a hard need", "specialist, focused care expert", "specialist, focus-trained, expert-bound", "serves as specialist or coordinates focused care", "specialist visit, focused expertise", "specialist referral or care authorization", "another hand trained for what ordinary care cannot finish"],
    ["PRSC", "Body", "prescription, ordered remedy, written direction for medicine or care", "prescribe, order remedy, or direct medicine by written care", "prescription, ordered remedy", "prescribed, remedy-ordered, care-written", "prescribes medicine or stewards remedy orders", "prescription note, ordered medicine", "prescription record or medication order", "a healing command that must remember the person"],
    ["MBLN", "Body", "ambulance, urgent care vehicle, moving shelter for emergency life", "ambulance, carry urgent care, or move life toward help", "ambulance, urgent care vehicle", "ambulance-bound, urgent, care-moving", "drives ambulances or coordinates urgent transport", "ambulance route, emergency carriage", "ambulance dispatch or emergency transport record", "a road becoming a temporary room of care"],
    ["HYDR", "Body", "hydration, water balance, bodily need for sufficient fluid", "hydrate, restore water balance, or guard the body from thirst", "hydration, water balance", "hydrated, water-balanced, thirst-guarded", "hydrates patients or tracks water balance", "hydration level, fluid intake", "hydration record or care threshold", "water remembered as a duty inside the body"]
  ];

  return seeds.map(([id, category, semanticField, action, concept, quality, agent, object, civic, intimate]) =>
    seedRoot(id, category, semanticField, action, concept, quality, agent, object, civic, intimate)
  );
}

function v1MaterialCultureRoots() {
  const seeds = [
    ["SHRT", "Body", "shirt, torso garment, everyday covering for work and dignity", "shirt the body, clothe the torso, or mark daily dress", "shirt, torso garment", "shirted, torso-covered, daily-clothed", "makes shirts or keeps daily garments", "shirt, upper garment", "clothing record or uniform shirt standard", "cloth near the heart made ordinary and dignified"],
    ["TRSR", "Body", "trousers, leg garment, lower-body clothing for movement and modesty", "trouser, clothe the legs, or prepare lower-body dress", "trousers, leg garment", "trousered, leg-covered, movement-ready", "makes trousers or fits leg garments", "trouser pair, lower garment", "uniform trouser standard or clothing allowance", "movement given modest form"],
    ["JKT", "Body", "jacket, outer garment, protective layer against weather or public exposure", "jacket, cover outwardly, or add a protective layer", "jacket, outer protective garment", "jacketed, outer-covered, weather-ready", "makes jackets or keeps outer garments", "jacket layer, protective coat", "outerwear standard or protective-clothing record", "a small shelter worn on the shoulders"],
    ["CWH", "Body", "shoe, foot covering, walking protection for the road", "shoe, cover the foot, or prepare walking protection", "shoe, foot covering", "shod, foot-covered, road-ready", "makes shoes or fits walking protection", "shoe, foot garment", "footwear standard or safety-shoe record", "a boundary between the body and the hard path"],
    ["HTX", "Body", "hat, head covering, shade, warmth, or public sign worn above", "hat, cover the head, or mark standing by headwear", "hat, head covering", "hatted, head-covered, shade-bearing", "makes hats or keeps headwear", "hat, head covering", "headwear rule or protective-hat standard", "care placed above thought"],
    ["PWC", "Body", "pocket, small carried pouch, garment space for near possessions", "pocket, carry close, or place small goods in a garment", "pocket, carried pouch", "pocketed, close-carried, garment-held", "makes pockets or keeps close-carried goods", "pocket space, small pouch", "pocket allowance or carried-item rule", "what the body keeps near without speaking"],
    ["BTN", "Building/making", "button, small fastener, closure point that holds covering together", "button, fasten, or close cloth by a small point", "button, small fastener", "buttoned, fastened, closure-held", "makes buttons or fastens garments", "button, closure point", "fastener standard or garment closure record", "a small yes that keeps covering faithful"],
    ["GDL", "Body", "belt, girdle, waist binding that holds dress or tools in place", "belt, gird, or hold clothing and tools at the waist", "belt, waist binding", "belted, girded, waist-held", "makes belts or girds clothing", "belt, waist strap", "belt standard or equipment-retention rule", "the middle held so work can move"],
    ["SKRF", "Body", "scarf, neck wrap, soft covering for warmth, modesty, or sign", "scarf, wrap the neck, or carry warmth by soft cloth", "scarf, neck wrap", "scarfed, wrapped, warmth-bearing", "makes scarves or wraps soft cloth", "scarf, neck cloth", "scarves in uniform or weather-protection record", "warmth speaking gently at the throat"],
    ["GLV", "Body", "glove, hand covering, protection for touch and work", "glove, cover the hand, or protect touch in work", "glove, hand covering", "gloved, hand-covered, touch-protected", "makes gloves or protects working hands", "glove, hand garment", "protective-glove standard or care equipment", "the hand guarded so it may still serve"],
    ["BRX", "Body", "bread, baked staple, shared loaf of daily provision", "bread, bake staple food, or share a loaf", "bread, baked staple", "breaded, baked, staple-bearing", "bakes bread or stewards staple food", "bread loaf, baked portion", "bread ration or staple food standard", "daily provision made warm enough to break together"],
    ["FRJ", "Nature", "fruit, seed-bearing sweetness, plant gift ready to eat", "fruit, bear sweetness, or gather seed-bearing food", "fruit, seed-bearing food", "fruitful, seed-bearing, sweet", "grows fruit or gathers plant gifts", "fruit piece, edible sweetness", "fruit standard or harvest record", "sweetness carrying the future inside it"],
    ["VGJ", "Nature", "vegetable, edible plant body, cultivated green provision", "vegetable, cultivate greens, or prepare edible plant body", "vegetable, edible plant body", "vegetal, cultivated, green-provisioned", "grows vegetables or prepares plant food", "vegetable portion, edible green", "vegetable standard or food-supply record", "green provision pulled from patient soil"],
    ["MTF", "Body", "meat, animal flesh as food, bodily provision from slaughter", "meat, prepare flesh, or reckon animal food under care", "meat, animal flesh food", "meat-bearing, flesh-fed, slaughter-bound", "prepares meat or stewards animal food", "meat cut, flesh portion", "meat inspection or slaughter record", "life taken into provision and therefore owed seriousness"],
    ["MLG", "Body", "milk, nursing liquid, white nourishment from mother or herd", "milk, nourish by milk, or draw nursing liquid", "milk, nursing nourishment", "milky, milk-fed, nursing", "milks animals or stewards nursing food", "milk portion, dairy liquid", "milk safety or dairy supply record", "first food remembered after birth"],
    ["SLT", "Nature", "salt, preserving mineral, seasoning and necessary measure", "salt, season, preserve, or measure mineral need", "salt, preserving mineral", "salted, preserved, mineral-seasoned", "salts food or stewards mineral balance", "salt grain, seasoning measure", "salt standard or food preservation rule", "small mineral that keeps decay from winning quickly"],
    ["SPS", "Nature", "spice, aromatic seasoning, small flavor that awakens food", "spice, season aromatically, or awaken food by scent", "spice, aromatic seasoning", "spiced, aromatic, flavor-awakened", "spices food or keeps aromatic stores", "spice pinch, aromatic seed", "spice trade record or food labeling standard", "a small fire carried by scent"],
    ["YLC", "Body", "oil, cooking fat, smooth fuel and food medium", "oil, anoint, cook with fat, or smooth by liquid richness", "oil, cooking fat", "oiled, fat-rich, smooth", "keeps oils or cooks with fat", "oil drop, cooking fat", "oil standard or food-fat record", "richness that lets heat move gently"],
    ["YGX", "Nature", "egg, shelled beginning, food and possible life held in one form", "egg, lay, gather eggs, or prepare shelled nourishment", "egg, shelled beginning", "egg-bearing, shelled, beginning-held", "keeps eggs or tends laying life", "egg, shelled food", "egg safety or hatchery record", "life held quietly inside a fragile wall"],
    ["RYS", "Nature", "rice, small grain staple, cooked seed of ordinary provision", "rice, cultivate rice, or cook small grain staple", "rice, small grain staple", "rice-bearing, grain-cooked, staple", "grows rice or cooks grain portions", "rice bowl, cooked grain", "rice reserve or staple grain record", "many small grains gathered into one meal"],
    ["PLW", "Body", "pillow, soft head rest, support for sleep and recovery", "pillow, support the head, or soften rest", "pillow, head rest", "pillowed, head-supported, soft-resting", "makes pillows or prepares rest", "pillow, soft head support", "bedding standard or care-rest record", "rest made gentle for thought"],
    ["BLNK", "Body", "blanket, warm covering, cloth shelter for sleep or care", "blanket, cover warmly, or shelter by soft cloth", "blanket, warm covering", "blanketed, warmth-covered, sleep-sheltered", "keeps blankets or covers sleepers", "blanket, warm cloth", "bedding issue or emergency blanket standard", "a room of warmth made portable"],
    ["MTRS", "Body", "mattress, sleep foundation, padded surface for bodily restoration", "mattress, lay rest, or support sleep by padded ground", "mattress, sleep foundation", "mattressed, padded, sleep-supported", "makes mattresses or prepares sleeping places", "mattress, padded bed surface", "mattress standard or lodging inspection", "the floor made merciful to the body"],
    ["SWP", "Body", "soap, cleansing substance, tool for washing dirt and contagion away", "soap, cleanse by lather, or wash with cleansing substance", "soap, cleansing substance", "soaped, cleansed, lather-washed", "makes soap or stewards washing supplies", "soap bar, cleansing lather", "sanitation supply record or soap standard", "cleanliness held in the hand"],
    ["BRCY", "Building/making", "brush, bristled tool, small instrument for cleaning, grooming, or marking", "brush, sweep with bristles, groom, or clean by repeated stroke", "brush, bristled tool", "brushed, bristled, stroke-cleaned", "makes brushes or cleans by bristles", "brush head, bristled tool", "cleaning equipment standard or grooming record", "many small touches making care visible"],
    ["KRTN", "Building/making", "curtain, hanging cloth boundary, soft screen for privacy or light", "curtain, screen softly, or hang cloth as boundary", "curtain, hanging cloth boundary", "curtained, screened, light-softened", "hangs curtains or keeps soft boundaries", "curtain panel, cloth screen", "privacy screen standard or lodging fixture record", "a wall that remembers gentleness"],
    ["NDLX", "Building/making", "needle, piercing sewing tool, small point that joins cloth", "needle, sew, or join cloth by a piercing point", "needle, sewing point", "needled, stitched, point-joined", "sews with needles or keeps sewing tools", "needle point, sewing tool", "needle safety or textile repair record", "a small wound that makes torn cloth whole"],
    ["STRG", "Building/making", "string, cord, flexible line for tying, measuring, or joining", "string, tie by cord, or draw a flexible line", "string, flexible cord", "strung, tied, cord-bound", "makes string or ties with cord", "string length, cord line", "cordage standard or tied-goods record", "a thin line teaching separate things to hold together"],
    ["CLST", "Building/making", "closet, enclosed storage, small kept place for household goods", "closet, store privately, or keep goods in a small room", "closet, enclosed storage", "closeted, stored, enclosed-kept", "keeps closets or stores household goods", "closet space, enclosed store", "storage fixture or housing inspection record", "ordinary things given a quiet room"],
    ["STV", "Building/making", "stove, cooking heat place, household fire made safe for food", "stove, cook by held heat, or keep household fire", "stove, cooking heat place", "stoved, heat-held, cooking-ready", "keeps stoves or cooks by fixed heat", "stove burner, cooking hearth", "stove safety or kitchen fixture record", "fire disciplined enough to feed the house"],
    ["WLT", "Law/civic life", "wallet, carried money holder, pocket custody of tokens and identity", "wallet, hold money close, or carry small proofs of exchange", "wallet, carried money holder", "wallet-held, token-kept, close-carried", "keeps wallets or guards carried tokens", "wallet, money pouch", "lost-wallet report or payment custody record", "small trust carried near the body"],
    ["DRS", "Law/civic life", "address, named location for finding, delivery, or civic standing", "address, locate by name, or assign a reachable place", "address, named location", "addressed, locatable, place-named", "keeps addresses or locates persons and goods", "address line, delivery place", "address record or residence filing", "a place made findable without being possessed"],
    ["KPN", "Law/civic life", "coupon, voucher, conditional discount or claim token", "coupon, voucher, or reduce price by conditional token", "coupon, voucher token", "couponed, discounted, claim-tokened", "issues coupons or redeems vouchers", "coupon code, voucher slip", "coupon record or promotional claim rule", "a small promise cut from a price"],
    ["DSCN", "Law/civic life", "discount, reduced price, mercy or strategy inside exchange", "discount, reduce cost, or mark lowered exchange demand", "discount, reduced price", "discounted, cost-lowered, price-softened", "sets discounts or receives reduced price", "discount amount, reduced price", "discount record or pricing disclosure", "price stepping down so exchange can happen"],
    ["RSVN", "Law/civic life", "reservation, held place, promised availability before arrival", "reserve, hold a place, or promise availability ahead of arrival", "reservation, held place", "reserved, held, arrival-promised", "keeps reservations or holds places", "reservation slot, held place", "reservation record or booking obligation", "space waiting under a name"],
    ["PNTM", "Law/civic life", "appointment, scheduled meeting, named time for attention or service", "appoint, schedule meeting, or assign time for attention", "appointment, scheduled meeting", "appointed, scheduled, attention-timed", "keeps appointments or schedules service", "appointment slot, scheduled time", "appointment record or service calendar", "time given a face"],
    ["SBSC", "Law/civic life", "subscription, recurring access, repeated payment for continuing service", "subscribe, renew access, or sustain service by recurring exchange", "subscription, recurring access", "subscribed, recurring, access-renewed", "keeps subscriptions or renews service access", "subscription plan, recurring claim", "subscription record or cancellation right", "a small vow of continued provision"],
    ["BRKD", "Technology", "barcode, machine-readable price or identity stripe", "barcode, mark goods for scanning, or read striped identity", "barcode, scannable identity mark", "barcoded, scan-marked, machine-readable", "keeps barcodes or scans goods", "barcode label, scannable mark", "barcode registry or product identity standard", "a thing wearing a name a machine can read"],
    ["TKT", "Law/civic life", "ticket, entry claim, travel pass, or violation notice", "ticket, grant entry, mark travel, or cite violation", "ticket, entry or travel claim", "ticketed, claim-marked, pass-bearing", "issues tickets or checks entry claims", "ticket slip, pass mark", "ticket record or fare enforcement notice", "permission small enough to hold"],
    ["KTLG", "Speech", "catalog, ordered list of goods, works, or records for choosing", "catalog, list goods, or make an ordered choice record", "catalog, ordered choice list", "cataloged, listed, selection-ordered", "keeps catalogs or orders public lists", "catalog entry, listed item", "catalog record or inventory publication", "many things arranged so desire must choose"],
    ["KNF", "Building/making", "knife, cutting tool, sharpened edge for food, craft, or harm", "knife, cut by edge, or divide with sharpened tool", "knife, cutting tool", "knifed, edge-cut, sharpened", "keeps knives or cuts with edges", "knife blade, cutting edge", "knife safety or tool custody record", "an edge that must remember whether it serves or wounds"],
    ["SPWN", "Building/making", "spoon, scooping utensil, curved hand for liquid or soft food", "spoon, scoop, or serve by curved utensil", "spoon, scooping utensil", "spooned, scooped, bowl-handed", "keeps spoons or serves by scoop", "spoon bowl, scooping tool", "utensil standard or meal service record", "a small hand made for gentleness"],
    ["FRX", "Building/making", "fork, pronged utensil, pointed tool for holding food", "fork, pierce gently, or hold food by prongs", "fork, pronged utensil", "forked, pronged, food-held", "keeps forks or serves by prong", "fork tine, pronged tool", "utensil standard or meal service record", "many small points disciplined for eating"],
    ["PLDX", "Building/making", "plate, flat dish, surface that holds a meal before the person", "plate, serve on a flat dish, or set food before someone", "plate, flat meal dish", "plated, dish-held, meal-set", "sets plates or serves meals", "plate surface, meal dish", "dishware standard or meal service record", "a small table for one portion"],
    ["BWLX", "Building/making", "bowl, deep dish, vessel for liquid, grain, or gathered food", "bowl, serve in a deep dish, or gather food into a vessel", "bowl, deep dish", "bowled, vessel-held, gathered", "keeps bowls or serves gathered food", "bowl vessel, deep dish", "dishware standard or meal service record", "a hollow made to receive provision"],
    ["KWP", "Building/making", "cup, drinking vessel, small container lifted by the hand", "cup, drink from a vessel, or hold liquid for the mouth", "cup, drinking vessel", "cupped, vessel-held, hand-lifted", "keeps cups or serves drink", "cup vessel, drinking container", "drinkware standard or public sanitation record", "water given a shape for the hand"],
    ["PNX", "Building/making", "pan, shallow cooking vessel, held heat surface for food", "pan, cook on a shallow vessel, or hold food over heat", "pan, shallow cooking vessel", "panned, shallow-cooked, heat-held", "keeps pans or cooks by shallow heat", "pan surface, cooking vessel", "cookware standard or kitchen safety record", "heat made flat enough for care"],
    ["PTX", "Building/making", "pot, deep cooking vessel, container for boiling, soup, or shared food", "pot, boil in a vessel, or cook gathered provision", "pot, deep cooking vessel", "potted, boiled, vessel-cooked", "keeps pots or cooks gathered food", "pot vessel, boiling container", "cookware standard or kitchen safety record", "a small well made for warmth"],
    ["TRY", "Building/making", "tray, carrying surface, flat bearer for meals, tools, or offerings", "tray, carry on a flat surface, or bear several small things together", "tray, carrying surface", "trayed, surface-carried, gathered", "keeps trays or carries service goods", "tray surface, service bearer", "service tray or delivery equipment record", "many small burdens carried as one"],
    ["MBRL", "Building/making", "umbrella, portable rain shelter, hand-held roof against weather", "umbrella, shelter from rain, or carry a portable roof", "umbrella, portable rain shelter", "umbrella-covered, rain-sheltered, portable-roofed", "keeps umbrellas or shelters walkers", "umbrella canopy, rain shelter", "weather-shelter standard or public access record", "a little roof walking with the body"]
  ];

  return seeds.map(([id, category, semanticField, action, concept, quality, agent, object, civic, intimate]) =>
    seedRoot(id, category, semanticField, action, concept, quality, agent, object, civic, intimate)
  );
}

function v1SocialRoleRoots() {
  const seeds = [
    ["CRPN", "Building/making", "carpenter, woodworker, joinery craft, framed household making", "carpenter, join wood, frame buildings, or repair household structures", "carpentry, woodwork, joinery craft", "carpentered, wood-joined, frame-making", "works wood, frames buildings, or repairs household structures", "wood joint, frame, carpentered work", "carpentry license or building-trade record", "hands teaching wood to shelter a family"],
    ["MSNX", "Building/making", "mason, stone and brick craft, durable wall-making", "mason, lay stone, brick, or durable wall", "masonry, stonework, brick craft", "masoned, stone-laid, brick-bound", "lays stone or builds durable walls", "stone course, brickwork, masonry unit", "masonry permit or structural craft record", "patience stacked until a wall can stand"],
    ["PLMR", "Building/making", "plumber, water pipe craft, sanitation repair, household flow", "plumb, pipe water, or repair household flow", "plumbing, water-pipe craft", "plumbed, pipe-bound, flow-ordered", "repairs pipes or stewards household water", "pipe run, water line, plumbing fixture", "plumbing code or sanitation service record", "hidden water made trustworthy"],
    ["PWRK", "Building/making", "electrician, power work, wiring craft, charged-system safety", "wire power, repair electrical lines, or make charged systems safe", "electrical work, wiring craft", "wired, powered, current-bearing", "keeps wiring or repairs charged systems", "wire circuit, power line, electrical fixture", "electrical permit or power-safety record", "dangerous light taught to serve the house"],
    ["MCHN", "Technology", "mechanic, machine repair, moving-part stewardship", "repair machines, tune mechanisms, or restore moving parts", "mechanic craft, machine repair", "mechanical, tuned, moving-part repaired", "repairs machines or stewards mechanisms", "machine part, repaired mechanism", "mechanic service record or machinery safety standard", "listening to the machine before failure speaks loudly"],
    ["TLRX", "Building/making", "tailor, fitted clothing craft, measured garment repair", "tailor, fit garments, alter clothing, or mend dress to the body", "tailoring, fitted garment craft", "tailored, fitted, garment-measured", "fits garments or repairs clothing", "tailored seam, fitted garment", "tailoring record or garment alteration order", "cloth made answerable to the person"],
    ["WVRX", "Building/making", "weaver, textile making, thread-order craft", "weave, interlace thread, or make textile order", "weaving, textile craft", "woven, interlaced, thread-ordered", "weaves textiles or orders threads", "woven cloth, textile pattern", "textile standard or weaving craft record", "many small lines choosing not to separate"],
    ["CBLX", "Building/making", "cobbler, shoe repair, foot-covering craft", "cobble shoes, repair footwear, or fit walking protection", "cobbling, shoe repair craft", "cobbled, sole-repaired, foot-fitted", "repairs shoes or fits footwear", "shoe sole, repaired foot-covering", "footwear repair record or safety-shoe service", "the path repaired under the feet"],
    ["BBRX", "Body", "barber, hair grooming, face and head care craft", "barber, trim hair, shave, or groom the head and face", "barbering, hair grooming", "barbered, trimmed, groomed", "cuts hair or keeps grooming care", "haircut, shave, grooming act", "barber license or grooming service record", "care near the face made ordinary"],
    ["JNTR", "Building/making", "janitor, custodian, cleaning steward, kept public place", "clean, keep rooms, or steward shared places", "janitorial keeping, custodial cleaning", "clean-kept, custodial, room-stewarded", "keeps shared rooms clean", "cleaning round, custodial task", "custodial work order or facility record", "dignity guarded after everyone leaves"],
    ["HSKP", "Building/making", "housekeeper, household order, room care, domestic stewardship", "keep house, order rooms, or steward household care", "housekeeping, household order", "house-kept, room-ordered, domestic", "keeps households or orders rooms", "housekeeping task, room order", "lodging housekeeping record or household service standard", "ordinary order that lets people breathe"],
    ["WTRX", "Law/civic life", "waiter, table server, meal service, attentive provision", "wait tables, serve meals, or carry provision to persons", "table service, waiting, meal service", "served, table-attentive, provision-carried", "serves meals or attends tables", "service round, table order", "meal-service record or hospitality duty", "attention carrying food without making itself the center"],
    ["CHFX", "Body", "chef, kitchen lead, ordered cooking, meal craft authority", "chef, lead cooking, or order kitchen craft", "chef craft, kitchen leadership", "chef-made, kitchen-led, meal-ordered", "leads cooking or stewards kitchen craft", "menu dish, kitchen plan", "food-service lead record or kitchen standard", "fire, taste, and duty held in one hand"],
    ["DRVR", "Law/civic life", "driver, vehicle operator, road responsibility, carried bodies", "drive vehicles, carry persons, or steer road movement", "driving, vehicle operation", "driven, road-carried, vehicle-steered", "drives vehicles or carries passengers", "driven route, vehicle trip", "driver license or transport safety record", "hands entrusted with other bodies in motion"],
    ["PYLT", "Law/civic life", "pilot, air or vessel guide, high-risk navigation, carried lives", "pilot, guide craft, or steer dangerous travel", "piloting, craft guidance", "piloted, craft-guided, risk-steered", "pilots aircraft or vessels", "flight path, piloted craft", "pilot license or navigation safety record", "a path chosen where falling matters"],
    ["CRWX", "Law/civic life", "crew, work team, coordinated service body", "crew, work as a team, or coordinate shared labor", "crew, coordinated work team", "crewed, team-bound, service-coordinated", "works in a crew or coordinates shared labor", "crew shift, team unit", "crew roster or duty assignment", "many hands becoming one answerable body"],
    ["DLVR", "Law/civic life", "courier, delivery carrier, entrusted transport of goods or messages", "deliver, courier, or carry entrusted goods to a receiver", "courier work, delivery carrying", "delivered, couriered, receiver-bound", "delivers goods or carries messages", "delivery run, carried parcel", "delivery record or courier custody log", "trust moving from one door to another"],
    ["NVGT", "Law/civic life", "navigator, route finder, direction keeper, journey counsel", "navigate, find routes, or guide movement by direction", "navigation, route finding", "navigated, route-guided, direction-kept", "guides routes or keeps direction", "route plan, navigation mark", "navigation record or route-safety plan", "attention given to where the path is going"],
    ["PHYS", "Body", "physician, clinical judgment, bodily care, healing responsibility", "doctor, treat, diagnose, or judge bodily care", "physician care, clinical judgment", "physician-led, clinically judged, care-bound", "treats patients or judges bodily care", "clinical judgment, treatment plan", "physician license or medical care record", "knowledge placed close enough to suffering to answer"],
    ["DNTS", "Body", "dentist, tooth care, mouth repair, biting health", "dentist, treat teeth, or repair mouth health", "dentistry, tooth care", "dental, tooth-repaired, mouth-kept", "treats teeth or stewards mouth health", "dental treatment, tooth repair", "dental record or oral-care standard", "small hardness kept from becoming pain"],
    ["THRP", "Emotion", "therapist, guided healing conversation, emotional repair care", "therapize, counsel healing, or guide emotional repair", "therapy, guided healing care", "therapeutic, counseled, healing-guided", "guides therapy or stewards emotional repair", "therapy session, healing counsel", "therapy record or care-consent standard", "speech walking beside pain until it can move"],
    ["LWRX", "Law/civic life", "lawyer, advocate, legal counsel, duty before judgment", "lawyer, advocate, or counsel under public law", "lawyering, legal advocacy", "legally counseled, advocated, law-bound", "advocates in law or gives legal counsel", "legal brief, counsel act", "bar record or legal representation filing", "speech trained to stand beside another before judgment"],
    ["CLRK", "Law/civic life", "clerk, desk record service, public filing, ordinary administration", "clerk, file records, or serve at a public desk", "clerking, desk record service", "clerked, filed, desk-served", "keeps records or serves public filing", "desk entry, filed record", "clerk docket or service counter record", "small public order that prevents people from vanishing"],
    ["RCPT", "Law/civic life", "receptionist, first receiving role, front desk attention", "receive visitors, route requests, or keep first public attention", "reception, front desk receiving", "received, front-desk, request-routed", "receives visitors or routes requests", "reception note, visitor intake", "reception log or intake record", "the first face of an institution made answerable"],
    ["SCRB", "Speech", "scribe, secretary, written record keeper, dictated memory", "scribe, record speech, or keep written administrative memory", "scribal record, secretarial writing", "scribed, recorded, dictated", "records speech or keeps written memory", "scribe note, dictated record", "minutes record or secretarial filing", "a listening hand that keeps speech from disappearing"],
    ["HLPX", "Law/civic life", "assistant, helper, delegated support, enabling service", "assist, help, or support another's task under duty", "assistance, delegated help", "assisted, helped, support-bearing", "assists or supports delegated work", "support task, helper act", "assistant role record or delegated support duty", "strength added without stealing the work"],
    ["SPRV", "Law/civic life", "supervisor, oversight, watched responsibility, work guidance", "supervise, oversee work, or guide delegated responsibility", "supervision, work oversight", "supervised, overseen, responsibility-watched", "oversees work or guides responsibility", "supervision note, oversight act", "supervisory record or work-safety review", "watching power so work stays answerable"],
    ["MGRX", "Law/civic life", "manager, coordination, resource ordering, work stewardship", "manage, coordinate resources, or order work toward delivery", "management, work coordination", "managed, coordinated, resource-ordered", "coordinates work or stewards resources", "management plan, coordinated work", "management record or operations responsibility", "order serving work rather than replacing it"],
    ["MPLY", "Law/civic life", "employee, hired worker, wage duty, entrusted labor role", "employ, work as hired labor, or carry wage-bound duty", "employment, hired labor role", "employed, wage-bound, work-entrusted", "works as employee or carries hired duty", "employment post, wage role", "employment record or labor status", "work exchanged without erasing personhood"],
    ["MPRX", "Law/civic life", "employer, work-giver, wage stewardship, labor authority", "employ, hire, or hold authority over paid work", "employer role, wage stewardship", "employing, hiring, labor-answerable", "hires workers or stewards paid work", "employer office, hiring authority", "employer record or labor-duty filing", "power over work made answerable to provision"],
    ["CLNT", "Law/civic life", "client, represented person, service receiver with standing", "client, receive professional service, or stand represented", "clienthood, represented service standing", "client-held, represented, service-receiving", "receives professional service or is represented", "client file, represented matter", "client record or representation agreement", "need given standing before skill"],
    ["CSTM", "Law/civic life", "customer, buyer, service receiver in exchange", "customer, buy service, or receive exchange provision", "customer relation, service exchange", "customer-held, exchange-receiving, service-bound", "buys or receives service in exchange", "customer account, service request", "customer record or service claim", "the buyer still seen as a person"],
    ["CRGV", "Body", "caregiver, daily care role, entrusted bodily and household support", "caregive, tend persons, or carry daily entrusted support", "caregiving, entrusted daily care", "caregiven, tended, support-entrusted", "gives care or tends vulnerable persons", "care shift, support act", "caregiver record or care-duty plan", "another's weakness held without contempt"],
    ["VLTR", "Moral agency", "volunteer, freely offered service, chosen unpaid duty", "volunteer, offer service freely, or choose unpaid public help", "volunteering, freely chosen service", "voluntary, service-offered, unpaid", "volunteers or offers public help", "volunteer shift, offered service", "volunteer record or public service roster", "choice becoming useful without price"],
    ["NGRX", "Technology", "engineer, applied design, technical building under consequence", "engineer, design systems, or build technical structures", "engineering, applied design", "engineered, designed, consequence-built", "engineers systems or builds technical structures", "engineered system, technical design", "engineering license or design review record", "imagination made answerable to loads, users, and failure"],
    ["RKTX", "Building/making", "architect, building design, spatial order, shelter imagination", "architect, design buildings, or order shelter space", "architecture, building design", "architected, spatially ordered, shelter-designed", "designs buildings or orders space", "architectural plan, building form", "architecture filing or building design record", "a future room drawn before it shelters anyone"],
    ["DSGN", "Mind", "designer, intentional form, usable beauty, planned shape", "design, shape use, or plan form with purpose", "design, intentional form", "designed, purpose-shaped, use-ordered", "designs forms or shapes use", "design draft, planned form", "design review or accessibility standard", "beauty made responsible to use"],
    ["PRGR", "Technology", "programmer, code maker, executable instruction craft", "program, write code, or craft executable instructions", "programming, code craft", "programmed, coded, instruction-shaped", "writes code or stewards executable instructions", "program, code unit", "code contribution or developer record", "speech made precise enough for a machine to obey"],
    ["WRTR", "Speech", "writer, authored text, composed public or private speech", "write, author, or compose durable text", "writing, authored text", "written, authored, text-shaped", "writes or authors durable speech", "written work, manuscript", "authorship record or publication filing", "a mind leaving tracks for later attention"],
    ["PHTG", "Speech", "photographer, image witness, light-record craft", "photograph, record images, or witness by captured light", "photography, image witness craft", "photographic, image-recorded, light-captured", "photographs or stewards image witness", "photograph, image record", "image credit or visual evidence record", "light held still enough to testify"],
    ["CMPZ", "Ritual/poetry", "composer, arranged music, patterned sound maker", "compose music, arrange sound, or order melody", "composition, arranged music", "composed, music-ordered, melody-shaped", "composes music or orders sound", "composition score, arranged melody", "music rights record or performance score", "sound accepting duty to return beautifully"],
    ["SNGR", "Ritual/poetry", "singer, voiced melody, embodied song service", "sing, carry melody, or voice patterned sound", "singing, voiced melody", "sung, voiced, melody-carried", "sings or carries melody", "song line, sung phrase", "performance roster or vocal record", "the body lending breath to beauty"],
    ["DCRX", "Building/making", "decorator, arranged surface, household or public adornment", "decorate, arrange surfaces, or make places visibly fitting", "decoration, arranged surface", "decorated, adorned, surface-ordered", "decorates rooms or arranges visible fit", "decorative surface, arranged room", "interior work order or public display record", "beauty placed where ordinary life can notice it"],
    ["PRDX", "Law/civic life", "producer, organizer of public work, resource and delivery steward", "produce, organize work, or bring public making to completion", "production, organized making", "produced, delivery-ordered, resource-stewarded", "produces work or coordinates delivery", "production unit, delivered work", "production record or project responsibility", "many efforts gathered until something can answer"],
    ["NTPR", "Speech", "interpreter, live meaning carrier, speech across languages or systems", "interpret, carry live meaning, or mediate speech across tongues", "interpretation, live meaning carrying", "interpreted, meaning-carried, speech-mediated", "interprets speech or carries meaning across languages", "interpreted utterance, mediated meaning", "certified interpretation or access record", "meaning crossing a room without losing the person"],
    ["TRNR", "Mind", "trainer, practice guide, skill formation, repeated instruction", "train, drill skill, or guide repeated practice", "training, skill formation", "trained, practiced, skill-formed", "trains learners or guides practice", "training session, practice plan", "training record or competency program", "repetition placed under care"],
    ["CCHX", "Mind", "coach, performance guide, disciplined encouragement, skill correction", "coach, guide performance, or correct practice toward mastery", "coaching, performance guidance", "coached, performance-guided, practice-corrected", "coaches performers or guides skill", "coaching note, performance plan", "coaching record or development review", "encouragement that still tells the truth"],
    ["RPRX", "Conflict/repair", "repair worker, mender, practical restoration craft", "repair, mend, or restore broken practical things", "repair work, mending craft", "repaired, mended, restored", "repairs things or restores practical order", "repair ticket, mended object", "repair order or maintenance service record", "the one who comes after breakage and refuses final ruin"],
    ["DLGX", "Law/civic life", "delegate, representative, entrusted actor on behalf of another", "delegate, represent, or act under entrusted authority", "delegation, representative authority", "delegated, represented, entrusted-to-act", "acts as delegate or represents another", "delegated mandate, representative act", "delegation record or proxy authority", "a voice carrying another's standing"],
    ["WRDN", "Law/civic life", "warden, custodian, guarded institution, protective custody role", "warden, keep custody, or guard an institution under duty", "wardenship, custodial guarding", "wardened, custody-held, institution-guarded", "guards custody or stewards a kept place", "custody post, guarded ward", "warden appointment or custody record", "guarding that must remember the person inside the rule"]
  ];

  return seeds.map(([id, category, semanticField, action, concept, quality, agent, object, civic, intimate]) =>
    seedRoot(id, category, semanticField, action, concept, quality, agent, object, civic, intimate)
  );
}

function v1NatureAgricultureRoots() {
  const seeds = [
    ["KYNX", "Nature", "dog, canine companion, guard animal, faithful household creature", "keep dogs, guard as canine, or accompany faithfully", "dog, canine companion", "canine, faithful, guard-ready", "keeps dogs or works with canine companions", "dog body, canine animal", "animal license or canine control record", "faithful animal near the household"],
    ["FLN", "Nature", "cat, feline companion, quiet hunter, household presence", "keep cats, move as feline, or hunt quietly", "cat, feline companion", "feline, quiet, household-near", "keeps cats or tends feline companions", "cat body, feline animal", "animal registration or feline care record", "quiet presence that chooses nearness"],
    ["HRS", "Nature", "horse, riding animal, carried strength, working movement", "ride, keep horses, or carry strength by animal", "horse, riding animal", "equine, ridden, strength-carrying", "keeps horses or rides with care", "horse body, riding animal", "equine record or transport animal standard", "strength trusted under a hand"],
    ["KTLX", "Nature", "cattle, cow, herd provision, milk and field strength", "herd cattle, tend cows, or keep bovine provision", "cattle, cow, bovine herd", "bovine, herd-kept, provision-bearing", "keeps cattle or tends cows", "cow body, cattle animal", "livestock record or cattle health standard", "large provision made answerable to care"],
    ["SHPX", "Nature", "sheep, wool flock, gentle herd animal, pasture provision", "shepherd sheep, keep flocks, or gather wool provision", "sheep, wool flock", "ovine, flocked, wool-bearing", "keeps sheep or tends wool flocks", "sheep body, wool animal", "flock record or wool standard", "soft provision moving together"],
    ["GWTX", "Nature", "goat, browsing livestock, difficult provision, sure-footed animal", "keep goats, browse rough land, or tend resilient provision", "goat, browsing livestock", "caprine, browsing, resilient", "keeps goats or tends rough-land provision", "goat body, browsing animal", "goat herd record or small livestock standard", "stubborn provision on difficult ground"],
    ["PGYX", "Nature", "pig, swine, rooting livestock, dense provision", "keep pigs, root soil, or tend swine provision", "pig, swine livestock", "porcine, rooting, dense-provisioned", "keeps pigs or tends swine", "pig body, swine animal", "swine record or livestock health standard", "earth-hunger turned toward provision"],
    ["CHKN", "Nature", "chicken, domestic fowl, egg bird, small flock provision", "keep chickens, tend fowl, or gather egg provision", "chicken, domestic fowl", "chicken-like, flocked, egg-bearing", "keeps chickens or tends fowl", "chicken body, egg bird", "poultry record or fowl health standard", "small daily provision with wings"],
    ["DCKX", "Nature", "duck, waterfowl, pond bird, wetland provision", "keep ducks, move as waterfowl, or tend pond birds", "duck, waterfowl", "duck-like, pond-bound, water-moving", "keeps ducks or tends waterfowl", "duck body, waterfowl", "waterfowl record or wetland poultry standard", "a small body at home on water"],
    ["GSYX", "Nature", "goose, guarding waterfowl, loud flock bird, household alarm", "keep geese, guard as waterfowl, or move in loud flock", "goose, guarding waterfowl", "goose-like, loud, flock-guarding", "keeps geese or tends guarding waterfowl", "goose body, flock bird", "goose flock record or waterfowl standard", "a loud wing that guards the yard"],
    ["BYX", "Nature", "bee, pollinating insect, hive work, honeyed provision", "keep bees, pollinate, or work as hive life", "bee, pollinating insect", "bee-like, hive-bound, pollinating", "keeps bees or tends hives", "bee body, hive insect", "apiary record or pollinator protection standard", "small work that lets fruit continue"],
    ["BFLY", "Nature", "butterfly, winged transformation, delicate pollinator, visible change", "transform visibly, move by delicate wings, or tend pollinators", "butterfly, winged transformation", "butterfly-like, transformed, delicate-winged", "studies butterflies or protects pollinators", "butterfly body, wing pattern", "butterfly survey or habitat record", "change made beautiful enough to be noticed"],
    ["WRMX", "Nature", "worm, soil turner, small earth worker, decay helper", "worm, turn soil, or help decay return to ground", "worm, soil-turning life", "worm-like, soil-bound, decay-helping", "studies worms or tends soil life", "worm body, soil life", "soil biology record or compost-life standard", "hidden labor under the garden"],
    ["SNKX", "Nature", "snake, limbless animal, dangerous grace, skin-renewing life", "move as snake, shed skin, or carry limbless danger", "snake, limbless animal", "serpentine, skin-shedding, danger-graceful", "studies snakes or handles serpents", "snake body, serpent sign", "snake record or venom safety standard", "fear moving close to renewal"],
    ["FRGX", "Nature", "frog, amphibian, wetland voice, water-land life", "frog, live between water and land, or call from wetland", "frog, amphibian", "frog-like, wetland, water-land", "studies frogs or protects amphibians", "frog body, wetland call", "amphibian survey or water-quality record", "a small voice between water and ground"],
    ["TRTL", "Nature", "turtle, shell-bearing animal, slow endurance, water or land shield", "move as turtle, bear shell, or endure slowly", "turtle, shell-bearing animal", "turtle-like, shelled, slow-enduring", "studies turtles or protects shell-bearing life", "turtle body, shell animal", "turtle record or habitat protection", "patience carrying its own shelter"],
    ["DRYX", "Nature", "deer, wild grazing animal, alert forest life, gentle motion", "move as deer, graze wild land, or flee alertly", "deer, wild grazer", "deer-like, grazing, alert", "studies deer or tends wild herds", "deer body, antler sign", "wildlife record or deer management", "gentleness that listens before running"],
    ["BRYX", "Nature", "bear, great wild body, sleeping strength, forest power", "move as bear, carry great wild strength, or sleep through winter", "bear, great wild animal", "bear-like, strong, winter-sleeping", "studies bears or stewards bear country", "bear body, wild strength", "bear record or wildlife safety standard", "strength large enough to require distance"],
    ["WLFX", "Nature", "wolf, pack predator, wild kinship, coordinated hunt", "move as wolf, hunt in pack, or keep wild coordination", "wolf, pack predator", "wolf-like, pack-bound, hunting", "studies wolves or stewards predator balance", "wolf body, pack sign", "wolf record or predator management", "hunger disciplined by the pack"],
    ["FKSX", "Nature", "fox, small clever predator, hidden movement, wild cunning", "move as fox, hunt cleverly, or cross hidden ground", "fox, clever predator", "fox-like, clever, hidden-moving", "studies foxes or tracks small predators", "fox body, hidden track", "fox record or wildlife survey", "cleverness wearing a red coat of caution"],
    ["RBTX", "Nature", "rabbit, burrow animal, quick breeding life, soft prey", "move as rabbit, burrow, or multiply quickly", "rabbit, burrow animal", "rabbit-like, burrowing, quick", "keeps rabbits or studies burrow life", "rabbit body, burrow sign", "rabbit record or small animal care standard", "soft life alert to every sound"],
    ["MWSX", "Nature", "mouse, small rodent, hidden nibbling life, near-house animal", "move as mouse, gnaw, or live small near houses", "mouse, small rodent", "mouse-like, small, hidden-gnawing", "studies mice or controls small rodents", "mouse body, rodent sign", "rodent record or laboratory animal standard", "small life at the edge of the house"],
    ["SKRL", "Nature", "squirrel, tree rodent, stored food, quick climbing animal", "move as squirrel, climb trees, or store food", "squirrel, tree rodent", "squirrel-like, climbing, food-storing", "studies squirrels or tends tree rodents", "squirrel body, stored nut", "squirrel survey or urban wildlife record", "quick memory hidden in branches"],
    ["LPNX", "Nature", "elephant, great memory animal, tusked strength, kin herd", "move as elephant, remember by herd, or carry great strength", "elephant, great memory animal", "elephantine, tusked, memory-bearing", "studies elephants or protects great herds", "elephant body, tusk sign", "elephant record or conservation duty", "a large body that remembers the path"],
    ["LWNX", "Nature", "lion, great cat, pride animal, public strength", "move as lion, guard pride, or carry great-cat power", "lion, great cat", "lion-like, pride-bound, strong", "studies lions or stewards great cats", "lion body, pride sign", "lion record or conservation standard", "strength standing where all can see"],
    ["TGRX", "Nature", "tiger, striped great cat, solitary predator, hidden strength", "move as tiger, hunt alone, or carry striped hidden power", "tiger, striped great cat", "tiger-like, striped, solitary", "studies tigers or protects great cats", "tiger body, stripe sign", "tiger record or habitat protection", "strength moving alone through shadow"],
    ["MKYX", "Nature", "monkey, ape, hand-minded animal, social cleverness", "move as monkey, imitate, climb, or use hand-cleverness", "monkey, ape, hand-minded animal", "simian, climbing, hand-clever", "studies monkeys or tends primates", "monkey body, primate gesture", "primate record or research-care standard", "near-mind looking back from the branch"],
    ["WHLX", "Nature", "whale, great sea mammal, deep song, ocean body", "move as whale, sound through depth, or carry ocean immensity", "whale, great sea mammal", "whale-like, oceanic, deep-sounding", "studies whales or protects sea mammals", "whale body, deep-song sign", "whale record or marine conservation", "a mountain of life moving under water"],
    ["DLFN", "Nature", "dolphin, intelligent sea mammal, playful cooperation, water mind", "move as dolphin, cooperate in water, or signal playfully", "dolphin, intelligent sea mammal", "dolphin-like, cooperative, water-minded", "studies dolphins or protects sea mammals", "dolphin body, water signal", "dolphin record or marine care standard", "joyful intelligence crossing waves"],
    ["CRBX", "Nature", "crab, shelled shore animal, sideways movement, clawed life", "move as crab, carry shell, or grasp sideways", "crab, shelled shore animal", "crab-like, shelled, claw-bearing", "studies crabs or tends shore life", "crab body, claw sign", "crab harvest record or shore ecology standard", "a small armored life walking sideways"],
    ["SRMP", "Nature", "shrimp, small sea creature, shell food, quick water life", "move as shrimp, swarm in water, or carry small shell provision", "shrimp, small sea creature", "shrimp-like, small, shell-bearing", "studies shrimp or tends water harvests", "shrimp body, small shell", "shrimp harvest record or aquaculture standard", "small sea provision gathered carefully"],
    ["CLLX", "Nature", "shellfish, oyster or mussel, hard-shell sea provision", "shell, filter water, or live as hard-shell sea provision", "shellfish, oyster, mussel", "shelled, filter-feeding, sea-bound", "studies shellfish or tends shell harvests", "shellfish body, oyster shell", "shellfish safety record or coastal harvest standard", "water cleaned inside a hard house"],
    ["NTTX", "Nature", "ant, colony insect, tiny coordinated labor, common burden", "move as ant, coordinate colony labor, or carry tiny burdens", "ant, colony insect", "ant-like, colony-bound, burden-carrying", "studies ants or tracks colony life", "ant body, colony sign", "ant survey or pest record", "small work multiplied until it becomes a road"],
    ["SPDR", "Nature", "spider, web maker, patient trap, thread hunter", "move as spider, weave webs, or wait by thread", "spider, web maker", "spider-like, web-woven, patient", "studies spiders or tends web ecology", "spider body, web sign", "spider record or venom safety note", "patience drawing a net from itself"],
    ["CRWN", "Nature", "crow, raven, clever black bird, scavenger witness", "move as crow, call harshly, or gather as clever scavenger", "crow, raven, black bird", "crow-like, black-winged, clever", "studies crows or tracks corvids", "crow body, black feather", "corvid record or urban bird survey", "a dark witness remembering what others drop"],
    ["FRMX", "Nature", "farm, cultivated holding, provision land, worked ecology", "farm, cultivate land, or steward provision ground", "farm, cultivated holding", "farmed, cultivated, provision-bearing", "farms land or stewards cultivation", "farm plot, cultivated holding", "farm record or agricultural duty", "land made answerable to hunger and future"],
    ["FLDX", "Nature", "field, open cultivated ground, visible working land", "field, open ground, or cultivate a broad plot", "field, cultivated ground", "fielded, open, cultivated", "keeps fields or works open ground", "field plot, open ground", "field boundary or land-use record", "open earth waiting for care"],
    ["CRPX", "Nature", "crop, cultivated yield, seasonal provision, grown return", "crop, grow yield, or gather cultivated return", "crop, cultivated yield", "cropped, cultivated, yield-bearing", "grows crops or tracks yield", "crop row, harvested yield", "crop report or food-supply record", "the field answering the work"],
    ["HRVX", "Nature", "harvest, gathered season, provision brought in at ripeness", "harvest, gather ripe provision, or bring season home", "harvest, gathered season", "harvested, ripe-gathered, season-brought", "harvests crops or gathers provision", "harvest load, gathered yield", "harvest record or food-stock report", "gratitude made practical before winter"],
    ["PLWX", "Nature", "plow, soil-opening tool, field preparation, cut earth", "plow, open soil, or prepare field rows", "plow, soil-opening work", "plowed, furrowed, field-prepared", "plows fields or opens soil", "plow blade, furrow line", "plowing record or soil-preparation standard", "the wound in earth made for seed"],
    ["RRGX", "Nature", "irrigation, guided water, field flow, cultivated thirst repair", "irrigate, guide water, or repair field thirst", "irrigation, guided field water", "irrigated, water-guided, thirst-repaired", "irrigates fields or manages water flow", "irrigation channel, field water", "irrigation right or water-use record", "water taught where need is waiting"],
    ["GRNX", "Nature", "grain, dry seed staple, stored field provision", "grain, dry seed, or store staple provision", "grain, dry seed staple", "grain-bearing, stored, seed-dry", "grows grain or keeps staple stores", "grain kernel, stored seed", "grain standard or food reserve record", "small food made countable for winter"],
    ["WHTX", "Nature", "wheat, bread grain, field staple, milled provision", "grow wheat, mill bread grain, or steward field staple", "wheat, bread grain", "wheat-bearing, milled, bread-bound", "grows wheat or keeps bread grain", "wheat kernel, field stalk", "wheat harvest record or grain standard", "bread still standing in the field"],
    ["KRNX", "Nature", "corn, maize, tall grain, many-kernel provision", "grow corn, gather maize, or keep tall grain", "corn, maize", "corn-bearing, tall-grained, many-kerneled", "grows corn or tends maize", "corn ear, maize kernel", "corn harvest record or crop standard", "many small provisions held on one stem"],
    ["BNNX", "Nature", "bean, legume, pod seed, soil-feeding provision", "grow beans, pod seeds, or feed soil by legumes", "bean, legume, pod seed", "bean-bearing, podded, soil-feeding", "grows beans or tends legumes", "bean seed, pod", "legume record or crop rotation standard", "food that feeds the field back"],
    ["PTTX", "Nature", "potato, tuber, hidden ground provision, stored root food", "grow potatoes, lift tubers, or store ground provision", "potato, tuber", "tuber-bearing, ground-hidden, stored", "grows potatoes or tends tubers", "potato tuber, root food", "tuber harvest record or storage standard", "provision hidden under ordinary soil"],
    ["TMTX", "Nature", "tomato, fruiting vegetable, red garden provision, soft crop", "grow tomatoes, tend fruiting vegetables, or harvest soft crop", "tomato, fruiting vegetable", "tomato-bearing, red, soft-cropped", "grows tomatoes or tends garden fruit", "tomato fruit, garden crop", "tomato crop record or produce standard", "summer held in red skin"],
    ["GRDN", "Nature", "garden, tended small cultivation, household growing place", "garden, tend small cultivation, or grow household provision", "garden, tended growing place", "gardened, tended, household-grown", "gardens or tends small growing places", "garden bed, tended plot", "garden record or community growing rule", "a small field close enough to love"],
    ["RCDX", "Nature", "orchard, fruit tree grove, long-tended sweetness, seasonal grove", "orchard, tend fruit trees, or keep grove provision", "orchard, fruit tree grove", "orcharded, tree-grown, seasonal", "keeps orchards or tends fruit trees", "orchard row, fruit tree", "orchard record or tree-crop standard", "sweetness that takes years to answer"],
    ["VYND", "Nature", "vineyard, vine row, grape field, patient cultivated fruit", "tend vineyards, train vines, or keep grape rows", "vineyard, vine row", "vine-grown, row-trained, grape-bearing", "keeps vineyards or tends vines", "vine row, grape cluster", "vineyard record or grape harvest standard", "fruit taught to climb before it gives"]
  ];

  return seeds.map(([id, category, semanticField, action, concept, quality, agent, object, civic, intimate]) =>
    seedRoot(id, category, semanticField, action, concept, quality, agent, object, civic, intimate)
  );
}

function v1SecurityOperationsRoots() {
  const seeds = [
    ["RMRX", "Conflict/repair", "armor, worn protection, body shield against force", "armor, protect by worn defense, or cover against force", "armor, worn protection", "armored, body-shielded, force-covered", "keeps armor or protects by worn defense", "armor plate, protective vest", "armor issue record or protective equipment standard", "protection close enough to touch the body"],
    ["FRRM", "Conflict/repair", "firearm, projectile weapon, regulated lethal force", "fire, bear firearms, or project force by weapon", "firearm, projectile weapon", "firearm-bearing, projectile, regulated-lethal", "controls firearms or bears regulated arms", "firearm, rifle, sidearm", "firearm registry or use-of-force record", "force that must answer before it is lifted"],
    ["MSLX", "Conflict/repair", "missile, launched weapon, distant strike, guided projectile", "launch missiles, strike at distance, or guide projectile force", "missile, guided projectile", "missile-bearing, launched, distance-striking", "launches or controls missiles", "missile round, guided projectile", "missile authorization or strike record", "distant force that still has a moral address"],
    ["DRNX", "Conflict/repair", "drone, unmanned craft, remote watcher or striker", "operate drones, watch remotely, or project action without bodily presence", "drone, unmanned craft", "drone-borne, remote, unmanned", "operates drones or remote craft", "drone unit, remote craft", "drone authorization or flight log", "distance that must not erase responsibility"],
    ["SRVL", "Conflict/repair", "surveillance, watched field, persistent security observation", "surveil, watch persistently, or keep security observation", "surveillance, persistent watch", "surveilled, watched, observation-bound", "keeps surveillance or watches security fields", "surveillance feed, watched field", "surveillance warrant or monitoring record", "watching that must justify its gaze"],
    ["CTRM", "Conflict/repair", "countermeasure, answer to threat, protective response system", "countermeasure, answer threat, or deploy protective response", "countermeasure, threat answer", "countered, response-ready, protective", "deploys countermeasures or answers threats", "countermeasure device, protective response", "countermeasure authorization or defense standard", "answering harm without becoming harm"],
    ["HSTG", "Conflict/repair", "hostage, held person, coerced life used as leverage", "hold hostage, coerce by captive life, or protect held persons", "hostage, held person", "hostage-held, captive, coerced", "holds or rescues hostages", "hostage person, captive leverage", "hostage report or protected-person case", "a person never reducible to leverage"],
    ["MBXC", "Conflict/repair", "ambush, hidden attack, concealed strike from waiting", "ambush, strike from concealment, or wait in hidden force", "ambush, hidden attack", "ambushed, concealed, waiting-strike", "ambushes or detects hidden attack", "ambush point, concealed strike", "ambush report or tactical warning", "hidden force brought into the open by naming"],
    ["RTRT", "Conflict/repair", "retreat, ordered withdrawal, preserved force under pressure", "retreat, withdraw under pressure, or preserve force by leaving", "retreat, ordered withdrawal", "retreating, withdrawn, pressure-preserved", "retreats or orders withdrawal", "retreat route, withdrawal order", "retreat record or withdrawal plan", "leaving without lying about danger"],
    ["BRCD", "Conflict/repair", "barricade, improvised barrier, blocked passage under danger", "barricade, block passage, or raise emergency barrier", "barricade, emergency barrier", "barricaded, blocked, barrier-raised", "raises barricades or clears blocked passage", "barricade line, emergency barrier", "barricade order or obstruction record", "a door made public by danger"],
    ["CHKP", "Conflict/repair", "checkpoint, controlled passage, inspected threshold under security", "checkpoint, inspect passage, or control a security threshold", "checkpoint, controlled passage", "checkpointed, inspected, threshold-controlled", "keeps checkpoints or inspects passage", "checkpoint gate, inspection post", "checkpoint order or passage record", "entry that must remember the person crossing"],
    ["CRFW", "Conflict/repair", "curfew, restricted time, public movement limit under danger", "curfew, restrict movement by time, or order public staying", "curfew, restricted time", "curfew-bound, time-restricted, movement-limited", "sets curfews or guards restricted time", "curfew order, restricted hour", "curfew notice or emergency movement rule", "time narrowed so life can be protected"],
    ["BLKD", "Conflict/repair", "blockade, denied passage, pressure by closed route", "blockade, deny passage, or pressure by closure", "blockade, closed route pressure", "blockaded, closed, passage-denied", "keeps blockades or breaks passage denial", "blockade line, closed route", "blockade record or sanctions route notice", "closed roads that make hunger speak"],
    ["CNVY", "Conflict/repair", "convoy, protected movement group, escorted line of travel", "convoy, escort movement, or travel in protected line", "convoy, protected movement group", "convoyed, escorted, line-protected", "leads convoys or escorts movement", "convoy line, escorted group", "convoy manifest or protected-route order", "many lives made safer by moving together"],
    ["SNTL", "Conflict/repair", "sentinel, posted watcher, guard who keeps boundary awake", "stand sentinel, guard awake, or watch a boundary", "sentinel, posted watcher", "sentinel, posted, boundary-awake", "stands sentry or keeps watch", "sentinel post, watch station", "sentry assignment or guard record", "one wakefulness given for many sleeping bodies"],
    ["NTRL", "Conflict/repair", "neutrality, non-belligerent stance, refusal to join force", "remain neutral, hold non-belligerence, or refuse war alignment", "neutrality, non-belligerent stance", "neutral, non-belligerent, unaligned", "keeps neutrality or mediates from nonalignment", "neutral zone, unaligned stance", "neutrality declaration or protected status", "standing apart without indifference"],
    ["CLTR", "Conflict/repair", "collateral harm, indirect damage, unintended injury around force", "cause collateral harm, track indirect damage, or prevent unintended injury", "collateral harm, indirect damage", "collateral, indirect, harm-adjacent", "tracks collateral harm or limits indirect damage", "collateral injury, indirect loss", "collateral damage report or harm review", "the side wound that must not be hidden"],
    ["CSLT", "Conflict/repair", "casualty, harmed person, counted injury or death in conflict", "make casualty, count harmed persons, or report conflict injury", "casualty, harmed person", "casualty-marked, harmed, counted", "counts casualties or cares for the harmed", "casualty list, injury count", "casualty report or protected-person record", "a count that must stay a name"],
    ["DSST", "Conflict/repair", "disaster, sudden public ruin, wide harm needing coordinated repair", "enter disaster, suffer public ruin, or coordinate wide repair", "disaster, public ruin", "disastrous, wide-harmed, ruin-struck", "responds to disaster or bears public ruin", "disaster zone, ruin event", "disaster declaration or recovery record", "wide harm calling strangers into duty"],
    ["MNTR", "Conflict/repair", "monitoring, continued watch, measured follow-up under risk", "monitor, continue watch, or measure follow-up under risk", "monitoring, continued watch", "monitored, watched, follow-up-measured", "monitors risk or follows danger signals", "monitoring log, watch measure", "monitoring record or compliance watch", "attention that stays after first danger"],
    ["HMNT", "Conflict/repair", "humanitarian protection, person-first aid under conflict", "protect humanely, give conflict aid, or guard persons before sides", "humanitarian protection, person-first aid", "humanitarian, person-first, aid-bearing", "keeps humanitarian aid or protects persons", "aid parcel, protection mission", "humanitarian corridor or relief mandate", "help given before asking which side"],
    ["CRDR", "Conflict/repair", "corridor, protected route, passage for aid or evacuation", "open corridor, protect passage, or route aid through danger", "corridor, protected route", "corridor-open, route-protected, passage-held", "keeps corridors or escorts protected passage", "safe corridor, protected route", "corridor agreement or passage record", "a path kept open because life must pass"],
    ["SPRT", "Conflict/repair", "support, sustaining aid, force or care held behind action", "support, sustain action, or hold aid behind another", "support, sustaining aid", "supported, sustaining, aid-backed", "supports others or sustains an operation", "support line, aid base", "support order or logistics record", "strength placed under another's burden"],
    ["STBL", "Conflict/repair", "stabilization, restored order after shock, held balance under risk", "stabilize, restore order, or hold balance after shock", "stabilization, restored order", "stable, stabilized, balance-held", "stabilizes systems or communities after shock", "stabilization plan, restored balance", "stabilization mandate or recovery benchmark", "the first quiet after fear"],
    ["DMNX", "Conflict/repair", "demining, removal of hidden explosives, land made walkable again", "demine, clear hidden explosives, or make land walkable", "demining, explosive clearing", "demined, cleared, walkable", "demines land or clears hidden explosives", "cleared mine, safe path marker", "demining record or clearance certificate", "ground returned to ordinary feet"],
    ["PRSN", "Conflict/repair", "prisoner, captured person, restrained enemy still bearing dignity", "take prisoner, restrain captives, or protect captured persons", "prisoner, captured person", "prisoner-held, captured, restrained", "guards prisoners or protects captives", "prisoner file, captive status", "prisoner record or detention standard", "an enemy still under the law of personhood"],
    ["DSRM", "Conflict/repair", "disarmament, weapons laid down, force reduced by agreement", "disarm, lay down weapons, or reduce force by agreement", "disarmament, weapons laid down", "disarmed, force-reduced, weapon-laid", "disarms forces or verifies weapon surrender", "disarmament list, surrendered weapon", "disarmament protocol or weapons handover", "power lowered so speech can return"],
    ["TRGT", "Conflict/repair", "target, selected point of force, intended strike object", "target, select for force, or mark intended strike", "target, intended strike point", "targeted, selected, strike-marked", "targets or reviews target selection", "target point, strike mark", "targeting review or authorization record", "selection that must answer to truth before force"],
    ["FRNT", "Conflict/repair", "front, line of contact, forward edge of conflict", "front, hold contact line, or face conflict edge", "front, line of contact", "frontline, contact-facing, forward", "holds the front or serves at conflict edge", "front line, contact edge", "front report or deployment map", "the edge where fear becomes public"],
    ["FLNK", "Conflict/repair", "flank, side exposure, lateral defense or approach", "flank, guard the side, or approach by lateral route", "flank, side exposure", "flanked, side-guarded, lateral", "guards flanks or approaches from the side", "flank route, side line", "flank report or tactical map", "what danger does not meet face first"],
    ["BNKR", "Conflict/repair", "bunker, hardened shelter, protected underground position", "bunker, shelter hard, or hold protected position", "bunker, hardened shelter", "bunkered, hardened, underground-protected", "keeps bunkers or shelters under force", "bunker room, hardened position", "bunker registry or shelter standard", "a room built because fear became concrete"],
    ["RDRX", "Conflict/repair", "radar, distance sensing, unseen movement made visible", "radar, sense at distance, or reveal unseen movement", "radar, distance sensing", "radar-seen, distance-sensed, movement-visible", "operates radar or senses distant movement", "radar return, detection sweep", "radar log or airspace warning", "seeing before the eye can see"],
    ["MBLX", "Conflict/repair", "mobilization, mustered readiness, people and tools called into action", "mobilize, muster, or call readiness into action", "mobilization, mustered readiness", "mobilized, mustered, action-ready", "mobilizes people or prepares readiness", "mobilization order, mustered force", "mobilization notice or readiness record", "readiness that asks whether force is necessary"],
    ["DSPC", "Conflict/repair", "dispatch, sent response, ordered movement under urgency", "dispatch, send response, or order urgent movement", "dispatch, sent response", "dispatched, sent, urgency-ordered", "dispatches responders or sends ordered movement", "dispatch call, response order", "dispatch log or response assignment", "help given an address and a time"],
    ["RLFN", "Conflict/repair", "relief, aid after harm, burden lightened by shared provision", "relieve, bring aid, or lighten burden after harm", "relief, harm aid", "relieved, aid-bearing, burden-lightened", "brings relief or coordinates aid", "relief parcel, aid station", "relief record or aid distribution", "provision arriving after the break"],
    ["CVLN", "Conflict/repair", "civilian, noncombatant person, protected public life amid conflict", "protect civilians, remain noncombatant, or mark public personhood in war", "civilian, noncombatant person", "civilian, noncombatant, protected", "protects civilians or records noncombatant status", "civilian person, noncombatant status", "civilian protection record or casualty review", "the person war must not swallow"],
    ["MRDR", "Conflict/repair", "murder, unlawful killing, personhood destroyed by violence", "murder, unlawfully kill, or investigate killing", "murder, unlawful killing", "murdered, unlawful, life-destroyed", "murders or investigates unlawful killing", "murder case, killed person", "murder charge or homicide record", "life taken against truth and duty"],
    ["TRTR", "Conflict/repair", "torture, coerced pain, truth broken by cruelty", "torture, coerce by pain, or forbid cruelty", "torture, coerced pain", "tortured, cruel, pain-coerced", "tortures or investigates cruelty", "torture act, coerced confession", "torture prohibition or abuse record", "pain used to make truth lie"],
    ["KDNX", "Conflict/repair", "kidnapping, stolen person, coerced removal from protection", "kidnap, steal a person, or recover abducted persons", "kidnapping, stolen person", "kidnapped, abducted, protection-stolen", "kidnaps or recovers abducted persons", "kidnapping case, abducted person", "kidnapping report or recovery order", "a path forced against a person's name"],
    ["LTNX", "Conflict/repair", "looting, theft amid disorder, taking from broken public order", "loot, steal amid disorder, or prevent disaster theft", "looting, disorder theft", "looted, disorder-taken, theft-marked", "loots or prevents looting", "looted good, disorder theft", "looting charge or disaster property record", "taking when another's walls are down"],
    ["RMBX", "Conflict/repair", "rubble, broken debris, collapsed built form after harm", "reduce to rubble, clear debris, or mark collapsed form", "rubble, broken debris", "rubbled, collapsed, debris-broken", "clears rubble or records collapse", "rubble field, debris pile", "debris clearance record or collapse report", "what remains when shelter fails"],
    ["FLRX", "Conflict/repair", "flare, visible distress signal, light sent under danger", "flare, signal distress by light, or mark emergency visibility", "flare, distress light", "flared, light-signaled, distress-visible", "sends flares or watches distress signals", "flare light, distress marker", "flare log or rescue signal record", "small light refusing to disappear"],
    ["SPLY", "Conflict/repair", "supply line, provision route, material support under risk", "supply, maintain provision routes, or carry material support", "supply line, provision route", "supplied, route-fed, support-bearing", "supplies operations or protects provision routes", "supply route, provision load", "supply manifest or logistics record", "care made into a moving line"],
    ["TNLX", "Conflict/repair", "tunnel, hidden passage, protected or covert underground route", "tunnel, pass underground, or move through hidden route", "tunnel, hidden passage", "tunneled, underground, hidden-route", "keeps tunnels or searches hidden passage", "tunnel shaft, underground route", "tunnel survey or security breach record", "a path under the visible world"],
    ["DRPX", "Conflict/repair", "drop zone, delivered aid or force from above, marked landing field", "drop, mark landing field, or deliver from above", "drop zone, landing delivery field", "dropped, landing-marked, delivered", "marks drop zones or coordinates delivery", "drop marker, landing field", "drop-zone order or delivery record", "arrival from above made accountable"],
    ["WRNX", "Conflict/repair", "warning, named danger before harm, time given for protection", "warn, name danger, or give time before harm", "warning, named danger", "warned, danger-named, protection-timed", "warns others or keeps danger notices", "warning notice, danger sign", "warning order or public alert record", "mercy given before the blow"],
    ["SCNX", "Conflict/repair", "scene, secured place of incident, field of evidence after harm", "secure a scene, preserve incident place, or mark evidence field", "scene, incident place", "scene-secured, incident-marked, evidence-held", "secures scenes or preserves evidence fields", "incident scene, secured area", "scene log or evidence preservation record", "the place where harm must become truth"],
    ["LCKD", "Conflict/repair", "lockdown, sealed protective order, movement stopped for safety", "lock down, seal for protection, or stop movement under danger", "lockdown, protective sealing", "locked-down, sealed, movement-stopped", "orders lockdown or protects sealed spaces", "lockdown order, sealed room", "lockdown notice or protective movement rule", "closed doors as temporary care"],
    ["FRNS", "Conflict/repair", "forensics, evidence craft after harm, truth work from traces", "forensicize, examine traces, or draw truth from harm evidence", "forensics, trace evidence craft", "forensic, trace-reading, evidence-bound", "keeps forensics or examines traces", "forensic trace, evidence sample", "forensic report or chain-of-custody record", "truth gathered from what violence left behind"],
    ["PLDR", "Conflict/repair", "plunder, organized taking by force, theft under conquest", "plunder, seize by force, or strip provision under conquest", "plunder, force theft", "plundered, force-taken, conquest-stripped", "plunders or investigates force theft", "plundered goods, conquest seizure", "plunder claim or restitution record", "wealth taken where duty was broken"]
  ];

  return seeds.map(([id, category, semanticField, action, concept, quality, agent, object, civic, intimate]) =>
    seedRoot(id, category, semanticField, action, concept, quality, agent, object, civic, intimate)
  );
}

function v1ScientificMethodRoots() {
  const seeds = [
    ["LMMX", "Mind", "lemma, supporting theorem, small proven step that lets larger proof stand", "prove a lemma, support a proof, or establish a small necessary claim", "lemma, supporting theorem", "lemmatic, proof-supporting, small-proven", "proves lemmas or supports larger proofs", "lemma statement, supporting proof step", "lemma record or formal proof dependency", "a small truth carrying a larger truth"],
    ["CRLY", "Mind", "corollary, consequence theorem, result following from proven truth", "draw a corollary, follow from proof, or name a consequence theorem", "corollary, consequence theorem", "corollary, proof-following, consequence-bound", "draws corollaries or tracks proof consequences", "corollary statement, derived result", "corollary record or proof consequence note", "truth walking out from truth already seen"],
    ["PSTL", "Mind", "postulate, assumed starting claim, declared ground for inquiry", "postulate, assume openly, or declare a starting ground", "postulate, assumed starting claim", "postulated, openly-assumed, inquiry-grounding", "sets postulates or examines assumptions", "postulate statement, assumed ground", "postulate record or model assumption disclosure", "a beginning confessed before reasoning begins"],
    ["CNJG", "Mind", "conjecture, unproven claim, disciplined possibility awaiting proof", "conjecture, propose an unproven claim, or invite proof", "conjecture, disciplined unproven claim", "conjectural, unproven, proof-awaiting", "makes conjectures or tests proposed claims", "conjecture statement, open claim", "conjecture register or open-problem record", "hope made precise enough to be tested"],
    ["GNVL", "Mind", "eigenvalue, characteristic measure, value revealing a transformation's nature", "find eigenvalues, measure characteristic action, or reveal invariant scale", "eigenvalue, characteristic measure", "eigenvalued, characteristic, transformation-scaled", "computes eigenvalues or studies characteristic measures", "eigenvalue mark, invariant scale", "eigenvalue record or spectral analysis note", "a number by which a change reveals itself"],
    ["GNVK", "Mind", "eigenvector, invariant direction, vector that keeps direction under transformation", "find eigenvectors, preserve direction through transformation, or trace invariant orientation", "eigenvector, invariant direction", "eigenvectorial, direction-kept, transformation-invariant", "computes eigenvectors or studies invariant directions", "eigenvector line, invariant direction", "eigenvector record or spectral method note", "a direction that survives being changed"],
    ["JCBN", "Mind", "Jacobian, local transformation measure, many-rate map of change", "compute a Jacobian, map local rates, or measure transformation around a point", "Jacobian, local transformation measure", "Jacobian, local-rate, transformation-mapped", "computes Jacobians or maps local change", "Jacobian matrix, local rate map", "Jacobian record or multivariable analysis note", "many changes made answerable at one place"],
    ["HSSN", "Mind", "Hessian, curvature matrix, second-change structure of a field", "compute a Hessian, measure curvature, or trace second change", "Hessian, curvature matrix", "Hessian, curvature-measured, second-change", "computes Hessians or studies curvature fields", "Hessian matrix, curvature map", "Hessian record or optimization analysis note", "change looking back at how change itself changes"],
    ["MNDL", "Mind", "manifold, locally ordered space, curved field treated by disciplined coordinates", "model manifolds, chart curved space, or reason by local order", "manifold, locally ordered space", "manifold, locally-charted, curved-order", "studies manifolds or charts local spaces", "manifold patch, local coordinate field", "manifold record or geometric model", "space carrying many small maps without losing one body"],
    ["FRCT", "Mind", "fractal, self-similar form, pattern repeating across scale", "fractalize, trace self-similarity, or compare form across scale", "fractal, self-similar form", "fractal, scale-repeating, self-similar", "studies fractals or generates scale patterns", "fractal edge, repeated form", "fractal record or complexity analysis", "small shape remembering the whole"],
    ["LGTM", "Mind", "logarithm, scale-compressing number, multiplicative relation made countable", "logarithmize, compress scale, or count multiplicative relation", "logarithm, scale-compressing number", "logarithmic, scale-compressed, relation-counted", "uses logarithms or teaches scale compression", "logarithm value, scale relation", "logarithm record or numerical method", "vastness folded so thought can hold it"],
    ["TRGM", "Mind", "trigonometry, angle measure, relation of turning, length, and cycle", "use trigonometry, measure angles, or relate turning and length", "trigonometry, angle relation", "trigonometric, angle-bound, cycle-measured", "studies trigonometry or measures angled relations", "trigonometric ratio, angle measure", "trigonometry record or geometric calculation", "turning made accountable to number"],
    ["DFRL", "Mind", "differential equation, relation of change, law written through rates", "solve differential equations, relate rates, or model change by law", "differential equation, rate relation", "differential, rate-bound, change-lawed", "solves differential equations or models rate laws", "rate equation, differential relation", "differential-equation record or dynamic model", "law spoken in the grammar of change"],
    ["MNDN", "Mind", "median, middle value, ordered center resistant to extremes", "find medians, order values, or name the resistant center", "median, ordered middle value", "median, center-held, order-resistant", "computes medians or reports ordered centers", "median mark, middle statistic", "median record or summary statistic", "the middle that refuses to be dragged by extremes"],
    ["KRTL", "Mind", "quartile, quarter boundary, ordered distribution cut into four parts", "quartile, divide ordered values, or mark distribution quarters", "quartile, quarter distribution boundary", "quartile-bound, order-divided, quarter-marked", "computes quartiles or reads distribution quarters", "quartile mark, distribution cut", "quartile record or spread summary", "a field of values taught where its quarters stand"],
    ["PCTL", "Mind", "percentile, ranked position, value standing within a hundred-part order", "percentile, rank values, or mark standing within distribution", "percentile, ranked distribution position", "percentile-ranked, distribution-placed, hundred-part", "computes percentiles or reports ranked standing", "percentile mark, rank position", "percentile record or statistical standing note", "a person or value located without pretending the rank is the whole truth"],
    ["STDV", "Mind", "standard deviation, typical spread, measured distance from a mean", "measure standard deviation, quantify spread, or report typical distance", "standard deviation, typical spread", "deviation-measured, spread-bound, mean-distant", "computes deviation or explains spread", "deviation value, spread measure", "standard-deviation record or statistical disclosure", "how far the many wander from their center"],
    ["XTLR", "Mind", "outlier, far value, case distant from expected pattern", "mark outliers, stand outside pattern, or test distant cases", "outlier, distant case", "outlying, pattern-distant, far-standing", "finds outliers or investigates distant cases", "outlier point, distant value", "outlier report or anomaly review", "the far case asking whether the pattern is honest"],
    ["RSDL", "Mind", "residual, remaining error, difference left after model explanation", "measure residuals, keep remaining difference, or test what explanation left behind", "residual, remaining error", "residual, remainder-bearing, model-left", "computes residuals or studies unexplained remainder", "residual mark, model remainder", "residual record or model-fit report", "what the explanation still owes reality"],
    ["RGRS", "Mind", "regression, fitted relation, modeled dependence across measured values", "regress statistically, fit relation, or model dependence from data", "regression, fitted statistical relation", "regressed, relation-fitted, dependence-modeled", "runs regressions or interprets fitted relations", "regression line, fitted model", "regression report or model disclosure", "a line drawn humbly through many witnesses"],
    ["LKLH", "Mind", "likelihood, evidence-weight of a model, plausibility under observed data", "estimate likelihood, weigh models by evidence, or compare fit under data", "likelihood, model evidence weight", "likely, evidence-weighted, model-fit", "computes likelihoods or compares model fit", "likelihood value, evidence weight", "likelihood record or statistical inference note", "evidence leaning without pretending certainty"],
    ["PRYR", "Mind", "prior, before-evidence belief, starting probability carried into judgment", "set priors, state prior belief, or discipline starting expectation", "prior, before-evidence belief", "prior-weighted, before-evidence, expectation-bearing", "sets priors or audits starting assumptions", "prior value, starting belief", "prior disclosure or Bayesian model note", "what judgment carries before new evidence arrives"],
    ["PSTR", "Mind", "posterior, after-evidence belief, updated probability after witness", "update posterior, receive evidence, or revise belief after data", "posterior, after-evidence belief", "posterior, evidence-updated, belief-revised", "computes posteriors or traces evidence updates", "posterior value, updated belief", "posterior report or Bayesian update record", "belief changed because reality answered"],
    ["BYSN", "Mind", "Bayesian reasoning, disciplined updating, belief revised by evidence", "reason Bayesianly, update belief, or join prior and evidence", "Bayesian reasoning, evidence updating", "Bayesian, update-bound, evidence-revised", "uses Bayesian reasoning or audits probabilistic updates", "Bayesian update, prior-posterior bridge", "Bayesian model record or uncertainty disclosure", "humility written as an equation of revision"],
    ["CNFD", "Mind", "confidence interval, uncertainty band, range that names estimate limits", "form confidence intervals, bound estimates, or disclose uncertainty range", "confidence interval, estimate uncertainty band", "confidence-bounded, interval-marked, uncertainty-disclosed", "computes confidence intervals or reports estimate bounds", "confidence band, interval range", "confidence-interval record or statistical disclosure", "measurement admitting the room where truth may stand"],
    ["SGNF", "Mind", "statistical significance, evidence threshold, signal strong enough to question chance", "test significance, mark evidence threshold, or distinguish signal from chance", "statistical significance, evidence threshold", "significant, threshold-passing, chance-tested", "tests significance or explains evidence thresholds", "significance mark, threshold result", "significance report or inference disclosure", "a signal asking whether chance can still explain it"],
    ["NLLH", "Mind", "null hypothesis, default no-effect claim, baseline tested before assertion", "state a null hypothesis, test no-effect, or guard against false claim", "null hypothesis, default no-effect claim", "null, baseline-held, no-effect-tested", "tests null hypotheses or guards baseline claims", "null statement, baseline claim", "null-hypothesis record or test protocol", "the no spoken first so yes must earn its voice"],
    ["PVLX", "Mind", "p-value, probability under null, chance measure for observed result", "compute p-values, weigh results under null, or report chance compatibility", "p-value, null probability measure", "p-valued, null-measured, chance-compatible", "computes p-values or explains test results", "p-value mark, null probability", "p-value record or statistical test disclosure", "a small number that still must not become an idol"],
    ["XSTM", "Mind", "estimator, rule for estimating, disciplined procedure for unknown quantity", "estimate by rule, build estimators, or infer unknown quantity", "estimator, estimation rule", "estimated, rule-bound, unknown-quantity-seeking", "builds estimators or reports estimates", "estimate value, estimator rule", "estimator record or inference method", "a disciplined guess that knows it is a guess"],
    ["PRCN", "Seeing/knowing", "precision, repeatable closeness, narrowness of measured spread", "measure precision, make repeated values close, or report measurement narrowness", "precision, repeatable closeness", "precise, repeatable, narrow-spread", "keeps precision or audits measurement repeatability", "precision mark, repeated measure", "precision record or measurement quality note", "care returning to the same place"],
    ["RCLL", "Seeing/knowing", "recall, recovered positives, how much relevant truth was found", "measure recall, recover relevant cases, or test what was missed", "recall, recovered relevant truth", "recall-measured, recovered, miss-aware", "computes recall or audits missed cases", "recall score, recovered case set", "recall report or retrieval evaluation", "attention asking what it failed to find"],
    ["KRCY", "Seeing/knowing", "accuracy, correct judgment rate, agreement with known truth", "measure accuracy, judge correctness, or test agreement with truth", "accuracy, correctness measure", "accurate, correctness-bound, truth-agreeing", "computes accuracy or verifies correctness", "accuracy score, correctness mark", "accuracy report or validation metric", "answer and truth standing in the same place"],
    ["MICR", "Seeing/knowing", "microscope, near-small seeing, instrument for hidden tiny structures", "microscope, inspect the small, or make tiny structure visible", "microscope, small-structure seeing", "microscopic, small-seeing, hidden-visible", "uses microscopes or studies tiny structures", "microscope view, small field", "microscope record or laboratory imaging standard", "the eye taught humility before smallness"],
    ["TLSC", "Seeing/knowing", "telescope, far seeing, instrument for distant light and sky bodies", "telescope, inspect the far, or gather distant light", "telescope, far-light seeing", "telescopic, far-seeing, distance-gathering", "uses telescopes or studies distant light", "telescope view, distant field", "telescope record or astronomical observation", "the eye sent outward without leaving the body"],
    ["SPCM", "Seeing/knowing", "spectrometer, measured spectrum instrument, device for reading light or material signatures", "spectrometrize, measure spectra, or read material signatures", "spectrometer, spectrum-measuring instrument", "spectrometric, spectrum-measured, signature-reading", "uses spectrometers or reads material signatures", "spectrum trace, instrument reading", "spectrometer record or material analysis log", "color made precise enough to testify"],
    ["CNFG", "Seeing/knowing", "centrifuge, spinning separator, instrument that sorts by force and density", "centrifuge, separate by spinning, or sort material by force", "centrifuge, spinning separator", "centrifuged, force-sorted, density-separated", "uses centrifuges or separates samples", "centrifuge tube, separated layer", "centrifuge log or laboratory processing record", "turning used so hidden layers confess"],
    ["PPTX", "Seeing/knowing", "pipette, measured transfer tool, small instrument for precise liquid movement", "pipette, transfer liquid precisely, or measure a small volume", "pipette, precise liquid transfer", "pipetted, volume-measured, liquid-carried", "uses pipettes or transfers measured liquid", "pipette tip, measured droplet", "pipette record or laboratory handling standard", "a small promise about how much was moved"],
    ["BKRX", "Seeing/knowing", "beaker, open laboratory vessel, held mixture under observation", "beaker, hold mixtures, or prepare visible laboratory liquid", "beaker, open laboratory vessel", "beaker-held, visible, mixture-bearing", "uses beakers or prepares mixtures", "beaker vessel, measured mixture", "beaker record or laboratory safety note", "a clear cup where matter agrees to be watched"],
    ["RAGT", "Nature", "reagent, reactive substance, material introduced to reveal or transform", "reagent, react in testing, or introduce substance for proof", "reagent, reactive testing substance", "reagent-bound, reactive, test-revealing", "prepares reagents or studies reactive substances", "reagent dose, test substance", "reagent record or material safety log", "matter added so hidden truth can answer"],
    ["SPNM", "Nature", "specimen, preserved example, material case kept for study", "specimen, preserve an example, or keep a material case for study", "specimen, preserved study case", "specimen-held, preserved, study-kept", "keeps specimens or prepares study cases", "specimen vial, preserved example", "specimen record or chain-of-custody log", "one body kept so knowledge does not become vague"],
    ["SSYX", "Seeing/knowing", "assay, measured test, procedure revealing substance, strength, or activity", "assay, test by measure, or reveal activity through procedure", "assay, measured laboratory test", "assayed, test-measured, activity-revealed", "runs assays or interprets measured tests", "assay result, activity measure", "assay record or laboratory method", "a question asked of matter by measured care"],
    ["CNTR", "Mind", "control group, comparison baseline, guarded no-change condition in experiment", "control experiments, hold baselines, or compare against no-change condition", "control group, experimental baseline", "controlled, baseline-held, comparison-guarded", "keeps controls or designs comparison baselines", "control arm, baseline condition", "control-group record or trial design", "the quiet witness that lets change be named"],
    ["KHRT", "Mind", "cohort, studied group, persons or cases followed through time", "cohort, group cases, or follow a studied body through time", "cohort, studied group", "cohort-bound, time-followed, group-studied", "tracks cohorts or studies grouped cases", "cohort set, followed group", "cohort record or longitudinal study file", "many lives followed without losing their names"],
    ["BLND", "Seeing/knowing", "blinding, hidden assignment, trial design that withholds knowledge to protect judgment", "blind a study, hide assignment, or protect judgment from expectation", "blinding, hidden trial assignment", "blinded, assignment-hidden, judgment-protected", "keeps blinding or audits masked studies", "blind code, masked assignment", "blinding record or trial integrity note", "not knowing chosen so seeing may become fair"],
    ["PWRV", "Seeing/knowing", "peer review, answerable scholarly judgment, work examined by qualified equals", "peer-review, examine scholarly work, or judge by qualified equals", "peer review, scholarly equal judgment", "peer-reviewed, equal-judged, discipline-tested", "peer-reviews or receives scholarly judgment", "review report, referee note", "peer-review record or publication decision", "truth asking neighbors in discipline to look again"],
    ["FLSF", "Seeing/knowing", "falsification, disproof test, claim exposed to possible defeat by reality", "falsify, test for disproof, or expose claims to possible defeat", "falsification, disproof test", "falsifiable, disproof-open, reality-tested", "falsifies claims or designs disproof tests", "falsification mark, defeating evidence", "falsification record or method critique", "a claim honorable enough to risk defeat"],
    ["RPRD", "Seeing/knowing", "reproducibility, repeated result, finding that survives independent return", "reproduce findings, repeat results, or test independent return", "reproducibility, repeated result", "reproducible, repeated, independent-returned", "reproduces findings or audits repeatability", "reproduction run, repeated finding", "reproducibility record or replication package", "truth willing to meet another worker"],
    ["NPLT", "Mind", "interpolation, between-point estimate, value inferred inside known bounds", "interpolate, estimate between points, or infer within known bounds", "interpolation, between-point estimate", "interpolated, within-bound, between-estimated", "interpolates values or fills bounded gaps", "interpolated value, within-range estimate", "interpolation record or numerical method note", "the gap answered while the borders remain known"],
    ["XPLT", "Mind", "extrapolation, beyond-bound estimate, projection outside known data", "extrapolate, project beyond bounds, or warn where data ends", "extrapolation, beyond-bound estimate", "extrapolated, beyond-bound, projection-risked", "extrapolates values or audits projections", "extrapolated value, outside-range projection", "extrapolation warning or forecast limit", "a step beyond evidence that must name its risk"],
    ["PRXM", "Mind", "approximation, near-enough value, useful closeness that names its error", "approximate, seek near-enough value, or name useful error", "approximation, useful near value", "approximate, near-enough, error-named", "approximates values or bounds practical error", "approximation value, near estimate", "approximation record or error-bound note", "humility made useful by saying how close"]
  ];

  return seeds.map(([id, category, semanticField, action, concept, quality, agent, object, civic, intimate]) =>
    seedRoot(id, category, semanticField, action, concept, quality, agent, object, civic, intimate)
  );
}

function seedRoot(id, category, semanticField, action, concept, quality, agent, object, civic, intimate) {
  const consonants = id.toLowerCase().split("");
  const alias = interleave(consonants, "a").toUpperCase();
  return root(id, [alias], consonants, category, semanticField, {
    verb: `to ${action}`,
    noun: concept,
    adjective: quality,
    agent: `one who ${agent}`,
    object,
    ritual: `${concept} placed in solemn or ritual speech`,
    civic,
    intimate
  });
}

function interleave(consonants, vowel) {
  return consonants.map((c, index) => c + (index === consonants.length - 1 ? "" : vowel)).join("");
}

function derive(consonants, pattern) {
  const base = interleave(consonants, "a");
  if (pattern === "verb") return base;
  if (pattern === "noun") return interleave(consonants, "e");
  if (pattern === "adjective") return interleave(consonants, "i");
  if (pattern === "agent") return `${base}en`;
  if (pattern === "object") return interleave(consonants, "o");
  if (pattern === "ritual") return `ha-${interleave(consonants, "u")}`;
  if (pattern === "civic") return `${base}-da`;
  if (pattern === "intimate") return `mi-${base}`;
  if (pattern === "process") return `${base}-ga`;
  if (pattern === "instrument") return `${base}-tel`;
  if (pattern === "place") return `${base}-wed`;
  if (pattern === "doctrine") return `${base}-lek`;
  if (pattern === "collective") return `${base}-lem`;
  if (pattern === "lack") return `ne-${base}`;
  if (pattern === "category") return `${base}-gec`;
  if (pattern === "discipline") return `${base}-dak`;
  if (pattern === "office") return `${base}-xaf`;
  if (pattern === "record") return `${base}-ket`;
  if (pattern === "right") return `${base}-ret`;
  if (pattern === "vow") return `${base}-dov`;
  throw new Error(`Unknown pattern ${pattern}`);
}

function pronounce(word) {
  return word.split("-").map((segment, index) => {
    if (index === 0 && ["mi", "ha", "so"].includes(segment)) return segment;
    if (index === 0 && segment === "ne" && word.includes("-")) return segment;
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
  const patternPartOfSpeech = Object.fromEntries(
    derivationPatterns.patterns.map((pattern) => [pattern.id, pattern.part_of_speech])
  );
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
      add(rootEntry.category, word(
        rootEntry.category,
        derived.word,
        derived.pronunciation,
        patternPartOfSpeech[pattern] ?? "derived term",
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
  if (pattern === "process") return `${capitalize(wordValue)} ga ban rih.`;
  if (pattern === "instrument") return `Na ban bi ${wordValue}.`;
  if (pattern === "place") return `Nel pat ad ${wordValue}.`;
  if (pattern === "doctrine") return `${capitalize(wordValue)} lek e rih.`;
  if (pattern === "collective") return `${capitalize(wordValue)} lem pu nam.`;
  if (pattern === "lack") return `${capitalize(wordValue)} e xed.`;
  if (pattern === "category") return `${capitalize(wordValue)} e gec.`;
  if (pattern === "discipline") return `Tu dak ${wordValue}.`;
  if (pattern === "office") return `${capitalize(wordValue)} xaf ten dev.`;
  if (pattern === "record") return `Kat ${wordValue}.`;
  if (pattern === "right") return `${capitalize(wordValue)} ret cel sak.`;
  if (pattern === "vow") return `Na dov ${wordValue}.`;
  return `Na nam ${wordValue}.`;
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

writeYaml("phonology.yaml", phonology);
writeYaml("derivation-patterns.yaml", derivationPatterns);
writeYaml("roots.yaml", { roots });
writeYaml("particles.yaml", { particles });
writeYaml("pronouns.yaml", { pronouns });
writeYaml("grammar.yaml", grammar);
writeYaml("lexicon.yaml", makeLexicon());
writeYaml("examples.yaml", { examples });

console.log(`Generated Ethra specs in ${outDir}`);
