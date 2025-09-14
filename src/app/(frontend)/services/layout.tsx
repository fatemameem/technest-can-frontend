// app/services/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services | TECH-NEST",
  description:
    "Explore our range of services designed to enhance your cybersecurity and AI ethics initiatives.",
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
