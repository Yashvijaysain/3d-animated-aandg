"use client";

import type { CSSProperties } from "react";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { testimonials } from "@/data/testimonials";
import styles from "./TestimonialsSection.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const cardLayouts = [
  {
    className: `${styles.cardPosition} ${styles.cardOne}`,
    motionClassName: styles.cardBlack,
    initial: { x: -110, y: 55, rotation: -18, scale: 0.82 },
    drift: { y: -12, rotation: 2 },
    style: { "--hover-counter": "5deg" },
  },
  {
    className: `${styles.cardPosition} ${styles.cardTwo}`,
    motionClassName: styles.cardWhite,
    initial: { x: -35, y: -90, rotation: -20, scale: 0.82 },
    drift: { y: -10, rotation: 3 },
    style: { "--hover-counter": "7deg" },
  },
  {
    className: `${styles.cardPosition} ${styles.cardThree}`,
    motionClassName: styles.cardNeutral,
    initial: { x: 105, y: -65, rotation: 18, scale: 0.82 },
    drift: { y: -10, rotation: -3 },
    style: { "--hover-counter": "-5deg" },
  },
  {
    className: `${styles.cardPosition} ${styles.cardFour}`,
    motionClassName: styles.cardWhite,
    initial: { x: -70, y: 85, rotation: -10, scale: 0.86 },
    drift: { x: -18, y: -8, rotation: 1 },
    style: { "--hover-counter": "1deg" },
  },
  {
    className: `${styles.cardPosition} ${styles.cardFive}`,
    motionClassName: styles.cardGold,
    initial: { x: 70, y: 95, rotation: 20, scale: 0.86 },
    drift: { x: 20, y: -8, rotation: -3 },
    style: { "--hover-counter": "-7deg" },
  },
];

function Stars({ rating }: { rating: number }) {
  return (
    <div className={styles.rating} aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, index) => (
        <span key={index} aria-hidden="true">
          ★
        </span>
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const accentLineRef = useRef<HTMLSpanElement | null>(null);
  const cardsStageRef = useRef<HTMLDivElement | null>(null);
  const cardMotionRefs = useRef<Array<HTMLElement | null>>([]);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const accent = accentLineRef.current;
      const stage = cardsStageRef.current;

      if (!section || !accent || !stage) {
        return;
      }

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const isMobile = window.matchMedia("(max-width: 767px)").matches;
      const isTablet = window.matchMedia("(min-width: 768px) and (max-width: 1099px)").matches;
      const selector = gsap.utils.selector(section);
      const headerElements = selector("[data-testimonial-header]");
      const cards = cardMotionRefs.current.filter(Boolean) as HTMLElement[];

      gsap.set([accent, headerElements, cards], { autoAlpha: 1, clearProps: "transform" });

      if (reducedMotion || isMobile) {
        gsap.set(accent, { scaleX: 1 });
        return;
      }

      gsap.set(accent, { scaleX: 0, transformOrigin: "50% 50%" });
      gsap.set(headerElements, { autoAlpha: 0, y: 22 });
      cards.forEach((card, index) => {
        gsap.set(card, {
          autoAlpha: 0,
          x: cardLayouts[index]?.initial.x ?? 0,
          y: cardLayouts[index]?.initial.y ?? 0,
          rotation: cardLayouts[index]?.initial.rotation ?? 0,
          scale: cardLayouts[index]?.initial.scale ?? 0.86,
          transformOrigin: "50% 50%",
          force3D: true,
        });
      });

      const timeline = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: {
          id: "testimonials-section",
          trigger: section,
          start: "top top",
          end: () => `+=${Math.round(window.innerHeight * (isTablet ? 1.8 : 2.4))}`,
          pin: true,
          scrub: 0.25,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      timeline
        .addLabel("testimonialsStart")
        .fromTo(accent, { scaleX: 0 }, { scaleX: 1, duration: 0.14 }, "testimonialsStart")
        .to(
          headerElements,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.3,
            stagger: 0.05,
          },
          0.05,
        )
        .to(
          [cards[0], cards[2]].filter(Boolean),
          {
            autoAlpha: 1,
            x: 0,
            y: 0,
            scale: 1,
            rotation: 0,
            duration: 0.42,
            stagger: 0.06,
          },
          0.16,
        )
        .to(
          cards[1],
          {
            autoAlpha: 1,
            x: 0,
            y: 0,
            scale: 1,
            rotation: 0,
            duration: 0.42,
          },
          0.23,
        )
        .to(
          [cards[3], cards[4]].filter(Boolean),
          {
            autoAlpha: 1,
            x: 0,
            y: 0,
            scale: 1,
            rotation: 0,
            duration: 0.46,
            stagger: 0.07,
          },
          0.29,
        )
        .addLabel("testimonialCollageComplete")
        .to(
          cards,
          {
            x: (index) => cardLayouts[index]?.drift.x ?? 0,
            y: (index) => cardLayouts[index]?.drift.y ?? 0,
            rotation: (index) => cardLayouts[index]?.drift.rotation ?? 0,
            duration: 0.28,
            stagger: 0.015,
          },
          0.78,
        )
        .to({}, { duration: 0.25 });

      return () => {
        timeline.scrollTrigger?.kill();
        timeline.kill();
      };
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className={styles.testimonialsSection} aria-labelledby="testimonials-title">
      <div className={styles.testimonialsInner}>
        <header className={styles.testimonialsHeader}>
          <span ref={accentLineRef} className={styles.accentLine} aria-hidden="true" />
          <span className={styles.sectionLabel} data-testimonial-header>
            CLIENT STORIES
          </span>
          <h2 id="testimonials-title" className={styles.sectionTitle} data-testimonial-header>
            TRUSTED BY PEOPLE
          </h2>
          <p className={styles.sectionDescription} data-testimonial-header>
            Real experiences from clients who trusted A&amp;G to guide their property journey.
          </p>
        </header>

        <div ref={cardsStageRef} className={styles.cardsStage}>
          {testimonials.slice(0, 5).map((testimonial, index) => {
            const layout = cardLayouts[index];

            return (
              <div
                key={testimonial.id}
                className={layout.className}
                style={layout.style as CSSProperties}
              >
                <article
                  ref={(element) => {
                    cardMotionRefs.current[index] = element;
                  }}
                  className={`${styles.testimonialCard} ${layout.motionClassName}`}
                  tabIndex={0}
                >
                  <Stars rating={testimonial.rating} />

                  <blockquote className={styles.review}>{testimonial.review}</blockquote>

                  <footer className={styles.reviewer}>
                    <strong>{testimonial.name}</strong>
                    {testimonial.project ? <span>{testimonial.project}</span> : null}
                  </footer>
                </article>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
