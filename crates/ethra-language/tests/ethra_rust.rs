use assert_cmd::Command;
use ethra_language::analyze::analyze_word;
use ethra_language::civilization::{CorpusSearchOptions, roadmap_summary, search_corpus};
use ethra_language::compound::create_compound;
use ethra_language::derivation::{derive_word, find_root};
use ethra_language::dictionary::dictionary_stats;
use ethra_language::examples::find_example;
use ethra_language::phonology::{syllabify_word, validate_word};
use ethra_language::sentence::parse_sentence;
use ethra_language::spec::{flatten_lexicon, load_spec, read_spec_yaml};
use ethra_language::style::{StyleCheckOptions, style_check};
use ethra_language::validation::{
    validate_current_compounds, validate_current_corpus, validate_current_spec,
};

#[test]
fn validates_simple_ethra_phonology() {
    assert!(validate_word("rah").valid);
    assert!(validate_word("mi-rah").valid);
    assert!(validate_word("dav-da").valid);
    assert!(!validate_word("rtha").valid);
    assert!(!validate_word("qa").valid);

    let syllables = syllabify_word("poronox");
    assert!(syllables.valid);
    assert_eq!(syllables.syllables, vec!["po", "ro", "nox"]);
    assert_eq!(syllables.primary_stress, Some(0));
}

#[test]
fn looks_up_roots_and_derives_words() {
    let root = find_root("RAH").unwrap().unwrap();
    assert_eq!(root.id, "RH");

    let result = derive_word("RAH", "intimate-imperative").unwrap();
    assert_eq!(result.word, "mi-rah");
    assert_eq!(result.pattern, "intimate");
    assert!(result.cultural_notes.contains("ke mi-rah"));

    let tool = derive_word("RAH", "tool").unwrap();
    assert_eq!(tool.word, "rah-tel");
    assert_eq!(tool.pattern, "instrument");

    let database = derive_word("DB", "record").unwrap();
    assert_eq!(database.word, "dab-ket");
}

#[test]
fn analyzes_parses_and_checks_style() {
    let analysis = analyze_word("mi-rah").unwrap();
    assert!(analysis.valid_phonology);
    assert!(
        analysis
            .morphology
            .contains(&"compound/prefixed form: mi + rah".to_string())
    );

    let parsed = parse_sentence("Na dov tar mo mik.").unwrap();
    assert!(parsed.valid);
    assert_eq!(parsed.clause.pattern, "canonical-svo");
    assert_eq!(parsed.clause.subject.unwrap().text, "na");
    assert_eq!(parsed.clause.predicate.unwrap().text, "tar");
    assert_eq!(parsed.clause.subordinate_clauses[0].text, "mo mik");

    let richer = parse_sentence("Leb en na e kot rih.").unwrap();
    assert!(
        richer
            .clause
            .noun_phrases
            .iter()
            .any(|phrase| phrase.role == "noun-phrase:possessive" && phrase.text == "leb en na")
    );

    let coordinated = parse_sentence("Na pat ko ti.").unwrap();
    assert!(
        coordinated
            .clause
            .coordination
            .iter()
            .any(|span| span.text == "pat ko ti")
    );

    let style = style_check(StyleCheckOptions {
        text: "Pu na vel dev se so-lem.".to_string(),
        register: Some("civic".to_string()),
        require_moral_agency: true,
        require_scope: true,
    })
    .unwrap();
    assert!(style.valid);
    assert_eq!(style.score, 100);
    assert_eq!(style.observed.moral_particles, vec!["vel"]);
    assert_eq!(style.observed.scope_particles, vec!["so-lem"]);

    let prayer = style_check(StyleCheckOptions {
        text: "Ha hu dov dev so-zur.".to_string(),
        register: Some("prayer".to_string()),
        require_moral_agency: true,
        require_scope: true,
    })
    .unwrap();
    assert!(prayer.valid);
    assert_eq!(prayer.issue_counts.warning, 0);
}

#[test]
fn exposes_current_spec_scale() {
    let spec = load_spec().unwrap();
    assert_eq!(spec.roots.roots.len(), 2500);
    assert_eq!(flatten_lexicon(spec).len(), 50057);

    let summary = roadmap_summary().unwrap();
    assert_eq!(summary.current.actual_root_families, 2500);
    assert_eq!(summary.current.actual_lexicon_entries, 50057);
    assert_eq!(summary.current.actual_corpus_items, 10000);
    assert_eq!(summary.current.release, "v1.0.0");

    let native_script = read_spec_yaml::<serde_json::Value>("native-script.yaml").unwrap();
    assert_eq!(native_script["status"], "prototype");
}

#[test]
fn builds_dictionary_and_searches_corpus() {
    let stats = dictionary_stats(3).unwrap();
    assert_eq!(stats.total_entries, 50212);
    assert_eq!(stats.source_counts.lexicon, 50057);
    assert_eq!(stats.source_counts.compound, 100);
    assert_eq!(stats.top_corpus_entries.len(), 3);

    let corpus = search_corpus(CorpusSearchOptions {
        query: Some("data model".to_string()),
        track: Some("technical-software".to_string()),
        limit: Some(2),
        ..Default::default()
    })
    .unwrap();
    assert_eq!(corpus.returned_matches, 2);
    assert!(
        corpus
            .matches
            .iter()
            .all(|item| item.item.track == "technical-software")
    );
}

#[test]
fn validates_specs_corpus_and_compounds() {
    let spec = validate_current_spec().unwrap();
    assert!(spec.valid);
    assert_eq!(spec.stats.roots, 2500);
    assert_eq!(spec.stats.lexicon_entries, 50057);

    let corpus = validate_current_corpus().unwrap();
    assert!(corpus.valid);
    assert_eq!(corpus.stats.items, 10000);

    let compounds = validate_current_compounds().unwrap();
    assert!(compounds.valid);
    assert_eq!(compounds.stats.terms, 100);
}

#[test]
fn creates_compounds_and_loads_examples() {
    let compound =
        create_compound(&["fer".into(), "dev".into()], Some("future-binding duty")).unwrap();
    assert_eq!(compound.word, "fer-dev");
    assert_eq!(compound.morphology, "fer + dev");

    let example = find_example("8").unwrap().unwrap();
    assert_eq!(example.number, 8);
}

#[test]
fn binary_emits_json() {
    let assert = Command::cargo_bin("ethra")
        .unwrap()
        .args(["derive-word", "--root", "RAH", "--pattern", "tool"])
        .assert()
        .success();
    let output = String::from_utf8(assert.get_output().stdout.clone()).unwrap();
    assert!(output.contains("\"word\": \"rah-tel\""));
    assert!(output.contains("\"pattern\": \"instrument\""));
}
