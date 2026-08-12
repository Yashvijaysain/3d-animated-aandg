"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { contactData } from "@/components/sections/contactData";
import { projects } from "@/data/projects";
import { testimonials } from "@/data/testimonials";
import styles from "@/app/projects/page.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const budgetOptions = [
  { id: "under-2", label: "Under ₹2 Cr", min: 0, max: 2 },
  { id: "2-3", label: "₹2–3 Cr", min: 2, max: 3 },
  { id: "3-5", label: "₹3–5 Cr", min: 3, max: 5 },
  { id: "5-8", label: "₹5–8 Cr", min: 5, max: 8 },
  { id: "8-plus", label: "₹8 Cr+", min: 8, max: Infinity }
];

const categories = [
  {
    id: "family-homes",
    label: "Family Homes",
    image: "/project-details/jade building.webp",
    slugs: ["jade-county", "ivy-county"]
  },
  {
    id: "green-living",
    label: "Green Living",
    image: "/project-details/ivory garden.webp",
    slugs: ["ivory-county", "clove-county"]
  },
  {
    id: "ultra-luxury",
    label: "Ultra Luxury",
    image: "/project-details/107 building.jpg",
    slugs: ["county-107", "ivory-county"]
  },
  {
    id: "low-rise",
    label: "Low-Rise Living",
    image: "/project-details/ivy building.webp",
    slugs: ["ivy-county", "clove-county"]
  },
  {
    id: "investment-picks",
    label: "Investment Picks",
    image: "/project-details/IVORY BANNER.webp",
    slugs: ["county-107", "ivory-county"]
  }
];

function parseStartingPrice(price: string) {
  const raw = price
    .replace(/₹|INR|inr|Cr|CR|cr|From|from|\s|,/g, "")
    .trim();
  const value = Number.parseFloat(raw);
  return Number.isFinite(value) ? value : null;
}

export default function ProjectsDiscoveryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageRef = useRef<HTMLElement | null>(null);

  const [locationFilter, setLocationFilter] = useState(
    searchParams.get("location") ?? ""
  );
  const [typeFilter, setTypeFilter] = useState(
    searchParams.get("type") ?? ""
  );
  const [budgetFilter, setBudgetFilter] = useState(
    searchParams.get("budget") ?? ""
  );
  const [categoryFilter, setCategoryFilter] = useState(
    searchParams.get("category") ?? ""
  );
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  const availableLocations = useMemo(
    () =>
      Array.from(
        new Set(
          projects
            .map((project) => project.location)
            .filter((value) => value && !value.toLowerCase().includes("pending"))
        )
      ),
    []
  );

  const availableTypes = useMemo(
    () =>
      Array.from(
        new Set(
          projects
            .flatMap((project) => project.configurations)
            .filter((value) => value && !value.toLowerCase().includes("pending"))
        )
      ),
    []
  );

  const categoryMap = useMemo(
    () =>
      new Map(categories.map((category) => [category.id, new Set(category.slugs)])),
    []
  );

  useEffect(() => {
    const params = new URLSearchParams();

    if (locationFilter) params.set("location", locationFilter);
    if (typeFilter) params.set("type", typeFilter);
    if (budgetFilter) params.set("budget", budgetFilter);
    if (categoryFilter) params.set("category", categoryFilter);

    const nextPath = params.toString() ? `/projects?${params.toString()}` : "/projects";
    router.replace(nextPath, { scroll: false });
  }, [budgetFilter, categoryFilter, locationFilter, router, typeFilter]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const locationMatch = locationFilter ? project.location === locationFilter : true;
      const typeMatch = typeFilter
        ? project.configurations.some((config) => config === typeFilter)
        : true;
      const budgetMatch = budgetFilter
        ? (() => {
            const value = parseStartingPrice(project.startingPrice);
            const budget = budgetOptions.find((option) => option.id === budgetFilter);
            if (!budget || value === null) {
              return false;
            }
            return value >= budget.min && value < budget.max;
          })()
        : true;
      const categoryMatch = categoryFilter
        ? categoryMap.get(categoryFilter)?.has(project.slug) ?? false
        : true;

      return locationMatch && typeMatch && budgetMatch && categoryMatch;
    });
  }, [budgetFilter, categoryFilter, locationFilter, typeFilter, categoryMap]);

  const revealedQuery = [locationFilter, typeFilter, budgetFilter, categoryFilter].some(Boolean);

  const heroCards = useMemo(
    () => [
      {
        src: "/project-details/IVORY BANNER.webp",
        alt: "Ivory County premium residential statement image",
        className: styles.heroCardLarge
      },
      {
        src: "/project-details/jade building.webp",
        alt: "Jade County architectural elevation",
        className: styles.heroCardTall
      },
      {
        src: "/project-details/ivy inside.webp",
        alt: "Ivy County refined interior perspective",
        className: styles.heroCardStacked
      },
      {
        src: "/project-details/clove garden.webp",
        alt: "Clove County landscaped garden setting",
        className: styles.heroCardVertical
      }
    ],
    []
  );

  const handleClearFilters = useCallback(() => {
    setLocationFilter("");
    setTypeFilter("");
    setBudgetFilter("");
    setCategoryFilter("");
  }, []);

  const handleCategoryClick = useCallback((categoryId: string) => {
    setCategoryFilter((current) => (current === categoryId ? "" : categoryId));
  }, []);

  const scrollToFeatured = useCallback(() => {
    const target = document.getElementById("featured-projects");
    if (!target) {
      return;
    }

    const lenis = (window as unknown as { agLenis?: { scrollTo: (target: HTMLElement, options: { duration: number; offset: number }) => void } }).agLenis;
    if (lenis?.scrollTo) {
      lenis.scrollTo(target, { duration: 1.1, offset: -24 });
    } else {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  useGSAP(
    () => {
      const root = pageRef.current;
      if (!root) {
        return;
      }

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const selector = gsap.utils.selector(root);
      const revealBlocks = selector("[data-reveal]");
      const heroLines = selector("[data-hero-line]");

      gsap.set(revealBlocks, { autoAlpha: 0, y: 32 });
      gsap.set(heroLines, { autoAlpha: 0, yPercent: 105 });

      if (reducedMotion) {
        gsap.set(revealBlocks, { autoAlpha: 1, y: 0 });
        gsap.set(heroLines, { autoAlpha: 1, yPercent: 0 });
        return;
      }

      const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
      timeline.to(heroLines, { autoAlpha: 1, yPercent: 0, duration: 1, stagger: 0.12 }, 0);
      revealBlocks.forEach((element: Element, index) => {
        gsap.to(
          element,
          {
            autoAlpha: 1,
            y: 0,
            duration: 1,
            delay: index === 0 ? 0.2 : 0,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 92%",
              toggleActions: "play none none reverse",
              invalidateOnRefresh: true
            }
          }
        );
      });

      return () => {
        timeline.kill();
      };
    },
    { scope: pageRef }
  );

  const nextTestimonial = useCallback(() => {
    setTestimonialIndex((current) => (current + 1) % testimonials.length);
  }, []);

  const previousTestimonial = useCallback(() => {
    setTestimonialIndex((current) => (current - 1 + testimonials.length) % testimonials.length);
  }, []);

  const testimonial = testimonials[testimonialIndex];

  return (
    <main ref={pageRef} className={styles.projectsPage}>
      <div className={styles.pageInner}>
        <section className={styles.heroSection} aria-labelledby="projects-hero-title">
          <div className={styles.heroText} data-reveal>
            <span className={styles.heroEyebrow}>CURATED BY A&amp;G</span>
            <h1 className={styles.heroTitle} id="projects-hero-title">
              <span className={styles.heroLine} data-hero-line>FIND A HOME</span>
              <span className={styles.heroLine} data-hero-line>THAT FITS</span>
              <span className={styles.heroLine} data-hero-line>
                YOUR <span className={styles.heroAccent}>VISION.</span>
              </span>
            </h1>
            <p className={styles.heroCopy}>
              Explore a curated portfolio of premium residences across Noida, Greater Noida and Gurugram.
            </p>
          </div>

          <div className={styles.heroVisual} data-reveal>
            <div className={styles.collageGrid}>
              {heroCards.map((card) => (
                <div key={card.src} className={`${styles.collageCard} ${card.className}`}>
                  <Image src={card.src} alt={card.alt} fill sizes="(min-width: 1200px) 360px, 90vw" />
                </div>
              ))}
            </div>
          </div>

          <div className={styles.searchPanel} data-reveal>
            <div className={styles.searchField}>
              <label htmlFor="location-filter">Location</label>
              <select
                id="location-filter"
                value={locationFilter}
                onChange={(event) => setLocationFilter(event.target.value)}
                disabled={availableLocations.length === 0}
              >
                <option value="">Select location</option>
                {availableLocations.length === 0 ? (
                  <option value="" disabled>
                    No confirmed locations yet
                  </option>
                ) : (
                  availableLocations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className={styles.searchField}>
              <label htmlFor="type-filter">Property Type</label>
              <select
                id="type-filter"
                value={typeFilter}
                onChange={(event) => setTypeFilter(event.target.value)}
                disabled={availableTypes.length === 0}
              >
                <option value="">Select configuration</option>
                {availableTypes.length === 0 ? (
                  <option value="" disabled>
                    Configuration pending
                  </option>
                ) : (
                  availableTypes.map((configuration) => (
                    <option key={configuration} value={configuration}>
                      {configuration}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className={styles.searchField}>
              <label htmlFor="budget-filter">Budget</label>
              <select
                id="budget-filter"
                value={budgetFilter}
                onChange={(event) => setBudgetFilter(event.target.value)}
              >
                <option value="">Select budget</option>
                {budgetOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <button type="button" className={styles.exploreButton} onClick={scrollToFeatured}>
              EXPLORE
            </button>
          </div>
        </section>

        <section className={styles.categoriesSection} data-reveal aria-labelledby="categories-title">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionEyebrow}>PROPERTY LIFESTYLES</span>
            <div>
              <h2 id="categories-title">Explore by Lifestyle</h2>
              <p>Discover residences shaped around the way you want to live.</p>
            </div>
          </div>

          <div className={styles.categoryScroller}>
            {categories.map((category) => {
              const isActive = categoryFilter === category.id;
              return (
                <button
                  key={category.id}
                  type="button"
                  className={`${styles.categoryItem} ${isActive ? styles.categoryActive : ""}`}
                  onClick={() => handleCategoryClick(category.id)}
                  aria-pressed={isActive}
                >
                  <div className={styles.categoryImage}>
                    <Image src={category.image} alt={category.label} fill sizes="120px" />
                  </div>
                  <span>{category.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section className={styles.featuredSection} id="featured-projects" data-reveal aria-labelledby="featured-title">
          <div className={styles.sectionHeaderWide}>
            <div>
              <span className={styles.sectionEyebrow}>FEATURED COLLECTION</span>
              <h2 id="featured-title">Featured Projects</h2>
            </div>
            <p>A curated selection of exceptional addresses across NCR.</p>
          </div>

          <div className={styles.filterSummary}>
            <p>
              Showing <strong>{filteredProjects.length}</strong> of <strong>{projects.length}</strong> offerings.
            </p>
            {revealedQuery ? (
              <button type="button" className={styles.clearButton} onClick={handleClearFilters}>
                Clear filters
              </button>
            ) : null}
          </div>

          <div className={styles.featuredGrid}>
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <Link key={project.slug} href={`/projects/${project.slug}`} className={styles.projectCard}>
                  <div className={styles.projectImageWrap}>
                    <Image
                      src={project.heroImage}
                      alt={project.name}
                      fill
                      sizes="(min-width: 1200px) 280px, (min-width: 700px) 40vw, 90vw"
                    />
                  </div>
                  <div className={styles.projectBody}>
                    <div className={styles.projectBadge}>{project.status}</div>
                    <h3>{project.name}</h3>
                    <p>{project.shortDescription}</p>
                    <div className={styles.projectMeta}>
                      <span>{project.location}</span>
                      <span>{project.configurations[0]}</span>
                    </div>
                    <div className={styles.cardFooter}>
                      <span>{project.startingPrice}</span>
                      <span className={styles.cardArrow}>VIEW PROJECT →</span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className={styles.emptyState}>
                <p>No projects match the selected filters yet. Adjust your budget or lifestyle selections.</p>
              </div>
            )}
          </div>
        </section>

        <section className={styles.advisorySection} data-reveal aria-labelledby="advisory-title">
          <div className={styles.advisoryCopy}>
            <span className={styles.sectionEyebrow}>WHY A&G</span>
            <h2 id="advisory-title">Advisory that elevates every property choice.</h2>
            <p>
              We combine local market expertise, curated destinations and hands-on support so every selection feels
              precise, polished and purposeful.
            </p>

            <div className={styles.advisoryGrid}>
              <article className={styles.advisoryCard}>
                <div className={styles.advisoryIcon} aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M4 15.5V8.5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v7" />
                    <path d="M8 15.5V19h8v-3.5" />
                    <path d="M10 11h4" />
                  </svg>
                </div>
                <h3>CURATED PROJECTS</h3>
                <p>Only carefully selected developments aligned with premium buyer requirements.</p>
              </article>

              <article className={styles.advisoryCard}>
                <div className={styles.advisoryIcon} aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M12 5.5V3.5" />
                    <path d="M8 6.5l-.64-1.3" />
                    <path d="M16 6.5l.64-1.3" />
                    <path d="M8 17.5l-1.5 2.6" />
                    <path d="M16 17.5l1.5 2.6" />
                    <path d="M16 10.5a4 4 0 1 1-8 0" />
                  </svg>
                </div>
                <h3>EXPERT ADVISORY</h3>
                <p>Guidance across location, developer, configuration and investment potential.</p>
              </article>

              <article className={styles.advisoryCard}>
                <div className={styles.advisoryIcon} aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M12 3.5c4.69 0 8.5 3.81 8.5 8.5S16.69 20.5 12 20.5 3.5 16.69 3.5 12 7.31 3.5 12 3.5Z" />
                    <path d="M12 7.5v5.5l3.5 1.9" />
                  </svg>
                </div>
                <h3>END-TO-END SUPPORT</h3>
                <p>From discovery and comparison to site visits and transaction support.</p>
              </article>
            </div>
          </div>

          <div className={styles.advisoryImageWrap}>
            <Image
              src="/project-details/107 balcony view.jpg"
              alt="Luxury balcony view overlooking the project landscape"
              fill
              sizes="(min-width: 1200px) 620px, 90vw"
            />
          </div>
        </section>

        <section className={styles.ctaSection} data-reveal>
          <div className={styles.ctaInner}>
            <span className={styles.sectionEyebrow}>CAN&apos;T DECIDE?</span>
            <h2>LET US NARROW IT DOWN.</h2>
            <p>
              Tell us what matters most—location, lifestyle, configuration or budget—and our advisors will curate the
              right options for you.
            </p>
            <a className={styles.ctaButton} href={contactData.whatsappHref} target="_blank" rel="noreferrer">
              SPEAK TO AN ADVISOR →
            </a>
          </div>
        </section>

        <section className={styles.testimonialSection} data-reveal aria-labelledby="testimonial-title">
          <div className={styles.testimonialIntro}>
            <span className={styles.sectionEyebrow}>WHAT OUR CLIENTS SAY</span>
            <h2 id="testimonial-title">Trusted guidance. Better property decisions.</h2>
          </div>

          <div className={styles.testimonialCardWrap}>
            <article className={styles.testimonialCard}>
              <span className={styles.quoteMark} aria-hidden="true">
                “
              </span>
              <p>{testimonial.review}</p>
              <footer className={styles.testimonialFooter}>
                <strong>{testimonial.name}</strong>
                {testimonial.project ? <span>{testimonial.project}</span> : null}
                {testimonial.location ? <span>{testimonial.location}</span> : null}
              </footer>
            </article>

            {testimonials.length > 1 ? (
              <div className={styles.testimonialNav}>
                <button type="button" onClick={previousTestimonial} aria-label="Previous testimonial">
                  ←
                </button>
                <button type="button" onClick={nextTestimonial} aria-label="Next testimonial">
                  →
                </button>
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}
