use crate::spec::load_spec;
use anyhow::Result;
use serde::Serialize;
use std::collections::HashSet;

#[derive(Debug, Clone, Serialize)]
pub struct ValidationResult {
    pub valid: bool,
    pub errors: Vec<String>,
}

#[derive(Debug, Clone, Serialize)]
pub struct SyllableSegment {
    pub segment: String,
    pub syllables: Vec<String>,
}

#[derive(Debug, Clone, Serialize)]
pub struct SyllabificationResult {
    pub word: String,
    pub valid: bool,
    pub errors: Vec<String>,
    pub segments: Vec<SyllableSegment>,
    pub syllables: Vec<String>,
    pub primary_stress: Option<usize>,
    pub notes: Vec<String>,
}

pub fn inventory() -> Result<(HashSet<String>, HashSet<String>)> {
    let phonology = &load_spec()?.phonology;
    let vowels = phonology
        .get("vowels")
        .and_then(|value| value.as_array())
        .into_iter()
        .flatten()
        .filter_map(|item| item.get("symbol").and_then(|value| value.as_str()))
        .map(ToOwned::to_owned)
        .collect::<HashSet<_>>();
    let consonants = phonology
        .get("consonants")
        .and_then(|value| value.as_array())
        .into_iter()
        .flatten()
        .filter_map(|item| item.get("symbol").and_then(|value| value.as_str()))
        .map(ToOwned::to_owned)
        .collect::<HashSet<_>>();
    Ok((vowels, consonants))
}

pub fn validate_word(word: &str) -> ValidationResult {
    let Ok((vowels, consonants)) = inventory() else {
        return ValidationResult {
            valid: false,
            errors: vec!["phonology inventory could not be loaded".to_string()],
        };
    };
    let mut errors = Vec::new();
    let normalized = word.to_lowercase().trim().to_string();

    if normalized.is_empty() {
        return ValidationResult {
            valid: false,
            errors: vec!["word is empty".to_string()],
        };
    }

    for segment in normalized.split('-') {
        if segment.is_empty() {
            errors.push("empty hyphen segment".to_string());
            continue;
        }

        let mut previous_was_consonant = false;
        let mut has_vowel = false;

        for char_value in segment.chars() {
            let char_text = char_value.to_string();
            let is_vowel = vowels.contains(&char_text);
            let is_consonant = consonants.contains(&char_text);

            if !is_vowel && !is_consonant {
                errors.push(format!("invalid symbol '{}'", char_value));
                previous_was_consonant = false;
                continue;
            }

            if is_vowel {
                has_vowel = true;
                previous_was_consonant = false;
                continue;
            }

            if previous_was_consonant {
                errors.push(format!("consonant cluster in '{}'", segment));
            }
            previous_was_consonant = true;
        }

        if !has_vowel {
            errors.push(format!("segment '{}' has no vowel", segment));
        }
    }

    ValidationResult {
        valid: errors.is_empty(),
        errors,
    }
}

fn syllabify_segment(segment: &str, vowels: &HashSet<String>) -> Vec<String> {
    let chars = segment.chars().collect::<Vec<_>>();
    let mut syllables = Vec::new();
    let mut cursor = 0;

    while cursor < chars.len() {
        let start = cursor;
        let mut vowel_index = None;

        while cursor < chars.len() {
            if vowels.contains(&chars[cursor].to_string()) {
                vowel_index = Some(cursor);
                cursor += 1;
                break;
            }
            cursor += 1;
        }

        let Some(vowel_index) = vowel_index else {
            if start < chars.len() {
                syllables.push(chars[start..].iter().collect());
            }
            break;
        };

        if cursor < chars.len() {
            let next_is_consonant = !vowels.contains(&chars[cursor].to_string());
            let next_next_is_vowel =
                cursor + 1 < chars.len() && vowels.contains(&chars[cursor + 1].to_string());

            if next_is_consonant && !next_next_is_vowel {
                cursor += 1;
            }
        }

        syllables.push(chars[start..cursor.max(vowel_index + 1)].iter().collect());
    }

    syllables
}

pub fn syllabify_word(word: &str) -> SyllabificationResult {
    let normalized = word.to_lowercase().trim().to_string();
    let validation = validate_word(&normalized);
    let Ok((vowels, _)) = inventory() else {
        return SyllabificationResult {
            word: normalized,
            valid: false,
            errors: vec!["phonology inventory could not be loaded".to_string()],
            segments: Vec::new(),
            syllables: Vec::new(),
            primary_stress: None,
            notes: Vec::new(),
        };
    };

    let segments = normalized
        .split('-')
        .filter(|segment| !segment.is_empty())
        .map(|segment| SyllableSegment {
            segment: segment.to_string(),
            syllables: syllabify_segment(segment, &vowels),
        })
        .collect::<Vec<_>>();
    let syllables = segments
        .iter()
        .flat_map(|segment| segment.syllables.clone())
        .collect::<Vec<_>>();

    SyllabificationResult {
        word: normalized,
        valid: validation.valid,
        errors: validation.errors,
        segments,
        primary_stress: (!syllables.is_empty()).then_some(0),
        syllables,
        notes: vec![
            "Syllables follow Ethra CV, CVC, V, and VC shapes.".to_string(),
            "Hyphen boundaries remain light pronunciation boundaries.".to_string(),
            "Primary stress falls on the first syllable of the main lexical word; light prefixes such as mi-, ha-, and so- do not erase the root beat.".to_string(),
        ],
    }
}
