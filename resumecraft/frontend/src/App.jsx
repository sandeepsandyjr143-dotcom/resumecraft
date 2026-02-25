import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ResumeProvider } from './context/ResumeContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Builder from './pages/Builder';
import Editor from './pages/Editor';
import Templates from './pages/Templates';
import Preview from './pages/Preview';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-500">Loading...</p>
      </div>
    </div>
  );
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <AuthProvider>
      <ResumeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/builder" element={<PrivateRoute><Builder /></PrivateRoute>} />
            <Route path="/editor/:id" element={<PrivateRoute><Editor /></PrivateRoute>} />
            <Route path="/preview/:id" element={<PrivateRoute><Preview /></PrivateRoute>} />
          </Routes>
        </BrowserRouter>
      </ResumeProvider>
    </AuthProvider>
  );
}
