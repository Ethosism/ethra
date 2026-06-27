# Parser

The v1.0 parser identifies one primary clause and reports inspectable structure in a machine-readable shape. It keeps the analytic parser conservative while exposing noun phrases, coordination spans, and subordinate or relative object spans for corpus review.

The machine-readable syntax guidance lives in `spec/syntax.yaml`.

## Command

```bash
cargo run --quiet -- parse-sentence --text "Na dov tar mo mik."
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
- noun phrases
- coordination spans with `ko`
- subordinate or relative spans with `mo`
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

The parser groups possessive noun phrases of the form `X en Y`, demonstrative noun phrases of the form `X se`, sentence-initial `ya` questions, `ke` imperatives, pre-predicate particles, copular complements with `e`, scope particles such as `so-lem` and `so-rah`, coordination or companionship spans with `ko`, and relative object spans beginning with `mo`.

For batch review, use `validate-corpus` to verify every corpus item uses accepted tokens, valid tracks, valid domains, and inspectable literal translations.
