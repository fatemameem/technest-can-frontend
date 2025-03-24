'use client';

import Image from 'next/image';

interface MapToolbarProps {
  onToggleInfo: () => void;
  onToggleLayers: () => void;
  onToggleLegend: () => void;
  onToggleSearch: () => void;
  onToggleFilters: () => void;
  institutionFiltersCount: number;
  categoryFiltersCount: number;
  showFilterIcon?: boolean;
}

export default function MapToolbar({
  onToggleInfo,
  onToggleLayers,
  onToggleLegend,
  onToggleSearch,
  onToggleFilters,
  institutionFiltersCount,
  categoryFiltersCount,
  showFilterIcon = true
}: MapToolbarProps) {
  return (
    <div className="absolute top-2 sm:top-3 lg:top-4 left-2 sm:left-3 lg:left-4 bg-white rounded-md shadow-md flex p-0.5 sm:p-1 z-20">
      <button 
        className="p-1.5 sm:p-2 hover:bg-gray-100 rounded"
        onClick={onToggleInfo}
        title="Information"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6">
          <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
        </svg>
      </button>
      
      <button 
        className="p-1.5 sm:p-2 hover:bg-gray-100 rounded"
        onClick={onToggleLayers}
        title="Map Layers"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6">
          <path d="M5.566 4.657A4.505 4.505 0 016.75 4.5h10.5c.41 0 .806.055 1.183.157A3 3 0 0015.75 3h-7.5a3 3 0 00-2.684 1.657zM2.25 12a3 3 0 013-3h13.5a3 3 0 013 3v6a3 3 0 01-3 3H5.25a3 3 0 01-3-3v-6zM5.25 7.5c-.41 0-.806.055-1.184.157A3 3 0 016.75 6h10.5a3 3 0 012.683 1.657A4.505 4.505 0 0018.75 7.5H5.25z" />
        </svg>
      </button>
      
      <button 
        className="p-1.5 sm:p-2 hover:bg-gray-100 rounded"
        onClick={onToggleLegend}
        title="Legend"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6">
          <path fillRule="evenodd" d="M2.625 6.75a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875 0A.75.75 0 018.25 6h12a.75.75 0 010 1.5h-12a.75.75 0 01-.75-.75zM2.625 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zM7.5 12a.75.75 0 01.75-.75h12a.75.75 0 010 1.5h-12A.75.75 0 017.5 12zm-4.875 5.25a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875 0a.75.75 0 01.75-.75h12a.75.75 0 010 1.5h-12a.75.75 0 01-.75-.75z" clipRule="evenodd" />
        </svg>
      </button>
      
      {showFilterIcon && (
        <button 
          className="p-1.5 sm:p-2 hover:bg-gray-100 rounded relative"
          onClick={onToggleFilters}
          title="Category Filters"
        >
          <Image src="/category-filter.svg" alt="Filter" width={16} height={16} className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
          
          {categoryFiltersCount > 0 && (
            <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-green-500 text-white rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center text-[10px] sm:text-xs font-bold">
              {categoryFiltersCount}
            </div>
          )}
        </button>
      )}
      
      <button 
        className="p-1.5 sm:p-2 hover:bg-gray-100 rounded relative"
        onClick={onToggleSearch}
        title="Search"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6">
          <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
          <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clipRule="evenodd" />
        </svg>
        
        {institutionFiltersCount > 0 && (
          <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-blue-500 text-white rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center text-[10px] sm:text-xs font-bold">
            {institutionFiltersCount}
          </div>
        )}
      </button>
    </div>
  );
} 