use crate::phonology::validate_word;
use crate::spec::{flatten_lexicon, load_spec, read_spec_yaml};
use crate::style::{normalize_token, unique};
use crate::types::{CompoundTerm, LexiconEntry, ParticleSpec, PronounSpec};
use anyhow::Result;
use serde::{Deserialize, Serialize};
use std::collections::{HashMap, HashSet};

#[derive(Debug, Clone, Deserialize)]
struct SyntaxSpec {
    principle: String,
    particle_chain: ParticleChain,
    parser_limits: Vec<String>,
    cultural_notes: Vec<String>,
}

#[derive(Debug, Clone, Deserialize)]
struct ParticleChain {
    pre_predicate_types: Vec<String>,
    register_types: Vec<String>,
    scope_types: Vec<String>,
    complement_prepositions: Vec<String>,
}

#[derive(Debug, Clone)]
struct KnownMaps {
    lexicon: HashMap<String, Vec<LexiconEntry>>,
    particles: HashMap<String, ParticleSpec>,
    pronouns: HashMap<String, PronounSpec>,
    compounds: HashMap<String, CompoundTerm>,
    words: HashSet<String>,
}

#[derive(Debug, Clone, Serialize)]
pub struct ParseIssue {
    pub severity: String,
    pub code: String,
    pub message: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub token: Option<String>,
}

#[derive(Debug, Clone, Serialize)]
pub struct ParseToken {
    pub index: usize,
    pub raw: String,
    pub normalized: String,
    pub valid_phonology: bool,
    pub errors: Vec<String>,
    pub known: bool,
    pub classes: Vec<String>,
}

#[derive(Debug, Clone, Serialize)]
pub struct ParseSpan {
    pub role: String,
    pub start: usize,
    pub end: usize,
    pub text: String,
    pub tokens: Vec<String>,
}

#[derive(Debug, Clone, Serialize)]
pub struct ParsedClause {
    pub pattern: String,
    pub sentence_mood: Vec<ParseSpan>,
    pub register_markers: Vec<ParseSpan>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub subject: Option<ParseSpan>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub address: Option<ParseSpan>,
    pub particle_chain: Vec<ParseSpan>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub predicate: Option<ParseSpan>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub object: Option<ParseSpan>,
    pub noun_phrases: Vec<ParseSpan>,
    pub coordination: Vec<ParseSpan>,
    pub subordinate_clauses: Vec<ParseSpan>,
    pub complements: Vec<ParseSpan>,
    pub scopes: Vec<ParseSpan>,
}

#[derive(Debug, Clone, Serialize)]
pub struct SentenceParseReport {
    pub text: String,
    pub valid: bool,
    pub confidence: f64,
    pub tokens: Vec<ParseToken>,
    pub clause: ParsedClause,
    pub issues: Vec<ParseIssue>,
    pub parser_notes: Vec<String>,
    pub cultural_notes: Vec<String>,
}

fn syntax_spec() -> Result<SyntaxSpec> {
    read_spec_yaml("syntax.yaml")
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

fn token_classes(word: &str, maps: &KnownMaps) -> Vec<String> {
    let mut classes = Vec::new();
    if let Some(particle) = maps.particles.get(word) {
        classes.push(format!("particle:{}", particle.kind));
    }
    if let Some(pronoun) = maps.pronouns.get(word) {
        classes.push(format!("pronoun:{}:{}", pronoun.person, pronoun.stance));
    }
    if let Some(compound) = maps.compounds.get(word) {
        classes.push(format!("compound:{}", compound.register));
    }
    if let Some(entries) = maps.lexicon.get(word) {
        for entry in entries {
            classes.push(format!(
                "lexicon:{}:{}",
                entry.part_of_speech,
                entry.category.as_deref().unwrap_or("uncategorized")
            ));
        }
    }
    if !maps.words.contains(word) && word.contains('-') {
        let segments = word.split('-').collect::<Vec<_>>();
        if segments.iter().all(|segment| maps.words.contains(*segment)) {
            classes.push("transparent-compound".to_string());
        }
    }
    unique(classes)
}

fn span(tokens: &[ParseToken], role: &str, start: usize, end: usize) -> Option<ParseSpan> {
    if end <= start || start >= tokens.len() {
        return None;
    }
    let bounded_end = end.min(tokens.len());
    let selected = &tokens[start..bounded_end];
    Some(ParseSpan {
        role: role.to_string(),
        start,
        end: bounded_end,
        text: selected
            .iter()
            .map(|token| token.normalized.clone())
            .collect::<Vec<_>>()
            .join(" "),
        tokens: selected
            .iter()
            .map(|token| token.normalized.clone())
            .collect(),
    })
}

fn particle_type<'a>(token: Option<&ParseToken>, maps: &'a KnownMaps) -> Option<&'a str> {
    token
        .and_then(|token| maps.particles.get(&token.normalized))
        .map(|particle| particle.kind.as_str())
}

fn is_particle_type(token: Option<&ParseToken>, maps: &KnownMaps, types: &[String]) -> bool {
    particle_type(token, maps).is_some_and(|kind| types.iter().any(|item| item == kind))
}

fn is_word(token: Option<&ParseToken>, word: &str) -> bool {
    token.is_some_and(|token| token.normalized == word)
}

fn is_second_person(token: Option<&ParseToken>, maps: &KnownMaps) -> bool {
    token
        .and_then(|token| maps.pronouns.get(&token.normalized))
        .is_some_and(|pronoun| pronoun.person == "second")
}

fn parse_tail(
    tokens: &[ParseToken],
    maps: &KnownMaps,
    rules: &SyntaxSpec,
    start: usize,
) -> (Option<ParseSpan>, Vec<ParseSpan>, Vec<ParseSpan>) {
    let mut complements = Vec::new();
    let mut scopes = Vec::new();
    let mut object_indices = Vec::new();
    let mut cursor = start;

    while cursor < tokens.len() {
        if is_particle_type(tokens.get(cursor), maps, &rules.particle_chain.scope_types) {
            if let Some(scope) = span(tokens, "scope", cursor, cursor + 1) {
                scopes.push(scope);
            }
            cursor += 1;
            continue;
        }

        if rules
            .particle_chain
            .complement_prepositions
            .contains(&tokens[cursor].normalized)
            && cursor + 1 < tokens.len()
        {
            if let Some(complement) = span(tokens, "complement", cursor, cursor + 2) {
                complements.push(complement);
            }
            cursor += 2;
            continue;
        }

        object_indices.push(cursor);
        cursor += 1;
    }

    let object = if object_indices.is_empty() {
        None
    } else {
        let start = *object_indices.iter().min().unwrap();
        let end = object_indices.iter().max().unwrap() + 1;
        span(tokens, "object", start, end)
    };
    (object, complements, scopes)
}

fn parse_issue(
    severity: &str,
    code: &str,
    message: impl Into<String>,
    token: Option<String>,
) -> ParseIssue {
    ParseIssue {
        severity: severity.to_string(),
        code: code.to_string(),
        message: message.into(),
        token,
    }
}

fn issue_count(issues: &[ParseIssue], severity: &str) -> usize {
    issues
        .iter()
        .filter(|issue| issue.severity == severity)
        .count()
}

fn confidence(pattern: &str, issues: &[ParseIssue]) -> f64 {
    let base = if pattern == "fragment" { 0.35 } else { 0.92 };
    let value = base
        - issue_count(issues, "error") as f64 * 0.25
        - issue_count(issues, "warning") as f64 * 0.08
        - issue_count(issues, "notice") as f64 * 0.03;
    (value.max(0.0) * 100.0).round() / 100.0
}

fn push_unique_span(spans: &mut Vec<ParseSpan>, span: ParseSpan) {
    if !spans.iter().any(|existing| {
        existing.role == span.role && existing.start == span.start && existing.end == span.end
    }) {
        spans.push(span);
    }
}

fn detect_noun_phrases(tokens: &[ParseToken], clause: &ParsedClause) -> Vec<ParseSpan> {
    let mut phrases = Vec::new();

    if let Some(subject) = &clause.subject {
        let mut subject_phrase = subject.clone();
        subject_phrase.role = "noun-phrase:subject".to_string();
        push_unique_span(&mut phrases, subject_phrase);
    }

    if let Some(object) = &clause.object {
        let mut object_phrase = object.clone();
        object_phrase.role = "noun-phrase:object".to_string();
        push_unique_span(&mut phrases, object_phrase);
    }

    for complement in &clause.complements {
        let mut complement_phrase = complement.clone();
        complement_phrase.role = "noun-phrase:complement".to_string();
        push_unique_span(&mut phrases, complement_phrase);
    }

    for index in 0..tokens.len() {
        if is_word(tokens.get(index + 1), "en") && index + 2 < tokens.len() {
            if let Some(span) = span(tokens, "noun-phrase:possessive", index, index + 3) {
                push_unique_span(&mut phrases, span);
            }
        }
        if is_word(tokens.get(index + 1), "se") {
            if let Some(span) = span(tokens, "noun-phrase:demonstrative", index, index + 2) {
                push_unique_span(&mut phrases, span);
            }
        }
    }

    phrases.sort_by(|a, b| a.start.cmp(&b.start).then_with(|| a.end.cmp(&b.end)));
    phrases
}

fn detect_coordination(tokens: &[ParseToken]) -> Vec<ParseSpan> {
    let mut spans = Vec::new();
    for index in 0..tokens.len() {
        if is_word(tokens.get(index), "ko") && index > 0 && index + 1 < tokens.len() {
            if let Some(span) = span(tokens, "coordination:alongside", index - 1, index + 2) {
                spans.push(span);
            }
        }
    }
    spans
}

fn detect_subordinate_clauses(
    tokens: &[ParseToken],
    maps: &KnownMaps,
    rules: &SyntaxSpec,
) -> Vec<ParseSpan> {
    let mut spans = Vec::new();
    for index in 0..tokens.len() {
        if !is_word(tokens.get(index), "mo") {
            continue;
        }

        let mut end = index + 1;
        while end < tokens.len() {
            if end > index + 1
                && (is_particle_type(tokens.get(end), maps, &rules.particle_chain.scope_types)
                    || rules
                        .particle_chain
                        .complement_prepositions
                        .contains(&tokens[end].normalized))
            {
                break;
            }
            end += 1;
        }
        if let Some(span) = span(tokens, "subordinate:relative-object", index, end) {
            spans.push(span);
        }
    }
    spans
}

pub fn parse_sentence(text: &str) -> Result<SentenceParseReport> {
    let rules = syntax_spec()?;
    let maps = build_known_maps()?;
    let raw_tokens = text
        .split_whitespace()
        .map(|token| token.trim().to_string())
        .filter(|token| !token.is_empty())
        .collect::<Vec<_>>();
    let mut issues = Vec::new();

    if raw_tokens.is_empty() {
        issues.push(parse_issue(
            "error",
            "empty-text",
            "No Ethra text was provided.",
            None,
        ));
    }

    let tokens = raw_tokens
        .iter()
        .enumerate()
        .map(|(index, raw)| {
            let normalized = normalize_token(raw);
            let validation = validate_word(&normalized);
            let classes = if normalized.is_empty() {
                Vec::new()
            } else {
                token_classes(&normalized, &maps)
            };
            ParseToken {
                index,
                raw: raw.clone(),
                normalized,
                valid_phonology: validation.valid,
                errors: validation.errors,
                known: !classes.is_empty(),
                classes,
            }
        })
        .collect::<Vec<_>>();

    for token in &tokens {
        if token.normalized.is_empty() {
            issues.push(parse_issue(
                "error",
                "empty-token",
                "Token has no readable Ethra letters.",
                Some(token.raw.clone()),
            ));
            continue;
        }
        if !token.valid_phonology {
            issues.push(parse_issue(
                "error",
                "phonology",
                token.errors.join("; "),
                Some(token.raw.clone()),
            ));
        } else if !token.known {
            issues.push(parse_issue(
                "warning",
                "unknown-token",
                format!(
                    "'{}' is phonologically possible but not accepted or transparently analyzable.",
                    token.normalized
                ),
                Some(token.raw.clone()),
            ));
        }
    }

    let mut clause = ParsedClause {
        pattern: "fragment".to_string(),
        sentence_mood: Vec::new(),
        register_markers: Vec::new(),
        subject: None,
        address: None,
        particle_chain: Vec::new(),
        predicate: None,
        object: None,
        noun_phrases: Vec::new(),
        coordination: Vec::new(),
        subordinate_clauses: Vec::new(),
        complements: Vec::new(),
        scopes: Vec::new(),
    };

    let mut cursor = 0;
    while is_particle_type(
        tokens.get(cursor),
        &maps,
        &rules.particle_chain.register_types,
    ) {
        if let Some(marker) = span(&tokens, "register", cursor, cursor + 1) {
            clause.register_markers.push(marker);
        }
        cursor += 1;
    }

    if is_word(tokens.get(cursor), "ya") {
        if let Some(mood) = span(&tokens, "sentence-mood", cursor, cursor + 1) {
            clause.sentence_mood.push(mood);
        }
        clause.pattern = "question".to_string();
        cursor += 1;
    }

    if is_word(tokens.get(cursor), "ke") {
        if let Some(mood) = span(&tokens, "sentence-mood", cursor, cursor + 1) {
            clause.sentence_mood.push(mood);
        }
        clause.pattern = "imperative".to_string();
        cursor += 1;

        if is_second_person(tokens.get(cursor), &maps) {
            clause.address = span(&tokens, "address", cursor, cursor + 1);
            cursor += 1;
        }

        clause.predicate = span(&tokens, "predicate", cursor, cursor + 1);
        if clause.predicate.is_some() {
            cursor += 1;
        }
        let (object, complements, scopes) = parse_tail(&tokens, &maps, &rules, cursor);
        clause.object = object;
        clause.complements = complements;
        clause.scopes = scopes;
    } else if cursor < tokens.len() {
        let subject_start = cursor;
        cursor += 1;

        while is_word(tokens.get(cursor), "en") && cursor + 1 < tokens.len() {
            cursor += 2;
        }

        clause.subject = span(&tokens, "subject", subject_start, cursor);

        while cursor < tokens.len()
            && !is_word(tokens.get(cursor), "e")
            && is_particle_type(
                tokens.get(cursor),
                &maps,
                &rules.particle_chain.pre_predicate_types,
            )
        {
            if let Some(particle) = span(&tokens, "particle", cursor, cursor + 1) {
                clause.particle_chain.push(particle);
            }
            cursor += 1;
        }

        if is_word(tokens.get(cursor), "e") {
            if clause.pattern != "question" {
                clause.pattern = "copular".to_string();
            }
            clause.predicate = span(&tokens, "predicate", cursor, cursor + 1);
            cursor += 1;
            clause.complements = span(&tokens, "complement", cursor, tokens.len())
                .into_iter()
                .collect();
        } else if cursor < tokens.len() {
            if clause.pattern == "fragment" {
                clause.pattern = "canonical-svo".to_string();
            }
            let mut predicate_end = cursor + 1;
            if is_word(tokens.get(predicate_end), "se")
                && (predicate_end + 1 == tokens.len()
                    || is_particle_type(
                        tokens.get(predicate_end + 1),
                        &maps,
                        &rules.particle_chain.scope_types,
                    ))
            {
                predicate_end += 1;
            }
            clause.predicate = span(&tokens, "predicate", cursor, predicate_end);
            cursor = predicate_end;
            let (object, complements, scopes) = parse_tail(&tokens, &maps, &rules, cursor);
            clause.object = object;
            clause.complements = complements;
            clause.scopes = scopes;
        }
    }

    if clause.subject.is_none() && clause.pattern != "imperative" && !tokens.is_empty() {
        issues.push(parse_issue(
            "warning",
            "subject-missing",
            "No subject could be identified.",
            None,
        ));
    }

    if clause.predicate.is_none() && !tokens.is_empty() {
        issues.push(parse_issue(
            "warning",
            "predicate-missing",
            "No predicate could be identified.",
            None,
        ));
    }

    clause.noun_phrases = detect_noun_phrases(&tokens, &clause);
    clause.coordination = detect_coordination(&tokens);
    clause.subordinate_clauses = detect_subordinate_clauses(&tokens, &maps, &rules);

    let mut parser_notes = vec![rules.principle.clone()];
    parser_notes.extend(rules.parser_limits.clone());
    let valid = !issues.iter().any(|issue| issue.severity == "error");
    let confidence = confidence(&clause.pattern, &issues);

    Ok(SentenceParseReport {
        text: text.to_string(),
        valid,
        confidence,
        tokens,
        clause,
        issues,
        parser_notes,
        cultural_notes: rules.cultural_notes,
    })
}
