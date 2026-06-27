use crate::types::{
    DerivationPatternsSpec, EthraSpec, ExamplesSpec, LexiconEntry, LexiconSpec, ParticlesSpec,
    PronounsSpec, RootsSpec,
};
use anyhow::{Context, Result};
use once_cell::sync::OnceCell;
use serde::de::DeserializeOwned;
use serde_json::Value;
use std::env;
use std::fs;
use std::path::{Path, PathBuf};

static SPEC_CACHE: OnceCell<EthraSpec> = OnceCell::new();

pub fn spec_dir() -> PathBuf {
    if let Ok(dir) = env::var("ETHRA_SPEC_DIR") {
        return PathBuf::from(dir);
    }

    let cwd_spec = env::current_dir()
        .unwrap_or_else(|_| PathBuf::from("."))
        .join("spec");
    if cwd_spec.exists() {
        return cwd_spec;
    }

    if let Ok(exe) = env::current_exe() {
        if let Some(parent) = exe.parent() {
            let nearby = parent.join("spec");
            if nearby.exists() {
                return nearby;
            }
        }
    }

    PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("spec")
}

pub fn read_spec_yaml<T: DeserializeOwned>(filename: &str) -> Result<T> {
    read_yaml_file(spec_dir().join(filename))
}

pub fn read_yaml_file<T: DeserializeOwned>(path: impl AsRef<Path>) -> Result<T> {
    let path = path.as_ref();
    let text =
        fs::read_to_string(path).with_context(|| format!("failed to read {}", path.display()))?;
    serde_yaml::from_str(&text).with_context(|| format!("failed to parse {}", path.display()))
}

fn load_spec_inner() -> Result<EthraSpec> {
    Ok(EthraSpec {
        phonology: read_spec_yaml::<Value>("phonology.yaml")?,
        derivation_patterns: read_spec_yaml::<DerivationPatternsSpec>("derivation-patterns.yaml")?,
        roots: read_spec_yaml::<RootsSpec>("roots.yaml")?,
        particles: read_spec_yaml::<ParticlesSpec>("particles.yaml")?,
        pronouns: read_spec_yaml::<PronounsSpec>("pronouns.yaml")?,
        grammar: read_spec_yaml::<Value>("grammar.yaml")?,
        lexicon: read_spec_yaml::<LexiconSpec>("lexicon.yaml")?,
        examples: read_spec_yaml::<ExamplesSpec>("examples.yaml")?,
    })
}

pub fn load_spec() -> Result<&'static EthraSpec> {
    SPEC_CACHE.get_or_try_init(load_spec_inner)
}

pub fn flatten_lexicon(spec: &EthraSpec) -> Vec<LexiconEntry> {
    let mut entries = Vec::new();
    for (category, category_entries) in &spec.lexicon.categories {
        for entry in category_entries {
            let mut entry = entry.clone();
            entry.category = Some(category.clone());
            entries.push(entry);
        }
    }
    entries
}
