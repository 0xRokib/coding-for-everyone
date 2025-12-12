import { ChevronLeft, Code2, History, LogOut, Plus, Sparkles, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { courseService } from '../services/course.service';

interface SidebarLayoutProps {
  children: React.ReactNode;
}

interface Course {
  id: number;
  goals: string;
  persona: string;
  curriculum?: any;
  createdAt: string;
}

export const SidebarLayout: React.FC<SidebarLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, user, logout } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [hoveredCourseId, setHoveredCourseId] = useState<number | null>(null);

  useEffect(() => {
    loadCourses();
  }, [token]);

  const loadCourses = async () => {
    try {
      if (!token) return;
      const data = await courseService.getMyCourses(token);
      setCourses(data);
    } catch (error) {
      console.error('Failed to load courses:', error);
    } finally {
      setCoursesLoading(false);
    }
  };

  const handleDeleteCourse = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (!token || !window.confirm('Are you sure you want to delete this course history?')) return;

    try {
      await courseService.deleteCourse(id, token);
      setCourses(courses.filter(c => c.id !== id));
    } catch (error) {
      console.error('Failed to delete course:', error);
      alert('Failed to delete course');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex overflow-hidden font-sans relative selection:bg-brand-500/30 selection:text-brand-200">
       {/* Global Animated Background (Shared from Landing Page aesthetic) */}
       <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-10" />
          <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-brand-500/10 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-purple-500/10 rounded-full blur-[120px] animate-pulse" style={{animationDelay: '1.5s'}}></div>
       </div>

      {/* Sidebar - Premium Glassmorphism */}
      <div className="w-72 bg-slate-900/60 backdrop-blur-xl border-r border-slate-800/50 flex flex-col flex-shrink-0 z-30 relative shadow-2xl">
        {/* Glow Effect on Sidebar Border */}
        <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-transparent via-slate-700/50 to-transparent"></div>

        {/* Brand Header */}
        <div className="p-6">
          <div 
             className="flex items-center gap-3 cursor-pointer group" 
             onClick={() => navigate('/dashboard')}
          >
            <div className="relative">
                <div className="absolute inset-0 bg-brand-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                <div className="relative w-10 h-10 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl flex items-center justify-center border border-slate-700 group-hover:border-brand-500/50 transition-colors">
                  <Code2 className="w-5 h-5 text-brand-400 group-hover:text-brand-300 transition-colors" />
                </div>
            </div>
            <div>
              <h1 className="font-bold text-white text-lg tracking-tight group-hover:text-brand-200 transition-colors">Code Anyone</h1>
              <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider group-hover:text-slate-400 transition-colors">Academy</p>
            </div>
          </div>
        </div>

        {/* Action Button: Create New */}
        <div className="px-3">
             <button
               onClick={() => navigate('/onboarding')}
               className="w-full flex items-center gap-3 px-3 py-3 mb-4 bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white rounded-xl transition-all shadow-lg shadow-brand-500/20 hover:shadow-brand-500/40 group relative overflow-hidden"
             >
               <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
               <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
               <span className="font-semibold">Create New Course</span>
             </button>
        </div>

        {/* History Section */}
        <div className="flex-1 overflow-y-auto px-3 py-2 custom-scrollbar">
          <div className="flex items-center justify-between mb-2 px-3">
            <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
              <History className="w-3 h-3" />
              <span>Recent History</span>
            </div>
          </div>
          
          {coursesLoading ? (
            <div className="space-y-2 px-1">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-9 bg-slate-800/30 rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : courses.length > 0 ? (
            <div className="space-y-0.5">
              {courses.map((course) => {
                let curriculum;
                try {
                  curriculum = typeof course.curriculum === 'string' 
                    ? JSON.parse(course.curriculum) 
                    : course.curriculum;
                } catch (e) {
                  curriculum = null;
                }

                const title = curriculum?.title || course.goals.substring(0, 25);
                const isActive = location.pathname === `/studio/${course.id}` || location.pathname === `/course/${course.id}`;
                
                return (
                  <div
                    key={course.id}
                    onMouseEnter={() => setHoveredCourseId(course.id)}
                    onMouseLeave={() => setHoveredCourseId(null)}
                    onClick={() => navigate(`/course/${course.id}`)}
                    className={`group relative flex items-center justify-between w-full px-3 py-2.5 rounded-lg transition-all cursor-pointer border border-transparent ${
                        isActive 
                        ? 'bg-slate-800/80 border-slate-700/50 text-white' 
                        : 'hover:bg-slate-800/50 hover:border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex-1 min-w-0 pr-2">
                      <p className="text-xs font-medium truncate transition-colors">
                        {title}
                      </p>
                    </div>

                    {hoveredCourseId === course.id && (
                        <button
                          onClick={(e) => handleDeleteCourse(e, course.id)}
                          className="p-1 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 px-4 opacity-40">
              <History className="w-5 h-5 mx-auto mb-2 text-slate-600" />
              <p className="text-slate-500 text-[10px]">No history yet</p>
            </div>
          )}
        </div>

        {/* User Profile - Back to Dashboard Link */}
        <div className="p-3 border-t border-slate-800/50 bg-slate-900/40 backdrop-blur-md">
           <button 
             onClick={() => navigate('/dashboard')}
             className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-800/50 transition-colors cursor-pointer group relative text-left"
           >
            <div className="relative">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-brand-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-brand-500/20 ring-1 ring-white/10 group-hover:ring-white/20 transition-all">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-900"></div>
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-200 truncate group-hover:text-white transition-colors">Back to Home</p>
              <p className="text-[10px] text-slate-500 truncate group-hover:text-brand-400 transition-colors">{user?.name}</p>
            </div>
            
            <ChevronLeft className="w-4 h-4 text-slate-600 group-hover:text-slate-300 transition-colors rotate-180" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative flex flex-col h-full overflow-hidden">
        
        {/* Top Navbar / Header for Content Area */}
        <header className="h-16 border-b border-slate-800/50 bg-slate-900/30 backdrop-blur-sm flex items-center justify-between px-8 z-20">
             <div className="flex items-center gap-4">
                 {/* Current Page Title */}
                 <h2 className="text-lg font-semibold text-white tracking-tight">
                    New Course
                 </h2>
             </div>
             
             <div className="flex items-center gap-4">
                 <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                    <Sparkles className="w-4 h-4" />
                 </button>
                 <div className="h-4 w-[1px] bg-slate-800"></div>
                 <button 
                  onClick={logout}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                 >
                     <LogOut className="w-3.5 h-3.5" />
                     Sign Out
                 </button>
             </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
           {children}
        </div>
      </div>
    </div>
  );
};
