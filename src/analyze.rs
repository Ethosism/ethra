use crate::phonology::validate_word;
use crate::spec::{flatten_lexicon, load_spec};
use anyhow::Result;
use serde::Serialize;
use serde_json::{Value, json};

#[derive(Debug, Clone, Serialize)]
pub struct Analysis {
    pub input: String,
    #[serde(rename = "validPhonology")]
    pub valid_phonology: bool,
    pub matches: Vec<Value>,
    pub morphology: Vec<String>,
    pub errors: Vec<String>,
}

pub fn analyze_word(input: &str) -> Result<Analysis> {
    let word = input.trim().to_lowercase();
    let validation = validate_word(&word);
    let spec = load_spec()?;
    let mut matches = Vec::new();

    for entry in flatten_lexicon(spec)
        .into_iter()
        .filter(|entry| entry.word == word)
    {
        matches.push(serde_json::to_value(entry)?);
    }
    for entry in spec
        .particles
        .particles
        .iter()
        .filter(|entry| entry.word == word)
    {
        matches.push(serde_json::to_value(entry)?);
    }
    for entry in spec
        .pronouns
        .pronouns
        .iter()
        .filter(|entry| entry.word == word)
    {
        matches.push(serde_json::to_value(entry)?);
    }

    let mut morphology = Vec::new();
    if word.contains('-') {
        morphology.push(format!(
            "compound/prefixed form: {}",
            word.replace('-', " + ")
        ));
    }

    for root in &spec.roots.roots {
        for (pattern, value) in &root.derived {
            if value.word == word {
                matches.push(json!({
                    "root": root.id,
                    "pattern": pattern,
                    "word": value.word,
                    "pronunciation": value.pronunciation,
                    "meaning": value.meaning,
                    "role": value.role,
                }));
                morphology.push(format!("{} root in {} pattern", root.id, pattern));
            }
        }
    }

    Ok(Analysis {
        input: word,
        valid_phonology: validation.valid,
        matches,
        morphology,
        errors: validation.errors,
    })
}
