// app/contact/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Podcasts | TECH-NEST",
  description: "Stay updated on the latest news about cybersecurity and AI safety.",
  // Optional extras:
  // openGraph: { title: "Contact | TECH-NEST", description: "…" },
  // alternates: { canonical: "/contact" },
};

export default function PodcastsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}