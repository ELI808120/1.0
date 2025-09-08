import React from 'react';
import { Link } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import useLocalStorage from '../hooks/useLocalStorage';
import type { LandingPageContent, Feature, Testimonial } from '../types';
import { useAdmin } from '../contexts/AdminContext';
import EditableText from '../components/EditableText';
import { initialData } from '../data/initialData';

const iconList = ['BookOpen', 'ShieldCheck', 'Heart', 'BrainCircuit', 'Users', 'ThumbsUp', 'Smile', 'Settings', 'MessageCircle'];

const LandingPage: React.FC = () => {
  const [content, setContent] = useLocalStorage<LandingPageContent>('landingPage', initialData.landingPageContent);
  const { isAdmin } = useAdmin();

  // Safeguard against corrupted data in localStorage
  const safeFeatures = Array.isArray(content.features) ? content.features : initialData.landingPageContent.features;
  const safeTestimonials = Array.isArray(content.testimonials) ? content.testimonials : initialData.landingPageContent.testimonials;
  
  const handleContentChange = (field: keyof LandingPageContent, value: string) => {
    setContent(prev => ({ ...prev, [field]: value }));
  };

  const handleFeatureChange = (id: number, field: keyof Feature, value: string) => {
    setContent(prev => ({
      ...prev,
      features: prev.features.map(f => f.id === id ? { ...f, [field]: value } : f)
    }));
  };

  const handleAddFeature = () => {
    const newFeature: Feature = {
      id: Date.now(),
      icon: 'ThumbsUp',
      title: 'נושא חדש',
      description: 'תיאור קצר של הנושא.'
    };
    setContent(prev => ({ ...prev, features: [...safeFeatures, newFeature] }));
  };

  const handleDeleteFeature = (id: number) => {
    if (window.confirm('האם למחוק את הסעיף?')) {
        setContent(prev => ({ ...prev, features: prev.features.filter(f => f.id !== id) }));
    }
  };

  const handleTestimonialChange = (id: number, field: keyof Testimonial, value: string) => {
    setContent(prev => ({
      ...prev,
      testimonials: prev.testimonials.map(t => t.id === id ? { ...t, [field]: value } : t)
    }));
  };

  const handleAddTestimonial = () => {
    const newTestimonial: Testimonial = {
        id: Date.now(),
        text: 'הוסף כאן את תוכן ההמלצה. לחץ לעריכה.',
        author: 'שם הממליץ',
    };
    setContent(prev => ({ ...prev, testimonials: [...safeTestimonials, newTestimonial] }));
  };

  const handleDeleteTestimonial = (id: number) => {
    if (window.confirm('האם למחוק את ההמלצה?')) {
        setContent(prev => ({ ...prev, testimonials: prev.testimonials.filter(t => t.id !== id) }));
    }
  };

  const RenderIcon = ({ name }: { name: string }) => {
    const Icon = (LucideIcons as any)[name] || LucideIcons.HelpCircle;
    return <Icon className="w-8 h-8 text-[var(--theme-color-600)]" />;
  };

  return (
    <div className="container mx-auto px-6 py-12">
      {/* Hero Section */}
      <section className="text-center bg-gradient-to-br from-[var(--theme-color-100)] to-indigo-100 rounded-xl shadow-lg p-8 md:p-16 mb-16">
        <EditableText 
          as="h2"
          value={content.heroTitle}
          onChange={v => handleContentChange('heroTitle', v)}
          className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-4"
        />
        <EditableText 
          as="p"
          value={content.heroSubtitle}
          onChange={v => handleContentChange('heroSubtitle', v)}
          className="max-w-3xl mx-auto text-lg text-slate-600 mb-8"
        />
        <Link 
          to="/course" 
          className="inline-block bg-[var(--theme-color-600)] text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-[var(--theme-color-700)] transition-transform transform hover:scale-105 shadow-lg"
        >
          {content.heroButtonText}
        </Link>
      </section>

      {/* Features Section */}
      <section className="text-center mb-16">
        <EditableText
          as="h3"
          value={content.featuresTitle}
          onChange={v => handleContentChange('featuresTitle', v)}
          className="text-3xl font-bold text-slate-700 mb-10"
        />
        <div className="grid md:grid-cols-3 gap-8">
          {safeFeatures.map(feature => (
            <div key={feature.id} className="relative bg-white p-8 rounded-lg shadow-md border-t-4 border-[var(--theme-color-500)]">
              {isAdmin && (
                  <button onClick={() => handleDeleteFeature(feature.id)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 z-10">
                    <LucideIcons.XCircle size={20} />
                  </button>
              )}
              <div className="flex justify-center items-center mb-4 bg-[var(--theme-color-100)] rounded-full w-16 h-16 mx-auto">
                <RenderIcon name={feature.icon} />
              </div>
              {isAdmin && (
                  <select
                      value={feature.icon}
                      onChange={e => handleFeatureChange(feature.id, 'icon', e.target.value)}
                      className="text-xs mb-2 p-1 border rounded"
                  >
                      {iconList.map(icon => <option key={icon} value={icon}>{icon}</option>)}
                  </select>
              )}
              <EditableText
                as="h4"
                value={feature.title}
                onChange={v => handleFeatureChange(feature.id, 'title', v)}
                className="text-xl font-semibold mb-2 text-slate-800"
              />
              <EditableText
                as="p"
                value={feature.description}
                onChange={v => handleFeatureChange(feature.id, 'description', v)}
                className="text-slate-600"
              />
            </div>
          ))}
        </div>
        {isAdmin && (
            <button
                onClick={handleAddFeature}
                className="mt-8 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg inline-flex items-center gap-2"
            >
                <LucideIcons.PlusCircle size={20}/> הוסף סעיף
            </button>
        )}
      </section>

      {/* Testimonials Section */}
      <section className="text-center bg-slate-100 py-12 rounded-xl">
        <EditableText
            as="h3"
            value={content.testimonialsTitle}
            onChange={v => handleContentChange('testimonialsTitle', v)}
            className="text-3xl font-bold text-slate-700 mb-10"
        />
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {safeTestimonials.map(testimonial => (
                <div key={testimonial.id} className="relative bg-white p-8 rounded-lg shadow-md text-right">
                    {isAdmin && (
                        <button onClick={() => handleDeleteTestimonial(testimonial.id)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 z-10">
                            <LucideIcons.XCircle size={20} />
                        </button>
                    )}
                    <LucideIcons.Quote className="absolute top-4 left-4 text-slate-200 w-12 h-12" />
                    <EditableText
                        as="p"
                        value={testimonial.text}
                        onChange={v => handleTestimonialChange(testimonial.id, 'text', v)}
                        className="text-slate-600 italic mb-4"
                    />
                    <EditableText
                        as="p"
                        value={testimonial.author}
                        onChange={v => handleTestimonialChange(testimonial.id, 'author', v)}
                        className="font-semibold text-[var(--theme-color-600)]"
                    />
                </div>
            ))}
        </div>
        {isAdmin && (
            <button
                onClick={handleAddTestimonial}
                className="mt-8 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg inline-flex items-center gap-2"
            >
                <LucideIcons.PlusCircle size={20} /> הוסף המלצה
            </button>
        )}
      </section>
    </div>
  );
};

export default LandingPage;