'use client';

import { useState } from 'react';
import { Program } from '@/types/programs-and-partners';

interface ProgramCardProps {
  program: Program;
  categoryColor: string;
}

export default function ProgramCard({ program, categoryColor }: ProgramCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div 
      className="bg-gray-50 rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md border border-gray-100"
      onClick={() => setShowDetails(!showDetails)}
    >
      {!showDetails ? (
        <div className="p-3 sm:p-4">
          <div className="flex items-start gap-2 sm:gap-3">
            <div 
              className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full mt-1.5"
              style={{ backgroundColor: categoryColor }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                  {program.name}
                </h3>
                <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${getStatusColor(program.status)}`}>
                  {program.status.charAt(0).toUpperCase() + program.status.slice(1)}
                </span>
              </div>
              <p className="text-sm text-gray-600 truncate">{program.partner}</p>
              <p className="text-sm text-gray-600 truncate">{program.location}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-3 sm:p-4">
          <div className="flex items-start gap-2 sm:gap-3">
            <div 
              className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full mt-1.5"
              style={{ backgroundColor: categoryColor }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-2">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                  {program.name}
                </h3>
                <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${getStatusColor(program.status)}`}>
                  {program.status.charAt(0).toUpperCase() + program.status.slice(1)}
                </span>
              </div>
              
              <div className="space-y-2 sm:space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-700">Details</p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Partner:</span> {program.partner}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Location:</span> {program.location}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700">Description</p>
                  <p className="text-sm text-gray-600 line-clamp-3">{program.description}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700">Duration</p>
                  <p className="text-sm text-gray-600">
                    {new Date(program.startDate).toLocaleDateString('en-CA')} - {' '}
                    {new Date(program.endDate).toLocaleDateString('en-CA')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 