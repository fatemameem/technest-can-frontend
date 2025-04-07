'use client';

import { useState } from 'react';
import { Partner } from '@/types/programs-and-partners';

interface PartnerCardProps {
  partner: Partner;
  categoryColor: string;
}

export default function PartnerCard({ partner, categoryColor }: PartnerCardProps) {
  const [showDetails, setShowDetails] = useState(false);

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
                  {partner.name}
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 flex-shrink-0">
                  {partner.type}
                </span>
              </div>
              <p className="text-sm text-gray-600 truncate">{partner.location}</p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">{partner.activePrograms}</span> Active Programs
              </p>
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
                  {partner.name}
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 flex-shrink-0">
                  {partner.type}
                </span>
              </div>
              
              <div className="space-y-2 sm:space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-700">Details</p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Location:</span> {partner.location}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Active Programs:</span> {partner.activePrograms}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Focus Areas:</span> {partner.focusAreas.join(', ')}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700">Description</p>
                  <p className="text-sm text-gray-600 line-clamp-3">{partner.description}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700">Contact</p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Website:</span>{' '}
                    <a 
                      href={partner.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {partner.contact}
                    </a>
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700">Related Programs</p>
                  <div className="flex flex-wrap gap-1">
                    {partner.relatedPrograms.map((program, index) => (
                      <span 
                        key={index}
                        className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full"
                      >
                        {program}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 