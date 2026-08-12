"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import styles from "./ExactScrollTransition.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function ExactScrollTransition() {
  const container = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const section = container.current;

      if (!section) {
        return;
      }

      const selector = gsap.utils.selector(section);
      const redCurtain = selector(`.${styles.redCurtain}`);
      const heroOverlay = selector(`.${styles.heroOverlay}`);
      const heroContent = selector(`.${styles.heroContent}`);
      const windowOne = selector(`.${styles.imageWindowOne}`);
      const windowTwo = selector(`.${styles.imageWindowTwo}`);
      const windowThree = selector(`.${styles.imageWindowThree}`);
      const windowOneImage = selector(`.${styles.imageWindowOne} img`);
      const windowTwoImage = selector(`.${styles.imageWindowTwo} img`);
      const windowThreeImage = selector(`.${styles.imageWindowThree} img`);
      const redTextPanel = selector(`.${styles.redTextPanel}`);
      const redHalfLeft = selector(`.${styles.redHalfLeft}`);
      const redHalfRight = selector(`.${styles.redHalfRight}`);

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      gsap.set(redCurtain, {
        autoAlpha: reduced ? 1 : 0,
        clipPath: reduced ? "inset(0% 0% 0% 0%)" : "inset(100% 49.97% 0% 49.9701%)"
      });
      gsap.set(heroOverlay, { opacity: reduced ? 0.32 : 0.5 });
      gsap.set(heroContent, { opacity: reduced ? 0 : 1 });
      gsap.set([windowOne, windowTwo, windowThree], {
        autoAlpha: reduced ? 1 : 0,
        scale: reduced ? 1 : 0.1,
        transformOrigin: "50% 50%"
      });
      gsap.set([windowOneImage, windowTwoImage, windowThreeImage], { scale: 1.08 });
      gsap.set(redTextPanel, {
        autoAlpha: reduced ? 1 : 0,
        scale: 1,
        transformOrigin: "50% 50%",
        force3D: true
      });
      gsap.set(redHalfLeft, {
        xPercent: reduced ? 0 : -100,
        autoAlpha: reduced ? 0 : 1,
        force3D: true
      });
      gsap.set(redHalfRight, {
        xPercent: reduced ? 0 : 100,
        autoAlpha: reduced ? 0 : 1,
        force3D: true
      });

      if (reduced) {
        return;
      }

      const buildTimeline = () => {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${window.innerHeight * 6.2}`,
            pin: true,
            scrub: 0.5,
            anticipatePin: 0.2,
            invalidateOnRefresh: true
          }
        });

        tl.set(redCurtain, {
          autoAlpha: 0,
          backgroundColor: "#ffffff",
          clipPath: "inset(100% 49.97% 0% 49.9701%)"
        })
          .set([windowOne, windowTwo, windowThree], {
            autoAlpha: 0,
            scale: 0.1,
            transformOrigin: "50% 50%"
          })
          .set([windowOneImage, windowTwoImage, windowThreeImage], {
            scale: 1.08
          })
          .set(redTextPanel, {
            autoAlpha: 0,
            scale: 1,
            transformOrigin: "50% 50%",
            force3D: true
          })
          .set(redHalfLeft, {
            xPercent: -100,
            autoAlpha: 1,
            force3D: true
          })
          .set(redHalfRight, {
            xPercent: 100,
            autoAlpha: 1,
            force3D: true
          })
          .addLabel("hero", 0)
          .addLabel("cleanHero", 0)
          .to({}, { duration: 0.12 })
          .set(redCurtain, {
            autoAlpha: 1
          })
          .addLabel("lineDrawStart")
          .to(redCurtain, {
            clipPath: "inset(0% 49.97% 0% 49.9701%)",
            duration: 0.35,
            ease: "none"
          })
          .addLabel("fullHeightLine")
          .to({}, { duration: 0.05 })
          .to(
            redCurtain,
            {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 0.9,
              ease: "none"
            }
          )
          .addLabel("fullRedScreen")
          .to(heroContent, { autoAlpha: 0, scale: 0.98, duration: 0.32 }, "fullHeightLine+=0.08")
          .to(heroOverlay, { opacity: 0.72, duration: 0.9 }, "fullHeightLine+=0.05")
          .addLabel("redScreen")
          .set(windowOne, { autoAlpha: 1 })
          .to(
            windowOne,
            {
              scale: 1.1,
              duration: 0.7
            },
            "redScreen"
          )
          .to(
            windowOneImage,
            {
              scale: 1,
              duration: 0.7
            },
            "redScreen"
          )
          .addLabel("firstImage")
          .to(
            windowOne,
            {
              scale: 1.32,
              duration: 0.65
            }
          )
          .set(windowTwo, { autoAlpha: 1 })
          .to(
            windowTwo,
            {
              scale: 0.65,
              duration: 0.55
            }
          )
          .to(
            windowTwo,
            {
              scale: 1,
              duration: 0.6
            }
          )
          .to(windowTwoImage, { scale: 1, duration: 0.6 }, "<");

        tl.set(windowThree, { autoAlpha: 1 }).to(
            windowThree,
            {
              scale: 1.1,
              duration: 0.6
            }
          )
            .to(windowThreeImage, { scale: 1, duration: 0.6 }, "<")
            .addLabel("nestedImages")
            .set(redCurtain, {
              backgroundColor: "#ffffff"
            }, "nestedImages")
            .to({}, { duration: 0.6 })
            .addLabel("redSplitStart")
            .to(redHalfLeft, {
              xPercent: 0,
              duration: 1,
              ease: "power2.in",
              force3D: true
            }, "redSplitStart")
            .to(redHalfRight, {
              xPercent: 0,
              duration: 1,
              ease: "power2.in",
              force3D: true
            }, "redSplitStart")
            .addLabel("redHalvesJoined")
            .set(redTextPanel, {
              autoAlpha: 1,
              scale: 1
            })
            .set([redHalfLeft, redHalfRight], {
              autoAlpha: 0
            })
            .addLabel("fullRedScene")
            .to({}, { duration: 0.2 })
            .addLabel("final");

        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
        };
      };

      const cleanup = buildTimeline();

      return () => {
        cleanup();
      };
    },
    { scope: container, dependencies: [], revertOnUpdate: true }
  );

  return (
    <section ref={container} id="home" className={styles.scrollSection}>
      <div className={styles.stage}>
        <div className={styles.heroScene} />
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent} data-ag-loader-hero-content />

        <div className={styles.redCurtain}>
          <div className={`${styles.imageWindow} ${styles.imageWindowOne}`}>
            <Image src="/transition/project02.png" alt="" fill sizes="100vw" priority />
          </div>

          <div className={`${styles.imageWindow} ${styles.imageWindowTwo}`}>
            <Image src="/transition/project03.png" alt="" fill sizes="70vw" priority />
          </div>

          <div className={`${styles.imageWindow} ${styles.imageWindowThree}`}>
            <Image src="/transition/project01.png" alt="" fill sizes="50vw" priority />
          </div>

          <div className={styles.redSplitOverlay} aria-hidden="true">
            <div className={`${styles.redHalf} ${styles.redHalfLeft}`}>
              <div className={`${styles.redSceneSlice} ${styles.redSceneSliceLeft}`}>
                <div className={styles.redStatementContent}>
                  <div className={styles.statementText}>
                    <p>WE SELL REAL ESTATE THAT</p>
                    <p>EVOKES EMOTION. WE GIVE YOU A</p>
                    <p>NEW SENSE OF SELF</p>
                  </div>
                  <div className={styles.redStatementDetails}>
                    <p>A boutique agency specializing in premium</p>
                    <p>residential and commercial real estate.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className={`${styles.redHalf} ${styles.redHalfRight}`}>
              <div className={`${styles.redSceneSlice} ${styles.redSceneSliceRight}`}>
                <div className={styles.redStatementContent}>
                  <div className={styles.statementText}>
                    <p>WE SELL REAL ESTATE THAT</p>
                    <p>EVOKES EMOTION. WE GIVE YOU A</p>
                    <p>NEW SENSE OF SELF</p>
                  </div>
                  <div className={styles.redStatementDetails}>
                    <p>A boutique agency specializing in premium</p>
                    <p>residential and commercial real estate.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.redTextPanel}>
            <div className={styles.statementText}>
              <p>WE SELL REAL ESTATE THAT</p>
              <p>EVOKES EMOTION. WE GIVE YOU A</p>
              <p>NEW SENSE OF SELF</p>
            </div>
            <div className={styles.redStatementDetails}>
              <p>A boutique agency specializing in premium</p>
              <p>residential and commercial real estate.</p>
            </div>
          </div>
        </div>

        <div className={styles.fixedNavigation}>
          <span>IN NAVIGATION</span>
          <span>CONNECT + NAVIGATION</span>
          <span>EN</span>
        </div>
        <div className={styles.fixedBrandMark}>
          <Image
            className={styles.logoImage}
            src="/ag-logo.png"
            alt="A&G"
            width={420}
            height={142}
          />
        </div>
        <div className={styles.cornerInterface}>
          <span>002</span>
          <span>FAME PROJECT</span>
        </div>
        <div className={styles.centerGuides} aria-hidden="true" />

      </div>
    </section>
  );
}
