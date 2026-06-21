#!/usr/bin/env node
import { Command } from "commander";
import { analyzeWord } from "../analyzers/analyze";
import { flattenLexicon, loadSpec } from "../core/spec";
import { findExample } from "../core/examples";
import { createCompound } from "../generators/compound";
import { deriveWord, generateRoot } from "../generators/derivation";

const program = new Command();

program
  .name("ethra")
  .description("Ethra v0.1 language tools")
  .version("0.1.0");

program
  .command("generate-root")
  .description("Generate a candidate root for a semantic field")
  .requiredOption("-f, --field <field>", "semantic field")
  .action((options) => {
    console.log(JSON.stringify(generateRoot(options.field), null, 2));
  });

program
  .command("derive-word")
  .description("Derive a word from a root and pattern")
  .requiredOption("-r, --root <root>", "root id, form, or alias")
  .requiredOption("-p, --pattern <pattern>", "derivation pattern")
  .action((options) => {
    console.log(JSON.stringify(deriveWord(options.root, options.pattern), null, 2));
  });

program
  .command("analyze-word")
  .description("Analyze an Ethra word")
  .argument("<word>", "word to analyze")
  .action((word) => {
    console.log(JSON.stringify(analyzeWord(word), null, 2));
  });

program
  .command("translate-example")
  .description("Show one of the canonical example translations")
  .argument("<query>", "example number or English substring")
  .action((query) => {
    const example = findExample(query);
    if (!example) {
      throw new Error(`No example found for '${query}'`);
    }
    console.log(JSON.stringify(example, null, 2));
  });

program
  .command("list-roots")
  .description("List semantic roots")
  .action(() => {
    const roots = loadSpec().roots.roots.map((root) => ({
      id: root.id,
      form: root.form,
      field: root.semantic_field,
      category: root.category
    }));
    console.log(JSON.stringify(roots, null, 2));
  });

program
  .command("list-particles")
  .description("List tense, mood, moral, and register particles")
  .action(() => {
    console.log(JSON.stringify(loadSpec().particles.particles, null, 2));
  });

program
  .command("list-lexicon")
  .description("List all lexicon entries")
  .option("-c, --category <category>", "filter by category")
  .action((options) => {
    const entries = flattenLexicon().filter((entry) =>
      options.category ? entry.category?.toLowerCase() === options.category.toLowerCase() : true
    );
    console.log(JSON.stringify(entries, null, 2));
  });

program
  .command("create-compound")
  .description("Create an Ethra compound from existing words")
  .requiredOption("-w, --words <words>", "comma-separated words")
  .option("-g, --gloss <gloss>", "intended gloss")
  .action((options) => {
    console.log(JSON.stringify(createCompound(options.words.split(","), options.gloss), null, 2));
  });

program.parse();
