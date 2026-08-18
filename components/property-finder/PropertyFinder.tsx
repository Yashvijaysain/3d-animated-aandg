"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Project } from "@/data/projects";
import { contactData } from "@/components/sections/contactData";
import { trackAnalyticsEvent } from "@/lib/analytics";
import { projectStageLabels, priorityLabels, type ProjectPriority, type ProjectStage } from "@/lib/projectIntelligence";
import { useCompare } from "@/components/project-comparison/CompareProvider";
import {
  budgetBands,
  getFinderOptions,
  purposeLabels,
  scoreProjects,
  type BudgetBand,
  type FinderPreferences,
  type FinderPurpose,
} from "./finderScoring";
import styles from "./PropertyFinder.module.css";

const STORAGE_KEY = "ag-property-finder-preferences";
const initialPreferences: FinderPreferences = { priorities: [] };

type Props = {
  currentProject: Project;
  projects: Project[];
};

const stages: (ProjectStage | "no-preference")[] = ["ready", "near-possession", "under-construction", "new-launch", "no-preference"];

export default function PropertyFinder({ currentProject, projects }: Props) {
  const [step, setStep] = useState(0);
  const [preferences, setPreferences] = useState<FinderPreferences>(initialPreferences);
  const [showResults, setShowResults] = useState(false);
  const startedRef = useRef(false);
  const { addProject, openSelector } = useCompare();
  const options = useMemo(() => getFinderOptions(projects), [projects]);
  const matches = useMemo(() => scoreProjects(preferences, projects).slice(0, 3), [preferences, projects]);
  const currentMatch = useMemo(
    () => scoreProjects(preferences, [currentProject])[0],
    [preferences, currentProject]
  );

  useEffect(() => {
    try {
      const stored = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? "null") as FinderPreferences | null;
      if (stored && Array.isArray(stored.priorities)) {
        // Restore only non-sensitive discovery preferences.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPreferences(stored);
      }
    } catch {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  }, [preferences]);

  const markStarted = () => {
    if (startedRef.current) return;
    startedRef.current = true;
    trackAnalyticsEvent("property_finder_started", { current_project: currentProject.slug });
  };

  const setSinglePreference = <K extends keyof FinderPreferences>(key: K, value: FinderPreferences[K]) => {
    markStarted();
    setPreferences((current) => ({ ...current, [key]: value }));
  };

  const togglePriority = (priority: ProjectPriority) => {
    markStarted();
    setPreferences((current) => ({
      ...current,
      priorities: current.priorities.includes(priority)
        ? current.priorities.filter((item) => item !== priority)
        : [...current.priorities, priority],
    }));
  };

  const canContinue = [
    Boolean(preferences.purpose),
    Boolean(preferences.location),
    Boolean(preferences.budget),
    Boolean(preferences.configuration),
    Boolean(preferences.stage),
    true,
  ][step];

  const complete = () => {
    setShowResults(true);
    trackAnalyticsEvent("property_finder_completed", {
      purpose: preferences.purpose,
      location: preferences.location,
      budget_band: preferences.budget,
      configuration: preferences.configuration,
      project_status: preferences.stage,
      current_project: currentProject.slug,
    });
  };

  const reset = () => {
    setPreferences(initialPreferences);
    setStep(0);
    setShowResults(false);
    startedRef.current = false;
    sessionStorage.removeItem(STORAGE_KEY);
  };

  const compareMatch = (slug: string) => {
    addProject(currentProject.slug, currentProject.slug);
    addProject(slug, currentProject.slug);
    trackAnalyticsEvent("property_finder_compare_click", {
      current_project: currentProject.slug,
      result_project: slug,
    });
    openSelector();
  };

  const renderStep = () => {
    if (step === 0) {
      return <OptionGrid values={Object.keys(purposeLabels) as FinderPurpose[]} selected={preferences.purpose} label={(value) => purposeLabels[value]} onSelect={(value) => setSinglePreference("purpose", value)} />;
    }
    if (step === 1) {
      const locations = [...options.locations, "no-preference"];
      return <OptionGrid values={locations} selected={preferences.location} label={(value) => value === "no-preference" ? "No Preference" : value} onSelect={(value) => setSinglePreference("location", value)} />;
    }
    if (step === 2) {
      return <OptionGrid values={budgetBands.map((band) => band.value)} selected={preferences.budget} label={(value) => budgetBands.find((band) => band.value === value)?.label ?? value} onSelect={(value) => setSinglePreference("budget", value as BudgetBand)} />;
    }
    if (step === 3) {
      const configurations = [...options.configurations, "flexible"];
      return <OptionGrid values={configurations} selected={preferences.configuration} label={(value) => value === "flexible" ? "Flexible" : value} onSelect={(value) => setSinglePreference("configuration", value)} />;
    }
    if (step === 4) {
      return <OptionGrid values={stages} selected={preferences.stage} label={(value) => value === "no-preference" ? "No Preference" : projectStageLabels[value]} onSelect={(value) => setSinglePreference("stage", value)} />;
    }
    return (
      <div className={styles.optionGrid} role="group" aria-label="Property priorities">
        {options.priorities.map((priority) => {
          const selected = preferences.priorities.includes(priority);
          return (
            <button key={priority} type="button" className={selected ? styles.optionSelected : ""} aria-pressed={selected} onClick={() => togglePriority(priority)}>
              <span>{priorityLabels[priority]}</span>
              <small>{selected ? "Selected" : "Select"}</small>
            </button>
          );
        })}
      </div>
    );
  };

  const questions = [
    "What are you buying for?",
    "Where would you prefer to buy?",
    "What is your approximate budget?",
    "What configuration are you looking for?",
    "What kind of project do you prefer?",
    "What matters most to you?",
  ];

  return (
    <section className={styles.finder} aria-labelledby="property-finder-title" data-compare-bar-avoid>
      <header className={styles.finderHeader}>
        <span>A&G Smart Advisory</span>
        <h2 id="property-finder-title">Find the Right Property for You</h2>
        <p>Tell us what you’re looking for and we’ll shortlist the most relevant A&G projects.</p>
      </header>

      {!showResults ? (
        <div className={styles.finderPanel}>
          <div className={styles.progressRow}>
            <span>{step + 1} of 6</span>
            <span className={styles.progressTrack}><span style={{ transform: `scaleX(${(step + 1) / 6})` }} /></span>
          </div>
          <div className={styles.questionHeader}>
            <span>Step {String(step + 1).padStart(2, "0")}</span>
            <h3>{questions[step]}</h3>
            {step === 5 ? <p>Select any that apply, or continue without a priority.</p> : null}
          </div>
          {renderStep()}
          <div className={styles.finderNav}>
            <button type="button" onClick={() => setStep((current) => Math.max(0, current - 1))} disabled={step === 0}>Back</button>
            <button type="button" onClick={() => step === 5 ? complete() : setStep((current) => current + 1)} disabled={!canContinue}>
              {step === 5 ? "Show My Matches" : "Continue"}
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.results}>
          <div className={styles.resultsHeading}>
            <div>
              <span>{matches.some((match) => match.exact) ? "Your Best Matches" : "Closest Matches"}</span>
              <h3>{matches.some((match) => match.exact) ? "Projects aligned with your brief" : "The closest available A&G options"}</h3>
              {!matches.some((match) => match.exact) ? <p>We couldn’t find an exact match, but these projects are closest to your requirements.</p> : null}
            </div>
            <button type="button" onClick={reset}>Start Again</button>
          </div>

          {currentMatch ? (
            <p className={styles.currentContext}>
              <strong>{currentProject.name}</strong> matches {currentMatch.matchedCriteria.length} of {Math.max(currentMatch.evaluatedCriteria, 1)} evaluated preferences.
            </p>
          ) : null}

          <div className={styles.resultGrid}>
            {matches.map((match) => {
              const explanation = match.matchedCriteria.length
                ? `Matches your ${match.matchedCriteria.slice(0, 3).join(", ")}.`
                : "Closest based on the verified project information currently available.";
              const whatsappText = encodeURIComponent(`Hi A&G, I would like advice on ${match.project.name} after using the Property Finder.`);
              return (
                <article className={styles.resultCard} key={match.project.slug}>
                  <Link
                    className={styles.resultImage}
                    href={`/projects/${match.project.slug}`}
                    onClick={() => trackAnalyticsEvent("property_finder_result_click", { current_project: currentProject.slug, result_project: match.project.slug })}
                  >
                    <Image src={match.project.heroImage} alt={match.project.name} fill sizes="(max-width: 700px) 90vw, 30vw" />
                    {match.percentage !== undefined ? <span>{match.percentage}% match</span> : null}
                  </Link>
                  <div className={styles.resultCopy}>
                    <span>{match.project.location}</span>
                    <h4>{match.project.name}</h4>
                    <dl>
                      <div><dt>Configuration</dt><dd>{match.project.configurations.join(" · ")}</dd></div>
                      <div><dt>Starting Price</dt><dd>{match.project.startingPrice}</dd></div>
                      <div><dt>Status</dt><dd>{match.project.status}</dd></div>
                    </dl>
                    <p>{explanation}</p>
                    <div className={styles.resultActions}>
                      <Link href={`/projects/${match.project.slug}`}>View Project</Link>
                      <button type="button" onClick={() => compareMatch(match.project.slug)}>Compare</button>
                      <a href={`${contactData.whatsappHref}?text=${whatsappText}`} target="_blank" rel="noreferrer">WhatsApp</a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}

type OptionGridProps<T extends string> = {
  values: T[];
  selected?: T;
  label: (value: T) => string;
  onSelect: (value: T) => void;
};

function OptionGrid<T extends string>({ values, selected, label, onSelect }: OptionGridProps<T>) {
  return (
    <div className={styles.optionGrid} role="radiogroup">
      {values.map((value) => {
        const active = selected === value;
        return (
          <button key={value} type="button" role="radio" aria-checked={active} className={active ? styles.optionSelected : ""} onClick={() => onSelect(value)}>
            <span>{label(value)}</span>
            <small>{active ? "Selected" : "Select"}</small>
          </button>
        );
      })}
    </div>
  );
}
