import type { Metadata } from "next";
import ExactScrollTransition from "@/components/transition/ExactScrollTransition";
import EditorialBridgeSection from "@/components/sections/EditorialBridgeSection";
import HorizontalProjectPin from "@/components/HorizontalProjectPin";
import ProjectsGallerySection from "@/components/sections/ProjectsGallerySection";
import WhyChooseUsSection from "@/components/sections/WhyChooseUsSection";
import OurTeamSection from "@/components/sections/OurTeamSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import ContactSection from "@/components/sections/ContactSection";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Discover A&G Realtors' curated luxury real estate portfolio, private advisory approach, project gallery, client stories and contact details.",
  keywords: [
    "A&G Realtors home",
    "Agarwal Gehlot Realtors",
    "luxury property advisory Noida",
    "premium real estate Delhi NCR",
    "A&G project gallery",
    "Noida luxury residences",
    "Gurugram premium projects"
  ],
  alternates: {
    canonical: "/home"
  },
  openGraph: {
    title: "A&G Realtors | Luxury Real Estate Advisory",
    description:
      "Explore curated premium residences, County Group projects and private property advisory across Delhi-NCR.",
    url: "/home",
    images: ["/transition/hero.png"]
  }
};

export default function HomePage() {
  return (
    <>
      <ExactScrollTransition />
      <EditorialBridgeSection />
      <HorizontalProjectPin />
      <ProjectsGallerySection />
      <WhyChooseUsSection />
      <OurTeamSection />
      <TestimonialsSection />
      <ContactSection />
    </>
  );
}
