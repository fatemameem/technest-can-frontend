export interface Program {
  id: string;
  position: {
    lat: number;
    lng: number;
  };
  title: string;
  category: string;
  icon: string;
  description: string;
  university: string;
}

const programs: Program[] = [
  {
    id: '1',
    position: { lat: 49.2827, lng: -123.1207 },
    title: 'Women in Engineering Summit',
    category: 'engineering',
    icon: '/images/markers/orange-marker.svg',
    description: 'Annual gathering of women in engineering fields',
    university: 'University of British Columbia'
  },
  {
    id: '2',
    position: { lat: 53.5461, lng: -113.4938 },
    title: 'Mathematics Research Program',
    category: 'mathematics',
    icon: '/images/markers/pink-marker.svg',
    description: 'Advanced mathematics research initiative',
    university: 'University of Alberta'
  },
  {
    id: '3',
    position: { lat: 51.0447, lng: -114.0719 },
    title: 'Science Camp 2024',
    category: 'science',
    icon: '/images/markers/green-marker.svg',
    description: 'Summer science program for high school students',
    university: 'University of Calgary'
  },
  {
    id: '4',
    position: { lat: 45.5017, lng: -73.5673 },
    title: 'Technology Innovation Lab',
    category: 'technology',
    icon: '/images/markers/purple-marker.svg',
    description: 'Cutting-edge technology research facility',
    university: 'McGill University'
  },
  // Toronto
  {
    id: '5',
    position: { lat: 43.6532, lng: -79.3832 },
    title: 'AI Research Conference',
    category: 'technology',
    icon: '/images/markers/purple-marker.svg',
    description: 'Annual conference for artificial intelligence researchers',
    university: 'University of Toronto'
  },
  // Vancouver
  {
    id: '6',
    position: { lat: 49.2606, lng: -123.2460 },
    title: 'Quantum Physics Symposium',
    category: 'science',
    icon: '/images/markers/green-marker.svg',
    description: 'International symposium on quantum physics advancements',
    university: 'University of British Columbia'
  },
  // Ottawa
  {
    id: '7',
    position: { lat: 45.4215, lng: -75.6972 },
    title: 'National Engineering Competition',
    category: 'engineering',
    icon: '/images/markers/orange-marker.svg',
    description: 'Competition for engineering students across Canada',
    university: 'University of Ottawa'
  },
  // Halifax
  {
    id: '8',
    position: { lat: 44.6488, lng: -63.5752 },
    title: 'Ocean Science Research Center',
    category: 'science',
    icon: '/images/markers/green-marker.svg',
    description: 'Research center focusing on marine biology and ocean conservation',
    university: 'Dalhousie University'
  },
  // Winnipeg
  {
    id: '9',
    position: { lat: 49.8951, lng: -97.1384 },
    title: 'Statistics and Data Science Workshop',
    category: 'mathematics',
    icon: '/images/markers/pink-marker.svg',
    description: 'Workshop on modern statistical methods and data analysis',
    university: 'University of Manitoba'
  },
  // Quebec City
  {
    id: '10',
    position: { lat: 46.8139, lng: -71.2080 },
    title: 'Robotics Engineering Lab',
    category: 'engineering',
    icon: '/images/markers/orange-marker.svg',
    description: 'Advanced robotics research and development facility',
    university: 'Université Laval'
  },
  // Victoria
  {
    id: '11',
    position: { lat: 48.4284, lng: -123.3656 },
    title: 'Marine Technology Center',
    category: 'technology',
    icon: '/images/markers/purple-marker.svg',
    description: 'Center for marine technology development and testing',
    university: 'University of Victoria'
  },
  // Saskatoon
  {
    id: '12',
    position: { lat: 52.1332, lng: -106.6700 },
    title: 'Computational Mathematics Program',
    category: 'mathematics',
    icon: '/images/markers/pink-marker.svg',
    description: 'Research program focused on computational and applied mathematics',
    university: 'University of Saskatchewan'
  },
  // St. John's
  {
    id: '13',
    position: { lat: 47.5615, lng: -52.7126 },
    title: 'Ocean Engineering Institute',
    category: 'engineering',
    icon: '/images/markers/orange-marker.svg',
    description: 'Research institute specializing in offshore and ocean engineering',
    university: 'Memorial University of Newfoundland'
  },
  // London, ON
  {
    id: '14',
    position: { lat: 42.9849, lng: -81.2453 },
    title: 'Medical Science Research',
    category: 'science',
    icon: '/images/markers/green-marker.svg',
    description: 'Advanced medical science research facility',
    university: 'Western University'
  },
  // Kingston
  {
    id: '15',
    position: { lat: 44.2312, lng: -76.4860 },
    title: 'Applied Mathematics Symposium',
    category: 'mathematics',
    icon: '/images/markers/pink-marker.svg',
    description: 'Annual symposium on applied mathematics and its applications',
    university: 'Queen\'s University'
  },
  // Waterloo
  {
    id: '16',
    position: { lat: 43.4723, lng: -80.5449 },
    title: 'Cybersecurity Innovation Hub',
    category: 'technology',
    icon: '/images/markers/purple-marker.svg',
    description: 'Research center focusing on advanced cybersecurity technologies',
    university: 'University of Waterloo'
  },
  // Guelph
  {
    id: '17',
    position: { lat: 43.5448, lng: -80.2482 },
    title: 'Agricultural Science Center',
    category: 'science',
    icon: '/images/markers/green-marker.svg',
    description: 'Research center for agricultural sciences and sustainable farming',
    university: 'University of Guelph'
  },
  // Hamilton
  {
    id: '18',
    position: { lat: 43.2557, lng: -79.8711 },
    title: 'Engineering Materials Lab',
    category: 'engineering',
    icon: '/images/markers/orange-marker.svg',
    description: 'Research laboratory specializing in advanced materials for engineering',
    university: 'McMaster University'
  },
  // Regina
  {
    id: '19',
    position: { lat: 50.4452, lng: -104.6189 },
    title: 'Energy Technology Research',
    category: 'technology',
    icon: '/images/markers/purple-marker.svg',
    description: 'Research center focusing on sustainable energy technologies',
    university: 'University of Regina'
  },
  // Fredericton
  {
    id: '20',
    position: { lat: 45.9636, lng: -66.6431 },
    title: 'Forestry Science Institute',
    category: 'science',
    icon: '/images/markers/green-marker.svg',
    description: 'Research institute specializing in forestry and environmental science',
    university: 'University of New Brunswick'
  }
];

export async function GET() {
  try {
    // Add a small delay to simulate a real API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return new Response(JSON.stringify(programs), {
      headers: { 'content-type': 'application/json' },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: `Failed to fetch geographic data: ${errorMessage}` }), 
      {
        status: 500,
        headers: { 'content-type': 'application/json' },
      }
    );
  }
} 