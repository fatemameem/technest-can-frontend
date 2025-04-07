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