use crate::phonology::validate_word;
use crate::spec::{flatten_lexicon, load_spec, read_spec_yaml};
use crate::types::{CompoundsSpec, CorpusPlanSpec, CorpusSpec, DomainsSpec, EthraSpec};
use anyhow::Result;
use serde::Serialize;
use std::collections::{HashMap, HashSet};

#[derive(Debug, Clone, Serialize)]
pub struct ValidationIssue {
    pub code: String,
    pub message: String,
    pub severity: String,
}

#[derive(Debug, Clone, Serialize)]
pub struct SpecValidationStats {
    pub roots: usize,
    #[serde(rename = "lexiconEntries")]
    pub lexicon_entries: usize,
    #[serde(rename = "derivationPatterns")]
    pub derivation_patterns: usize,
    pub particles: usize,
    pub pronouns: usize,
    pub examples: usize,
}

#[derive(Debug, Clone, Serialize)]
pub struct SpecValidationReport {
    pub valid: bool,
    #[serde(rename = "issueCount")]
    pub issue_count: usize,
    pub errors: Vec<ValidationIssue>,
    pub warnings: Vec<ValidationIssue>,
    pub stats: SpecValidationStats,
}

#[derive(Debug, Clone, Serialize)]
pub struct CorpusValidationStats {
    pub items: usize,
    pub tracks: usize,
    pub domains: usize,
    #[serde(rename = "uniqueTerms")]
    pub unique_terms: usize,
}

#[derive(Debug, Clone, Serialize)]
pub struct CorpusValidationReport {
    pub valid: bool,
    #[serde(rename = "issueCount")]
    pub issue_count: usize,
    pub errors: Vec<ValidationIssue>,
    pub warnings: Vec<ValidationIssue>,
    pub stats: CorpusValidationStats,
}

#[derive(Debug, Clone, Serialize)]
pub struct CompoundsValidationStats {
    pub terms: usize,
    pub accepted: usize,
    pub domains: usize,
    pub registers: usize,
}

#[derive(Debug, Clone, Serialize)]
pub struct CompoundsValidationReport {
    pub valid: bool,
    #[serde(rename = "issueCount")]
    pub issue_count: usize,
    pub errors: Vec<ValidationIssue>,
    pub warnings: Vec<ValidationIssue>,
    pub stats: CompoundsValidationStats,
}

fn add_issue(
    issues: &mut Vec<ValidationIssue>,
    severity: &str,
    code: &str,
    message: impl Into<String>,
) {
    issues.push(ValidationIssue {
        severity: severity.to_string(),
        code: code.to_string(),
        message: message.into(),
    });
}

fn allowed_reserved_overlap(key: &str) -> Option<&'static str> {
    match key {
        "MR.object" => Some("mor is grammaticalized as the inherited-duty particle."),
        "VL.noun" => Some("vel is grammaticalized as the choice particle."),
        "DV.object" => Some("dov is grammaticalized as the vow particle."),
        "TR.object" => Some("tor is grammaticalized as the chosen-duty particle."),
        "HN.object" => Some("hon is grammaticalized as the household collective pronoun."),
        "SL.object" => Some("sol is grammaticalized as the truth-intensifying particle."),
        _ => None,
    }
}

pub fn validate_spec(spec: &EthraSpec) -> SpecValidationReport {
    let mut issues = Vec::new();
    let mut root_ids: HashMap<String, String> = HashMap::new();
    let mut aliases: HashMap<String, String> = HashMap::new();
    let mut derived_words: HashMap<String, String> = HashMap::new();
    let mut reserved_words: HashMap<String, String> = HashMap::new();
    let mut pattern_ids = HashSet::new();

    for pattern in &spec.derivation_patterns.patterns {
        if pattern_ids.contains(&pattern.id) {
            add_issue(
                &mut issues,
                "error",
                "duplicate-derivation-pattern",
                format!(
                    "Derivation pattern '{}' appears more than once.",
                    pattern.id
                ),
            );
        }
        pattern_ids.insert(pattern.id.clone());

        let validation = validate_word(&pattern.example_word);
        if !validation.valid {
            add_issue(
                &mut issues,
                "error",
                "invalid-pattern-example",
                format!(
                    "Derivation pattern '{}' example '{}' fails phonology: {}.",
                    pattern.id,
                    pattern.example_word,
                    validation.errors.join("; ")
                ),
            );
        }
    }

    if spec.derivation_patterns.total_patterns_per_root != spec.derivation_patterns.patterns.len() {
        add_issue(
            &mut issues,
            "warning",
            "pattern-count-mismatch",
            format!(
                "Derivation pattern count {} does not match {} listed patterns.",
                spec.derivation_patterns.total_patterns_per_root,
                spec.derivation_patterns.patterns.len()
            ),
        );
    }

    for particle in &spec.particles.particles {
        reserved_words.insert(particle.word.clone(), format!("particle:{}", particle.kind));
    }

    for pronoun in &spec.pronouns.pronouns {
        if let Some(existing) = reserved_words.get(&pronoun.word) {
            add_issue(
                &mut issues,
                "warning",
                "reserved-word-overlap",
                format!("Pronoun '{}' also appears as {}.", pronoun.word, existing),
            );
        }
        reserved_words.insert(pronoun.word.clone(), format!("pronoun:{}", pronoun.stance));
    }

    for root in &spec.roots.roots {
        if let Some(existing) = root_ids.get(&root.id) {
            add_issue(
                &mut issues,
                "error",
                "duplicate-root-id",
                format!("Root '{}' duplicates {}.", root.id, existing),
            );
        }
        root_ids.insert(root.id.clone(), root.semantic_field.clone());

        for alias in &root.aliases {
            if let Some(existing) = aliases.get(alias) {
                add_issue(
                    &mut issues,
                    "error",
                    "duplicate-root-alias",
                    format!(
                        "Alias '{}' is shared by {} and {}.",
                        alias, existing, root.id
                    ),
                );
            }
            aliases.insert(alias.clone(), root.id.clone());
        }

        for (pattern, derived) in &root.derived {
            if !pattern_ids.contains(pattern) {
                add_issue(
                    &mut issues,
                    "error",
                    "unknown-root-pattern",
                    format!(
                        "{}.{} is not listed in derivation-patterns.yaml.",
                        root.id, pattern
                    ),
                );
            }

            let validation = validate_word(&derived.word);
            if !validation.valid {
                add_issue(
                    &mut issues,
                    "error",
                    "invalid-derived-form",
                    format!(
                        "{}.{} '{}' fails phonology: {}.",
                        root.id,
                        pattern,
                        derived.word,
                        validation.errors.join("; ")
                    ),
                );
            }

            if let Some(existing) = derived_words.get(&derived.word) {
                add_issue(
                    &mut issues,
                    "error",
                    "duplicate-derived-word",
                    format!(
                        "{}.{} '{}' duplicates {}.",
                        root.id, pattern, derived.word, existing
                    ),
                );
            }
            derived_words.insert(derived.word.clone(), format!("{}.{}", root.id, pattern));

            if let Some(reserved) = reserved_words.get(&derived.word) {
                let overlap_key = format!("{}.{}", root.id, pattern);
                if let Some(reason) = allowed_reserved_overlap(&overlap_key) {
                    add_issue(
                        &mut issues,
                        "warning",
                        "grammaticalized-overlap",
                        format!(
                            "{} '{}' overlaps with {}: {}",
                            overlap_key, derived.word, reserved, reason
                        ),
                    );
                } else {
                    add_issue(
                        &mut issues,
                        "error",
                        "derived-reserved-collision",
                        format!(
                            "{} '{}' collides with {}.",
                            overlap_key, derived.word, reserved
                        ),
                    );
                }
            }
        }

        for pattern in &pattern_ids {
            if !root.derived.contains_key(pattern) {
                add_issue(
                    &mut issues,
                    "error",
                    "missing-root-pattern",
                    format!("{} is missing derivation pattern '{}'.", root.id, pattern),
                );
            }
        }
    }

    let lexicon_entries = flatten_lexicon(spec);
    for entry in &lexicon_entries {
        let validation = validate_word(&entry.word);
        if !validation.valid {
            add_issue(
                &mut issues,
                "warning",
                "lexicon-phonology",
                format!(
                    "Lexicon entry '{}' fails phonology: {}.",
                    entry.word,
                    validation.errors.join("; ")
                ),
            );
        }
    }

    let known = normalized_token_set(spec);
    for example in &spec.examples.examples {
        for token in tokenize_ethra(&example.ethra) {
            if !is_known_token(&token, &known) {
                add_issue(
                    &mut issues,
                    "error",
                    "unknown-example-token",
                    format!(
                        "Canonical example {} uses unknown Ethra token '{}'.",
                        example.number, token
                    ),
                );
            }
        }
    }

    let errors = issues
        .iter()
        .filter(|issue| issue.severity == "error")
        .cloned()
        .collect::<Vec<_>>();
    let warnings = issues
        .iter()
        .filter(|issue| issue.severity == "warning")
        .cloned()
        .collect::<Vec<_>>();
    SpecValidationReport {
        valid: errors.is_empty(),
        issue_count: issues.len(),
        errors,
        warnings,
        stats: SpecValidationStats {
            roots: spec.roots.roots.len(),
            lexicon_entries: lexicon_entries.len(),
            derivation_patterns: spec.derivation_patterns.patterns.len(),
            particles: spec.particles.particles.len(),
            pronouns: spec.pronouns.pronouns.len(),
            examples: spec.examples.examples.len(),
        },
    }
}

fn normalized_token_set(spec: &EthraSpec) -> HashSet<String> {
    let mut known = HashSet::new();
    for entry in flatten_lexicon(spec) {
        known.insert(entry.word.to_lowercase());
    }
    for particle in &spec.particles.particles {
        known.insert(particle.word.to_lowercase());
    }
    for pronoun in &spec.pronouns.pronouns {
        known.insert(pronoun.word.to_lowercase());
    }
    for root in &spec.roots.roots {
        for derived in root.derived.values() {
            known.insert(derived.word.to_lowercase());
        }
    }
    known
}

fn tokenize_ethra(text: &str) -> Vec<String> {
    text.to_lowercase()
        .chars()
        .map(|char_value| {
            if matches!(
                char_value,
                '.' | ',' | '!' | '?' | ';' | ':' | '(' | ')' | '"' | '\''
            ) {
                ' '
            } else {
                char_value
            }
        })
        .collect::<String>()
        .split_whitespace()
        .map(str::trim)
        .filter(|token| !token.is_empty())
        .map(ToOwned::to_owned)
        .collect()
}

fn is_known_token(token: &str, known: &HashSet<String>) -> bool {
    known.contains(token)
        || (token.contains('-') && token.split('-').all(|part| known.contains(part)))
}

pub fn validate_corpus(corpus: CorpusSpec, spec: &EthraSpec) -> Result<CorpusValidationReport> {
    let mut issues = Vec::new();
    let known = normalized_token_set(spec);
    let plan = read_spec_yaml::<CorpusPlanSpec>("corpus-plan.yaml")?;
    let domains = read_spec_yaml::<DomainsSpec>("domains.yaml")?;
    let valid_tracks = plan
        .corpus_tracks
        .into_iter()
        .map(|track| track.id)
        .collect::<HashSet<_>>();
    let valid_domains = domains
        .domains
        .into_iter()
        .map(|domain| domain.id)
        .collect::<HashSet<_>>();
    let mut ids = HashSet::new();
    let mut unique_terms = HashSet::new();

    for item in &corpus.items {
        if ids.contains(&item.id) {
            add_issue(
                &mut issues,
                "error",
                "duplicate-corpus-id",
                format!("Corpus item '{}' appears more than once.", item.id),
            );
        }
        ids.insert(item.id.clone());

        if !valid_tracks.contains(&item.track) {
            add_issue(
                &mut issues,
                "error",
                "unknown-corpus-track",
                format!("{} uses unknown track '{}'.", item.id, item.track),
            );
        }

        for domain in &item.domain_tags {
            if !valid_domains.contains(domain) {
                add_issue(
                    &mut issues,
                    "error",
                    "unknown-corpus-domain",
                    format!("{} uses unknown domain tag '{}'.", item.id, domain),
                );
            }
        }

        if item.english.trim().is_empty() {
            add_issue(
                &mut issues,
                "error",
                "missing-corpus-field",
                format!("{} is missing 'english'.", item.id),
            );
        }
        if item.ethra.trim().is_empty() {
            add_issue(
                &mut issues,
                "error",
                "missing-corpus-field",
                format!("{} is missing 'ethra'.", item.id),
            );
        }
        if item.literal.trim().is_empty() {
            add_issue(
                &mut issues,
                "error",
                "missing-corpus-field",
                format!("{} is missing 'literal'.", item.id),
            );
        }
        if item.notes.trim().is_empty() {
            add_issue(
                &mut issues,
                "error",
                "missing-corpus-field",
                format!("{} is missing 'notes'.", item.id),
            );
        }
        if item.register.trim().is_empty() {
            add_issue(
                &mut issues,
                "error",
                "missing-corpus-field",
                format!("{} is missing 'register'.", item.id),
            );
        }

        for token in tokenize_ethra(&item.ethra) {
            if !is_known_token(&token, &known) {
                add_issue(
                    &mut issues,
                    "error",
                    "unknown-corpus-token",
                    format!("{} uses unknown Ethra token '{}'.", item.id, token),
                );
            }
        }

        for term in &item.terms {
            let normalized = term.to_lowercase();
            unique_terms.insert(normalized.clone());
            if !is_known_token(&normalized, &known) {
                add_issue(
                    &mut issues,
                    "error",
                    "unknown-corpus-term",
                    format!("{} lists unknown term '{}'.", item.id, term),
                );
            }
        }
    }

    let track_count = corpus
        .items
        .iter()
        .map(|item| item.track.clone())
        .collect::<HashSet<_>>()
        .len();
    let domain_count = corpus
        .items
        .iter()
        .flat_map(|item| item.domain_tags.clone())
        .collect::<HashSet<_>>()
        .len();
    let errors = issues
        .iter()
        .filter(|issue| issue.severity == "error")
        .cloned()
        .collect::<Vec<_>>();
    let warnings = issues
        .iter()
        .filter(|issue| issue.severity == "warning")
        .cloned()
        .collect::<Vec<_>>();
    Ok(CorpusValidationReport {
        valid: errors.is_empty(),
        issue_count: issues.len(),
        errors,
        warnings,
        stats: CorpusValidationStats {
            items: corpus.items.len(),
            tracks: track_count,
            domains: domain_count,
            unique_terms: unique_terms.len(),
        },
    })
}

pub fn validate_compounds(
    compounds: CompoundsSpec,
    spec: &EthraSpec,
) -> Result<CompoundsValidationReport> {
    let mut issues = Vec::new();
    let mut known = normalized_token_set(spec);
    let domains = read_spec_yaml::<DomainsSpec>("domains.yaml")?;
    let valid_domains = domains
        .domains
        .into_iter()
        .map(|domain| domain.id)
        .collect::<HashSet<_>>();
    let valid_statuses = HashSet::from([
        "candidate".to_string(),
        "provisional".to_string(),
        "accepted".to_string(),
        "deprecated".to_string(),
        "historical".to_string(),
    ]);
    let mut ids = HashSet::new();
    let mut words = HashSet::new();
    let mut registers = HashSet::new();
    let mut used_domains = HashSet::new();

    for term in &compounds.terms {
        known.insert(term.word.to_lowercase());
    }

    for term in &compounds.terms {
        let word = term.word.to_lowercase();
        registers.insert(term.register.clone());

        if ids.contains(&term.id) {
            add_issue(
                &mut issues,
                "error",
                "duplicate-compound-id",
                format!("Compound '{}' appears more than once.", term.id),
            );
        }
        ids.insert(term.id.clone());

        if words.contains(&word) {
            add_issue(
                &mut issues,
                "error",
                "duplicate-compound-word",
                format!("Compound word '{}' appears more than once.", term.word),
            );
        }
        words.insert(word.clone());

        if !valid_statuses.contains(&term.status.to_string()) {
            add_issue(
                &mut issues,
                "error",
                "invalid-compound-status",
                format!("{} has invalid status '{}'.", term.id, term.status),
            );
        }

        if term.components.len() < 2 {
            add_issue(
                &mut issues,
                "error",
                "compound-too-short",
                format!("{} must have at least two components.", term.id),
            );
        }

        let expected_word = term.components.join("-").to_lowercase();
        if word != expected_word {
            add_issue(
                &mut issues,
                "error",
                "compound-word-mismatch",
                format!(
                    "{} word '{}' should be '{}' from components.",
                    term.id, term.word, expected_word
                ),
            );
        }

        if !term.components.contains(&term.head) {
            add_issue(
                &mut issues,
                "error",
                "compound-head-missing",
                format!(
                    "{} head '{}' is not one of its components.",
                    term.id, term.head
                ),
            );
        }

        let phonology = validate_word(&term.word);
        if !phonology.valid {
            add_issue(
                &mut issues,
                "error",
                "compound-phonology",
                format!(
                    "{} '{}' fails phonology: {}.",
                    term.id,
                    term.word,
                    phonology.errors.join("; ")
                ),
            );
        }

        for domain in &term.domain_tags {
            used_domains.insert(domain.clone());
            if !valid_domains.contains(domain) {
                add_issue(
                    &mut issues,
                    "error",
                    "unknown-compound-domain",
                    format!("{} uses unknown domain tag '{}'.", term.id, domain),
                );
            }
        }

        for component in &term.components {
            if !is_known_token(&component.to_lowercase(), &known) {
                add_issue(
                    &mut issues,
                    "error",
                    "unknown-compound-component",
                    format!("{} uses unknown component '{}'.", term.id, component),
                );
            }
        }

        for token in tokenize_ethra(&term.example) {
            if !is_known_token(&token, &known) {
                add_issue(
                    &mut issues,
                    "error",
                    "unknown-compound-example-token",
                    format!("{} example uses unknown token '{}'.", term.id, token),
                );
            }
        }
    }

    let errors = issues
        .iter()
        .filter(|issue| issue.severity == "error")
        .cloned()
        .collect::<Vec<_>>();
    let warnings = issues
        .iter()
        .filter(|issue| issue.severity == "warning")
        .cloned()
        .collect::<Vec<_>>();
    Ok(CompoundsValidationReport {
        valid: errors.is_empty(),
        issue_count: issues.len(),
        errors,
        warnings,
        stats: CompoundsValidationStats {
            terms: compounds.terms.len(),
            accepted: compounds
                .terms
                .iter()
                .filter(|term| term.status.to_string() == "accepted")
                .count(),
            domains: used_domains.len(),
            registers: registers.len(),
        },
    })
}

pub fn validate_current_spec() -> Result<SpecValidationReport> {
    Ok(validate_spec(load_spec()?))
}

pub fn validate_current_corpus() -> Result<CorpusValidationReport> {
    validate_corpus(read_spec_yaml("corpus.yaml")?, load_spec()?)
}

pub fn validate_current_compounds() -> Result<CompoundsValidationReport> {
    validate_compounds(read_spec_yaml("compounds.yaml")?, load_spec()?)
}
