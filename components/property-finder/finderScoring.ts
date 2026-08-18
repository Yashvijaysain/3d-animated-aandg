import type { Project } from "@/data/projects";
import {
  normalizeConfiguration,
  normalizeProject,
  priorityLabels,
  projectStageLabels,
  type ProjectPriority,
  type ProjectStage,
} from "@/lib/projectIntelligence";

export type FinderPurpose = "end-use" | "investment" | "both";
export type BudgetBand = "under-2" | "2-3" | "3-5" | "5-8" | "8-plus" | "flexible";

export type FinderPreferences = {
  purpose?: FinderPurpose;
  location?: string;
  budget?: BudgetBand;
  configuration?: string;
  stage?: ProjectStage | "no-preference";
  priorities: ProjectPriority[];
};

export type FinderMatch = {
  project: Project;
  score: number;
  maximumScore: number;
  percentage?: number;
  matchedCriteria: string[];
  evaluatedCriteria: number;
  exact: boolean;
};

export const budgetBands: { value: BudgetBand; label: string; min?: number; max?: number }[] = [
  { value: "under-2", label: "Under ₹2 Cr", max: 20_000_000 },
  { value: "2-3", label: "₹2–3 Cr", min: 20_000_000, max: 30_000_000 },
  { value: "3-5", label: "₹3–5 Cr", min: 30_000_000, max: 50_000_000 },
  { value: "5-8", label: "₹5–8 Cr", min: 50_000_000, max: 80_000_000 },
  { value: "8-plus", label: "₹8 Cr+", min: 80_000_000 },
  { value: "flexible", label: "Flexible" },
];

export const purposeLabels: Record<FinderPurpose, string> = {
  "end-use": "End Use",
  investment: "Investment",
  both: "Both",
};

function rangesOverlap(projectMin: number, projectMax: number, bandMin = 0, bandMax = Number.POSITIVE_INFINITY) {
  return projectMin <= bandMax && projectMax >= bandMin;
}

export function getFinderOptions(projects: Project[]) {
  const normalized = projects.map(normalizeProject);
  return {
    locations: Array.from(new Set(normalized.map((project) => project.city))).sort(),
    configurations: Array.from(new Set(projects.flatMap((project) => project.configurations))).sort((a, b) => a.localeCompare(b, undefined, { numeric: true })),
    priorities: Array.from(new Set(normalized.flatMap((project) => project.priorities))),
  };
}

export function scoreProjects(preferences: FinderPreferences, projects: Project[]): FinderMatch[] {
  return projects
    .map((project) => {
      const normalized = normalizeProject(project);
      let score = 0;
      let maximumScore = 0;
      let evaluatedCriteria = 0;
      let exact = true;
      let hasUnavailableSelectedCriterion = false;
      const matchedCriteria: string[] = [];

      if (preferences.purpose) {
        maximumScore += 10;
        evaluatedCriteria += 1;
        const purposeMatch = preferences.purpose === "both"
          || (preferences.purpose === "end-use" && normalized.category === "Residential")
          || (preferences.purpose === "investment" && normalized.category === "Commercial");
        if (purposeMatch) {
          score += 10;
          matchedCriteria.push(`${purposeLabels[preferences.purpose]} purpose`);
        } else {
          exact = false;
        }
      }

      if (preferences.location && preferences.location !== "no-preference") {
        maximumScore += 25;
        evaluatedCriteria += 1;
        if (normalized.city === preferences.location) {
          score += 25;
          matchedCriteria.push(`${preferences.location} location`);
        } else {
          exact = false;
        }
      }

      if (preferences.budget && preferences.budget !== "flexible") {
        const band = budgetBands.find((item) => item.value === preferences.budget);
        if (band && normalized.minPrice !== undefined && normalized.maxPrice !== undefined) {
          maximumScore += 25;
          evaluatedCriteria += 1;
          if (rangesOverlap(normalized.minPrice, normalized.maxPrice, band.min, band.max)) {
            score += 25;
            matchedCriteria.push(`${band.label} budget`);
          } else {
            exact = false;
          }
        } else {
          exact = false;
          hasUnavailableSelectedCriterion = true;
        }
      }

      if (preferences.configuration && preferences.configuration !== "flexible") {
        maximumScore += 20;
        evaluatedCriteria += 1;
        const wanted = normalizeConfiguration(preferences.configuration);
        if (project.configurations.some((item) => normalizeConfiguration(item) === wanted)) {
          score += 20;
          matchedCriteria.push(`${preferences.configuration} configuration`);
        } else {
          exact = false;
        }
      }

      if (preferences.stage && preferences.stage !== "no-preference") {
        maximumScore += 10;
        evaluatedCriteria += 1;
        if (normalized.stage === preferences.stage) {
          score += 10;
          matchedCriteria.push(projectStageLabels[preferences.stage]);
        } else {
          exact = false;
        }
      }

      if (preferences.priorities.length) {
        maximumScore += 10;
        evaluatedCriteria += 1;
        const matchedPriorities = preferences.priorities.filter((priority) => normalized.priorities.includes(priority));
        score += 10 * (matchedPriorities.length / preferences.priorities.length);
        matchedCriteria.push(...matchedPriorities.map((priority) => priorityLabels[priority]));
        if (matchedPriorities.length !== preferences.priorities.length) exact = false;
      }

      const percentage = maximumScore >= 40 && evaluatedCriteria >= 2 && !hasUnavailableSelectedCriterion
        ? Math.round((score / maximumScore) * 100)
        : undefined;

      return { project, score, maximumScore, percentage, matchedCriteria, evaluatedCriteria, exact };
    })
    .sort((a, b) => b.score - a.score || b.evaluatedCriteria - a.evaluatedCriteria || a.project.name.localeCompare(b.project.name));
}
