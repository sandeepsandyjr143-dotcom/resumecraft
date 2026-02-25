import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, Eye, ArrowLeft } from 'lucide-react';
import { useResume } from '../context/ResumeContext';
import Builder from './Builder';
import Navbar from '../components/Navbar';

// Editor reuses the Builder page with a loaded resume
export default function Editor() {
  const { id } = useParams();
  const { loadResume } = useResume();
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadResume(id).then(() => setLoaded(true)).catch(() => {
      setError('Resume not found');
      setTimeout(() => navigate('/dashboard'), 2000);
    });
  }, [id]);

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-red-500 mb-2">{error}</p>
        <p className="text-gray-400 text-sm">Redirecting to dashboard...</p>
      </div>
    </div>
  );

  if (!loaded) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
    </div>
  );

  // Render the builder with the loaded resume
  return <Builder />;
}
