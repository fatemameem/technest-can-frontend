"use client";

import MapContainer from "@/components/geographic/MapContainer";
import Header from "@/components/Header";
import { useState } from "react";

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
    <div className="h-screen flex flex-col ">
      <Header/>
      
      {/* This div will take up all remaining vertical space */}
      <div className="flex-1 bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="flex h-full">
          {/* Filters Panel - conditionally rendered based on visibility */}
          {filtersVisible && (
            <div className="w-72 p-6 border-r border-gray-200 flex-shrink-0 h-full overflow-y-auto flex flex-col">
              <h3 className="text-xl font-semibold mb-8">STEM Fields</h3>
              <div className="flex flex-col justify-around flex-1 py-8">
                <button
                  onClick={() => handleCategorySelect('all')}
                  className={`px-6 py-3 rounded-full text-center text-lg ${
                    isCategorySelected('all') 
                      ? "bg-gray-800 text-white" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All Events
                </button>
                
                <button
                  onClick={() => handleCategorySelect('engineering')}
                  className={`px-6 py-3 rounded-full text-center text-lg ${
                    isCategorySelected('engineering') 
                      ? "bg-orange-500 text-white" 
                      : "bg-orange-100 text-orange-700 hover:bg-orange-200"
                  }`}
                >
                  Engineering
                </button>
                
                <button
                  onClick={() => handleCategorySelect('mathematics')}
                  className={`px-6 py-3 rounded-full text-center text-lg ${
                    isCategorySelected('mathematics') 
                      ? "bg-pink-500 text-white" 
                      : "bg-pink-100 text-pink-700 hover:bg-pink-200"
                  }`}
                >
                  Mathematics
                </button>
                
                <button
                  onClick={() => handleCategorySelect('science')}
                  className={`px-6 py-3 rounded-full text-center text-lg ${
                    isCategorySelected('science') 
                      ? "bg-green-500 text-white" 
                      : "bg-green-100 text-green-700 hover:bg-green-200"
                  }`}
                >
                  Science
                </button>
                
                <button
                  onClick={() => handleCategorySelect('technology')}
                  className={`px-6 py-3 rounded-full text-center text-lg ${
                    isCategorySelected('technology') 
                      ? "bg-purple-500 text-white" 
                      : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                  }`}
                >
                  Technology
                </button>
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
