import type { Project } from "@/data/projects";

export type ProjectStage = "ready" | "near-possession" | "under-construction" | "new-launch";
export type ProjectPriority = "larger-homes" | "low-density" | "luxury-amenities" | "connectivity";

export type NormalizedProject = {
  source: Project;
  city: string;
  sector?: string;
  category: "Residential" | "Commercial";
  stage: ProjectStage;
  minPrice?: number;
  maxPrice?: number;
  reraNumbers: string[];
  acreage?: string;
  towers?: string;
  units?: string;
  unitSizes: string[];
  priorities: ProjectPriority[];
};

export const projectStageLabels: Record<ProjectStage, string> = {
  ready: "Ready to Move",
  "near-possession": "Near Possession",
  "under-construction": "Under Construction",
  "new-launch": "New Launch",
};

export const priorityLabels: Record<ProjectPriority, string> = {
  "larger-homes": "Larger Homes",
  "low-density": "Low Density",
  "luxury-amenities": "Luxury Amenities",
  connectivity: "Connectivity",
};

export function formatPriceCrore(value?: number) {
  if (value === undefined || !Number.isFinite(value)) return "Not available";
  const crore = value / 10_000_000;
  return `₹${crore.toLocaleString("en-IN", { maximumFractionDigits: 2 })} Cr`;
}

export function normalizeConfiguration(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

export function normalizeProjectStatus(status: string): ProjectStage {
  const value = status.toLowerCase();
  if (value.includes("new launch")) return "new-launch";
  if (value.includes("advanced")) return "near-possession";
  if (value.includes("completed") || value.includes("ready") || value.includes("possession started")) return "ready";
  return "under-construction";
}

function cityFromLocation(location: string) {
  const value = location.toLowerCase();
  if (value.includes("greater noida west")) return "Greater Noida West";
  if (value.includes("greater noida")) return "Greater Noida";
  if (value.includes("gurugram")) return "Gurugram";
  if (value.includes("ghaziabad") || value.includes("vasundhara") || value.includes("indirapuram")) return "Ghaziabad";
  if (value.includes("delhi") || value.includes("pitampura")) return "Delhi";
  if (value.includes("noida")) return "Noida";
  return location;
}

function findStatistic(project: Project, labelPatterns: RegExp[]) {
  return project.statistics.find((stat) => labelPatterns.some((pattern) => pattern.test(stat.label)))?.value;
}

function extractReraNumbers(project: Project) {
  const matches = project.fullDescription.match(
    /(?:UPRERAPRJ[A-Z0-9/]+|DLRERA\d+P\d+|RC\/REP\/HARERA\/[A-Z0-9/()]+(?:\/\d+)?)/gi
  );
  return Array.from(new Set(matches ?? [])).map((value) => value.replace(/[.,]$/, ""));
}

function getPriorities(project: Project): ProjectPriority[] {
  const text = [project.tagline, ...project.highlights.map((item) => `${item.title} ${item.description}`)].join(" ").toLowerCase();
  const amenities = project.amenities.join(" ").toLowerCase();
  const priorities: ProjectPriority[] = [];

  if (text.includes("low-density") || text.includes("low density")) priorities.push("low-density");
  if (
    project.configurations.some((item) => /(?:4|5) bhk|duplex|penthouse/i.test(item)) ||
    project.floorPlans?.some((plan) => /(?:[2-9],\d{3}|[3-9]\d{3})\s*sq/i.test(plan.size))
  ) {
    priorities.push("larger-homes");
  }
  if (/club|pool|spa|ballroom|sports|gym|wellness/.test(amenities)) priorities.push("luxury-amenities");
  if (project.connectivity.length >= 3) priorities.push("connectivity");

  return priorities;
}

export function normalizeProject(project: Project): NormalizedProject {
  const sector = project.location.match(/Sector\s+[A-Z0-9-]+/i)?.[0];
  const category = project.configurations.some((item) => /office|retail|food court|multiplex/i.test(item))
    ? "Commercial"
    : "Residential";

  return {
    source: project,
    city: cityFromLocation(project.location),
    sector,
    category,
    stage: normalizeProjectStatus(project.status),
    minPrice: project.startingPriceValue,
    maxPrice: project.maxPriceValue ?? project.startingPriceValue,
    reraNumbers: extractReraNumbers(project),
    acreage: findStatistic(project, [/approx\. land/i, /land area/i]),
    towers: findStatistic(project, [/towers/i]),
    units: findStatistic(project, [/living units/i, /residences/i, /homes/i]),
    unitSizes: project.floorPlans?.map((plan) => plan.size) ?? [],
    priorities: getPriorities(project),
  };
}

export function projectAdvisorySummary(project: Project) {
  const normalized = normalizeProject(project);
  const configuration = project.configurations.join(" & ");
  const suited = normalized.category === "Commercial"
    ? `Businesses and investors evaluating ${configuration.toLowerCase()} space in ${normalized.city}.`
    : `Buyers considering ${configuration} homes in ${normalized.city}.`;
  const strengths = project.highlights.slice(0, 2).map((item) => item.title);
  const considerations = [
    project.startingPriceValue ? undefined : "Current pricing and availability require confirmation",
    project.possession ? `Possession: ${project.possession}` : undefined,
  ].filter((item): item is string => Boolean(item));

  return { suited, strengths, considerations };
}
