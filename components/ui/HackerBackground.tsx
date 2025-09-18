// import { useRef, useEffect } from 'react';
import LetterGlitch from './LetterGlitch';

// Main component that uses LetterGlitch as background
const HackerBackground = () => {
  return (
    <div className="w-full h-screen relative overflow-hidden">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <LetterGlitch 
          glitchColors={['#00ff41', '#008f11', '#004400']}
          glitchSpeed={30}
          outerVignette={true}
          centerVignette={false}
          smooth={true}
          characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()-_+={}[]|\\:;'<>,.?/~`0123456789"
        />
      </div>
      
      {/* Content Layer */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
        {/* Navigation Bar */}
        <div className="absolute top-6 left-0 right-0 flex justify-between items-center px-8">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-sm">⚛</span>
            </div>
            <span className="text-white font-medium text-lg">React Bits</span>
          </div>
          <div className="flex space-x-6">
            <button className="text-white hover:text-green-400 transition-colors">Home</button>
            <button className="text-white hover:text-green-400 transition-colors">Docs</button>
          </div>
        </div>

        {/* Main Content */}
        <div className="text-center px-8 max-w-4xl">
          <h1 className="text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-green-400 via-green-300 to-white bg-clip-text text-transparent">
            Am I finally a real hacker now, mom?
          </h1>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
            <button className="bg-white text-black px-8 py-3 rounded-full font-medium hover:bg-gray-200 transition-colors">
              Get Started
            </button>
            <button className="border border-white text-white px-8 py-3 rounded-full font-medium hover:bg-white hover:text-black transition-colors">
              Learn More
            </button>
          </div>
        </div>

        {/* Bottom indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="w-6 h-10 border-2 border-green-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-green-400 rounded-full mt-2 animate-bounce"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HackerBackground;