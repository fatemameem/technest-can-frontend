// app/contact/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | TECH-NEST",
  description:
    "Get in touch with our team for cybersecurity consulting, AI ethics guidance, or training opportunities.",
  // Optional extras:
  // openGraph: { title: "Contact | TECH-NEST", description: "…" },
  // alternates: { canonical: "/contact" },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}