# Ethra Language

Ethra is a v0.1 constructed civilizational language. It is not meant to be an Esperanto clone, a naming toy, or an aesthetic exercise. Its design goal is to make certain cultural habits native to ordinary speech: truth, duty, beauty, memory, agency, consequence, inheritance, repair, love as recognition, speech as binding, and the future as a moral claimant.

The working name is kept as **Ethra** because it is short, pronounceable, and internally useful: `eth` evokes ethos and `ra` evokes seeing. The name therefore sounds like "ethos made visible."

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
- **Roots:** 36 root families with derived action, concept, quality, agent, object, ritual, civic, and intimate forms.
- **Lexicon:** generated v0.1 core lexicon with more than 250 explicit entries.

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
npm run ethra -- list-roots
npm run ethra -- list-particles
npm run ethra -- derive-word --root RAH --pattern intimate-imperative
npm run ethra -- analyze-word mi-rah
npm run ethra -- translate-example 8
npm run ethra -- create-compound --words fer,dev --gloss "future-binding duty"
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
    examples.md
  spec/
    phonology.yaml
    roots.yaml
    particles.yaml
    pronouns.yaml
    grammar.yaml
    lexicon.yaml
    examples.yaml
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

## v0.2 Targets

- Native script prototype.
- Parser for full sentences, not only words and examples.
- Better phonotactic syllabification.
- Expanded law, software, poetry, and prayer registers.
- Corpus-based consistency checks for all example sentences.
- A learner grammar with exercises and graded readings.
