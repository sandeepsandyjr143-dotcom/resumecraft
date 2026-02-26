import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, Eye, X, ArrowRight, CheckCircle, Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar';

// 3 Free + 7 Premium templates
// Designs based on real resume PDFs uploaded by user
const TEMPLATES = [
  // ── FREE TEMPLATES ──────────────────────────────────────────────
  {
    id: 'sangavi-creative',
    name: 'Creative Two Column',
    category: 'creative',
    isPremium: false,
    description: 'Bold name header, two-column layout. Perfect for freshers.',
    bestFor: 'Freshers, Digital Marketing',
    preview: 'sangavi', // render key
  },
  {
    id: 'ats-classic',
    name: 'ATS Classic',
    category: 'ats',
    isPremium: false,
    description: 'Single column, clean Arial. Maximum ATS compatibility.',
    bestFor: 'All industries',
    preview: 'ats-classic',
  },
  {
    id: 'fresher-simple',
    name: 'Fresher Simple',
    category: 'fresher',
    isPremium: false,
    description: 'Education-first clean layout. Great for fresh graduates.',
    bestFor: 'Students, Freshers',
    preview: 'fresher',
  },

  // ── PREMIUM TEMPLATES (₹39) ──────────────────────────────────────
  {
    id: 'ats-modern',
    name: 'ATS Modern',
    category: 'ats',
    isPremium: true,
    description: 'Dark navy header, ATS-safe body. Modern and professional.',
    bestFor: 'Tech, Finance, Operations',
    preview: 'ats-modern',
  },
  {
    id: 'corporate-blue',
    name: 'Corporate Blue',
    category: 'corporate',
    isPremium: true,
    description: 'Blue sidebar with skill bars. Executive corporate feel.',
    bestFor: 'Finance, Banking, Legal, HR',
    preview: 'corporate',
  },
  {
    id: 'tech-dark',
    name: 'Tech Dark',
    category: 'tech',
    isPremium: true,
    description: 'Dark theme with green accents. Developer-focused design.',
    bestFor: 'Software, Engineering, DevOps',
    preview: 'tech-dark',
  },
  {
    id: 'marketing-bold',
    name: 'Marketing Bold',
    category: 'marketing',
    isPremium: true,
    description: 'Red accents with metrics boxes. Impact-driven layout.',
    bestFor: 'Marketing, Advertising, SEO',
    preview: 'marketing',
  },
  {
    id: 'sales-results',
    name: 'Sales Results',
    category: 'sales',
    isPremium: true,
    description: 'Green theme with achievement callouts. Results-focused.',
    bestFor: 'Sales, Business Development',
    preview: 'sales',
  },
  {
    id: 'executive-premium',
    name: 'Executive Premium',
    category: 'corporate',
    isPremium: true,
    description: 'Serif fonts, elegant whitespace. Senior executive look.',
    bestFor: 'Directors, VPs, C-Suite',
    preview: 'executive',
  },
  {
    id: 'global-minimal',
    name: 'Global Minimal',
    category: 'modern',
    isPremium: true,
    description: 'Ultra-clean two column. International standard design.',
    bestFor: 'International jobs, Any role',
    preview: 'minimal',
  },
];

const CATEGORIES = ['all','ats','corporate','tech','creative','fresher','marketing','sales','modern'];
const CAT_LABELS = {
  all:'All Templates', ats:'ATS Safe', corporate:'Corporate',
  tech:'Tech', creative:'Creative', fresher:'Fresher',
  marketing:'Marketing', sales:'Sales', modern:'Modern'
};

// ── REAL CSS MINI PREVIEWS ───────────────────────────────────────────────────
function TemplatePreview({ type }) {
  const base = { width: '100%', height: '100%', padding: '8px', position: 'relative', overflow: 'hidden', fontFamily: 'Arial, sans-serif' };

  if (type === 'sangavi') return (
    <div style={{ ...base, background: '#fff' }}>
      {/* Bold name header like Sangavi PDF */}
      <div style={{ borderBottom: '2px solid #eee', paddingBottom: '5px', marginBottom: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div style={{ fontSize: '14px', fontWeight: '900', letterSpacing: '1px', color: '#111' }}>SANGAVI M</div>
        <div style={{ fontSize: '6px', letterSpacing: '2px', color: '#666' }}>DIGITAL MARKETING</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '40% 58%', gap: '5px' }}>
        <div>
          {['CONTACT','EDUCATION','SKILLS','SOFT SKILLS','CERTIFICATIONS'].map((s,i) => (
            <div key={i} style={{ marginBottom: '5px' }}>
              <div style={{ fontSize: '5.5px', fontWeight: '800', letterSpacing: '1px', marginBottom: '2px', color: '#111' }}>{s}</div>
              {[1,2].map(j => <div key={j} style={{ height: '3px', background: '#e5e7eb', borderRadius: '1px', marginBottom: '2px', width: j===1?'80%':'60%' }} />)}
            </div>
          ))}
        </div>
        <div>
          {['CAREER OBJECTIVE','PROJECT EXPERIENCE','TOOLS','DECLARATION'].map((s,i) => (
            <div key={i} style={{ marginBottom: '5px', background: '#f9f9f9', padding: '3px', borderRadius: '2px' }}>
              <div style={{ fontSize: '5.5px', fontWeight: '800', letterSpacing: '1px', marginBottom: '2px', color: '#111' }}>{s}</div>
              {[1,2,3].map(j => <div key={j} style={{ height: '2.5px', background: '#e5e7eb', borderRadius: '1px', marginBottom: '2px', width: `${90-j*10}%` }} />)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (type === 'ats-classic') return (
    <div style={{ ...base, background: '#fff' }}>
      <div style={{ textAlign: 'center', borderBottom: '1.5px solid #000', paddingBottom: '4px', marginBottom: '6px' }}>
        <div style={{ fontSize: '11px', fontWeight: '900', color: '#000' }}>JOHN DOE</div>
        <div style={{ height: '2.5px', background: '#ccc', borderRadius: '1px', width: '80%', margin: '2px auto' }} />
      </div>
      {['SUMMARY','EXPERIENCE','EDUCATION','SKILLS'].map((s,i) => (
        <div key={i} style={{ marginBottom: '5px' }}>
          <div style={{ fontSize: '5.5px', fontWeight: '800', borderBottom: '1px solid #000', paddingBottom: '1px', marginBottom: '2px', letterSpacing: '1px' }}>{s}</div>
          {[1,2,3].map(j => <div key={j} style={{ height: '2.5px', background: '#ddd', borderRadius: '1px', marginBottom: '1.5px', width: `${95-j*8}%` }} />)}
        </div>
      ))}
    </div>
  );

  if (type === 'fresher') return (
    <div style={{ ...base, background: '#ebf8ff' }}>
      <div style={{ background: '#2b6cb0', padding: '5px', marginBottom: '6px', borderRadius: '2px', textAlign: 'center' }}>
        <div style={{ fontSize: '9px', fontWeight: '900', color: '#fff' }}>JOHN DOE</div>
        <div style={{ fontSize: '5px', color: '#bee3f8', marginTop: '1px' }}>B.Tech Computer Science</div>
      </div>
      {['OBJECTIVE','EDUCATION','SKILLS','PROJECTS','CERTIFICATIONS'].map((s,i) => (
        <div key={i} style={{ marginBottom: '4px' }}>
          <div style={{ fontSize: '5.5px', fontWeight: '800', background: '#2b6cb0', color: '#fff', padding: '1px 4px', marginBottom: '2px', borderRadius: '1px' }}>{s}</div>
          {[1,2].map(j => <div key={j} style={{ height: '2.5px', background: '#bee3f8', borderRadius: '1px', marginBottom: '1.5px', width: `${85-j*10}%` }} />)}
        </div>
      ))}
    </div>
  );

  if (type === 'ats-modern') return (
    <div style={{ ...base, background: '#fff', padding: '0' }}>
      <div style={{ background: '#1a1a2e', padding: '8px', marginBottom: '6px' }}>
        <div style={{ fontSize: '10px', fontWeight: '900', color: '#fff', letterSpacing: '1px' }}>JOHN DOE</div>
        <div style={{ fontSize: '5px', color: '#a0aec0', margin: '2px 0' }}>Senior Manager</div>
        <div style={{ display: 'flex', gap: '4px', marginTop: '2px' }}>
          {[40,50,45].map((w,i) => <div key={i} style={{ height: '2px', background: '#4a5568', borderRadius: '1px', width: `${w}px` }} />)}
        </div>
      </div>
      <div style={{ padding: '0 8px' }}>
        {['PROFILE','EXPERIENCE','EDUCATION','SKILLS'].map((s,i) => (
          <div key={i} style={{ marginBottom: '4px' }}>
            <div style={{ fontSize: '5.5px', fontWeight: '800', color: '#1a1a2e', borderLeft: '2px solid #1a1a2e', paddingLeft: '3px', marginBottom: '2px', letterSpacing: '1px' }}>{s}</div>
            {[1,2].map(j => <div key={j} style={{ height: '2.5px', background: '#e2e8f0', borderRadius: '1px', marginBottom: '1.5px', width: `${90-j*10}%` }} />)}
          </div>
        ))}
        <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap', marginTop: '3px' }}>
          {[30,40,25,35].map((w,i) => <div key={i} style={{ height: '8px', width: `${w}px`, background: '#e8f4f8', border: '1px solid #bee3f8', borderRadius: '8px' }} />)}
        </div>
      </div>
    </div>
  );

  if (type === 'corporate') return (
    <div style={{ ...base, padding: '0', display: 'flex' }}>
      <div style={{ width: '38%', background: '#003366', padding: '6px', flexShrink: 0 }}>
        <div style={{ fontSize: '7px', fontWeight: '900', color: '#fff', marginBottom: '2px', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '3px' }}>JOHN DOE</div>
        <div style={{ fontSize: '4.5px', color: '#90cdf4', marginBottom: '5px' }}>Corporate Manager</div>
        {['CONTACT','SKILLS','CERTS'].map((s,i) => (
          <div key={i} style={{ marginBottom: '4px' }}>
            <div style={{ fontSize: '4.5px', color: '#90cdf4', letterSpacing: '1px', marginBottom: '2px' }}>{s}</div>
            {[1,2].map(j => <div key={j} style={{ height: '2px', background: 'rgba(255,255,255,0.3)', borderRadius: '1px', marginBottom: '2px', width: `${80-j*15}%` }} />)}
          </div>
        ))}
      </div>
      <div style={{ flex: 1, padding: '6px' }}>
        {['SUMMARY','EXPERIENCE','EDUCATION','ACHIEVEMENTS'].map((s,i) => (
          <div key={i} style={{ marginBottom: '4px' }}>
            <div style={{ fontSize: '5px', fontWeight: '800', color: '#003366', borderBottom: '1.5px solid #003366', paddingBottom: '1px', marginBottom: '2px', letterSpacing: '1px' }}>{s}</div>
            {[1,2].map(j => <div key={j} style={{ height: '2.5px', background: '#e2e8f0', borderRadius: '1px', marginBottom: '1.5px', width: `${90-j*10}%` }} />)}
          </div>
        ))}
      </div>
    </div>
  );

  if (type === 'tech-dark') return (
    <div style={{ ...base, background: '#0d1117' }}>
      <div style={{ fontSize: '11px', fontWeight: '900', color: '#58a6ff', letterSpacing: '2px', marginBottom: '1px' }}>JOHN DOE</div>
      <div style={{ fontSize: '5px', color: '#8b949e', marginBottom: '4px' }}>Full Stack Developer</div>
      <div style={{ display: 'flex', gap: '3px', marginBottom: '5px', borderBottom: '1px solid #21262d', paddingBottom: '3px' }}>
        {[35,45,30].map((w,i) => <div key={i} style={{ height: '5px', width: `${w}px`, background: '#161b22', border: '1px solid #30363d', borderRadius: '2px' }} />)}
      </div>
      {['// EXPERIENCE','// SKILLS','// PROJECTS','// EDUCATION'].map((s,i) => (
        <div key={i} style={{ marginBottom: '4px' }}>
          <div style={{ fontSize: '5px', color: '#58a6ff', marginBottom: '2px', fontFamily: 'monospace' }}>{s}</div>
          {[1,2].map(j => <div key={j} style={{ height: '2.5px', background: '#21262d', borderRadius: '1px', marginBottom: '1.5px', width: `${90-j*10}%` }} />)}
        </div>
      ))}
      <div style={{ display: 'flex', gap: '2px', flexWrap: 'wrap', marginTop: '2px' }}>
        {[28,35,22,30,25].map((w,i) => <div key={i} style={{ height: '7px', width: `${w}px`, background: '#161b22', border: '1px solid #58a6ff44', borderRadius: '2px' }} />)}
      </div>
    </div>
  );

  if (type === 'marketing') return (
    <div style={{ ...base, padding: '0' }}>
      <div style={{ height: '3px', background: '#e63946' }} />
      <div style={{ padding: '6px', borderBottom: '1px solid #eee' }}>
        <div style={{ fontSize: '10px', fontWeight: '900', color: '#1d3557', letterSpacing: '1px', textTransform: 'uppercase' }}>JOHN DOE</div>
        <div style={{ display: 'inline-block', background: '#e63946', color: '#fff', fontSize: '4.5px', padding: '1px 5px', borderRadius: '1px', marginTop: '2px', letterSpacing: '1px' }}>MARKETING MANAGER</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '60% 38%', gap: '5px', padding: '5px' }}>
        <div>
          {['IMPACT STATEMENT','EXPERIENCE','CAMPAIGNS'].map((s,i) => (
            <div key={i} style={{ marginBottom: '4px' }}>
              <div style={{ fontSize: '5px', fontWeight: '900', color: '#e63946', letterSpacing: '1px', marginBottom: '2px' }}>{s}</div>
              {[1,2,3].map(j => <div key={j} style={{ height: '2.5px', background: '#f5f5f5', borderRadius: '1px', marginBottom: '1.5px', width: `${90-j*8}%` }} />)}
            </div>
          ))}
        </div>
        <div>
          {['RESULTS','SKILLS','EDUCATION'].map((s,i) => (
            <div key={i} style={{ marginBottom: '4px' }}>
              <div style={{ fontSize: '5px', fontWeight: '900', color: '#e63946', letterSpacing: '1px', marginBottom: '2px' }}>{s}</div>
              <div style={{ background: '#fff5f5', border: '1px solid #feb2b2', borderRadius: '2px', padding: '2px', marginBottom: '2px' }}>
                <div style={{ height: '2px', background: '#e63946', borderRadius: '1px', width: '70%' }} />
              </div>
              <div style={{ height: '2.5px', background: '#f5f5f5', borderRadius: '1px', width: '80%' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (type === 'sales') return (
    <div style={{ ...base, padding: '0' }}>
      <div style={{ background: '#1b4332', padding: '6px' }}>
        <div style={{ fontSize: '9px', fontWeight: '900', color: '#fff', letterSpacing: '1px' }}>JOHN DOE</div>
        <div style={{ fontSize: '5px', color: '#95d5b2', marginTop: '1px' }}>Sales Manager</div>
      </div>
      <div style={{ background: '#2d6a4f', padding: '2px 6px', display: 'flex', gap: '6px' }}>
        {[40,50,45].map((w,i) => <div key={i} style={{ height: '2px', background: '#95d5b2', borderRadius: '1px', width: `${w}px` }} />)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '60% 38%', gap: '4px', padding: '5px' }}>
        <div>
          {['VALUE PROPOSITION','SALES EXPERIENCE'].map((s,i) => (
            <div key={i} style={{ marginBottom: '5px' }}>
              <div style={{ fontSize: '5px', fontWeight: '900', color: '#1b4332', borderBottom: '1.5px solid #1b4332', paddingBottom: '1px', marginBottom: '2px', letterSpacing: '1px' }}>{s}</div>
              {[1,2,3].map(j => <div key={j} style={{ height: '2.5px', background: '#d8f3dc', borderRadius: '1px', marginBottom: '1.5px', width: `${90-j*8}%` }} />)}
            </div>
          ))}
        </div>
        <div>
          {['RESULTS','SKILLS'].map((s,i) => (
            <div key={i} style={{ marginBottom: '5px' }}>
              <div style={{ fontSize: '5px', fontWeight: '900', color: '#1b4332', borderBottom: '1.5px solid #1b4332', paddingBottom: '1px', marginBottom: '2px', letterSpacing: '1px' }}>{s}</div>
              <div style={{ background: '#d8f3dc', border: '1px solid #95d5b2', borderRadius: '3px', padding: '2px', textAlign: 'center', marginBottom: '2px' }}>
                <div style={{ fontSize: '7px', fontWeight: '900', color: '#1b4332' }}>120%</div>
                <div style={{ fontSize: '3.5px', color: '#2d6a4f' }}>Quota Hit</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (type === 'executive') return (
    <div style={{ ...base, background: '#fff', fontFamily: 'Georgia, serif' }}>
      <div style={{ textAlign: 'center', marginBottom: '4px', borderBottom: '1px solid #000', paddingBottom: '4px' }}>
        <div style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase' }}>JOHN DOE</div>
        <div style={{ fontSize: '5px', letterSpacing: '2px', color: '#666', marginTop: '1px' }}>CHIEF EXECUTIVE OFFICER</div>
        <div style={{ height: '1px', background: '#ddd', margin: '3px 10%' }} />
        <div style={{ fontSize: '4.5px', color: '#888' }}>john@email.com · +91 98765 43210 · Mumbai</div>
      </div>
      {['EXECUTIVE SUMMARY','PROFESSIONAL EXPERIENCE','AREAS OF EXPERTISE','KEY ACHIEVEMENTS'].map((s,i) => (
        <div key={i} style={{ marginBottom: '4px' }}>
          <div style={{ fontSize: '5.5px', fontWeight: '700', letterSpacing: '2px', textAlign: 'center', marginBottom: '2px' }}>{s}</div>
          {[1,2].map(j => <div key={j} style={{ height: '2px', background: '#e5e7eb', borderRadius: '1px', marginBottom: '1.5px', width: `${85-j*5}%`, margin: '0 auto 1.5px' }} />)}
        </div>
      ))}
    </div>
  );

  if (type === 'minimal') return (
    <div style={{ ...base, background: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', paddingBottom: '5px', marginBottom: '6px' }}>
        <div>
          <div style={{ fontSize: '10px', fontWeight: '700', color: '#111827', letterSpacing: '-0.5px' }}>John Doe</div>
          <div style={{ fontSize: '5px', color: '#6b7280', marginTop: '1px' }}>Product Manager</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          {[35,45,30].map((w,i) => <div key={i} style={{ height: '2px', background: '#d1d5db', borderRadius: '1px', marginBottom: '2px', width: `${w}px` }} />)}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '60% 38%', gap: '6px' }}>
        <div>
          {['Profile','Experience','Projects'].map((s,i) => (
            <div key={i} style={{ marginBottom: '5px' }}>
              <div style={{ fontSize: '5px', fontWeight: '700', color: '#9ca3af', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '2px' }}>{s}</div>
              {[1,2,3].map(j => <div key={j} style={{ height: '2.5px', background: '#f3f4f6', borderRadius: '1px', marginBottom: '1.5px', width: `${90-j*8}%` }} />)}
            </div>
          ))}
        </div>
        <div>
          {['Education','Skills','Certs'].map((s,i) => (
            <div key={i} style={{ marginBottom: '5px' }}>
              <div style={{ fontSize: '5px', fontWeight: '700', color: '#9ca3af', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '2px' }}>{s}</div>
              {[1,2].map(j => <div key={j} style={{ height: '2.5px', background: '#f3f4f6', borderRadius: '1px', marginBottom: '1.5px', width: `${80-j*10}%` }} />)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return <div style={{ ...base, background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontSize: '10px', color: '#9ca3af' }}>Preview</span></div>;
}

// ── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function Templates() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [preview, setPreview] = useState(null);

  const filtered = activeCategory === 'all'
    ? TEMPLATES
    : TEMPLATES.filter(t => t.category === activeCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Preview Modal */}
      {preview && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setPreview(null)}>
          <div className="bg-white rounded-2xl overflow-hidden shadow-2xl w-full max-w-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div>
                <h2 className="font-bold text-gray-900">{preview.name}</h2>
                <p className="text-gray-400 text-sm">{preview.description}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-sm font-bold px-3 py-1 rounded-full ${preview.isPremium ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                  {preview.isPremium ? '₹39 Premium' : 'Free'}
                </span>
                <Link to={`/builder?template=${preview.id}`} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 flex items-center gap-1">
                  Use <ArrowRight className="h-3 w-3" />
                </Link>
                <button onClick={() => setPreview(null)} className="text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
              </div>
            </div>
            <div className="p-6 bg-gray-50">
              <div className="bg-white shadow-lg mx-auto rounded border" style={{ width: '400px', height: '520px' }}>
                <TemplatePreview type={preview.preview} />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Resume Templates</h1>
          <p className="text-gray-500">10 professionally designed templates. 3 free, 7 premium at ₹39.</p>
          <div className="flex items-center justify-center gap-4 mt-3">
            <span className="flex items-center gap-1 text-green-600 text-sm font-medium"><CheckCircle className="h-4 w-4" /> 3 Free Templates</span>
            <span className="flex items-center gap-1 text-purple-600 text-sm font-medium"><Lock className="h-4 w-4" /> 7 Premium at ₹39</span>
          </div>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${activeCategory === cat ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              {CAT_LABELS[cat]}
            </button>
          ))}
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {filtered.map(template => (
            <div key={template.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all group cursor-pointer"
              style={{ borderColor: template.isPremium ? '#a78bfa44' : '#86efac44' }}>

              {/* Mini preview */}
              <div className="relative overflow-hidden bg-white" style={{ height: '180px' }}
                onClick={() => setPreview(template)}>
                <div style={{ width: '100%', height: '100%', transform: 'scale(1)', transformOrigin: 'top left' }}>
                  <TemplatePreview type={template.preview} />
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button className="bg-white text-gray-900 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1">
                    <Eye className="h-3 w-3" /> Preview
                  </button>
                </div>

                {/* Badge */}
                <div className="absolute top-2 right-2">
                  {template.isPremium
                    ? <span className="bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1"><Lock className="h-2.5 w-2.5" />₹39</span>
                    : <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1"><CheckCircle className="h-2.5 w-2.5" />Free</span>}
                </div>
              </div>

              <div className="p-3">
                <h3 className="font-bold text-gray-900 text-sm mb-0.5">{template.name}</h3>
                <p className="text-gray-400 text-xs mb-1 leading-relaxed line-clamp-2">{template.description}</p>
                <p className="text-blue-500 text-xs mb-2 font-medium">{template.bestFor}</p>
                <Link to={`/builder?template=${template.id}`}
                  className="block text-center py-2 rounded-xl text-xs font-bold transition-colors bg-blue-600 text-white hover:bg-blue-700">
                  Use This Template
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-14 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Not sure which template?</h2>
          </div>
          <p className="text-gray-500 text-sm mb-5">Build your resume first — AI recommends the best template for your role automatically.</p>
          <Link to="/builder" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 inline-flex items-center gap-2 text-sm shadow-sm">
            Build Resume → AI Picks Template
          </Link>
        </div>
      </div>
    </div>
  );
}
