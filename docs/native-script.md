# Native Script Prototype

Ethra v1.0 keeps romanization normative, but the native script prototype now has a machine-readable design brief in `spec/native-script.yaml`.

The prototype is intentionally not a font yet. It defines the constraints that a later script must satisfy before governance can accept it:

- one native sign per romanized phoneme
- visible compound and prefix boundaries
- root consonants recoverable inside derived words
- side-by-side learner use with romanization

The proposed model is left-to-right, word-separated, and uses full vowel letters rather than optional vowel marks. Soft and hard consonants belong to visible families so the sound symbolism in the phonology remains teachable.

Prototype round trips:

```text
rah      r + a + h
mi-rah   mi + boundary + rah
fer-dev  future root + boundary + duty root
so-lem   scope prefix + boundary + people
```

The script should not become normative until there is a glyph sheet, romanization round-trip tests, learner readability review, and governance acceptance.

Inspect the prototype:

```bash
cargo run --quiet -- native-script
```
