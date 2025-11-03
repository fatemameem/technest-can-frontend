import { Button } from "@/components/ui/button";
import { Hero } from "@/components/ui/hero";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import configPromise from '@payload-config';
import { getPayload } from "payload";

export default async function BlogsPage() {
  const payload = await getPayload({ config: configPromise });
  
  // ✅ Fix: Query using meta.status instead of published
  const res = await payload.find({
    collection: 'blogs',
    where: { 
      'meta.status': { equals: 'Published' } 
    },
    sort: '-meta.publishedAt', // Sort by publish date, newest first
    limit: 100,
    depth: 2, // Populate coverImage and author relationships
    overrideAccess: true,
  });
  
  const rawBlogs = res.docs || [];
  // console.log("Fetched blogs:", rawBlogs);
  
  // Map into the shape BlogCard expects
  const mappedBlogs = (rawBlogs || []).map((r: any) => {
    // Extract cover image URL from populated Media relationship
    const coverImageUrl = typeof r.coverImage === 'object' && r.coverImage?.url
      ? r.coverImage.cloudinary.secureUrl
      : "https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080";
    
    return {
      id: r.id,
      title: r.meta?.title || r.title || 'Untitled Blog',
      description: r.meta?.subtitle || '',
      date: r.meta?.publishedAt || r.createdAt || '',
      path: r.meta?.slug ? `/blogs/blog/${r.meta.slug}` : '/blogs',
      thumbnailUrl: coverImageUrl,
      author: typeof r.meta?.authorRef === 'string' 
        ? r.meta.authorRef 
        : r.meta?.author || 'TECH-NEST Team',
      readingTime: r.meta?.readingTime || 5,
      tags: r.meta?.tags || [],
    };
  });

  const latestBlog = mappedBlogs[0] || { // First item after sorting by newest
    id: "placeholder",
    title: "No published blogs yet",
    description: "Check back soon for our latest insights!",
    date: "",
    url: "",
    path: "#",
  };

  // console.log(latestBlog);

  return (
    <div>
      <Hero
        title={latestBlog.title}
        subtitle={latestBlog.description}
        imageUrl={`${latestBlog.thumbnailUrl}`}
      >
        <div className="font-poppins flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="btn-primary text-white px-8 py-3 text-base md:text-lg">
            <Link href={latestBlog.path}>
              Read More
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          {/* <Button asChild variant="outline" className="btn-secondary text-slate-300 px-8 py-3 text-base md:text-lg">
            <Link href="/events">
              Upcoming Events
              <ExternalLink className="ml-2 h-5 w-5" />
            </Link>
          </Button> */}
        </div>
      </Hero>

      <section className="py-16 bg-slate-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold">Latest Insights</h2>
              <p className="text-slate-300 text-base lg:text-lg">
                Explore stories, research, and field notes from the TECH-NEST team.
              </p>
            </div>
            <Button asChild variant="outline" className="hidden md:inline-flex btn-secondary">
              <Link href="/blogs">View All</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {mappedBlogs.length > 0 ? (
              mappedBlogs.map((blog) => {
                const parsedDate = blog.date ? new Date(blog.date) : null;
                const hasValidDate = parsedDate && !Number.isNaN(parsedDate.getTime());
                const dateLabel = hasValidDate
                  ? parsedDate.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : 'Coming soon';
                const readingTimeLabel =
                  typeof blog.readingTime === 'number' && blog.readingTime > 0
                    ? `${blog.readingTime} min read`
                    : 'Quick read';

                return (
                  <Link key={blog.id} href={blog.path} className="group block h-full">
                    <Card className="surface hover-lift h-full overflow-hidden transition-transform duration-300">
                      <div className="relative aspect-[16/9] overflow-hidden bg-slate-900">
                        <img
                          src={blog.thumbnailUrl}
                          alt={blog.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                      <CardContent className="p-6 flex flex-col gap-4">
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs uppercase tracking-wide text-slate-400">
                          <span>{dateLabel}</span>
                          <span>{readingTimeLabel}</span>
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-xl font-semibold text-white transition-colors duration-300 group-hover:text-cyan-400">
                            {blog.title}
                          </h3>
                          <p className="text-sm text-slate-300 line-clamp-3">{blog.description}</p>
                        </div>
                        {blog.tags && blog.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {blog.tags.slice(0, 3).map((tag) => (
                              <Badge key={`${blog.id}-${tag}`} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                        <div className="mt-auto flex items-center justify-between text-sm text-slate-400">
                          <span>{blog.author}</span>
                          <span className="inline-flex items-center gap-2 text-cyan-400 transition-transform duration-300 group-hover:translate-x-1">
                            Read more
                            <ArrowRight className="h-4 w-4" />
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })
            ) : (
              <p className="col-span-full text-center text-slate-300">
                No published blogs yet. Check back soon!
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
