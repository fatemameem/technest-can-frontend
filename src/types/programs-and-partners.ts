export type TabType = 'partners' | 'programs' | 'custom';

export interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
}

export interface Partner {
  id: string;
  name: string;
  location: string;
  activePrograms: number;
  focusAreas: string[];
  categories: string[];
  type: string;
  contact: string;
  description: string;
  website: string;
  relatedPrograms: string[];
}

export interface Program {
  id: string;
  name: string;
  partner: string;
  location: string;
  category: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'upcoming' | 'completed';
}

export interface Custom {
  id: string;
  name: string;
  type: string;
  category: string;
  description: string;
  partner: string;
  status: 'active' | 'inactive';
} 