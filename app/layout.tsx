import type { Metadata } from "next";
import "lenis/dist/lenis.css";
import "./globals.css";
import { LenisRoot } from "@/components/LenisRoot";
import LoadingScreen from "@/components/loading/LoadingScreen";
import BottomGlassNav from "@/components/navigation/BottomGlassNav";

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
    canonical: "/home"
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
    url: "/home",
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
      <body>
        <LenisRoot />
        <LoadingScreen />
        {children}
        <BottomGlassNav />
      </body>
    </html>
  );
}
