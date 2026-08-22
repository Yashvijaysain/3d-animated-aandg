"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

declare global {
  interface Window {
    agLenis?: {
      stop: () => void;
      start: () => void;
      scrollTo: (target: number, options?: { immediate?: boolean }) => void;
    };
  }
}

export const REPLAY_ON_REFRESH = false;

function preloadImage(src: string) {
  return new Promise<void>((resolve) => {
    const image = new window.Image();
    image.onload = () => resolve();
    image.onerror = () => resolve();
    image.src = src;
  });
}

function waitForReady() {
  const fontsReady =
    "fonts" in document ? document.fonts.ready.catch(() => undefined) : Promise.resolve();
  const assetsReady = Promise.all([preloadImage("/transition/hero.png"), preloadImage("/ag-logo.png")]);
  const safety = new Promise<void>((resolve) => window.setTimeout(resolve, 8000));

  return Promise.race([Promise.all([fontsReady, assetsReady]).then(() => undefined), safety]);
}

function present<T>(items: Array<T | null | undefined>) {
  return items.filter(Boolean) as T[];
}

function forceTopScroll() {
  window.history.scrollRestoration = "manual";
  window.agLenis?.scrollTo(0, { immediate: true });
  window.scrollTo(0, 0);
}

export function usePageLoader() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const borderRef = useRef<HTMLDivElement | null>(null);
  const ornamentRef = useRef<HTMLDivElement | null>(null);
  const sideLeftRef = useRef<HTMLDivElement | null>(null);
  const sideRightRef = useRef<HTMLDivElement | null>(null);
  const brandRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const footerRef = useRef<HTMLDivElement | null>(null);
  const archRef = useRef<HTMLDivElement | null>(null);
  const archImageRef = useRef<HTMLDivElement | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      const root = rootRef.current;

      if (!root) {
        return;
      }

      forceTopScroll();

      const shouldSkip = !REPLAY_ON_REFRESH && window.sessionStorage.getItem("ag-loader-seen") === "true";
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const previousOverflow = document.documentElement.style.overflow;
      const previousBodyOverflow = document.body.style.overflow;
      const lenis = window.agLenis;
      const heroContent = gsap.utils.toArray<HTMLElement>("[data-ag-loader-hero-content]");
      const brandItems = brandRef.current ? Array.from(brandRef.current.children) : [];
      const sideItems = present([sideLeftRef.current, sideRightRef.current]);
      const introItems = present([
        borderRef.current,
        ornamentRef.current,
        sideLeftRef.current,
        sideRightRef.current
      ]);
      const exitItems = present([brandRef.current, progressRef.current, footerRef.current]);

      document.documentElement.classList.add("ag-loader-running");
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      lenis?.stop();

      const complete = () => {
        forceTopScroll();
        window.sessionStorage.setItem("ag-loader-seen", "true");
        gsap.set(root, { autoAlpha: 0, pointerEvents: "none" });
        document.documentElement.classList.remove("ag-loader-running");
        document.documentElement.style.overflow = previousOverflow;
        document.body.style.overflow = previousBodyOverflow;
        lenis?.start();
        requestAnimationFrame(forceTopScroll);
        ScrollTrigger.refresh();
      };

      if (shouldSkip || reducedMotion) {
        gsap.set(root, { autoAlpha: 1 });
        if (heroContent.length) {
          gsap.set(heroContent, { autoAlpha: 1, y: 0 });
        }
        gsap.to(root, {
          autoAlpha: 0,
          duration: reducedMotion ? 0.25 : 0.12,
          ease: "power1.out",
          onComplete: complete
        });
        return;
      }

      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: "power3.out" },
        onComplete: complete
      });

      timelineRef.current = tl;

      gsap.set(root, { autoAlpha: 1 });
      gsap.set(borderRef.current, { autoAlpha: 0, scale: 0.985 });
      gsap.set(ornamentRef.current, { autoAlpha: 0, y: -10, scale: 0.88 });
      gsap.set(sideItems, { autoAlpha: 0, letterSpacing: "0.55em" });
      gsap.set(brandItems, { autoAlpha: 0, y: 20 });
      gsap.set(progressRef.current, { autoAlpha: 0, scaleY: 0, transformOrigin: "50% 100%" });
      gsap.set(footerRef.current, { autoAlpha: 0, y: 10 });
      gsap.set(archRef.current, {
        autoAlpha: 0,
        width: "26vw",
        height: "18vh",
        borderTopLeftRadius: "999px",
        borderTopRightRadius: "999px"
      });
      gsap.set(archImageRef.current, { scale: 1, yPercent: 0 });
      if (heroContent.length) {
        gsap.set(heroContent, { autoAlpha: 0, y: 24 });
      }

      tl.addLabel("loaderStart", 0)
        .to(borderRef.current, { autoAlpha: 1, scale: 1, duration: 0.45 }, 0.25)
        .addLabel("borderVisible", 0.25)
        .to(ornamentRef.current, { autoAlpha: 1, y: 0, scale: 1, duration: 0.5 }, 0.35)
        .addLabel("ornamentVisible", 0.35)
        .addLabel("brandAssemblyStart", 0.55)
        .to(sideLeftRef.current, { autoAlpha: 1, letterSpacing: "0.42em", duration: 0.65 }, 0.65)
        .to(sideRightRef.current, { autoAlpha: 1, letterSpacing: "0.42em", duration: 0.65 }, 0.65)
        .addLabel("sideWordsVisible", 0.65)
        .to(brandItems, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.13 }, 0.65)
        .to(progressRef.current, { autoAlpha: 1, scaleY: 1, duration: 0.7 }, 0.85)
        .to(footerRef.current, { autoAlpha: 1, y: 0, duration: 0.42 }, 1.3)
        .addLabel("footerComplete", 1.3)
        .addLabel("brandAssemblyComplete", 1.55)
        .to({}, { duration: 1.2 })
        .addLabel("loaderHold", 2.75)
        .to(exitItems, {
          autoAlpha: 0,
          y: -12,
          duration: 0.38,
          ease: "power2.inOut"
        }, 2.95)
        .to(archRef.current, { autoAlpha: 1, duration: 0.1 }, 3.25)
        .addLabel("archFirstVisible", 3.25)
        .to(archRef.current, {
          width: "26vw",
          height: "18vh",
          duration: 0.18,
          ease: "power2.out"
        }, 3.35)
        .addLabel("archSmall", 3.35)
        .to(archRef.current, {
          width: "34vw",
          height: "82vh",
          duration: 0.7,
          ease: "power2.inOut"
        }, 3.55)
        .addLabel("archTall", 4.05)
        .call(() => {
          const liveHeroContent = gsap.utils.toArray<HTMLElement>("[data-ag-loader-hero-content]");

          if (liveHeroContent.length) {
            gsap.to(liveHeroContent, {
              autoAlpha: 1,
              y: 0,
              duration: 0.62,
              ease: "power2.out"
            });
          }
        }, [], 4.55)
        .addLabel("heroContentStart", 4.55)
        .to(archRef.current, {
          width: "112vw",
          height: "120vh",
          borderTopLeftRadius: "54vw",
          borderTopRightRadius: "54vw",
          duration: 0.92,
          ease: "power2.inOut"
        }, 4.55)
        .to(introItems, {
          autoAlpha: 0,
          duration: 0.35
        }, 4.75)
        .to(archImageRef.current, { scale: 1.04, duration: 0.9, ease: "power1.out" }, 4.55)
        .addLabel("archWide", 4.8)
        .to(root, { autoAlpha: 0, duration: 0.3, ease: "power1.out" }, 5.45)
        .addLabel("heroFullScreen", 5.45)
        .addLabel("loaderRemoved", 5.75);

      waitForReady().then(() => {
        if (timelineRef.current === tl) {
          tl.timeScale(2.4);
          tl.play(0);
        }
      });

      return () => {
        tl.kill();
        timelineRef.current = null;
        complete();
      };
    },
    { scope: rootRef, dependencies: [], revertOnUpdate: true }
  );

  return {
    rootRef,
    borderRef,
    ornamentRef,
    sideLeftRef,
    sideRightRef,
    brandRef,
    progressRef,
    footerRef,
    archRef,
    archImageRef
  };
}
