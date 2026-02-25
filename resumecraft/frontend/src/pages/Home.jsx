import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Target, FileText, Star, CheckCircle, Feather } from 'lucide-react';
import Navbar from '../components/Navbar';

const FEATURES = [
  { icon: Zap, title: 'Paste Any Text', desc: 'Dump your messy notes, old resume, or LinkedIn bio. AI builds a professional resume instantly.' },
  { icon: Target, title: 'ATS Optimized', desc: 'Every resume is analyzed for ATS compatibility. Get a score and fix issues before applying.' },
  { icon: FileText, title: 'HR Intelligence', desc: 'AI thinks like a recruiter — detects gaps, rewrites weak bullets, adds missing keywords.' },
  { icon: Star, title: 'Chat to Edit', desc: 'Tell the AI what to change in plain English. "Rewrite for marketing role" — done in seconds.' }
];

const STEPS = [
  { step: '01', title: 'Paste or Upload', desc: 'Add your details in any format — messy text, old PDF, or fill the form manually.' },
  { step: '02', title: 'AI Rebuilds It', desc: 'AI analyzes like an HR expert and creates a professional, ATS-optimized resume.' },
  { step: '03', title: 'Edit & Refine', desc: 'Tweak everything in the editor or use the AI chat coach. 3 free chats per day.' },
  { step: '04', title: 'Pay & Download', desc: 'Pay just ₹29–39 to download your clean PDF. No subscription. Ever.' }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium mb-6">
            <Zap className="h-3.5 w-3.5" /> AI-Powered Resume Builder
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight tracking-tight">
            Build your resume like an<br />
            <span className="text-blue-600">HR expert would</span>
          </h1>
          <p className="text-xl text-gray-500 mb-8 max-w-2xl mx-auto leading-relaxed">
            Paste messy notes, upload an old resume, or start fresh. AI rebuilds it professionally,
            optimizes for ATS, and helps you land interviews.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/builder" className="bg-blue-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-sm">
              Build My Resume <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/templates" className="bg-white text-gray-700 px-8 py-3.5 rounded-xl font-semibold border border-gray-200 hover:bg-gray-50 transition-colors">
              View Templates
            </Link>
          </div>
          <p className="text-gray-400 text-sm mt-5">Free to build & edit · Pay only to download (₹29–39)</p>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why ResumeCraft works better</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                <div className="bg-blue-50 rounded-xl p-3 w-fit mb-4">
                  <f.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {STEPS.map((s, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 flex gap-4 shadow-sm">
                <div className="text-4xl font-black text-blue-100 leading-none">{s.step}</div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{s.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-sm font-medium mb-4">
            <CheckCircle className="h-3.5 w-3.5" /> No Subscription
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Pay only when you download</h2>
          <p className="text-gray-500 mb-10">Build, edit, and refine for free. Pay once per resume when you're ready.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'PDF Export', price: '₹29', desc: 'Clean PDF, no watermark, free template' },
              { label: 'Premium Template', price: '₹39', desc: 'Premium design + PDF export', popular: true },
              { label: 'Cover Letter', price: '₹19', desc: 'AI-generated cover letter + export' }
            ].map((p, i) => (
              <div key={i} className={`border rounded-2xl p-6 ${p.popular ? 'border-blue-500 shadow-lg' : 'border-gray-200'}`}>
                {p.popular && <div className="text-blue-600 text-xs font-bold mb-2">⭐ Most Popular</div>}
                <div className="text-2xl font-black text-gray-900 mb-1">{p.price}</div>
                <div className="font-semibold text-gray-800 mb-2">{p.label}</div>
                <div className="text-gray-500 text-sm mb-4">{p.desc}</div>
                <Link to="/builder" className={`block text-center py-2.5 rounded-xl text-sm font-medium transition-colors ${p.popular ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'}`}>
                  Get Started
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-gray-500 text-sm">
            <CheckCircle className="h-4 w-4 text-green-500" />
            Building, editing, and AI assistance are always free · 3 AI chats per day
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to craft your perfect resume?</h2>
          <p className="text-blue-100 mb-8">Takes less than 5 minutes. No subscription required.</p>
          <Link to="/builder" className="bg-white text-blue-600 px-8 py-3.5 rounded-xl font-semibold hover:bg-blue-50 transition-colors inline-flex items-center gap-2 shadow-sm">
            Start Building Free <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-10 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg p-1">
              <Feather className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-white">Resume<span className="text-blue-400">Craft</span></span>
          </div>
          <p className="text-sm">© {new Date().getFullYear()} ResumeCraft. Build professional resumes with AI.</p>
          <div className="flex gap-4 text-sm">
            <Link to="/templates" className="hover:text-white transition-colors">Templates</Link>
            <Link to="/login" className="hover:text-white transition-colors">Login</Link>
            <Link to="/register" className="hover:text-white transition-colors">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
