# Ethra Language

Ethra is a v0.6.2 constructed civilizational language. It is not meant to be an Esperanto clone, a naming toy, or an aesthetic exercise. Its design goal is to make certain cultural habits native to ordinary speech: truth, duty, beauty, memory, agency, consequence, inheritance, repair, love as recognition, speech as binding, and the future as a moral claimant.

The working name is kept as **Ethra** because it is short, pronounceable, and internally useful: `eth` evokes ethos and `ra` evokes seeing. The name therefore sounds like "ethos made visible."

Status: v0.6.2 has passed the public-culture gate and begun the v1.0 expansion program: generated YAML data, productive derivation patterns, 1,200 root families, 24,057 lexicon entries, 24,212 dictionary entries, 2,360 reviewed corpus items, TypeScript CLI, compound terminology, sentence parsing, corpus search, dictionary lookup, governed style checking, governed term proposal packets, corpus/governance planning, and tests.

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
- **Roots:** 1,200 root families with 20 productive derivation patterns per root.
- **Derivation:** action, concept, quality, agent, object, ritual, civic, intimate, process, instrument, place, doctrine, collective, lack, category, discipline, office, record, right, and vow forms.
- **Lexicon:** generated core lexicon with 24,057 explicit entries across pronouns, particles, moral agency, family, body, mind, emotion, seeing/knowing, speech, time, nature, building/making, law/civic life, technology, ritual/poetry, love/intimacy, conflict/repair, and future/civilization.
- **Compounds:** 100 curated compound terms for German-style conceptual architecture.
- **Machine-readable spec:** YAML files in `spec/` for phonology, derivation patterns, roots, particles, pronouns, grammar, syntax, dictionary schema, lexicon, compounds, corpus, roadmap, domains, governance, style, and examples.
- **Corpus:** 2,360 reviewed seed corpus items across daily dialogue, civic/legal, ritual/vow, technical/software, literary/poetic, and learner tracks.
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
npm install
npm run build:spec
npm run build
```

Run tests:

```bash
npm test
```

Use the CLI from source:

```bash
npm run ethra -- generate-root --field "sacred attention"
npm run ethra -- list-roots
npm run ethra -- list-particles
npm run ethra -- list-patterns
npm run ethra -- list-lexicon --category "Moral agency"
npm run ethra -- derive-word --root RAH --pattern intimate-imperative
npm run ethra -- derive-word --root RAH --pattern instrument
npm run ethra -- analyze-word mi-rah
npm run ethra -- parse-sentence --text "Na dov tar mo mik."
npm run ethra -- style-check --text "Pu na vel dev se so-lem." --register civic --require-moral-agency --require-scope
npm run ethra -- lookup-dictionary hener --exact
npm run ethra -- dictionary-stats --limit 5
npm run ethra -- translate-example 8
npm run ethra -- create-compound --words fer,dev --gloss "future-binding duty"
npm run ethra -- propose-term --field "honor-bound duty" --kind compound --components hener,dev --domain philosophy-metaphysics --register civic --example "Hener-dev xap lem."
npm run ethra -- compound-summary
npm run ethra -- list-compounds --domain technology-software
npm run ethra -- roadmap --summary
npm run ethra -- list-domains --priority highest
npm run ethra -- coverage-report
npm run ethra -- corpus-plan
npm run ethra -- corpus-next --size 120
npm run ethra -- list-corpus --track technical-software
npm run ethra -- search-corpus --query "data model" --track technical-software --limit 5
npm run ethra -- governance
npm run ethra -- validate-spec
npm run ethra -- validate-corpus
npm run ethra -- validate-compounds
```

After building, you can also run:

```bash
node dist/cli/index.js derive-word --root RAH --pattern civic-legal
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
    cli/
    core/
    generators/
    analyzers/
  tests/
  package.json
```

## How To Extend Ethra

1. Add or edit root data in `scripts/build-spec.mjs`.
2. Run `npm run build:spec` to regenerate `spec/*.yaml`.
3. Add CLI or analyzer behavior in `src/`.
4. Add focused tests in `tests/`.
5. Keep new grammar justified by cultural function. Decorative complexity is rejected.

The generated YAML is committed intentionally. It is the stable interface for future parsers, web apps, corpus tools, and teaching material.

## v1.0 Next Targets

- Native script prototype.
- Parser for full sentences, not only words and examples.
- Better phonotactic syllabification.
- Expand from 24,057 to 25,000 explicit entries.
- Expand from 1,200 to 2,500 root families.
- Expand from 2,360 to 10,000 reviewed corpus items.
- Use `corpus-next` to keep v1.0 corpus batches proportional to track targets and under-covered domains.
- Expanded law, software, poetry, and prayer registers.
- Corpus-based consistency checks for all example sentences.
- A learner grammar with exercises and graded readings.
