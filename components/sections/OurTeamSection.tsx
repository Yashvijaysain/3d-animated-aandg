"use client";

import type { CSSProperties } from "react";
import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { teamMembers } from "@/data/team";
import styles from "./OurTeamSection.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Tile = {
  id: string;
  kind: "empty" | "logo" | "member";
  className: string;
  memberId?: string;
  hideOnMobile?: boolean;
};

const mosaicTiles: Tile[] = [
  { id: "member-01", kind: "member", className: styles.slotR1C2, memberId: "advisor-01" },
  { id: "empty-02", kind: "empty", className: styles.slotR1C3, hideOnMobile: true },
  { id: "empty-03", kind: "empty", className: styles.slotR1C4, hideOnMobile: true },
  { id: "empty-04", kind: "empty", className: styles.slotR2C1 },
  { id: "member-02", kind: "member", className: styles.slotR2C2, memberId: "research-01" },
  { id: "empty-13", kind: "empty", className: styles.slotR2C3, hideOnMobile: true },
  { id: "empty-05", kind: "empty", className: styles.slotR2C5 },
  { id: "empty-06", kind: "empty", className: styles.slotR3C1, hideOnMobile: true },
  { id: "member-03", kind: "member", className: styles.slotR3C2, memberId: "client-01" },
  { id: "logo", kind: "logo", className: styles.slotR3C3 },
  { id: "member-04", kind: "member", className: styles.slotR3C4, memberId: "advisor-02" },
  { id: "empty-07", kind: "empty", className: styles.slotR3C5, hideOnMobile: true },
  { id: "empty-08", kind: "empty", className: styles.slotR4C1 },
  { id: "empty-01", kind: "empty", className: styles.slotR4C2, hideOnMobile: true },
  { id: "member-05", kind: "member", className: styles.slotR4C3, memberId: "research-02" },
  { id: "empty-09", kind: "empty", className: styles.slotR4C4 },
  { id: "empty-10", kind: "empty", className: styles.slotR5C2, hideOnMobile: true },
  { id: "member-06", kind: "member", className: styles.slotR5C3, memberId: "client-02" },
  { id: "empty-12", kind: "empty", className: styles.slotR5C4, hideOnMobile: true },
];

export default function OurTeamSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [activeId, setActiveId] = useState(teamMembers[0]?.id ?? "");

  const activeMember = useMemo(
    () => teamMembers.find((member) => member.id === activeId) ?? teamMembers[0],
    [activeId],
  );
  const activeIndex = Math.max(
    0,
    teamMembers.findIndex((member) => member.id === activeMember?.id),
  );
  const bubbleStyle = {
    "--bubble-one-x": `${activeIndex < 3 ? -8 : 12}px`,
    "--bubble-one-y": `${activeIndex < 3 ? -8 : 8}px`,
    "--bubble-two-x": `${activeIndex >= 3 ? 10 : -8}px`,
    "--bubble-two-y": `${activeIndex >= 3 ? -10 : 10}px`,
  } as CSSProperties;

  useGSAP(
    () => {
      const section = sectionRef.current;

      if (!section) {
        return;
      }

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const isCompact = window.matchMedia("(max-width: 767px)").matches;
      const q = gsap.utils.selector(section);
      const accent = q("[data-team-accent]");
      const headerItems = q("[data-team-header]");
      const emptyTiles = q("[data-team-empty]");
      const memberTiles = q("[data-team-member]");
      const logoTile = q("[data-team-logo]");
      const bubbles = q("[data-team-bubble]");
      const infoPanel = q("[data-team-info]");
      const animatedItems = [
        ...accent,
        ...headerItems,
        ...emptyTiles,
        ...memberTiles,
        ...logoTile,
        ...bubbles,
        ...infoPanel,
      ];

      if (reduceMotion || isCompact) {
        gsap.set(animatedItems, { autoAlpha: 1, clearProps: "transform" });
        return;
      }

      gsap.set(accent, { scaleX: 0.32, transformOrigin: "left center" });
      gsap.set(headerItems, { autoAlpha: 1, y: 18 });
      gsap.set(emptyTiles, { autoAlpha: 0.72, scale: 0.96 });
      gsap.set(memberTiles, { autoAlpha: 1, y: 14, scale: 0.9 });
      gsap.set(logoTile, { autoAlpha: 0.86, scale: 0.9 });
      gsap.set(bubbles, { autoAlpha: 0, y: 18, scale: 0.94 });
      gsap.set(infoPanel, { autoAlpha: 0, y: 18 });

      const timeline = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: {
          id: "our-team-section",
          trigger: section,
          start: "top top",
          end: () => `+=${window.innerHeight * 2.2}`,
          pin: true,
          scrub: 0.25,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      timeline
        .to(accent, { scaleX: 1, duration: 0.18 })
        .to(headerItems, { autoAlpha: 1, y: 0, duration: 0.35, stagger: 0.04 }, 0.04)
        .to(emptyTiles, { autoAlpha: 1, scale: 1, duration: 0.28, stagger: 0.018 }, 0.2)
        .to(
          memberTiles,
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.48,
            stagger: { each: 0.045, from: "center" },
          },
          0.28,
        )
        .to(logoTile, { autoAlpha: 1, scale: 1, duration: 0.34 }, 0.45)
        .to(bubbles, { autoAlpha: 1, y: 0, scale: 1, duration: 0.32, stagger: 0.06 }, 0.36)
        .to(infoPanel, { autoAlpha: 1, y: 0, duration: 0.3 }, 0.46)
        .to({}, { duration: 0.35 });

      return () => {
        timeline.scrollTrigger?.kill();
        timeline.kill();
      };
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className={styles.teamSection}
      style={bubbleStyle}
      aria-labelledby="our-team-title"
    >
      <div className={styles.teamInner}>
        <header className={styles.teamHeader}>
          <span className={styles.sectionAccent} data-team-accent aria-hidden="true" />
          <p className={styles.sectionLabel} data-team-header>
            MEET THE PEOPLE
          </p>
          <h2 id="our-team-title" className={styles.teamTitle} data-team-header>
            OUR TEAM
          </h2>
          <p className={styles.teamDescription} data-team-header>
            A multidisciplinary team of property advisors, market researchers and client
            relationship professionals working together to make every real-estate decision
            clearer, simpler and more valuable.
          </p>
        </header>

        <div className={styles.teamLayout}>
          <div className={styles.mosaicStage} aria-label="A&G team portrait mosaic">
            <div className={styles.mosaicGrid}>
              {mosaicTiles.map((tile) => {
                if (tile.kind === "empty") {
                  return (
                    <span
                      key={tile.id}
                      className={`${styles.tile} ${styles.emptyTile} ${tile.className} ${
                        tile.hideOnMobile ? styles.hideOnMobile : ""
                      }`}
                      data-team-empty
                      aria-hidden="true"
                    />
                  );
                }

                if (tile.kind === "logo") {
                  return (
                    <div
                      key={tile.id}
                      className={`${styles.tile} ${styles.logoTile} ${tile.className}`}
                      data-team-logo
                      aria-label="A&G"
                    >
                      <Image src="/ag-logo.png" alt="A&G" width={104} height={58} />
                    </div>
                  );
                }

                const member = teamMembers.find((item) => item.id === tile.memberId);

                if (!member) {
                  return null;
                }

                const isActive = activeId === member.id;

                return (
                  <button
                    key={tile.id}
                    type="button"
                    className={`${styles.tile} ${styles.memberTile} ${tile.className} ${
                      isActive ? styles.activeTile : styles.dimmedTile
                    }`}
                    data-team-member
                    aria-pressed={isActive}
                    onMouseEnter={() => setActiveId(member.id)}
                    onFocus={() => setActiveId(member.id)}
                    onClick={() => setActiveId(member.id)}
                    onTouchStart={() => setActiveId(member.id)}
                  >
                    <Image src={member.image} alt={member.role} fill sizes="(max-width: 767px) 30vw, 9vw" />
                    <span className={styles.initials} aria-hidden="true">
                      A&G
                    </span>
                  </button>
                );
              })}
            </div>

            <div className={`${styles.roleBubble} ${styles.bubbleOne}`} data-team-bubble>
              Director
            </div>
            <div className={`${styles.roleBubble} ${styles.bubbleTwo}`} data-team-bubble>
              General Manager
            </div>
          </div>

          <aside className={styles.memberPanel} data-team-info aria-live="polite">
            <span>{activeMember?.shortRole}</span>
            <h3>{activeMember?.name}</h3>
            <p>{activeMember?.role}</p>
          </aside>
        </div>
      </div>
    </section>
  );
}
