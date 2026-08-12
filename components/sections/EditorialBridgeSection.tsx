"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import styles from "./EditorialBridgeSection.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const editorialCards = [
  { className: styles.cardOne, src: "/projects/jade.webp", alt: "Jade County residence" },
  { className: styles.cardTwo, src: "/projects/ivy.webp", alt: "Ivy County residence" },
  { className: styles.cardThree, src: "/projects/ivory.webp", alt: "Ivory County residence" },
  { className: styles.cardFour, src: "/projects/clove.jpg", alt: "Clove County residence" }
];

export default function EditorialBridgeSection() {
  const sequenceRef = useRef<HTMLElement | null>(null);
  const editorialSceneRef = useRef<HTMLDivElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const paragraphRef = useRef<HTMLParagraphElement | null>(null);
  const buttonsRef = useRef<HTMLDivElement | null>(null);
  const badgesRef = useRef<HTMLDivElement | null>(null);
  const decorativeRef = useRef<HTMLDivElement | null>(null);
  useGSAP(
    () => {
      const sequence = sequenceRef.current;
      const editorialScene = editorialSceneRef.current;
      const heading = headingRef.current;
      const paragraph = paragraphRef.current;
      const buttons = buttonsRef.current;
      const badges = badgesRef.current;
      const decorative = decorativeRef.current;
      const missingTargets = !sequence || !editorialScene || !heading || !paragraph || !buttons || !badges || !decorative;

      if (missingTargets) {
        console.error("Editorial bridge animation targets are missing.");
        gsap.set([heading, paragraph, buttons, badges, decorative].filter(Boolean), {
          autoAlpha: 1,
          clearProps: "transform,filter"
        });
        return;
      }

      const selector = gsap.utils.selector(sequence);
      const cards = selector(`.${styles.card}`);
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const mobile = window.matchMedia("(max-width: 699px)").matches;

      gsap.set(editorialScene, { yPercent: 0, autoAlpha: 1 });
      gsap.set(heading, { autoAlpha: 1, y: reduced ? 0 : 35 });
      gsap.set(paragraph, { autoAlpha: 1, y: reduced ? 0 : 24 });
      gsap.set(buttons, { autoAlpha: 1, y: reduced ? 0 : 18 });
      gsap.set(badges, { autoAlpha: 1, y: reduced ? 0 : 14 });
      gsap.set(decorative, { autoAlpha: 0.08, x: reduced ? 0 : 22 });
      gsap.set(cards, { autoAlpha: 1, force3D: true, filter: "blur(0px)" });
      gsap.set(selector(`.${styles.cardOne}`), { x: reduced || mobile ? 0 : 90, y: reduced ? 0 : mobile ? -18 : -110, scale: reduced ? 1 : mobile ? 1.02 : 1.15, rotation: -3, autoAlpha: 1, filter: "blur(0px)" });
      gsap.set(selector(`.${styles.cardTwo}`), { x: reduced || mobile ? 0 : 120, y: reduced ? 0 : mobile ? 4 : -60, scale: reduced ? 1 : mobile ? 1.02 : 1.12, rotation: 3, autoAlpha: 1, filter: "blur(0px)" });
      gsap.set(selector(`.${styles.cardThree}`), { x: reduced || mobile ? 0 : 145, y: reduced ? 0 : mobile ? 16 : 0, scale: reduced ? 1 : mobile ? 1.01 : 1.09, rotation: -2, autoAlpha: 1, filter: "blur(0px)" });
      gsap.set(selector(`.${styles.cardFour}`), { x: reduced || mobile ? 0 : 165, y: reduced ? 0 : mobile ? 28 : 55, scale: reduced ? 1 : mobile ? 1 : 1.06, rotation: 2, autoAlpha: 1, filter: "blur(0px)" });

      document.fonts.ready.then(() => {
        ScrollTrigger.refresh();
      });

      if (reduced) {
        return;
      }

      const mm = gsap.matchMedia();

      mm.add(
        {
          desktop: "(min-width: 1100px)",
          tablet: "(min-width: 700px) and (max-width: 1099px)",
          mobile: "(max-width: 699px)"
        },
        (context) => {
          const endMultiplier = context.conditions?.desktop ? 1.4 : context.conditions?.tablet ? 1.2 : 1.1;
          const tl = gsap.timeline({
            scrollTrigger: {
              id: "editorial-bridge",
              trigger: sequence,
              start: "top top",
              end: () => `+=${window.innerHeight * endMultiplier}`,
              pin: true,
              scrub: 0.25,
              anticipatePin: 1,
              invalidateOnRefresh: true
            }
          });

          tl.addLabel("editorialBlank", 0)
            .addLabel("editorialStart", 0)
            .to(heading, { y: 0, duration: 0.28, ease: "power3.out" }, "editorialStart")
            .to(paragraph, { y: 0, duration: 0.26, ease: "power3.out" }, "editorialStart+=0.05")
            .to(buttons, { y: 0, duration: 0.24, ease: "power3.out" }, "editorialStart+=0.09")
            .to(decorative, { x: 0, duration: 0.28, ease: "power3.out" }, "editorialStart+=0.03")
            .addLabel("headingEnter", 0.18)
            .addLabel("firstCardEnter", 0.26)
            .addLabel("secondCardEnter", 0.34)
            .addLabel("thirdCardEnter", 0.42)
            .addLabel("fourthCardEnter", 0.5)
            .to(
              cards,
              {
                x: 0,
                y: 0,
                scale: 1,
                rotation: 0,
                duration: 0.65,
                ease: "power3.out",
                stagger: 0.08
              },
              "editorialStart+=0.03"
            )
            .to(badges, { y: 0, duration: 0.22, ease: "power3.out" }, "editorialStart+=0.28")
            .addLabel("editorialComplete", 1.0)
            .to({}, { duration: 0.28 })
            .addLabel("editorialHold")
            .addLabel("editorialBridgeComplete");

          return () => {
            tl.scrollTrigger?.kill();
            tl.kill();
          };
        }
      );

      return () => {
        mm.revert();
      };
    },
    { scope: sequenceRef, dependencies: [], revertOnUpdate: true }
  );

  return (
    <section ref={sequenceRef} className={styles.sequence}>
      <div className={styles.stage}>
        <div ref={editorialSceneRef} className={styles.editorialScene}>
          <div className={styles.editorialCopy}>
            <span className={styles.kicker}>Curated Real Estate</span>
            <h2 ref={headingRef}>Spaces Designed Around Your Life</h2>
            <p ref={paragraphRef}>
              Discover a carefully selected portfolio of premium residences where architecture, location and long-term value come together.
            </p>
            <div ref={buttonsRef} className={styles.actions}>
              <Link href="/projects">Explore Projects</Link>
              <a href="#">Our Approach</a>
            </div>
          </div>

          <div ref={decorativeRef} className={styles.decorativeWord} aria-hidden="true">
            ESTATE
          </div>

          <div className={styles.cards} aria-hidden="true">
            {editorialCards.map((card) => (
              <figure className={`${styles.card} ${card.className}`} key={card.src}>
                <Image src={card.src} alt={card.alt} fill sizes="(max-width: 699px) 46vw, 30vw" />
              </figure>
            ))}
          </div>

          <div ref={badgesRef} className={styles.trustBadges}>
            <span>Prime Locations</span>
            <span>Private Advisory</span>
            <span>Measured Value</span>
          </div>
        </div>

      </div>
    </section>
  );
}
