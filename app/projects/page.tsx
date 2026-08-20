import type { Metadata } from "next";
import ProjectsDiscoveryPage from "@/components/projects/ProjectsDiscoveryPage";

export const metadata: Metadata = {
  title: {
    absolute: "Premium Projects in Noida & Gurugram | Agarwal & Gehlot Realtors"
  },
  description:
    "Explore premium residential and commercial real estate projects in Noida, Greater Noida and Gurugram with Agarwal & Gehlot Realtors.",
  keywords: [
    "luxury projects Noida",
    "premium residential projects NCR",
    "County Group projects Noida",
    "Clove County Sector 151",
    "Ivory County Sector 115",
    "County 107 Noida",
    "Ivy County Sector 75",
    "Cleo County Sector 121",
    "Coco County Greater Noida West",
    "Jade County Wave City",
    "Center Court Gurugram",
    "County Courtyard Delhi",
    "A&G Realtors projects"
  ],
  alternates: {
    canonical: "/projects"
  },
  openGraph: {
    title: "Luxury Projects in Noida & Gurugram | A&G Realtors",
    description:
      "Explore A&G's curated collection of premium residential projects across Noida, Greater Noida and Gurugram.",
    images: ["/project-details/IVORY BANNER.webp"]
  }
};

type ProjectsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const params = await searchParams;

  return (
    <ProjectsDiscoveryPage
      initialFilters={{
        location: firstParam(params.location),
        type: firstParam(params.type),
        budget: firstParam(params.budget),
        category: firstParam(params.category)
      }}
    />
  );
}
