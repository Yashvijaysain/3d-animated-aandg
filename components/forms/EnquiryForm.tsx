"use client";

import { useActionState, useEffect, useId, useState } from "react";
import { submitLead } from "@/app/actions";
import { contactData } from "@/components/sections/contactData";
import styles from "./EnquiryForm.module.css";

type EnquiryFormProps = {
  projectName: string;
  projectSlug: string;
  sourcePage: string;
  comparedProjects?: string[];
  submitLabel?: string;
  successMessage?: string;
  showMessage?: boolean;
  initialMessage?: string;
};

export default function EnquiryForm({
  projectName,
  projectSlug,
  sourcePage,
  comparedProjects = [],
  submitLabel = "Book Site Visit",
  successMessage,
  showMessage = true,
  initialMessage = "",
}: EnquiryFormProps) {
  const [state, formAction, isPending] = useActionState(submitLead, { success: false, message: "" });
  const [utmData, setUtmData] = useState<Record<string, string>>({});
  const [whatsappUrl, setWhatsappUrl] = useState("");
  const fieldId = useId();

  useEffect(() => {
    // Read UTM params from session/local storage
    const params = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "referrer"];
    const data: Record<string, string> = {};
    params.forEach((param) => {
      const val = sessionStorage.getItem(param);
      if (val) data[param] = val;
    });
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUtmData(data);

    // Fallback WhatsApp URL
    const msg = encodeURIComponent(`Hi, I'm interested in ${projectName}. Please share the current price, availability and site-visit details.`);
    setWhatsappUrl(`${contactData.whatsappHref}?text=${msg}`);
  }, [projectName]);

  return (
    <form className={styles.form} action={formAction} aria-busy={isPending}>
      <input type="hidden" name="projectName" value={projectName} />
      <input type="hidden" name="projectSlug" value={projectSlug} />
      <input type="hidden" name="sourcePage" value={sourcePage} />
      {comparedProjects.map((comparedProject) => (
        <input type="hidden" name="comparedProjects" value={comparedProject} key={comparedProject} />
      ))}
      
      {/* UTM Fields */}
      <input type="hidden" name="utmSource" value={utmData.utm_source || ""} />
      <input type="hidden" name="utmMedium" value={utmData.utm_medium || ""} />
      <input type="hidden" name="utmCampaign" value={utmData.utm_campaign || ""} />
      <input type="hidden" name="utmTerm" value={utmData.utm_term || ""} />
      <input type="hidden" name="utmContent" value={utmData.utm_content || ""} />
      <input type="hidden" name="referrer" value={utmData.referrer || ""} />

      {/* Honeypot */}
      <input type="text" name="honeypot" style={{ display: "none" }} tabIndex={-1} autoComplete="off" />

      {state.success ? (
        <div className={styles.successMessage} role="status" aria-live="polite">
          {successMessage ?? state.message}
        </div>
      ) : (
        <>
          <label className={styles.fieldLabel} htmlFor={`${fieldId}-name`}>Full name</label>
          <input id={`${fieldId}-name`} name="fullName" placeholder="Full name" required disabled={isPending} autoComplete="name" />
          <label className={styles.fieldLabel} htmlFor={`${fieldId}-phone`}>Phone number</label>
          <input id={`${fieldId}-phone`} name="phone" placeholder="Phone number" required disabled={isPending} type="tel" inputMode="tel" autoComplete="tel" />
          <label className={styles.fieldLabel} htmlFor={`${fieldId}-email`}>Email address (optional)</label>
          <input id={`${fieldId}-email`} name="email" placeholder="Email (Optional)" disabled={isPending} type="email" inputMode="email" autoComplete="email" />
          {showMessage ? (
            <>
              <label className={styles.fieldLabel} htmlFor={`${fieldId}-message`}>Message (optional)</label>
              <textarea id={`${fieldId}-message`} name="message" placeholder="Message (Optional)" disabled={isPending} defaultValue={initialMessage} />
            </>
          ) : (
            <input type="hidden" name="message" value={initialMessage} />
          )}
          
          {state.message && <div className={styles.errorMessage} role="alert">{state.message}</div>}

          <button type="submit" disabled={isPending}>
            {isPending ? "Submitting..." : submitLabel}
          </button>
          
          {state.message && (
             <div className={styles.fallbackContainer}>
               <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={styles.whatsappFallback}>
                 Contact us on WhatsApp
               </a>
             </div>
          )}
        </>
      )}
    </form>
  );
}
