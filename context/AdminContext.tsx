
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface AdminContextType {
  isAdmin: boolean;
  login: () => void;
  logout: () => void;
  toggleAdmin: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState(false);

  const login = useCallback(() => setIsAdmin(true), []);
  const logout = useCallback(() => setIsAdmin(false), []);
  const toggleAdmin = useCallback(() => setIsAdmin(prev => !prev), []);

  return (
    <AdminContext.Provider value={{ isAdmin, login, logout, toggleAdmin }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
