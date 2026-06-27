# Word Formation

Ethra forms words in four main ways.

## Root And Pattern

Each root enters patterns:

```text
action       a-vowels        R-H -> rah
concept      e-vowels        R-H -> reh
quality      i-vowels        R-H -> rih
agent        action + -en     R-H -> rahen
object       o-vowels        R-H -> roh
ritual       ha- + u-vowels  R-H -> ha-ruh
civic        action + -da    R-H -> rah-da
intimate     mi- + action    R-H -> mi-rah
process      action + -ga    R-H -> rah-ga
instrument   action + -tel   R-H -> rah-tel
place        action + -wed   R-H -> rah-wed
doctrine     action + -lek   R-H -> rah-lek
collective   action + -lem   R-H -> rah-lem
lack         ne- + action    R-H -> ne-rah
category     action + -gec   R-H -> rah-gec
discipline   action + -dak   R-H -> rah-dak
office       action + -xaf   R-H -> rah-xaf
record       action + -ket   R-H -> rah-ket
right        action + -ret   R-H -> rah-ret
vow          action + -dov   R-H -> rah-dov
```

The full machine-readable catalog is in `spec/derivation-patterns.yaml`. The newer patterns are deliberately institutional and scholarly: they let one root generate tools, records, rights, offices, doctrines, disciplines, and absences without flattening into translated English.

Useful commands:

```bash
cargo run --quiet -- list-patterns
cargo run --quiet -- derive-word --root RAH --pattern instrument
cargo run --quiet -- derive-word --root DAV --pattern right
```

## Analytic Particles

Particles combine with roots without hiding the grammar:

```text
Na dov tar mo mik.
I vow to repair what was broken.
```

## Compounds

Compounds join words by hyphen. The final member is usually the head:

```text
fer-dev       future-binding duty
mer-yes       memory-carried identity
rih-leb       visible inner truth
val-dev       chosen obligation
yas-pet       self-authored destiny
mer-tar       inherited repair
ha-sun        sacred attention
lem-val       civilization-scale agency
mav-reh       love as recognition
nem-dev       speech that creates obligation
mi-rah-yes    a person fully seen by another
```

Curated compound terminology is stored in `spec/compounds.yaml`. These entries add domain tags, register, status, literal analysis, components, head, and examples so compounds can function as governed dictionary terms rather than one-off inventions.

Useful commands:

```bash
cargo run --quiet -- compound-summary
cargo run --quiet -- propose-term --field "honor-bound duty" --kind compound --components hener,dev --domain philosophy-metaphysics --register civic
cargo run --quiet -- list-compounds --domain law-governance
cargo run --quiet -- validate-compounds
```

For new terminology, prefer `propose-term` before editing the accepted specs directly. A proposal packet keeps morphology, collision checks, domain/register intent, and governance requirements visible during review.

## Legal And Civic Precision

The suffix `-da` creates public, legal, or institutional readings:

```text
dav-da   legal duty or office
rah-da   testimony or public recognition
rag-da   public rule or office
mak-da   public corruption or rupture
```

## Poetic Compression

The prefix `ha-` creates solemn or ritual forms:

```text
ha-ruh   solemn unveiling before truth
ha-duv   vow in ritual register
ha-zur   sacred witness
```

Poetic language should compress meaning without becoming vague.
