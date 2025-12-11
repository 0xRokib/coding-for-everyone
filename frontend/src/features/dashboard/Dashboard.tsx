import { ArrowRight, BookOpen, ChevronRight, Clock, Code2, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Layout } from '../../layout/Layout';
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
          <Layout>
              <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
                  <h2 className="text-2xl font-bold text-white mb-4">Please sign in to view your dashboard</h2>
                  <button onClick={() => navigate('/login')} className="bg-brand-600 text-white px-6 py-2 rounded-lg">Sign In</button>
              </div>
          </Layout>
      )
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {user.name}</h1>
            <p className="text-slate-400">Track your progress and continue learning.</p>
          </div>
          <button
            onClick={() => navigate('/onboarding')}
            className="flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white px-5 py-3 rounded-xl font-medium transition-all shadow-lg shadow-brand-500/20 group"
          >
            <Plus className="w-5 h-5" />
            New Course
          </button>
        </div>

        {/* Stats Grid (Placeholder for now) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
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
             <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
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
             <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
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
            <Code2 className="w-5 h-5 text-brand-400" />
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
                    onClick={() => navigate(`/course/${course.persona.toLowerCase()}-${course.id}`)} // Assuming ID mapping, need to fix CoursePage to fetch by ID or handle this
                    className="group bg-slate-900/50 hover:bg-slate-800/50 border border-slate-800 hover:border-brand-500/50 rounded-2xl p-6 transition-all cursor-pointer relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="w-5 h-5 text-brand-400 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                  </div>
                  
                  <div className="mb-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-500/10 text-brand-400 border border-brand-500/20 capitalize">
                      {course.persona} Path
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{course.goals}</h3>
                  <p className="text-slate-400 text-sm mb-6 line-clamp-2">
                    Custom curriculum generated on {formatDate(course.createdAt)}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-800">
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
            <div className="text-center py-20 bg-slate-900/30 border border-slate-800 border-dashed rounded-2xl flex flex-col items-center">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                  <Code2 className="w-8 h-8 text-slate-500" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No courses yet</h3>
              <p className="text-slate-400 mb-6 max-w-sm mx-auto">Start your first learning journey by creating a new course plan.</p>
              <button
                onClick={() => navigate('/onboarding')}
                className="bg-brand-600 hover:bg-brand-500 text-white px-6 py-2.5 rounded-xl font-medium transition-all"
              >
                Create First Course
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};
