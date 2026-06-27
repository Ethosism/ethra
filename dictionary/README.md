# Ethra Dictionary

This folder is generated from the canonical Ethra language data in `spec/`.

- **Headwords:** 50143
- **Dictionary records:** 50212

Start with [the index](index.md), then browse by starting letter.

Each headword gives pronunciation, part of speech, English definition, register, root-family context, literal morphology, examples, and corpus evidence where available.

Regenerate this folder from the repo root with:

```bash
cargo run --quiet -- export-dictionary --output dictionary
```
