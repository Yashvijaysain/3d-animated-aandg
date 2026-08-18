"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { projects } from "@/data/projects";
import { trackAnalyticsEvent } from "@/lib/analytics";
import { useCompare } from "./CompareProvider";
import styles from "./ProjectComparison.module.css";

export default function CompareBar() {
  const { selectedSlugs, hydrated, removeProject, openSelector } = useCompare();
  const pathname = usePathname();
  const [avoidAreaVisible, setAvoidAreaVisible] = useState(false);

  useEffect(() => {
    const avoidedAreas = Array.from(document.querySelectorAll("[data-compare-bar-avoid]"));
    const visibleAreas = new Set<Element>();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.isIntersecting ? visibleAreas.add(entry.target) : visibleAreas.delete(entry.target));
      setAvoidAreaVisible(visibleAreas.size > 0);
    }, { threshold: 0.01 });
    avoidedAreas.forEach((area) => observer.observe(area));
    return () => observer.disconnect();
  }, [pathname]);

  if (!hydrated || selectedSlugs.length < 2 || pathname === "/compare" || avoidAreaVisible) return null;

  const selected = selectedSlugs.flatMap((slug) => {
    const project = projects.find((item) => item.slug === slug);
    return project ? [project] : [];
  });
  const compareHref = `/compare?projects=${selected.map((project) => project.slug).join(",")}`;

  return (
    <aside className={styles.compareBar} aria-label="Selected projects comparison">
      <div className={styles.compareBarProjects}>
        {selected.map((project) => (
          <span className={styles.compareBarProject} key={project.slug}>
            <Image src={project.heroImage} alt="" width={36} height={36} />
            <span>{project.name}</span>
            <button type="button" onClick={() => removeProject(project.slug)} aria-label={`Remove ${project.name} from comparison`}>×</button>
          </span>
        ))}
      </div>
      <div className={styles.compareBarActions}>
        {selected.length < 3 ? <button type="button" onClick={() => openSelector()}>Add</button> : null}
        <Link
          href={compareHref}
          onClick={() => trackAnalyticsEvent("compare_open", { selected_projects: selectedSlugs, comparison_count: selectedSlugs.length })}
        >
          Compare <span aria-hidden="true">→</span>
        </Link>
      </div>
    </aside>
  );
}
