// app/blog/technest-findac/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

const meta = {
  slug: "technest-findac",
  title: "Recap: TECH-NEST at FINDAC (Concordia) — Online Safety & AI Awareness",
  description:
    "Highlights from TECH-NEST's session on online safety, AI literacy, and digital ethics with FINDAC — The Financial Data Science Club at Concordia (SGW Campus).",
  dateISO: "2025-10-31",
  dateDisplay: "October 31, 2025",
  location: "Concordia University — SGW Campus, Montréal",
  readingTime: "4 min read",
  tags: [
    "CyberSafety",
    "AIAwareness",
    "TechForGood",
    "DigitalEthics",
    "Montreal",
    "CommunityEngagement",
  ],
  canonical: "https://tech-nest.communicatingtech.com/events/findac-x-technest",
  cover: {
    src: "/images/technest-findac-2025-10-31.jpeg",
    alt: "TECH-NEST presenting Online Safety & AI Awareness at FINDAC, Concordia SGW Campus",
  },
  links: {
    post:
      "https://www.linkedin.com/posts/technest2025_cybersafety-aiawareness-techforgood-activity-7390140611581976576-ayL4/",
    findac: "https://www.linkedin.com/company/the-financial-data-science-club/",
    technest: "https://www.linkedin.com/company/technest2025/",
  },
  ogImage: "/images/technest-findac-2025-10-31.jpeg", // create this if you want rich preview
};

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: {
    canonical: meta.canonical,
  },
  openGraph: {
    type: "article",
    url: meta.canonical,
    title: meta.title,
    description: meta.description,
    siteName: "TECH-NEST",
    images: [{ url: meta.ogImage, alt: meta.cover.alt }],
  },
  twitter: {
    card: "summary_large_image",
    title: meta.title,
    description: meta.description,
    images: [meta.ogImage],
  },
};

export const revalidate = 3600; // ISR: rebuild every hour

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: meta.title,
    datePublished: meta.dateISO,
    dateModified: meta.dateISO,
    description: meta.description,
    image: meta.ogImage,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": meta.canonical,
    },
    author: {
      "@type": "Organization",
      name: "TECH-NEST",
    },
    publisher: {
      "@type": "Organization",
      name: "TECH-NEST",
      logo: {
        "@type": "ImageObject",
        url: "https://your-domain.com/logo.png",
      },
    },
    keywords: meta.tags.join(", "),
  };

  return (
    <article className="mx-auto max-w-3xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      {/* JSON-LD */}
      <Script
        id="jsonld-technest-findac"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumbs */}
      {/* <nav aria-label="Breadcrumb" className="mb-6 text-sm">
        <ol className="flex flex-wrap items-center gap-1 text-neutral-500">
          <li>
            <Link href="/" className="hover:text-neutral-800">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/blog" className="hover:text-neutral-800">
              Blog
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-neutral-800">{meta.slug}</li>
        </ol>
      </nav> */}

      {/* Header */}
      <header className="mb-8">
        <p className="text-sm text-white/70">
          <time dateTime={meta.dateISO}>{meta.dateDisplay}</time> •{" "}
          {meta.readingTime}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          {meta.title}
        </h1>
        <p className="mt-2 text-white/70">{meta.location}</p>

        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-2">
          {meta.tags.map((t) => (
            <span
              key={t}
              className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-800"
            >
              #{t}
            </span>
          ))}
        </div>
      </header>

      {/* Cover */}
      <figure className="mb-8 overflow-hidden rounded-2xl border border-neutral-200">
        <img
          src={meta.cover.src}
          alt={meta.cover.alt}
          className="h-auto w-full object-cover"
        />
        {/* <figcaption className="px-4 py-3 text-center text-sm text-white">
          Sharing practical cyber safety and AI literacy tips with FINDAC at
          Concordia's SGW Campus.
        </figcaption> */}
      </figure>

      {/* Intro */}
      <section className="prose prose-neutral max-w-none text-white">
        <p>
          We had a great time presenting TECH-NEST's{" "}
          <strong className="text-white">online safety</strong> and <strong className="text-white">AI awareness</strong>{" "}
          initiatives to the enthusiastic minds at{" "}
          <Link
            href={meta.links.findac}
            target="_blank"
            className="underline decoration-white underline-offset-4 text-white"
          >
            FINDAC — The Financial Data Science Club at Concordia
          </Link>
          . A heartfelt thanks to <strong className="text-white">Ahmed Eissa, PhD, FDP</strong> for the
          warm invitation and support. 🙌
        </p>
      </section>

      {/* Highlights */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold">Session Highlights</h2>
        <ul className="mt-3 list-inside list-disc text-white/80">
          <li>
            Practical frameworks for <strong>staying safe online</strong>:
            account hygiene, MFA patterns, and scam spotting.
          </li>
          <li>
            <strong>AI literacy</strong> for students: strengths, limitations,
            and responsible use of generative AI.
          </li>
          <li>
            <strong>Digital ethics</strong> conversation: privacy, consent,
            bias and fairness, and how to evaluate tools critically.
          </li>
          <li>
            Q&amp;A on <strong>research & career paths</strong> at the
            intersection of data, AI, and public good.
          </li>
        </ul>
      </section>

      {/* Quote */}
      <section className="mt-8">
        <blockquote className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5 text-neutral-800">
          <p className="text-lg">
            “Our goal is to make safety and ethics <em>practical</em>, so
            students can apply the ideas immediately in their studies, projects,
            and daily digital life.”
          </p>
          <footer className="mt-2 text-sm text-neutral-800">
            - TECH-NEST Team
          </footer>
        </blockquote>
      </section>

      {/* What We Shared */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold">What We Shared</h2>
        <div className="mt-3 space-y-6">
          <div>
            <h3 className="font-medium">Online Safety Essentials</h3>
            <ul className="mt-2 list-inside list-disc text-white/80">
              <li>Layered authentication &amp; passkey-ready thinking</li>
              <li>Recognizing phishing &amp; deepfake signals</li>
              <li>Data minimization &amp; permission hygiene</li>
              <li>Personal security checklists for students</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium">AI Awareness &amp; Digital Ethics</h3>
            <ul className="mt-2 list-inside list-disc text-white/80">
              <li>Capabilities vs. limits: hallucinations, provenance, risk</li>
              <li>Bias, fairness, and responsible evaluation practices</li>
              <li>Prompt design for learning &amp; research productivity</li>
              <li>Privacy-first workflows and consent-aware tooling</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Links */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold">Gratitude & Resources</h2>
        <p className="mt-3 text-white/80">
          Big thanks again to the{" "}
          <Link
            href={meta.links.findac}
            target="_blank"
            className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-500"
          >
            FINDAC leadership & community
          </Link>{" "}
          for hosting us, and to <strong>Ahmed Eissa, PhD, FDP</strong> for the
          invitation and support. You can catch the original post here:
        </p>
        <ul className="mt-3 list-inside list-disc">
          <li>
            <Link
              href={meta.links.post}
              target="_blank"
              className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-500"
            >
              LinkedIn recap post
            </Link>
          </li>
          <li>
            <Link
              href={meta.links.technest}
              target="_blank"
              className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-500"
            >
              More updates from TECH-NEST
            </Link>
          </li>
        </ul>
      </section>

      {/* CTA */}
      <section className="mt-10 rounded-2xl border border-neutral-200 bg-neutral-50 p-6 text-neutral-800">
        <h2 className="text-lg font-semibold">
          Bring TECH-NEST to your campus or community
        </h2>
        <p className="mt-2 text-neutral-800">
          Interested in hands-on workshops on cyber safety, AI literacy, and
          digital ethics? We'd love to collaborate.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-xl border border-neutral-200 px-4 py-2 text-sm font-medium hover:bg-white text-neutral-800"
          >
            Contact Us
          </Link>
          <Link
            href="/initiatives"
            className="inline-flex items-center justify-center rounded-xl bg-black px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
          >
            Explore Our Initiatives
          </Link>
        </div>
      </section>

      {/* Footer meta */}
      <footer className="mt-12 border-t border-neutral-200 pt-6 text-sm text-white/80">
        Posted by TECH-NEST • {meta.location}
      </footer>
    </article>
  );
}
