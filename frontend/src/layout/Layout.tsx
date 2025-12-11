import { Menu, Sparkles } from 'lucide-react';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  
  const isHome = location.pathname === '/';
  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 font-sans selection:bg-brand-500/30">
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight">CodeFuture</span>
            </div>
            
            <div className="hidden md:flex items-center gap-6">
              <button 
                onClick={() => navigate('/')}
                className={`text-sm font-medium transition-colors ${isHome ? 'text-brand-400' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Home
              </button>
              <button 
                onClick={() => navigate('/onboarding')}
                className="text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors"
                >
                New Course
              </button>
              
              <div className="h-4 w-px bg-slate-800"></div>
              
              {user ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold text-sm ring-2 ring-brand-500/10">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-slate-300">{user.name}</span>
                  </div>
                  <button 
                    onClick={logout}
                    className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => navigate('/login')}
                    className="text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={() => navigate('/signup')}
                    className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium rounded-lg transition-all"
                  >
                    Get Started
                  </button>
                </div>
              )}
            </div>

            <div className="md:hidden">
              <button className="p-2 text-slate-400 hover:text-white">
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer (Simplified) */}
      <footer className="border-t border-slate-800 mt-20 py-8 text-center text-slate-500 text-sm">
        <p>&copy; 2025 CodeFuture Academy. Built for everyone.</p>
      </footer>
    </div>
  );
};
