# Learner Grammar

This learner grammar pairs the v1.0 corpus with short exercises. It assumes romanization and focuses on inspectable sentence patterns before style nuance.

## Lesson 1: Seeing And Naming

Pattern:

```text
Na rah X.
I see X.

Na nam X.
I name X.
```

Practice:

1. Translate: `Na rah dev.`
2. Translate: `Na nam ret.`
3. Write an Ethra sentence for "I see the record."

## Lesson 2: Duty And Choice

Pattern:

```text
Na vel dev se.
I choose this duty.

Na mor dev se.
I inherit this duty.
```

Practice:

1. Replace `vel` with `dov` to make the sentence a vow.
2. Add `so-lem` to show people-scale scope.
3. Explain the difference between `vel`, `mor`, and `dov`.

## Lesson 3: Relationship

Pattern:

```text
Ke rah na.
See me.

Ke ti rah na.
Beloved-you, see me.
```

Practice:

1. Change the addressee to civic peer with `te`.
2. Change the addressee to sacred witness with `hu`.
3. Explain when leaving the addressee implicit is weaker.

## Lesson 4: Means And Companionship

Pattern:

```text
Lem ga naf bi mar.
The people live by remembering.

Na pat ko ti.
I walk with you.
```

Practice:

1. Identify the means phrase in the first sentence.
2. Identify the coordination or companionship phrase in the second sentence.
3. Write a sentence using `bi` and one using `ko`.

## Lesson 5: Relative Objects

Pattern:

```text
Na dov tar mo mik.
I vow to repair what is broken.
```

Practice:

1. Find the moral-agency particle.
2. Find the relative object beginning with `mo`.
3. Run `cargo run --quiet -- parse-sentence --text "Na dov tar mo mik."` and compare the parser's subordinate span with your answer.

## Graded Reading Path

Use the learner corpus as the reading ladder:

- `learner-a1`: one-clause recognition, naming, duty, and basic object sentences
- `learner-a2`: simple domain vocabulary with visible roots and short complements
- `learner-b1`: civic, ritual, technical, and poetic sentences with explicit scope

Release rule: every learner exercise should use accepted words and should remain valid under `validate-corpus` or `parse-sentence`.
