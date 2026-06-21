# Corpus

Vocabulary becomes real only through use. Ethra's corpus program turns coined words into lived language by placing them in dialogue, law, ritual, software, literature, and learning material.

The machine-readable corpus plan is in `spec/corpus-plan.yaml`. Reviewed seed corpus items are in `spec/corpus.yaml`.

Current seed corpus progress:

```text
items 1,620 / 2,000 for v0.5
tracks  6 / 6 represented
balance daily 310, civic 250, ritual 250, technical 310, poetic 310, learner 190
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

The `corpus-next` command recommends the next reviewed batch toward the active roadmap milestone. It uses the v0.5 target, the track weights in `spec/corpus-plan.yaml`, current item IDs, and current domain counts to avoid overfilling easy tracks while science, AI, education, economics, conflict/security, and philosophy remain thin.

For the current v0.3.17 state, the next 120-item batch should add 29 daily, 16 civic, 16 ritual, 28 technical, 28 poetic, and 3 learner items, starting at `daily-311`, `civic-251`, `ritual-251`, `tech-311`, `poetic-311`, and `learner-191`.

## CLI

```bash
npm run ethra -- corpus-plan
npm run ethra -- corpus-next --size 120
npm run ethra -- list-corpus --track daily-dialogues
npm run ethra -- validate-corpus
```
