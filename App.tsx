import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './views/LandingPage';
import CoursePage from './views/CoursePage';
import Header from './components/Header';
import Footer from './components/Footer';
import { AdminProvider, useAdmin } from './contexts/AdminContext';
import AdminControls from './components/AdminControls';
import AdminPanel from './components/AdminPanel';
import useLocalStorage from './hooks/useLocalStorage';
import type { SiteSettings } from './types';
import { adjustColor } from './utils/color';
import { initialData } from './data/initialData';

function AppContent() {
  const { isAdmin } = useAdmin();
  const [siteSettings] = useLocalStorage<SiteSettings>('siteSettings', initialData.siteSettings);

  React.useEffect(() => {
    const styleId = 'dynamic-theme-styles';
    let styleElement = document.getElementById(styleId);
    if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = styleId;
        document.head.appendChild(styleElement);
    }
    
    styleElement.innerHTML = `
      :root {
        --theme-color-100: ${adjustColor(siteSettings.themeColor, 180)};
        --theme-color-500: ${siteSettings.themeColor};
        --theme-color-600: ${adjustColor(siteSettings.themeColor, -20)};
        --theme-color-700: ${adjustColor(siteSettings.themeColor, -40)};
      }
    `;
  }, [siteSettings.themeColor]);

  return (
    <HashRouter>
      <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800 font-sans">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/course" element={<CoursePage />} />
          </Routes>
        </main>
        <Footer />
        <AdminControls />
        {isAdmin && <AdminPanel />}
      </div>
    </HashRouter>
  );
}

function App() {
  return (
    <AdminProvider>
      <AppContent />
    </AdminProvider>
  );
}


export default App;