import { CheckCircle2, Lock, Play, Rocket } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { RoadmapData, roadmapService } from '../../services/roadmap.service';

export const Roadmap = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<RoadmapData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (token) {
        roadmapService.getRoadmap(token)
            .then(setData)
            .catch(console.error)
            .finally(() => setIsLoading(false));
    } else {
        setIsLoading(false);
    }
  }, [token]);

  const handleStartLesson = (courseId: number) => {
      navigate(`/course/${courseId}`);
  };

  const handleMarkComplete = async (index: number) => {
     if (!data?.data || !token) return;
     // Optimistic update
     const newData = { ...data };
     if (newData.data) {
         newData.data.current_index = index + 1;
         setData(newData);
         await roadmapService.updateProgress(token, newData.data.plan_id, index + 1);
     }
  };

  if (!user) {
      return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
              <h2 className="text-2xl font-bold text-white mb-4">Your Roadmap Awaits</h2>
              <button onClick={() => navigate('/login')} className="px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-xl">
                  Sign In to View
              </button>
          </div>
      );
  }

  if (isLoading) {
      return <div className="text-center py-20 text-slate-500">Loading your journey...</div>;
  }

  if (!data?.found || !data?.data) {
       return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
              <Rocket className="w-16 h-16 text-slate-700 mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">No Roadmap Yet</h2>
              <p className="text-slate-400 mb-6">You haven't generated a course yet.</p>
              <button 
                onClick={() => navigate('/onboarding')}
                className="px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-medium"
              >
                  Generate My Course
              </button>
          </div>
      );
  }

  const { content, current_index, plan_id } = data.data;
  const lessons = content.lessons || [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16 border-b border-slate-800 pb-10">
        <h1 className="text-4xl font-bold text-white mb-4">{content.title || "Your Learning Path"}</h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            {content.description || "Follow this path to master your goal."}
        </p>
      </div>

      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-[28px] top-0 bottom-0 w-0.5 bg-slate-800"></div>

        <div className="space-y-12">
          {lessons.map((lesson, index) => {
            const status = index < current_index ? 'completed' : index === current_index ? 'in-progress' : 'locked';
            
            return (
                <div key={index} className="relative flex gap-8 group">
                {/* Status Icon */}
                <div className={`relative z-10 w-14 h-14 rounded-full flex items-center justify-center border-4 bg-slate-900 transition-all ${
                    status === 'completed' ? 'border-emerald-500 text-emerald-500 shadow-lg shadow-emerald-500/20' :
                    status === 'in-progress' ? 'border-brand-500 text-brand-500 shadow-lg shadow-brand-500/20 animate-pulse' :
                    'border-slate-700 text-slate-700'
                }`}>
                    {status === 'completed' ? <CheckCircle2 className="w-6 h-6" /> :
                    status === 'locked' ? <Lock className="w-6 h-6" /> :
                    <Play className="w-6 h-6 fill-current" />}
                </div>

                {/* Content Card */}
                <div className={`flex-1 p-6 rounded-2xl border transition-all ${
                    status === 'locked' ? 'bg-slate-900/50 border-slate-800 opacity-70' :
                    'bg-slate-900 border-slate-700 hover:border-brand-500/50'
                }`}>
                    <div className="flex justify-between items-start mb-2">
                        <h3 className={`text-xl font-bold ${status === 'locked' ? 'text-slate-500' : 'text-white'}`}>
                            {lesson.title}
                        </h3>
                        {status === 'in-progress' && (
                            <span className="text-xs font-bold text-brand-400 bg-brand-500/10 px-3 py-1 rounded-full border border-brand-500/20">
                                CURRENT
                            </span>
                        )}
                    </div>
                    <p className="text-slate-400 mb-6 line-clamp-2">{lesson.content}</p>
                    
                    <div className="flex gap-3">
                         {status !== 'locked' && (
                             <button 
                                onClick={() => handleStartLesson(plan_id)}
                                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm rounded-lg transition-colors border border-slate-700"
                             >
                                 {status === 'completed' ? 'Review Lesson' : 'Start Lesson'}
                             </button>
                         )}
                         {status === 'in-progress' && (
                             <button
                                onClick={() => handleMarkComplete(index)}
                                className="px-4 py-2 border border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 text-sm rounded-lg transition-colors"
                             >
                                 Mark Complete
                             </button>
                         )}
                    </div>
                </div>
                </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
