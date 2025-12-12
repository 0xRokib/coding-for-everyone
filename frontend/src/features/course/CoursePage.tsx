import { BookOpen, Play } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface Course {
  id: number;
  goals: string;
  persona: string;
  curriculum: any;
  createdAt: string;
}

export const CoursePage: React.FC = () => {
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
  const { token, user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourse();
  }, [courseId, token]);

  const loadCourse = async () => {
    try {
      if (!token) return;
      
      // Fetch all courses to find the right one (or fetch specific endpoint if available)
      // For now, re-using /api/courses as we don't have get-one endpoint yet
      const response = await fetch(`http://localhost:8081/api/courses`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const found = data.find((c: any) => c.id === Number(courseId));
      setCourse(found || null);
      
    } catch (error: any) {
      console.error('Failed to load course:', error);
    } finally {
      setLoading(false);
    }
  };

  const startLearning = () => {
    if (course) {
      navigate(`/studio/${course.id}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!course) {
    return (
       <div className="flex flex-col items-center justify-center h-full text-center p-8">
          <BookOpen className="w-16 h-16 text-slate-700 mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Course not found</h2>
          <p className="text-slate-400 mb-6">The course you are looking for does not exist or has been removed.</p>
          <button onClick={() => navigate('/onboarding')} className="px-6 py-3 bg-brand-600 rounded-xl text-white font-medium hover:bg-brand-500">
             Create New Course
          </button>
       </div>
    );
  }

  let curriculum;
  try {
    curriculum = typeof course.curriculum === 'string' 
      ? JSON.parse(course.curriculum) 
      : course.curriculum;
  } catch (e) {
    curriculum = null;
  }
  
  const title = curriculum?.title || course.goals;

  return (
    <div className="relative flex-1 flex flex-col items-center justify-center p-8 h-full">
        
        {/* Course Header Content */}
          <div className="max-w-4xl w-full text-center">
            {/* Header Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-brand-500/10 via-purple-500/10 to-emerald-500/10 backdrop-blur-xl border border-white/10 text-sm font-bold mb-8">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-emerald-400 uppercase tracking-widest text-xs">Active Course</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl font-black text-white mb-8 leading-tight">
              {title}
            </h1>

            <div className="flex flex-col items-center gap-6 mb-12">
               <span className="px-4 py-1 rounded-full border border-slate-700 bg-slate-800/50 text-slate-400 text-sm capitalize">
                  Target Persona: {course.persona}
               </span>
               <p className="text-xl text-slate-400 max-w-2xl">
                 Continue your mastery of this subject. Dive back into the studio to write code and execute AI-driven lessons.
               </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
               <button 
                  onClick={startLearning}
                  className="group relative px-8 py-5 bg-gradient-to-r from-brand-600 via-purple-600 to-emerald-600 hover:from-brand-500 hover:to-emerald-500 text-white font-bold text-lg rounded-2xl transition-all shadow-2xl shadow-brand-500/20 hover:shadow-brand-500/40 hover:scale-105 flex items-center gap-4"
                >
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-colors">
                     <Play className="w-5 h-5 fill-current" />
                  </div>
                  <span>Resume Learning</span>
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-white/20 group-hover:ring-white/40 transition-all"></div>
                </button>

                <button 
                   onClick={() => navigate('/dashboard')}
                   className="px-8 py-5 bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-white font-semibold text-lg rounded-2xl border border-slate-700/50 hover:border-slate-600 transition-all"
                >
                   View Progress
                </button>
            </div>

            {/* Footer Stats / Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 border-t border-slate-800 pt-10">
                <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/50">
                    <div className="text-3xl font-bold text-white mb-1">0%</div>
                    <div className="text-sm text-slate-500 uppercase tracking-wider font-semibold">Completion</div>
                </div>
                <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/50">
                    <div className="text-3xl font-bold text-white mb-1">Beginner</div>
                    <div className="text-sm text-slate-500 uppercase tracking-wider font-semibold">Level</div>
                </div>
                <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/50">
                    <div className="text-3xl font-bold text-white mb-1">AI</div>
                    <div className="text-sm text-slate-500 uppercase tracking-wider font-semibold">Instructor</div>
                </div>
            </div>

          </div>
    </div>
  );
};
