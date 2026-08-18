import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms of use for A&G Realtors.",
};

export default function TermsOfUse() {
  return (
    <main style={{ padding: "120px 5vw", maxWidth: "800px", margin: "0 auto", color: "var(--foreground)" }}>
      <h1 style={{ fontSize: "2.5rem", marginBottom: "2rem" }}>Terms of Use</h1>
      
      <section style={{ display: "flex", flexDirection: "column", gap: "1.5rem", fontSize: "1.1rem", lineHeight: "1.6" }}>
        <p>By using the A&G Realtors website, you agree to these Terms of Use.</p>
        
        <h2>General Website Usage</h2>
        <p>The content provided on this website is for informational purposes. While we strive to provide accurate property information, all details are subject to change without notice.</p>
        
        <h2>Property Information Disclaimer</h2>
        <p>Prices, availability, and offers may change. Project information should be independently verified where appropriate. We reference RERA numbers and third-party developer information as provided by the developers, but cannot guarantee their absolute accuracy.</p>
        
        <h2>No Guaranteed Returns</h2>
        <p>We do not guarantee investment returns on any real estate properties discussed or presented on this website.</p>

        <h2>Intellectual Property</h2>
        <p>All content, branding, and images on this site are the property of A&G Realtors or their respective developers and are protected by copyright laws.</p>

        <h2>External Links</h2>
        <p>Our website may contain links to external sites. We are not responsible for the content or privacy practices of these third-party websites.</p>

        <h2>Limitation of Liability</h2>
        <p>A&G Realtors shall not be liable for any direct, indirect, incidental, or consequential damages arising from the use or inability to use this website or any information provided herein.</p>

        <h2>Contact Information</h2>
        <p>If you have any questions regarding these Terms, please contact us at info@agarwalandgehlot.com.</p>
      </section>
    </main>
  );
}
