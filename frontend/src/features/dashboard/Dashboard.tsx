import { ArrowRight, BookOpen, ChevronRight, Clock, Code2, Plus, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Course, courseService } from '../../services/course.service';

export const Dashboard = () => {
  const { user, token, logout } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && token) {
      loadCourses();
    } else {
        // Should be protected route, but safety check
        setIsLoading(false);
    }
  }, [user, token]);

  const loadCourses = async () => {
    try {
      if (!token) return;
      const data = await courseService.getMyCourses(token);
      setCourses(data);
    } catch (error) {
      console.error('Failed to load courses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (!user) {
      return (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Please sign in to view your dashboard</h2>
              <button onClick={() => navigate('/login')} className="bg-brand-600 text-white px-6 py-2 rounded-lg">Sign In</button>
          </div>
      )
  }

  return (
      <div className="flex-1 flex flex-col h-full relative overflow-hidden">
        {/* Background Ambience (Matching Community/Landing) */}
        <div className="absolute inset-0 pointer-events-none">
           <div className="absolute top-[-100px] left-[20%] w-[30vw] h-[30vw] bg-brand-500/10 rounded-full blur-[100px] animate-pulse"></div>
           <div className="absolute bottom-[-100px] right-[10%] w-[40vw] h-[40vw] bg-purple-500/10 rounded-full blur-[120px] animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>

        {/* Header Section - Full Width with Backdrop Blur */}
        <div className="relative px-8 pt-8 pb-6 border-b border-slate-800/50 bg-slate-900/30 backdrop-blur-md z-10">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 max-w-7xl mx-auto">
               <div>
                   <h1 className="text-3xl font-black text-white tracking-tight mb-2">Welcome back, {user.name}</h1>
                   <p className="text-slate-400">Track your progress and continue learning.</p>
               </div>
               
               <div className="flex items-center gap-4">
                   <button 
                      onClick={() => navigate('/onboarding')}
                      className="px-5 py-3 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl shadow-lg shadow-brand-500/20 hover:shadow-brand-500/40 transition-all flex items-center gap-2 group"
                   >
                       <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                       <span>New Course</span>
                   </button>
               </div>
           </div>
           
           {/* Quick Stats Bar (Optional, can be part of header or main content. Putting main stats in content for now to match old dashboard, but cleaner) */}
        </div>

        {/* Main Content Area - Scrollable */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-0 z-0">
           <div className="max-w-7xl mx-auto px-8 py-8 space-y-8">
                
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
                                <BookOpen className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Active Courses</div>
                                <div className="text-2xl font-bold text-white">{courses.length}</div>
                            </div>
                        </div>
                    </div>
                     <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
                                <Clock className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Hours Learned</div>
                                <div className="text-2xl font-bold text-white">0</div>
                            </div>
                        </div>
                    </div>
                     <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400">
                                <Code2 className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Projects Built</div>
                                <div className="text-2xl font-bold text-white">0</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Course List */}
                <div>
                  <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-brand-400" />
                    Your Courses
                  </h2>

                  {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-2xl h-64 animate-pulse"></div>
                      ))}
                    </div>
                  ) : courses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {courses.map((course) => (
                        <div 
                            key={course.id} 
                            onClick={() => navigate(`/course/${course.id}`)} 
                            className="group bg-slate-900/40 hover:bg-slate-900/60 text-left border border-slate-800 hover:border-brand-500/50 rounded-2xl p-6 transition-all cursor-pointer relative overflow-hidden shadow-sm backdrop-blur-sm"
                        >
                          <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                              <ArrowRight className="w-5 h-5 text-brand-400 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                          </div>
                          
                          <div className="mb-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-500/10 text-brand-400 border border-brand-500/20 capitalize">
                              {course.persona} Path
                            </span>
                          </div>
                          
                          <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-brand-100 transition-colors">{course.goals}</h3>
                          <p className="text-slate-400 text-sm mb-6 line-clamp-2">
                            Custom curriculum generated on {formatDate(course.createdAt)}
                          </p>
                          
                          <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-800/50">
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <Clock className="w-4 h-4" />
                                <span>Self-paced</span>
                            </div>
                             <span className="text-sm font-medium text-brand-400 group-hover:text-brand-300 flex items-center gap-1">
                                Continue <ChevronRight className="w-4 h-4" />
                             </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20 bg-slate-900/30 border border-slate-800 border-dashed rounded-3xl flex flex-col items-center backdrop-blur-sm">
                      <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mb-4">
                          <Code2 className="w-8 h-8 text-slate-500" />
                      </div>
                      <h3 className="text-lg font-medium text-white mb-2">No courses yet</h3>
                      <p className="text-slate-400 mb-6 max-w-sm mx-auto">Start your first learning journey by creating a new course plan.</p>
                      <button
                        onClick={() => navigate('/onboarding')}
                        className="bg-brand-600 hover:bg-brand-500 text-white px-6 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-brand-500/20"
                      >
                        Create First Course
                      </button>
                    </div>
                  )}
                </div>
           </div>
        </div>
      </div>
  );
};
