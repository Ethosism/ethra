import { flattenLexicon, loadSpec, readSpecYaml } from "./spec";
import type {
  CompoundsSpec,
  CorpusPlanSpec,
  CorpusItem,
  CorpusSpec,
  DerivationPatternsSpec,
  DomainSpec,
  DomainsSpec,
  GovernanceSpec,
  RoadmapMilestone,
  RoadmapSpec
} from "./types";

const categoryDomainMap: Record<string, string[]> = {
  "Body": ["body-health"],
  "Building/making": ["daily-life", "technology-software", "art-beauty", "economics-provision", "travel-place"],
  "Conflict/repair": ["conflict-security", "law-governance"],
  "Emotion": ["emotion-psychology"],
  "Family": ["family-kinship"],
  "Future/civilization": ["history-memory", "philosophy-metaphysics", "law-governance"],
  "Law/civic life": ["law-governance", "economics-provision", "travel-place"],
  "Love/intimacy": ["emotion-psychology", "family-kinship"],
  "Mind": ["education-training", "ai-cognition", "philosophy-metaphysics", "science-math", "travel-place"],
  "Moral agency": ["law-governance", "philosophy-metaphysics"],
  "Nature": ["nature-ecology", "travel-place", "science-math"],
  "Particles": ["daily-life"],
  "Pronouns": ["daily-life", "family-kinship"],
  "Ritual/poetry": ["ritual-spiritual", "art-beauty"],
  "Seeing/knowing": ["science-math", "philosophy-metaphysics", "emotion-psychology"],
  "Speech": ["media-communication", "law-governance", "ritual-spiritual", "art-beauty"],
  "Technology": ["technology-software", "ai-cognition", "media-communication"],
  "Time": ["history-memory", "travel-place"]
};

export interface RoadmapSummary {
  current: RoadmapSpec["current_state"] & {
    actual_lexicon_entries: number;
    actual_root_families: number;
    actual_corpus_items: number;
    actual_compound_terms: number;
    actual_derivation_patterns: number;
    actual_canonical_examples: number;
  };
  next_milestone: RoadmapMilestone;
  long_term_target: RoadmapMilestone;
  principle: string;
}

export interface DomainCoverage {
  id: string;
  name: string;
  priority: string;
  registers: string[];
  target_entries_v02: number;
  estimated_current_entries: number;
  gap_to_v02: number;
  required_fields: string[];
  moral_questions: string[];
}

export interface CorpusTrackExpansion {
  id: string;
  name: string;
  current_items: number;
  milestone_target_items: number;
  gap_to_milestone: number;
  recommended_items: number;
  next_item_ids: string[];
}

export interface CorpusDomainPressure {
  id: string;
  name: string;
  priority: string;
  current_items: number;
  target_entries_v10: number;
  pressure_score: number;
  required_fields: string[];
  moral_questions: string[];
}

export interface CorpusExpansionPlan {
  purpose: string;
  principle: string;
  milestone: Pick<RoadmapMilestone, "id" | "name" | "target_corpus_items">;
  current_items: number;
  remaining_items_to_milestone: number;
  requested_batch_size: number;
  recommended_batch_size: number;
  track_recommendations: CorpusTrackExpansion[];
  domain_pressure: CorpusDomainPressure[];
  quality_gates: string[];
}

export interface CorpusSearchOptions {
  query?: string;
  track?: string;
  domain?: string;
  register?: string;
  term?: string;
  limit?: number;
}

export interface CorpusSearchMatch {
  id: string;
  score: number;
  matched_fields: string[];
  item: CorpusItem;
}

export interface CorpusSearchReport {
  purpose: string;
  query: Required<Pick<CorpusSearchOptions, "limit">> & Omit<CorpusSearchOptions, "limit">;
  total_matches: number;
  returned_matches: number;
  matches: CorpusSearchMatch[];
}

export function loadRoadmap(): RoadmapSpec {
  return readSpecYaml<RoadmapSpec>("roadmap.yaml");
}

export function loadDerivationPatterns(): DerivationPatternsSpec {
  return readSpecYaml<DerivationPatternsSpec>("derivation-patterns.yaml");
}

export function loadDomains(): DomainsSpec {
  return readSpecYaml<DomainsSpec>("domains.yaml");
}

export function loadCorpusPlan(): CorpusPlanSpec {
  return readSpecYaml<CorpusPlanSpec>("corpus-plan.yaml");
}

export function loadCorpus(): CorpusSpec {
  return readSpecYaml<CorpusSpec>("corpus.yaml");
}

export function loadCompounds(): CompoundsSpec {
  return readSpecYaml<CompoundsSpec>("compounds.yaml");
}

export function loadGovernance(): GovernanceSpec {
  return readSpecYaml<GovernanceSpec>("governance.yaml");
}

export function roadmapSummary(): RoadmapSummary {
  const spec = loadSpec();
  const roadmap = loadRoadmap();
  const corpus = loadCorpus();
  const compounds = loadCompounds();
  const derivationPatterns = loadDerivationPatterns();
  const milestones = roadmap.milestones;
  const current = {
    ...roadmap.current_state,
    actual_lexicon_entries: flattenLexicon(spec).length,
    actual_root_families: spec.roots.roots.length,
    actual_corpus_items: corpus.items.length,
    actual_compound_terms: compounds.terms.length,
    actual_derivation_patterns: derivationPatterns.patterns.length,
    actual_canonical_examples: spec.examples.examples.length
  };
  const nextMilestone =
    milestones.find((milestone) =>
      current.actual_lexicon_entries < milestone.target_entries ||
      current.actual_root_families < milestone.target_roots ||
      current.actual_corpus_items < milestone.target_corpus_items
    ) ?? milestones[milestones.length - 1];

  return {
    current,
    next_milestone: nextMilestone,
    long_term_target: milestones[milestones.length - 1],
    principle: roadmap.principle
  };
}

export function listDomains(priority?: string): DomainSpec[] {
  const domains = loadDomains().domains;
  if (!priority) return domains;
  return domains.filter((domain) => domain.priority.toLowerCase() === priority.toLowerCase());
}

export function domainCoverageReport(): DomainCoverage[] {
  const domainEntries = new Map<string, number>();

  for (const entry of flattenLexicon()) {
    const domains = categoryDomainMap[entry.category ?? ""] ?? [];
    for (const domain of domains) {
      domainEntries.set(domain, (domainEntries.get(domain) ?? 0) + 1);
    }
  }

  return loadDomains().domains.map((domain) => {
    const current = domainEntries.get(domain.id) ?? 0;
    return {
      id: domain.id,
      name: domain.name,
      priority: domain.priority,
      registers: domain.registers,
      target_entries_v02: domain.target_entries_v02,
      estimated_current_entries: current,
      gap_to_v02: Math.max(domain.target_entries_v02 - current, 0),
      required_fields: domain.required_fields,
      moral_questions: domain.moral_questions
    };
  });
}

export function corpusSummary() {
  const plan = loadCorpusPlan();
  const corpus = loadCorpus();
  const countByTrack = new Map<string, number>();
  const countByDomain = new Map<string, number>();

  for (const item of corpus.items) {
    countByTrack.set(item.track, (countByTrack.get(item.track) ?? 0) + 1);
    for (const domain of item.domain_tags) {
      countByDomain.set(domain, (countByDomain.get(domain) ?? 0) + 1);
    }
  }

  const totalV02Target = plan.corpus_tracks.reduce((sum, track) => sum + track.target_items_v02, 0);

  return {
    purpose: plan.purpose,
    principle: plan.principle,
    seed_version: corpus.version,
    current_items: corpus.items.length,
    target_items_v02: totalV02Target,
    remaining_items_v02: Math.max(totalV02Target - corpus.items.length, 0),
    tracks: plan.corpus_tracks.map((track) => ({
      id: track.id,
      name: track.name,
      artifact_path: track.artifact_path,
      target_items_v02: track.target_items_v02,
      target_items_v10: track.target_items_v10,
      current_items: countByTrack.get(track.id) ?? 0,
      remaining_items_v02: Math.max(track.target_items_v02 - (countByTrack.get(track.id) ?? 0), 0),
      item_shape: track.item_shape
    })),
    domain_counts: Object.fromEntries([...countByDomain.entries()].sort((a, b) => a[0].localeCompare(b[0]))),
    quality_gates: plan.quality_gates
  };
}

function trackItemPrefix(trackId: string): string {
  const prefixes: Record<string, string> = {
    "daily-dialogues": "daily",
    "civic-law": "civic",
    "ritual-vow": "ritual",
    "technical-software": "tech",
    "literary-poetic": "poetic",
    "learner-graded": "learner"
  };
  return prefixes[trackId] ?? trackId.replace(/[^a-z0-9]+/g, "-");
}

function largestTrackNumber(trackId: string, corpus: CorpusSpec): number {
  const prefix = trackItemPrefix(trackId);
  let max = 0;
  for (const item of corpus.items) {
    const match = item.id.match(new RegExp(`^${prefix}-(\\d+)$`));
    if (match) {
      max = Math.max(max, Number(match[1]));
    }
  }
  return max;
}

function distributeBatch(gaps: Array<{ id: string; gap: number }>, batchSize: number): Map<string, number> {
  const allocations = new Map<string, number>();
  const positiveGaps = gaps.filter((item) => item.gap > 0);
  const totalGap = positiveGaps.reduce((sum, item) => sum + item.gap, 0);
  if (totalGap === 0 || batchSize <= 0) {
    return allocations;
  }

  const base = positiveGaps.map((item) => {
    const exact = (item.gap / totalGap) * batchSize;
    const floored = Math.min(Math.floor(exact), item.gap);
    allocations.set(item.id, floored);
    return { ...item, exact, remainder: exact - floored };
  });

  let remaining = batchSize - [...allocations.values()].reduce((sum, value) => sum + value, 0);
  const byRemainder = base.sort((a, b) => b.remainder - a.remainder || b.gap - a.gap || a.id.localeCompare(b.id));

  while (remaining > 0) {
    let changed = false;
    for (const item of byRemainder) {
      const current = allocations.get(item.id) ?? 0;
      if (current >= item.gap) continue;
      allocations.set(item.id, current + 1);
      remaining -= 1;
      changed = true;
      if (remaining === 0) break;
    }
    if (!changed) break;
  }

  return allocations;
}

export function corpusExpansionPlan(batchSize = 120, domainLimit = 8): CorpusExpansionPlan {
  const roadmap = roadmapSummary();
  const plan = loadCorpusPlan();
  const corpus = loadCorpus();
  const domains = loadDomains().domains;
  const requestedBatchSize = Number.isFinite(batchSize) && batchSize > 0 ? Math.floor(batchSize) : 0;
  const requestedDomainLimit = Number.isFinite(domainLimit) && domainLimit > 0 ? Math.floor(domainLimit) : 0;
  const currentItems = corpus.items.length;
  const remainingItems = Math.max(roadmap.next_milestone.target_corpus_items - currentItems, 0);
  const recommendedBatchSize = Math.min(requestedBatchSize, remainingItems);
  const totalTrackTarget = plan.corpus_tracks.reduce((sum, track) => sum + track.target_items_v10, 0);
  const countByTrack = new Map<string, number>();
  const countByDomain = new Map<string, number>();

  for (const item of corpus.items) {
    countByTrack.set(item.track, (countByTrack.get(item.track) ?? 0) + 1);
    for (const domain of item.domain_tags) {
      countByDomain.set(domain, (countByDomain.get(domain) ?? 0) + 1);
    }
  }

  const targetByTrack = plan.corpus_tracks.map((track) => ({
    id: track.id,
    target: Math.round((track.target_items_v10 / totalTrackTarget) * roadmap.next_milestone.target_corpus_items)
  }));
  const roundingDelta = roadmap.next_milestone.target_corpus_items - targetByTrack.reduce((sum, track) => sum + track.target, 0);
  if (roundingDelta !== 0 && targetByTrack.length > 0) {
    targetByTrack[0].target += roundingDelta;
  }

  const targetMap = new Map(targetByTrack.map((track) => [track.id, track.target]));
  const gaps = plan.corpus_tracks.map((track) => ({
    id: track.id,
    gap: Math.max((targetMap.get(track.id) ?? 0) - (countByTrack.get(track.id) ?? 0), 0)
  }));
  const allocations = distributeBatch(gaps, recommendedBatchSize);

  const domainPressure = domains
    .map((domain) => {
      const current = countByDomain.get(domain.id) ?? 0;
      const score = current / Math.max(domain.target_entries_v10, 1);
      return {
        id: domain.id,
        name: domain.name,
        priority: domain.priority,
        current_items: current,
        target_entries_v10: domain.target_entries_v10,
        pressure_score: Number(score.toFixed(4)),
        required_fields: domain.required_fields,
        moral_questions: domain.moral_questions
      };
    })
    .sort((a, b) => a.pressure_score - b.pressure_score || a.current_items - b.current_items || a.id.localeCompare(b.id))
    .slice(0, requestedDomainLimit);

  return {
    purpose: "Recommend the next reviewed corpus batch toward the active roadmap milestone.",
    principle: plan.principle,
    milestone: {
      id: roadmap.next_milestone.id,
      name: roadmap.next_milestone.name,
      target_corpus_items: roadmap.next_milestone.target_corpus_items
    },
    current_items: currentItems,
    remaining_items_to_milestone: remainingItems,
    requested_batch_size: requestedBatchSize,
    recommended_batch_size: recommendedBatchSize,
    track_recommendations: plan.corpus_tracks.map((track) => {
      const recommended = allocations.get(track.id) ?? 0;
      const start = largestTrackNumber(track.id, corpus) + 1;
      const prefix = trackItemPrefix(track.id);
      return {
        id: track.id,
        name: track.name,
        current_items: countByTrack.get(track.id) ?? 0,
        milestone_target_items: targetMap.get(track.id) ?? 0,
        gap_to_milestone: Math.max((targetMap.get(track.id) ?? 0) - (countByTrack.get(track.id) ?? 0), 0),
        recommended_items: recommended,
        next_item_ids: Array.from({ length: recommended }, (_, index) => `${prefix}-${start + index}`)
      };
    }),
    domain_pressure: domainPressure,
    quality_gates: plan.quality_gates
  };
}

export function listCorpusItems(track?: string) {
  const items = loadCorpus().items;
  if (!track) return items;
  return items.filter((item) => item.track === track);
}

function normalizeSearchText(value: string | undefined): string {
  return (value ?? "").toLowerCase().trim();
}

function searchTokens(query: string): string[] {
  return query
    .split(/[\s,]+/)
    .map((token) => token.trim())
    .filter(Boolean);
}

function scoreCorpusField(fieldValue: string, query: string, tokens: string[], weight: number): number {
  const normalized = normalizeSearchText(fieldValue);
  let score = 0;
  if (query && normalized.includes(query)) {
    score += weight * 3;
  }
  for (const token of tokens) {
    if (normalized.includes(token)) {
      score += weight;
    }
  }
  return score;
}

export function searchCorpus(options: CorpusSearchOptions = {}): CorpusSearchReport {
  const corpus = loadCorpus();
  const query = normalizeSearchText(options.query);
  const tokens = searchTokens(query);
  const track = normalizeSearchText(options.track);
  const domain = normalizeSearchText(options.domain);
  const register = normalizeSearchText(options.register);
  const term = normalizeSearchText(options.term);
  const limit = Math.max(0, Math.floor(options.limit ?? 25));
  const matches: CorpusSearchMatch[] = [];

  for (const item of corpus.items) {
    const terms = item.terms.map((value) => value.toLowerCase());
    if (track && item.track.toLowerCase() !== track) continue;
    if (domain && !item.domain_tags.some((value) => value.toLowerCase() === domain)) continue;
    if (register && item.register.toLowerCase() !== register) continue;
    if (term && !terms.includes(term)) continue;

    const fields = {
      id: item.id,
      english: item.english,
      ethra: item.ethra,
      literal: item.literal,
      notes: item.notes,
      terms: item.terms.join(" ")
    };
    const aggregate = normalizeSearchText(Object.values(fields).join(" "));
    if (query && !tokens.every((token) => aggregate.includes(token))) {
      continue;
    }

    const fieldWeights: Record<keyof typeof fields, number> = {
      id: 8,
      english: 4,
      ethra: 5,
      literal: 3,
      notes: 1,
      terms: 4
    };
    let score = 0;
    const matchedFields: string[] = [];
    for (const [field, value] of Object.entries(fields) as Array<[keyof typeof fields, string]>) {
      const fieldScore = scoreCorpusField(value, query, tokens, fieldWeights[field]);
      if (fieldScore > 0) {
        score += fieldScore;
        matchedFields.push(field);
      }
    }

    matches.push({
      id: item.id,
      score,
      matched_fields: matchedFields,
      item
    });
  }

  const sorted = matches.sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
  return {
    purpose: "Search reviewed Ethra corpus examples by text and structured metadata.",
    query: {
      query: options.query,
      track: options.track,
      domain: options.domain,
      register: options.register,
      term: options.term,
      limit
    },
    total_matches: sorted.length,
    returned_matches: Math.min(sorted.length, limit),
    matches: sorted.slice(0, limit)
  };
}

export function listCompounds(domain?: string, status?: string) {
  return loadCompounds().terms.filter((term) => {
    const domainMatches = domain ? term.domain_tags.includes(domain) : true;
    const statusMatches = status ? term.status === status : true;
    return domainMatches && statusMatches;
  });
}

export function compoundSummary() {
  const compounds = loadCompounds();
  const byDomain = new Map<string, number>();
  const byStatus = new Map<string, number>();
  const byRegister = new Map<string, number>();

  for (const term of compounds.terms) {
    byStatus.set(term.status, (byStatus.get(term.status) ?? 0) + 1);
    byRegister.set(term.register, (byRegister.get(term.register) ?? 0) + 1);
    for (const domain of term.domain_tags) {
      byDomain.set(domain, (byDomain.get(domain) ?? 0) + 1);
    }
  }

  return {
    version: compounds.version,
    purpose: compounds.purpose,
    terms: compounds.terms.length,
    accepted_terms: byStatus.get("accepted") ?? 0,
    statuses: Object.fromEntries([...byStatus.entries()].sort((a, b) => a[0].localeCompare(b[0]))),
    registers: Object.fromEntries([...byRegister.entries()].sort((a, b) => a[0].localeCompare(b[0]))),
    domain_counts: Object.fromEntries([...byDomain.entries()].sort((a, b) => a[0].localeCompare(b[0])))
  };
}
