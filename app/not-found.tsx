import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <main style={{ padding: "120px 5vw", textAlign: "center", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
      <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>404</h1>
      <p style={{ fontSize: "1.2rem", marginBottom: "2rem" }}>We couldn&apos;t find the page you&apos;re looking for.</p>
      <div style={{ display: "flex", gap: "1rem" }}>
        <Link href="/" style={{ padding: "0.8rem 1.5rem", border: "1px solid var(--foreground)", borderRadius: "4px" }}>
          Go Home
        </Link>
        <Link href="/projects" style={{ padding: "0.8rem 1.5rem", background: "var(--foreground)", color: "var(--background)", borderRadius: "4px" }}>
          View Projects
        </Link>
      </div>
    </main>
  );
}
