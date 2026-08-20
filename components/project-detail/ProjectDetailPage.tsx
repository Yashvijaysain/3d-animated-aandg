"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { projects, type Project } from "@/data/projects";
import EnquiryForm from "@/components/forms/EnquiryForm";
import PropertyFinder from "@/components/property-finder/PropertyFinder";
import CompareButton from "@/components/project-comparison/CompareButton";
import BrochureCta from "./BrochureCta";
import styles from "./ProjectDetailPage.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Props = {
  project: Project;
  relatedProjects: Project[];
};

export default function ProjectDetailPage({ project, relatedProjects }: Props) {
  const rootRef = useRef<HTMLElement | null>(null);
  const featuresRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const root = rootRef.current;

      if (!root) {
        return;
      }

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const selector = gsap.utils.selector(root);

      gsap.set(selector("[data-reveal]"), { autoAlpha: 1, clearProps: "transform,clipPath" });

      if (reduced) {
        return;
      }

      const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });

      gsap.set(selector("[data-hero-nav]"), { autoAlpha: 0, y: -12 });
      gsap.set(selector("[data-heading-line]"), { autoAlpha: 0, yPercent: 105 });
      gsap.set(selector("[data-hero-copy]"), { autoAlpha: 0, y: 22 });
      gsap.set(selector("[data-hero-actions]"), { autoAlpha: 0, y: 16 });
      gsap.set(selector("[data-project-card='left']"), { autoAlpha: 0, x: -70, y: 40, rotation: -18 });
      gsap.set(selector("[data-project-card='right']"), { autoAlpha: 0, x: 70, y: 40, rotation: 18 });
      gsap.set(selector("[data-project-card='center']"), { autoAlpha: 0, y: 62, scale: 0.96 });
      gsap.set(selector("[data-explore]"), { autoAlpha: 0, scale: 0.84 });

      heroTl
        .to(selector("[data-hero-nav]"), { autoAlpha: 1, y: 0, duration: 0.45 })
        .to(selector("[data-heading-line]"), { autoAlpha: 1, yPercent: 0, duration: 0.72, stagger: 0.09 }, 0.12)
        .to(selector("[data-hero-copy]"), { autoAlpha: 1, y: 0, duration: 0.55 }, 0.34)
        .to(selector("[data-hero-actions]"), { autoAlpha: 1, y: 0, duration: 0.45 }, 0.46)
        .to(selector("[data-project-card='left']"), { autoAlpha: 1, x: 0, y: 0, rotation: -12, duration: 0.72 }, 0.68)
        .to(selector("[data-project-card='right']"), { autoAlpha: 1, x: 0, y: 0, rotation: 11, duration: 0.72 }, 0.78)
        .to(selector("[data-project-card='center']"), { autoAlpha: 1, y: 0, scale: 1, duration: 0.72 }, 0.9)
        .to(selector("[data-explore]"), { autoAlpha: 1, scale: 1, duration: 0.5 }, 1.05);

      selector("[data-scroll-reveal]").forEach((element) => {
        gsap.fromTo(
          element,
          { autoAlpha: 0, y: 46, clipPath: "inset(0% 0% 16% 0%)" },
          {
            autoAlpha: 1,
            y: 0,
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 0.75,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 82%"
            }
          }
        );
      });

      return () => {
        ScrollTrigger.getAll().forEach((trigger) => {
          if (root.contains(trigger.trigger as Node)) {
            trigger.kill();
          }
        });
      };
    },
    { scope: rootRef }
  );

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main ref={rootRef} className={styles.page}>
      <section className={styles.hero}>
        <header className={styles.header} data-hero-nav>
          <Link className={styles.logoLink} href="/" aria-label="A&G Realtors home">
            <Image src="/ag-logo.png" alt="A&G" width={420} height={142} priority />
          </Link>
          <nav aria-label="Project detail navigation">
            <a href="#features">Highlights</a>
            <a href="#gallery">Gallery</a>
            <a href="#location">Location</a>
            <a href="#enquiry">Visit</a>
          </nav>
          <a className={styles.headerCta} href="#enquiry">
            Book Visit
          </a>
        </header>

        <div className={styles.heroGrid}>
          <h1 className={styles.headingWrap}>
            <span className={styles.visuallyHidden}>{project.name}, {project.location}</span>
            {project.name
              .replace(" ", "\n")
              .split("\n")
              .concat(["Residency"])
              .map((line) => (
                <span key={line} className={styles.headingLineWrap} aria-hidden="true">
                  <span data-heading-line>{line}</span>
                </span>
              ))}
          </h1>

          <aside className={styles.heroCopy}>
            <p data-hero-copy>{project.shortDescription}</p>
            <dl data-hero-copy>
              <div>
                <dt>Location</dt>
                <dd>{project.location}</dd>
              </div>
              <div>
                <dt>Starting Price</dt>
                <dd>{project.startingPrice}</dd>
              </div>
            </dl>
            <div className={styles.heroActions} data-hero-actions>
              <a href="#enquiry">Book A Site Visit</a>
              <BrochureCta
                projectName={project.name}
                projectSlug={project.slug}
                brochureUrl={project.brochureUrl}
                mode="view"
                className={styles.brochureCta}
              />
              <CompareButton projectSlug={project.slug} />
            </div>
          </aside>
        </div>

        <div className={styles.awardNote} data-reveal>
          <span>Premium project advisory</span>
          <strong>{project.status}</strong>
        </div>

        <div className={styles.cardStage} aria-label={`${project.name} imagery`}>
          <figure className={`${styles.heroCard} ${styles.leftCard}`} data-project-card="left">
            <Image src={project.cardImages[0]} alt={`${project.name} visual one`} fill sizes="28vw" priority />
          </figure>
          <figure className={`${styles.heroCard} ${styles.centerCard}`} data-project-card="center">
            <Image src={project.cardImages[1]} alt={`${project.name} visual two`} fill sizes="34vw" priority />
          </figure>
          <figure className={`${styles.heroCard} ${styles.rightCard}`} data-project-card="right">
            <Image src={project.cardImages[2]} alt={`${project.name} visual three`} fill sizes="28vw" priority />
          </figure>
        </div>

        <button className={styles.exploreCircle} type="button" onClick={scrollToFeatures} data-explore aria-label="Explore project highlights">
          <span className={styles.circleText}>Explore More * Explore More *</span>
          <span className={styles.arrow}>↓</span>
        </button>
      </section>

      <section ref={featuresRef} id="features" className={styles.features}>
        <div className={styles.featureCopy} data-scroll-reveal>
          <span className={styles.eyebrow}>Project Highlights</span>
          <h2>Everything You Need in One Landmark Address</h2>
          <p>{project.tagline}</p>
          <div className={styles.sectionActions}>
            <a href="#enquiry">Book A Site Visit</a>
            <BrochureCta
              projectName={project.name}
              projectSlug={project.slug}
              brochureUrl={project.brochureUrl}
              mode="download"
              className={styles.brochureCta}
            />
          </div>
        </div>
        <div className={styles.featureGrid}>
          {project.highlights.slice(0, 4).map((highlight, index) => (
            <article className={`${styles.featureCard} ${index === 1 ? styles.highlightCard : ""}`} key={highlight.title} data-scroll-reveal>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{highlight.title}</h3>
              <p>{highlight.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.about} data-scroll-reveal>
        <span className={styles.sectionNumber}>02</span>
        <div>
          <span className={styles.eyebrow}>About the Project</span>
          <h2>About {project.name}</h2>
        </div>
        <p>{project.fullDescription}</p>
      </section>

      <section className={styles.statistics}>
        {project.statistics.map((stat) => (
          <div key={stat.label} data-scroll-reveal>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </section>

      <section id="gallery" className={styles.gallery}>
        <div data-scroll-reveal>
          <span className={styles.eyebrow}>Gallery</span>
          <h2>Project Views</h2>
        </div>
        <div className={styles.galleryGrid}>
          {project.gallery.slice(0, 4).map((image, index) => (
            <figure className={index === 0 ? styles.galleryLarge : index === 3 ? styles.galleryWide : ""} key={image} data-scroll-reveal>
              <Image src={image} alt={`${project.name} gallery ${index + 1}`} fill sizes="(max-width: 700px) 92vw, 50vw" />
            </figure>
          ))}
        </div>
      </section>

      <section className={styles.amenities} data-scroll-reveal>
        <span className={styles.eyebrow}>Amenities</span>
        <h2>Designed for Daily Comfort</h2>
        <div>
          {project.amenities.map((amenity) => (
            <span key={amenity}>{amenity}</span>
          ))}
        </div>
      </section>

      <PropertyFinder currentProject={project} projects={projects} />

      {project.floorPlans?.length ? (
        <section id="floor-plans" className={styles.floorPlans}>
          <span className={styles.eyebrow}>Plans</span>
          <h2>Available Configurations</h2>
          <div>
            {project.floorPlans.map((plan) => (
              <article key={plan.title} data-scroll-reveal>
                <div>
                  <h3>{plan.title}</h3>
                  <p>{plan.size}</p>
                  <button type="button">Request Details</button>
                </div>
                <figure>
                  <Image src={plan.image} alt={`${project.name} ${plan.title}`} fill sizes="(max-width: 700px) 90vw, 34vw" />
                </figure>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section id="location" className={styles.location}>
        <div data-scroll-reveal>
          <span className={styles.eyebrow}>Location</span>
          <h2>{project.location}</h2>
        </div>
        <div className={styles.connectivity}>
          {project.connectivity.map((item) => (
            <div key={item.destination} data-scroll-reveal>
              <span>{item.destination}</span>
              <strong>{item.distance}</strong>
            </div>
          ))}
        </div>
      </section>

      <section id="enquiry" className={styles.enquiry} data-compare-bar-avoid>
        <div data-scroll-reveal>
          <span className={styles.eyebrow}>Private Presentation</span>
          <h2>Book A Private Project Presentation</h2>
          <p>Selected project: {project.name}</p>
        </div>
        <div data-scroll-reveal>
          <EnquiryForm projectName={project.name} projectSlug={project.slug} sourcePage={`/projects/${project.slug}`} />
        </div>
      </section>

      <section className={styles.related}>
        <span className={styles.eyebrow}>Related Projects</span>
        <h2>Explore More Addresses</h2>
        <div>
          {relatedProjects.map((related) => (
            <Link href={`/projects/${related.slug}`} key={related.slug} data-scroll-reveal>
              <Image src={related.heroImage} alt={related.name} fill sizes="(max-width: 700px) 90vw, 28vw" />
              <span>{related.startingPrice}</span>
              <strong>{related.name}</strong>
            </Link>
          ))}
        </div>
      </section>

    </main>
  );
}
