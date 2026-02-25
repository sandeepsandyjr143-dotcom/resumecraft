import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Lock, CheckCircle, Sparkles } from 'lucide-react';
import api from '../utils/api';
import Navbar from '../components/Navbar';

const CATEGORIES = ['all', 'ats', 'corporate', 'tech', 'creative', 'fresher', 'marketing', 'sales', 'modern'];
const CAT_LABELS  = { all: 'All Templates', ats: 'ATS Safe', corporate: 'Corporate', tech: 'Tech', creative: 'Creative', fresher: 'Fresher', marketing: 'Marketing', sales: 'Sales', modern: 'Modern' };

export default function Templates() {
  const [templates, setTemplates]           = useState([]);
  const [filtered, setFiltered]             = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading]               = useState(true);

  useEffect(() => {
    api.get('/api/templates')
      .then(r => { setTemplates(r.data); setFiltered(r.data); })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setFiltered(activeCategory === 'all' ? templates : templates.filter(t => t.category === activeCategory));
  }, [activeCategory, templates]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Resume Templates</h1>
          <p className="text-gray-500">10 professionally designed templates. Your resume data works in all of them.</p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {CAT_LABELS[cat] || cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Loading templates...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {filtered.map(template => (
              <div key={template.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-200 group">
                {/* Preview */}
                <div className="relative bg-gray-50">
                  <img
                    src={template.previewUrl}
                    alt={template.name}
                    className="w-full h-52 object-contain p-1"
                  />
                  <div className="absolute top-2 right-2">
                    {template.isPremium
                      ? <span className="bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1"><Lock className="h-2.5 w-2.5" /> Premium</span>
                      : <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1"><CheckCircle className="h-2.5 w-2.5" /> Free</span>
                    }
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">{template.name}</h3>
                  <p className="text-gray-400 text-xs mb-1 line-clamp-2 leading-relaxed">{template.description}</p>
                  <p className="text-blue-500 text-xs mb-3 font-medium">{template.bestFor}</p>

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-gray-400 capitalize bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
                      {template.category}
                    </span>
                    <span className="text-xs font-bold text-gray-700">
                      {template.isPremium ? '₹39' : 'Free'}
                    </span>
                  </div>

                  <Link
                    to={`/builder?template=${template.id}`}
                    className="block text-center bg-blue-600 text-white py-2 rounded-xl text-xs font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Use This Template
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-14 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Not sure which template to pick?</h2>
          </div>
          <p className="text-gray-500 text-sm mb-5">Build your resume first. AI will recommend the best template for your job role automatically.</p>
          <Link to="/builder" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors inline-flex items-center gap-2 text-sm shadow-sm">
            Build Resume → AI Recommends Template
          </Link>
        </div>
      </div>
    </div>
  );
}
