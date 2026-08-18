"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { z } from "zod";

const leadSchema = z.object({
  name: z.string().min(1, "Name is required").trim().max(100, "Name is too long"),
  phone: z.string()
    .min(10, "Phone number is too short")
    .max(15, "Phone number is too long")
    .regex(/^[0-9+\-\s()]+$/, "Invalid phone format")
    .transform((val) => val.replace(/[\s\-\(\)]/g, "")),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
  message: z.string().max(1000, "Message is too long").optional(),
  projectName: z.string().optional(),
  projectSlug: z.string().optional(),
  sourcePage: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  utmTerm: z.string().optional(),
  utmContent: z.string().optional(),
  referrer: z.string().optional(),
  comparedProjects: z.array(z.string().trim().min(1).max(120)).max(3).optional(),
  honeypot: z.string().optional(), // for spam protection
});

export async function submitLead(
  prevState: { success: boolean; message: string } | null,
  formData: FormData
) {
  try {
    // Basic honeypot check
    const honeypot = formData.get("honeypot");
    if (honeypot) {
      // Spam detected, silently succeed
      return { success: true, message: "Enquiry submitted successfully." };
    }

    const rawData = {
      name: formData.get("fullName"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      message: formData.get("message"),
      projectName: formData.get("projectName"),
      projectSlug: formData.get("projectSlug"),
      sourcePage: formData.get("sourcePage"),
      utmSource: formData.get("utmSource"),
      utmMedium: formData.get("utmMedium"),
      utmCampaign: formData.get("utmCampaign"),
      utmTerm: formData.get("utmTerm"),
      utmContent: formData.get("utmContent"),
      referrer: formData.get("referrer"),
      comparedProjects: formData.getAll("comparedProjects").map(String),
    };

    const validatedData = leadSchema.safeParse(rawData);

    if (!validatedData.success) {
      const errorMsg = validatedData.error.issues.map(e => e.message).join(", ");
      return { success: false, message: errorMsg };
    }

    const { data } = validatedData;
    const finalEmail = data.email === "" ? null : data.email;

    const supabase = createSupabaseServerClient();
    const { error } = await supabase.from("leads").insert({
      name: data.name,
      phone: data.phone,
      email: finalEmail,
      message: data.message || null,
      project_name: data.projectName || null,
      project_slug: data.projectSlug || null,
      source_page: data.sourcePage || null,
      utm_source: data.utmSource || null,
      utm_medium: data.utmMedium || null,
      utm_campaign: data.utmCampaign || null,
      utm_term: data.utmTerm || null,
      utm_content: data.utmContent || null,
      referrer: data.referrer || null,
      compared_projects: data.comparedProjects?.length ? data.comparedProjects : null,
    });

    if (error) {
      console.error("Supabase lead insert failed:", error.code);
      return { success: false, message: "We couldn't submit your enquiry right now. Please try again or contact us on WhatsApp." };
    }

    return { success: true, message: "Thank you. Your enquiry has been received. Our property advisor will contact you shortly." };
  } catch (error) {
    console.error("Lead submission error:", error);
    return { success: false, message: "We couldn't submit your enquiry right now. Please try again or contact us on WhatsApp." };
  }
}
