import React from 'react';
import { X, Edit, Download, Replace, GitCommit, Rocket } from 'lucide-react';

interface AdminGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

const GuideStep: React.FC<{ icon: React.ReactNode, title: string, description: React.ReactNode }> = ({ icon, title, description }) => (
    <div className="flex items-start gap-4 p-4 rounded-lg bg-slate-50 border border-slate-200">
        <div className="flex-shrink-0 bg-[var(--theme-color-100)] text-[var(--theme-color-600)] rounded-full p-3 mt-1">
            {icon}
        </div>
        <div>
            <h4 className="font-bold text-lg text-slate-800">{title}</h4>
            <div className="text-slate-600 space-y-1">{description}</div>
        </div>
    </div>
);

const AdminGuide: React.FC<AdminGuideProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60] p-4" onClick={onClose} dir="rtl">
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-3xl m-4 relative transform transition-all animate-in fade-in zoom-in-95 flex flex-col" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b">
            <button onClick={onClose} className="absolute top-4 left-4 text-gray-400 hover:text-gray-700 transition-colors">
              <X size={28} />
            </button>
            <h2 className="text-3xl font-extrabold text-slate-800 mb-1">מדריך לשמירת ופרסום שינויים</h2>
            <p className="text-slate-500">
                כדי לעדכן את האתר באופן קבוע, יש לבצע תהליך ידני קצר הכולל ייצוא קובץ והעלאתו ל-GitHub.
            </p>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto">
            <GuideStep 
                icon={<Edit size={24} />} 
                title="שלב 1: עריכת התוכן" 
                description={
                    <p>בצעו את כל השינויים הרצויים ישירות באתר במצב ניהול. ניתן לערוך טקסטים, להוסיף מודולים, לעדכן סרטונים ועוד. כל השינויים נשמרים אוטומטית בדפדפן שלכם.</p>
                }
            />
             <GuideStep 
                icon={<Download size={24} />} 
                title="שלב 2: יצוא הנתונים" 
                description={
                    <p>בסיום העריכה, פתחו את פאנל הניהול ולחצו על כפתור <strong className="font-semibold">"ייצא נתונים"</strong>. פעולה זו תוריד למחשב שלכם קובץ בשם <code className="bg-gray-200 p-1 rounded">initialData.ts</code>.</p>
                }
            />
            <GuideStep 
                icon={<Replace size={24} />} 
                title="שלב 3: החלפת הקובץ בפרויקט" 
                description={<p>גשו לתיקיית הפרויקט במחשב שלכם. נווטו לתיקייה <code className="bg-gray-200 p-1 rounded">data</code> ומחקו את הקובץ <code className="bg-gray-200 p-1 rounded">initialData.ts</code> הקיים. לאחר מכן, העבירו את הקובץ החדש שהורדתם לאותה התיקייה.</p>}
            />
            <GuideStep 
                icon={<GitCommit size={24} />} 
                title="שלב 4: העלאה ל-GitHub" 
                description={<p>פתחו את כלי ה-Git שלכם (כמו GitHub Desktop או הטרמינל), בצעו 'commit' לשינוי עם הודעה ברורה (למשל, "עדכון תוכן קורס"), ולאחר מכן בצעו 'push' כדי להעלות את השינויים למאגר שלכם ב-GitHub.</p>}
            />
            <GuideStep 
                icon={<Rocket size={24} />} 
                title="שלב 5: פרסום אוטומטי!" 
                description={<p>זהו! ברגע שהשינויים שלכם יעלו ל-GitHub, שירות Netlify יזהה אותם אוטומטית, יבנה מחדש את האתר ויפרסם את הגרסה המעודכנת. התהליך לוקח בדרך כלל דקה או שתיים.</p>}
            />
        </div>

        <div className="p-6 bg-gray-50 border-t rounded-b-xl">
            <button 
                onClick={onClose} 
                className="w-full bg-[var(--theme-color-600)] text-white font-bold py-3 rounded-lg hover:bg-[var(--theme-color-700)] transition-colors"
            >
                הבנתי, תודה!
            </button>
        </div>
      </div>
    </div>
  );
};

export default AdminGuide;