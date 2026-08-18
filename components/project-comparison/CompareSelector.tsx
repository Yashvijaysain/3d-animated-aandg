"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { projects } from "@/data/projects";
import { normalizeProject } from "@/lib/projectIntelligence";
import { trackAnalyticsEvent } from "@/lib/analytics";
import { useCompare } from "./CompareProvider";
import styles from "./ProjectComparison.module.css";

export default function CompareSelector() {
  const { selectorOpen, closeSelector, selectedSlugs, addProject, removeProject, message } = useCompare();
  const [search, setSearch] = useState("");
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return projects;
    return projects.filter((project) => {
      const normalized = normalizeProject(project);
      return [project.name, project.developer, project.location, normalized.city, normalized.sector]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(query));
    });
  }, [search]);

  useEffect(() => {
    if (!selectorOpen) return;
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    const dialog = dialogRef.current;
    const focusable = dialog?.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input:not([disabled])');
    focusable?.[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeSelector();
      if (event.key !== "Tab" || !focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [selectorOpen, closeSelector]);

  if (!selectorOpen) return null;
  const compareHref = `/compare?projects=${selectedSlugs.join(",")}`;

  return (
    <div className={styles.selectorBackdrop} role="presentation" onMouseDown={(event) => event.target === event.currentTarget && closeSelector()}>
      <div ref={dialogRef} className={styles.selectorDialog} role="dialog" aria-modal="true" aria-labelledby="compare-selector-title">
        <header className={styles.selectorHeader}>
          <div>
            <span>A&G Project Evaluation</span>
            <h2 id="compare-selector-title">Compare with another project</h2>
          </div>
          <button type="button" onClick={closeSelector} aria-label="Close project comparison selector">×</button>
        </header>

        <label className={styles.searchField}>
          <span className={styles.visuallyHidden}>Search projects</span>
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search projects..." autoComplete="off" />
        </label>

        <div className={styles.selectionStatus} aria-live="polite">
          <span>{selectedSlugs.length} of 3 selected</span>
          {message ? <strong>{message}</strong> : null}
        </div>

        <div className={styles.selectorGrid}>
          {filtered.map((project) => {
            const selected = selectedSlugs.includes(project.slug);
            const normalized = normalizeProject(project);
            return (
              <button
                type="button"
                className={`${styles.selectorCard} ${selected ? styles.selectorCardSelected : ""}`}
                key={project.slug}
                aria-pressed={selected}
                onClick={() => selected ? removeProject(project.slug) : addProject(project.slug)}
              >
                <span className={styles.selectorImage}><Image src={project.heroImage} alt="" fill sizes="120px" /></span>
                <span className={styles.selectorCopy}>
                  <strong>{project.name}</strong>
                  <small>{normalized.city}{normalized.sector ? ` · ${normalized.sector}` : ""}</small>
                  <small>{project.configurations.join(" · ")}</small>
                  <small>{project.startingPrice}</small>
                </span>
                <span className={styles.selectionMark}>{selected ? "Selected" : "Add"}</span>
              </button>
            );
          })}
        </div>

        <footer className={styles.selectorFooter}>
          <button type="button" onClick={closeSelector}>Continue Browsing</button>
          {selectedSlugs.length >= 2 ? (
            <Link
              href={compareHref}
              onClick={() => {
                trackAnalyticsEvent("compare_open", { selected_projects: selectedSlugs, comparison_count: selectedSlugs.length });
                closeSelector();
              }}
            >
              Compare {selectedSlugs.length} Projects
            </Link>
          ) : <span>Select at least 2 projects</span>}
        </footer>
      </div>
    </div>
  );
}
