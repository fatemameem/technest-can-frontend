export type TabType = 'overview' | 'demographic' | 'regional';

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface TrendData {
  year: number;
  value: number;
}

export interface MonthlyDistribution {
  month: string;
  count: number;
}

export interface Report {
  id: string;
  title: string;
  link: string;
  year: string;
}

export interface Recommendation {
  id: string;
  text: string;
}

export interface DemographicData {
  group: string;
  currentValue: number;
  targetValue: number;
}

export interface RegionalData {
  province: string;
  participationRate: number;
}

export interface OverviewData {
  trendData: TrendData[];
  monthlyDistribution: MonthlyDistribution[];
  recommendations: Recommendation[];
  reports: Report[];
}

export interface TabData {
  categories: Category[];
  overview?: OverviewData;
  demographic?: DemographicData[];
  regional?: RegionalData[];
} 