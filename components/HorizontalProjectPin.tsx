"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Project, projects } from "@/data/projects";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const cardTransition = {
  duration: 0.5,
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number]
};

function ProjectCard({ project }: { project: Project }) {
  const [isHovered, setIsHovered] = useState(false);
  const infoItems = [
    {
      label: "Configuration",
      value: project.configurations[0]
    },
    {
      label: "Status",
      value: project.status
    }
  ];

  return (
    <motion.article
      className="project-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsHovered(false);
        }
      }}
      onTouchStart={() => setIsHovered(true)}
      animate={{
        y: isHovered ? -10 : 0,
        scale: isHovered ? 1.015 : 1,
        boxShadow: isHovered
          ? "0 30px 70px rgba(0, 0, 0, 0.28), 0 10px 25px rgba(0, 0, 0, 0.14)"
          : "0 42px 92px rgba(10, 9, 7, 0.28), 0 12px 32px rgba(10, 9, 7, 0.2)"
      }}
      transition={cardTransition}
    >
      <motion.div
        className="defaultFace"
        aria-hidden={isHovered}
        animate={{
          opacity: isHovered ? 0 : 1,
          scale: isHovered ? 1.04 : 1
        }}
        transition={cardTransition}
      >
        <Image
          className="project-image"
          src={project.heroImage}
          alt={`${project.name} property`}
          fill
          sizes="(max-width: 699px) 86vw, 380px"
          priority={false}
        />
        <div className="project-scrim" />
        <div className="project-content">
          <div className="project-dots project-text-transition" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <Image
            className="project-logo project-text-transition"
            src={project.logo}
            alt=""
            width={108}
            height={48}
          />
          <div className="project-heading">
            <h2 className="project-text-transition">{project.name}</h2>
            <span className="price-pill project-text-transition">{project.startingPrice}</span>
          </div>
          <p className="project-description project-text-transition">{project.shortDescription}</p>
          <div className="project-badges project-text-transition">
            {[project.status, project.configurations[0]].map((badge) => (
              <span className="badge" key={badge}>
                {badge}
              </span>
            ))}
          </div>
          <Link
            className="project-cta project-text-transition"
            href={`/projects/${project.slug}`}
            aria-label={`Book ${project.name}`}
            tabIndex={isHovered ? -1 : 0}
          >
            Book Now
                      </Link>
        </div>
      </motion.div>

      <motion.div
        className="hoverFace"
        aria-hidden={!isHovered}
        animate={{
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1 : 0.96,
          visibility: isHovered ? "visible" : "hidden"
        }}
        transition={cardTransition}
      >
        <div className="hoverImage">
          <motion.div
            className="hoverImageScale"
            animate={{ scale: isHovered ? 1 : 1.08 }}
            transition={cardTransition}
          >
            <Image
              src={project.heroImage}
              alt={`${project.name} property`}
              fill
              sizes="(max-width: 699px) 86vw, 380px"
            />
          </motion.div>
        </div>

        <motion.div
          className="hoverCopy"
          animate={{ y: isHovered ? 0 : 14, opacity: isHovered ? 1 : 0 }}
          transition={{ ...cardTransition, delay: isHovered ? 0.08 : 0 }}
        >
          <h2>{project.name}</h2>
          <p className="hoverPrice">{project.startingPrice}</p>
          <p className="hoverDescription">{project.shortDescription}</p>
        </motion.div>

        <motion.div
          className="infoGrid"
          animate={{ y: isHovered ? 0 : 12, opacity: isHovered ? 1 : 0 }}
          transition={{ ...cardTransition, delay: isHovered ? 0.16 : 0 }}
        >
          {infoItems.map((item) => (
            <div className="infoBox" key={item.label}>
              <span className="infoLabel">{item.label}</span>
              <span className="infoValue">{item.value}</span>
            </div>
          ))}
        </motion.div>

        <motion.div
          className="hoverAction"
          animate={{ y: isHovered ? 0 : 10, opacity: isHovered ? 1 : 0 }}
          transition={{ ...cardTransition, delay: isHovered ? 0.22 : 0 }}
        >
          <Link
            className="project-cta hoverCta"
            href={`/projects/${project.slug}`}
            aria-label={`Book ${project.name}`}
            tabIndex={isHovered ? 0 : -1}
          >
            Book Now
          </Link>
        </motion.div>
      </motion.div>
    </motion.article>
  );
}

export default function HorizontalProjectPin() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;

      if (!section) {
        return;
      }

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const selector = gsap.utils.selector(section);
      const pinWrap = selector(".pin-wrap")[0] as HTMLElement | undefined;
      const introText = selector(".project-section-intro > *");
      const cards = selector(".project-card");
      const textGroups = cards.map((card) =>
        gsap.utils.toArray<HTMLElement>(".project-text-transition", card as Element)
      );

      gsap.set([pinWrap, introText, textGroups.flat()].filter(Boolean), {
        autoAlpha: 1,
        clearProps: "transform,clipPath"
      });

      if (reduced || !pinWrap) {
        return;
      }

      gsap.set(pinWrap, {
        x: 0,
        force3D: true
      });

      const scrollDistance = Math.max(
        pinWrap.scrollWidth - window.innerWidth + window.innerHeight,
        window.innerHeight * 2.5
      );
      const sectionHeight = `${scrollDistance + window.innerHeight}px`;
      section.style.minHeight = sectionHeight;
      gsap.set(section, {
        minHeight: sectionHeight
      });

      const horizontalTween = gsap.to(pinWrap, {
        x: () => Math.min(0, window.innerWidth - pinWrap.scrollWidth),
        ease: "none",
        force3D: true,
        scrollTrigger: {
          id: "featured-projects-horizontal",
          trigger: section,
          start: "top top",
          end: () => `+=${scrollDistance}`,
          pin: ".pin-wrap-sticky",
          pinSpacing: true,
          anticipatePin: 0.5,
          scrub: 0.18,
          invalidateOnRefresh: true
        }
      });

      gsap.set(introText, {
        autoAlpha: 0,
        y: 28,
        clipPath: "inset(0% 0% 100% 0%)"
      });

      textGroups.forEach((group) => {
        gsap.set(group, {
          autoAlpha: 0,
          y: 26,
          clipPath: "inset(0% 0% 100% 0%)"
        });
      });

      const introTimeline = gsap.timeline({
        defaults: {
          ease: "power3.out"
        },
        scrollTrigger: {
          id: "project-section-intro-reveal",
          trigger: section,
          start: "top bottom",
          end: "top center",
          scrub: 0.3,
          invalidateOnRefresh: true
        }
      });

      introTimeline.to(introText, {
        autoAlpha: 1,
        y: 0,
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 1,
        stagger: 0.08
      });

      const tl = gsap.timeline({
        defaults: {
          ease: "power3.out"
        },
        scrollTrigger: {
          id: "project-card-text-transition",
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.35,
          invalidateOnRefresh: true
        }
      });

      textGroups.forEach((group, index) => {
        const enterAt = 0.14 + index * 0.16;

        tl.to(
          group,
          {
            autoAlpha: 1,
            y: 0,
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 0.16,
            stagger: 0.025
          },
          enterAt
        ).to(
          group,
          {
            autoAlpha: 0.72,
            y: -12,
            duration: 0.14,
            stagger: 0.012
          },
          enterAt + 0.22
        );
      });

      return () => {
        horizontalTween.scrollTrigger?.kill();
        horizontalTween.kill();
        introTimeline.scrollTrigger?.kill();
        introTimeline.kill();
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} id="projects" aria-label="Featured projects">
      <div className="pin-wrap-sticky">
        <div className="pin-wrap">
          <div className="project-section-intro">
            <span>Featured Collection</span>
            <h2>Projects Built Around A Sense Of Place</h2>
          </div>

          {projects.map((project) => (
            <ProjectCard project={project} key={project.slug} />
          ))}
        </div>
      </div>
    </section>
  );
}
