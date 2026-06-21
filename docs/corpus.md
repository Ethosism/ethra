# Corpus

Vocabulary becomes real only through use. Ethra's corpus program turns coined words into lived language by placing them in dialogue, law, ritual, software, literature, and learning material.

The machine-readable corpus plan is in `spec/corpus-plan.yaml`. Reviewed seed corpus items are in `spec/corpus.yaml`.

Current seed corpus progress:

```text
items 900 / 2,000 for v0.5
tracks  6 / 6 represented
balance daily 150, civic 150, ritual 150, technical 150, poetic 150, learner 150
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

## CLI

```bash
npm run ethra -- corpus-plan
npm run ethra -- list-corpus --track daily-dialogues
npm run ethra -- validate-corpus
```
