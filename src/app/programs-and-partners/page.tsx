'use client';

import { useEffect, useState } from 'react';
import Header from "@/components/Header";
import PartnerCard from "@/components/programs-and-partners/PartnerCard";
import ProgramCard from "@/components/programs-and-partners/ProgramCard";
import CustomCard from "@/components/programs-and-partners/CustomCard";
import Pagination from "@/components/programs-and-partners/Pagination";
import { Category, Partner, Program, Custom, TabType } from '@/types/programs-and-partners';

export default function ProgramsAndPartners() {
  const [activeTab, setActiveTab] = useState<TabType>('partners');
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [partners, setPartners] = useState<Partner[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [customs, setCustoms] = useState<Custom[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch categories
    fetch('/api/programs-and-partners/categories')
      .then(res => res.json())
      .then(data => setCategories(data));

    // Reset page when tab or category changes
    setCurrentPage(1);
    setIsLoading(true);
  }, [activeTab, selectedCategory]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        let response;
        switch (activeTab) {
          case 'partners':
            response = await fetch(`/api/programs-and-partners/partners?page=${currentPage}&category=${selectedCategory}`);
            const partnerData = await response.json();
            setPartners(partnerData.partners);
            setTotalPages(partnerData.totalPages);
            break;
          case 'programs':
            response = await fetch(`/api/programs-and-partners/programs?page=${currentPage}&category=${selectedCategory}`);
            const programData = await response.json();
            setPrograms(programData.programs);
            setTotalPages(programData.totalPages);
            break;
          case 'custom':
            response = await fetch(`/api/programs-and-partners/custom?page=${currentPage}&category=${selectedCategory}`);
            const customData = await response.json();
            setCustoms(customData.customs);
            setTotalPages(customData.totalPages);
            break;
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [activeTab, currentPage, selectedCategory]);

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.color || '#000000';
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-xl h-40 animate-pulse" />
          ))}
        </div>
      );
    }

    switch (activeTab) {
      case 'partners':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
            {partners.map(partner => (
              <PartnerCard
                key={partner.id}
                partner={partner}
                categoryColor={getCategoryColor(partner.categories[0])}
              />
            ))}
          </div>
        );
      case 'programs':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
            {programs.map(program => (
              <ProgramCard
                key={program.id}
                program={program}
                categoryColor={getCategoryColor(program.category)}
              />
            ))}
          </div>
        );
      case 'custom':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
            {customs.map(custom => (
              <CustomCard
                key={custom.id}
                custom={custom}
                categoryColor={getCategoryColor(custom.category)}
              />
            ))}
          </div>
        );
    }
  };

  return (
      <div className="flex flex-col w-full min-h-screen">
        <Header/>
        <div className="flex-1 flex justify-start w-full items-start">
        <main className="w-full shadow-sm overflow-y-auto bg-white border rounded-xl sm:rounded-2xl md:rounded-3xl">
          <div className="max-w-7xl mx-auto p-3 sm:p-4 md:p-6 lg:p-8">
            {/* Tabs */}
            <div className="border-b border-gray-200 overflow-x-auto">
              <nav className="flex gap-4 min-w-max pb-1">
                {(['partners', 'programs', 'custom'] as TabType[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 px-1 text-sm font-medium capitalize border-b-2 transition-colors whitespace-nowrap
                      ${activeTab === tab
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>

            {/* Page Title */}
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-4 sm:mt-5 lg:mt-6 mb-3 sm:mb-4">
              Top {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h1>

            {/* Categories */}
            <div className="flex flex-wrap gap-2 mb-4 sm:mb-5 lg:mb-6 overflow-x-auto pb-1">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 sm:px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap
                  ${selectedCategory === 'all'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                All Categories
              </button>
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  style={{
                    backgroundColor: selectedCategory === category.id ? category.color : '#f3f4f6',
                    color: selectedCategory === category.id ? 'white' : 'rgb(55, 65, 81)',
                    opacity: selectedCategory === category.id ? 1 : 0.9
                  }}
                  className="px-3 sm:px-4 py-1.5 rounded-full text-sm font-medium transition-all hover:opacity-100 whitespace-nowrap"
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Content */}
            {renderContent()}

            {/* Pagination */}
            {!isLoading && totalPages > 1 && (
              <div className="mt-6 sm:mt-8 lg:mt-10">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>
          </main>
        </div>
      </div>
  );
}
