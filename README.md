# Ethra Language

Ethra is a v1.0.0 constructed civilizational language. It is not meant to be an Esperanto clone, a naming toy, or an aesthetic exercise. Its design goal is to make certain cultural habits native to ordinary speech: truth, duty, beauty, memory, agency, consequence, inheritance, repair, love as recognition, speech as binding, and the future as a moral claimant.

The working name is kept as **Ethra** because it is short, pronounceable, and internally useful: `eth` evokes ethos and `ra` evokes seeing. The name therefore sounds like "ethos made visible."

Status: v1.0.0 has passed the stable civil-language gate: canonical YAML data, productive derivation patterns, 2,500 root families, 50,057 lexicon entries, 50,212 dictionary entries, 10,000 reviewed corpus items, Rust CLI/library tooling, compound terminology, sentence parsing, syllabification, corpus search, dictionary lookup, governed style checking, governed term proposal packets, corpus/governance planning, native-script prototype, learner grammar, and tests.

Repository: <https://github.com/Ethosism/ethra>

## Why Build It

English is powerful because it is flexible, absorptive, globally distributed, and technically productive. It is not, however, a cleanly designed language. Its spelling is irregular, its moral distinctions are often optional, and its pronouns are relationally thin.

Ethra keeps English-like analytic flexibility while drawing inspiration from:

- Hebrew and Arabic root-depth: words belong to durable conceptual families.
- German conceptual architecture: compounds can build precise abstractions.
- Chinese compression: short words and particles do heavy work.
- Sanskrit and Arabic ritual dignity: solemn sound patterns mark serious speech.
- Japanese relational sensitivity: address forms clarify stance without making hierarchy absolute.

Ethra treats language as training. What is easy to say becomes easy to notice. What is easy to notice becomes easier to preserve.

## Core Design

- **Phonology:** 5 vowels, 20 consonants, simple CV/CVC syllables.
- **Writing:** romanized, one symbol per sound, no silent letters.
- **Grammar:** mostly analytic SVO.
- **Tense/aspect:** particles such as `pa`, `nu`, `fu`, `ka`, `ga`, `va`.
- **Moral grammar:** particles distinguish can, may, want, choose, should, owe, vow, inherited duty, chosen duty, entrusted duty, repair, and scope of action.
- **Relational grammar:** pronouns distinguish beloved, equal, elder/teacher, child/student, citizen, opponent, sacred addressee, and collective people.
- **Roots:** 2,500 root families with 20 productive derivation patterns per root.
- **Derivation:** action, concept, quality, agent, object, ritual, civic, intimate, process, instrument, place, doctrine, collective, lack, category, discipline, office, record, right, and vow forms.
- **Lexicon:** canonical core lexicon with 50,057 explicit entries across pronouns, particles, moral agency, family, body, mind, emotion, seeing/knowing, speech, time, nature, building/making, law/civic life, technology, ritual/poetry, love/intimacy, conflict/repair, and future/civilization.
- **Compounds:** 100 curated compound terms for German-style conceptual architecture.
- **Machine-readable spec:** YAML files in `spec/` for phonology, derivation patterns, roots, particles, pronouns, grammar, syntax, native script, dictionary schema, lexicon, compounds, corpus, roadmap, domains, governance, style, and examples.
- **Corpus:** 10,000 reviewed corpus items across daily dialogue, civic/legal, ritual/vow, technical/software, literary/poetic, and learner tracks.
- **Expansion program:** roadmap, domain ontology, corpus plan, and governance model for growing toward civilizational-scale expressive coverage.
- **Tooling:** CLI commands for root generation, word derivation, word analysis, sentence parsing, dictionary lookup/statistics, style checking, example lookup, root/particle/pattern listing, lexicon listing, compound creation, governed root/compound proposal packets, roadmap inspection, domain coverage, corpus planning/next-batch recommendation/listing/search, governance review, and spec/corpus validation.

## Quick Examples

```text
Ke rah na.
See me.

Ke sol-rah na.
Really see me.

Na vel dev se.
I choose this duty.

Na mor dev se.
I inherited this duty.

Na dov tar mo mik.
I vow to repair what was broken.

Lem ga naf bi mar.
The people survive by remembering.
```

## Install

```bash
cargo build
```

Run tests:

```bash
cargo test
```

Use the CLI from source:

```bash
cargo run --quiet -- generate-root --field "sacred attention"
cargo run --quiet -- list-roots
cargo run --quiet -- list-particles
cargo run --quiet -- list-patterns
cargo run --quiet -- list-lexicon --category "Moral agency"
cargo run --quiet -- native-script
cargo run --quiet -- derive-word --root RAH --pattern intimate-imperative
cargo run --quiet -- derive-word --root RAH --pattern instrument
cargo run --quiet -- analyze-word mi-rah
cargo run --quiet -- syllabify-word poronox
cargo run --quiet -- parse-sentence --text "Na dov tar mo mik."
cargo run --quiet -- style-check --text "Pu na vel dev se so-lem." --register civic --require-moral-agency --require-scope
cargo run --quiet -- lookup-dictionary hener --exact
cargo run --quiet -- dictionary-stats --limit 5
cargo run --quiet -- translate-example 8
cargo run --quiet -- create-compound --words fer,dev --gloss "future-binding duty"
cargo run --quiet -- propose-term --field "honor-bound duty" --kind compound --components hener,dev --domain philosophy-metaphysics --register civic --example "Hener-dev xap lem."
cargo run --quiet -- compound-summary
cargo run --quiet -- list-compounds --domain technology-software
cargo run --quiet -- roadmap --summary
cargo run --quiet -- list-domains --priority highest
cargo run --quiet -- coverage-report
cargo run --quiet -- corpus-plan
cargo run --quiet -- corpus-next --size 120
cargo run --quiet -- list-corpus --track technical-software
cargo run --quiet -- search-corpus --query "data model" --track technical-software --limit 5
cargo run --quiet -- governance
cargo run --quiet -- validate-spec
cargo run --quiet -- validate-corpus
cargo run --quiet -- validate-compounds
```

After building, you can also run:

```bash
target/debug/ethra derive-word --root RAH --pattern civic-legal
```

## Repository Structure

```text
ethra-language/
  README.md
  docs/
    theory.md
    phonology.md
    grammar.md
    roots.md
    moral-grammar.md
    relational-grammar.md
    word-formation.md
    dictionary.md
    parser.md
    style-checker.md
    native-script.md
    learner-grammar.md
    examples.md
    vocabulary-scale.md
    governance.md
    corpus.md
  corpus/
    daily-dialogues/
    civic-law/
    ritual-vow/
    technical-software/
    literary-poetic/
    learner-graded/
  spec/
    phonology.yaml
    derivation-patterns.yaml
    roots.yaml
    particles.yaml
    pronouns.yaml
    grammar.yaml
    syntax.yaml
    native-script.yaml
    dictionary-schema.yaml
    lexicon.yaml
    compounds.yaml
    examples.yaml
    corpus.yaml
    roadmap.yaml
    domains.yaml
    corpus-plan.yaml
    governance.yaml
    style.yaml
  src/
    main.rs
    lib.rs
    analyze.rs
    civilization.rs
    compound.rs
    derivation.rs
    dictionary.rs
    examples.rs
    phonology.rs
    proposal.rs
    sentence.rs
    spec.rs
    style.rs
    types.rs
    validation.rs
  tests/
    ethra_rust.rs
  Cargo.toml
  Cargo.lock
```

## How To Extend Ethra

1. Add or edit canonical data in `spec/*.yaml`.
2. Run `cargo run -- validate-spec`, `cargo run -- validate-corpus`, and `cargo run -- validate-compounds`.
3. Add CLI, analyzer, or validation behavior in `src/*.rs`.
4. Add focused tests in `tests/`.
5. Keep new grammar justified by cultural function. Decorative complexity is rejected.

The YAML spec is committed intentionally. It is the stable interface for future parsers, web apps, corpus tools, and teaching material.

## v1.0 Release State

- Native script prototype is specified in `spec/native-script.yaml`.
- Parser reports noun phrases, `ko` coordination spans, and `mo` subordinate/relative spans.
- `syllabify-word` exposes phonotactic syllable analysis.
- The entry gate, root gate, and 10,000-item corpus gate are met.
- `corpus-next` remains available for post-v1 expansion planning.
- Style checking includes law, software, poetry, and prayer register expectations.
- `validate-spec` checks canonical example Ethra tokens against accepted forms.
- Learner grammar and exercises are documented in `docs/learner-grammar.md`.
