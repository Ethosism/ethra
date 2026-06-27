use crate::dictionary::category_domains_for_coverage;
use crate::spec::{flatten_lexicon, load_spec, read_spec_yaml};
use crate::types::{
    CompoundTerm, CompoundsSpec, CorpusItem, CorpusPlanSpec, CorpusSpec, DerivationPatternsSpec,
    DomainSpec, DomainsSpec, GovernanceSpec, RoadmapCurrentState, RoadmapMilestone, RoadmapSpec,
};
use anyhow::Result;
use serde::Serialize;
use serde_json::{Value, json};
use std::collections::{BTreeMap, HashMap};

#[derive(Debug, Clone, Serialize)]
pub struct RoadmapCurrentProgress {
    pub release: String,
    pub lexicon_entries: usize,
    pub root_families: usize,
    pub corpus_items: usize,
    pub compound_terms: usize,
    pub derivation_patterns: usize,
    pub canonical_examples: usize,
    pub cli_commands: Vec<String>,
    pub actual_lexicon_entries: usize,
    pub actual_root_families: usize,
    pub actual_corpus_items: usize,
    pub actual_compound_terms: usize,
    pub actual_derivation_patterns: usize,
    pub actual_canonical_examples: usize,
}

#[derive(Debug, Clone, Serialize)]
pub struct RoadmapSummary {
    pub current: RoadmapCurrentProgress,
    pub next_milestone: RoadmapMilestone,
    pub long_term_target: RoadmapMilestone,
    pub principle: String,
}

#[derive(Debug, Clone, Serialize)]
pub struct DomainCoverage {
    pub id: String,
    pub name: String,
    pub priority: String,
    pub registers: Vec<String>,
    pub target_entries_v02: usize,
    pub estimated_current_entries: usize,
    pub gap_to_v02: usize,
    pub required_fields: Vec<String>,
    pub moral_questions: Vec<String>,
}

#[derive(Debug, Clone, Serialize)]
pub struct CorpusTrackExpansion {
    pub id: String,
    pub name: String,
    pub current_items: usize,
    pub milestone_target_items: usize,
    pub gap_to_milestone: usize,
    pub recommended_items: usize,
    pub next_item_ids: Vec<String>,
}

#[derive(Debug, Clone, Serialize)]
pub struct CorpusDomainPressure {
    pub id: String,
    pub name: String,
    pub priority: String,
    pub current_items: usize,
    pub target_entries_v10: usize,
    pub pressure_score: f64,
    pub required_fields: Vec<String>,
    pub moral_questions: Vec<String>,
}

#[derive(Debug, Clone, Serialize)]
pub struct CorpusExpansionMilestone {
    pub id: String,
    pub name: String,
    pub target_corpus_items: usize,
}

#[derive(Debug, Clone, Serialize)]
pub struct CorpusExpansionPlan {
    pub purpose: String,
    pub principle: String,
    pub milestone: CorpusExpansionMilestone,
    pub current_items: usize,
    pub remaining_items_to_milestone: usize,
    pub requested_batch_size: usize,
    pub recommended_batch_size: usize,
    pub track_recommendations: Vec<CorpusTrackExpansion>,
    pub domain_pressure: Vec<CorpusDomainPressure>,
    pub quality_gates: Vec<String>,
}

#[derive(Debug, Clone, Default)]
pub struct CorpusSearchOptions {
    pub query: Option<String>,
    pub track: Option<String>,
    pub domain: Option<String>,
    pub register: Option<String>,
    pub term: Option<String>,
    pub limit: Option<usize>,
}

#[derive(Debug, Clone, Serialize)]
pub struct CorpusSearchQuery {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub query: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub track: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub domain: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub register: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub term: Option<String>,
    pub limit: usize,
}

#[derive(Debug, Clone, Serialize)]
pub struct CorpusSearchMatch {
    pub id: String,
    pub score: usize,
    pub matched_fields: Vec<String>,
    pub item: CorpusItem,
}

#[derive(Debug, Clone, Serialize)]
pub struct CorpusSearchReport {
    pub purpose: String,
    pub query: CorpusSearchQuery,
    pub total_matches: usize,
    pub returned_matches: usize,
    pub matches: Vec<CorpusSearchMatch>,
}

pub fn load_roadmap() -> Result<RoadmapSpec> {
    read_spec_yaml("roadmap.yaml")
}

pub fn load_derivation_patterns() -> Result<DerivationPatternsSpec> {
    read_spec_yaml("derivation-patterns.yaml")
}

pub fn load_domains() -> Result<DomainsSpec> {
    read_spec_yaml("domains.yaml")
}

pub fn load_corpus_plan() -> Result<CorpusPlanSpec> {
    read_spec_yaml("corpus-plan.yaml")
}

pub fn load_corpus() -> Result<CorpusSpec> {
    read_spec_yaml("corpus.yaml")
}

pub fn load_compounds() -> Result<CompoundsSpec> {
    read_spec_yaml("compounds.yaml")
}

pub fn load_governance() -> Result<GovernanceSpec> {
    read_spec_yaml("governance.yaml")
}

fn progress_from_current(
    current_state: RoadmapCurrentState,
    actual_lexicon_entries: usize,
    actual_root_families: usize,
    actual_corpus_items: usize,
    actual_compound_terms: usize,
    actual_derivation_patterns: usize,
    actual_canonical_examples: usize,
) -> RoadmapCurrentProgress {
    RoadmapCurrentProgress {
        release: current_state.release,
        lexicon_entries: current_state.lexicon_entries,
        root_families: current_state.root_families,
        corpus_items: current_state.corpus_items,
        compound_terms: current_state.compound_terms,
        derivation_patterns: current_state.derivation_patterns,
        canonical_examples: current_state.canonical_examples,
        cli_commands: current_state.cli_commands,
        actual_lexicon_entries,
        actual_root_families,
        actual_corpus_items,
        actual_compound_terms,
        actual_derivation_patterns,
        actual_canonical_examples,
    }
}

pub fn roadmap_summary() -> Result<RoadmapSummary> {
    let spec = load_spec()?;
    let roadmap = load_roadmap()?;
    let corpus = load_corpus()?;
    let compounds = load_compounds()?;
    let derivation_patterns = load_derivation_patterns()?;
    let current = progress_from_current(
        roadmap.current_state.clone(),
        flatten_lexicon(spec).len(),
        spec.roots.roots.len(),
        corpus.items.len(),
        compounds.terms.len(),
        derivation_patterns.patterns.len(),
        spec.examples.examples.len(),
    );
    let next_milestone = roadmap
        .milestones
        .iter()
        .find(|milestone| {
            current.actual_lexicon_entries < milestone.target_entries
                || current.actual_root_families < milestone.target_roots
                || current.actual_corpus_items < milestone.target_corpus_items
        })
        .cloned()
        .or_else(|| roadmap.milestones.last().cloned())
        .unwrap();
    let long_term_target = roadmap.milestones.last().cloned().unwrap();

    Ok(RoadmapSummary {
        current,
        next_milestone,
        long_term_target,
        principle: roadmap.principle,
    })
}

pub fn list_domains(priority: Option<&str>) -> Result<Vec<DomainSpec>> {
    let domains = load_domains()?.domains;
    Ok(match priority {
        Some(priority) => domains
            .into_iter()
            .filter(|domain| domain.priority.to_lowercase() == priority.to_lowercase())
            .collect(),
        None => domains,
    })
}

pub fn domain_coverage_report() -> Result<Vec<DomainCoverage>> {
    let mut domain_entries: HashMap<String, usize> = HashMap::new();
    for entry in flatten_lexicon(load_spec()?) {
        for domain in category_domains_for_coverage(entry.category.as_deref()) {
            *domain_entries.entry(domain).or_default() += 1;
        }
    }

    Ok(load_domains()?
        .domains
        .into_iter()
        .map(|domain| {
            let current = domain_entries.get(&domain.id).copied().unwrap_or(0);
            DomainCoverage {
                id: domain.id,
                name: domain.name,
                priority: domain.priority,
                registers: domain.registers,
                target_entries_v02: domain.target_entries_v02,
                estimated_current_entries: current,
                gap_to_v02: domain.target_entries_v02.saturating_sub(current),
                required_fields: domain.required_fields,
                moral_questions: domain.moral_questions,
            }
        })
        .collect())
}

pub fn corpus_summary() -> Result<Value> {
    let plan = load_corpus_plan()?;
    let corpus = load_corpus()?;
    let mut count_by_track: HashMap<String, usize> = HashMap::new();
    let mut count_by_domain: BTreeMap<String, usize> = BTreeMap::new();

    for item in &corpus.items {
        *count_by_track.entry(item.track.clone()).or_default() += 1;
        for domain in &item.domain_tags {
            *count_by_domain.entry(domain.clone()).or_default() += 1;
        }
    }

    let total_v02_target = plan
        .corpus_tracks
        .iter()
        .map(|track| track.target_items_v02)
        .sum::<usize>();

    Ok(json!({
        "purpose": plan.purpose,
        "principle": plan.principle,
        "seed_version": corpus.version,
        "current_items": corpus.items.len(),
        "target_items_v02": total_v02_target,
        "remaining_items_v02": total_v02_target.saturating_sub(corpus.items.len()),
        "tracks": plan.corpus_tracks.into_iter().map(|track| {
            let current = count_by_track.get(&track.id).copied().unwrap_or(0);
            json!({
                "id": track.id,
                "name": track.name,
                "artifact_path": track.artifact_path,
                "target_items_v02": track.target_items_v02,
                "target_items_v10": track.target_items_v10,
                "current_items": current,
                "remaining_items_v02": track.target_items_v02.saturating_sub(current),
                "item_shape": track.item_shape,
            })
        }).collect::<Vec<_>>(),
        "domain_counts": count_by_domain,
        "quality_gates": plan.quality_gates,
    }))
}

fn track_item_prefix(track_id: &str) -> String {
    match track_id {
        "daily-dialogues" => "daily",
        "civic-law" => "civic",
        "ritual-vow" => "ritual",
        "technical-software" => "tech",
        "literary-poetic" => "poetic",
        "learner-graded" => "learner",
        _ => {
            return track_id.replace(
                |char_value: char| !char_value.is_ascii_lowercase() && !char_value.is_ascii_digit(),
                "-",
            );
        }
    }
    .to_string()
}

fn largest_track_number(track_id: &str, corpus: &CorpusSpec) -> usize {
    let prefix = track_item_prefix(track_id);
    let expected_prefix = format!("{}-", prefix);
    corpus
        .items
        .iter()
        .filter_map(|item| {
            item.id
                .strip_prefix(&expected_prefix)
                .and_then(|number| number.parse::<usize>().ok())
        })
        .max()
        .unwrap_or(0)
}

fn distribute_batch(gaps: Vec<(String, usize)>, batch_size: usize) -> HashMap<String, usize> {
    let mut allocations = HashMap::new();
    let positive_gaps = gaps
        .into_iter()
        .filter(|(_, gap)| *gap > 0)
        .collect::<Vec<_>>();
    let total_gap = positive_gaps.iter().map(|(_, gap)| *gap).sum::<usize>();
    if total_gap == 0 || batch_size == 0 {
        return allocations;
    }

    #[derive(Debug)]
    struct Base {
        id: String,
        gap: usize,
        remainder: f64,
    }

    let mut base = positive_gaps
        .into_iter()
        .map(|(id, gap)| {
            let exact = gap as f64 / total_gap as f64 * batch_size as f64;
            let floored = (exact.floor() as usize).min(gap);
            allocations.insert(id.clone(), floored);
            Base {
                id,
                gap,
                remainder: exact - floored as f64,
            }
        })
        .collect::<Vec<_>>();

    let mut remaining = batch_size.saturating_sub(allocations.values().sum::<usize>());
    base.sort_by(|a, b| {
        b.remainder
            .partial_cmp(&a.remainder)
            .unwrap()
            .then_with(|| b.gap.cmp(&a.gap))
            .then_with(|| a.id.cmp(&b.id))
    });

    while remaining > 0 {
        let mut changed = false;
        for item in &base {
            let current = allocations.get(&item.id).copied().unwrap_or(0);
            if current >= item.gap {
                continue;
            }
            allocations.insert(item.id.clone(), current + 1);
            remaining -= 1;
            changed = true;
            if remaining == 0 {
                break;
            }
        }
        if !changed {
            break;
        }
    }

    allocations
}

pub fn corpus_expansion_plan(
    batch_size: usize,
    domain_limit: usize,
) -> Result<CorpusExpansionPlan> {
    let roadmap = roadmap_summary()?;
    let plan = load_corpus_plan()?;
    let corpus = load_corpus()?;
    let domains = load_domains()?.domains;
    let requested_batch_size = batch_size;
    let requested_domain_limit = domain_limit;
    let current_items = corpus.items.len();
    let remaining_items = roadmap
        .next_milestone
        .target_corpus_items
        .saturating_sub(current_items);
    let recommended_batch_size = requested_batch_size.min(remaining_items);
    let total_track_target = plan
        .corpus_tracks
        .iter()
        .map(|track| track.target_items_v10)
        .sum::<usize>();
    let mut count_by_track: HashMap<String, usize> = HashMap::new();
    let mut count_by_domain: HashMap<String, usize> = HashMap::new();

    for item in &corpus.items {
        *count_by_track.entry(item.track.clone()).or_default() += 1;
        for domain in &item.domain_tags {
            *count_by_domain.entry(domain.clone()).or_default() += 1;
        }
    }

    let mut target_by_track = plan
        .corpus_tracks
        .iter()
        .map(|track| {
            let target = ((track.target_items_v10 as f64 / total_track_target as f64)
                * roadmap.next_milestone.target_corpus_items as f64)
                .round() as isize;
            (track.id.clone(), target)
        })
        .collect::<Vec<_>>();
    let target_sum = target_by_track
        .iter()
        .map(|(_, target)| *target)
        .sum::<isize>();
    let rounding_delta = roadmap.next_milestone.target_corpus_items as isize - target_sum;
    if rounding_delta != 0 && !target_by_track.is_empty() {
        target_by_track[0].1 += rounding_delta;
    }
    let target_map = target_by_track
        .into_iter()
        .map(|(id, target)| (id, target.max(0) as usize))
        .collect::<HashMap<_, _>>();
    let gaps = plan
        .corpus_tracks
        .iter()
        .map(|track| {
            let gap = target_map
                .get(&track.id)
                .copied()
                .unwrap_or(0)
                .saturating_sub(count_by_track.get(&track.id).copied().unwrap_or(0));
            (track.id.clone(), gap)
        })
        .collect::<Vec<_>>();
    let allocations = distribute_batch(gaps, recommended_batch_size);

    let mut domain_pressure = domains
        .into_iter()
        .map(|domain| {
            let current = count_by_domain.get(&domain.id).copied().unwrap_or(0);
            let score = current as f64 / domain.target_entries_v10.max(1) as f64;
            CorpusDomainPressure {
                id: domain.id,
                name: domain.name,
                priority: domain.priority,
                current_items: current,
                target_entries_v10: domain.target_entries_v10,
                pressure_score: (score * 10000.0).round() / 10000.0,
                required_fields: domain.required_fields,
                moral_questions: domain.moral_questions,
            }
        })
        .collect::<Vec<_>>();
    domain_pressure.sort_by(|a, b| {
        a.pressure_score
            .partial_cmp(&b.pressure_score)
            .unwrap()
            .then_with(|| a.current_items.cmp(&b.current_items))
            .then_with(|| a.id.cmp(&b.id))
    });
    domain_pressure.truncate(requested_domain_limit);

    Ok(CorpusExpansionPlan {
        purpose: "Recommend the next reviewed corpus batch toward the active roadmap milestone."
            .to_string(),
        principle: plan.principle.clone(),
        milestone: CorpusExpansionMilestone {
            id: roadmap.next_milestone.id,
            name: roadmap.next_milestone.name,
            target_corpus_items: roadmap.next_milestone.target_corpus_items,
        },
        current_items,
        remaining_items_to_milestone: remaining_items,
        requested_batch_size,
        recommended_batch_size,
        track_recommendations: plan
            .corpus_tracks
            .iter()
            .map(|track| {
                let recommended = allocations.get(&track.id).copied().unwrap_or(0);
                let start = largest_track_number(&track.id, &corpus) + 1;
                let prefix = track_item_prefix(&track.id);
                CorpusTrackExpansion {
                    id: track.id.clone(),
                    name: track.name.clone(),
                    current_items: count_by_track.get(&track.id).copied().unwrap_or(0),
                    milestone_target_items: target_map.get(&track.id).copied().unwrap_or(0),
                    gap_to_milestone: target_map
                        .get(&track.id)
                        .copied()
                        .unwrap_or(0)
                        .saturating_sub(count_by_track.get(&track.id).copied().unwrap_or(0)),
                    recommended_items: recommended,
                    next_item_ids: (0..recommended)
                        .map(|index| format!("{}-{}", prefix, start + index))
                        .collect(),
                }
            })
            .collect(),
        domain_pressure,
        quality_gates: plan.quality_gates,
    })
}

pub fn list_corpus_items(track: Option<&str>) -> Result<Vec<CorpusItem>> {
    let items = load_corpus()?.items;
    Ok(match track {
        Some(track) => items
            .into_iter()
            .filter(|item| item.track == track)
            .collect(),
        None => items,
    })
}

fn normalize_search_text(value: Option<&str>) -> String {
    value.unwrap_or("").to_lowercase().trim().to_string()
}

fn search_tokens(query: &str) -> Vec<String> {
    query
        .split(|char_value: char| char_value.is_whitespace() || char_value == ',')
        .map(str::trim)
        .filter(|token| !token.is_empty())
        .map(ToOwned::to_owned)
        .collect()
}

fn score_corpus_field(field_value: &str, query: &str, tokens: &[String], weight: usize) -> usize {
    let normalized = normalize_search_text(Some(field_value));
    let mut score = 0;
    if !query.is_empty() && normalized.contains(query) {
        score += weight * 3;
    }
    for token in tokens {
        if normalized.contains(token) {
            score += weight;
        }
    }
    score
}

pub fn search_corpus(options: CorpusSearchOptions) -> Result<CorpusSearchReport> {
    let corpus = load_corpus()?;
    let query = normalize_search_text(options.query.as_deref());
    let tokens = search_tokens(&query);
    let track = normalize_search_text(options.track.as_deref());
    let domain = normalize_search_text(options.domain.as_deref());
    let register = normalize_search_text(options.register.as_deref());
    let term = normalize_search_text(options.term.as_deref());
    let limit = options.limit.unwrap_or(25);
    let mut matches = Vec::new();

    for item in corpus.items {
        let terms = item
            .terms
            .iter()
            .map(|value| value.to_lowercase())
            .collect::<Vec<_>>();
        if !track.is_empty() && item.track.to_lowercase() != track {
            continue;
        }
        if !domain.is_empty()
            && !item
                .domain_tags
                .iter()
                .any(|value| value.to_lowercase() == domain)
        {
            continue;
        }
        if !register.is_empty() && item.register.to_lowercase() != register {
            continue;
        }
        if !term.is_empty() && !terms.contains(&term) {
            continue;
        }

        let fields = [
            ("id", item.id.clone(), 8usize),
            ("english", item.english.clone(), 4usize),
            ("ethra", item.ethra.clone(), 5usize),
            ("literal", item.literal.clone(), 3usize),
            ("notes", item.notes.clone(), 1usize),
            ("terms", item.terms.join(" "), 4usize),
        ];
        let aggregate = normalize_search_text(Some(
            &fields
                .iter()
                .map(|(_, value, _)| value.as_str())
                .collect::<Vec<_>>()
                .join(" "),
        ));
        if !query.is_empty() && !tokens.iter().all(|token| aggregate.contains(token)) {
            continue;
        }

        let mut score = 0;
        let mut matched_fields = Vec::new();
        for (field, value, weight) in fields {
            let field_score = score_corpus_field(&value, &query, &tokens, weight);
            if field_score > 0 {
                score += field_score;
                matched_fields.push(field.to_string());
            }
        }

        matches.push(CorpusSearchMatch {
            id: item.id.clone(),
            score,
            matched_fields,
            item,
        });
    }

    matches.sort_by(|a, b| b.score.cmp(&a.score).then_with(|| a.id.cmp(&b.id)));
    Ok(CorpusSearchReport {
        purpose: "Search reviewed Ethra corpus examples by text and structured metadata."
            .to_string(),
        query: CorpusSearchQuery {
            query: options.query,
            track: options.track,
            domain: options.domain,
            register: options.register,
            term: options.term,
            limit,
        },
        total_matches: matches.len(),
        returned_matches: matches.len().min(limit),
        matches: matches.into_iter().take(limit).collect(),
    })
}

pub fn list_compounds(domain: Option<&str>, status: Option<&str>) -> Result<Vec<CompoundTerm>> {
    Ok(load_compounds()?
        .terms
        .into_iter()
        .filter(|term| {
            domain
                .map(|domain| term.domain_tags.iter().any(|item| item == domain))
                .unwrap_or(true)
                && status
                    .map(|status| term.status.to_string() == status)
                    .unwrap_or(true)
        })
        .collect())
}

pub fn compound_summary() -> Result<Value> {
    let compounds = load_compounds()?;
    let mut by_domain: BTreeMap<String, usize> = BTreeMap::new();
    let mut by_status: BTreeMap<String, usize> = BTreeMap::new();
    let mut by_register: BTreeMap<String, usize> = BTreeMap::new();

    for term in &compounds.terms {
        *by_status.entry(term.status.to_string()).or_default() += 1;
        *by_register.entry(term.register.clone()).or_default() += 1;
        for domain in &term.domain_tags {
            *by_domain.entry(domain.clone()).or_default() += 1;
        }
    }

    Ok(json!({
        "version": compounds.version,
        "purpose": compounds.purpose,
        "terms": compounds.terms.len(),
        "accepted_terms": by_status.get("accepted").copied().unwrap_or(0),
        "statuses": by_status,
        "registers": by_register,
        "domain_counts": by_domain,
    }))
}
