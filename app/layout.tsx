import type { Metadata } from "next";
import { Suspense } from "react";
import Script from "next/script";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import { LenisRoot } from "@/components/LenisRoot";
import LoadingScreen from "@/components/loading/LoadingScreen";
import BottomGlassNav from "@/components/navigation/BottomGlassNav";
import UtmTracker from "@/components/utm/UtmTracker";
import Analytics from "@/components/utm/Analytics";
import CompareExperience from "@/components/project-comparison/CompareExperience";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  variable: "--font-display-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://agarwalandgehlot.com"),
  title: {
    default: "A&G Realtors | Luxury Real Estate Advisory",
    template: "%s | A&G Realtors"
  },
  description:
    "A&G Realtors curates premium residential and commercial properties across Noida, Greater Noida, Gurugram, Ghaziabad and Delhi with private advisory support.",
  keywords: [
    "A&G Realtors",
    "Agarwal and Gehlot Realtors",
    "luxury real estate Noida",
    "premium projects Noida",
    "County Group projects",
    "County 107",
    "Ivory County",
    "Clove County",
    "Ivy County",
    "Jade County",
    "Cleo County",
    "Coco County",
    "luxury apartments Noida",
    "Noida Expressway property",
    "Greater Noida West projects",
    "Gurugram luxury homes",
    "Ghaziabad premium residences",
    "Delhi NCR property advisory",
    "real estate consultant Noida",
    "premium residential brokerage NCR"
  ],
  authors: [{ name: "A&G Realtors" }],
  creator: "A&G Realtors",
  publisher: "A&G Realtors",
  applicationName: "A&G Realtors",
  category: "Real Estate",
  alternates: {
    canonical: "/"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  },
  openGraph: {
    title: "A&G Realtors | Luxury Real Estate Advisory",
    description:
      "Explore A&G Realtors' curated portfolio of premium residences and landmark commercial addresses across Delhi-NCR.",
    url: "/",
    siteName: "A&G Realtors",
    images: ["/ag-logo.png"]
  },
  twitter: {
    card: "summary_large_image",
    title: "A&G Realtors | Luxury Real Estate Advisory",
    description:
      "Curated luxury real estate advisory for premium residential and commercial projects across Delhi-NCR.",
    images: ["/ag-logo.png"]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${cormorant.variable}`}>
        <Analytics />
        <Script id="json-ld" type="application/ld+json" strategy="beforeInteractive">
          {`
            {
              "@context": "https://schema.org",
              "@type": "RealEstateAgent",
              "name": "A&G Realtors",
              "image": "https://agarwalandgehlot.com/ag-logo.png",
              "url": "https://agarwalandgehlot.com",
              "telephone": "+919654322222",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Noida",
                "addressLocality": "Noida",
                "addressRegion": "UP",
                "postalCode": "201301",
                "addressCountry": "IN"
              }
            }
          `}
        </Script>
        <Suspense fallback={null}>
          <UtmTracker />
        </Suspense>
        <LenisRoot />
        <LoadingScreen />
        <CompareExperience>{children}</CompareExperience>
        <BottomGlassNav />
      </body>
    </html>
  );
}
