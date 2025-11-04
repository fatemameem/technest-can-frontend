// app/blog/technest-at-forces-avenir/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

const meta = {
  slug: "technest-at-forces-avenir",
  title:
    "Proud to Be Part of Forces AVENIR - TECH-NEST's Journey in Student Leadership",
  description:
    "TECH-NEST reflects on being part of the Forces AVENIR Awards: student leadership, community impact, and a celebration of ideas across Québec.",
  // Adjust this to the exact publish date you prefer
  dateISO: "2025-10-20",
  dateDisplay: "October 14, 2025",
  location: "Québec City, QC",
  readingTime: "4 min read",
  tags: [
    "ForcesAVENIR",
    "StudentLeadership",
    "ConcordiaUniversity",
    "Innovation",
    "Networking",
    "TechNest",
    "Growth",
    "Gratitude",
  ],
  canonical: "https://tech-nest.communicatingtech.com/technest-at-forces-avenir",
  cover: {
    src: "/images/forces-avenir-2.jpeg",
    alt: "Forces AVENIR gala ambiance with student leaders from across Québec",
  },
  ogImage: "/images/forces-avenir-2.jpeg",
  links: {
    post: "https://www.linkedin.com/posts/mahimurrahman-khan_forcesavenir-studentleadership-concordiauniversity-activity-7386061498323947521-2Aww/",
  },
  people: {
    nominee: "Mahimur Rahman Khan",
    supporters: ["Alexander Oster", "Katie Broad"],
    founder: "Azfar Adib",
    winningTeam: "Starsailor (Space Concordia)",
  },
};

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: meta.canonical },
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

export const revalidate = 3600;

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
        id="jsonld-technest-forces-avenir"
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
              className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700"
            >
              #{t}
            </span>
          ))}
        </div>
      </header>

      {/* Cover */}
      <figure className="mb-8 overflow-hidden rounded-2xl border border-neutral-800">
        <img
          src={meta.cover.src}
          alt={meta.cover.alt}
          className="h-auto w-full object-cover"
        />
        {/* <figcaption className="px-4 py-3 text-center text-sm text-neutral-500">
          Celebrating student leadership and community impact at Forces AVENIR.
        </figcaption> */}
      </figure>

      {/* Intro */}
      <section className="prose prose-neutral max-w-none text-white/80">
        <p>
          We're excited to share that{" "}
          <strong className="text-white">{meta.people.nominee}</strong> represented{" "}
          <strong className="text-white">
            Technology Nested with Ethics, Sustainability &amp; Transparency
            (TECH-NEST)
          </strong>{" "}
          as Project Manager in this year's{" "}
          <strong className="text-white">Forces AVENIR</strong> journey—an initiative that celebrates
          student leadership and community impact across Québec.
        </p>
        <p>
          While our project didn't advance to the provincial finalist stage, the
          experience itself was incredibly rewarding. The Gala brought together
          inspiring students from across Québec—each with a story, a vision, and
          real momentum for change. It was a privilege to exchange ideas,
          connect, and celebrate the projects shaping our communities.
        </p>
      </section>

      {/* Growth & Reflection */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold">Growth Through the Journey</h2>
        <div className="mt-3 space-y-4 text-white/80">
          <p>
            As a young, impact-driven startup, every challenge teaches us
            something new—from sharpening our mission and messaging to refining
            how we collaborate. This experience reminded us how much growth
            happens when you step outside your comfort zone and show up for the
            community.
          </p>
          <blockquote className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5 text-neutral-800">
            <p className="text-lg">
              “Leadership is a practice. It's built through real problems,
              generous peers, and the courage to keep learning.”
            </p>
            <footer className="mt-2 text-sm text-neutral-600">
              - TECH-NEST Team
            </footer>
          </blockquote>
        </div>
      </section>

      {/* Shout-outs */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold">Gratitude</h2>
        <ul className="mt-3 list-inside list-disc text-white/80">
          <li>
            Heartfelt thanks to{" "}
            <strong className="text-white">{meta.people.supporters[0]}</strong> and{" "}
            <strong className="text-white">{meta.people.supporters[1]}</strong> for their incredible
            support throughout this journey.
          </li>
          <li>
            Appreciation to our founder <strong className="text-white">{meta.people.founder}</strong>{" "}
            for trusting us with this opportunity.
          </li>
          <li>
            Huge congratulations to{" "}
            <strong className="text-white">{meta.people.winningTeam}</strong> for winning in our
            category—you've made Concordia proud!
          </li>
        </ul>
      </section>

      {/* What TECH-NEST Stands For */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold">Our Focus at TECH-NEST</h2>
        <ul className="mt-3 list-inside list-disc text-white/80">
          <li>
            <strong>Digital Ethics</strong>: privacy, consent, equity, and
            responsible AI.
          </li>
          <li>
            <strong>Online Safety</strong>: practical literacy for students and
            communities.
          </li>
          <li>
            <strong>Community Impact</strong>: workshops, resources, and
            collaboration with student groups.
          </li>
        </ul>
      </section>

      {/* Links */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold">Read the Original Post</h2>
        <ul className="mt-3 list-inside list-disc">
          <li>
            <Link
              href={meta.links.post}
              target="_blank"
              className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-500"
            >
              LinkedIn post by {meta.people.nominee}
            </Link>
          </li>
        </ul>
      </section>

      {/* CTA */}
      <section className="mt-10 rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
        <h2 className="text-lg font-semibold text-neutral-800">
          Partner with TECH-NEST for Student Impact
        </h2>
        <p className="mt-2 text-neutral-800">
          If your student association or community group wants to co-host a
          workshop on online safety, AI literacy, or digital ethics, we’d love
          to collaborate.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-xl border border-neutral-200 px-4 py-2 text-sm font-medium hover:bg-white"
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
      <footer className="mt-12 border-t border-neutral-200 pt-6 text-sm text-white/60">
        Posted by TECH-NEST • {meta.location}
      </footer>
    </article>
  );
}
