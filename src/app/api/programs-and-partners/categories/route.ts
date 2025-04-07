export const dynamic = 'force-dynamic';

const categories = [
  { id: 'science', name: 'Science', slug: 'science', color: '#4CAF50' },
  { id: 'technology', name: 'Technology', slug: 'technology', color: '#7C3AED' },
  { id: 'engineering', name: 'Engineering', slug: 'engineering', color: '#F97316' },
  { id: 'mathematics', name: 'Mathematics', slug: 'mathematics', color: '#EC4899' }
];

export async function GET() {
  return Response.json(categories);
} 