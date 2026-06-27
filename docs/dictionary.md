# Dictionary

The v0.5.7 dictionary layer turns Ethra's generated lexicon, particles, pronouns, and curated compounds into dictionary-grade records. It does not replace `spec/lexicon.yaml`; it adds root, register, domain, example, lifecycle, and corpus evidence around accepted material.

The repo also includes a generated reading dictionary in `dictionary/`. It groups the 50,212 source records into 50,143 surface-form headwords, split by starting letter so a human reader can browse it like an English dictionary.

The machine-readable schema lives in `spec/dictionary-schema.yaml`.

## Commands

```bash
cargo run --quiet -- lookup-dictionary hener --exact
cargo run --quiet -- lookup-dictionary "future-binding duty" --limit 10
cargo run --quiet -- dictionary-stats --limit 5
cargo run --quiet -- export-dictionary --output dictionary
```

Each dictionary entry includes:

- word and pronunciation
- source: lexicon, particle, pronoun, or compound
- root and root-family metadata where applicable
- derivation pattern where detectable
- register and domain tags
- meanings and literal etymology
- accepted examples
- lifecycle status
- corpus frequency, attestation ids, tracks, and observed registers

The Markdown export writes:

- `dictionary/README.md` for orientation
- `dictionary/index.md` for letter browsing
- one generated letter file per initial, such as `dictionary/a.md` and `dictionary/n.md`

## Why It Matters

Dictionary scale is not just a word count. Ethra needs a memory-bearing dictionary where every term remains traceable to roots, usage, register, and governance status. This keeps large vocabulary growth from becoming a pile of translated English glosses.

The dictionary tools also expose corpus gaps: many accepted root-pattern words exist structurally but are not yet attested in reviewed corpus. That distinction is useful. It tells future contributors where Ethra has formal capacity but not living usage yet.
