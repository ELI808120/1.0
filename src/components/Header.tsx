
import React from 'react';
import { Link } from 'react-router-dom';
import useLocalStorage from '../hooks/useLocalStorage';
import type { SiteSettings } from '../types';
import { initialData } from '../data/initialData';
import { useAuth } from '../contexts/AuthContext';
// FIX: Import useUI to control the authentication modal.
import { useUI } from '../contexts/UIContext';
import { LogIn, LogOut } from 'lucide-react';

const Header: React.FC = () => {
  const [siteSettings] = useLocalStorage<SiteSettings>('siteSettings', initialData.siteSettings);
  // FIX: `login` function is now in the modal, so it's removed from here.
  const { user, logout, loading } = useAuth();
  // FIX: Get the function to open the auth modal from the UI context.
  const { openAuthModal } = useUI();

  return (
    <header className="bg-slate-700 shadow-md">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-white text-xl lg:text-3xl font-bold hover:text-slate-200 transition-colors">
            {siteSettings.headerTitle}
        </Link>
        <div className="flex items-center gap-4">
            {user && (
                <span className="text-white hidden sm:block">ברוך הבא, {user.email}</span>
            )}
            {!loading && (
              user ? (
                <button onClick={logout} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors">
                  <LogOut size={18}/> יציאה
                </button>
              ) : (
                // FIX: The login button now opens the authentication modal.
                <button onClick={openAuthModal} className="bg-[var(--theme-color-600)] hover:bg-[var(--theme-color-700)] text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors">
                  <LogIn size={18}/> כניסה / הרשמה
                </button>
              )
            )}
        </div>
      </div>
    </header>
  );
};

export default Header;