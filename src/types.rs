use indexmap::IndexMap;
use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::collections::BTreeMap;

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct RootSpec {
    pub id: String,
    pub form: String,
    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    pub aliases: Vec<String>,
    pub consonants: Vec<String>,
    pub category: String,
    pub semantic_field: String,
    pub core: String,
    pub forms: BTreeMap<String, String>,
    pub derived: BTreeMap<String, DerivedForm>,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct DerivedForm {
    pub word: String,
    pub pronunciation: String,
    pub meaning: String,
    pub role: String,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct RootsSpec {
    pub roots: Vec<RootSpec>,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct ParticleSpec {
    pub word: String,
    pub pronunciation: String,
    #[serde(rename = "type")]
    pub kind: String,
    pub meaning: String,
    pub usage: String,
    pub example: String,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct ParticlesSpec {
    pub particles: Vec<ParticleSpec>,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct PronounSpec {
    pub word: String,
    pub pronunciation: String,
    pub person: String,
    pub number: String,
    pub stance: String,
    pub meaning: String,
    #[serde(rename = "use")]
    pub use_text: String,
    pub example: String,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct PronounsSpec {
    pub pronouns: Vec<PronounSpec>,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct LexiconEntry {
    pub word: String,
    pub pronunciation: String,
    pub part_of_speech: String,
    pub root: String,
    pub meaning: String,
    pub literal_etymology: String,
    pub example_sentence: String,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub category: Option<String>,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct LexiconSpec {
    pub categories: IndexMap<String, Vec<LexiconEntry>>,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct ExampleTranslation {
    pub number: i64,
    pub english: String,
    pub ethra: String,
    pub literal_translation: String,
    pub natural_translation: String,
    pub grammar_notes: String,
    pub cultural_notes: String,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct ExamplesSpec {
    pub examples: Vec<ExampleTranslation>,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct DerivationPatternSpec {
    pub id: String,
    pub label: String,
    pub role: String,
    pub surface_template: String,
    pub part_of_speech: String,
    pub semantic_function: String,
    pub register: String,
    pub example_root: String,
    pub example_word: String,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct DerivationPatternsSpec {
    pub version: String,
    pub purpose: String,
    pub principle: String,
    pub total_patterns_per_root: usize,
    pub patterns: Vec<DerivationPatternSpec>,
}

#[derive(Debug, Clone)]
pub struct EthraSpec {
    pub phonology: Value,
    pub derivation_patterns: DerivationPatternsSpec,
    pub roots: RootsSpec,
    pub particles: ParticlesSpec,
    pub pronouns: PronounsSpec,
    pub grammar: Value,
    pub lexicon: LexiconSpec,
    pub examples: ExamplesSpec,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct RoadmapMilestone {
    pub id: String,
    pub name: String,
    pub target_entries: usize,
    pub target_roots: usize,
    pub target_corpus_items: usize,
    pub objectives: Vec<String>,
    pub exit_criteria: Vec<String>,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct RoadmapCurrentState {
    pub release: String,
    pub lexicon_entries: usize,
    pub root_families: usize,
    pub corpus_items: usize,
    pub compound_terms: usize,
    pub derivation_patterns: usize,
    pub canonical_examples: usize,
    pub cli_commands: Vec<String>,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct RoadmapSpec {
    pub version: String,
    pub purpose: String,
    pub principle: String,
    pub current_state: RoadmapCurrentState,
    pub scale_targets: Value,
    pub milestones: Vec<RoadmapMilestone>,
    pub expansion_formula: Value,
    pub non_goals: Vec<String>,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct DomainSpec {
    pub id: String,
    pub name: String,
    pub target_roots_v02: usize,
    pub target_entries_v02: usize,
    pub target_entries_v10: usize,
    pub registers: Vec<String>,
    pub priority: String,
    pub required_fields: Vec<String>,
    pub moral_questions: Vec<String>,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct DomainsSpec {
    pub version: String,
    pub purpose: String,
    pub coverage_rule: String,
    pub domains: Vec<DomainSpec>,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct CorpusTrackSpec {
    pub id: String,
    pub name: String,
    pub target_items_v02: usize,
    pub target_items_v10: usize,
    pub artifact_path: String,
    pub item_shape: Vec<String>,
    pub examples: Vec<String>,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct CorpusPlanSpec {
    pub version: String,
    pub purpose: String,
    pub principle: String,
    pub corpus_tracks: Vec<CorpusTrackSpec>,
    pub quality_gates: Vec<String>,
    pub metrics: BTreeMap<String, String>,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct GovernanceSpec {
    pub version: String,
    pub purpose: String,
    pub authority_model: Value,
    pub term_lifecycle: Vec<Value>,
    pub root_admission_rules: Vec<String>,
    pub compound_admission_rules: Vec<String>,
    pub borrowing_rules: Vec<String>,
    pub grammar_change_rules: Vec<String>,
    pub review_checklist: Vec<String>,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct CorpusItem {
    pub id: String,
    pub track: String,
    pub domain_tags: Vec<String>,
    pub register: String,
    pub english: String,
    pub ethra: String,
    pub literal: String,
    pub notes: String,
    pub terms: Vec<String>,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct CorpusSpec {
    pub version: String,
    pub purpose: String,
    pub items: Vec<CorpusItem>,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
#[serde(rename_all = "lowercase")]
pub enum CompoundStatus {
    Candidate,
    Provisional,
    Accepted,
    Deprecated,
    Historical,
}

impl std::fmt::Display for CompoundStatus {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let value = match self {
            CompoundStatus::Candidate => "candidate",
            CompoundStatus::Provisional => "provisional",
            CompoundStatus::Accepted => "accepted",
            CompoundStatus::Deprecated => "deprecated",
            CompoundStatus::Historical => "historical",
        };
        f.write_str(value)
    }
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct CompoundTerm {
    pub id: String,
    pub word: String,
    pub pronunciation: String,
    pub part_of_speech: String,
    pub domain_tags: Vec<String>,
    pub register: String,
    pub status: CompoundStatus,
    pub meaning: String,
    pub literal: String,
    pub components: Vec<String>,
    pub head: String,
    pub example: String,
    pub notes: String,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct CompoundsSpec {
    pub version: String,
    pub purpose: String,
    pub terms: Vec<CompoundTerm>,
}
