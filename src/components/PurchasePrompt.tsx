
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ShoppingCart, ArrowLeft, Loader, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

const PurchasePrompt: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePurchase = async () => {
    setLoading(true);
    setError('');
    if (!user) {
        setError("You must be logged in to purchase.");
        setLoading(false);
        return;
    }
    try {
        // This function now just fetches the static Gumroad URL
        const response = await fetch('/.netlify/functions/create-checkout-session', {
            method: 'POST',
        });

        if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(errorBody.message || 'Failed to get payment link.');
        }

        const { url } = await response.json();
        if (url) {
            window.location.href = url;
        } else {
            throw new Error('Could not get payment URL.');
        }

    } catch (err: any) {
        console.error(err);
        setError('An error occurred. Please try again or contact support.');
        setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-12 text-center">
      <div className="max-w-lg mx-auto bg-white p-8 rounded-xl shadow-lg border-t-4 border-[var(--theme-color-500)]">
        <div className="flex justify-center items-center mb-4 bg-[var(--theme-color-100)] rounded-full w-16 h-16 mx-auto">
            <ShoppingCart className="w-8 h-8 text-[var(--theme-color-600)]" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">צעד אחרון לפני שמתחילים!</h2>
        <p className="text-slate-600 mb-6">
            שלום {user?.email}, נראה שאתה מחובר אך עדיין אין לך גישה לקורס.
            <br/>
            כדי לקבל גישה מיידית, יש להשלים את הרכישה.
        </p>

        <div className="bg-yellow-50 border-r-4 border-yellow-400 p-4 rounded-md mb-6 text-right">
            <div className="flex items-start gap-3">
                <AlertTriangle className="h-6 w-6 text-yellow-500 flex-shrink-0" />
                <div>
                    <h3 className="font-bold text-yellow-800">חשוב מאוד</h3>
                    <p className="text-sm text-yellow-700">
                        במסך התשלום, אנא הקפד/הקפידי להשתמש באותה כתובת אימייל שבה נרשמת לאתר ({user?.email}) כדי לקבל גישה אוטומטית.
                    </p>
                </div>
            </div>
        </div>
        
        <button
          onClick={handlePurchase}
          disabled={loading}
          className="w-full bg-[var(--theme-color-600)] text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-[var(--theme-color-700)] transition-transform transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 disabled:bg-slate-400"
        >
          {loading ? <Loader className="animate-spin" size={20} /> : <ShoppingCart size={20} />}
          השלמת רכישה
        </button>
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        
        <Link to="/" className="block mt-4 text-sm text-slate-500 hover:underline flex items-center justify-center gap-1">
            חזרה לדף הבית <ArrowLeft size={16} />
        </Link>
      </div>
    </div>
  );
};

export default PurchasePrompt;
