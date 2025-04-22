'use client';

import { useEffect, useState } from 'react';
import Header from "@/components/Header";
import TabContent from "@/components/long-term-impact/TabContent";
import { TabData, TabType } from '@/types/long-term-impact';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
// import KeyMetrics from "@/components/KeyMetrics";
// import ProgramEngagement from "@/components/ProgramEngagement";
// import RecentPrograms from "@/components/RecentPrograms";
// import Sidebar from "@/components/Sidebar";

export default function LongTermImpact() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [data, setData] = useState<TabData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/long-term-impact?tab=${activeTab}`);
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  const tabs: { id: TabType; name: string }[] = [
    { id: 'overview', name: 'Overview' },
    { id: 'demographic', name: 'Demographic Analysis' },
    { id: 'regional', name: 'Regional Insights' },
  ];

  const handleTabChange = (tabId: TabType) => {
    setActiveTab(tabId);
    setIsDropdownOpen(false);
  };

  return (
    <div className="flex flex-col w-full min-h-screen">
      <Header/>
      <div className="flex-1 flex justify-start w-full items-start p-2 sm:p-4">
        <main className="w-full shadow-sm overflow-y-auto bg-white border rounded-xl sm:rounded-2xl md:rounded-3xl">
          <div className="max-w-7xl mx-auto p-3 sm:p-4 md:p-6 lg:p-8">
            {/* Dropdown for small screens */}
            <div className="lg:hidden relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full bg-gray-100 rounded-xl p-3 flex items-center justify-between gap-2 text-sm font-medium text-gray-900"
              >
                <span>{tabs.find(tab => tab.id === activeTab)?.name}</span>
                <ChevronDownIcon 
                  className={`w-5 h-5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>
              
              {isDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white rounded-xl shadow-lg border">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      className={`w-full px-4 py-3 text-left text-sm transition-colors
                        ${activeTab === tab.id
                          ? 'bg-gray-50 text-gray-900 font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                      {tab.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Regular tabs for large screens */}
            <div className="hidden lg:flex bg-gray-100 rounded-xl p-1 flex-wrap sm:flex-nowrap gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 min-w-[120px] px-3 py-2 text-sm font-medium rounded-lg transition-colors
                    ${activeTab === tab.id
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  {tab.name}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="mt-4 sm:mt-6">
              {isLoading ? (
                <div className="space-y-4 animate-pulse">
                  <div className="h-[300px] bg-gray-100 rounded-2xl" />
                  <div className="h-[200px] bg-gray-100 rounded-2xl" />
                </div>
              ) : data ? (
                <TabContent activeTab={activeTab} data={data} />
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">Failed to load data</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
