import { NextResponse } from 'next/server';

interface MonthlyEngagement {
  month: string;
  count: number;
}

export async function GET() {
  // Placeholder data - would come from database
  const data: MonthlyEngagement[] = [
    { month: 'Jan', count: 1000 },
    { month: 'Feb', count: 1100 },
    { month: 'Mar', count: 1400 },
    { month: 'Apr', count: 1800 },
    { month: 'May', count: 1900 },
    { month: 'Jun', count: 2300 },
    { month: 'Jul', count: 2000 },
    { month: 'Aug', count: 1500 },
    { month: 'Sep', count: 1800 },
    { month: 'Oct', count: 1200 },
    { month: 'Nov', count: 2000 },
    { month: 'Dec', count: 2100 }
  ];

  return NextResponse.json(data);
} 