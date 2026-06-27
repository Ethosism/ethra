use crate::phonology::validate_word;
use anyhow::{Result, bail};
use serde::Serialize;

#[derive(Debug, Clone, Serialize)]
pub struct CompoundResult {
    pub word: String,
    pub meaning: String,
    pub morphology: String,
    pub notes: String,
}

pub fn create_compound(words: &[String], gloss: Option<&str>) -> Result<CompoundResult> {
    let clean = words
        .iter()
        .map(|word| word.trim().to_lowercase())
        .filter(|word| !word.is_empty())
        .collect::<Vec<_>>();

    if clean.len() < 2 {
        bail!("A compound needs at least two words.");
    }

    let invalid = clean
        .iter()
        .filter_map(|word| {
            let result = validate_word(word);
            (!result.valid).then(|| format!("{}: {}", word, result.errors.join("; ")))
        })
        .collect::<Vec<_>>();
    if !invalid.is_empty() {
        bail!("Invalid compound member: {}", invalid.join(" | "));
    }

    Ok(CompoundResult {
        word: clean.join("-"),
        meaning: gloss.map(ToOwned::to_owned).unwrap_or_else(|| clean.join(" + ")),
        morphology: clean.join(" + "),
        notes: "Ethra compounds keep their parts visible. The final member carries the grammatical head unless a civic definition says otherwise.".to_string(),
    })
}
