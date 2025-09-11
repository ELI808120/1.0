
import React, { useState } from 'react';
import { useAdmin } from '../contexts/AdminContext';
import useLocalStorage from '../hooks/useLocalStorage';
import type { SiteSettings, SiteData } from '../types';
import { X, LogOut, Download } from 'lucide-react';
import { initialData } from '../data/initialData';
import AdminGuide from './AdminGuide';

const AdminPanel: React.FC = () => {
    const { isPanelOpen, togglePanel, logout } = useAdmin();
    const [siteSettings, setSiteSettings] = useLocalStorage<SiteSettings>('siteSettings', initialData.siteSettings);
    const [isGuideOpen, setIsGuideOpen] = useState(false);

    const handleSettingsChange = (field: keyof SiteSettings, value: string) => {
        setSiteSettings(prev => ({ ...prev, [field]: value }));
    };

    const handleExport = () => {
        try {
            const currentData: SiteData = {
                siteSettings: JSON.parse(localStorage.getItem('siteSettings') || JSON.stringify(initialData.siteSettings)),
                landingPageContent: JSON.parse(localStorage.getItem('landingPage') || JSON.stringify(initialData.landingPageContent)),
                modules: JSON.parse(localStorage.getItem('courseModules') || JSON.stringify(initialData.modules)),
                courseInfo: JSON.parse(localStorage.getItem('courseInfo') || JSON.stringify(initialData.courseInfo)),
                faqs: JSON.parse(localStorage.getItem('courseFaqs') || JSON.stringify(initialData.faqs)),
            };

            const fileContent = `import type { SiteData } from '../types';\n\nexport const initialData: SiteData = ${JSON.stringify(currentData, null, 2)};\n`;

            const blob = new Blob([fileContent], { type: 'text/typescript;charset=utf-8;' });
            const link = document.createElement("a");
            if (link.download !== undefined) { 
                const url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", "initialData.ts");
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            }
        } catch (error) {
            console.error("Failed to export data:", error);
            alert("אירעה שגיאה בעת ייצוא הנתונים. בדוק את המסוף לקבלת פרטים.");
        }
    };

    if (!isPanelOpen) {
        return null;
    }

    return (
        <>
            <AdminGuide isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={togglePanel}>
                <div 
                    className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl p-6 transform transition-transform duration-300 ease-in-out flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                    dir="rtl"
                >
                    <div className="flex justify-between items-center mb-6 border-b pb-4">
                        <h2 className="text-2xl font-bold text-slate-800">פאנל ניהול</h2>
                        <button onClick={togglePanel} className="text-gray-500 hover:text-gray-800">
                            <X size={28} />
                        </button>
                    </div>
                    
                    <div className="space-y-6 flex-grow overflow-y-auto pr-2 min-h-0">
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
                         <div className="border-t pt-6 space-y-4">
                            <h3 className="text-xl font-semibold text-slate-700">שמירת שינויים</h3>
                             <p className="text-sm text-slate-500">
                                כדי לשמור את השינויים שביצעת, יש לייצא את קובץ הנתונים ולהחליף אותו בקוד המקור של הפרויקט.
                                <button onClick={() => setIsGuideOpen(true)} className="text-blue-600 hover:underline font-semibold mt-1 block text-right w-full">
                                    איך עושים את זה? לחץ כאן למדריך המלא.
                                </button>
                            </p>
                            
                            <button
                                onClick={handleExport}
                                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <Download size={20} />
                                ייצא נתונים
                            </button>
                        </div>
                    </div>

                    <div className="mt-6">
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
        </>
    );
};

export default AdminPanel;