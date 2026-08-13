"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { contactData } from "./contactData";
import styles from "./ContactSection.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type LenisWindow = Window & {
  agLenis?: {
    scrollTo: (target: number, options?: { immediate?: boolean }) => void;
  };
};

const phoneCharacters = Array.from(contactData.phoneDisplay);

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const contactBackgroundRef = useRef<HTMLDivElement | null>(null);
  const imageFrameRef = useRef<HTMLDivElement | null>(null);
  const circularBrandRef = useRef<HTMLDivElement | null>(null);
  const topCtaRef = useRef<HTMLDivElement | null>(null);
  const contactOrnamentRef = useRef<HTMLDivElement | null>(null);
  const officeAddressRef = useRef<HTMLElement | null>(null);
  const sideProgressRef = useRef<HTMLDivElement | null>(null);
  const backToTopRef = useRef<HTMLAnchorElement | null>(null);
  const bottomLeftRef = useRef<HTMLDivElement | null>(null);
  const bottomRightRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      if (
        !sectionRef.current ||
        !contactBackgroundRef.current ||
        !imageFrameRef.current ||
        !circularBrandRef.current ||
        !topCtaRef.current ||
        !contactOrnamentRef.current ||
        !officeAddressRef.current ||
        !sideProgressRef.current ||
        !backToTopRef.current ||
        !bottomLeftRef.current ||
        !bottomRightRef.current
      ) {
        return;
      }

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const isMobile = window.matchMedia("(max-width: 767px)").matches;
      const isTablet = window.matchMedia("(max-width: 1180px)").matches;
      const finalBannerWidth = isMobile ? "86vw" : isTablet ? "72vw" : "58vw";
      const finalBannerHeight = isMobile ? "16svh" : "14svh";
      const phoneCharacterNodes = gsap.utils.toArray<HTMLElement>("[data-phone-character]");

      gsap.set(contactBackgroundRef.current, {
        yPercent: reduceMotion ? 0 : 100,
        autoAlpha: 1,
        force3D: true,
      });
      gsap.set(imageFrameRef.current, {
        width: reduceMotion ? finalBannerWidth : "100vw",
        height: reduceMotion ? finalBannerHeight : "100svh",
        top: 0,
      });
      gsap.set([circularBrandRef.current, topCtaRef.current], {
        autoAlpha: 1,
      });
      gsap.set([contactOrnamentRef.current, officeAddressRef.current, sideProgressRef.current], {
        autoAlpha: reduceMotion ? 1 : 0,
      });
      gsap.set(phoneCharacterNodes, {
        yPercent: reduceMotion ? 0 : 115,
        autoAlpha: reduceMotion ? 1 : 0,
      });
      gsap.set([bottomLeftRef.current, bottomRightRef.current, backToTopRef.current], {
        autoAlpha: reduceMotion ? 1 : 0,
        y: reduceMotion ? 0 : 14,
      });

      if (reduceMotion) {
        requestAnimationFrame(() => ScrollTrigger.refresh());
        return;
      }

      const timeline = gsap.timeline({
        scrollTrigger: {
          id: "contact-section",
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${window.innerHeight * (isMobile ? 1.55 : 2.7)}`,
          pin: true,
          scrub: 0.25,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      timeline
        .addLabel("contactImageFull", 0)
        .to({}, { duration: 0.14 })
        .addLabel("contactPageEnter")
        .to(
          contactBackgroundRef.current,
          {
            yPercent: 0,
            duration: 0.34,
            ease: "power3.inOut",
            force3D: true,
          },
          "contactPageEnter",
        )
        .to(
          imageFrameRef.current,
          {
            width: finalBannerWidth,
            height: finalBannerHeight,
            duration: 0.46,
            ease: "power3.inOut",
          },
          "contactPageEnter+=0.05",
        )
        .addLabel("contactBannerComplete")
        .to(
          sideProgressRef.current,
          {
            autoAlpha: isMobile ? 0.55 : 1,
            duration: 0.14,
            ease: "power2.out",
          },
          "contactBannerComplete-=0.08",
        )
        .fromTo(
          contactOrnamentRef.current,
          {
            autoAlpha: 0,
            scale: 0.7,
            rotation: -12,
          },
          {
            autoAlpha: 1,
            scale: 1,
            rotation: 0,
            duration: 0.22,
            ease: "power3.out",
          },
          "contactBannerComplete",
        )
        .addLabel("contactContentStart")
        .to(
          phoneCharacterNodes,
          {
            yPercent: 0,
            autoAlpha: 1,
            duration: 0.28,
            ease: "power3.out",
            stagger: {
              each: 0.035,
              from: "start",
            },
          },
          "contactContentStart+=0.04",
        )
        .fromTo(
          officeAddressRef.current,
          {
            autoAlpha: 0,
            y: 10,
          },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.2,
            ease: "power3.out",
          },
          "contactContentStart+=0.2",
        )
        .to(
          [bottomLeftRef.current, bottomRightRef.current, backToTopRef.current],
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.22,
            ease: "power3.out",
            stagger: 0.04,
          },
          "contactContentStart+=0.24",
        )
        .addLabel("contactComplete")
        .to({}, { duration: 0.35 });

      document.fonts.ready.then(() => {
        ScrollTrigger.refresh();
      });

      return () => {
        timeline.scrollTrigger?.kill();
        timeline.kill();
      };
    },
    { scope: sectionRef },
  );

  const handleBackToTop = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const lenis = (window as unknown as LenisWindow).agLenis;

    if (lenis?.scrollTo) {
      lenis.scrollTo(0);
      return;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section ref={sectionRef} id="contact" className={styles.contactSection} aria-labelledby="contact-title">
      <div className={styles.contactStage}>
        <div ref={contactBackgroundRef} className={styles.contactBackground} />

        <div ref={imageFrameRef} className={styles.imageFrame}>
          <div className={styles.imageCanvas}>
            <Image
              src="/images/contact/contact-hero.jpg"
              alt="Luxury A&G residence"
              fill
              priority={false}
              sizes="100vw"
              className={styles.contactImage}
            />
            <div className={styles.imageOverlay} />
          </div>
        </div>

        <div className={styles.topInterface}>
          <div ref={circularBrandRef} className={styles.circularBrand} aria-label={contactData.companyName}>
           
            <span className={styles.circularCore}></span>
          </div>

          <div ref={topCtaRef} className={styles.topCta}>
            <span className={styles.ctaEyebrow}>Book a private</span>
            <span className={styles.ctaTitle}>Consultation</span>
            <span className={styles.ctaLinks}>
              <a href={contactData.phoneHref} aria-label={`Call ${contactData.companyName}`}>
                Call
              </a>
              <span aria-hidden="true">/</span>
              <a href={contactData.whatsappHref} target="_blank" rel="noreferrer" aria-label={`WhatsApp ${contactData.companyName}`}>
                WhatsApp
              </a>
              <span aria-hidden="true">/</span>
              <a href={`mailto:${contactData.email}`} aria-label={`Email ${contactData.companyName}`}>
                Email
              </a>
            </span>
          </div>
        </div>

        <div className={styles.mainContent}>
          <div ref={contactOrnamentRef} className={styles.contactOrnament} aria-hidden="true">
            A&amp;G
          </div>

          <a id="contact-title" href={contactData.phoneHref} className={styles.phoneNumber} aria-label={`Call ${contactData.phoneDisplay}`}>
            {phoneCharacters.map((character, index) => (
              <span key={`${character}-${index}`} className={styles.phoneCharacterGroup}>
                <span className={styles.phoneCharacterWrapper}>
                  <span className={styles.phoneCharacter} data-phone-character>
                    {character === " " ? "\u00A0" : character}
                  </span>
                </span>
              </span>
            ))}
          </a>

          <address ref={officeAddressRef} className={styles.officeAddress}>
            {contactData.addressLines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </address>
        </div>

        <div ref={sideProgressRef} className={styles.sideProgress} aria-hidden="true">
          <span className={styles.progressLine} />
          <span className={styles.progressValue}>100</span>
        </div>

        <a ref={backToTopRef} href="#top" className={styles.backToTop} onClick={handleBackToTop} aria-label="Back to top">
          <span aria-hidden="true">&#8593;</span>
          To top
        </a>

        <div ref={bottomLeftRef} className={styles.bottomLeft}>
          <span>{contactData.companyName}.</span>
          <span>{contactData.legalName}</span>
          <span>&copy;2026 All Rights Reserved</span>
          <span className={styles.policyLinks}>
            <a href="/privacy-policy">Privacy Policy</a>
            <a href="/terms-of-use">Terms of Use</a>
          </span>
        </div>

        <div ref={bottomRightRef} className={styles.bottomRight}>
          <a href={contactData.websiteHref} target="_blank" rel="noreferrer">
            {contactData.website}
          </a>
        </div>
      </div>
    </section>
  );
}
