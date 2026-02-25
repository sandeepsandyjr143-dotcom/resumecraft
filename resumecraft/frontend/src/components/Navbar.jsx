import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Feather, LayoutDashboard, LogOut, LogIn, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl p-1.5 shadow-sm">
              <Feather className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900 tracking-tight">
              Resume<span className="text-blue-600">Craft</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/templates" className="text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors">
              Templates
            </Link>
            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 text-sm font-medium flex items-center gap-1.5 transition-colors">
                  <LayoutDashboard className="h-4 w-4" /> Dashboard
                </Link>
                <Link to="/builder" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
                  + New Resume
                </Link>
                <button onClick={handleLogout} className="text-gray-500 hover:text-red-500 text-sm flex items-center gap-1 transition-colors">
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-blue-600 text-sm font-medium flex items-center gap-1 transition-colors">
                  <LogIn className="h-4 w-4" /> Login
                </Link>
                <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
                  Get Started Free
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="h-6 w-6 text-gray-700" /> : <Menu className="h-6 w-6 text-gray-700" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
          <Link to="/templates" className="block text-gray-700 text-sm font-medium py-1" onClick={() => setMenuOpen(false)}>
            Templates
          </Link>
          {user ? (
            <>
              <Link to="/dashboard" className="block text-gray-700 text-sm font-medium py-1" onClick={() => setMenuOpen(false)}>
                Dashboard
              </Link>
              <Link to="/builder" className="block bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm text-center font-medium" onClick={() => setMenuOpen(false)}>
                + New Resume
              </Link>
              <button onClick={handleLogout} className="block text-red-500 text-sm font-medium py-1">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="block text-gray-700 text-sm font-medium py-1" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
              <Link to="/register" className="block bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm text-center font-medium" onClick={() => setMenuOpen(false)}>
                Get Started Free
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
