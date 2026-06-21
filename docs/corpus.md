# Corpus

Vocabulary becomes real only through use. Ethra's corpus program turns coined words into lived language by placing them in dialogue, law, ritual, software, literature, and learning material.

The machine-readable corpus plan is in `spec/corpus-plan.yaml`. Reviewed seed corpus items are in `spec/corpus.yaml`.

Current seed corpus progress:

```text
items 5,000 / 10,000 for v1.0
tracks  6 / 6 represented
balance daily 1000, civic 750, ritual 750, technical 1000, poetic 1000, learner 500
```

## Corpus Tracks

```text
daily-dialogues      ordinary speech, family, work, care, repair
civic-law            oaths, notices, testimony, contracts, citizen duties
ritual-vow           prayer, vow, mourning, blessing, confession
technical-software   CLI help, APIs, data models, security, agents
literary-poetic      poems, parables, love lines, laments, founding stories
learner-graded       staged readings for learners
```

## Corpus Item Shape

Each item should include:

- English source or prompt
- Ethra text
- literal translation
- notes
- domain tags
- terms introduced or reviewed

Special tracks add extra fields. For example, civic-law items should identify obligation type, and ritual-vow items should identify witness/register.

## Quality Gates

Each corpus item must:

- use accepted words or mark proposed words
- identify any new word by root, pattern, domain, and register
- preserve moral agency distinctions when English hides them
- use relational pronouns when relationship matters
- keep literal translations inspectable

## Why Corpus Comes Before Massive Dictionary Size

A large dictionary without corpus becomes ornamental. Corpus reveals whether a word is pronounceable, memorable, morally precise, and flexible enough for real speech.

## Next Batch Planning

The `corpus-next` command recommends the next reviewed batch toward the active roadmap milestone. It uses the active roadmap target, the track weights in `spec/corpus-plan.yaml`, current item IDs, and current domain counts to avoid overfilling easy tracks while science, emotion, philosophy, economics, travel/place, ecology, AI, and health remain thin.

For the current v0.10.5 state, the next 120-item batch points toward v1.0: 24 daily, 18 civic, 18 ritual, 24 technical, 24 poetic, and 12 learner items, starting at `daily-1001`, `civic-751`, `ritual-751`, `tech-1001`, `poetic-1001`, and `learner-501`.

## CLI

```bash
npm run ethra -- corpus-plan
npm run ethra -- corpus-next 120
npm run ethra -- list-corpus --track daily-dialogues
npm run ethra -- search-corpus --query "future duty" --domain philosophy-metaphysics --limit 10
npm run ethra -- validate-corpus
```
