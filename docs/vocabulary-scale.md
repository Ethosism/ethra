# Vocabulary Scale

Ethra currently has 8,057 explicit lexicon entries and 280 reviewed corpus items after the v0.2.10 root-target expansion. That is enough to support early structured use across more domains, not enough to function as a complete language.

Current progress toward the v0.3 everyday-fluency target:

```text
entries 8,057 / 3,000
roots     400 / 400
corpus    280 / 500 reviewed items
patterns   20 productive derivation patterns
compounds 100 curated terms
```

The v0.2.3 root batch adds conflict/security, food, household, education, technology, economics, travel, and ecology roots such as threat, defense, weapon, truce, drink, cooking, cleanliness, school, examination, database, computation, price, credit, arrival, vehicle, distance, river, soil, and pasture.

The v0.2.4 corpus batch adds 60 reviewed examples across daily dialogue, civic/legal, ritual/vow, technical/software, literary/poetic, and learner tracks, with special pressure on the new security, household, technology, travel, education, and provision roots.

The v0.2.5 root batch adds 50 roots for underbuilt categories: focus, perception, discernment, broadcast, grammar, translation, text, print, phone, door, gate, wall, lamp, package, hook, legacy, monument, custom, generation, mercy, affection, embrace, welcome, belonging, loyalty, hand, tongue, shoulder, bone, ear, hair, desert, ice, bird, moon, snow, valley, cloud, dust, flower, query, kernel, file, and virtual presence.

The v0.2.6 corpus batch adds 60 reviewed examples across all six corpus tracks, grounding the v0.2.5 roots in attention, hearing, doors, hospitality, public text, translation, ritual mercy, files, queries, kernels, symbols, virtual presence, nature imagery, and learner grammar.

The v0.2.7 root batch adds 50 roots for time, body, emotion, social life, knowledge, ecology, and ritual: day, hour, schedule, pause, deadline, delay, return, brain, muscle, illness, fatigue, scar, eye, foot, gratitude, guilt, humility, envy, laughter, pride, patience, neighbor, guest, host, community, market, workplace, belief, idea, grade, research, hypothesis, cause, pattern, note, rain, insect, lake, lightning, plant-root, volcano, metal, magnet, ceremony, festival, offering, and dance.

The v0.2.8 corpus batch adds 60 reviewed examples across all six corpus tracks, grounding the v0.2.7 roots in daily schedules, fatigue, neighborly return, market hours, public deadlines, medical records, research protocols, ritual offerings, technical debugging, natural imagery, and learner sentences.

The v0.2.9 root batch adds 50 roots for everyday fluency and technical civilization: evidence, doubt, comparison, interpretation, hiddenness, accountability, consent, refusal, restraint, trust, care, mother, father, ancestor, descendant, clan, mouth, nose, face, voice, pulse, stomach, dose, tooth, symptom, pregnancy, prompt, algorithm, cache, interface, execution, server, error, version, backup, skill, reading, science, laboratory, equation, curriculum, mentor, student, language, answer, bridge, street, station, vote, and automation agent.

The v0.2.10 root batch adds 43 roots to meet the v0.3 root target: analysis, comfort, throat, grandparent, reconciliation, stewardship, hope, prudence, protocol, compression, window, weather, tree, penalty, alarm, case, head, queue, encryption, shock, star, animal, arm, wonder, mountain, fish, dream, stone, citizenship, leadership, wage, letter, endpoint, coercion, color, floor, roof, seat, seed, forest, ocean, myth, and prayer.

With v0.2.10, the v0.3 root count is met. The main remaining v0.3 gap is reviewed corpus depth: 280 / 500 items.

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
