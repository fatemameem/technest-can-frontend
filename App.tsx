import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import TeamPage from './pages/TeamPage';
import ServicesPage from './pages/ServicesPage';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import ContactPage from './pages/ContactPage';
import SubscribePage from './pages/SubscribePage';
import VideosPage from './pages/VideosPage';
import AdminPage from './pages/AdminPage';
import { ThemeProvider } from './contexts/ThemeContext';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/about/team" element={<TeamPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:slug" element={<EventDetailPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/subscribe" element={<SubscribePage />} />
            <Route path="/videos" element={<VideosPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </Layout>
      </HashRouter>
    </ThemeProvider>
  );
};

export default App;