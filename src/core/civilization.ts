import { flattenLexicon, loadSpec, readSpecYaml } from "./spec";
import type {
  CorpusPlanSpec,
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

export function loadGovernance(): GovernanceSpec {
  return readSpecYaml<GovernanceSpec>("governance.yaml");
}

export function roadmapSummary(): RoadmapSummary {
  const spec = loadSpec();
  const roadmap = loadRoadmap();
  const milestones = roadmap.milestones;
  return {
    current: {
      ...roadmap.current_state,
      actual_lexicon_entries: flattenLexicon(spec).length,
      actual_root_families: spec.roots.roots.length,
      actual_canonical_examples: spec.examples.examples.length
    },
    next_milestone: milestones[0],
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
  return {
    purpose: plan.purpose,
    principle: plan.principle,
    tracks: plan.corpus_tracks.map((track) => ({
      id: track.id,
      name: track.name,
      artifact_path: track.artifact_path,
      target_items_v02: track.target_items_v02,
      target_items_v10: track.target_items_v10,
      item_shape: track.item_shape
    })),
    quality_gates: plan.quality_gates
  };
}
