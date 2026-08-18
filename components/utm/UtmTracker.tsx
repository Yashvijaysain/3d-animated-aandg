"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function UtmTracker() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const params = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
    params.forEach((param) => {
      const val = searchParams.get(param);
      if (val) {
        sessionStorage.setItem(param, val);
      }
    });

    if (!sessionStorage.getItem("referrer") && document.referrer) {
      sessionStorage.setItem("referrer", document.referrer);
    }
  }, [searchParams]);

  return null;
}
