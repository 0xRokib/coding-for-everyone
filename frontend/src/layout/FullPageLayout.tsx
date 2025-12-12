import { ArrowRight, Code2, LogOut, Settings, Sparkles, User } from 'lucide-react';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface FullPageLayoutProps {
  children: React.ReactNode;
}

export const FullPageLayout: React.FC<FullPageLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const publicItems = [
    { label: 'Community', path: '/community' },
    { label: 'Roadmap', path: '/roadmap' },
    { label: 'Contact', path: '/contact' },
  ];
  
  const privateItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'New Course', path: '/onboarding' },
    ...publicItems
  ];

  const displayItems = user ? privateItems : publicItems;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans relative selection:bg-brand-500/30">
       
       {/* Global Background (Shared Aesthetic) */}
       <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-10" />
       </div>

      {/* Top Navbar */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled || location.pathname !== '/' ? 'bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/50' : 'bg-transparent border-transparent'}`}>
        <div className="w-full px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Brand */}
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
              <div className="relative w-9 h-9 bg-gradient-to-br from-brand-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg text-white tracking-tight group-hover:text-brand-200 transition-colors">Code Anyone</span>
            </div>
            
            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-1">
              {displayItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <button 
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                            isActive 
                            ? 'bg-slate-800 text-white shadow-inner' 
                            : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                        }`}
                    >
                        {item.label}
                    </button>
                  );
              })}
            </div>
            
            {/* User Profile / Actions */}
            <div className="flex items-center gap-4">
              <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                 <Sparkles className="w-4 h-4" />
              </button>
              
              <div className="h-4 w-px bg-slate-800"></div>

              {user ? (
                <div className="relative">
                    <button 
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-3 cursor-pointer group outline-none"
                    >
                       <div className="text-right hidden sm:block">
                           <div className="text-sm font-bold text-white leading-none group-hover:text-brand-200 transition-colors">{user.name}</div>
                           <div className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Pro Mbr</div>
                       </div>
                       <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-slate-700 to-slate-800 border border-slate-600 flex items-center justify-center text-xs font-bold text-white group-hover:border-brand-500 transition-colors shadow-lg shadow-black/20">
                           {user.name.charAt(0).toUpperCase()}
                       </div>
                    </button>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)}></div>
                            <div className="absolute right-0 mt-3 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                                <div className="px-4 py-3 border-b border-slate-800 mb-2">
                                    <p className="text-sm font-bold text-white truncate">{user.name}</p>
                                    <p className="text-xs text-slate-500 truncate">{user.email || 'user@example.com'}</p>
                                </div>
                                
                                <button className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2 transition-colors">
                                    <User className="w-4 h-4" />
                                    <span>Profile</span>
                                </button>
                                <button className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2 transition-colors">
                                    <Settings className="w-4 h-4" />
                                    <span>Settings</span>
                                </button>
                                
                                <div className="h-px bg-slate-800 my-2"></div>
                                
                                <button 
                                    onClick={() => {
                                        setIsDropdownOpen(false);
                                        logout();
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 flex items-center gap-2 transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>Log Out</span>
                                </button>
                            </div>
                        </>
                    )}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => navigate('/login')} 
                        className="text-slate-400 hover:text-white text-sm font-semibold transition-colors relative group"
                    >
                        Signin
                        <div className="absolute inset-x-0 bottom-0 h-px bg-white scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                    </button>
                    <button 
                        onClick={() => navigate('/signup')} 
                        className="relative group px-5 py-2 text-sm font-bold rounded-xl overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-lg shadow-brand-500/20 hover:shadow-brand-500/40"
                    >
                         <div className="absolute inset-0 bg-gradient-to-r from-brand-600 to-purple-600 bg-[length:200%_100%] animate-gradient-x"></div>
                         <div className="relative flex items-center gap-2 text-white">
                             <span>Get Started</span>
                             <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                         </div>
                    </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="flex-1 relative z-10 flex flex-col">
        {children}
      </main>

    </div>
  );
};
