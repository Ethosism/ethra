# Parser

The v0.5.6 parser is a conservative first pass for Ethra sentences. It identifies one primary clause and reports structure in a machine-readable shape. It is not yet a full recursive grammar parser.

The machine-readable syntax guidance lives in `spec/syntax.yaml`.

## Command

```bash
npm run ethra -- parse-sentence --text "Na dov tar mo mik."
```

The report includes:

- token classes
- phonology and known-form status
- clause pattern
- sentence mood
- register markers
- subject
- particle chain
- predicate
- object
- complements
- scope markers
- parser confidence

## Supported Clause Patterns

```text
canonical-svo  Na dov tar mo mik.
copular        Mav e reh.
imperative     Ke rah na.
question       Ya ta mar?
fragment       any incomplete or currently unparsed structure
```

## Design Rule

The parser protects Ethra's analytic clarity. It should make the visible structure of agency, duty, register, and scope easier to inspect in corpus review, examples, teaching material, and future software.

The parser currently groups possessive subjects of the form `X en Y`, recognizes sentence-initial `ya` questions and `ke` imperatives, reads pre-predicate particles, identifies the copula `e`, and separates scope particles such as `so-lem` and `so-rah`.

Future versions should add full noun-phrase parsing, nested relative clauses, multi-clause coordination, corpus batch parsing, and style-check integration.
