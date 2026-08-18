"use client";

type AnalyticsValue = string | number | boolean | string[] | undefined;

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (command: "event", eventName: string, parameters?: Record<string, AnalyticsValue>) => void;
  }
}

export function trackAnalyticsEvent(
  eventName: string,
  parameters: Record<string, AnalyticsValue> = {}
) {
  if (typeof window === "undefined") return;

  if (window.gtag) {
    window.gtag("event", eventName, parameters);
    return;
  }

  window.dataLayer?.push({ event: eventName, ...parameters });
}
