export const dynamic = 'force-dynamic';

const customPrograms = Array.from({ length: 22 }, (_, i) => ({
  id: (i + 1).toString(),
  name: `Custom Program ${i + 1}`,
  type: [
    'Workshop Series',
    'Mentorship Program',
    'Research Initiative',
    'Hackathon',
    'Summer Camp'
  ][i % 5],
  category: ['science', 'technology', 'engineering', 'mathematics'][i % 4],
  description: `Custom program ${i + 1} offers unique opportunities for students to engage in specialized STEM activities.`,
  partner: [
    'National Research Council',
    'Math Works',
    'Microsoft Canada',
    'Space Agency',
    'Engineers Only',
    'LD Establish'
  ][i % 6],
  status: ['active', 'inactive'][i % 2]
}));

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '6');
  const category = searchParams.get('category');

  let filteredCustoms = customPrograms;
  if (category && category !== 'all') {
    filteredCustoms = customPrograms.filter(custom => 
      custom.category === category
    );
  }

  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedCustoms = filteredCustoms.slice(start, end);
  
  return Response.json({
    customs: paginatedCustoms,
    total: filteredCustoms.length,
    totalPages: Math.ceil(filteredCustoms.length / limit)
  });
} 