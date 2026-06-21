import { flattenLexicon, loadSpec, readSpecYaml } from "./spec";
import type {
  CompoundsSpec,
  CorpusPlanSpec,
  CorpusSpec,
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

export function loadRoadmap(): RoadmapSpec {
  return readSpecYaml<RoadmapSpec>("roadmap.yaml");
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
  const milestones = roadmap.milestones;
  const current = {
    ...roadmap.current_state,
    actual_lexicon_entries: flattenLexicon(spec).length,
    actual_root_families: spec.roots.roots.length,
    actual_corpus_items: corpus.items.length,
    actual_compound_terms: compounds.terms.length,
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

export function listCorpusItems(track?: string) {
  const items = loadCorpus().items;
  if (!track) return items;
  return items.filter((item) => item.track === track);
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
