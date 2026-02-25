import { createContext, useContext, useState, useCallback } from 'react';
import api from '../utils/api';

const ResumeContext = createContext(null);

export const EMPTY_RESUME = {
  personal: { name: '', email: '', phone: '', location: '', linkedin: '', portfolio: '' },
  summary: '',
  experience: [],
  education: [],
  skills: { technical: [], soft: [], tools: [] },
  certifications: [],
  projects: [],
  achievements: [],
  languages: []
};

export function ResumeProvider({ children }) {
  const [resumeData, setResumeData] = useState(EMPTY_RESUME);
  const [currentResumeId, setCurrentResumeId] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState('ats-classic');
  const [jobRole, setJobRole] = useState('');
  const [atsScore, setAtsScore] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  const updateResumeData = useCallback((updates) => {
    setResumeData(prev => ({ ...prev, ...updates }));
  }, []);

  const updateSection = useCallback((section, value) => {
    setResumeData(prev => ({ ...prev, [section]: value }));
  }, []);

  const saveResume = useCallback(async (title) => {
    setIsSaving(true);
    try {
      if (currentResumeId) {
        const res = await api.put(`/api/resumes/${currentResumeId}`, {
          title, jobRole, resumeData, templateId: selectedTemplate
        });
        setLastSaved(new Date());
        return res.data;
      } else {
        const res = await api.post('/api/resumes', {
          title: title || `Resume - ${new Date().toLocaleDateString()}`,
          jobRole, resumeData, templateId: selectedTemplate
        });
        setCurrentResumeId(res.data.id);
        setLastSaved(new Date());
        return res.data;
      }
    } finally {
      setIsSaving(false);
    }
  }, [currentResumeId, jobRole, resumeData, selectedTemplate]);

  const loadResume = useCallback(async (id) => {
    const res = await api.get(`/api/resumes/${id}`);
    setCurrentResumeId(res.data.id);
    setResumeData(res.data.resumeData || EMPTY_RESUME);
    setSelectedTemplate(res.data.templateId || 'ats-classic');
    setJobRole(res.data.jobRole || '');
    return res.data;
  }, []);

  const resetResume = useCallback(() => {
    setResumeData(EMPTY_RESUME);
    setCurrentResumeId(null);
    setSelectedTemplate('ats-classic');
    setJobRole('');
    setAtsScore(null);
  }, []);

  return (
    <ResumeContext.Provider value={{
      resumeData, setResumeData, updateResumeData, updateSection,
      currentResumeId, setCurrentResumeId,
      selectedTemplate, setSelectedTemplate,
      jobRole, setJobRole,
      atsScore, setAtsScore,
      isSaving, lastSaved,
      saveResume, loadResume, resetResume
    }}>
      {children}
    </ResumeContext.Provider>
  );
}

export const useResume = () => useContext(ResumeContext);
