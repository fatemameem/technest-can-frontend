'use client';

import { useEffect, useState } from 'react';
import Header from "@/components/Header";
import ScholarshipCard from "@/components/scholarships/ScholarshipCard";
import { Category, Scholarship } from '@/types/scholarships';
// import KeyMetrics from "@/components/KeyMetrics";
// import ProgramEngagement from "@/components/ProgramEngagement";
// import RecentPrograms from "@/components/RecentPrograms";
// import Sidebar from "@/components/Sidebar";

export default function ScholarshipsAndGrants() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fetch categories
    fetch('/api/scholarships/categories')
      .then(res => res.json())
      .then(data => setCategories(data));

    // Fetch scholarships
    fetch('/api/scholarships')
      .then(res => res.json())
      .then(data => setScholarships(data));
  }, []);

  const filteredScholarships = scholarships.filter(scholarship => {
    const matchesCategory = selectedCategory === 'all' || scholarship.categories.includes(selectedCategory);
    const matchesSearch = scholarship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        scholarship.organization.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <div className="flex flex-col w-full min-h-screen">
        <Header/>
        <div className="flex-1 flex justify-start w-full items-start p-0 sm:p-4 md:p-6 lg:p-0">
          <main className="w-full shadow-sm overflow-y-auto bg-white border rounded-xl h-screen max-h-[86vh] sm:rounded-2xl md:rounded-3xl">
            <div className="max-w-6xl mx-auto p-4 sm:p-6 md:p-8 lg:p-10">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-800 mb-4 sm:mb-6">
                Discover STEM funding opportunities across Canada
              </h1>

              {/* Search Bar */}
              <div className="relative mb-4 sm:mb-6">
                <input
                  type="text"
                  placeholder="Search scholarships and grants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 pl-9 sm:pl-10 text-sm sm:text-base border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.slug)}
                    className={`px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors
                      ${selectedCategory === category.slug
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>

              {/* Scholarships List */}
              <div className="space-y-3 sm:space-y-4">
                {filteredScholarships.map(scholarship => (
                  <ScholarshipCard
                    key={scholarship.id}
                    scholarship={scholarship}
                  />
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
