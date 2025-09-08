import React from 'react';
import { X, Edit, Download, FolderGit2, UploadCloud, CheckCircle } from 'lucide-react';

interface AdminGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

const GuideStep: React.FC<{ icon: React.ReactNode, title: string, description: string, details: string }> = ({ icon, title, description, details }) => (
    <div className="flex items-start gap-4 p-4 rounded-lg bg-slate-50 border border-slate-200">
        <div className="flex-shrink-0 bg-[var(--theme-color-100)] text-[var(--theme-color-600)] rounded-full p-3 mt-1">
            {icon}
        </div>
        <div>
            <h4 className="font-bold text-lg text-slate-800">{title}</h4>
            <p className="text-slate-600 mb-1">{description}</p>
            <p className="text-xs text-slate-500 bg-slate-100 p-2 rounded">{details}</p>
        </div>
    </div>
);

const AdminGuide: React.FC<AdminGuideProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={onClose} dir="rtl">
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-3xl m-4 relative transform transition-all animate-in fade-in zoom-in-95 flex flex-col" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b">
            <button onClick={onClose} className="absolute top-4 left-4 text-gray-400 hover:text-gray-700 transition-colors">
              <X size={28} />
            </button>
            <h2 className="text-3xl font-extrabold text-slate-800 mb-1">מדריך לשמירת שינויים</h2>
            <p className="text-slate-500">כך הופכים את העריכות שלך לקבועות וזמינות לכל הגולשים באתר.</p>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto">
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 text-blue-800 rounded-r-md">
                <h3 className="font-bold">חשוב להבין:</h3>
                <p className="text-sm">השינויים שאתה מבצע במצב ניהול נשמרים כטיוטה **רק בדפדפן שלך**. כדי שהם יופיעו באתר החי לכולם, עליך לבצע את התהליך הבא.</p>
            </div>

            <GuideStep 
                icon={<Edit size={24} />} 
                title="שלב 1: עריכת התוכן" 
                description="ערוך את כל הטקסטים, התמונות והמודולים באתר כרצונך. כל שינוי נשמר אוטומטית בזיכרון הדפדפן."
                details="פשוט לחץ על כל אלמנט שניתן לעריכה והתחל להקליד. אין צורך בכפתור 'שמור' בשלב זה."
            />
             <GuideStep 
                icon={<Download size={24} />} 
                title="שלב 2: ייצוא הנתונים" 
                description="בסיום העריכה, לחץ על כפתור 'ייצוא נתוני האתר' בפאנל הניהול."
                details="פעולה זו תוריד למחשב שלך קובץ אחד בשם initialData.ts. קובץ זה מכיל את כל התוכן המעודכן."
            />
             <GuideStep 
                icon={<FolderGit2 size={24} />} 
                title="שלב 3: החלפת הקובץ בפרויקט" 
                description="פתח את תיקיית הפרויקט של האתר במחשב שלך, ונווט לתיקייה בשם data."
                details="מחק את הקובץ initialData.ts הישן והעתק במקומו את הקובץ החדש שהורדת בשלב הקודם."
            />
             <GuideStep 
                icon={<UploadCloud size={24} />} 
                title="שלב 4: העלאה ל-GitHub וסנכרון ל-Netlify" 
                description="בצע 'Commit' ו-'Push' לקוד המעודכן שלך ב-GitHub."
                details="ברגע שהשינוי יעלה ל-GitHub, שירות Netlify יזהה אותו אוטומטית, יבנה את האתר מחדש ויפרסם את הגרסה המעודכנת. התהליך לוקח כדקה."
            />
            
            <div className="flex items-center gap-3 bg-green-50 border-l-4 border-green-400 p-4 text-green-800 rounded-r-md">
                <CheckCircle size={28} className="flex-shrink-0"/>
                <p className="font-semibold">זהו! לאחר סיום שלב 4, האתר החי שלך יהיה מעודכן עם כל התוכן החדש שהזנת.</p>
            </div>
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