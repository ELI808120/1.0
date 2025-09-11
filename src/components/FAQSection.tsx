
import React, { useState } from 'react';
import { useAdmin } from '../contexts/AdminContext';
import type { FAQ } from '../types';
import { PlusCircle, Trash2, ChevronDown, Edit, Save } from 'lucide-react';
import EditableText from './EditableText';

interface FAQSectionProps {
    faqs: FAQ[];
    setFaqs: React.Dispatch<React.SetStateAction<FAQ[]>>;
}

const FAQItem: React.FC<{
    item: FAQ;
    isOpen: boolean;
    onToggle: () => void;
    onUpdate: (id: number, question: string, answer: string) => void;
    onDelete: (id: number) => void;
}> = ({ item, isOpen, onToggle, onUpdate, onDelete }) => {
    const { isAdmin } = useAdmin();
    const [isEditingAnswer, setIsEditingAnswer] = useState(false);
    const [answerText, setAnswerText] = useState(item.answer);

    const handleAnswerSave = () => {
        onUpdate(item.id, item.question, answerText);
        setIsEditingAnswer(false);
    };

    return (
        <div className="border-b">
            <button
                className="w-full flex justify-between items-center text-right p-5 focus:outline-none"
                onClick={onToggle}
            >
                <EditableText
                    as="h4"
                    value={item.question}
                    onChange={(newQuestion) => onUpdate(item.id, newQuestion, item.answer)}
                    className="text-lg font-semibold text-slate-800 flex-grow"
                />
                <div className="flex items-center flex-shrink-0">
                    {isAdmin && (
                        <button onClick={(e) => { e.stopPropagation(); onDelete(item.id); }} className="text-red-500 hover:text-red-700 ml-4">
                            <Trash2 size={18} />
                        </button>
                    )}
                    <ChevronDown className={`w-6 h-6 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>
            </button>
            {isOpen && (
                <div className="p-5 pt-0">
                    {isEditingAnswer && isAdmin ? (
                         <div className="space-y-2">
                             <textarea
                                value={answerText}
                                onChange={(e) => setAnswerText(e.target.value)}
                                className="w-full h-32 p-2 border rounded"
                            />
                            <button onClick={handleAnswerSave} className="flex items-center gap-1 text-green-600">
                                <Save size={16}/> שמור תשובה
                            </button>
                         </div>
                    ) : (
                        <div className="relative group">
                            <p className="text-slate-600 whitespace-pre-wrap">{item.answer}</p>
                             {isAdmin && (
                                <button onClick={() => setIsEditingAnswer(true)} className="absolute top-0 left-0 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Edit size={16} />
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};


const FAQSection: React.FC<FAQSectionProps> = ({ faqs, setFaqs }) => {
    const { isAdmin } = useAdmin();
    const [openId, setOpenId] = useState<number | null>(null);

    const handleToggle = (id: number) => {
        setOpenId(openId === id ? null : id);
    };

    const handleAddFaq = () => {
        const newFaq: FAQ = {
            id: Date.now(),
            question: 'שאלה חדשה',
            answer: 'זוהי תשובה לדוגמה. ניתן לערוך אותה.',
        };
        setFaqs(prev => [...prev, newFaq]);
    };

    const handleDeleteFaq = (id: number) => {
        if (window.confirm('האם למחוק את השאלה והתשובה?')) {
            setFaqs(prev => prev.filter(f => f.id !== id));
        }
    };
    
    const handleUpdateFaq = (id: number, question: string, answer: string) => {
        setFaqs(prev => prev.map(f => f.id === id ? { ...f, question, answer } : f));
    };

    return (
        <section className="bg-white p-6 rounded-lg shadow-md mt-16">
            <h2 className="text-3xl font-bold text-slate-700 text-center mb-8">שאלות ותשובות</h2>
            <div className="max-w-4xl mx-auto">
                {faqs.map(faq => (
                    <FAQItem
                        key={faq.id}
                        item={faq}
                        isOpen={openId === faq.id}
                        onToggle={() => handleToggle(faq.id)}
                        onUpdate={handleUpdateFaq}
                        onDelete={handleDeleteFaq}
                    />
                ))}
            </div>
            {isAdmin && (
                <div className="text-center mt-8">
                    <button
                        onClick={handleAddFaq}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg inline-flex items-center gap-2"
                    >
                        <PlusCircle size={20} /> הוסף שאלה
                    </button>
                </div>
            )}
        </section>
    );
};

export default FAQSection;