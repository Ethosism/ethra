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
  ...foundationSeedRoots()
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
