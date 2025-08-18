import React from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-0 focus:left-0 bg-amber-500 dark:bg-amber-600 text-slate-900 focus:px-4 focus:py-2">
        Skip to main content
      </a>
      <Header />
      <main id="main-content" className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;