"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { projects } from "@/data/projects";
import { trackAnalyticsEvent } from "@/lib/analytics";

const STORAGE_KEY = "ag-compare-projects";
const MAX_PROJECTS = 3;
const validSlugs = new Set(projects.map((project) => project.slug));

type CompareContextValue = {
  selectedSlugs: string[];
  hydrated: boolean;
  selectorOpen: boolean;
  message: string;
  addProject: (slug: string, currentProject?: string) => boolean;
  removeProject: (slug: string, currentProject?: string) => void;
  replaceProjects: (slugs: string[]) => void;
  openSelector: (currentSlug?: string) => void;
  closeSelector: () => void;
};

const CompareContext = createContext<CompareContextValue | null>(null);

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const restoreStoredSelection = () => {
      try {
        const stored = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? "[]") as unknown;
        if (Array.isArray(stored)) {
          setSelectedSlugs(stored.filter((slug): slug is string => typeof slug === "string" && validSlugs.has(slug)).slice(0, MAX_PROJECTS));
        }
      } catch {
        sessionStorage.removeItem(STORAGE_KEY);
      }
      setHydrated(true);
    };
    const restoreTimer = window.setTimeout(restoreStoredSelection, 0);
    return () => window.clearTimeout(restoreTimer);
  }, []);

  useEffect(() => {
    if (hydrated) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(selectedSlugs));
  }, [hydrated, selectedSlugs]);

  const addProject = useCallback((slug: string, currentProject?: string) => {
    if (!validSlugs.has(slug)) return false;
    let added = false;
    setSelectedSlugs((current) => {
      if (current.includes(slug)) return current;
      if (current.length >= MAX_PROJECTS) {
        setMessage("You can compare up to 3 projects at a time. Remove one project to continue.");
        return current;
      }
      added = true;
      setMessage("");
      const next = [...current, slug];
      trackAnalyticsEvent("compare_add_project", {
        current_project: currentProject,
        selected_projects: next,
        comparison_count: next.length,
      });
      return next;
    });
    return added;
  }, []);

  const removeProject = useCallback((slug: string, currentProject?: string) => {
    setSelectedSlugs((current) => {
      const next = current.filter((item) => item !== slug);
      if (next.length !== current.length) {
        trackAnalyticsEvent("compare_remove_project", {
          current_project: currentProject,
          selected_projects: next,
          comparison_count: next.length,
        });
      }
      return next;
    });
    setMessage("");
  }, []);

  const replaceProjects = useCallback((slugs: string[]) => {
    setSelectedSlugs(Array.from(new Set(slugs.filter((slug) => validSlugs.has(slug)))).slice(0, MAX_PROJECTS));
    setMessage("");
  }, []);

  const openSelector = useCallback((currentSlug?: string) => {
    if (currentSlug) addProject(currentSlug, currentSlug);
    setSelectorOpen(true);
  }, [addProject]);

  const closeSelector = useCallback(() => setSelectorOpen(false), []);

  const value = useMemo(() => ({
    selectedSlugs,
    hydrated,
    selectorOpen,
    message,
    addProject,
    removeProject,
    replaceProjects,
    openSelector,
    closeSelector,
  }), [selectedSlugs, hydrated, selectorOpen, message, addProject, removeProject, replaceProjects, openSelector, closeSelector]);

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) throw new Error("useCompare must be used inside CompareProvider.");
  return context;
}
