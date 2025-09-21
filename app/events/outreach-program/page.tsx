'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Clock } from 'lucide-react';

// Interface defining the props structure for the blog-style page component
interface BlogStyle4Props {
  title: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  content: string;
  featuredImage: string;
  estimatedReadTime: string;
  tags?: string[];
  relatedPosts?: Array<{
    title: string;
    excerpt: string;
    image: string;
  }>;
}

// Main component for displaying a blog-style article page
// This component renders an outreach program event page in a blog format
export default function BlogStyle4({ 
  title, 
  author, 
  date, 
  readTime,
  category,
  content, 
  tags = [],
  relatedPosts = [],
  featuredImage,
  estimatedReadTime,
}: BlogStyle4Props) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      
      {/* Hero Section - Large banner area with featured image and title overlay */}
      <div className="relative mx-auto container">
        {/* Featured Image Container - Displays main article image */}
          <div className="bg-slate-800 overflow-hidden relative">
            <img 
              src="/images/outreach.png" 
              alt={title}
              className="w-full h-screen object-cover "
            />
            {/* Dark gradient overlay for better text readability */}
            {/* <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" /> */}
          </div>

        
        {/* Hero Content - Title, category badge, and author info overlaid on image */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`max-w-4xl mx-auto ${featuredImage ? 'absolute bottom-0 left-1/2 transform -translate-x-1/2 pb-12' : 'pt-12'}`}>
            
            {/* Category Badge - Shows event/article category */}
            <Badge className="bg-blue-600 text-white mb-4">
              {category}
            </Badge>
            
            {/* Main Article Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {title}
            </h1>
            
            {/* Author Information and Metadata */}
            <div className="flex items-center gap-6 text-slate-300">
              <div className="flex items-center gap-3">
                {/* Author Avatar - Circular gradient background */}
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full flex items-center justify-center">
                  {/* Author initial could be displayed here if needed */}
                </div>
                
                {/* Author Name and Article Metadata */}
                <div>
                  <p className="font-medium text-white">{author}</p>
                  <p className="text-sm text-slate-400">{date} · {estimatedReadTime}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area - Contains article content, tags, and related posts */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          
          {/* Article Content Card - Main content container */}
          <article className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-8 mb-12">
            
            {/* Article Body - Main text content with prose styling */}
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-300">
                {content}
              </p>
            </div>

            {/* Tags Section - Displays article tags if available */}
            {tags.length > 0 && (
              <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* Related Posts Section - Shows related articles if available */}
          {relatedPosts.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Related Articles</h2>
              
              {/* Related Posts Grid - Responsive grid layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPosts.map((post, index) => (
                  <Card key={index} className="bg-white dark:bg-slate-900 hover:shadow-lg transition-shadow">
                    <CardContent className="p-0">
                      
                      <div className="aspect-video bg-slate-200 dark:bg-slate-700 rounded-t-lg">
                        <img 
                          src={post.image} 
                          alt={post.title}
                          className="w-full h-full object-cover rounded-t-lg"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-2 line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3">
                          {post.excerpt}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}