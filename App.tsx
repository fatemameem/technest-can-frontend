
import React from 'react';
import { HashRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext.js';
import { AdminProvider, useAdmin } from './context/AdminContext.js';
import Header from './components/layout/Header.js';
import Footer from './components/layout/Footer.js';

// Static imports for all pages to fix module resolution errors
import Home from './pages/Home.js';
import About from './pages/About.js';
import Team from './pages/Team.js';
import Services from './pages/Services.js';
import Events from './pages/Events.js';
import EventDetail from './pages/EventDetail.js';
import Contact from './pages/Contact.js';
import Subscribe from './pages/Subscribe.js';
import Videos from './pages/Videos.js';
import AdminDashboard from './pages/admin/AdminDashboard.js';
import AdminEvents from './pages/admin/AdminEvents.js';
import AdminContent from './pages/admin/AdminContent.js';
import AdminLayout from './pages/admin/AdminLayout.js';

const PublicLayout = () => (
  <div className="flex flex-col min-h-screen">
    <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:px-4 focus:py-2 focus:bg-dark-accent focus:text-dark-background">
      Skip to main content
    </a>
    <Header />
    <main id="main-content" className="flex-grow">
      <Outlet />
    </main>
    <Footer />
  </div>
);

const AdminRouteGuard = () => {
  const { isAdmin } = useAdmin();
  return isAdmin ? <AdminLayout><Outlet /></AdminLayout> : <Navigate to="/" replace />;
};

const App = () => {
  return (
    <AdminProvider>
      <AppProvider>
        <HashRouter>
            <Routes>
              <Route path="/" element={<PublicLayout />}>
                <Route index element={<Home />} />
                <Route path="about" element={<About />} />
                <Route path="about/team" element={<Team />} />
                <Route path="services" element={<Services />} />
                <Route path="events" element={<Events />} />
                <Route path="events/:slug" element={<EventDetail />} />
                <Route path="contact" element={<Contact />} />
                <Route path="subscribe" element={<Subscribe />} />
                <Route path="videos" element={<Videos />} />
              </Route>
              <Route path="/admin" element={<AdminRouteGuard />}>
                <Route index element={<AdminDashboard />} />
                <Route path="events" element={<AdminEvents />} />
                <Route path="content" element={<AdminContent />} />
              </Route>
            </Routes>
        </HashRouter>
      </AppProvider>
    </AdminProvider>
  );
};

export default App;
