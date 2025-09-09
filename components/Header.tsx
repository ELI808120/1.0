import React from 'react';
import { Link } from 'react-router-dom';
import useLocalStorage from '../hooks/useLocalStorage';
import type { SiteSettings } from '../types';
import { initialData } from '../data/initialData';


const Header: React.FC = () => {
  const [siteSettings] = useLocalStorage<SiteSettings>('siteSettings', initialData.siteSettings);

  return (
    <header className="bg-slate-700 shadow-md">
      <div className="container mx-auto px-6 py-4">
         <Link to="/" className="text-white text-2xl lg:text-3xl font-bold hover:text-slate-200 transition-colors">
            {siteSettings.headerTitle}
        </Link>
      </div>
    </header>
  );
};

export default Header;