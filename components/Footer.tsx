import React from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import type { SiteSettings } from '../types';
import { initialData } from '../data/initialData';

const Footer: React.FC = () => {
  const [siteSettings] = useLocalStorage<SiteSettings>('siteSettings', initialData.siteSettings);

  return (
    <footer className="bg-slate-700 text-white text-center p-4 mt-8">
      <div className="container mx-auto">
        <p>{siteSettings.footerText}</p>
      </div>
    </footer>
  );
};

export default Footer;