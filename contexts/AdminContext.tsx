import React, { createContext, useState, useContext, ReactNode } from 'react';

interface AdminContextType {
  isAdmin: boolean;
  isPanelOpen: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  togglePanel: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const login = (password: string) => {
    if (password === '112233') {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    setIsPanelOpen(false);
  };

  const togglePanel = () => {
      if (isAdmin) {
          setIsPanelOpen(prev => !prev);
      }
  };

  return (
    <AdminContext.Provider value={{ isAdmin, isPanelOpen, login, logout, togglePanel }}>
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
