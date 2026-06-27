use crate::spec::load_spec;
use crate::types::RootSpec;
use anyhow::{Result, bail};
use serde::Serialize;
use std::collections::HashSet;

#[derive(Debug, Clone, Serialize)]
pub struct DerivationResult {
    pub word: String,
    pub meaning: String,
    pub morphology: String,
    pub root: RootSpec,
    pub pattern: String,
    #[serde(rename = "culturalNotes")]
    pub cultural_notes: String,
}

#[derive(Debug, Clone, Serialize)]
pub struct GeneratedRoot {
    pub root: String,
    pub rationale: String,
    pub sample: String,
}

pub fn canonical_root(input: &str) -> String {
    let vowels = HashSet::from(['A', 'E', 'I', 'O', 'U']);
    input
        .to_uppercase()
        .chars()
        .filter(|char_value| char_value.is_ascii_uppercase())
        .filter(|char_value| !vowels.contains(char_value))
        .collect()
}

pub fn find_root(input: &str) -> Result<Option<RootSpec>> {
    let wanted = canonical_root(input);
    Ok(load_spec()?.roots.roots.iter().find_map(|root| {
        let mut ids = vec![root.id.clone(), root.form.clone()];
        ids.extend(root.aliases.clone());
        let matches = ids
            .iter()
            .map(|item| canonical_root(item))
            .any(|item| item == wanted);
        matches.then(|| root.clone())
    }))
}

fn pattern_alias(pattern_input: &str) -> &str {
    match pattern_input {
        "root-verb" | "verb" => "verb",
        "noun" | "root-noun" => "noun",
        "adjective" => "adjective",
        "agent" => "agent",
        "object" => "object",
        "ritual" | "ritual-poetic" => "ritual",
        "civic" | "civic-legal" => "civic",
        "intimate" | "intimate-emotional" | "intimate-imperative" => "intimate",
        "process" | "practice" | "ongoing" => "process",
        "instrument" | "tool" => "instrument",
        "place" | "field" => "place",
        "doctrine" | "theory" => "doctrine",
        "collective" | "guild" => "collective",
        "lack" | "absence" | "negative" => "lack",
        "category" | "class" => "category",
        "discipline" | "training" => "discipline",
        "office" | "mandate" => "office",
        "record" | "archive" => "record",
        "right" | "legal-right" => "right",
        "vow" | "oath" => "vow",
        _ => pattern_input,
    }
}

pub fn derive_word(root_input: &str, pattern_input: &str) -> Result<DerivationResult> {
    let Some(root) = find_root(root_input)? else {
        bail!("Unknown root '{}'", root_input);
    };
    let pattern = pattern_alias(pattern_input).to_string();
    let Some(derived) = root.derived.get(&pattern) else {
        let patterns = root.derived.keys().cloned().collect::<Vec<_>>().join(", ");
        bail!("Unknown pattern '{}'. Try: {}", pattern_input, patterns);
    };

    let cultural_notes = if pattern_input == "intimate-imperative" {
        format!(
            "Use with ke before the word for an explicit plea or command: ke {}.",
            derived.word
        )
    } else {
        "Ethra derivation keeps the semantic family visible inside the word.".to_string()
    };

    Ok(DerivationResult {
        word: derived.word.clone(),
        meaning: derived.meaning.clone(),
        morphology: format!("{} root + {} pattern", root.id, derived.role),
        root,
        pattern,
        cultural_notes,
    })
}

pub fn generate_root(field: &str) -> GeneratedRoot {
    let consonants = "bcdfghjklmnprstvwxyz".chars().collect::<Vec<_>>();
    let cleaned = field
        .to_lowercase()
        .chars()
        .filter(|char_value| char_value.is_ascii_lowercase())
        .collect::<String>();
    let mut picked: Vec<char> = Vec::new();

    for char_value in cleaned.chars() {
        if consonants.contains(&char_value) && !picked.contains(&char_value) {
            picked.push(char_value);
        }
        if picked.len() == 3 {
            break;
        }
    }

    while picked.len() < 2 {
        let index = (cleaned.len() + picked.len() * 5) % consonants.len();
        picked.push(consonants[index]);
    }

    let root = picked.iter().collect::<String>().to_uppercase();
    let sample = picked
        .iter()
        .enumerate()
        .map(|(index, char_value)| {
            if index == picked.len() - 1 {
                char_value.to_string()
            } else {
                format!("{}a", char_value)
            }
        })
        .collect::<String>();

    GeneratedRoot {
        root,
        sample,
        rationale: format!(
            "Candidate root from prominent consonants in '{}'. Add it to spec/roots.yaml before treating it as canonical.",
            field
        ),
    }
}
