
import React, { useState } from 'react';
import { useAdmin } from '../contexts/AdminContext';
import { UserCog, Settings, X } from 'lucide-react';

const AdminControls: React.FC = () => {
  const { isAdmin, login, togglePanel } = useAdmin();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (login(password)) {
      setIsModalOpen(false);
      setPassword('');
      setError('');
    } else {
      setError('קוד גישה שגוי.');
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <>
      <button
        onClick={isAdmin ? togglePanel : () => setIsModalOpen(true)}
        className="fixed bottom-4 left-4 z-50 bg-slate-700 text-white p-3 rounded-full shadow-lg hover:bg-slate-800 transition-all"
        aria-label={isAdmin ? "Open Admin Panel" : "Open Admin Login"}
      >
        {isAdmin ? <Settings size={24} /> : <UserCog size={24} />}
      </button>

      {!isAdmin && isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" dir="rtl">
          <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-sm m-4 relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-2 left-2 text-gray-500 hover:text-gray-800">
                <X size={24} />
            </button>
            <h2 className="text-2xl font-bold text-slate-800 mb-4 text-center">כניסת מנהל</h2>
            <p className="text-slate-600 mb-6 text-center">הזן את קוד הגישה כדי לנהל את תוכן האתר.</p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 text-center"
              placeholder="קוד גישה"
              aria-label="Password"
            />
            {error && <p className="text-red-600 text-sm mt-2 text-center">{error}</p>}
            <button
              onClick={handleLogin}
              className="w-full mt-6 bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              כניסה
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminControls;