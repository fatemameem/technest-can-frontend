'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Program {
  id: string;
  name: string;
  location: string;
  status: 'Active' | 'Completed' | 'Upcoming';
  externalUrl: string;
}

export default function RecentPrograms() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const response = await fetch('/api/recent-programs');
      const data = await response.json();
      setPrograms(data);
    } catch (error) {
      console.error('Error fetching programs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: Program['status']) => {
    switch (status) {
      case 'Active':
        return 'text-green-500';
      case 'Upcoming':
        return 'text-blue-500';
      case 'Completed':
        return 'text-gray-500';
      default:
        return 'text-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl shadow-sm h-full animate-pulse">
        <div className="h-6 sm:h-8 bg-gray-200 rounded w-1/3 mb-4 sm:mb-6"></div>
        <div className="space-y-3 sm:space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-100 h-16 sm:h-20 rounded-lg sm:rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl shadow-sm h-full">
      <h2 className="text-lg sm:text-xl lg:text-[28px] font-semibold text-gray-900 mb-4 sm:mb-6">Recent Programs</h2>
      <div className="space-y-2 sm:space-y-3">
        {programs.map((program) => (
          <Link
            key={program.id}
            href={program.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block group"
          >
            <div className="bg-[#F8F9FC] rounded-lg sm:rounded-xl p-3 sm:p-4 transition-all duration-200 hover:bg-blue-50">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 group-hover:text-blue-600">
                    {program.name}
                  </h3>
                  <p className="text-gray-500 text-xs sm:text-sm mt-1">{program.location}</p>
                </div>
                <span className={`${getStatusColor(program.status)} text-xs sm:text-sm font-medium`}>
                  {program.status}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}