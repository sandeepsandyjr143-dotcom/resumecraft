import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, Type, ChevronRight, Sparkles, Save, Plus, Trash2, X, Eye } from 'lucide-react';
import api from '../utils/api';
import { useResume, EMPTY_RESUME } from '../context/ResumeContext';
import ResumePreview from '../components/ResumePreview';
import ATSScore from '../components/ATSScore/ATSScore';
import ChatAssistant from '../components/ChatAssistant/ChatAssistant';
import Navbar from '../components/Navbar';

const JOB_ROLES = [
  'Software Engineer','Frontend Developer','Backend Developer','Full Stack Developer',
  'Data Scientist','Data Analyst','Product Manager','UX Designer','Marketing Manager',
  'Digital Marketing','Sales Executive','Business Development','HR Manager',
  'Financial Analyst','Operations Manager','Content Writer','Graphic Designer',
  'Project Manager','DevOps Engineer','Machine Learning Engineer','Fresher/Student'
];

export default function Builder() {
  const { resumeData, setResumeData, selectedTemplate, jobRole, setJobRole, saveResume, currentResumeId, isSaving } = useResume();
  const [activeTab, setActiveTab]       = useState('paste');
  const [pasteText, setPasteText]       = useState('');
  const [uploading, setUploading]       = useState(false);
  const [aiLoading, setAiLoading]       = useState(false);
  const [error, setError]               = useState('');
  const [success, setSuccess]           = useState('');
  const [activeSection, setActiveSection] = useState('personal');
  const [showPreviewMobile, setShowPreviewMobile] = useState(false);
  const fileRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      if (resumeData.personal?.name) saveResume(resumeData.personal.name + "'s Resume").catch(() => {});
    }, 30000);
    return () => clearInterval(timer);
  }, [resumeData, saveResume]);

  const handleParseText = async () => {
    if (!pasteText.trim()) return setError('Please paste some text first');
    setAiLoading(true); setError('');
    try {
      const res = await api.post('/api/ai/parse-text', { text: pasteText });
      setResumeData(res.data.resumeData);
      setSuccess('AI has built your resume! Review and edit below.');
      setActiveTab('form');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to parse text');
    } finally { setAiLoading(false); }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true); setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.post('/api/ai/parse-upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setResumeData(res.data.resumeData);
      setSuccess('Resume uploaded and rebuilt by AI!');
      setActiveTab('form');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to process file');
    } finally { setUploading(false); }
  };

  const handleOptimize = async () => {
    if (!jobRole) return setError('Please select a job role first');
    setAiLoading(true); setError('');
    try {
      const res = await api.post('/api/ai/optimize', { resumeData, jobRole });
      setResumeData(res.data.resumeData);
      setSuccess(`Resume optimized for ${jobRole}!`);
    } catch (err) {
      setError(err.response?.data?.error || 'Optimization failed');
    } finally { setAiLoading(false); }
  };

  const handleSaveAndPreview = async () => {
    try {
      const resume = await saveResume(resumeData.personal?.name ? `${resumeData.personal.name}'s Resume` : 'My Resume');
      navigate(`/preview/${resume.id}`);
    } catch { setError('Failed to save resume'); }
  };

  const updatePersonal = (field, value) =>
    setResumeData({ ...resumeData, personal: { ...resumeData.personal, [field]: value } });

  const updateExperience = (idx, field, value) => {
    const exp = [...(resumeData.experience || [])];
    exp[idx] = { ...exp[idx], [field]: value };
    setResumeData({ ...resumeData, experience: exp });
  };

  const addExperience = () =>
    setResumeData({ ...resumeData, experience: [...(resumeData.experience || []), { title:'', company:'', location:'', start:'', end:'', current:false, bullets:[''] }] });

  const removeExperience = (idx) =>
    setResumeData({ ...resumeData, experience: resumeData.experience.filter((_,i) => i !== idx) });

  const updateBullet = (expIdx, bIdx, val) => {
    const exp = [...(resumeData.experience || [])];
    const bullets = [...(exp[expIdx].bullets || [])];
    bullets[bIdx] = val;
    exp[expIdx] = { ...exp[expIdx], bullets };
    setResumeData({ ...resumeData, experience: exp });
  };

  const addBullet = (expIdx) => {
    const exp = [...(resumeData.experience || [])];
    exp[expIdx] = { ...exp[expIdx], bullets: [...(exp[expIdx].bullets || []), ''] };
    setResumeData({ ...resumeData, experience: exp });
  };

  const removeBullet = (expIdx, bIdx) => {
    const exp = [...(resumeData.experience || [])];
    exp[expIdx] = { ...exp[expIdx], bullets: exp[expIdx].bullets.filter((_,i) => i !== bIdx) };
    setResumeData({ ...resumeData, experience: exp });
  };

  const inputCls = "w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";
  const labelCls = "block text-xs font-medium text-gray-600 mb-1";

  const SECTIONS = ['personal','summary','experience','education','skills','projects','achievements','certifications'];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Alerts */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center justify-between">
            <span className="text-red-700 text-sm">{error}</span>
            <button onClick={() => setError('')}><X className="h-4 w-4 text-red-400" /></button>
          </div>
        )}
        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 rounded-xl px-4 py-3 flex items-center justify-between">
            <span className="text-green-700 text-sm">{success}</span>
            <button onClick={() => setSuccess('')}><X className="h-4 w-4 text-green-400" /></button>
          </div>
        )}

        {/* Top controls */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <select
              value={jobRole}
              onChange={e => setJobRole(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select job role (optional)</option>
              {JOB_ROLES.map(r => <option key={r}>{r}</option>)}
            </select>
            {jobRole && (
              <button
                onClick={handleOptimize}
                disabled={aiLoading}
                className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50 transition-colors"
              >
                <Sparkles className="h-4 w-4" />
                {aiLoading ? 'Optimizing...' : 'AI Optimize'}
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowPreviewMobile(!showPreviewMobile)}
              className="md:hidden flex items-center gap-1.5 border border-gray-200 bg-white text-gray-700 px-3 py-2 rounded-lg text-sm font-medium"
            >
              <Eye className="h-4 w-4" /> Preview
            </button>
            <button
              onClick={handleSaveAndPreview}
              disabled={isSaving}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm"
            >
              <Save className="h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save & Preview'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Editor */}
          <div className="space-y-4">
            {/* Input method tabs */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="flex border-b border-gray-100">
                {[['paste', Type, 'Paste Text'],['upload', Upload, 'Upload File'],['form', FileText, 'Manual Form']].map(([key, Icon, label]) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium transition-colors ${activeTab === key ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    <Icon className="h-3.5 w-3.5" /> {label}
                  </button>
                ))}
              </div>

              <div className="p-4">
                {activeTab === 'paste' && (
                  <div>
                    <p className="text-xs text-gray-500 mb-3">Paste anything — LinkedIn bio, old resume text, or rough notes. AI will structure it perfectly.</p>
                    <textarea
                      value={pasteText}
                      onChange={e => setPasteText(e.target.value)}
                      placeholder="Paste your resume text, LinkedIn summary, or any career info here..."
                      rows={8}
                      className={inputCls + ' resize-none'}
                    />
                    <button
                      onClick={handleParseText}
                      disabled={aiLoading || !pasteText.trim()}
                      className="mt-3 w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                      <Sparkles className="h-4 w-4" />
                      {aiLoading ? 'AI is building your resume...' : 'Build Resume with AI'}
                    </button>
                  </div>
                )}

                {activeTab === 'upload' && (
                  <div>
                    <p className="text-xs text-gray-500 mb-3">Upload your existing resume (PDF or DOCX). AI will extract and rebuild it professionally.</p>
                    <div
                      onClick={() => fileRef.current?.click()}
                      className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
                    >
                      <Upload className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">{uploading ? 'Processing file...' : 'Click to upload PDF or DOCX'}</p>
                      <p className="text-xs text-gray-400 mt-1">Max 5MB</p>
                    </div>
                    <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" onChange={handleFileUpload} className="hidden" />
                  </div>
                )}

                {activeTab === 'form' && (
                  <div>
                    {/* Section navigation */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {SECTIONS.map(s => (
                        <button
                          key={s}
                          onClick={() => setActiveSection(s)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-colors ${activeSection === s ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>

                    {/* Personal */}
                    {activeSection === 'personal' && (
                      <div className="space-y-3">
                        <h3 className="font-semibold text-gray-800 text-sm">Personal Information</h3>
                        <div className="grid grid-cols-2 gap-3">
                          {[['name','Full Name'],['email','Email'],['phone','Phone'],['location','Location'],['linkedin','LinkedIn URL'],['portfolio','Portfolio/Website']].map(([f,l]) => (
                            <div key={f} className={f === 'name' ? 'col-span-2' : ''}>
                              <label className={labelCls}>{l}</label>
                              <input value={resumeData.personal?.[f] || ''} onChange={e => updatePersonal(f, e.target.value)} className={inputCls} placeholder={l} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Summary */}
                    {activeSection === 'summary' && (
                      <div className="space-y-3">
                        <h3 className="font-semibold text-gray-800 text-sm">Professional Summary</h3>
                        <textarea
                          value={resumeData.summary || ''}
                          onChange={e => setResumeData({ ...resumeData, summary: e.target.value })}
                          placeholder="Write a compelling 2-3 sentence professional summary..."
                          rows={5}
                          className={inputCls + ' resize-none'}
                        />
                      </div>
                    )}

                    {/* Experience */}
                    {activeSection === 'experience' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-800 text-sm">Work Experience</h3>
                          <button onClick={addExperience} className="flex items-center gap-1 text-blue-600 text-xs font-medium hover:text-blue-700">
                            <Plus className="h-3.5 w-3.5" /> Add Job
                          </button>
                        </div>
                        {(resumeData.experience || []).map((exp, idx) => (
                          <div key={idx} className="border border-gray-200 rounded-xl p-3 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-medium text-gray-500">Job {idx + 1}</span>
                              <button onClick={() => removeExperience(idx)} className="text-red-400 hover:text-red-600"><Trash2 className="h-3.5 w-3.5" /></button>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              {[['title','Job Title'],['company','Company'],['location','Location'],['start','Start (e.g. Jan 2022)'],['end','End (or leave blank)']].map(([f,l]) => (
                                <div key={f}>
                                  <label className={labelCls}>{l}</label>
                                  <input value={exp[f] || ''} onChange={e => updateExperience(idx, f, e.target.value)} className={inputCls} placeholder={l} />
                                </div>
                              ))}
                              <div className="flex items-center gap-2 pt-4">
                                <input type="checkbox" id={`cur-${idx}`} checked={exp.current || false} onChange={e => updateExperience(idx, 'current', e.target.checked)} className="rounded" />
                                <label htmlFor={`cur-${idx}`} className="text-xs text-gray-600">Currently working here</label>
                              </div>
                            </div>
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <label className={labelCls}>Bullet Points</label>
                                <button onClick={() => addBullet(idx)} className="text-blue-600 text-xs hover:text-blue-700">+ Add</button>
                              </div>
                              {(exp.bullets || []).map((b, bi) => (
                                <div key={bi} className="flex gap-1 mb-1">
                                  <input value={b} onChange={e => updateBullet(idx, bi, e.target.value)} className={inputCls} placeholder="Describe your achievement..." />
                                  <button onClick={() => removeBullet(idx, bi)} className="text-red-400 hover:text-red-600 flex-shrink-0"><X className="h-4 w-4" /></button>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                        {(resumeData.experience || []).length === 0 && (
                          <button onClick={addExperience} className="w-full border-2 border-dashed border-gray-200 rounded-xl p-6 text-gray-400 text-sm hover:border-blue-400 hover:text-blue-600 transition-colors">
                            + Add your first job
                          </button>
                        )}
                      </div>
                    )}

                    {/* Education */}
                    {activeSection === 'education' && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-800 text-sm">Education</h3>
                          <button
                            onClick={() => setResumeData({ ...resumeData, education: [...(resumeData.education||[]), { degree:'', institution:'', year:'', gpa:'' }] })}
                            className="flex items-center gap-1 text-blue-600 text-xs font-medium hover:text-blue-700"
                          >
                            <Plus className="h-3.5 w-3.5" /> Add
                          </button>
                        </div>
                        {(resumeData.education || []).map((edu, idx) => (
                          <div key={idx} className="border border-gray-200 rounded-xl p-3 space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-500">Education {idx+1}</span>
                              <button onClick={() => setResumeData({ ...resumeData, education: resumeData.education.filter((_,i)=>i!==idx) })} className="text-red-400 hover:text-red-600"><Trash2 className="h-3.5 w-3.5"/></button>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              {[['degree','Degree / Course'],['institution','College / University'],['year','Year of Graduation'],['gpa','GPA (optional)']].map(([f,l]) => (
                                <div key={f}>
                                  <label className={labelCls}>{l}</label>
                                  <input value={edu[f]||''} onChange={e => { const ed=[...resumeData.education]; ed[idx]={...ed[idx],[f]:e.target.value}; setResumeData({...resumeData,education:ed}); }} className={inputCls} placeholder={l} />
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Skills */}
                    {activeSection === 'skills' && (
                      <div className="space-y-3">
                        <h3 className="font-semibold text-gray-800 text-sm">Skills</h3>
                        {[['technical','Technical Skills (comma separated)'],['tools','Tools & Technologies'],['soft','Soft Skills']].map(([f,l]) => (
                          <div key={f}>
                            <label className={labelCls}>{l}</label>
                            <input
                              value={(resumeData.skills?.[f]||[]).join(', ')}
                              onChange={e => setResumeData({ ...resumeData, skills: { ...resumeData.skills, [f]: e.target.value.split(',').map(s=>s.trim()).filter(Boolean) } })}
                              className={inputCls}
                              placeholder="e.g. Python, React, SQL"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Projects */}
                    {activeSection === 'projects' && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-800 text-sm">Projects</h3>
                          <button onClick={() => setResumeData({...resumeData,projects:[...(resumeData.projects||[]),{name:'',description:'',link:'',tech:[]}]})} className="flex items-center gap-1 text-blue-600 text-xs font-medium">
                            <Plus className="h-3.5 w-3.5" /> Add
                          </button>
                        </div>
                        {(resumeData.projects||[]).map((p,idx) => (
                          <div key={idx} className="border border-gray-200 rounded-xl p-3 space-y-2">
                            <div className="flex justify-between"><span className="text-xs text-gray-500">Project {idx+1}</span><button onClick={()=>setResumeData({...resumeData,projects:resumeData.projects.filter((_,i)=>i!==idx)})} className="text-red-400 hover:text-red-600"><Trash2 className="h-3.5 w-3.5"/></button></div>
                            {[['name','Project Name'],['description','Description'],['link','Link (optional)']].map(([f,l]) => (
                              <div key={f}><label className={labelCls}>{l}</label><input value={p[f]||''} onChange={e=>{const pr=[...resumeData.projects];pr[idx]={...pr[idx],[f]:e.target.value};setResumeData({...resumeData,projects:pr});}} className={inputCls} placeholder={l}/></div>
                            ))}
                            <div><label className={labelCls}>Technologies (comma separated)</label><input value={(p.tech||[]).join(', ')} onChange={e=>{const pr=[...resumeData.projects];pr[idx]={...pr[idx],tech:e.target.value.split(',').map(s=>s.trim()).filter(Boolean)};setResumeData({...resumeData,projects:pr});}} className={inputCls} placeholder="React, Node.js, MongoDB"/></div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Achievements */}
                    {activeSection === 'achievements' && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-800 text-sm">Achievements</h3>
                          <button onClick={()=>setResumeData({...resumeData,achievements:[...(resumeData.achievements||[]),'']}) } className="flex items-center gap-1 text-blue-600 text-xs font-medium"><Plus className="h-3.5 w-3.5"/> Add</button>
                        </div>
                        {(resumeData.achievements||[]).map((a,idx)=>(
                          <div key={idx} className="flex gap-2">
                            <input value={a} onChange={e=>{const ac=[...resumeData.achievements];ac[idx]=e.target.value;setResumeData({...resumeData,achievements:ac});}} className={inputCls} placeholder="Describe an achievement..."/>
                            <button onClick={()=>setResumeData({...resumeData,achievements:resumeData.achievements.filter((_,i)=>i!==idx)})} className="text-red-400 hover:text-red-600 flex-shrink-0"><X className="h-4 w-4"/></button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Certifications */}
                    {activeSection === 'certifications' && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-800 text-sm">Certifications</h3>
                          <button onClick={()=>setResumeData({...resumeData,certifications:[...(resumeData.certifications||[]),{name:'',issuer:'',year:''}]})} className="flex items-center gap-1 text-blue-600 text-xs font-medium"><Plus className="h-3.5 w-3.5"/> Add</button>
                        </div>
                        {(resumeData.certifications||[]).map((c,idx)=>(
                          <div key={idx} className="border border-gray-200 rounded-xl p-3 space-y-2">
                            <div className="flex justify-between"><span className="text-xs text-gray-500">Cert {idx+1}</span><button onClick={()=>setResumeData({...resumeData,certifications:resumeData.certifications.filter((_,i)=>i!==idx)})} className="text-red-400"><Trash2 className="h-3.5 w-3.5"/></button></div>
                            {[['name','Certificate Name'],['issuer','Issuing Organization'],['year','Year']].map(([f,l])=>(
                              <div key={f}><label className={labelCls}>{l}</label><input value={c[f]||''} onChange={e=>{const ce=[...resumeData.certifications];ce[idx]={...ce[idx],[f]:e.target.value};setResumeData({...resumeData,certifications:ce});}} className={inputCls} placeholder={l}/></div>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* ATS Score */}
            <ATSScore resumeData={resumeData} jobRole={jobRole} resumeId={currentResumeId} />
          </div>

          {/* Right: Preview */}
          <div className={`${showPreviewMobile ? 'block' : 'hidden'} md:block`}>
            <div className="sticky top-20">
              <ResumePreview resumeData={resumeData} templateId={selectedTemplate} />
            </div>
          </div>
        </div>
      </div>

      <ChatAssistant
        resumeData={resumeData}
        onResumeUpdate={setResumeData}
        resumeId={currentResumeId}
      />
    </div>
  );
}
