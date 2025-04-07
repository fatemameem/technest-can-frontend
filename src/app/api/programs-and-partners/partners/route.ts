export const dynamic = 'force-dynamic';

const basePartners = [
  {
    id: '1',
    name: 'National Research Council',
    location: 'Ottawa',
    activePrograms: 20,
    focusAreas: ['Research', 'Innovation'],
    categories: ['science'],
    type: 'Government',
    contact: 'nrc.gc.ca',
    description: 'Dedicated to inspiring Canadian youth',
    website: 'https://nrc.canada.ca/en',
    relatedPrograms: ['Youth Science Program', 'Research Mentorship']
  },
  {
    id: '2',
    name: 'Math Works',
    location: 'Multiple Locations',
    activePrograms: 6,
    focusAreas: ['Mathematical Computing', 'Data Analysis'],
    categories: ['mathematics'],
    type: 'Private',
    contact: 'mathworks.com',
    description: 'Leading provider of mathematical computing software',
    website: 'https://mathworks.com',
    relatedPrograms: ['MATLAB Training', 'Data Science Workshop']
  },
  {
    id: '3',
    name: 'Microsoft Canada',
    location: 'Multiple Locations',
    activePrograms: 12,
    focusAreas: ['Coding Education', 'Digital Literacy'],
    categories: ['technology'],
    type: 'Corporate',
    contact: 'microsoft.ca',
    description: 'Empowering every person and organization to achieve more',
    website: 'https://microsoft.ca',
    relatedPrograms: ['Azure Cloud Workshop', 'Code.org Partnership']
  },
  {
    id: '4',
    name: 'Space Agency',
    location: 'National',
    activePrograms: 8,
    focusAreas: ['Space Science', 'Research'],
    categories: ['science'],
    type: 'Government',
    contact: 'asc-csa.gc.ca',
    description: 'Advancing space science and technology',
    website: 'https://asc-csa.gc.ca',
    relatedPrograms: ['Space Research Program', 'Astronaut Training']
  },
  {
    id: '5',
    name: 'Engineers Only',
    location: 'National',
    activePrograms: 15,
    focusAreas: ['Sustainable Engineering'],
    categories: ['engineering'],
    type: 'Professional Association',
    contact: 'engineersonly.ca',
    description: 'Supporting engineering excellence in Canada',
    website: 'https://engineersonly.ca',
    relatedPrograms: ['Professional Development', 'Mentorship Program']
  },
  {
    id: '6',
    name: 'LD Establish',
    location: 'Multiple Locations',
    activePrograms: 8,
    focusAreas: ['Digital Literacy'],
    categories: ['technology'],
    type: 'Non-Profit',
    contact: 'ldestablish.org',
    description: 'Making technology accessible to all',
    website: 'https://ldestablish.org',
    relatedPrograms: ['Digital Skills Workshop', 'Tech Literacy Program']
  }
];

// Generate additional partners
const partners = [
  ...basePartners,
  ...Array.from({ length: 18 }, (_, i) => ({
    id: (i + 7).toString(),
    name: `Partner Organization ${i + 7}`,
    location: ['Ottawa', 'Toronto', 'Vancouver', 'Montreal', 'Calgary'][i % 5],
    activePrograms: Math.floor(Math.random() * 20) + 1,
    focusAreas: [
      ['Research', 'Innovation'],
      ['Mathematical Computing', 'Data Analysis'],
      ['Coding Education', 'Digital Literacy'],
      ['Space Science', 'Research'],
      ['Sustainable Engineering'],
      ['Digital Literacy']
    ][i % 6],
    categories: [['science'], ['technology'], ['engineering'], ['mathematics']][i % 4],
    type: ['Government', 'Private', 'Corporate', 'Non-Profit', 'Academic'][i % 5],
    contact: `partner${i + 7}.ca`,
    description: `Partner Organization ${i + 7} is dedicated to advancing STEM education and research in Canada.`,
    website: `https://partner${i + 7}.ca`,
    relatedPrograms: [`Program A${i + 7}`, `Program B${i + 7}`]
  }))
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '6');
  const category = searchParams.get('category');

  let filteredPartners = partners;
  if (category && category !== 'all') {
    filteredPartners = partners.filter(partner => 
      partner.categories.includes(category)
    );
  }

  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedPartners = filteredPartners.slice(start, end);
  
  return Response.json({
    partners: paginatedPartners,
    total: filteredPartners.length,
    totalPages: Math.ceil(filteredPartners.length / limit)
  });
} 