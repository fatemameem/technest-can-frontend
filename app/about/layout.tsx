// app/contact/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | TECH-NEST",
  description: "Learn more about TECH-NEST and our mission.",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}