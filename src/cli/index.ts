#!/usr/bin/env node
import { Command } from "commander";
import { analyzeWord } from "../analyzers/analyze";
import { parseSentence } from "../analyzers/sentence";
import { styleCheck } from "../analyzers/style";
import { dictionaryStats, lookupDictionary } from "../core/dictionary";
import { flattenLexicon, loadSpec } from "../core/spec";
import { findExample } from "../core/examples";
import { createCompound } from "../generators/compound";
import { deriveWord, generateRoot } from "../generators/derivation";
import { proposeTerm } from "../generators/proposal";
import {
  corpusSummary,
  corpusExpansionPlan,
  compoundSummary,
  domainCoverageReport,
  listCompounds,
  listDomains,
  listCorpusItems,
  loadDerivationPatterns,
  loadGovernance,
  loadRoadmap,
  roadmapSummary,
  searchCorpus
} from "../core/civilization";
import { validateCompounds, validateCorpus, validateSpec } from "../core/validation";

const program = new Command();

program
  .name("ethra")
  .description("Ethra language tools")
  .version("0.6.1");

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
  .command("parse-sentence")
  .description("Parse an Ethra sentence into clause slots and token classes")
  .requiredOption("-t, --text <text>", "Ethra sentence or phrase")
  .action((options) => {
    console.log(JSON.stringify(parseSentence(options.text), null, 2));
  });

program
  .command("style-check")
  .description("Check Ethra text for phonology, known forms, moral agency, scope, and register fit")
  .requiredOption("-t, --text <text>", "Ethra sentence or phrase")
  .option("-r, --register <register>", "expected register: ritual, civic, intimate, or technical")
  .option("--require-moral-agency", "warn when no moral-agency particle appears")
  .option("--require-scope", "warn when no scope particle appears")
  .action((options) => {
    console.log(JSON.stringify(styleCheck({
      text: options.text,
      register: options.register,
      requireMoralAgency: Boolean(options.requireMoralAgency),
      requireScope: Boolean(options.requireScope)
    }), null, 2));
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
  .command("lookup-dictionary")
  .description("Lookup dictionary-grade Ethra entries with root, register, examples, and corpus evidence")
  .argument("<query>", "Ethra word, root id, English meaning, or semantic field")
  .option("-l, --limit <items>", "maximum results to return", "20")
  .option("-e, --exact", "only match exact surface word")
  .action((query, options) => {
    const limit = Number.parseInt(options.limit, 10);
    if (!Number.isFinite(limit) || limit < 0) {
      throw new Error("--limit must be a non-negative integer");
    }
    console.log(JSON.stringify(lookupDictionary({
      query,
      limit,
      exact: Boolean(options.exact)
    }), null, 2));
  });

program
  .command("dictionary-stats")
  .description("Summarize dictionary entries, sources, registers, domains, and corpus evidence")
  .option("-l, --limit <items>", "top corpus-attested entries to show", "12")
  .action((options) => {
    const limit = Number.parseInt(options.limit, 10);
    if (!Number.isFinite(limit) || limit < 0) {
      throw new Error("--limit must be a non-negative integer");
    }
    console.log(JSON.stringify(dictionaryStats(limit), null, 2));
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
  .command("propose-term")
  .description("Create a governed candidate packet for a new root or compound")
  .requiredOption("-f, --field <field>", "semantic field or proposed definition")
  .option("-k, --kind <kind>", "proposal kind: root or compound")
  .option("-d, --domain <domain>", "domain id for review")
  .option("-r, --register <register>", "intended register")
  .option("--root <root>", "override generated root consonants for root proposals")
  .option("-c, --components <components>", "comma-separated compound components")
  .option("-g, --gloss <gloss>", "intended gloss or definition")
  .option("-e, --example <example>", "example sentence or usage context")
  .action((options) => {
    if (options.kind && !["root", "compound"].includes(options.kind)) {
      throw new Error("--kind must be either 'root' or 'compound'");
    }
    console.log(JSON.stringify(proposeTerm({
      field: options.field,
      kind: options.kind,
      domain: options.domain,
      register: options.register,
      root: options.root,
      components: options.components?.split(","),
      gloss: options.gloss,
      example: options.example
    }), null, 2));
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
  .command("corpus-next")
  .description("Recommend the next reviewed corpus batch toward the active milestone")
  .option("-s, --size <items>", "requested batch size", "120")
  .option("-d, --domain-limit <domains>", "number of under-covered domains to show", "8")
  .action((options) => {
    const size = Number.parseInt(options.size, 10);
    const domainLimit = Number.parseInt(options.domainLimit, 10);
    if (!Number.isFinite(size) || size < 0) {
      throw new Error("--size must be a non-negative integer");
    }
    if (!Number.isFinite(domainLimit) || domainLimit < 0) {
      throw new Error("--domain-limit must be a non-negative integer");
    }
    console.log(JSON.stringify(corpusExpansionPlan(size, domainLimit), null, 2));
  });

program
  .command("list-corpus")
  .description("List reviewed corpus items")
  .option("-t, --track <track>", "filter by corpus track")
  .action((options) => {
    console.log(JSON.stringify(listCorpusItems(options.track), null, 2));
  });

program
  .command("search-corpus")
  .description("Search reviewed corpus items by text, track, domain, register, or term")
  .option("-q, --query <query>", "text to search across English, Ethra, literal, notes, terms, and IDs")
  .option("-t, --track <track>", "filter by corpus track")
  .option("-d, --domain <domain>", "filter by domain id")
  .option("-r, --register <register>", "filter by register")
  .option("--term <term>", "filter by accepted Ethra term")
  .option("-l, --limit <items>", "maximum results to return", "25")
  .action((options) => {
    const limit = Number.parseInt(options.limit, 10);
    if (!Number.isFinite(limit) || limit < 0) {
      throw new Error("--limit must be a non-negative integer");
    }
    console.log(JSON.stringify(searchCorpus({
      query: options.query,
      track: options.track,
      domain: options.domain,
      register: options.register,
      term: options.term,
      limit
    }), null, 2));
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
