"use client";

import { CompareProvider } from "./CompareProvider";
import CompareBar from "./CompareBar";
import CompareSelector from "./CompareSelector";

export default function CompareExperience({ children }: { children: React.ReactNode }) {
  return (
    <CompareProvider>
      {children}
      <CompareSelector />
      <CompareBar />
    </CompareProvider>
  );
}
