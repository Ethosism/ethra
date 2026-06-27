use crate::spec::{flatten_lexicon, load_spec, read_spec_yaml};
use crate::types::{
    CompoundTerm, CompoundsSpec, CorpusItem, CorpusSpec, LexiconEntry, ParticleSpec, PronounSpec,
    RootSpec,
};
use anyhow::{Context, Result, bail};
use serde::Serialize;
use std::collections::{BTreeMap, BTreeSet, HashMap};
use std::fmt::Write as _;
use std::fs;
use std::path::Path;

#[derive(Debug, Clone, Serialize)]
pub struct RootFamily {
    pub id: String,
    pub category: String,
    pub core: String,
    pub semantic_field: String,
}

#[derive(Debug, Clone, Serialize)]
pub struct DictionaryCorpus {
    pub frequency: usize,
    pub frequency_band: String,
    pub item_ids: Vec<String>,
    pub tracks: Vec<String>,
    pub registers: Vec<String>,
}

#[derive(Debug, Clone, Serialize)]
pub struct DictionaryEntry {
    pub id: String,
    pub word: String,
    pub source: String,
    pub pronunciation: String,
    pub part_of_speech: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub root: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub root_family: Option<RootFamily>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub pattern: Option<String>,
    pub register: String,
    pub domain_tags: Vec<String>,
    pub meanings: Vec<String>,
    pub literal_etymology: String,
    pub examples: Vec<String>,
    pub corpus: DictionaryCorpus,
    pub lifecycle_status: String,
    pub notes: Vec<String>,
}

#[derive(Debug, Clone)]
pub struct DictionaryLookupOptions {
    pub query: String,
    pub limit: Option<usize>,
    pub exact: bool,
}

#[derive(Debug, Clone, Serialize)]
pub struct DictionaryLookupMatch {
    pub score: usize,
    pub matched_fields: Vec<String>,
    pub entry: DictionaryEntry,
}

#[derive(Debug, Clone, Serialize)]
pub struct DictionaryLookupQuery {
    pub text: String,
    pub normalized: String,
    pub limit: usize,
    pub exact: bool,
}

#[derive(Debug, Clone, Serialize)]
pub struct DictionaryLookupReport {
    pub purpose: String,
    pub query: DictionaryLookupQuery,
    pub total_matches: usize,
    pub returned_matches: usize,
    pub matches: Vec<DictionaryLookupMatch>,
}

#[derive(Debug, Clone, Serialize)]
pub struct SourceCounts {
    pub lexicon: usize,
    pub particle: usize,
    pub pronoun: usize,
    pub compound: usize,
}

#[derive(Debug, Clone, Serialize)]
pub struct TopCorpusEntry {
    pub word: String,
    pub source: String,
    pub meanings: Vec<String>,
    pub frequency: usize,
    pub item_ids: Vec<String>,
}

#[derive(Debug, Clone, Serialize)]
pub struct DictionaryStats {
    pub purpose: String,
    pub schema_version: String,
    pub total_entries: usize,
    pub source_counts: SourceCounts,
    pub root_families: usize,
    pub corpus_attested_entries: usize,
    pub unattested_entries: usize,
    pub domain_counts: BTreeMap<String, usize>,
    pub register_counts: BTreeMap<String, usize>,
    pub top_corpus_entries: Vec<TopCorpusEntry>,
}

#[derive(Debug, Clone, Serialize)]
pub struct DictionaryExportReport {
    pub purpose: String,
    pub output_dir: String,
    pub dictionary_records: usize,
    pub headwords: usize,
    pub generated_files: usize,
    pub letter_counts: BTreeMap<String, usize>,
    pub source_counts: SourceCounts,
}

#[derive(Debug, Clone, Default)]
struct CorpusEvidence {
    frequency: usize,
    item_ids: BTreeSet<String>,
    tracks: BTreeSet<String>,
    registers: BTreeSet<String>,
}

#[derive(Debug, Clone)]
struct DerivedMatch {
    root_family: RootFamily,
    pattern: String,
}

fn category_domains(category: Option<&str>) -> Vec<String> {
    match category.unwrap_or("") {
        "Body" => vec!["body-health"],
        "Building/making" => vec![
            "daily-life",
            "technology-software",
            "art-beauty",
            "economics-provision",
            "travel-place",
        ],
        "Conflict/repair" => vec!["conflict-security", "law-governance"],
        "Emotion" => vec!["emotion-psychology"],
        "Family" => vec!["family-kinship"],
        "Future/civilization" => vec!["history-memory", "philosophy-metaphysics", "law-governance"],
        "Law/civic life" => vec!["law-governance", "economics-provision", "travel-place"],
        "Love/intimacy" => vec!["emotion-psychology", "family-kinship"],
        "Mind" => vec![
            "education-training",
            "ai-cognition",
            "philosophy-metaphysics",
            "science-math",
            "travel-place",
        ],
        "Moral agency" => vec!["law-governance", "philosophy-metaphysics"],
        "Nature" => vec!["nature-ecology", "travel-place", "science-math"],
        "Particles" => vec!["daily-life"],
        "Pronouns" => vec!["daily-life", "family-kinship"],
        "Ritual/poetry" => vec!["ritual-spiritual", "art-beauty"],
        "Seeing/knowing" => vec![
            "science-math",
            "philosophy-metaphysics",
            "emotion-psychology",
        ],
        "Speech" => vec![
            "media-communication",
            "law-governance",
            "ritual-spiritual",
            "art-beauty",
        ],
        "Technology" => vec!["technology-software", "ai-cognition", "media-communication"],
        "Time" => vec!["history-memory", "travel-place"],
        _ => vec![],
    }
    .into_iter()
    .map(ToOwned::to_owned)
    .collect()
}

fn normalize_token(token: &str) -> String {
    token
        .to_lowercase()
        .trim_matches(|char_value: char| !(char_value.is_ascii_lowercase() || char_value == '-'))
        .to_string()
}

fn schema_version() -> Result<String> {
    #[derive(serde::Deserialize)]
    struct SchemaVersion {
        version: String,
    }
    Ok(read_spec_yaml::<SchemaVersion>("dictionary-schema.yaml")?.version)
}

fn corpus_spec() -> Result<CorpusSpec> {
    read_spec_yaml("corpus.yaml")
}

fn compounds_spec() -> Result<CompoundsSpec> {
    read_spec_yaml("compounds.yaml")
}

fn add_evidence(evidence: &mut HashMap<String, CorpusEvidence>, word: &str, item: &CorpusItem) {
    let normalized = normalize_token(word);
    if normalized.is_empty() {
        return;
    }
    let record = evidence.entry(normalized).or_default();
    record.frequency += 1;
    record.item_ids.insert(item.id.clone());
    record.tracks.insert(item.track.clone());
    record.registers.insert(item.register.clone());
}

fn corpus_evidence() -> Result<HashMap<String, CorpusEvidence>> {
    let mut evidence = HashMap::new();
    for item in corpus_spec()?.items {
        for token in item.ethra.split_whitespace() {
            add_evidence(&mut evidence, token, &item);
        }
        for term in &item.terms {
            add_evidence(&mut evidence, term, &item);
        }
    }
    Ok(evidence)
}

fn band(frequency: usize) -> String {
    if frequency >= 10 {
        "common"
    } else if frequency >= 3 {
        "active"
    } else if frequency >= 1 {
        "observed"
    } else {
        "unattested"
    }
    .to_string()
}

fn evidence_for(word: &str, evidence: &HashMap<String, CorpusEvidence>) -> DictionaryCorpus {
    let record = evidence.get(word);
    let frequency = record.map(|item| item.frequency).unwrap_or(0);
    DictionaryCorpus {
        frequency,
        frequency_band: band(frequency),
        item_ids: record
            .map(|item| item.item_ids.iter().cloned().collect())
            .unwrap_or_default(),
        tracks: record
            .map(|item| item.tracks.iter().cloned().collect())
            .unwrap_or_default(),
        registers: record
            .map(|item| item.registers.iter().cloned().collect())
            .unwrap_or_default(),
    }
}

fn derived_index(roots: &[RootSpec]) -> HashMap<String, Vec<DerivedMatch>> {
    let mut index: HashMap<String, Vec<DerivedMatch>> = HashMap::new();
    for root in roots {
        for (pattern, derived) in &root.derived {
            index
                .entry(derived.word.clone())
                .or_default()
                .push(DerivedMatch {
                    root_family: RootFamily {
                        id: root.id.clone(),
                        category: root.category.clone(),
                        core: root.core.clone(),
                        semantic_field: root.semantic_field.clone(),
                    },
                    pattern: pattern.clone(),
                });
        }
    }
    index
}

fn register_from_pattern(
    pattern: Option<&str>,
    part_of_speech: Option<&str>,
    category: Option<&str>,
) -> String {
    if pattern == Some("ritual") {
        "ritual"
    } else if pattern == Some("civic")
        || pattern == Some("right")
        || part_of_speech.is_some_and(|value| value.contains("legal"))
    {
        "civic"
    } else if pattern == Some("intimate") {
        "intimate"
    } else if ["process", "instrument", "record", "category", "discipline"]
        .contains(&pattern.unwrap_or(""))
    {
        "technical"
    } else if category == Some("Particles") {
        "grammar"
    } else if category == Some("Pronouns") {
        "relational"
    } else {
        "plain"
    }
    .to_string()
}

fn lexicon_entry(
    entry: LexiconEntry,
    index: usize,
    derived: &HashMap<String, Vec<DerivedMatch>>,
    evidence: &HashMap<String, CorpusEvidence>,
) -> DictionaryEntry {
    let matched = derived.get(&entry.word).and_then(|items| items.first());
    DictionaryEntry {
        id: format!("lexicon:{}:{}", entry.word, index),
        word: entry.word.clone(),
        source: "lexicon".to_string(),
        pronunciation: entry.pronunciation,
        part_of_speech: entry.part_of_speech.clone(),
        root: Some(entry.root),
        root_family: matched.map(|item| item.root_family.clone()),
        pattern: matched.map(|item| item.pattern.clone()),
        register: register_from_pattern(
            matched.map(|item| item.pattern.as_str()),
            Some(&entry.part_of_speech),
            entry.category.as_deref(),
        ),
        domain_tags: category_domains(entry.category.as_deref()),
        meanings: vec![entry.meaning],
        literal_etymology: entry.literal_etymology,
        examples: vec![entry.example_sentence],
        corpus: evidence_for(&entry.word, evidence),
        lifecycle_status: "accepted".to_string(),
        notes: vec![
            "Generated accepted lexicon entry from the current root-pattern system.".to_string(),
        ],
    }
}

fn particle_entry(
    particle: ParticleSpec,
    index: usize,
    evidence: &HashMap<String, CorpusEvidence>,
) -> DictionaryEntry {
    let domain_tags = if particle.kind == "moral agency" || particle.kind == "scope" {
        vec![
            "philosophy-metaphysics".to_string(),
            "law-governance".to_string(),
        ]
    } else {
        vec!["daily-life".to_string()]
    };
    DictionaryEntry {
        id: format!("particle:{}:{}", particle.word, index),
        word: particle.word.clone(),
        source: "particle".to_string(),
        pronunciation: particle.pronunciation,
        part_of_speech: format!("particle:{}", particle.kind),
        root: None,
        root_family: None,
        pattern: None,
        register: particle.kind,
        domain_tags,
        meanings: vec![particle.meaning],
        literal_etymology: particle.usage,
        examples: vec![particle.example],
        corpus: evidence_for(&particle.word, evidence),
        lifecycle_status: "accepted".to_string(),
        notes: vec!["Closed-class grammar or moral-grammar item.".to_string()],
    }
}

fn pronoun_entry(
    pronoun: PronounSpec,
    index: usize,
    evidence: &HashMap<String, CorpusEvidence>,
) -> DictionaryEntry {
    DictionaryEntry {
        id: format!("pronoun:{}:{}", pronoun.word, index),
        word: pronoun.word.clone(),
        source: "pronoun".to_string(),
        pronunciation: pronoun.pronunciation,
        part_of_speech: format!("pronoun:{}:{}", pronoun.person, pronoun.number),
        root: None,
        root_family: None,
        pattern: None,
        register: "relational".to_string(),
        domain_tags: if pronoun.stance.contains("sacred") {
            vec!["ritual-spiritual".to_string()]
        } else {
            vec!["daily-life".to_string(), "family-kinship".to_string()]
        },
        meanings: vec![pronoun.meaning],
        literal_etymology: pronoun.use_text,
        examples: vec![pronoun.example],
        corpus: evidence_for(&pronoun.word, evidence),
        lifecycle_status: "accepted".to_string(),
        notes: vec![format!("Relational stance: {}.", pronoun.stance)],
    }
}

fn compound_entry(
    compound: CompoundTerm,
    index: usize,
    evidence: &HashMap<String, CorpusEvidence>,
) -> DictionaryEntry {
    DictionaryEntry {
        id: format!("compound:{}:{}", compound.word, index),
        word: compound.word.clone(),
        source: "compound".to_string(),
        pronunciation: compound.pronunciation,
        part_of_speech: compound.part_of_speech,
        root: None,
        root_family: None,
        pattern: None,
        register: compound.register,
        domain_tags: compound.domain_tags,
        meanings: vec![compound.meaning],
        literal_etymology: compound.literal,
        examples: vec![compound.example],
        corpus: evidence_for(&compound.word, evidence),
        lifecycle_status: compound.status.to_string(),
        notes: vec![
            compound.notes,
            format!("Components: {}.", compound.components.join(" + ")),
            format!("Head: {}.", compound.head),
        ],
    }
}

pub fn build_dictionary() -> Result<Vec<DictionaryEntry>> {
    let spec = load_spec()?;
    let evidence = corpus_evidence()?;
    let derived = derived_index(&spec.roots.roots);
    let mut entries = Vec::new();
    entries.extend(
        flatten_lexicon(spec)
            .into_iter()
            .enumerate()
            .map(|(index, entry)| lexicon_entry(entry, index + 1, &derived, &evidence)),
    );
    entries.extend(
        spec.particles
            .particles
            .iter()
            .cloned()
            .enumerate()
            .map(|(index, particle)| particle_entry(particle, index + 1, &evidence)),
    );
    entries.extend(
        spec.pronouns
            .pronouns
            .iter()
            .cloned()
            .enumerate()
            .map(|(index, pronoun)| pronoun_entry(pronoun, index + 1, &evidence)),
    );
    entries.extend(
        compounds_spec()?
            .terms
            .into_iter()
            .enumerate()
            .map(|(index, compound)| compound_entry(compound, index + 1, &evidence)),
    );
    Ok(entries)
}

fn score_entry(entry: DictionaryEntry, query: &str, exact: bool) -> Option<DictionaryLookupMatch> {
    let mut fields = BTreeSet::new();
    let mut score = 0usize;
    let word = entry.word.to_lowercase();

    if word == query {
        fields.insert("word".to_string());
        score += 100;
    } else if !exact && word.starts_with(query) {
        fields.insert("word_prefix".to_string());
        score += 80;
    } else if !exact && word.contains(query) {
        fields.insert("word_substring".to_string());
        score += 65;
    }

    if !exact {
        if entry
            .root
            .as_ref()
            .is_some_and(|root| root.to_lowercase() == query)
        {
            fields.insert("root".to_string());
            score += 85;
        }
        if entry
            .meanings
            .iter()
            .any(|meaning| meaning.to_lowercase().contains(query))
        {
            fields.insert("meaning".to_string());
            score += 55;
        }
        if entry.literal_etymology.to_lowercase().contains(query) {
            fields.insert("literal_etymology".to_string());
            score += 40;
        }
        if entry.root_family.as_ref().is_some_and(|root| {
            root.semantic_field.to_lowercase().contains(query)
                || root.core.to_lowercase().contains(query)
        }) {
            fields.insert("root_family".to_string());
            score += 45;
        }
        if entry
            .domain_tags
            .iter()
            .any(|domain| domain.contains(query))
        {
            fields.insert("domain".to_string());
            score += 35;
        }
    }

    if score == 0 {
        return None;
    }
    score += entry.corpus.frequency.min(12);
    Some(DictionaryLookupMatch {
        score,
        matched_fields: fields.into_iter().collect(),
        entry,
    })
}

pub fn lookup_dictionary(options: DictionaryLookupOptions) -> Result<DictionaryLookupReport> {
    let normalized = options.query.trim().to_lowercase();
    if normalized.is_empty() {
        bail!("Dictionary lookup requires a non-empty query.");
    }
    let limit = options.limit.unwrap_or(20);
    let exact = options.exact;
    let mut matches = build_dictionary()?
        .into_iter()
        .filter_map(|entry| score_entry(entry, &normalized, exact))
        .collect::<Vec<_>>();
    matches.sort_by(|a, b| {
        b.score
            .cmp(&a.score)
            .then_with(|| b.entry.corpus.frequency.cmp(&a.entry.corpus.frequency))
            .then_with(|| a.entry.word.cmp(&b.entry.word))
    });

    Ok(DictionaryLookupReport {
        purpose: "Lookup accepted Ethra dictionary entries with root, register, meaning, example, and corpus evidence.".to_string(),
        query: DictionaryLookupQuery {
            text: options.query,
            normalized,
            limit,
            exact,
        },
        total_matches: matches.len(),
        returned_matches: limit.min(matches.len()),
        matches: matches.into_iter().take(limit).collect(),
    })
}

pub fn dictionary_stats(limit: usize) -> Result<DictionaryStats> {
    let entries = build_dictionary()?;
    let mut source_counts = SourceCounts {
        lexicon: 0,
        particle: 0,
        pronoun: 0,
        compound: 0,
    };
    let mut domain_counts: BTreeMap<String, usize> = BTreeMap::new();
    let mut register_counts: BTreeMap<String, usize> = BTreeMap::new();

    for entry in &entries {
        match entry.source.as_str() {
            "lexicon" => source_counts.lexicon += 1,
            "particle" => source_counts.particle += 1,
            "pronoun" => source_counts.pronoun += 1,
            "compound" => source_counts.compound += 1,
            _ => {}
        }
        for domain in &entry.domain_tags {
            *domain_counts.entry(domain.clone()).or_default() += 1;
        }
        *register_counts.entry(entry.register.clone()).or_default() += 1;
    }

    let mut top = entries
        .iter()
        .filter(|entry| entry.corpus.frequency > 0)
        .collect::<Vec<_>>();
    top.sort_by(|a, b| {
        b.corpus
            .frequency
            .cmp(&a.corpus.frequency)
            .then_with(|| a.word.cmp(&b.word))
    });

    Ok(DictionaryStats {
        purpose: "Summarize Ethra's dictionary-scale lexical layer and corpus evidence."
            .to_string(),
        schema_version: schema_version()?,
        total_entries: entries.len(),
        source_counts,
        root_families: load_spec()?.roots.roots.len(),
        corpus_attested_entries: entries
            .iter()
            .filter(|entry| entry.corpus.frequency > 0)
            .count(),
        unattested_entries: entries
            .iter()
            .filter(|entry| entry.corpus.frequency == 0)
            .count(),
        domain_counts,
        register_counts,
        top_corpus_entries: top
            .into_iter()
            .take(limit)
            .map(|entry| TopCorpusEntry {
                word: entry.word.clone(),
                source: entry.source.clone(),
                meanings: entry.meanings.clone(),
                frequency: entry.corpus.frequency,
                item_ids: entry.corpus.item_ids.iter().take(10).cloned().collect(),
            })
            .collect(),
    })
}

fn source_rank(source: &str) -> usize {
    match source {
        "lexicon" => 0,
        "pronoun" => 1,
        "particle" => 2,
        "compound" => 3,
        _ => 4,
    }
}

fn count_sources(entries: &[DictionaryEntry]) -> SourceCounts {
    let mut source_counts = SourceCounts {
        lexicon: 0,
        particle: 0,
        pronoun: 0,
        compound: 0,
    };
    for entry in entries {
        match entry.source.as_str() {
            "lexicon" => source_counts.lexicon += 1,
            "particle" => source_counts.particle += 1,
            "pronoun" => source_counts.pronoun += 1,
            "compound" => source_counts.compound += 1,
            _ => {}
        }
    }
    source_counts
}

fn dictionary_page_key(word: &str) -> String {
    word.chars()
        .find(|value| value.is_ascii_alphabetic())
        .map(|value| value.to_ascii_lowercase().to_string())
        .unwrap_or_else(|| "symbols".to_string())
}

fn corpus_summary(corpus: &DictionaryCorpus) -> String {
    let mut summary = format!(
        "{} ({} attestation{})",
        corpus.frequency_band,
        corpus.frequency,
        if corpus.frequency == 1 { "" } else { "s" }
    );
    if !corpus.tracks.is_empty() {
        summary.push_str("; tracks: ");
        summary.push_str(&corpus.tracks.join(", "));
    }
    if !corpus.item_ids.is_empty() {
        let item_ids = corpus.item_ids.iter().take(8).cloned().collect::<Vec<_>>();
        summary.push_str("; examples in ");
        summary.push_str(&item_ids.join(", "));
        if corpus.item_ids.len() > item_ids.len() {
            summary.push_str(", ...");
        }
    }
    summary
}

fn useful_notes(notes: &[String]) -> Vec<String> {
    notes
        .iter()
        .filter(|note| {
            !note.starts_with("Generated accepted lexicon entry")
                && !note.starts_with("Closed-class grammar")
        })
        .cloned()
        .collect()
}

fn append_sense_markdown(output: &mut String, index: usize, entry: &DictionaryEntry) {
    let _ = writeln!(output, "### Sense {}: {}", index, entry.source);
    let _ = writeln!(output);
    let _ = writeln!(output, "- **Pronunciation:** `{}`", entry.pronunciation);
    let _ = writeln!(output, "- **Part of speech:** {}", entry.part_of_speech);
    let _ = writeln!(output, "- **Definition:** {}", entry.meanings.join("; "));
    let _ = writeln!(
        output,
        "- **Register/status:** {}; {}",
        entry.register, entry.lifecycle_status
    );
    if !entry.domain_tags.is_empty() {
        let _ = writeln!(output, "- **Domains:** {}", entry.domain_tags.join(", "));
    }
    if let Some(root_family) = &entry.root_family {
        let _ = writeln!(
            output,
            "- **Root family:** `{}`; {}; {}; {}",
            root_family.id, root_family.category, root_family.core, root_family.semantic_field
        );
    } else if entry.root.as_deref().is_some_and(|root| root != "none") {
        let _ = writeln!(output, "- **Root:** `{}`", entry.root.as_deref().unwrap());
    }
    if let Some(pattern) = &entry.pattern {
        let _ = writeln!(output, "- **Pattern:** {}", pattern);
    }
    if !entry.literal_etymology.is_empty() {
        let _ = writeln!(output, "- **Literal:** {}", entry.literal_etymology);
    }
    if !entry.examples.is_empty() {
        let _ = writeln!(output, "- **Example:** {}", entry.examples.join(" / "));
    }
    let _ = writeln!(output, "- **Corpus:** {}", corpus_summary(&entry.corpus));

    let notes = useful_notes(&entry.notes);
    if !notes.is_empty() {
        let _ = writeln!(output, "- **Notes:** {}", notes.join(" "));
    }
    let _ = writeln!(output);
}

fn append_headword_markdown(output: &mut String, word: &str, senses: &[DictionaryEntry]) {
    let _ = writeln!(output, "## {}", word);
    let _ = writeln!(output);
    for (index, entry) in senses.iter().enumerate() {
        append_sense_markdown(output, index + 1, entry);
    }
}

fn write_generated_file(path: &Path, contents: &str) -> Result<()> {
    fs::write(path, contents).with_context(|| format!("failed to write {}", path.display()))
}

fn remove_existing_markdown(output_dir: &Path) -> Result<()> {
    if !output_dir.exists() {
        return Ok(());
    }

    for item in fs::read_dir(output_dir)
        .with_context(|| format!("failed to read {}", output_dir.display()))?
    {
        let path = item
            .with_context(|| format!("failed to inspect {}", output_dir.display()))?
            .path();
        if path.extension().is_some_and(|extension| extension == "md") {
            fs::remove_file(&path)
                .with_context(|| format!("failed to remove {}", path.display()))?;
        }
    }
    Ok(())
}

fn index_markdown(
    letter_counts: &BTreeMap<String, usize>,
    records: usize,
    headwords: usize,
) -> String {
    let mut output = String::new();
    let _ = writeln!(output, "# Ethra Dictionary Index");
    let _ = writeln!(output);
    let _ = writeln!(
        output,
        "This is a generated reading dictionary built from Ethra's canonical YAML spec."
    );
    let _ = writeln!(output);
    let _ = writeln!(output, "- **Headwords:** {}", headwords);
    let _ = writeln!(output, "- **Dictionary records:** {}", records);
    let _ = writeln!(output);
    let _ = writeln!(output, "## Browse by Letter");
    let _ = writeln!(output);
    for (letter, count) in letter_counts {
        let filename = if letter == "symbols" {
            "symbols.md".to_string()
        } else {
            format!("{}.md", letter)
        };
        let label = if letter == "symbols" {
            "Symbols".to_string()
        } else {
            letter.to_uppercase()
        };
        let _ = writeln!(output, "- [{}]({}) - {} headwords", label, filename, count);
    }
    output
}

fn readme_markdown(records: usize, headwords: usize) -> String {
    format!(
        "# Ethra Dictionary\n\n\
This folder is generated from the canonical Ethra language data in `spec/`.\n\n\
- **Headwords:** {headwords}\n\
- **Dictionary records:** {records}\n\n\
Start with [the index](index.md), then browse by starting letter.\n\n\
Each headword gives pronunciation, part of speech, English definition, register, root-family context, literal morphology, examples, and corpus evidence where available.\n\n\
Regenerate this folder from the repo root with:\n\n\
```bash\n\
cargo run --quiet -- export-dictionary --output dictionary\n\
```\n"
    )
}

pub fn export_dictionary_markdown(output_dir: impl AsRef<Path>) -> Result<DictionaryExportReport> {
    let output_dir = output_dir.as_ref();
    let entries = build_dictionary()?;
    let records = entries.len();
    let source_counts = count_sources(&entries);

    let mut headwords: BTreeMap<String, Vec<DictionaryEntry>> = BTreeMap::new();
    for entry in entries {
        headwords.entry(entry.word.clone()).or_default().push(entry);
    }
    for senses in headwords.values_mut() {
        senses.sort_by(|a, b| {
            source_rank(&a.source)
                .cmp(&source_rank(&b.source))
                .then_with(|| a.part_of_speech.cmp(&b.part_of_speech))
                .then_with(|| a.id.cmp(&b.id))
        });
    }

    fs::create_dir_all(output_dir)
        .with_context(|| format!("failed to create {}", output_dir.display()))?;
    remove_existing_markdown(output_dir)?;

    let mut pages: BTreeMap<String, String> = BTreeMap::new();
    let mut letter_counts: BTreeMap<String, usize> = BTreeMap::new();
    for (word, senses) in &headwords {
        let page_key = dictionary_page_key(word);
        let page = pages.entry(page_key.clone()).or_insert_with(|| {
            let title = if page_key == "symbols" {
                "Symbols".to_string()
            } else {
                page_key.to_uppercase()
            };
            format!("# {}\n\n[Back to index](index.md)\n\n", title)
        });
        append_headword_markdown(page, word, senses);
        *letter_counts.entry(page_key).or_default() += 1;
    }

    for (page_key, page) in &pages {
        let filename = if page_key == "symbols" {
            "symbols.md".to_string()
        } else {
            format!("{}.md", page_key)
        };
        write_generated_file(&output_dir.join(filename), page)?;
    }
    write_generated_file(
        &output_dir.join("index.md"),
        &index_markdown(&letter_counts, records, headwords.len()),
    )?;
    write_generated_file(
        &output_dir.join("README.md"),
        &readme_markdown(records, headwords.len()),
    )?;

    let mut generated_files = pages.len();
    generated_files += 2;

    Ok(DictionaryExportReport {
        purpose: "Export Ethra's dictionary as human-readable Markdown headword files.".to_string(),
        output_dir: output_dir.display().to_string(),
        dictionary_records: records,
        headwords: headwords.len(),
        generated_files,
        letter_counts,
        source_counts,
    })
}

pub(crate) fn category_domains_for_coverage(category: Option<&str>) -> Vec<String> {
    category_domains(category)
}
