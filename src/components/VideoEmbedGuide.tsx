
import React from 'react';
import { X, UploadCloud, Share2, Code, ClipboardCopy } from 'lucide-react';

interface VideoEmbedGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

const GuideStep: React.FC<{ icon: React.ReactNode, title: string, description: string }> = ({ icon, title, description }) => (
    <div className="flex items-start gap-4">
        <div className="flex-shrink-0 bg-[var(--theme-color-100)] text-[var(--theme-color-600)] rounded-full p-3">
            {icon}
        </div>
        <div>
            <h4 className="font-bold text-lg text-slate-800">{title}</h4>
            <p className="text-slate-600">{description}</p>
        </div>
    </div>
);


const VideoEmbedGuide: React.FC<VideoEmbedGuideProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60] p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl m-4 relative p-8 transform transition-all animate-in fade-in zoom-in-95" 
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        <button onClick={onClose} className="absolute top-4 left-4 text-gray-400 hover:text-gray-700 transition-colors">
          <X size={28} />
        </button>
        <h2 className="text-3xl font-extrabold text-slate-800 mb-2">מדריך להטמעת סרטון</h2>
        <p className="text-slate-500 mb-8">עקבו אחר הצעדים הפשוטים כדי להוסיף סרטון חדש לקורס.</p>

        <div className="space-y-6">
            <GuideStep 
                icon={<UploadCloud size={24} />} 
                title="שלב 1: העלאת הסרטון" 
                description="גשו לשירות הווידאו המועדף עליכם (כמו Vimeo או YouTube) והעלו את קובץ הסרטון שלכם."
            />
             <GuideStep 
                icon={<Share2 size={24} />} 
                title="שלב 2: מציאת אפשרות השיתוף" 
                description="לאחר שהסרטון הועלה, חפשו את כפתור ה'שתף' (Share) ולחצו עליו."
            />
             <GuideStep 
                icon={<Code size={24} />} 
                title="שלב 3: בחירת קוד הטמעה (Embed)" 
                description="בחלון השיתוף, בחרו באפשרות 'הטמע' (Embed). יופיע קוד שמתחיל ב-<iframe...>"
            />
             <GuideStep 
                icon={<ClipboardCopy size={24} />} 
                title="שלב 4: העתקה והדבקה" 
                description="העתיקו את כל קוד ההטמעה, חזרו לכאן, הדביקו אותו בתיבת הטקסט ולחצו על 'הוסף/עדכן סרטון'."
            />
        </div>

        <button 
            onClick={onClose} 
            className="mt-8 w-full bg-[var(--theme-color-600)] text-white font-bold py-3 rounded-lg hover:bg-[var(--theme-color-700)] transition-colors"
        >
            הבנתי, תודה!
        </button>
      </div>
    </div>
  );
};

export default VideoEmbedGuide;