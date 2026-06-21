#!/usr/bin/env node
import { Command } from "commander";
import { analyzeWord } from "../analyzers/analyze";
import { flattenLexicon, loadSpec } from "../core/spec";
import { findExample } from "../core/examples";
import { createCompound } from "../generators/compound";
import { deriveWord, generateRoot } from "../generators/derivation";
import {
  corpusSummary,
  compoundSummary,
  domainCoverageReport,
  listCompounds,
  listDomains,
  listCorpusItems,
  loadDerivationPatterns,
  loadGovernance,
  loadRoadmap,
  roadmapSummary
} from "../core/civilization";
import { validateCompounds, validateCorpus, validateSpec } from "../core/validation";

const program = new Command();

program
  .name("ethra")
  .description("Ethra language tools")
  .version("0.2.7");

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
  .command("list-patterns")
  .description("List productive derivation patterns")
  .action(() => {
    console.log(JSON.stringify(loadDerivationPatterns(), null, 2));
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

program
  .command("list-compounds")
  .description("List curated compound terminology")
  .option("-d, --domain <domain>", "filter by domain id")
  .option("-s, --status <status>", "filter by lifecycle status")
  .action((options) => {
    console.log(JSON.stringify(listCompounds(options.domain, options.status), null, 2));
  });

program
  .command("compound-summary")
  .description("Show curated compound terminology counts")
  .action(() => {
    console.log(JSON.stringify(compoundSummary(), null, 2));
  });

program
  .command("roadmap")
  .description("Show the civilizational-scale expansion roadmap")
  .option("-m, --milestone <id>", "show one roadmap milestone")
  .option("-s, --summary", "show current and next milestone summary")
  .action((options) => {
    if (options.summary) {
      console.log(JSON.stringify(roadmapSummary(), null, 2));
      return;
    }
    const roadmap = loadRoadmap();
    if (options.milestone) {
      const milestone = roadmap.milestones.find((item) => item.id === options.milestone);
      if (!milestone) {
        throw new Error(`No roadmap milestone '${options.milestone}'`);
      }
      console.log(JSON.stringify(milestone, null, 2));
      return;
    }
    console.log(JSON.stringify(roadmap, null, 2));
  });

program
  .command("list-domains")
  .description("List vocabulary expansion domains")
  .option("-p, --priority <priority>", "filter by priority")
  .action((options) => {
    console.log(JSON.stringify(listDomains(options.priority), null, 2));
  });

program
  .command("coverage-report")
  .description("Estimate v0.2 domain coverage gaps from the current lexicon")
  .action(() => {
    console.log(JSON.stringify(domainCoverageReport(), null, 2));
  });

program
  .command("corpus-plan")
  .description("Show corpus progress, tracks, and quality gates")
  .action(() => {
    console.log(JSON.stringify(corpusSummary(), null, 2));
  });

program
  .command("list-corpus")
  .description("List reviewed corpus items")
  .option("-t, --track <track>", "filter by corpus track")
  .action((options) => {
    console.log(JSON.stringify(listCorpusItems(options.track), null, 2));
  });

program
  .command("governance")
  .description("Show term governance and admission rules")
  .action(() => {
    console.log(JSON.stringify(loadGovernance(), null, 2));
  });

program
  .command("validate-spec")
  .description("Validate root inventory, derived forms, and reserved-word collisions")
  .action(() => {
    const report = validateSpec();
    console.log(JSON.stringify(report, null, 2));
    if (!report.valid) {
      process.exitCode = 1;
    }
  });

program
  .command("validate-corpus")
  .description("Validate corpus tracks, domains, terms, and Ethra tokens")
  .action(() => {
    const report = validateCorpus();
    console.log(JSON.stringify(report, null, 2));
    if (!report.valid) {
      process.exitCode = 1;
    }
  });

program
  .command("validate-compounds")
  .description("Validate curated compound terms, components, domains, and examples")
  .action(() => {
    const report = validateCompounds();
    console.log(JSON.stringify(report, null, 2));
    if (!report.valid) {
      process.exitCode = 1;
    }
  });

program.parse();
