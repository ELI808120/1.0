import React from 'react';
import { useAdmin } from '../contexts/AdminContext';
import useLocalStorage from '../hooks/useLocalStorage';
import type { SiteSettings } from '../types';
import { X, LogOut } from 'lucide-react';

const AdminPanel: React.FC = () => {
    const { isPanelOpen, togglePanel, logout } = useAdmin();
    const [siteSettings, setSiteSettings] = useLocalStorage<SiteSettings>('siteSettings', {
        themeColor: '#4682B4',
        headerTitle: '',
        footerText: '',
        contactEmail: ''
    });

    const handleSettingsChange = (field: keyof SiteSettings, value: string) => {
        setSiteSettings(prev => ({ ...prev, [field]: value }));
    };

    if (!isPanelOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={togglePanel}>
            <div 
                className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl p-6 transform transition-transform duration-300 ease-in-out"
                onClick={(e) => e.stopPropagation()}
                dir="rtl"
            >
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <h2 className="text-2xl font-bold text-slate-800">פאנל ניהול</h2>
                    <button onClick={togglePanel} className="text-gray-500 hover:text-gray-800">
                        <X size={28} />
                    </button>
                </div>
                
                <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-slate-700">הגדרות כלליות</h3>
                    
                    <div>
                        <label htmlFor="headerTitle" className="block text-sm font-medium text-gray-700 mb-1">כותרת ראשית</label>
                        <input
                            type="text"
                            id="headerTitle"
                            value={siteSettings.headerTitle}
                            onChange={(e) => handleSettingsChange('headerTitle', e.target.value)}
                            className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="footerText" className="block text-sm font-medium text-gray-700 mb-1">טקסט תחתון (Footer)</label>
                        <input
                            type="text"
                            id="footerText"
                            value={siteSettings.footerText}
                            onChange={(e) => handleSettingsChange('footerText', e.target.value)}
                            className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">אימייל ליצירת קשר</label>
                        <input
                            type="email"
                            id="contactEmail"
                            value={siteSettings.contactEmail}
                            onChange={(e) => handleSettingsChange('contactEmail', e.target.value)}
                            placeholder="example@email.com"
                            className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="themeColor" className="block text-sm font-medium text-gray-700 mb-1">צבע ראשי</label>
                        <div className="flex items-center gap-2">
                           <input
                                type="color"
                                id="themeColor"
                                value={siteSettings.themeColor}
                                onChange={(e) => handleSettingsChange('themeColor', e.target.value)}
                                className="w-12 h-10 p-1 border border-slate-300 rounded-md cursor-pointer"
                            />
                            <input
                                type="text"
                                value={siteSettings.themeColor}
                                onChange={(e) => handleSettingsChange('themeColor', e.target.value)}
                                className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-6 left-6 right-6">
                    <button
                        onClick={logout}
                        className="w-full flex items-center justify-center gap-2 bg-red-600 text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-red-700 transition-colors"
                    >
                        <LogOut size={20} />
                        יציאה ממצב ניהול
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;