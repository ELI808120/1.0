
import React, { useState, useEffect } from 'react';
import type { Module, Resource } from '../types';
import { useAdmin } from '../contexts/AdminContext';
import { Trash2, Edit, Save, Info, ArrowUp, ArrowDown, PlusCircle, XCircle, Download } from 'lucide-react';
import VideoEmbedGuide from './VideoEmbedGuide';
import EditableText from './EditableText';

interface ModuleCardProps {
  module: Module;
  onModuleUpdate: (moduleId: number, updatedValues: Partial<Module>) => void;
  onDelete: (moduleId: number) => void;
  onMove: (moduleId: number, direction: 'up' | 'down') => void;
  isFirst: boolean;
  isLast: boolean;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ module, onModuleUpdate, onDelete, onMove, isFirst, isLast }) => {
  const { isAdmin } = useAdmin();
  const [embedCode, setEmbedCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [description, setDescription] = useState(module.description);

  // Safeguard against corrupted data in localStorage
  const safeResources = Array.isArray(module.resources) ? module.resources : [];
  
  useEffect(() => {
    setDescription(module.description);
  }, [module.description]);

  const handleAddVideo = () => {
    const trimmedCode = embedCode.trim();
    if (!trimmedCode) {
        setError('נא להדביק קוד הטמעה.');
        return;
    }

    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(trimmedCode, 'text/html');
        const iframe = doc.querySelector('iframe');

        if (!iframe) {
            setError('קוד הטמעה לא תקין. יש לוודא שהקוד שהודבק מכיל תג <iframe>.');
            return;
        }

        // The embed code is valid, save the entire original code
        onModuleUpdate(module.id, { videoCode: trimmedCode });
        setEmbedCode('');
        setError(null);
    } catch (e) {
        console.error("Error parsing embed code:", e);
        setError('אירעה שגיאה בעיבוד קוד ההטמעה. אנא ודא שהקוד תקין.');
    }
  };
  
  const handleDescriptionSave = () => {
    onModuleUpdate(module.id, { description });
    setIsEditingDesc(false);
  };

  const handleAddResource = () => {
    const newResource: Resource = { id: Date.now(), title: 'קישור חדש', url: '#' };
    onModuleUpdate(module.id, { resources: [...safeResources, newResource] });
  };
  
  const handleResourceChange = (resId: number, field: keyof Resource, value: string) => {
      const updatedResources = safeResources.map(r => r.id === resId ? {...r, [field]: value} : r);
      onModuleUpdate(module.id, { resources: updatedResources });
  };

  const handleDeleteResource = (resId: number) => {
      const updatedResources = safeResources.filter(r => r.id !== resId);
      onModuleUpdate(module.id, { resources: updatedResources });
  };

  return (
    <>
      <VideoEmbedGuide isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
              <EditableText 
                as="h2"
                value={module.title}
                onChange={newTitle => onModuleUpdate(module.id, { title: newTitle })}
                className="text-2xl font-bold text-slate-800"
              />
              {isAdmin && (
                  <div className="flex gap-2 flex-shrink-0 mr-4 items-center">
                      <button onClick={() => onMove(module.id, 'up')} disabled={isFirst} className="p-1 text-gray-500 hover:text-gray-800 disabled:opacity-30 disabled:cursor-not-allowed"> <ArrowUp size={20} /> </button>
                      <button onClick={() => onMove(module.id, 'down')} disabled={isLast} className="p-1 text-gray-500 hover:text-gray-800 disabled:opacity-30 disabled:cursor-not-allowed"> <ArrowDown size={20} /> </button>
                      <button onClick={() => onDelete(module.id)} className="p-1 text-red-600 hover:text-red-800"> <Trash2 size={20} /> </button>
                  </div>
              )}
          </div>
          
            {module.videoCode ? (
                <div 
                    className="video-embed-wrapper bg-gray-200 rounded-lg mb-6 overflow-hidden" 
                    dangerouslySetInnerHTML={{ __html: module.videoCode }} 
                />
            ) : (
                isAdmin && (
                    <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 mb-6">
                        <span>הסרטון יוצג כאן לאחר הוספה ממצב ניהול</span>
                    </div>
                )
            )}

          <div className="prose max-w-none text-slate-700 mb-6">
              <h3 className="text-xl font-semibold text-slate-800 flex justify-between items-center">
                  תיאור המודול
                  {isAdmin && !isEditingDesc && <button onClick={() => setIsEditingDesc(true)} className="text-blue-600 hover:text-blue-800"><Edit size={16} /></button>}
                  {isAdmin && isEditingDesc && <button onClick={handleDescriptionSave} className="text-green-600 hover:text-green-800"><Save size={16} /></button>}
              </h3>
              {isEditingDesc && isAdmin ? (
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full h-32 p-2 border rounded-md mt-2"
                  />
              ) : (
                <p className="text-slate-600 whitespace-pre-wrap">{module.description}</p>
              )}
          </div>

          <div className="mb-6">
              <h3 className="text-xl font-semibold text-slate-800 mb-3">משאבים וחומרים להורדה</h3>
              <ul className="space-y-2">
                  {safeResources.map(resource => (
                      <li key={resource.id} className="flex items-center gap-2 group">
                          <Download size={18} className="text-[var(--theme-color-500)]" />
                          {isAdmin ? (
                            <>
                                <input type="text" value={resource.title} onChange={e => handleResourceChange(resource.id, 'title', e.target.value)} className="p-1 border-b flex-grow bg-yellow-50" placeholder="שם הקובץ" />
                                <input type="text" value={resource.url} onChange={e => handleResourceChange(resource.id, 'url', e.target.value)} className="p-1 border-b flex-grow bg-yellow-50" placeholder="קישור"/>
                                <button onClick={() => handleDeleteResource(resource.id)} className="text-red-500"><XCircle size={16}/></button>
                            </>
                          ) : (
                            <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{resource.title}</a>
                          )}
                      </li>
                  ))}
                  {isAdmin && (
                      <button onClick={handleAddResource} className="text-green-600 flex items-center gap-1 mt-2">
                          <PlusCircle size={16} /> הוסף משאב
                      </button>
                  )}
              </ul>
          </div>

          {isAdmin && (
              <div className="admin-section bg-slate-50 p-6 rounded-lg border border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-700 mb-3">הוספת / עדכון סרטון</h3>
                  <button onClick={() => setIsGuideOpen(true)} className="flex items-center gap-2 text-sm text-blue-600 hover:underline mb-4">
                      <Info size={16}/> לא בטוחים איך? לחצו למדריך
                  </button>
                  <textarea
                      id={`video-code-${module.id}`}
                      className="w-full h-28 p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-[var(--theme-color-500)] focus:border-[var(--theme-color-500)] transition-shadow resize-none"
                      placeholder="הדבק כאן את קוד ההטמעה של הסרטון (iframe)..."
                      value={embedCode}
                      onChange={(e) => setEmbedCode(e.target.value)}
                  ></textarea>
                  {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
                  <button 
                      onClick={handleAddVideo}
                      className="mt-4 bg-[var(--theme-color-600)] text-white font-semibold py-2 px-5 rounded-lg hover:bg-[var(--theme-color-700)] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--theme-color-500)]"
                  >
                      הוסף/עדכן סרטון
                  </button>
              </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ModuleCard;