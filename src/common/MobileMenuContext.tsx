'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface MobileMenuContextType {
  mobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
}

const MobileMenuContext = createContext<MobileMenuContextType | undefined>(undefined);

export function MobileMenuProvider({ children }: { children: ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Close mobile menu when window width exceeds 1023px
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1023 && mobileMenuOpen) {
        closeMobileMenu();
      }
    };

    window.addEventListener('resize', handleResize);
    
    // Call once on mount to handle initial state
    handleResize();

    // Cleanup event listener on unmount
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileMenuOpen]);

  return (
    <MobileMenuContext.Provider value={{ mobileMenuOpen, toggleMobileMenu, closeMobileMenu }}>
      {children}
    </MobileMenuContext.Provider>
  );
}

export function useMobileMenu() {
  const context = useContext(MobileMenuContext);
  if (context === undefined) {
    throw new Error('useMobileMenu must be used within a MobileMenuProvider');
  }
  return context;
} 