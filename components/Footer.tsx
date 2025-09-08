import React from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import type { SiteSettings } from '../types';

const Footer: React.FC = () => {
  // FIX: Added missing 'contactEmail' property to the initial value to match the SiteSettings type.
  const [siteSettings] = useLocalStorage<SiteSettings>('siteSettings', { themeColor: '', headerTitle: '', footerText: `© ${new Date().getFullYear()} כל הזכויות שמורות.`, contactEmail: '' });

  return (
    <footer className="bg-slate-700 text-white text-center p-4 mt-8">
      <div className="container mx-auto">
        <p>{siteSettings.footerText}</p>
      </div>
    </footer>
  );
};

export default Footer;