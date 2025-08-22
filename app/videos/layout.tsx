// app/contact/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Videos | TECH-NEST",
  description: "Explore our collection of video tutorials on cybersecurity and AI ethics.",
};

export default function VideosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}