import { TabData } from '@/types/long-term-impact';

export const dynamic = 'force-dynamic';

const data: TabData = {
  categories: [
    { id: 'stem', name: 'STEM Education', color: '#4F46E5' },
    { id: 'diversity', name: 'Diversity', color: '#10B981' },
    { id: 'workforce', name: 'Workforce Development', color: '#F59E0B' },
    { id: 'innovation', name: 'Innovation', color: '#EC4899' }
  ],
  overview: {
    trendData: [
      { year: 2016, value: 30000 },
      { year: 2017, value: 32500 },
      { year: 2018, value: 31800 },
      { year: 2019, value: 32000 },
      { year: 2020, value: 31500 },
      { year: 2021, value: 32800 },
      { year: 2022, value: 30900 },
      { year: 2023, value: 38500 },
      { year: 2024, value: 39000 }
    ],
    monthlyDistribution: [
      { month: 'Jul', count: 25 },
      { month: 'Aug', count: 20 },
      { month: 'Sep', count: 30 },
      { month: 'Oct', count: 22 },
      { month: 'Nov', count: 18 },
      { month: 'Dec', count: 28 }
    ],
    recommendations: [
      { id: '1', text: 'Develop targeted outreach programs for underrepresented demographics' },
      { id: '2', text: 'Increase STEM funding and resources in low-participation regions' },
      { id: '3', text: 'Create mentorship and scholarship programs focusing on diversity and inclusion' },
      { id: '4', text: 'Collaborate with local educational institutions to customize STEM curricula' },
      { id: '5', text: 'Offer community-based STEM workshops & online resources for underserved areas' },
      { id: '6', text: 'Develop industry partnerships to provide hands-on training and internships' }
    ],
    reports: [
      { id: '1', title: 'Computer Science STEM Workforce (2023-24)', link: '/reports/cs-workforce-2023', year: '2023-24' },
      { id: '2', title: 'STEM Graduates by year (2019 - 24)', link: '/reports/stem-graduates-2024', year: '2019-24' },
      { id: '3', title: 'STEM Program Growth Trajectory (2025-26)', link: '/reports/growth-2025', year: '2025-26' }
    ]
  },
  demographic: [
    { group: 'Indigenous Communities', currentValue: 5, targetValue: 10 },
    { group: 'Rural Areas', currentValue: 7, targetValue: 15 },
    { group: 'Low-Income Regions', currentValue: 4, targetValue: 12 },
    { group: 'Visible Minorities', currentValue: 22, targetValue: 30 }
  ],
  regional: [
    { province: 'Ontario', participationRate: 28 },
    { province: 'Quebec', participationRate: 22 },
    { province: 'British Columbia', participationRate: 26 },
    { province: 'Alberta', participationRate: 27 },
    { province: 'Atlantic Provinces', participationRate: 15 }
  ]
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tab = searchParams.get('tab');

  if (!tab) {
    return Response.json({ categories: data.categories });
  }

  const tabData: Partial<TabData> = {
    categories: data.categories
  };

  switch (tab) {
    case 'overview':
      tabData.overview = data.overview;
      break;
    case 'demographic':
      tabData.demographic = data.demographic;
      break;
    case 'regional':
      tabData.regional = data.regional;
      break;
  }

  return Response.json(tabData);
} 