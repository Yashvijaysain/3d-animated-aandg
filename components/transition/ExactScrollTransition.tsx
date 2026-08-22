"use client";

import { useEffect, useRef } from "react";
import NextImage from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import styles from "./ExactScrollTransition.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const FRAME_COUNT = 300;
const DESKTOP_FRAME_PATH = "/transition/ezgif-frame-";
const PHONE_FRAME_PATH = "/transition_phone/ezgif-frame-";
const PHONE_BREAKPOINT = 642;

const getFrameSrc = (frame: number, usePhoneFrames: boolean) => {
  const path = usePhoneFrames ? PHONE_FRAME_PATH : DESKTOP_FRAME_PATH;

  return `${path}${String(frame).padStart(3, "0")}.png`;
};

const drawCover = (
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  width: number,
  height: number
) => {
  const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
  const drawWidth = image.naturalWidth * scale;
  const drawHeight = image.naturalHeight * scale;
  const offsetX = (width - drawWidth) / 2;
  const offsetY = (height - drawHeight) / 2;

  context.clearRect(0, 0, width, height);
  context.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
};

export default function ExactScrollTransition() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<Array<HTMLImageElement | undefined>>([]);
  const activeFrameRef = useRef(1);
  const renderFrameRef = useRef<((frame: number) => void) | null>(null);
  const usePhoneFramesRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    let disposed = false;
    let loadGeneration = 0;
    let frameBatchTimer: number | undefined;
    const images = imagesRef.current;

    const loadFrames = (usePhoneFrames: boolean) => {
      loadGeneration += 1;
      const generation = loadGeneration;
      images.length = 0;
      window.clearTimeout(frameBatchTimer);

      const loadFrame = (frame: number) => {
        const image = new Image();
        image.decoding = "async";
        image.src = getFrameSrc(frame, usePhoneFrames);
        image.onload = () => {
          if (!disposed && generation === loadGeneration) {
            renderFrame(activeFrameRef.current);
          }
        };
        images[frame] = image;
      };

      loadFrame(1);

      let nextFrame = 2;
      const loadNextBatch = () => {
        if (disposed || generation !== loadGeneration) {
          return;
        }

        const batchEnd = Math.min(nextFrame + 5, FRAME_COUNT + 1);

        while (nextFrame < batchEnd) {
          loadFrame(nextFrame);
          nextFrame += 1;
        }

        if (nextFrame <= FRAME_COUNT) {
          frameBatchTimer = window.setTimeout(loadNextBatch, 350);
        }
      };

      if (document.readyState === "complete") {
        frameBatchTimer = window.setTimeout(loadNextBatch, 500);
      } else {
        window.addEventListener("load", loadNextBatch, { once: true });
      }
    };

    const renderFrame = (frame: number) => {
      activeFrameRef.current = Math.min(FRAME_COUNT, Math.max(1, frame));
      let image = images[activeFrameRef.current];

      if (!image?.complete || image.naturalWidth === 0) {
        for (let distance = 1; distance < FRAME_COUNT; distance += 1) {
          const previousImage = images[activeFrameRef.current - distance];
          const nextImage = images[activeFrameRef.current + distance];

          if (previousImage?.complete && previousImage.naturalWidth > 0) {
            image = previousImage;
            break;
          }

          if (nextImage?.complete && nextImage.naturalWidth > 0) {
            image = nextImage;
            break;
          }
        }
      }

      if (!image?.complete || image.naturalWidth === 0) {
        return;
      }

      drawCover(context, image, window.innerWidth, window.innerHeight);
    };

    const setCanvasSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.round(window.innerWidth);
      const height = Math.round(window.innerHeight);

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      const shouldUsePhoneFrames = width < PHONE_BREAKPOINT;

      if (shouldUsePhoneFrames !== usePhoneFramesRef.current || images.length === 0) {
        usePhoneFramesRef.current = shouldUsePhoneFrames;
        loadFrames(shouldUsePhoneFrames);
      }

      renderFrame(activeFrameRef.current);
    };

    renderFrameRef.current = renderFrame;
    setCanvasSize();

    window.addEventListener("resize", setCanvasSize);

    return () => {
      disposed = true;
      loadGeneration += 1;
      window.clearTimeout(frameBatchTimer);
      renderFrameRef.current = null;
      window.removeEventListener("resize", setCanvasSize);
    };
  }, []);

  useGSAP(
    () => {
      const section = sectionRef.current;

      if (!section) {
        return;
      }

      const selector = gsap.utils.selector(section);
      const heroLogo = selector(`.${styles.heroLogo}`);
      let renderQueued = false;
      const playhead = { frame: 1 };

      const queueRender = () => {
        if (renderQueued) {
          return;
        }

        renderQueued = true;
        requestAnimationFrame(() => {
          renderQueued = false;
          renderFrameRef.current?.(Math.round(playhead.frame));
        });
      };

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      gsap.set(heroLogo, {
        autoAlpha: 1,
        xPercent: -50,
        y: 0,
        scale: 1,
        transformOrigin: "50% 0%",
        force3D: true
      });

      if (reduced) {
        activeFrameRef.current = FRAME_COUNT;
        renderFrameRef.current?.(FRAME_COUNT);
        return;
      }

      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${window.innerHeight * 5}`,
          pin: true,
          scrub: 0.45,
          anticipatePin: 0.2,
          invalidateOnRefresh: true
        }
      });

      timeline
        .to(playhead, {
          frame: FRAME_COUNT,
          duration: 1,
          onUpdate: queueRender
        }, 0)
        .to(heroLogo, {
          autoAlpha: 0,
          xPercent: -50,
          y: -12,
          scale: 0.96,
          duration: 0.12,
          ease: "power2.in"
        }, 0.88);

      return () => {
        timeline.scrollTrigger?.kill();
        timeline.kill();
      };
    },
    { scope: sectionRef, dependencies: [], revertOnUpdate: true }
  );

  return (
    <section ref={sectionRef} id="home" className={styles.scrollSection}>
      <canvas ref={canvasRef} className={styles.sequenceCanvas} aria-hidden="true" />
      <div className={styles.heroLogo}>
        <NextImage src="/ag-logo.png" alt="A&G Realtors" width={420} height={142} priority />
      </div>
    </section>
  );
}
