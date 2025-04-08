'use client';

import { useState } from 'react';
import { Scholarship } from '@/types/scholarships';

interface ScholarshipCardProps {
  scholarship: Scholarship;
}

export default function ScholarshipCard({ scholarship }: ScholarshipCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-blue-50 rounded-lg sm:rounded-xl overflow-hidden mb-3 sm:mb-4">
      <div 
        className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex-1 mb-2 sm:mb-0">
          <h3 className="text-base sm:text-xl font-semibold text-gray-900">{scholarship.title}</h3>
          <p className="text-sm sm:text-base text-gray-600">{scholarship.organization}</p>
        </div>
        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-2 sm:gap-4">
          <span className="text-lg sm:text-2xl font-semibold text-green-600">
            ${scholarship.amount.toLocaleString()}
          </span>
          <svg 
            className={`w-5 h-5 sm:w-6 sm:h-6 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      
      {isExpanded && (
        <div className="p-3 sm:p-4 pt-0">
          <div className="border-t border-blue-100 pt-3 sm:pt-4">
            <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4">{scholarship.description}</p>
            
            {scholarship.eligibility && (
              <div className="mb-2 sm:mb-3">
                <strong className="text-sm sm:text-base text-gray-900">Eligibility:</strong>
                <p className="text-sm sm:text-base text-gray-700">{scholarship.eligibility}</p>
              </div>
            )}
            
            {scholarship.deadline && (
              <div className="mb-2 sm:mb-3">
                <strong className="text-sm sm:text-base text-gray-900">Deadline:</strong>
                <p className="text-sm sm:text-base text-gray-700">
                  {new Date(scholarship.deadline).toLocaleDateString('en-CA', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            )}
            
            {scholarship.applicationUrl && (
              <a
                href={scholarship.applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-600 text-white px-4 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base rounded-full hover:bg-blue-700 transition-colors"
              >
                Apply Now
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 