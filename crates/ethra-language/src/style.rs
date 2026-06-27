use crate::phonology::validate_word;
use crate::spec::{flatten_lexicon, load_spec, read_spec_yaml};
use crate::types::{CompoundTerm, LexiconEntry, ParticleSpec, PronounSpec};
use anyhow::Result;
use indexmap::IndexMap;
use serde::{Deserialize, Serialize};
use std::collections::{BTreeSet, HashMap, HashSet};

#[derive(Debug, Clone, Deserialize)]
struct StyleSpec {
    principle: String,
    register_expectations: IndexMap<String, RegisterExpectation>,
    moral_scope: MoralScope,
    relational_address: RelationalAddress,
    compound_guidance: CompoundGuidance,
}

#[derive(Debug, Clone, Deserialize)]
struct RegisterExpectation {
    markers: Vec<String>,
    rationale: String,
}

#[derive(Debug, Clone, Deserialize)]
struct MoralScope {
    agency_particles: Vec<String>,
    binding_particles: Vec<String>,
    scope_particles: Vec<String>,
    witness_scope_particles: Vec<String>,
}

#[derive(Debug, Clone, Deserialize)]
struct RelationalAddress {
    second_person_pronouns: Vec<String>,
    principle: String,
}

#[derive(Debug, Clone, Deserialize)]
struct CompoundGuidance {
    max_segments_before_notice: usize,
    principle: String,
}

#[derive(Debug, Clone)]
pub struct StyleCheckOptions {
    pub text: String,
    pub register: Option<String>,
    pub require_moral_agency: bool,
    pub require_scope: bool,
}

#[derive(Debug, Clone, Serialize)]
pub struct StyleToken {
    pub raw: String,
    pub normalized: String,
    pub valid_phonology: bool,
    pub errors: Vec<String>,
    pub known: bool,
    pub roles: Vec<String>,
}

#[derive(Debug, Clone, Serialize)]
pub struct StyleIssue {
    pub severity: String,
    pub code: String,
    pub message: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub token: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub suggestion: Option<String>,
}

#[derive(Debug, Clone, Serialize)]
pub struct IssueCounts {
    pub error: usize,
    pub warning: usize,
    pub notice: usize,
}

#[derive(Debug, Clone, Serialize)]
pub struct StyleObserved {
    pub moral_particles: Vec<String>,
    pub binding_particles: Vec<String>,
    pub scope_particles: Vec<String>,
    pub register_markers: Vec<String>,
    pub pronouns: Vec<String>,
    pub second_person_pronouns: Vec<String>,
    pub transparent_compounds: Vec<String>,
}

#[derive(Debug, Clone, Serialize)]
pub struct StyleCheckReport {
    pub text: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub requested_register: Option<String>,
    pub valid: bool,
    pub score: i64,
    pub issue_counts: IssueCounts,
    pub observed: StyleObserved,
    pub tokens: Vec<StyleToken>,
    pub issues: Vec<StyleIssue>,
    pub suggestions: Vec<String>,
    pub cultural_notes: Vec<String>,
}

#[derive(Debug, Clone)]
struct KnownMaps {
    lexicon: HashMap<String, Vec<LexiconEntry>>,
    particles: HashMap<String, ParticleSpec>,
    pronouns: HashMap<String, PronounSpec>,
    compounds: HashMap<String, CompoundTerm>,
    words: HashSet<String>,
}

fn style_spec() -> Result<StyleSpec> {
    read_spec_yaml("style.yaml")
}

pub(crate) fn normalize_token(token: &str) -> String {
    token
        .to_lowercase()
        .trim_matches(|char_value: char| !(char_value.is_ascii_lowercase() || char_value == '-'))
        .to_string()
}

pub(crate) fn unique(values: impl IntoIterator<Item = String>) -> Vec<String> {
    values
        .into_iter()
        .filter(|value| !value.is_empty())
        .collect::<BTreeSet<_>>()
        .into_iter()
        .collect()
}

fn build_known_maps() -> Result<KnownMaps> {
    let spec = load_spec()?;
    let mut lexicon: HashMap<String, Vec<LexiconEntry>> = HashMap::new();
    let mut particles = HashMap::new();
    let mut pronouns = HashMap::new();
    let mut compounds = HashMap::new();
    let mut words = HashSet::new();

    for entry in flatten_lexicon(spec) {
        lexicon
            .entry(entry.word.clone())
            .or_default()
            .push(entry.clone());
        words.insert(entry.word);
    }
    for particle in &spec.particles.particles {
        particles.insert(particle.word.clone(), particle.clone());
        words.insert(particle.word.clone());
    }
    for pronoun in &spec.pronouns.pronouns {
        pronouns.insert(pronoun.word.clone(), pronoun.clone());
        words.insert(pronoun.word.clone());
    }
    for compound in read_spec_yaml::<crate::types::CompoundsSpec>("compounds.yaml")?.terms {
        compounds.insert(compound.word.clone(), compound.clone());
        words.insert(compound.word);
    }

    Ok(KnownMaps {
        lexicon,
        particles,
        pronouns,
        compounds,
        words,
    })
}

fn token_roles(word: &str, maps: &KnownMaps) -> Vec<String> {
    let mut roles = Vec::new();
    if let Some(particle) = maps.particles.get(word) {
        roles.push(format!("particle:{}", particle.kind));
    }
    if let Some(pronoun) = maps.pronouns.get(word) {
        roles.push(format!("pronoun:{}:{}", pronoun.person, pronoun.stance));
    }
    if let Some(compound) = maps.compounds.get(word) {
        roles.push(format!("compound:{}", compound.register));
    }
    if let Some(entries) = maps.lexicon.get(word) {
        for entry in entries {
            roles.push(format!(
                "lexicon:{}:{}",
                entry.part_of_speech,
                entry.category.as_deref().unwrap_or("uncategorized")
            ));
        }
    }
    if !maps.words.contains(word) && word.contains('-') {
        let segments = word.split('-').collect::<Vec<_>>();
        if segments.iter().all(|segment| maps.words.contains(*segment)) {
            roles.push("transparent-compound".to_string());
        }
    }
    unique(roles)
}

fn marker_matches(word: &str, marker: &str) -> bool {
    if marker.ends_with('-') {
        word.starts_with(marker)
    } else if marker.starts_with('-') {
        word.ends_with(marker)
    } else {
        word == marker
    }
}

fn observed_register_markers(tokens: &[String], spec: &StyleSpec) -> Vec<String> {
    let mut markers = BTreeSet::new();
    for word in tokens {
        for expectation in spec.register_expectations.values() {
            for marker in &expectation.markers {
                if marker_matches(word, marker) {
                    markers.insert(marker.clone());
                }
            }
        }
    }
    markers.into_iter().collect()
}

fn issue_counts(issues: &[StyleIssue]) -> IssueCounts {
    IssueCounts {
        error: issues
            .iter()
            .filter(|issue| issue.severity == "error")
            .count(),
        warning: issues
            .iter()
            .filter(|issue| issue.severity == "warning")
            .count(),
        notice: issues
            .iter()
            .filter(|issue| issue.severity == "notice")
            .count(),
    }
}

fn score(counts: &IssueCounts) -> i64 {
    0.max(100 - counts.error as i64 * 25 - counts.warning as i64 * 10 - counts.notice as i64 * 3)
}

fn style_issue(
    severity: &str,
    code: &str,
    message: impl Into<String>,
    token: Option<String>,
    suggestion: Option<String>,
) -> StyleIssue {
    StyleIssue {
        severity: severity.to_string(),
        code: code.to_string(),
        message: message.into(),
        token,
        suggestion,
    }
}

pub fn style_check(options: StyleCheckOptions) -> Result<StyleCheckReport> {
    let rules = style_spec()?;
    let maps = build_known_maps()?;
    let raw_tokens = options
        .text
        .split_whitespace()
        .map(|token| token.trim().to_string())
        .filter(|token| !token.is_empty())
        .collect::<Vec<_>>();
    let mut issues = Vec::new();

    if raw_tokens.is_empty() {
        issues.push(style_issue(
            "error",
            "empty-text",
            "No Ethra text was provided.",
            None,
            Some("Pass a sentence with --text.".to_string()),
        ));
    }

    let tokens = raw_tokens
        .iter()
        .map(|raw| {
            let normalized = normalize_token(raw);
            let validation = validate_word(&normalized);
            let roles = if normalized.is_empty() {
                Vec::new()
            } else {
                token_roles(&normalized, &maps)
            };
            StyleToken {
                raw: raw.clone(),
                normalized,
                valid_phonology: validation.valid,
                errors: validation.errors,
                known: !roles.is_empty(),
                roles,
            }
        })
        .collect::<Vec<_>>();

    for token in &tokens {
        if token.normalized.is_empty() {
            issues.push(style_issue(
                "error",
                "empty-token",
                "A token has no readable Ethra letters after punctuation is removed.",
                Some(token.raw.clone()),
                None,
            ));
            continue;
        }
        if !token.valid_phonology {
            issues.push(style_issue(
                "error",
                "phonology",
                token.errors.join("; "),
                Some(token.raw.clone()),
                Some(
                    "Use only Ethra symbols and avoid consonant clusters inside a hyphen segment."
                        .to_string(),
                ),
            ));
        }
        if token.valid_phonology && !token.known {
            issues.push(style_issue(
                "warning",
                "unknown-token",
                format!(
                    "'{}' is phonologically possible but not in the accepted lexicon, particles, pronouns, or compounds.",
                    token.normalized
                ),
                Some(token.raw.clone()),
                Some("Use propose-term for candidate terminology or add corpus evidence before admission.".to_string()),
            ));
        }
        if token.normalized.split('-').count() > rules.compound_guidance.max_segments_before_notice
        {
            issues.push(style_issue(
                "notice",
                "long-compound",
                format!("'{}' has many visible segments.", token.normalized),
                Some(token.raw.clone()),
                Some("Consider whether a shorter compound or new root would preserve cadence better.".to_string()),
            ));
        }
    }

    let words = tokens
        .iter()
        .map(|token| token.normalized.clone())
        .filter(|token| !token.is_empty())
        .collect::<Vec<_>>();
    let moral_particles = words
        .iter()
        .filter(|word| rules.moral_scope.agency_particles.contains(word))
        .cloned()
        .collect::<Vec<_>>();
    let binding_particles = words
        .iter()
        .filter(|word| rules.moral_scope.binding_particles.contains(word))
        .cloned()
        .collect::<Vec<_>>();
    let scope_particles = words
        .iter()
        .filter(|word| rules.moral_scope.scope_particles.contains(word))
        .cloned()
        .collect::<Vec<_>>();
    let pronouns = words
        .iter()
        .filter(|word| maps.pronouns.contains_key(*word))
        .cloned()
        .collect::<Vec<_>>();
    let second_person_pronouns = words
        .iter()
        .filter(|word| {
            rules
                .relational_address
                .second_person_pronouns
                .contains(word)
        })
        .cloned()
        .collect::<Vec<_>>();
    let register_markers = observed_register_markers(&words, &rules);
    let transparent_compounds = tokens
        .iter()
        .filter(|token| token.roles.contains(&"transparent-compound".to_string()))
        .map(|token| token.normalized.clone())
        .collect::<Vec<_>>();

    let requested_register = options.register.as_ref().map(|value| value.to_lowercase());
    if let Some(register) = &requested_register {
        if let Some(expectation) = rules.register_expectations.get(register) {
            if !words.iter().any(|word| {
                expectation
                    .markers
                    .iter()
                    .any(|marker| marker_matches(word, marker))
            }) {
                issues.push(style_issue(
                    "warning",
                    "register-marker-missing",
                    format!(
                        "Requested {} register, but no expected marker was found.",
                        register
                    ),
                    None,
                    Some(format!(
                        "Expected one of: {}. {}",
                        expectation.markers.join(", "),
                        expectation.rationale
                    )),
                ));
            }
        } else {
            issues.push(style_issue(
                "warning",
                "unknown-register",
                format!("'{}' is not a configured style-check register.", register),
                None,
                Some(format!(
                    "Known registers: {}.",
                    rules
                        .register_expectations
                        .keys()
                        .cloned()
                        .collect::<Vec<_>>()
                        .join(", ")
                )),
            ));
        }
    }

    let first_word = words.first();
    let has_first_person = first_word
        .and_then(|word| maps.pronouns.get(word))
        .is_some_and(|pronoun| pronoun.person == "first");
    let has_action_scope = !scope_particles.is_empty();

    if has_first_person && moral_particles.is_empty() {
        issues.push(style_issue(
            if options.require_moral_agency { "warning" } else { "notice" },
            "moral-agency-implicit",
            "First-person speech has no explicit moral-agency particle.",
            None,
            Some("Use kan, lun, wen, vel, cel, dom, dov, ten, mor, tor, or ren when agency is morally relevant.".to_string()),
        ));
    }

    if options.require_moral_agency && moral_particles.is_empty() && !has_first_person {
        issues.push(style_issue(
            "warning",
            "required-moral-agency-missing",
            "This check requires explicit moral agency, but no moral-agency particle was found.",
            None,
            Some("Add an agency particle or disable --require-moral-agency.".to_string()),
        ));
    }

    if !binding_particles.is_empty() && scope_particles.is_empty() {
        issues.push(style_issue(
            if options.require_scope { "warning" } else { "notice" },
            "scope-implicit",
            format!(
                "Binding moral particle(s) {} appear without action scope.",
                unique(binding_particles.clone()).join(", ")
            ),
            None,
            Some("Add so-na, so-hen, so-lem, so-fer, so-rah, or so-zur when the scale of obligation matters.".to_string()),
        ));
    }

    if options.require_scope && !has_action_scope {
        issues.push(style_issue(
            "warning",
            "required-scope-missing",
            "This check requires action scope, but no scope particle was found.",
            None,
            Some(
                "Add a scope marker such as so-na, so-hen, so-lem, so-fer, so-rah, or so-zur."
                    .to_string(),
            ),
        ));
    }

    if words.contains(&"dov".to_string())
        && !words
            .iter()
            .any(|word| rules.moral_scope.witness_scope_particles.contains(word))
    {
        issues.push(style_issue(
            "notice",
            "vow-witness-implicit",
            "A vow appears without an explicit truth or sacred witness scope.",
            None,
            Some(
                "Use so-rah or so-zur when the witness should be grammatically visible."
                    .to_string(),
            ),
        ));
    }

    if words.contains(&"ke".to_string()) && second_person_pronouns.is_empty() {
        issues.push(style_issue(
            "notice",
            "address-implicit",
            "Imperative speech has an implicit addressee.",
            None,
            Some(
                "Add ti, ta, to, tu, te, za, hu, or tum when relational stance matters."
                    .to_string(),
            ),
        ));
    }

    if requested_register.as_deref() == Some("ritual")
        && !second_person_pronouns.is_empty()
        && !second_person_pronouns.contains(&"hu".to_string())
    {
        issues.push(style_issue(
            "notice",
            "ritual-address-not-sacred",
            "Ritual register is requested, but the address pronoun is not sacred.",
            None,
            Some("Use hu if the addressee is ultimate or sacred; keep the current pronoun if the ritual is addressed to a human witness.".to_string()),
        ));
    }

    let counts = issue_counts(&issues);
    let suggestions = unique(
        issues
            .iter()
            .filter_map(|issue| issue.suggestion.clone())
            .collect::<Vec<_>>(),
    );

    Ok(StyleCheckReport {
        text: options.text,
        requested_register,
        valid: counts.error == 0,
        score: score(&counts),
        issue_counts: counts,
        observed: StyleObserved {
            moral_particles: unique(moral_particles),
            binding_particles: unique(binding_particles),
            scope_particles: unique(scope_particles),
            register_markers,
            pronouns: unique(pronouns),
            second_person_pronouns: unique(second_person_pronouns),
            transparent_compounds: unique(transparent_compounds),
        },
        tokens,
        issues,
        suggestions,
        cultural_notes: vec![
            rules.principle,
            rules.relational_address.principle,
            rules.compound_guidance.principle,
        ],
    })
}
