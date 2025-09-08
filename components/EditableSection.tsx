import React, { useState, useEffect } from 'react';
import { useAdmin } from '../contexts/AdminContext';
import { Edit, Save } from 'lucide-react';

interface EditableSectionProps {
    title: string;
    content: string;
    onSave: (newContent: string) => void;
}

const EditableSection: React.FC<EditableSectionProps> = ({ title, content, onSave }) => {
    const { isAdmin } = useAdmin();
    const [isEditing, setIsEditing] = useState(false);
    const [text, setText] = useState(content);

    useEffect(() => {
        setText(content);
    }, [content]);
    
    const handleSave = () => {
        onSave(text);
        setIsEditing(false);
    };

    return (
        <section className="bg-white p-6 rounded-lg shadow-md border-t-4 border-slate-500">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-slate-700">{title}</h2>
                {isAdmin && !isEditing && (
                    <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
                        <Edit size={18} /> ערוך
                    </button>
                )}
                 {isAdmin && isEditing && (
                    <button onClick={handleSave} className="flex items-center gap-2 text-green-600 hover:text-green-800">
                        <Save size={18} /> שמור
                    </button>
                )}
            </div>

            {isEditing ? (
                 <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full h-40 p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
            ) : (
                <p className="text-slate-600 whitespace-pre-wrap">{content}</p>
            )}
        </section>
    );
};

export default EditableSection;
