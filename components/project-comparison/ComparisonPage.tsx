"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";
import { projects, type Project } from "@/data/projects";
import EnquiryForm from "@/components/forms/EnquiryForm";
import { contactData } from "@/components/sections/contactData";
import { trackAnalyticsEvent } from "@/lib/analytics";
import { normalizeProject, projectAdvisorySummary } from "@/lib/projectIntelligence";
import { useCompare } from "./CompareProvider";
import styles from "./ComparisonPage.module.css";

type ComparisonRow = {
  label: string;
  value: (project: Project) => string;
};

type ComparisonGroup = {
  title: string;
  rows: ComparisonRow[];
};

const notAvailable = "Not available";

function statistic(project: Project, patterns: RegExp[]) {
  const stat = project.statistics.find((item) => patterns.some((pattern) => pattern.test(item.label)));
  return stat ? `${stat.value}${stat.label.toLowerCase().includes(stat.value.toLowerCase()) ? "" : ` · ${stat.label}`}` : notAvailable;
}

const comparisonGroups: ComparisonGroup[] = [
  {
    title: "Overview",
    rows: [
      { label: "Developer", value: (project) => project.developer || notAvailable },
      { label: "Location", value: (project) => project.location || notAvailable },
      { label: "Sector", value: (project) => normalizeProject(project).sector ?? notAvailable },
      { label: "Project Status", value: (project) => project.status || notAvailable },
      { label: "RERA", value: (project) => normalizeProject(project).reraNumbers.join(", ") || notAvailable },
      { label: "Possession", value: (project) => project.possession || notAvailable },
    ],
  },
  {
    title: "Pricing & Homes",
    rows: [
      { label: "Starting Price", value: (project) => project.startingPrice || notAvailable },
      { label: "Configuration", value: (project) => project.configurations.join(", ") || notAvailable },
      { label: "Published Unit Sizes", value: (project) => normalizeProject(project).unitSizes.join("; ") || notAvailable },
    ],
  },
  {
    title: "Project Scale",
    rows: [
      { label: "Project Area", value: (project) => statistic(project, [/approx\. land/i, /land area/i]) },
      { label: "Towers", value: (project) => statistic(project, [/towers/i]) },
      { label: "Published Units", value: (project) => statistic(project, [/living units/i, /residences/i, /homes/i]) },
      { label: "Open / Green Space", value: (project) => statistic(project, [/open space/i, /landscaping/i, /lagoon/i]) },
    ],
  },
  {
    title: "Lifestyle",
    rows: [
      { label: "Key Amenities", value: (project) => project.amenities.slice(0, 8).join(", ") || notAvailable },
      { label: "Major Strengths", value: (project) => project.highlights.slice(0, 3).map((item) => item.title).join(", ") || notAvailable },
    ],
  },
  {
    title: "Connectivity",
    rows: [
      { label: "Published Connectivity", value: (project) => project.connectivity.map((item) => `${item.destination}: ${item.distance}`).join("; ") || notAvailable },
    ],
  },
];

export default function ComparisonPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { selectedSlugs, hydrated, replaceProjects, removeProject, openSelector } = useCompare();
  const trackedRef = useRef(false);
  const querySlugs = useMemo(() => {
    const valid = new Set(projects.map((project) => project.slug));
    return Array.from(new Set((searchParams.get("projects") ?? "").split(",").filter((slug) => valid.has(slug)))).slice(0, 3);
  }, [searchParams]);
  const activeSlugs = querySlugs.length ? querySlugs : selectedSlugs;
  const selectedProjects = activeSlugs.flatMap((slug) => {
    const project = projects.find((item) => item.slug === slug);
    return project ? [project] : [];
  });

  useEffect(() => {
    if (querySlugs.length) replaceProjects(querySlugs);
  }, [querySlugs, replaceProjects]);

  useEffect(() => {
    if (!hydrated || trackedRef.current || selectedProjects.length < 2) return;
    trackedRef.current = true;
    trackAnalyticsEvent("compare_open", { selected_projects: activeSlugs, comparison_count: activeSlugs.length });
  }, [hydrated, selectedProjects.length, activeSlugs]);

  const updateUrl = (nextSlugs: string[]) => {
    const query = nextSlugs.length ? `?projects=${nextSlugs.join(",")}` : "";
    router.replace(`/compare${query}`, { scroll: false });
  };

  const remove = (slug: string) => {
    removeProject(slug);
    updateUrl(activeSlugs.filter((item) => item !== slug));
  };

  if (!hydrated) return <main className={styles.page}><p className={styles.loading}>Preparing comparison…</p></main>;

  return (
    <main className={styles.page}>
      <header className={styles.pageHeader}>
        <Link href="/" aria-label="A&G Realtors home"><Image src="/ag-logo.png" alt="A&G Realtors" width={126} height={44} priority /></Link>
        <div>
          <span>A&G Project Evaluation</span>
          <h1>Compare Projects</h1>
          <p>Review verified project information side by side, without promotional rankings.</p>
        </div>
        <button type="button" onClick={() => openSelector()}>Add Project</button>
      </header>

      {selectedProjects.length < 2 ? (
        <section className={styles.emptyState}>
          <span>Build your comparison</span>
          <h2>Select at least two projects</h2>
          <p>Choose up to three A&G projects to review their location, configuration, stage, scale and published amenities.</p>
          <button type="button" onClick={() => openSelector()}>Choose Projects</button>
        </section>
      ) : (
        <>
          <div className={styles.stickyProjects}>
            {selectedProjects.map((project) => (
              <div key={project.slug}>
                <Image src={project.heroImage} alt="" width={44} height={44} />
                <span>{project.name}</span>
                <button type="button" onClick={() => remove(project.slug)} aria-label={`Remove ${project.name}`}>Remove</button>
              </div>
            ))}
          </div>

          <section className={`${styles.desktopComparison} ${selectedProjects.length === 2 ? styles.twoProjects : ""}`} aria-label="Desktop project comparison table">
            <div className={styles.projectHeaderRow}>
              <div>Project</div>
              {selectedProjects.map((project) => (
                <article key={project.slug}>
                  <div><Image src={project.heroImage} alt={project.name} fill sizes="30vw" /></div>
                  <h2>{project.name}</h2>
                  <Link href={`/projects/${project.slug}`}>View Project</Link>
                </article>
              ))}
            </div>
            {comparisonGroups.map((group) => (
              <div className={styles.tableGroup} key={group.title}>
                <h3>{group.title}</h3>
                {group.rows.map((row) => {
                  const values = selectedProjects.map(row.value);
                  const distinct = new Set(values.filter((value) => value !== notAvailable)).size > 1;
                  return (
                    <div className={styles.tableRow} key={row.label}>
                      <strong>{row.label}</strong>
                      {values.map((value, index) => <span className={distinct ? styles.distinctValue : ""} key={`${row.label}-${selectedProjects[index].slug}`}>{value}</span>)}
                    </div>
                  );
                })}
              </div>
            ))}
          </section>

          <section className={styles.mobileComparison} aria-label="Mobile project comparison">
            {comparisonGroups.map((group) => (
              <div className={styles.mobileGroup} key={group.title}>
                <h2>{group.title}</h2>
                {group.rows.map((row) => (
                  <article key={row.label}>
                    <h3>{row.label}</h3>
                    {selectedProjects.map((project) => (
                      <div key={project.slug}>
                        <strong>{project.name}</strong>
                        <p>{row.value(project)}</p>
                      </div>
                    ))}
                  </article>
                ))}
              </div>
            ))}
          </section>

          <section className={styles.advisory}>
            <span>A&G Comparison View</span>
            <h2>A factual view of each address</h2>
            <div>
              {selectedProjects.map((project) => {
                const summary = projectAdvisorySummary(project);
                return (
                  <article key={project.slug}>
                    <h3>{project.name}</h3>
                    <p>{summary.suited}</p>
                    <dl>
                      <div><dt>Published strengths</dt><dd>{summary.strengths.join(", ") || notAvailable}</dd></div>
                      <div><dt>Considerations</dt><dd>{summary.considerations.join(". ") || notAvailable}</dd></div>
                    </dl>
                  </article>
                );
              })}
            </div>
          </section>

          <section className={styles.contact} id="consultation">
            <div>
              <span>Need Help Choosing?</span>
              <h2>Speak with an A&G advisor</h2>
              <p>Request a personalised project comparison based on your priorities.</p>
              <a
                href={`${contactData.whatsappHref}?text=${encodeURIComponent(`Hi A&G, I would like help comparing ${selectedProjects.map((project) => project.name).join(" and ")}.`)}`}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackAnalyticsEvent("compare_contact_click", { selected_projects: activeSlugs, comparison_count: activeSlugs.length })}
              >
                WhatsApp Advisor
              </a>
            </div>
            <EnquiryForm
              projectName={selectedProjects.map((project) => project.name).join(" vs ")}
              projectSlug={activeSlugs.join(",")}
              sourcePage={`/compare?projects=${activeSlugs.join(",")}`}
              comparedProjects={selectedProjects.map((project) => project.name)}
              submitLabel="Book Consultation"
            />
          </section>
        </>
      )}
    </main>
  );
}
