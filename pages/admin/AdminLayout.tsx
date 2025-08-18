
import React from 'react';
import { NavLink } from 'react-router-dom';
import Container from '../../components/Container.js';
import { useAdmin } from '../../context/AdminContext.js';
import { Button, ButtonLink } from '../../components/ui/Button.js';
import { cn } from '../../lib/utils.js';

const adminNavLinks = [
  { name: 'Dashboard', path: '/admin' },
  { name: 'Events', path: '/admin/events' },
  { name: 'Content', path: '/admin/content' },
];

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { logout } = useAdmin();

  return (
    <div className="min-h-screen bg-slate-900">
      <header className="bg-dark-surface border-b border-slate-800">
        <Container className="flex justify-between items-center h-16">
          <h1 className="text-lg font-bold text-dark-accent">Admin Dashboard</h1>
          <div>
            <ButtonLink to="/" variant="ghost" size="sm" className="mr-4">View Site</ButtonLink>
            <Button onClick={logout} variant="secondary" size="sm">Logout</Button>
          </div>
        </Container>
      </header>
      <div className="flex">
        <aside className="w-64 bg-dark-surface border-r border-slate-800 p-6 hidden md:block">
          <nav className="flex flex-col space-y-2">
            {adminNavLinks.map(link => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/admin'}
                className={({ isActive }) =>
                  cn(
                    'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-dark-primary text-white'
                      : 'text-dark-text-secondary hover:bg-slate-700'
                  )
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>
        </aside>
        <main className="flex-1 p-6 md:p-10">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;