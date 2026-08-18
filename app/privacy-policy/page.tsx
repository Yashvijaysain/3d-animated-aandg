import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for A&G Realtors.",
};

export default function PrivacyPolicy() {
  return (
    <main style={{ padding: "120px 5vw", maxWidth: "800px", margin: "0 auto", color: "var(--foreground)" }}>
      <h1 style={{ fontSize: "2.5rem", marginBottom: "2rem" }}>Privacy Policy</h1>
      
      <section style={{ display: "flex", flexDirection: "column", gap: "1.5rem", fontSize: "1.1rem", lineHeight: "1.6" }}>
        <p>This Privacy Policy explains how A&G Realtors collects, uses, and protects your information.</p>
        
        <h2>Information Collected</h2>
        <p>We collect information you provide directly through our enquiry forms, including your Name, Phone number, Email address, and details regarding your property requirements. We also collect source and project data, analytics information, and use cookies (or first-party tracking) to improve our services and determine lead attribution.</p>
        
        <h2>How Information is Used</h2>
        <p>We use your information for lead follow-up, communicating regarding your enquiry, and providing relevant property options. We may also use it for service communication, marketing (where legally appropriate), and analytics to understand our website&apos;s performance.</p>

        <h2>Data Protection</h2>
        <p>We take appropriate measures to secure your personal data. We only share data with third-party service providers (such as email or WhatsApp notification services) strictly necessary to process your enquiry and operate our business.</p>

        <h2>User Rights</h2>
        <p>You have the right to request access to, correction of, or deletion of your personal data stored with us. You can opt out of marketing communications at any time.</p>

        <h2>Contact Information</h2>
        <p>If you have any questions about this Privacy Policy, please contact us at info@agarwalandgehlot.com or via the phone numbers listed on our Contact page.</p>

        <h2>Policy Updates</h2>
        <p>We may update this Privacy Policy from time to time. Any changes will be posted on this page.</p>
      </section>
    </main>
  );
}
