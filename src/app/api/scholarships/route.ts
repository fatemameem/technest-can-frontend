export const dynamic = 'force-dynamic';

// Temporary data - replace with your database call
const scholarships = [
  {
    id: '1',
    title: 'Women in STEM Research Grant',
    organization: 'Natural Sciences and Engineering Research Council',
    amount: 25000,
    description: 'Supporting women researchers in STEM fields to advance their research projects and career development.',
    categories: ['science', 'engineering'],
    deadline: '2024-06-30',
    eligibility: 'Female researchers in STEM fields',
    applicationUrl: 'https://example.com/apply'
  },
  {
    id: '2',
    title: 'Indigenous STEM Scholarship',
    organization: 'Innovation, Science and Economic Development Canada',
    amount: 35000,
    description: 'Supporting Indigenous students pursuing STEM education at Canadian universities.',
    categories: ['indigenous', 'science', 'technology', 'engineering', 'maths'],
    deadline: '2024-07-15',
    eligibility: 'Indigenous students in STEM programs',
    applicationUrl: 'https://example.com/apply'
  },
  {
    id: '3',
    title: 'International Student Experience Scholarship',
    organization: 'Digital Canada Foundation',
    amount: 42000,
    description: 'Supporting international students in technology and digital fields.',
    categories: ['technology'],
    deadline: '2024-08-01',
    eligibility: 'International students in technology programs',
    applicationUrl: 'https://example.com/apply'
  }
];

export async function GET() {
  return Response.json(scholarships);
} 