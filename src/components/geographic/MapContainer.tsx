'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import MapControls from './MapControls';
import MapToolbar from './MapToolbar';

// Define TypeScript types
interface MapContainerProps {
  selectedCategories: string[];
  onToggleFiltersVisibility: () => void;
  onCategorySelect: (category: string) => void;
  sidebarVisible?: boolean;
}

interface MapMarker {
  id: string;
  position: google.maps.LatLngLiteral;
  title: string;
  category: string;
  icon: string;
  description?: string;
  university?: string;
}

// Map container styles
const containerStyle = {
  width: '100%',
  height: '100%'
};

// Center on Canada
const center = {
  lat: 56.1304,
  lng: -106.3468
};

// Style the map
const mapOptions = {
  disableDefaultUI: true,
  zoomControl: false,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
  styles: [
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{ color: '#B3D1FF' }]
    },
    {
      featureType: 'landscape',
      elementType: 'geometry',
      stylers: [{ color: '#E8F5E9' }]
    }
    // Add more styles as needed
  ]
};

export default function MapContainer({ 
  selectedCategories, 
  onToggleFiltersVisibility, 
  onCategorySelect,
  sidebarVisible = true 
}: MapContainerProps) {
  // Set up map loading
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries: ['places']
  });

  // State for UI features
  const [showInfo, setShowInfo] = useState(false);
  const [showLayers, setShowLayers] = useState(false);
  const [showLegend, setShowLegend] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  // State to track selected marker and visible markers
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const mapRef = useRef<google.maps.Map | null>(null);

  // Update the layer panel positioning and add functionality
  const [mapType, setMapType] = useState<string>("roadmap");
  const [showTraffic, setShowTraffic] = useState(false);
  const trafficLayer = useRef<{ setMap: (map: google.maps.Map | null) => void } | null>(null);

  // Add new state variables
  const [searchTerm, setSearchTerm] = useState('');
  const [institutionFilters, setInstitutionFilters] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showCategoryFilters, setShowCategoryFilters] = useState(false);

  // Category options
  const categoryOptions = [
    { id: 'all', label: 'All Events' },
    { id: 'engineering', label: 'Engineering' },
    { id: 'mathematics', label: 'Mathematics' },
    { id: 'science', label: 'Science' },
    { id: 'technology', label: 'Technology' }
  ];

  // Load markers from API
  useEffect(() => {
    const fetchMarkers = async () => {
      try {
        const response = await fetch('/api/geographic-insights');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setMarkers(data);
      } catch (error) {
        console.error("Error fetching map data:", error);
        // You could set an error state here to show to the user
      }
    };

    fetchMarkers();
  }, []);

  // Filter markers based on selected categories
  const filteredMarkers = markers.filter(marker => {
    // Category filter
    const passesCategory = selectedCategories.length === 0 || 
                          selectedCategories.includes('all') || 
                          selectedCategories.includes(marker.category);
    
    // Institution filter
    const passesInstitution = institutionFilters.length === 0 || 
                              (marker.university && 
                              institutionFilters.some(i => 
                                marker.university?.toLowerCase().includes(i.toLowerCase())));
    
    return passesCategory && passesInstitution;
  });

  // Map control handlers
  const handleZoomIn = useCallback(() => {
    if (mapRef.current) {
      const currentZoom = mapRef.current.getZoom() || 4;
      mapRef.current.setZoom(currentZoom + 1);
    }
  }, []);

  const handleZoomOut = useCallback(() => {
    if (mapRef.current) {
      const currentZoom = mapRef.current.getZoom() || 4;
      mapRef.current.setZoom(currentZoom - 1);
    }
  }, []);

  const handleReset = useCallback(() => {
    if (mapRef.current) {
      mapRef.current.setZoom(4);
      mapRef.current.setCenter(center);
    }
  }, []);

  const handleLocate = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          
          if (mapRef.current) {
            mapRef.current.setCenter(userLocation);
            mapRef.current.setZoom(10);
          }
        },
        () => {
          alert('Unable to retrieve your location. Please check your browser permissions.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  }, []);

  // Map toolbar handlers
  const toggleInfo = useCallback(() => {
    setShowInfo(prev => !prev);
  }, []);

  const toggleLayers = useCallback(() => {
    setShowLayers(prev => !prev);
  }, []);

  const toggleLegend = useCallback(() => {
    setShowLegend(prev => !prev);
  }, []);

  const toggleSearch = useCallback(() => {
    setShowSearch(prev => !prev);
  }, []);

  const toggleCategoryFilters = useCallback(() => {
    // Only toggle filters panel if the sidebar is hidden
    // If sidebar is visible, just call onToggleFiltersVisibility to show/hide sidebar
    if (!sidebarVisible) {
      setShowCategoryFilters(prev => !prev);
    } else if (sidebarVisible) {
      // If sidebar is visible, hide it and show the category filters panel
      onToggleFiltersVisibility();
      setShowCategoryFilters(true);
    }
  }, [onToggleFiltersVisibility, sidebarVisible]);

  const handleCategoryChange = useCallback((category: string) => {
    onCategorySelect(category);
  }, [onCategorySelect]);
  
  // Map load handler
  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  // In useEffect, add:
  useEffect(() => {
    if (mapRef.current && isLoaded) {
      mapRef.current.setMapTypeId(mapType);
      
      if (showTraffic) {
        if (!trafficLayer.current && window.google) {
          trafficLayer.current = new window.google.maps.TrafficLayer();
        }
        trafficLayer.current?.setMap(mapRef.current);
      } else if (trafficLayer.current) {
        trafficLayer.current.setMap(null);
      }
    }
  }, [mapType, showTraffic, isLoaded]);

  // Add useEffect to hide category filters when sidebar becomes visible
  useEffect(() => {
    if (sidebarVisible) {
      setShowCategoryFilters(false);
    }
  }, [sidebarVisible]);

  // Add function to handle search
  const handleSearch = () => {
    if (searchTerm && !institutionFilters.some(filter => filter.toLowerCase() === searchTerm.toLowerCase())) {
      setInstitutionFilters([...institutionFilters, searchTerm]);
      setSearchTerm('');
      setSuggestions([]); // Clear suggestions when search is performed
    }
  };

  // Add function to generate suggestions
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.length > 2) {
      // Find unique universities that match the search term
      const matches = markers
        .map(m => m.university)
        .filter((uni): uni is string => !!uni)
        .filter(uni => uni.toLowerCase().includes(value.toLowerCase()))
        .filter((uni, index, self) => self.indexOf(uni) === index)
        .slice(0, 5); // Limit to 5 suggestions
      
      setSuggestions(matches);
    } else {
      setSuggestions([]);
    }
  };

  // Add function to remove institution filter
  const removeInstitutionFilter = (institution: string) => {
    setInstitutionFilters(institutionFilters.filter(i => i !== institution));
  };

  // If the map is not loaded yet or there was an error, show loading/error state
  if (loadError) return <div className="h-full flex items-center justify-center">Error loading maps</div>;
  if (!isLoaded) return <div className="h-full flex items-center justify-center">Loading maps...</div>;

  return (
    <div className="h-full relative">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={4}
        options={mapOptions}
        onLoad={onMapLoad}
      >
        {/* Map Toolbar */}
        <MapToolbar 
          onToggleInfo={toggleInfo}
          onToggleLayers={toggleLayers}
          onToggleLegend={toggleLegend}
          onToggleSearch={toggleSearch}
          onToggleFilters={toggleCategoryFilters}
          institutionFiltersCount={institutionFilters.length}
          categoryFiltersCount={selectedCategories.length}
          showFilterIcon={!sidebarVisible}
        />

        {/* Map Controls */}
        <MapControls 
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onReset={handleReset}
          onLocate={handleLocate}
        />

        {/* Info Panel - conditionally rendered */}
        {showInfo && (
          <div className="absolute top-10 sm:top-12 lg:top-16 left-2 sm:left-3 lg:left-4 bg-white p-3 sm:p-4 rounded-md shadow-md z-20 max-w-[calc(100vw-1rem)] sm:max-w-xs">
            <h3 className="text-sm sm:text-base lg:text-lg font-semibold mb-1.5 sm:mb-2">Geographic Insights</h3>
            <p className="text-xs sm:text-sm text-gray-600">
              This map shows STEM programs and events across Canada. Use the filter options to view 
              programs by category. Click on a marker to view more details.
            </p>
          </div>
        )}

        {/* Legend Panel - conditionally rendered */}
        {showLegend && (
          <div className="absolute bottom-20 sm:bottom-24 lg:bottom-28 left-2 sm:left-3 lg:left-4 bg-white p-3 sm:p-4 rounded-md shadow-md z-20">
            <h3 className="text-sm sm:text-base lg:text-lg font-semibold mb-1.5 sm:mb-2">Map Legend</h3>
            <div className="space-y-1.5 sm:space-y-2">
              <div className="flex items-center">
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-orange-500 rounded-full mr-2"></div>
                <span className="text-xs sm:text-sm">Engineering</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-pink-500 rounded-full mr-2"></div>
                <span className="text-xs sm:text-sm">Mathematics</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full mr-2"></div>
                <span className="text-xs sm:text-sm">Science</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-purple-500 rounded-full mr-2"></div>
                <span className="text-xs sm:text-sm">Technology</span>
              </div>
            </div>
          </div>
        )}

        {/* Layers Panel - conditionally rendered */}
        {showLayers && (
          <div className="absolute top-10 sm:top-12 lg:top-16 left-12 sm:left-14 lg:left-16 bg-white p-3 sm:p-4 rounded-md shadow-md z-20">
            <h3 className="text-sm sm:text-base lg:text-lg font-semibold mb-1.5 sm:mb-2">Map Layers</h3>
            <div className="space-y-1.5 sm:space-y-2">
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="satellite" 
                  className="mr-2 h-3 w-3 sm:h-4 sm:w-4" 
                  checked={mapType === "satellite"}
                  onChange={() => setMapType(mapType === "satellite" ? "roadmap" : "satellite")}
                />
                <label htmlFor="satellite" className="text-xs sm:text-sm">Satellite View</label>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="traffic" 
                  className="mr-2 h-3 w-3 sm:h-4 sm:w-4" 
                  checked={showTraffic}
                  onChange={() => setShowTraffic(!showTraffic)}
                />
                <label htmlFor="traffic" className="text-xs sm:text-sm">Traffic</label>
              </div>
            </div>
          </div>
        )}

        {/* Category Filters Panel - conditionally rendered */}
        {showCategoryFilters && (
          <div className="absolute top-10 sm:top-12 lg:top-16 left-12 sm:left-14 lg:left-16 bg-white p-3 sm:p-4 rounded-md shadow-md z-20 w-[calc(100vw-5rem)] sm:w-72">
            <h3 className="text-sm sm:text-base lg:text-lg font-semibold mb-1.5 sm:mb-2">Category Filters</h3>
            <div className="space-y-1.5 sm:space-y-2">
              {categoryOptions.map(category => (
                <div key={category.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`category-${category.id}`}
                    className="mr-2 h-3 w-3 sm:h-4 sm:w-4"
                    checked={selectedCategories.includes(category.id)}
                    onChange={() => handleCategoryChange(category.id)}
                  />
                  <label 
                    htmlFor={`category-${category.id}`} 
                    className={`text-xs sm:text-sm ${getCategoryTextColor(category.id)}`}
                  >
                    {category.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search Panel - conditionally rendered */}
        {showSearch && (
          <div className="absolute top-10 sm:top-12 lg:top-16 left-12 sm:left-14 lg:left-16 bg-white p-3 sm:p-4 rounded-md shadow-md z-20 w-[calc(100vw-5rem)] sm:w-72">
            <h3 className="text-sm sm:text-base lg:text-lg font-semibold mb-1.5 sm:mb-2">Search Programs</h3>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
                placeholder="Search by university..."
                className="w-full py-2 px-3 pl-8 text-xs sm:text-sm border border-gray-300 rounded-md mb-2"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              {suggestions.length > 0 && (
                <div className="absolute z-30 bg-white border border-gray-300 rounded w-full mt-1">
                  {suggestions.map((suggestion, idx) => (
                    <div 
                      key={idx} 
                      className="p-2 hover:bg-gray-100 cursor-pointer text-xs sm:text-sm"
                      onClick={() => {
                        if (!institutionFilters.some(filter => filter.toLowerCase() === suggestion.toLowerCase())) {
                          setInstitutionFilters([...institutionFilters, suggestion]);
                        }
                        setSearchTerm('');
                        setSuggestions([]);
                      }}
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {institutionFilters.length > 0 && (
              <div className="mt-2 sm:mt-3">
                <div className="text-xs sm:text-sm font-medium mb-1">Filtered Institutions:</div>
                <div className="flex flex-wrap gap-1">
                  {institutionFilters.map((institution, idx) => (
                    <div key={idx} className="bg-blue-100 text-blue-800 text-[10px] sm:text-xs px-2 py-0.5 sm:py-1 rounded-full flex items-center">
                      <span>{institution}</span>
                      <button 
                        onClick={() => removeInstitutionFilter(institution)}
                        className="ml-1 hover:text-red-500"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 sm:h-3 sm:w-3" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Map Markers */}
        {filteredMarkers.map((marker) => (
          <Marker
            key={marker.id}
            position={marker.position}
            title={marker.title}
            onClick={() => setSelectedMarker(marker)}
            icon={isLoaded ? {
              url: getMarkerIcon(marker.category),
              scaledSize: new window.google.maps.Size(36, 48),
            } : undefined}
          />
        ))}

        {/* Info Window */}
        {selectedMarker && (
          <InfoWindow
            position={selectedMarker.position}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <div className="p-2 sm:p-3">
              <h3 className="text-sm sm:text-base lg:text-lg font-semibold">{selectedMarker.title}</h3>
              {selectedMarker.university && (
                <p className="text-xs sm:text-sm text-gray-600">{selectedMarker.university}</p>
              )}
              {selectedMarker.description && (
                <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm">{selectedMarker.description}</p>
              )}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}

// Helper function to get marker icon based on category
function getMarkerIcon(category: string): string {
  switch (category) {
    case 'mathematics':
      return '/images/markers/pink-marker.svg';
    case 'engineering':
      return '/images/markers/orange-marker.svg';
    case 'technology':
      return '/images/markers/purple-marker.svg';
    case 'science':
      return '/images/markers/green-marker.svg';
    default:
      return '/images/markers/blue-marker.svg';
  }
}

// Helper function to get text color for category labels
function getCategoryTextColor(category: string): string {
  switch (category) {
    case 'mathematics':
      return 'text-pink-700';
    case 'engineering':
      return 'text-orange-700';
    case 'technology':
      return 'text-purple-700';
    case 'science':
      return 'text-green-700';
    case 'all':
      return 'text-gray-800';
    default:
      return '';
  }
}