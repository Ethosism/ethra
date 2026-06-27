use crate::derivation::{canonical_root, generate_root};
use crate::phonology::validate_word;
use crate::spec::{flatten_lexicon, load_spec, read_spec_yaml};
use crate::types::{CompoundTerm, CompoundsSpec, GovernanceSpec, RootSpec};
use anyhow::{Result, bail};
use serde::Serialize;
use serde_json::{Value, json};
use std::collections::HashSet;

#[derive(Debug, Clone)]
pub struct TermProposalOptions {
    pub field: String,
    pub kind: Option<String>,
    pub domain: Option<String>,
    pub register: Option<String>,
    pub root: Option<String>,
    pub components: Option<Vec<String>>,
    pub gloss: Option<String>,
    pub example: Option<String>,
}

#[derive(Debug, Clone, Serialize)]
pub struct ProposedForm {
    pub pattern: String,
    pub word: String,
    pub valid_phonology: bool,
    pub errors: Vec<String>,
    pub collision: bool,
}

#[derive(Debug, Clone, Serialize)]
pub struct ProposalGovernance {
    pub lifecycle_status: String,
    pub satisfied_requirements: Vec<String>,
    pub missing_requirements: Vec<String>,
    pub review_checklist: Vec<String>,
}

#[derive(Debug, Clone, Serialize)]
pub struct TermProposal {
    pub status: String,
    pub kind: String,
    pub field: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub domain: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub register: Option<String>,
    pub candidate: Value,
    pub governance: ProposalGovernance,
    pub warnings: Vec<String>,
    pub cultural_notes: Vec<String>,
}

const PROPOSAL_PATTERNS: [&str; 11] = [
    "verb",
    "noun",
    "adjective",
    "agent",
    "object",
    "civic",
    "ritual",
    "intimate",
    "record",
    "right",
    "vow",
];

fn interleave(consonants: &[String], vowel: &str) -> String {
    consonants
        .iter()
        .enumerate()
        .map(|(index, consonant)| {
            if index == consonants.len().saturating_sub(1) {
                consonant.clone()
            } else {
                format!("{}{}", consonant, vowel)
            }
        })
        .collect::<String>()
}

fn derive_candidate(consonants: &[String], pattern: &str) -> String {
    let base = interleave(consonants, "a");
    match pattern {
        "verb" => base,
        "noun" => interleave(consonants, "e"),
        "adjective" => interleave(consonants, "i"),
        "agent" => format!("{}en", base),
        "object" => interleave(consonants, "o"),
        "ritual" => format!("ha-{}", interleave(consonants, "u")),
        "civic" => format!("{}-da", base),
        "intimate" => format!("mi-{}", base),
        "record" => format!("{}-ket", base),
        "right" => format!("{}-ret", base),
        "vow" => format!("{}-dov", base),
        _ => base,
    }
}

fn known_words() -> Result<HashSet<String>> {
    let spec = load_spec()?;
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
    Ok(known)
}

fn root_ids(root: &RootSpec) -> Vec<String> {
    let mut ids = vec![root.id.clone(), root.form.clone()];
    ids.extend(root.aliases.clone());
    ids.iter().map(|value| canonical_root(value)).collect()
}

fn field_tokens(field: &str) -> Vec<String> {
    field
        .to_lowercase()
        .split(|char_value: char| !char_value.is_ascii_lowercase())
        .map(str::trim)
        .filter(|token| token.len() >= 4)
        .map(ToOwned::to_owned)
        .collect()
}

fn similar_roots(field: &str) -> Result<Vec<RootSpec>> {
    let tokens = field_tokens(field);
    if tokens.is_empty() {
        return Ok(Vec::new());
    }
    let mut scored = load_spec()?
        .roots
        .roots
        .iter()
        .map(|root| {
            let score = tokens
                .iter()
                .filter(|token| {
                    root.semantic_field.to_lowercase().contains(*token)
                        || root.core.to_lowercase().contains(*token)
                })
                .count();
            (root.clone(), score)
        })
        .filter(|(_, score)| *score > 0)
        .collect::<Vec<_>>();
    scored.sort_by(|(root_a, score_a), (root_b, score_b)| {
        score_b.cmp(score_a).then_with(|| root_a.id.cmp(&root_b.id))
    });
    Ok(scored.into_iter().take(8).map(|(root, _)| root).collect())
}

fn compound_terms() -> Result<Vec<CompoundTerm>> {
    Ok(read_spec_yaml::<CompoundsSpec>("compounds.yaml")?.terms)
}

fn governance(requirements: Vec<(&str, bool)>) -> Result<ProposalGovernance> {
    Ok(ProposalGovernance {
        lifecycle_status: "candidate".to_string(),
        satisfied_requirements: requirements
            .iter()
            .filter(|(_, met)| *met)
            .map(|(name, _)| (*name).to_string())
            .collect(),
        missing_requirements: requirements
            .iter()
            .filter(|(_, met)| !*met)
            .map(|(name, _)| (*name).to_string())
            .collect(),
        review_checklist: read_spec_yaml::<GovernanceSpec>("governance.yaml")?.review_checklist,
    })
}

pub fn propose_term(options: TermProposalOptions) -> Result<TermProposal> {
    let field = options.field.trim().to_string();
    if field.is_empty() {
        bail!("--field is required for a term proposal");
    }

    let kind = options.kind.clone().unwrap_or_else(|| {
        if options
            .components
            .as_ref()
            .is_some_and(|components| !components.is_empty())
        {
            "compound".to_string()
        } else {
            "root".to_string()
        }
    });
    let known = known_words()?;
    let mut warnings = Vec::new();
    let cultural_notes = vec![
        "A proposal is not an accepted Ethra term until governance review admits it.".to_string(),
        "Prefer compounds when the concept should keep its parts visible; prefer roots for durable semantic fields.".to_string(),
    ];

    if kind == "compound" {
        let components = options
            .components
            .clone()
            .unwrap_or_default()
            .into_iter()
            .map(|component| component.trim().to_lowercase())
            .filter(|component| !component.is_empty())
            .collect::<Vec<_>>();
        if components.len() < 2 {
            bail!("A compound proposal needs at least two --components values.");
        }

        let word = components.join("-");
        let phonology = validate_word(&word);
        let accepted_compound = compound_terms()?
            .into_iter()
            .find(|term| term.word.to_lowercase() == word);
        let component_reports = components
            .iter()
            .map(|component| {
                let known_component = known.contains(component);
                json!({
                    "word": component,
                    "known": known_component,
                    "valid_phonology": validate_word(component).valid,
                    "analysis": if known_component { "accepted component" } else { "not found in accepted lexicon" },
                })
            })
            .collect::<Vec<_>>();
        let unknown_components = component_reports
            .iter()
            .filter(|component| {
                !component
                    .get("known")
                    .and_then(|value| value.as_bool())
                    .unwrap_or(false)
            })
            .filter_map(|component| {
                component
                    .get("word")
                    .and_then(|value| value.as_str())
                    .map(ToOwned::to_owned)
            })
            .collect::<Vec<_>>();

        if !phonology.valid {
            warnings.push(format!(
                "Compound phonology failed: {}",
                phonology.errors.join("; ")
            ));
        }
        if let Some(existing) = &accepted_compound {
            warnings.push(format!("Compound already exists as {}.", existing.id));
        }
        if !unknown_components.is_empty() {
            warnings.push(format!(
                "Unknown compound components: {}",
                unknown_components.join(", ")
            ));
        }
        let has_domain = options.domain.is_some();
        let has_register = options.register.is_some();
        let has_definition = options
            .gloss
            .as_ref()
            .is_some_and(|value| !value.is_empty())
            || !field.is_empty();
        let has_example = options.example.is_some();
        let no_obvious_collision = accepted_compound.is_none() && unknown_components.is_empty();

        return Ok(TermProposal {
            status: "candidate".to_string(),
            kind,
            field: field.clone(),
            domain: options.domain,
            register: options.register,
            candidate: json!({
                "word": word,
                "meaning": options.gloss.clone().unwrap_or_else(|| field.clone()),
                "morphology": components.join(" + "),
                "components": component_reports,
                "valid_phonology": phonology.valid,
                "errors": phonology.errors,
                "existing_compound": accepted_compound.as_ref().map(|term| term.id.clone()),
                "example": options.example,
            }),
            governance: governance(vec![
                ("root or compound analysis", true),
                ("domain", has_domain),
                ("register", has_register),
                ("definition", has_definition),
                ("example sentence", has_example),
                ("no phonology failure", phonology.valid),
                ("no obvious collision", no_obvious_collision),
            ])?,
            warnings,
            cultural_notes,
        });
    }

    let generated = generate_root(&field);
    let root_id = canonical_root(options.root.as_deref().unwrap_or(&generated.root));
    let consonants = root_id
        .to_lowercase()
        .chars()
        .map(|char_value| char_value.to_string())
        .collect::<Vec<_>>();
    let exact_collisions = load_spec()?
        .roots
        .roots
        .iter()
        .filter(|root| root_ids(root).contains(&root_id))
        .cloned()
        .collect::<Vec<_>>();
    let related_roots = similar_roots(&field)?;
    let valid_root_shape = (2..=4).contains(&consonants.len());
    let preview = PROPOSAL_PATTERNS
        .iter()
        .map(|pattern| {
            let word = derive_candidate(&consonants, pattern);
            let phonology = validate_word(&word);
            ProposedForm {
                pattern: (*pattern).to_string(),
                word: word.clone(),
                valid_phonology: phonology.valid,
                errors: phonology.errors,
                collision: known.contains(&word.to_lowercase()),
            }
        })
        .collect::<Vec<_>>();

    if !valid_root_shape {
        warnings.push("Root proposals should use 2-4 consonants.".to_string());
    }
    if !exact_collisions.is_empty() {
        warnings.push(format!(
            "Root collides with accepted root(s): {}",
            exact_collisions
                .iter()
                .map(|root| root.id.clone())
                .collect::<Vec<_>>()
                .join(", ")
        ));
    }
    let collided_forms = preview
        .iter()
        .filter(|form| form.collision)
        .map(|form| form.word.clone())
        .collect::<Vec<_>>();
    if !collided_forms.is_empty() {
        warnings.push(format!(
            "Derived preview collides with accepted words: {}",
            collided_forms.join(", ")
        ));
    }
    if !related_roots.is_empty() {
        warnings.push(format!(
            "Review related roots before admission: {}",
            related_roots
                .iter()
                .map(|root| root.id.clone())
                .collect::<Vec<_>>()
                .join(", ")
        ));
    }

    let no_phonology_failure = preview.iter().all(|form| form.valid_phonology) && valid_root_shape;
    let no_collision = exact_collisions.is_empty() && preview.iter().all(|form| !form.collision);
    let has_domain = options.domain.is_some();
    let has_register = options.register.is_some();
    let has_definition = options
        .gloss
        .as_ref()
        .is_some_and(|value| !value.is_empty())
        || !field.is_empty();
    let has_example = options.example.is_some();

    Ok(TermProposal {
        status: "candidate".to_string(),
        kind,
        field: field.clone(),
        domain: options.domain,
        register: options.register,
        candidate: json!({
            "root": root_id,
            "alias": interleave(&consonants, "a").to_uppercase(),
            "sample": interleave(&consonants, "a"),
            "generated_from_field": generated,
            "valid_root_shape": valid_root_shape,
            "exact_collisions": exact_collisions.iter().map(|root| json!({
                "id": root.id,
                "category": root.category,
                "semantic_field": root.semantic_field,
            })).collect::<Vec<_>>(),
            "related_roots": related_roots.iter().map(|root| json!({
                "id": root.id,
                "category": root.category,
                "semantic_field": root.semantic_field,
            })).collect::<Vec<_>>(),
            "derived_preview": preview,
            "example": options.example,
        }),
        governance: governance(vec![
            ("root or compound analysis", true),
            ("domain", has_domain),
            ("register", has_register),
            ("definition", has_definition),
            ("example sentence", has_example),
            ("no phonology failure", no_phonology_failure),
            ("no obvious collision", no_collision),
        ])?,
        warnings,
        cultural_notes,
    })
}
