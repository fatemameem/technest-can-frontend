'use client';

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onLocate: () => void;
}

export default function MapControls({ 
  onZoomIn, 
  onZoomOut, 
  onReset, 
  onLocate 
}: MapControlsProps) {
  return (
    <div className="absolute top-2 sm:top-3 lg:top-4 right-2 sm:right-3 lg:right-4 bg-white rounded-md shadow-md flex flex-col p-0.5 sm:p-1 z-20">
      <button 
        className="p-1.5 sm:p-2 hover:bg-gray-100 rounded mb-0.5 sm:mb-1"
        onClick={onZoomIn}
        title="Zoom In"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6">
          <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
        </svg>
      </button>
      
      <button 
        className="p-1.5 sm:p-2 hover:bg-gray-100 rounded"
        onClick={onZoomOut}
        title="Zoom Out"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6">
          <path fillRule="evenodd" d="M4.25 12a.75.75 0 01.75-.75h14a.75.75 0 010 1.5H5a.75.75 0 01-.75-.75z" clipRule="evenodd" />
        </svg>
      </button>
      
      <button 
        className="p-1.5 sm:p-2 hover:bg-gray-100 rounded mt-0.5 sm:mt-1"
        onClick={onReset}
        title="Reset View"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6">
          <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
          <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198c.031-.028.062-.056.091-.086L12 5.43z" />
        </svg>
      </button>
      
      <button 
        className="p-1.5 sm:p-2 hover:bg-gray-100 rounded mt-0.5 sm:mt-1"
        onClick={onLocate}
        title="My Location"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6">
          <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
} 