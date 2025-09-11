
import React, { useState, useRef, useEffect } from 'react';
import { useAdmin } from '../contexts/AdminContext';
import { Edit, Save } from 'lucide-react';

interface EditableTextProps {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p';
  value: string;
  onChange: (newValue: string) => void;
  className?: string;
}

const EditableText: React.FC<EditableTextProps> = ({ as: Component = 'p', value, onChange, className }) => {
  const { isAdmin } = useAdmin();
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setText(value);
  }, [value]);
  
  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    onChange(text);
    setIsEditing(false);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setText(value);
      setIsEditing(false);
    }
  };

  if (!isAdmin) {
    return <Component className={className}>{value}</Component>;
  }

  if (isEditing) {
    return (
      <div className={`flex items-center gap-2 ${Component === 'p' ? 'w-full' : ''}`}>
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className={`${className} p-1 border-b-2 border-blue-500 focus:outline-none w-full bg-yellow-50`}
        />
        <button onClick={handleSave} className="text-green-600 hover:text-green-800 p-1 flex-shrink-0">
          <Save size={20} />
        </button>
      </div>
    );
  }

  return (
    <div 
        className={`relative group cursor-pointer hover:bg-blue-50 p-1 rounded-md transition-colors ${Component === 'p' ? 'w-full' : ''}`} 
        onClick={() => setIsEditing(true)}
    >
      <Component className={className}>{value}</Component>
      <Edit size={16} className="absolute top-1/2 -mt-2 -right-6 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
};

export default EditableText;