"use client";

import MapContainer from "@/components/geographic/MapContainer";
import Header from "@/components/Header";
import { useState } from "react";

interface Category {
  id: string;
  label: string;
}

const categoryOptions: Category[] = [
  { id: 'all', label: 'All Events' },
  { id: 'engineering', label: 'Engineering' },
  { id: 'mathematics', label: 'Mathematics' },
  { id: 'science', label: 'Science' },
  { id: 'technology', label: 'Technology' }
];

export default function GeographicInsightsPage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [filtersVisible, setFiltersVisible] = useState(true);
  
  const handleCategorySelect = (category: string) => {
    if (category === 'all') {
      setSelectedCategories(['all']);
    } else {
      if (selectedCategories.includes(category)) {
        const newCategories = selectedCategories.filter(c => c !== category);
        setSelectedCategories(newCategories.length > 0 ? newCategories : []);
      } else {
        const newCategories = selectedCategories.includes('all') 
          ? [category] 
          : [...selectedCategories, category];
        
        // Check if all individual categories are selected
        const allCategories = ['engineering', 'mathematics', 'science', 'technology'];
        const wouldHaveAllCategories = allCategories.every(cat => 
          newCategories.includes(cat) || cat === category
        );
        
        // If all categories would be selected, just use 'all' instead
        if (wouldHaveAllCategories) {
          setSelectedCategories(['all']);
        } else {
          setSelectedCategories(newCategories);
        }
      }
    }
    
    if (filtersVisible) {
      setFiltersVisible(false);
    }
  };
  
  const toggleFilters = () => {
    setFiltersVisible(!filtersVisible);
  };
  
  const isCategorySelected = (category: string) => {
    return selectedCategories.includes(category);
  };
  
  return (
    <div className="h-screen flex flex-col">
      <Header/>
      
      {/* Main content area */}
      <div className="flex-1 bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="h-full flex flex-col lg:flex-row">
          {/* Filters Panel - conditionally rendered based on visibility */}
          {filtersVisible && (
            <div className={`
              ${filtersVisible ? 'block' : 'hidden'}
              lg:w-72 
              p-4 sm:p-5 lg:p-6 
              lg:border-r border-gray-200 
              flex-shrink-0 
              lg:h-full 
              bg-white
              z-10
              ${filtersVisible ? 'lg:block' : 'lg:hidden'}
              border-b
            `}>
              <h3 className="text-lg sm:text-xl lg:text-xl font-semibold mb-4 lg:mb-8">STEM Fields</h3>
              <div className="flex flex-wrap gap-2 sm:gap-3 lg:gap-4 justify-start">
                {/* All Events button - always full width */}
                <button
                  onClick={() => handleCategorySelect('all')}
                  className={`
                    w-full
                    px-3 sm:px-4 lg:px-6 
                    py-2 sm:py-2.5 lg:py-3 
                    rounded-full 
                    text-center 
                    text-sm sm:text-base lg:text-lg 
                    ${isCategorySelected('all') 
                      ? "bg-gray-800 text-white" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"}
                  `}
                >
                  All Events
                </button>
                
                {/* Other category buttons */}
                {categoryOptions.slice(1).map((category, index, array) => {
                  // Calculate if this button should be centered
                  const isLastItem = index === array.length - 1;
                  const isAloneInLastRow = isLastItem && array.length % 2 === 0;
                  
                  return (
                <button
                      key={category.id}
                      onClick={() => handleCategorySelect(category.id)}
                      className={`
                        ${isAloneInLastRow ? 'w-[calc(50%-0.25rem)] sm:w-[calc(33.333%-0.67rem)] mx-auto' : 'w-[calc(50%-0.25rem)] sm:w-[calc(33.333%-0.67rem)]'}
                        lg:w-full
                        px-3 sm:px-4 lg:px-6 
                        py-2 sm:py-2.5 lg:py-3 
                        rounded-full 
                        text-center 
                        text-sm sm:text-base lg:text-lg
                        ${(() => {
                          switch(category.id) {
                            case 'engineering':
                              return isCategorySelected('engineering') 
                      ? "bg-orange-500 text-white" 
                                : "bg-orange-100 text-orange-700 hover:bg-orange-200";
                            case 'mathematics':
                              return isCategorySelected('mathematics') 
                      ? "bg-pink-500 text-white" 
                                : "bg-pink-100 text-pink-700 hover:bg-pink-200";
                            case 'science':
                              return isCategorySelected('science') 
                      ? "bg-green-500 text-white" 
                                : "bg-green-100 text-green-700 hover:bg-green-200";
                            case 'technology':
                              return isCategorySelected('technology') 
                      ? "bg-purple-500 text-white" 
                                : "bg-purple-100 text-purple-700 hover:bg-purple-200";
                            default:
                              return "";
                          }
                        })()}
                      `}
                >
                      {category.label}
                </button>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Map Container - takes all remaining space */}
          <div className="flex-1 h-full flex flex-col">            
            {/* Map container */}
            <div className="flex-1">
              <MapContainer 
                selectedCategories={selectedCategories} 
                onCategorySelect={handleCategorySelect}
                onToggleFiltersVisibility={toggleFilters}
                sidebarVisible={filtersVisible}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
