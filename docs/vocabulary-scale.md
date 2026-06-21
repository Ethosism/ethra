# Vocabulary Scale

Ethra currently has 4,197 explicit lexicon entries and 160 reviewed corpus items after the v0.2.4 corpus-depth expansion. That is enough to support early structured use across more domains, not enough to function as a complete language.

Current progress toward the v0.3 everyday-fluency target:

```text
entries 4,197 / 3,000
roots     207 / 400
corpus    160 / 500 reviewed items
patterns   20 productive derivation patterns
compounds 100 curated terms
```

The v0.2.3 root batch adds conflict/security, food, household, education, technology, economics, travel, and ecology roots such as threat, defense, weapon, truce, drink, cooking, cleanliness, school, examination, database, computation, price, credit, arrival, vehicle, distance, river, soil, and pasture.

The v0.2.4 corpus batch adds 60 reviewed examples across daily dialogue, civic/legal, ritual/vow, technical/software, literary/poetic, and learner tracks, with special pressure on the new security, household, technology, travel, education, and provision roots.

The goal is not to match English, German, or Chinese by copying their dictionaries word for word. The goal is expressive coverage: Ethra should be able to carry daily life, law, software, science, philosophy, love, prayer, poetry, education, and public institutions without falling back to English.

## Scale Targets

```text
v0.2                  1,000 entries, 150 roots, 100 corpus items
v0.3                  3,000 entries, 400 roots, 500 corpus items
v0.5                 10,000 entries, 1,000 roots, 2,000 corpus items
v1.0                 25,000 entries, 2,500 roots, 10,000 corpus items
civilizational scale 100,000+ entries, 3,000 roots, 100,000 corpus items
```

These numbers are targets, not magic thresholds. A bad 25,000-word dictionary is worse than a coherent 3,000-word language. Count only matters when words are structurally sound and used in corpus.

## Expansion Strategy

Ethra should grow through four channels:

1. **Root expansion:** add durable semantic fields.
2. **Pattern derivation:** generate predictable action, concept, quality, agent, object, civic, ritual, intimate, process, instrument, place, doctrine, collective, lack, category, discipline, office, record, right, and vow forms.
3. **Compounding:** build German-style conceptual architecture while keeping roots visible.
4. **Corpus pressure:** add terms because texts, dialogues, laws, tools, poems, or lessons need them.

The productive pattern catalog is stored in `spec/derivation-patterns.yaml`. The curated compound bank in `spec/compounds.yaml` is the first explicit terminology layer beyond root-pattern derivation.

## Why Not Just Translate English

English has enormous power, but many English words hide distinctions Ethra is designed to expose. For example, "I should," "I owe," "I choose," and "I vow" must not collapse into one convenient verb. Likewise, "you" must not erase intimacy, civic equality, teaching responsibility, opposition, or sacred address when those distinctions matter.

## Domain Coverage

The expansion program is organized by domains in `spec/domains.yaml`. Each domain tracks target roots, target entries, registers, required fields, and moral questions.

Priority domains for v0.2:

- daily life
- body and health
- family and kinship
- emotion and psychology
- law and governance
- history and memory
- technology and software
- ritual and spiritual life
- conflict and security

## Definition Of Progress

Ethra progresses when a new term:

- has a root or compound analysis
- passes phonology
- has domain and register metadata
- appears in at least one example sentence
- preserves moral and relational distinctions
- is useful in corpus

Raw word count alone is not progress.
