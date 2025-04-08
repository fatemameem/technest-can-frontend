export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Scholarship {
  id: string;
  title: string;
  organization: string;
  amount: number;
  description: string;
  categories: string[];
  deadline?: string;
  eligibility?: string;
  applicationUrl?: string;
}

export const dynamic = 'force-dynamic';

const categories = [
  { id: 'all', name: 'All Opportunities', slug: 'all' },
  { id: 'science', name: 'Science', slug: 'science' },
  { id: 'technology', name: 'Technology', slug: 'technology' },
  { id: 'engineering', name: 'Engineering', slug: 'engineering' },
  { id: 'maths', name: 'Maths', slug: 'maths' },
  { id: 'indigenous', name: 'Indigenous Focused', slug: 'indigenous' },
];

export async function GET() {
  return Response.json(categories);
} 