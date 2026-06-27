use anyhow::{Result, bail};
use clap::{Parser, Subcommand};
use ethra_language::analyze::analyze_word;
use ethra_language::civilization::{
    CorpusSearchOptions, compound_summary, corpus_expansion_plan, corpus_summary,
    domain_coverage_report, list_compounds, list_corpus_items, list_domains,
    load_derivation_patterns, load_governance, load_roadmap, roadmap_summary, search_corpus,
};
use ethra_language::compound::create_compound;
use ethra_language::derivation::{derive_word, generate_root};
use ethra_language::dictionary::{
    DictionaryLookupOptions, dictionary_stats, export_dictionary_markdown, lookup_dictionary,
};
use ethra_language::examples::find_example;
use ethra_language::phonology::syllabify_word;
use ethra_language::proposal::{TermProposalOptions, propose_term};
use ethra_language::sentence::parse_sentence;
use ethra_language::spec::{flatten_lexicon, load_spec, read_spec_yaml};
use ethra_language::style::{StyleCheckOptions, style_check};
use ethra_language::validation::{
    validate_current_compounds, validate_current_corpus, validate_current_spec,
};
use serde::Serialize;
use serde_json::json;

#[derive(Parser)]
#[command(name = "ethra")]
#[command(version = "1.0.0")]
#[command(about = "Ethra language tools")]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    #[command(
        name = "generate-root",
        about = "Generate a candidate root for a semantic field"
    )]
    GenerateRoot {
        #[arg(short, long)]
        field: String,
    },
    #[command(name = "derive-word", about = "Derive a word from a root and pattern")]
    DeriveWord {
        #[arg(short, long)]
        root: String,
        #[arg(short, long)]
        pattern: String,
    },
    #[command(name = "analyze-word", about = "Analyze an Ethra word")]
    AnalyzeWord { word: String },
    #[command(
        name = "syllabify-word",
        about = "Split an Ethra word into phonotactic syllables"
    )]
    SyllabifyWord { word: String },
    #[command(
        name = "parse-sentence",
        about = "Parse an Ethra sentence into clause slots and token classes"
    )]
    ParseSentence {
        #[arg(short, long)]
        text: String,
    },
    #[command(
        name = "style-check",
        about = "Check Ethra text for phonology, known forms, moral agency, scope, and register fit"
    )]
    StyleCheck {
        #[arg(short, long)]
        text: String,
        #[arg(short, long)]
        register: Option<String>,
        #[arg(long)]
        require_moral_agency: bool,
        #[arg(long)]
        require_scope: bool,
    },
    #[command(
        name = "translate-example",
        about = "Show one of the canonical example translations"
    )]
    TranslateExample { query: String },
    #[command(name = "list-roots", about = "List semantic roots")]
    ListRoots,
    #[command(
        name = "list-particles",
        about = "List tense, mood, moral, and register particles"
    )]
    ListParticles,
    #[command(name = "list-patterns", about = "List productive derivation patterns")]
    ListPatterns,
    #[command(name = "list-lexicon", about = "List all lexicon entries")]
    ListLexicon {
        #[arg(short, long)]
        category: Option<String>,
    },
    #[command(
        name = "native-script",
        about = "Show the native script prototype design brief"
    )]
    NativeScript,
    #[command(
        name = "lookup-dictionary",
        about = "Lookup dictionary-grade Ethra entries with root, register, examples, and corpus evidence"
    )]
    LookupDictionary {
        query: String,
        #[arg(short, long, default_value_t = 20)]
        limit: usize,
        #[arg(short, long)]
        exact: bool,
    },
    #[command(
        name = "dictionary-stats",
        about = "Summarize dictionary entries, sources, registers, domains, and corpus evidence"
    )]
    DictionaryStats {
        #[arg(short, long, default_value_t = 12)]
        limit: usize,
    },
    #[command(
        name = "export-dictionary",
        about = "Export the accepted Ethra dictionary as human-readable Markdown files"
    )]
    ExportDictionary {
        #[arg(short, long, default_value = "dictionary")]
        output: String,
    },
    #[command(
        name = "create-compound",
        about = "Create an Ethra compound from existing words"
    )]
    CreateCompound {
        #[arg(short, long)]
        words: String,
        #[arg(short, long)]
        gloss: Option<String>,
    },
    #[command(
        name = "propose-term",
        about = "Create a governed candidate packet for a new root or compound"
    )]
    ProposeTerm {
        #[arg(short, long)]
        field: String,
        #[arg(short, long)]
        kind: Option<String>,
        #[arg(short, long)]
        domain: Option<String>,
        #[arg(short, long)]
        register: Option<String>,
        #[arg(long)]
        root: Option<String>,
        #[arg(short, long)]
        components: Option<String>,
        #[arg(short, long)]
        gloss: Option<String>,
        #[arg(short, long)]
        example: Option<String>,
    },
    #[command(name = "list-compounds", about = "List curated compound terminology")]
    ListCompounds {
        #[arg(short, long)]
        domain: Option<String>,
        #[arg(short, long)]
        status: Option<String>,
    },
    #[command(
        name = "compound-summary",
        about = "Show curated compound terminology counts"
    )]
    CompoundSummary,
    #[command(
        name = "roadmap",
        about = "Show the civilizational-scale expansion roadmap"
    )]
    Roadmap {
        #[arg(short, long)]
        milestone: Option<String>,
        #[arg(short, long)]
        summary: bool,
    },
    #[command(name = "list-domains", about = "List vocabulary expansion domains")]
    ListDomains {
        #[arg(short, long)]
        priority: Option<String>,
    },
    #[command(
        name = "coverage-report",
        about = "Estimate v0.2 domain coverage gaps from the current lexicon"
    )]
    CoverageReport,
    #[command(
        name = "corpus-plan",
        about = "Show corpus progress, tracks, and quality gates"
    )]
    CorpusPlan,
    #[command(
        name = "corpus-next",
        about = "Recommend the next reviewed corpus batch toward the active milestone"
    )]
    CorpusNext {
        #[arg(short, long, default_value_t = 120)]
        size: usize,
        #[arg(short = 'd', long, default_value_t = 8)]
        domain_limit: usize,
    },
    #[command(name = "list-corpus", about = "List reviewed corpus items")]
    ListCorpus {
        #[arg(short, long)]
        track: Option<String>,
    },
    #[command(
        name = "search-corpus",
        about = "Search reviewed corpus items by text, track, domain, register, or term"
    )]
    SearchCorpus {
        #[arg(short, long)]
        query: Option<String>,
        #[arg(short, long)]
        track: Option<String>,
        #[arg(short, long)]
        domain: Option<String>,
        #[arg(short, long)]
        register: Option<String>,
        #[arg(long)]
        term: Option<String>,
        #[arg(short, long, default_value_t = 25)]
        limit: usize,
    },
    #[command(
        name = "governance",
        about = "Show term governance and admission rules"
    )]
    Governance,
    #[command(
        name = "validate-spec",
        about = "Validate root inventory, derived forms, and reserved-word collisions"
    )]
    ValidateSpec,
    #[command(
        name = "validate-corpus",
        about = "Validate corpus tracks, domains, terms, and Ethra tokens"
    )]
    ValidateCorpus,
    #[command(
        name = "validate-compounds",
        about = "Validate curated compound terms, components, domains, and examples"
    )]
    ValidateCompounds,
}

fn print_json<T: Serialize>(value: &T) -> Result<()> {
    println!("{}", serde_json::to_string_pretty(value)?);
    Ok(())
}

fn main() -> Result<()> {
    let cli = Cli::parse();
    match cli.command {
        Commands::GenerateRoot { field } => print_json(&generate_root(&field))?,
        Commands::DeriveWord { root, pattern } => print_json(&derive_word(&root, &pattern)?)?,
        Commands::AnalyzeWord { word } => print_json(&analyze_word(&word)?)?,
        Commands::SyllabifyWord { word } => print_json(&syllabify_word(&word))?,
        Commands::ParseSentence { text } => print_json(&parse_sentence(&text)?)?,
        Commands::StyleCheck {
            text,
            register,
            require_moral_agency,
            require_scope,
        } => print_json(&style_check(StyleCheckOptions {
            text,
            register,
            require_moral_agency,
            require_scope,
        })?)?,
        Commands::TranslateExample { query } => {
            let Some(example) = find_example(&query)? else {
                bail!("No example found for '{}'", query);
            };
            print_json(&example)?;
        }
        Commands::ListRoots => {
            let roots = load_spec()?
                .roots
                .roots
                .iter()
                .map(|root| {
                    json!({
                        "id": root.id,
                        "form": root.form,
                        "field": root.semantic_field,
                        "category": root.category,
                    })
                })
                .collect::<Vec<_>>();
            print_json(&roots)?;
        }
        Commands::ListParticles => print_json(&load_spec()?.particles.particles)?,
        Commands::ListPatterns => print_json(&load_derivation_patterns()?)?,
        Commands::ListLexicon { category } => {
            let entries = flatten_lexicon(load_spec()?)
                .into_iter()
                .filter(|entry| {
                    category
                        .as_ref()
                        .map(|category| {
                            entry
                                .category
                                .as_deref()
                                .unwrap_or("")
                                .eq_ignore_ascii_case(category)
                        })
                        .unwrap_or(true)
                })
                .collect::<Vec<_>>();
            print_json(&entries)?;
        }
        Commands::NativeScript => {
            print_json(&read_spec_yaml::<serde_json::Value>("native-script.yaml")?)?
        }
        Commands::LookupDictionary {
            query,
            limit,
            exact,
        } => print_json(&lookup_dictionary(DictionaryLookupOptions {
            query,
            limit: Some(limit),
            exact,
        })?)?,
        Commands::DictionaryStats { limit } => print_json(&dictionary_stats(limit)?)?,
        Commands::ExportDictionary { output } => print_json(&export_dictionary_markdown(output)?)?,
        Commands::CreateCompound { words, gloss } => {
            let words = words.split(',').map(ToOwned::to_owned).collect::<Vec<_>>();
            print_json(&create_compound(&words, gloss.as_deref())?)?;
        }
        Commands::ProposeTerm {
            field,
            kind,
            domain,
            register,
            root,
            components,
            gloss,
            example,
        } => {
            if let Some(kind) = &kind {
                if kind != "root" && kind != "compound" {
                    bail!("--kind must be either 'root' or 'compound'");
                }
            }
            print_json(&propose_term(TermProposalOptions {
                field,
                kind,
                domain,
                register,
                root,
                components: components
                    .map(|value| value.split(',').map(ToOwned::to_owned).collect::<Vec<_>>()),
                gloss,
                example,
            })?)?;
        }
        Commands::ListCompounds { domain, status } => {
            print_json(&list_compounds(domain.as_deref(), status.as_deref())?)?
        }
        Commands::CompoundSummary => print_json(&compound_summary()?)?,
        Commands::Roadmap { milestone, summary } => {
            if summary {
                print_json(&roadmap_summary()?)?;
            } else if let Some(milestone_id) = milestone {
                let roadmap = load_roadmap()?;
                let Some(milestone) = roadmap
                    .milestones
                    .into_iter()
                    .find(|item| item.id == milestone_id)
                else {
                    bail!("No roadmap milestone '{}'", milestone_id);
                };
                print_json(&milestone)?;
            } else {
                print_json(&load_roadmap()?)?;
            }
        }
        Commands::ListDomains { priority } => print_json(&list_domains(priority.as_deref())?)?,
        Commands::CoverageReport => print_json(&domain_coverage_report()?)?,
        Commands::CorpusPlan => print_json(&corpus_summary()?)?,
        Commands::CorpusNext { size, domain_limit } => {
            print_json(&corpus_expansion_plan(size, domain_limit)?)?
        }
        Commands::ListCorpus { track } => print_json(&list_corpus_items(track.as_deref())?)?,
        Commands::SearchCorpus {
            query,
            track,
            domain,
            register,
            term,
            limit,
        } => print_json(&search_corpus(CorpusSearchOptions {
            query,
            track,
            domain,
            register,
            term,
            limit: Some(limit),
        })?)?,
        Commands::Governance => print_json(&load_governance()?)?,
        Commands::ValidateSpec => {
            let report = validate_current_spec()?;
            let valid = report.valid;
            print_json(&report)?;
            if !valid {
                std::process::exit(1);
            }
        }
        Commands::ValidateCorpus => {
            let report = validate_current_corpus()?;
            let valid = report.valid;
            print_json(&report)?;
            if !valid {
                std::process::exit(1);
            }
        }
        Commands::ValidateCompounds => {
            let report = validate_current_compounds()?;
            let valid = report.valid;
            print_json(&report)?;
            if !valid {
                std::process::exit(1);
            }
        }
    }
    Ok(())
}
