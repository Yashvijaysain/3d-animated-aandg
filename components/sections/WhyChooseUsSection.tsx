"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import styles from "./WhyChooseUsSection.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type IconProps = {
  className?: string;
};

type Reason = {
  id: number;
  title: string;
  description: string;
  icon: (props: IconProps) => React.ReactNode;
};

type Statistic = {
  value: number;
  suffix?: string;
  label: string;
};

const reasons: Reason[] = [
  {
    id: 1,
    title: "Trusted Advisory",
    description:
      "We understand your requirements before recommending a property, ensuring every option aligns with your lifestyle, budget and long-term objectives.",
    icon: AdvisorIcon
  },
  {
    id: 2,
    title: "Curated Projects",
    description: "Carefully selected developments from established real-estate brands.",
    icon: PropertyIcon
  },
  {
    id: 3,
    title: "Market Insight",
    description: "Location, pricing and investment potential evaluated before recommendation.",
    icon: MarketIcon
  },
  {
    id: 4,
    title: "Personal Assistance",
    description: "Dedicated support from initial consultation to final possession.",
    icon: AdvisorIcon
  },
  {
    id: 5,
    title: "Transparent Guidance",
    description: "Clear project information without unnecessary pressure or confusion.",
    icon: TransparencyIcon
  },
  {
    id: 6,
    title: "Complete Support",
    description: "Assistance with site visits, documentation, negotiations and coordination.",
    icon: SupportIcon
  }
];

// TODO: Replace these editable placeholder values with verified A&G company data before production.
const statistics: Statistic[] = [
  { value: 100, suffix: "+", label: "Clients Assisted" },
  { value: 25, suffix: "+", label: "Premium Projects" },
  { value: 10, suffix: "+", label: "Prime Locations" },
  { value: 90, suffix: "%+", label: "Client Satisfaction" }
];

const nodePositions = [
  { x: 0, y: -205 },
  { x: 190, y: -58 },
  { x: 123, y: 164 },
  { x: -123, y: 164 },
  { x: -190, y: -58 }
];

export default function WhyChooseUsSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const centralContentRef = useRef<HTMLDivElement | null>(null);
  const countersStarted = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeReason = reasons[activeIndex];
  const ActiveIcon = activeReason.icon;

  const orbitReasons = useMemo(() => reasons.slice(1), []);

  useEffect(() => {
    const content = centralContentRef.current;

    if (!content) {
      return;
    }

    gsap.fromTo(
      content.children,
      { autoAlpha: 0, y: 18 },
      { autoAlpha: 1, y: 0, duration: 0.34, stagger: 0.045, ease: "power3.out" }
    );
  }, [activeIndex]);

  useGSAP(
    () => {
      const section = sectionRef.current;

      if (!section) {
        return;
      }

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const isMobile = window.matchMedia("(max-width: 699px)").matches;
      const selector = gsap.utils.selector(section);
      const orbit = selector("[data-orbit-circle]");
      const nodes = selector("[data-reason-node]");
      const headerItems = selector("[data-why-header]");
      const stats = selector("[data-stat]");
      const statisticsGrid = selector("[data-statistics-grid]");
      const progressDot = selector("[data-progress-dot]");
      const circumference = 2 * Math.PI * 205;
      const validNodes = nodes.filter(
        (node): node is HTMLButtonElement => Boolean(node)
      );

      if (!orbit[0] || !centralContentRef.current || validNodes.length !== orbitReasons.length) {
        console.error("Why Choose Us animation targets are missing.");

        gsap.set([orbit[0], centralContentRef.current, statisticsGrid[0], ...validNodes].filter(Boolean), {
          autoAlpha: 1,
          clearProps: "transform,filter"
        });

        return;
      }

      gsap.set([headerItems, validNodes, stats, statisticsGrid], { autoAlpha: 1, clearProps: "clipPath" });
      gsap.set(orbit, { strokeDasharray: circumference, strokeDashoffset: 0 });
      gsap.set(progressDot, { x: nodePositions[0].x, y: nodePositions[0].y });

      if (reduced || isMobile) {
        return;
      }

      gsap.set(headerItems, { autoAlpha: 1, y: 18 });
      gsap.set(orbit, { strokeDasharray: circumference, strokeDashoffset: circumference });
      gsap.set(validNodes, { autoAlpha: 1, scale: 0.8, transformOrigin: "50% 50%" });
      gsap.set(centralContentRef.current, { autoAlpha: 1, y: 18 });
      gsap.set(statisticsGrid, { autoAlpha: 1, y: 20 });

      const runCounters = () => {
        if (countersStarted.current) {
          return;
        }

        countersStarted.current = true;

        selector("[data-stat-value]").forEach((element) => {
          const target = Number((element as HTMLElement).dataset.value ?? 0);
          const counter = { value: 0 };

          gsap.to(counter, {
            value: target,
            duration: 1.1,
            ease: "power3.out",
            onUpdate: () => {
              (element as HTMLElement).textContent = String(Math.round(counter.value));
            }
          });
        });
      };

      const scrollDistance = window.matchMedia("(max-width: 1099px)").matches
        ? window.innerHeight * 2.1
        : window.innerHeight * 2.8;

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: {
          id: "why-choose-us",
          trigger: section,
          start: "top top",
          end: () => `+=${scrollDistance}`,
          pin: true,
          scrub: 0.25,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onEnter: runCounters
        }
      });

      tl.addLabel("whyStart", 0)
        .to(headerItems, { y: 0, duration: 0.3, stagger: 0.04 }, "whyStart")
        .to(orbit, { strokeDashoffset: 0, duration: 0.38, ease: "none" }, "whyStart")
        .to(validNodes, { scale: 1, duration: 0.32, ease: "power3.out", stagger: 0.055 }, 0.1)
        .to(centralContentRef.current, { y: 0, duration: 0.26, ease: "power3.out" }, 0.18)
        .to(statisticsGrid, { y: 0, duration: 0.28, ease: "power3.out" }, 0.22)
        .call(() => setActiveIndex(0), [], 0.55);

      reasons.forEach((_, index) => {
        const at = 0.72 + index * 0.2;
        const dotPosition = nodePositions[Math.max(0, index - 1)] ?? nodePositions[nodePositions.length - 1];

        tl.call(() => setActiveIndex(index), [], at).to(
          progressDot,
          {
            x: dotPosition.x,
            y: dotPosition.y,
            duration: 0.18,
            ease: "power2.inOut"
          },
          at
        );
      });

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className={styles.whyChooseSection} aria-labelledby="why-choose-title">
      <div className={styles.whyChooseInner}>
        <header className={styles.whyChooseHeader}>
          <span className={styles.sectionAccent} data-why-header />
          <span className={styles.sectionLabel} data-why-header>
            Why A&amp;G
          </span>
          <h2 id="why-choose-title" className={styles.whyChooseTitle} data-why-header>
            Why Choose Us
          </h2>
          <p className={styles.whyChooseDescription} data-why-header>
            Thoughtful advisory, curated opportunities and complete assistance for every important property decision.
          </p>
        </header>

        <div className={styles.whyChooseMain}>
          <div className={styles.orbitColumn}>
            <div className={styles.orbitArea}>
              <svg className={styles.orbitSvg} viewBox="0 0 500 500" aria-hidden="true">
                <circle data-orbit-circle cx="250" cy="250" r="205" />
              </svg>

              <span className={styles.progressDot} data-progress-dot aria-hidden="true" />

              {orbitReasons.map((reason, index) => {
                const Icon = reason.icon;
                const isActive = activeIndex === reason.id - 1;

                return (
                  <button
                    className={`${styles.reasonNode} ${styles[`node${index + 1}`]} ${isActive ? styles.activeNode : ""}`}
                    type="button"
                    key={reason.id}
                    aria-label={`Show ${reason.title}`}
                    aria-pressed={isActive}
                    data-reason-node
                    onClick={() => setActiveIndex(reason.id - 1)}
                  >
                    <Icon className={styles.reasonIcon} />
                  </button>
                );
              })}

              <div className={styles.centralReason} aria-live="polite">
                <div className={styles.centralReasonContent} ref={centralContentRef}>
                  <span className={styles.centralIcon} aria-hidden="true">
                    <ActiveIcon className={styles.reasonIcon} />
                  </span>
                  <span className={styles.reasonIndex}>{String(activeReason.id).padStart(2, "0")}</span>
                  <h3 className={styles.reasonTitle}>
                    {activeReason.title.split(" ").map((word, index, words) => (
                      <span key={word}>
                        {word}
                        {index < words.length - 1 ? <br /> : null}
                      </span>
                    ))}
                  </h3>
                  <p className={styles.reasonDescription}>{activeReason.description}</p>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.statisticsColumn}>
            <div className={styles.statisticsGrid} aria-label="A&G advisory statistics" data-statistics-grid>
              {statistics.map((statistic) => (
                <div className={styles.statistic} key={statistic.label} data-stat>
                  <strong>
                    <span data-stat-value data-value={statistic.value}>
                      {statistic.value}
                    </span>
                    <em>{statistic.suffix}</em>
                  </strong>
                  <span>{statistic.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PropertyIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d="M12 38V18L24 10L36 18V38" />
      <path d="M18 38V25H30V38" />
      <path d="M16 21H32" />
    </svg>
  );
}

function MarketIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d="M10 36H38" />
      <path d="M14 31L22 23L28 28L38 16" />
      <path d="M32 16H38V22" />
    </svg>
  );
}

function AdvisorIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d="M24 24C29 24 33 20 33 15C33 10 29 7 24 7C19 7 15 10 15 15C15 20 19 24 24 24Z" />
      <path d="M10 40C12 31 17 28 24 28C31 28 36 31 38 40" />
      <path d="M16 35H32" />
    </svg>
  );
}

function TransparencyIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d="M12 12H36V36H12V12Z" />
      <path d="M17 20H31" />
      <path d="M17 28H27" />
      <path d="M32 30L36 34L42 25" />
    </svg>
  );
}

function SupportIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d="M14 24L24 12L34 24" />
      <path d="M18 22V38H30V22" />
      <path d="M10 38H38" />
      <path d="M35 11L39 15L43 8" />
    </svg>
  );
}
