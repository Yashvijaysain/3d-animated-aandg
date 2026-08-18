"use client";

import { useActionState, useEffect, useState } from "react";
import { submitLead } from "@/app/actions";
import styles from "./EnquiryForm.module.css";

type EnquiryFormProps = {
  projectName: string;
  projectSlug: string;
  sourcePage: string;
};

export default function EnquiryForm({ projectName, projectSlug, sourcePage }: EnquiryFormProps) {
  const [state, formAction, isPending] = useActionState(submitLead, { success: false, message: "" });
  const [utmData, setUtmData] = useState<Record<string, string>>({});
  const [whatsappUrl, setWhatsappUrl] = useState("");

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
    setWhatsappUrl(`https://wa.me/919654322222?text=${msg}`); // Replace phone number later via env
  }, [projectName]);

  return (
    <form className={styles.form} action={formAction}>
      <input type="hidden" name="projectName" value={projectName} />
      <input type="hidden" name="projectSlug" value={projectSlug} />
      <input type="hidden" name="sourcePage" value={sourcePage} />
      
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
        <div className={styles.successMessage}>
          {state.message}
        </div>
      ) : (
        <>
          <input name="fullName" placeholder="Full name" required disabled={isPending} />
          <input name="phone" placeholder="Phone number" required disabled={isPending} type="tel" />
          <input name="email" placeholder="Email (Optional)" disabled={isPending} type="email" />
          <textarea name="message" placeholder="Message (Optional)" disabled={isPending} />
          
          {state.message && <div className={styles.errorMessage}>{state.message}</div>}

          <button type="submit" disabled={isPending}>
            {isPending ? "Submitting..." : "Book Site Visit"}
          </button>
          
          {state.message && (
             <div className={styles.fallbackContainer}>
               <a href={whatsappUrl} target="_blank" rel="noreferrer" className={styles.whatsappFallback}>
                 Contact us on WhatsApp
               </a>
             </div>
          )}
        </>
      )}
    </form>
  );
}
