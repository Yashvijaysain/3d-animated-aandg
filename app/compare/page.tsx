import type { Metadata } from "next";
import { Suspense } from "react";
import ComparisonPage from "@/components/project-comparison/ComparisonPage";

export const metadata: Metadata = {
  title: "Compare Projects",
  description: "Compare selected A&G real estate projects using verified published information.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/compare" },
};

export default function ComparePage() {
  return <Suspense fallback={null}><ComparisonPage /></Suspense>;
}
