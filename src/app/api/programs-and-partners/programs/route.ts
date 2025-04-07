export const dynamic = 'force-dynamic';

const programs = Array.from({ length: 24 }, (_, i) => ({
  id: (i + 1).toString(),
  name: `Program ${i + 1}`,
  partner: [
    'National Research Council',
    'Math Works',
    'Microsoft Canada',
    'Space Agency',
    'Engineers Only',
    'LD Establish'
  ][i % 6],
  location: ['Ottawa', 'Toronto', 'Vancouver', 'Montreal', 'Calgary'][i % 5],
  category: ['science', 'technology', 'engineering', 'mathematics'][i % 4],
  description: `This is a detailed description for Program ${i + 1}, showcasing the various opportunities and benefits available to participants.`,
  startDate: new Date(2024, i % 12, 1).toISOString(),
  endDate: new Date(2024, (i % 12) + 3, 1).toISOString(),
  status: ['active', 'upcoming', 'completed'][i % 3]
}));

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '6');
  const category = searchParams.get('category');

  let filteredPrograms = programs;
  if (category && category !== 'all') {
    filteredPrograms = programs.filter(program => 
      program.category === category
    );
  }

  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedPrograms = filteredPrograms.slice(start, end);
  
  return Response.json({
    programs: paginatedPrograms,
    total: filteredPrograms.length,
    totalPages: Math.ceil(filteredPrograms.length / limit)
  });
} 