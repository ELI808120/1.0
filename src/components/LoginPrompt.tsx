
import React from 'react';
// FIX: Import useUI to open the auth modal instead of useAuth.
import { useUI } from '../contexts/UIContext';
import { Lock, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';

const LoginPrompt: React.FC = () => {
  // FIX: Get the function to open the modal from the UI context.
  const { openAuthModal } = useUI();

  return (
    <div className="container mx-auto px-6 py-12 text-center">
      <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg border-t-4 border-[var(--theme-color-500)]">
        <div className="flex justify-center items-center mb-4 bg-[var(--theme-color-100)] rounded-full w-16 h-16 mx-auto">
            <Lock className="w-8 h-8 text-[var(--theme-color-600)]" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">התוכן מוגן</h2>
        <p className="text-slate-600 mb-6">
            כדי לצפות בשיעורי הקורס, יש להתחבר או להירשם.
        </p>
        <button
          // FIX: The button now opens the auth modal.
          onClick={openAuthModal}
          className="w-full bg-[var(--theme-color-600)] text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-[var(--theme-color-700)] transition-transform transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
        >
          <LogIn size={20} />
          כניסה או הרשמה
        </button>
         <Link to="/" className="block mt-4 text-sm text-slate-500 hover:underline">
            חזרה לדף הבית
        </Link>
      </div>
    </div>
  );
};

export default LoginPrompt;