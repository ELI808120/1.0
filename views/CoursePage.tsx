import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, PlusCircle, Mail } from 'lucide-react';
import type { Module, CourseInfo, FAQ, SiteSettings } from '../types';
import useLocalStorage from '../hooks/useLocalStorage';
import ModuleCard from '../components/ModuleCard';
import { useAdmin } from '../contexts/AdminContext';
import EditableSection from '../components/EditableSection';
import FAQSection from '../components/FAQSection';

const initialModules: Module[] = [
  { 
    id: 1, 
    title: 'מודול 1: מבוא לחרדת ילדים', 
    videoCode: null,
    description: 'במודול זה נבין מהי חרדה, כיצד היא מתבטאת אצל ילדים ומהם הגורמים המרכזיים להופעתה. נלמד להבחין בין פחדים טבעיים לבין חרדה הדורשת התייחסות.',
    resources: [
        { id: 1, title: 'דף עבודה: זיהוי סימני חרדה', url: '#' },
        { id: 2, title: 'מאמר מומלץ: חרדה בגיל הרך', url: '#' },
    ]
  },
];

const initialInfo: CourseInfo = {
    about: 'כאן יופיע טקסט אודות הקורס. מנהל האתר יכול לערוך אותו.',
    thanks: 'תודות מיוחדות לכל המשתתפים והתומכים בפרויקט חשוב זה.',
    contact: 'לשאלות ופניות, ניתן לשלוח מייל לכתובת שמופיעה למטה או להשתמש בכפתור הישיר.',
};

const initialFaqs: FAQ[] = [
    { id: 1, question: 'לאיזה גילאים הקורס מתאים?', answer: 'הקורס מתאים להורים לילדים בגילאי 4 עד 12, אך העקרונות הנלמדים בו יכולים להיות רלוונטיים גם לגילאים אחרים.' },
    { id: 2, question: 'האם אני מקבל/ת גישה לכל התכנים מיד?', answer: 'כן, עם ההרשמה לקורס כל המודולים והחומרים הנלווים פתוחים לצפייה מיידית וללא הגבלת זמן.' },
];

const initialSiteSettings: SiteSettings = {
  themeColor: '#4682B4',
  headerTitle: '',
  footerText: '',
  contactEmail: '',
};

const CoursePage: React.FC = () => {
  const [modules, setModules] = useLocalStorage<Module[]>('courseModules', initialModules);
  const [courseInfo, setCourseInfo] = useLocalStorage<CourseInfo>('courseInfo', initialInfo);
  const [faqs, setFaqs] = useLocalStorage<FAQ[]>('courseFaqs', initialFaqs);
  const [siteSettings] = useLocalStorage<SiteSettings>('siteSettings', initialSiteSettings);
  const { isAdmin } = useAdmin();

  // Safeguard against corrupted data in localStorage
  const safeModules = Array.isArray(modules) ? modules : initialModules;
  const safeFaqs = Array.isArray(faqs) ? faqs : initialFaqs;

  const updateModule = (moduleId: number, updatedValues: Partial<Module>) => {
    setModules(prev => prev.map(m => m.id === moduleId ? { ...m, ...updatedValues } : m));
  };
  
  const handleAddModule = () => {
    const newModule: Module = {
      id: Date.now(),
      title: `מודול ${safeModules.length + 1}: כותרת חדשה`,
      videoCode: null,
      description: 'הוסף כאן תיאור קצר למודול.',
      resources: [],
    };
    setModules([...safeModules, newModule]);
  };
  
  const handleDeleteModule = (moduleId: number) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק את המודול?')) {
        setModules(safeModules.filter(m => m.id !== moduleId));
    }
  };
  
  const handleInfoChange = (field: keyof CourseInfo, value: string) => {
    setCourseInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleMoveModule = (moduleId: number, direction: 'up' | 'down') => {
    const index = safeModules.findIndex(m => m.id === moduleId);
    if (index === -1) return;

    const newModules = [...safeModules];
    if (direction === 'up' && index > 0) {
        [newModules[index - 1], newModules[index]] = [newModules[index], newModules[index - 1]];
    } else if (direction === 'down' && index < safeModules.length - 1) {
        [newModules[index + 1], newModules[index]] = [newModules[index], newModules[index + 1]];
    }
    setModules(newModules);
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800">תוכן הקורס</h1>
        <p className="text-lg text-slate-600 mt-2">ברוכים הבאים! כאן תמצאו את כל שיעורי הקורס.</p>
      </div>

      <div className="space-y-8">
        {safeModules.map((module, index) => (
          <ModuleCard 
            key={module.id}
            module={module}
            onModuleUpdate={updateModule}
            onDelete={handleDeleteModule}
            onMove={handleMoveModule}
            isFirst={index === 0}
            isLast={index === safeModules.length - 1}
          />
        ))}
      </div>

      {isAdmin && (
        <div className="text-center mt-8">
            <button
                onClick={handleAddModule}
                className="inline-flex items-center gap-2 bg-green-600 text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-green-700 transition-colors"
            >
                <PlusCircle size={20} />
                הוסף מודול חדש
            </button>
        </div>
      )}
      
      <div className="mt-16 space-y-10">
          <EditableSection title="אודות" content={courseInfo.about} onSave={(value) => handleInfoChange('about', value)} />
          <EditableSection title="תודות" content={courseInfo.thanks} onSave={(value) => handleInfoChange('thanks', value)} />
          <div>
            <EditableSection title="צרו קשר" content={courseInfo.contact} onSave={(value) => handleInfoChange('contact', value)} />
            {siteSettings.contactEmail && (
              <div className="mt-6 text-center">
                <a
                  href={`mailto:${siteSettings.contactEmail}`}
                  className="inline-flex items-center gap-3 bg-[var(--theme-color-600)] text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-[var(--theme-color-700)] transition-transform transform hover:scale-105 shadow-lg"
                >
                  <Mail size={22} />
                  שלחו לנו מייל
                </a>
              </div>
            )}
          </div>
      </div>

      <FAQSection faqs={safeFaqs} setFaqs={setFaqs} />

      <div className="text-center mt-12">
        <Link 
          to="/"
          className="inline-flex items-center gap-2 bg-slate-600 text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-slate-700 transition-colors"
        >
          <ArrowRight size={20} />
          חזרה לדף הבית
        </Link>
      </div>
    </div>
  );
};

export default CoursePage;