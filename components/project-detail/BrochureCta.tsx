"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import EnquiryForm from "@/components/forms/EnquiryForm";
import styles from "./BrochureCta.module.css";

type BrochureCtaProps = {
  projectName: string;
  projectSlug: string;
  brochureUrl?: string;
  mode?: "view" | "download";
  className?: string;
};

export default function BrochureCta({
  projectName,
  projectSlug,
  brochureUrl,
  mode = "view",
  className,
}: BrochureCtaProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const dialog = dialogRef.current;
    const trigger = triggerRef.current;
    document.body.style.overflow = "hidden";

    const focusableSelector =
      'button:not([disabled]), a[href], input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

    requestAnimationFrame(() => {
      dialog?.querySelector<HTMLElement>(focusableSelector)?.focus();
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsOpen(false);
        return;
      }

      if (event.key !== "Tab" || !dialog) return;

      const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(focusableSelector));
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      trigger?.focus();
    };
  }, [isOpen]);

  if (brochureUrl) {
    return (
      <a
        className={className}
        href={brochureUrl}
        target="_blank"
        rel="noopener noreferrer"
        download={mode === "download" ? true : undefined}
        aria-label={`${mode === "download" ? "Download" : "View"} the ${projectName} brochure`}
      >
        {mode === "download" ? "Download Brochure" : "View Brochure"}
      </a>
    );
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={className}
        onClick={() => setIsOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-label={`Request the ${projectName} brochure`}
      >
        Request Brochure
      </button>

      {isOpen
        ? createPortal(
            <div
              className={styles.overlay}
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) setIsOpen(false);
              }}
              data-compare-bar-avoid
            >
              <div
                ref={dialogRef}
                className={styles.dialog}
                role="dialog"
                aria-modal="true"
                aria-labelledby={`brochure-title-${projectSlug}`}
                aria-describedby={`brochure-description-${projectSlug}`}
              >
                <button
                  type="button"
                  className={styles.closeButton}
                  onClick={() => setIsOpen(false)}
                  aria-label="Close brochure request form"
                >
                  ×
                </button>
                <header className={styles.header}>
                  <span>Project Brochure</span>
                  <h2 id={`brochure-title-${projectSlug}`}>Request the {projectName} Brochure</h2>
                  <p id={`brochure-description-${projectSlug}`}>
                    Share your details and an A&amp;G property advisor will provide the current project brochure.
                  </p>
                </header>
                <EnquiryForm
                  projectName={projectName}
                  projectSlug={projectSlug}
                  sourcePage={`/projects/${projectSlug}#brochure-request`}
                  submitLabel="Request Brochure"
                  successMessage="Thank you. Your brochure request has been received."
                  showMessage={false}
                  initialMessage={`Brochure request for ${projectName}`}
                />
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
