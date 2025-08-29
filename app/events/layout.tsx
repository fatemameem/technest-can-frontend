// app/contact/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events | TECH-NEST",
  description: "Stay updated on the latest events and initiatives from TECH-NEST.",
  // Optional extras:
  // openGraph: { title: "Contact | TECH-NEST", description: "…" },
  // alternates: { canonical: "/contact" },
};

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}