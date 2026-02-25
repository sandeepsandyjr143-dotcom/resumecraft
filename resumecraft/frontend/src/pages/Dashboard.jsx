import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Copy, Download, Eye, FileText, Target } from 'lucide-react';
import api from '../utils/api';
import Navbar from '../components/Navbar';

export default function Dashboard() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const res = await api.get('/api/resumes');
      setResumes(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this resume? This cannot be undone.')) return;
    setDeleting(id);
    try {
      await api.delete(`/api/resumes/${id}`);
      setResumes(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      alert('Failed to delete resume');
    } finally {
      setDeleting(null);
    }
  };

  const handleDuplicate = async (id) => {
    try {
      const res = await api.post(`/api/resumes/${id}/duplicate`);
      setResumes(prev => [res.data, ...prev]);
    } catch (err) {
      alert('Failed to duplicate resume');
    }
  };

  const getScoreColor = (score) => {
    if (!score) return 'text-gray-400';
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-500';
  };

  const getStatusBadge = (status) => {
    const badges = {
      draft: 'bg-gray-100 text-gray-600',
      paid: 'bg-green-100 text-green-700',
      exported: 'bg-blue-100 text-blue-700'
    };
    return badges[status] || badges.draft;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Resumes</h1>
            <p className="text-gray-500 text-sm mt-1">{resumes.length} resume{resumes.length !== 1 ? 's' : ''}</p>
          </div>
          <Link to="/builder" className="bg-blue-600 text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-blue-700 flex items-center gap-2 text-sm">
            <Plus className="h-4 w-4" /> New Resume
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading your resumes...</p>
          </div>
        ) : resumes.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-blue-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <FileText className="h-10 w-10 text-blue-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">No resumes yet</h2>
            <p className="text-gray-500 mb-6">Create your first AI-powered resume in minutes</p>
            <Link to="/builder" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 inline-flex items-center gap-2">
              <Plus className="h-4 w-4" /> Build My First Resume
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resumes.map((resume) => (
              <div key={resume.id} className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-shadow">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{resume.title}</h3>
                    {resume.jobRole && (
                      <p className="text-blue-600 text-xs mt-0.5">{resume.jobRole}</p>
                    )}
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ml-2 ${getStatusBadge(resume.status)}`}>
                    {resume.status}
                  </span>
                </div>

                {/* ATS Score */}
                <div className="flex items-center gap-2 mb-3">
                  <Target className="h-4 w-4 text-gray-400" />
                  {resume.atsScore ? (
                    <span className={`text-sm font-semibold ${getScoreColor(resume.atsScore)}`}>
                      ATS Score: {resume.atsScore}/100
                    </span>
                  ) : (
                    <span className="text-gray-400 text-sm">ATS not checked yet</span>
                  )}
                </div>

                {/* Date */}
                <p className="text-gray-400 text-xs mb-4">
                  Last edited: {new Date(resume.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/editor/${resume.id}`)}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-xs font-medium hover:bg-blue-700 flex items-center justify-center gap-1"
                  >
                    <Edit className="h-3 w-3" /> Edit
                  </button>
                  <button
                    onClick={() => navigate(`/preview/${resume.id}`)}
                    className="px-3 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
                    title="Preview"
                  >
                    <Eye className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => handleDuplicate(resume.id)}
                    className="px-3 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
                    title="Duplicate"
                  >
                    <Copy className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => handleDelete(resume.id)}
                    disabled={deleting === resume.id}
                    className="px-3 py-2 border border-red-100 rounded-lg text-red-400 hover:bg-red-50 disabled:opacity-50"
                    title="Delete"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
