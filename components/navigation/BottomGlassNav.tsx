"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type CSSProperties, type MouseEvent } from "react";
import styles from "./BottomGlassNav.module.css";

type NavItem = {
  label: string;
  href: string;
  icon: (props: React.SVGProps<SVGSVGElement>) => React.ReactElement;
};

type LenisWindow = Window & {
  agLenis?: {
    scrollTo: (
      target: number | HTMLElement | string,
      options?: { immediate?: boolean; offset?: number; duration?: number },
    ) => void;
  };
};

function HomeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.95" {...props}>
      <path d="M3 10.75 12 3l9 7.75" />
      <path d="M6.5 9.5V21h11V9.5" />
    </svg>
  );
}

function Building2Icon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.95" {...props}>
      <path d="M4 21V7.5a1.5 1.5 0 0 1 1.5-1.5H10V3h4v3h4.5A1.5 1.5 0 0 1 20 7.5V21" />
      <path d="M8 21v-4h8v4" />
      <path d="M8 11h2.5v2.5H8zM13.5 11H16v2.5h-2.5z" />
    </svg>
  );
}

function ImagesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.95" {...props}>
      <rect x="3.5" y="4.5" width="11" height="9" rx="1.4" />
      <path d="M14.5 7.5h6A1.5 1.5 0 0 1 22 9v9.5A1.5 1.5 0 0 1 20.5 20h-9A1.5 1.5 0 0 1 10 18.5v-3" />
      <path d="M7.5 10.5 9.25 8.75l2.75 2.75" />
      <circle cx="8.5" cy="8.5" r="1" />
    </svg>
  );
}

function MessageCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.95" {...props}>
      <path d="M7 8.25h10" />
      <path d="M7 12h7" />
      <path d="M4.5 4.5h15A1.5 1.5 0 0 1 21 6v8.5a1.5 1.5 0 0 1-1.5 1.5H8l-4 3V6A1.5 1.5 0 0 1 4.5 4.5Z" />
    </svg>
  );
}

function getActiveIndex(pathname: string) {
  if (pathname.startsWith("/projects")) {
    return 1;
  }

  return 0;
}

export default function BottomGlassNav() {
  const pathname = usePathname();
  const normalizedPathname = pathname?.replace(/\/$/, "") || "/";
  const [activeIndex, setActiveIndex] = useState(() => getActiveIndex(normalizedPathname));
  const [isLoaderVisible, setIsLoaderVisible] = useState(true);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 599px)").matches;
  const routeLockedIndex = normalizedPathname.startsWith("/projects") && normalizedPathname !== "/projects" ? 1 : null;
  const effectiveActiveIndex = routeLockedIndex ?? activeIndex;

  const navItems: NavItem[] = [
    { label: "Home", href: "/", icon: HomeIcon },
    { label: "Projects", href: "/projects", icon: Building2Icon },
    { label: "Gallery", href: "/#projects-gallery", icon: ImagesIcon },
    { label: "Contact", href: "/#contact", icon: MessageCircleIcon },
  ];

  useEffect(() => {
    const root = document.documentElement;
    const syncLoaderState = () => {
      setIsLoaderVisible(!root.classList.contains("ag-loader-running"));
    };

    syncLoaderState();

    const observer = new MutationObserver(syncLoaderState);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isMobile) {
      return;
    }

    const handleFocusIn = (event: FocusEvent) => {
      const target = event.target;
      const isTextField =
        target instanceof HTMLElement &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);

      if (isTextField) {
        setIsKeyboardOpen(true);
      }
    };

    const handleFocusOut = (event: FocusEvent) => {
      const nextTarget = event.relatedTarget;
      const isMovingToTextField =
        nextTarget instanceof HTMLElement &&
        (nextTarget.tagName === "INPUT" || nextTarget.tagName === "TEXTAREA" || nextTarget.isContentEditable);

      if (!isMovingToTextField) {
        setIsKeyboardOpen(false);
      }
    };

    document.addEventListener("focusin", handleFocusIn);
    document.addEventListener("focusout", handleFocusOut);

    return () => {
      document.removeEventListener("focusin", handleFocusIn);
      document.removeEventListener("focusout", handleFocusOut);
    };
  }, [isMobile]);

  useEffect(() => {
    const sections = ["home", "projects", "projects-gallery", "contact"]
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));

    if (!sections.length) {
      return;
    }

    const sectionMap: Record<string, number> = {
      home: 0,
      projects: 1,
      "projects-gallery": 2,
      contact: 3,
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting && entry.intersectionRatio >= 0.35)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleEntries.length) {
          const activeSection = visibleEntries[0].target.id;
          setActiveIndex(sectionMap[activeSection] ?? 0);
        }
      },
      {
        root: null,
        threshold: [0.35],
        rootMargin: "-18% 0px -42% 0px",
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [pathname]);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>, item: NavItem) => {
    const targetId = item.href.split("#")[1];
    const target = targetId ? document.getElementById(targetId) : null;

    if (target && normalizedPathname === "/") {
      event.preventDefault();
      const lenis = (window as LenisWindow).agLenis;

      if (lenis?.scrollTo) {
        lenis.scrollTo(target, { duration: 1.1, offset: 0 });
      } else {
        target.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
      }

      window.history.pushState({}, "", item.href);
      return;
    }
  };

  const isHidden = !isLoaderVisible || (isMobile && isKeyboardOpen);

  return (
    <nav
      className={`${styles.glassNav} ${isHidden ? styles.glassNavHidden : styles.glassNavVisible}`}
      aria-label="Primary navigation"
    >
      <div className={styles.liquidHighlight} aria-hidden="true" />
      <div className={styles.activeBubble} aria-hidden="true" style={{ "--active-index": effectiveActiveIndex } as CSSProperties} />

      <div className={styles.navItems}>
        {navItems.map((item, index) => {
          const isActive = effectiveActiveIndex === index;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
              onClick={(event) => handleClick(event, item)}
              aria-current={isActive ? "page" : undefined}
              tabIndex={isHidden ? -1 : 0}
            >
              <item.icon className={styles.navIcon} />
              <span className={styles.navLabel}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
