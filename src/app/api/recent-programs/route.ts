export interface Program {
  id: string;
  name: string;
  location: string;
  status: 'Active' | 'Completed' | 'Upcoming';
  externalUrl: string;
}

const recentPrograms: Program[] = [
  {
    id: '1',
    name: 'Arctic Science Initiative',
    location: 'Iqaluit, NU',
    status: 'Active',
    externalUrl: 'https://example.com/arctic-science'
  },
  {
    id: '2',
    name: 'Women in Engineering Summit',
    location: 'Vancouver, BC',
    status: 'Active',
    externalUrl: 'https://example.com/women-engineering'
  },
  {
    id: '3',
    name: 'STEM Panel: Future of Tech',
    location: 'Montreal, QC',
    status: 'Upcoming',
    externalUrl: 'https://concordia.ca/events/stem-panel'
  }
];

export async function GET() {
  try {
    return new Response(JSON.stringify(recentPrograms), {
      headers: { 'content-type': 'application/json' },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: `Failed to fetch programs: ${errorMessage}` }), 
      {
        status: 500,
        headers: { 'content-type': 'application/json' },
      }
    );
  }
} 