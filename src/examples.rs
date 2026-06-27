use crate::spec::load_spec;
use crate::types::ExampleTranslation;
use anyhow::Result;

pub fn list_examples() -> Result<Vec<ExampleTranslation>> {
    Ok(load_spec()?.examples.examples.clone())
}

pub fn find_example(query: &str) -> Result<Option<ExampleTranslation>> {
    let examples = list_examples()?;
    if let Ok(number) = query.parse::<i64>() {
        return Ok(examples
            .into_iter()
            .find(|example| example.number == number));
    }
    let lowered = query.to_lowercase();
    Ok(examples
        .into_iter()
        .find(|example| example.english.to_lowercase().contains(&lowered)))
}
