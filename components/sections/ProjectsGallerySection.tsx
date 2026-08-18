"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { projectGallery } from "@/data/projectGallery";
import styles from "./ProjectsGallerySection.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const START_ROTATION = -10;
const END_ROTATION = 10;
const START_ANGLE = 202;
const END_ANGLE = 338;
const SCROLL_DISTANCE_MULTIPLIER = 3.2;
const galleryImages = Array.from(new Map(projectGallery.map((item) => [item.id, item])).values()).slice(0, 9);

function getCardAngle(index: number, total: number) {
  if (total <= 1) {
    return 270;
  }

  const step = (END_ANGLE - START_ANGLE) / (total - 1);
  return START_ANGLE + index * step;
}

export default function ProjectsGallerySection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const orbitRef = useRef<HTMLDivElement | null>(null);
  const copyRef = useRef<HTMLDivElement | null>(null);
  const accentRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const orbit = orbitRef.current;
      const copy = copyRef.current;
      const accent = accentRef.current;

      if (!section || !orbit || !copy || !accent) {
        return;
      }

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const isMobileViewport = window.matchMedia("(max-width: 767px)").matches;
      const cards = gsap.utils.toArray<HTMLElement>("[data-gallery-card]");

      gsap.set(section, { autoAlpha: 1 });
      gsap.set(orbit, { rotation: START_ROTATION, transformOrigin: "50% 50%", force3D: true });
      gsap.set(accent, { autoAlpha: 1, scaleX: 0, transformOrigin: "50% 50%" });

      if (reduceMotion) {
        gsap.set([cards, copy, accent], {
          autoAlpha: 1,
          clearProps: "transform"
        });
        gsap.set(accent, { scaleX: 1 });
        return;
      }

      if (isMobileViewport) {
        gsap.set(cards, { autoAlpha: 1, scale: 1, y: 0, clearProps: "transform" });
        gsap.set(copy, { autoAlpha: 1, y: 0, clearProps: "transform" });
        gsap.set(orbit, { clearProps: "transform, rotation" });
        return; // Don't create scroll trigger on mobile
      } else {
        gsap.set(cards, { autoAlpha: 1 });
        gsap.set(copy, { autoAlpha: 1, y: 0 });
      }

      const timeline = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: {
          id: "projects-gallery",
          trigger: section,
          start: "top top",
          end: () => `+=${Math.round(window.innerHeight * SCROLL_DISTANCE_MULTIPLIER)}`,
          pin: true,
          scrub: 0.35,
          anticipatePin: 1,
          invalidateOnRefresh: true
        }
      });

      timeline
        .to(accent, { scaleX: 1, duration: 0.16 }, 0)
        .to(orbit, { rotation: END_ROTATION, duration: 0.68, force3D: true }, 0.28)
        .to(copy, { y: -8, duration: 0.24 }, 0.72);

      return () => {
        timeline.kill();
      };
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} id="projects-gallery" className={styles.gallerySection} aria-labelledby="projects-gallery-title">
      <div className={styles.stage}>
        <header className={styles.header}>
          <div ref={accentRef} className={styles.accent} aria-hidden="true" />
          <span className={styles.desktopLabel}>Projects Gallery</span>
          <div className={styles.mobileIntro}>
            <span className={styles.mobileBadge}>A&G Project Collection</span>
            <h1 className={styles.mobileTitle}>
              Project
              <br />
              Gallery
            </h1>
            <span className={styles.mobileCaption}>Curated Residences · NCR</span>
          </div>
        </header>

        <div className={styles.orbitViewport} aria-hidden="true">
          <div className={styles.orbitAnchor}>
            <div ref={orbitRef} className={styles.orbitRotator}>
              {galleryImages.map((image, index) => {
                const total = galleryImages.length;
                const middleIndex = Math.floor(total / 2);
                const angle = getCardAngle(index, total);
                const visualRotation = (angle - 270) * 0.32;
                const zIndex = 100 - Math.abs(index - middleIndex);

                return (
                  <div
                    key={image.id}
                    className={styles.cardPositioner}
                    style={
                      {
                        "--angle": `${angle}deg`,
                        "--visual-rotation": `${visualRotation}deg`,
                        zIndex
                      } as React.CSSProperties
                    }
                    data-gallery-card
                  >
                    <div className={styles.cardVisual}>
                      <Link
                        className={styles.galleryCard}
                        href={`/projects/${image.projectSlug}`}
                        aria-label={`${image.projectName} ${image.category} gallery image`}
                        tabIndex={-1}
                      >
                        <Image
                          className={styles.galleryImage}
                          src={image.src}
                          alt={image.alt}
                          fill
                          sizes="(min-width: 1200px) 190px, 150px"
                          priority={index < 3}
                        />
                        <span className={styles.cardMeta}>
                          <strong>{image.projectName}</strong>
                          <em>{image.category}</em>
                        </span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div ref={copyRef} className={styles.centralCopy}>
          <div className={styles.desktopCopy}>
            <p className={styles.eyebrow}>Curated Residences</p>
            <h2 id="projects-gallery-title">Spaces in Motion</h2>
            <p className={styles.description}>
              Architecture, gardens, interiors, and everyday moments from A&amp;G&apos;s residential portfolio.
            </p>
            <Link className={styles.cta} href="/projects">
              Explore All Projects
            </Link>
          </div>

          <div className={styles.mobileCopy}>
            <p className={styles.mobileEyebrow}>Curated Projects</p>
            <div className={styles.mobileStatement}>
              <strong>Exceptional homes.</strong>
              <strong>Distinctive addresses.</strong>
            </div>
            <p className={styles.mobileDescription}>
              A&G brings together a carefully selected portfolio of premium residences across Noida, Greater Noida and Gurugram.
            </p>
            <Link className={styles.cta} href="/projects">
              Explore Projects
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
