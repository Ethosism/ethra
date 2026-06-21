# Style Checker

The v0.5.5 style checker is the first sentence-level guardrail for Ethra prose. It is not a full parser yet. Its job is to catch weak or invalid forms before they enter docs, corpus, examples, or proposed terminology.

The machine-readable rules live in `spec/style.yaml`.

## Command

```bash
npm run ethra -- style-check --text "Pu na vel dev se so-lem." --register civic --require-moral-agency --require-scope
```

The report includes:

- token phonology
- accepted lexicon, particle, pronoun, compound, or transparent-compound status
- observed moral-agency particles
- observed scope particles
- observed register markers
- address stance notices
- issue counts and a numeric score

## What It Protects

Style checking exists to keep scale from weakening Ethra's architecture. A large dictionary is not enough; accepted sentences should still preserve root-depth, moral agency, relational precision, register discipline, and visible consequence.

The checker currently warns or notices when:

- a token is phonologically invalid
- a token is possible but unknown
- a requested register lacks its expected marker
- first-person action lacks visible moral agency
- binding speech lacks visible scope
- a vow lacks explicit truth or sacred witness
- an imperative leaves address stance implicit
- a compound grows too long for clear cadence

## Registers

```text
ritual     ha, ha-, so-zur, hu
civic      pu, -da, te, tum, so-lem, so-rah
intimate   mi, mi-, ti
technical  -tel, -ket, -ga, -gec, -dak
```

These are style expectations, not hard grammar. A sentence can be valid while still receiving notices that a stronger register marker is available.
