import type { Metadata } from "next";
import { Suspense } from "react";
import ProjectsDiscoveryPage from "@/components/projects/ProjectsDiscoveryPage";

export const metadata: Metadata = {
  title: "Luxury Projects in Noida & Gurugram",
  description:
    "Explore A&G's curated collection of premium residential projects across Noida, Greater Noida and Gurugram.",
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

export default function ProjectsPage() {
  return (
    <Suspense fallback={null}>
      <ProjectsDiscoveryPage />
    </Suspense>
  );
}
