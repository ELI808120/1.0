
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useUI } from '../contexts/UIContext';
import { X, Loader } from 'lucide-react';

const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal } = useUI();
  const { signup, login } = useAuth();
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLoginView) {
        await login(email, password);
      } else {
        await signup(email, password);
      }
      closeAuthModal();
      setEmail('');
      setPassword('');
    } catch (err: any) {
      setError(getFriendlyErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  const getFriendlyErrorMessage = (code: string) => {
    switch (code) {
        case 'auth/invalid-email':
            return 'כתובת אימייל לא תקינה.';
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
            return 'אימייל או סיסמה שגויים.';
        case 'auth/email-already-in-use':
            return 'כתובת אימייל זו כבר רשומה.';
        case 'auth/weak-password':
            return 'הסיסמה חלשה מדי. נדרשים לפחות 6 תווים.';
        default:
            return 'אירעה שגיאה. אנא נסה שוב.';
    }
  };

  if (!isAuthModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60] p-4" onClick={closeAuthModal} dir="rtl">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md m-4 relative p-8 transform transition-all animate-in fade-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
        <button onClick={closeAuthModal} className="absolute top-4 left-4 text-gray-400 hover:text-gray-700 transition-colors">
          <X size={28} />
        </button>
        
        <div className="flex border-b mb-6">
          <button onClick={() => setIsLoginView(true)} className={`flex-1 py-3 text-lg font-semibold transition-colors ${isLoginView ? 'text-[var(--theme-color-600)] border-b-2 border-[var(--theme-color-600)]' : 'text-gray-500'}`}>
            כניסה
          </button>
          <button onClick={() => setIsLoginView(false)} className={`flex-1 py-3 text-lg font-semibold transition-colors ${!isLoginView ? 'text-[var(--theme-color-600)] border-b-2 border-[var(--theme-color-600)]' : 'text-gray-500'}`}>
            הרשמה
          </button>
        </div>
        
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">{isLoginView ? 'ברוכים השבים' : 'יצירת חשבון חדש'}</h2>
        <p className="text-center text-slate-500 mb-6">{isLoginView ? 'התחברו כדי לגשת לקורס' : 'הירשמו והצטרפו אלינו'}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">כתובת אימייל</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-[var(--theme-color-500)]"
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label htmlFor="password"className="block text-sm font-medium text-gray-700 mb-1">סיסמה</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-[var(--theme-color-500)]"
              placeholder="********"
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button type="submit" disabled={loading} className="w-full mt-2 bg-[var(--theme-color-600)] text-white font-bold py-3 rounded-lg text-lg hover:bg-[var(--theme-color-700)] transition-colors flex items-center justify-center gap-2 disabled:bg-slate-400">
            {loading && <Loader className="animate-spin" size={20} />}
            {isLoginView ? 'כניסה' : 'הרשמה'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;