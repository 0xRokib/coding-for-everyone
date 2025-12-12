import { CheckCircle2, Lock, Map as MapIcon, Play, Rocket, Trophy, Zap } from 'lucide-react';
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
          <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user || !data?.data) {
       return (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-950 relative overflow-hidden">
               {/* Ambient Background */}
               <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-[100px] animate-pulse"></div>

              <div className="relative z-10 max-w-md">
                   <div className="w-20 h-20 bg-gradient-to-br from-brand-500 to-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-brand-500/20 rotate-3">
                       <MapIcon className="w-10 h-10 text-white" />
                   </div>
                   <h2 className="text-4xl font-black text-white mb-4 tracking-tight">Your Journey Awaits</h2>
                   <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                       {user ? "You haven't generated a course roadmap yet. Start your first course to unlock your personalized path." : "Sign in to view your learning roadmap and track your progress."}
                   </p>
                   <button 
                     onClick={() => navigate(user ? '/onboarding' : '/login')}
                     className="px-8 py-4 bg-white text-slate-900 font-bold rounded-xl hover:scale-105 transition-transform flex items-center gap-2 mx-auto"
                   >
                       <Rocket className="w-5 h-5 text-brand-600" />
                       {user ? "Generate Roadmap" : "Sign In Now"}
                   </button>
              </div>
          </div>
      );
  }

  const { content, current_index, plan_id } = data.data;
  const lessons = content.lessons || [];

  return (
    <div className="flex-1 flex flex-col bg-slate-950 relative overflow-hidden h-full">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
           <div className="absolute top-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-purple-500/10 rounded-full blur-[120px]" />
           <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-emerald-500/10 rounded-full blur-[120px]" />
           <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 px-8 py-8 border-b border-slate-800/50 bg-slate-900/30 backdrop-blur-md">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                  <div className="flex items-center gap-3 mb-2">
                       <div className="px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                            <Zap className="w-3 h-3" />
                            Active Path
                       </div>
                       <div className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400 text-xs font-bold uppercase tracking-wider">
                           Level {Math.floor(current_index / 3) + 1}
                       </div>
                  </div>
                  <h1 className="text-3xl font-black text-white tracking-tight">{content.title || "Master Plan"}</h1>
              </div>
              
              <div className="flex items-center gap-4 bg-slate-900/50 p-2 rounded-xl border border-slate-800">
                   <div className="px-4 py-2">
                       <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Progress</div>
                       <div className="text-xl font-bold text-white max-w-[100px] truncate">{Math.round((current_index / lessons.length) * 100)}%</div>
                   </div>
                   <div className="h-10 w-[1px] bg-slate-800"></div>
                   <div className="px-4 py-2">
                       <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">XP Earned</div>
                       <div className="text-xl font-bold text-yellow-500">{current_index * 150}</div>
                   </div>
              </div>
          </div>
      </div>

      {/* Scrollable Timeline */}
      <div className="flex-1 overflow-y-auto custom-scrollbar relative p-8">
         <div className="max-w-4xl mx-auto relative pb-20">
            
            {/* Connecting Line (Snake) */}
            <div className="absolute left-[28px] md:left-1/2 top-4 bottom-0 w-1 bg-slate-800 md:-translate-x-1/2 rounded-full"></div>
            <div 
                className="absolute left-[28px] md:left-1/2 top-4 w-1 bg-gradient-to-b from-brand-500 via-purple-500 to-emerald-500 md:-translate-x-1/2 rounded-full transition-all duration-1000"
                style={{ height: `${(current_index / lessons.length) * 100}%` }}
            >
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.8)] animate-pulse"></div>
            </div>

            <div className="space-y-16 relative">
              {lessons.map((lesson, index) => {
                const status = index < current_index ? 'completed' : index === current_index ? 'in-progress' : 'locked';
                const isLeft = index % 2 === 0;

                return (
                    <div key={index} className={`relative flex flex-col md:flex-row items-center gap-8 ${isLeft ? 'md:flex-row-reverse' : ''}`}>
                        
                        {/* Content Side */}
                        <div className="flex-1 w-full md:w-auto pl-16 md:pl-0">
                             <div className={`group relative p-6 rounded-2xl border transition-all duration-300 ${
                                 status === 'in-progress' 
                                 ? 'bg-slate-900/80 border-brand-500/50 shadow-2xl shadow-brand-500/10 scale-105' 
                                 : status === 'completed'
                                 ? 'bg-slate-900/40 border-emerald-500/30 opacity-80 hover:opacity-100'
                                 : 'bg-slate-900/20 border-slate-800 opacity-50'
                             }`}>
                                 {status === 'in-progress' && (
                                     <div className="absolute -top-3 right-4 px-3 py-1 bg-brand-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg">
                                         Current Mission
                                     </div>
                                 )}

                                 <h3 className={`text-xl font-bold mb-2 ${status === 'locked' ? 'text-slate-500' : 'text-white'}`}>
                                     {lesson.title}
                                 </h3>
                                 <p className="text-sm text-slate-400 mb-4 line-clamp-2 leading-relaxed">
                                     {lesson.content}
                                 </p>

                                 <div className="flex items-center gap-3">
                                     {status !== 'locked' && (
                                         <button 
                                            onClick={() => handleStartLesson(plan_id)}
                                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                                                status === 'in-progress'
                                                ? 'bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-500/20'
                                                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                                            }`}
                                         >
                                             {status === 'completed' ? 'Replay' : 'Start Mission'}
                                         </button>
                                     )}
                                     {status === 'in-progress' && (
                                        <button 
                                            onClick={() => handleMarkComplete(index)}
                                            className="px-4 py-2 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 rounded-lg text-sm font-bold"
                                        >
                                            Complete
                                        </button>
                                     )}
                                 </div>
                             </div>
                        </div>

                        {/* Center Icon Node */}
                        <div className="absolute left-[4px] md:left-1/2 top-1/2 -translate-y-1/2 md:-translate-x-1/2 z-20">
                            <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center transition-all duration-500 relative ${
                                status === 'completed' ? 'bg-emerald-500 border-slate-900 shadow-[0_0_20px_rgba(16,185,129,0.5)]' :
                                status === 'in-progress' ? 'bg-brand-500 border-slate-900 shadow-[0_0_30px_rgba(99,102,241,0.6)] animate-pulse' :
                                'bg-slate-900 border-slate-700'
                            }`}>
                                {status === 'completed' ? <CheckCircle2 className="w-6 h-6 text-white" /> :
                                 status === 'in-progress' ? <Play className="w-6 h-6 text-white fill-current" /> :
                                 <Lock className="w-5 h-5 text-slate-600" />}
                                 
                                 {/* Connector Line (Mobile only visual aid) */}
                                 {index !== lessons.length - 1 && (
                                    <div className="absolute top-12 left-1/2 -translate-x-1/2 w-0.5 h-16 bg-slate-800 md:hidden"></div>
                                 )}
                            </div>
                        </div>

                        {/* Empty Side for Balance */}
                        <div className="flex-1 hidden md:block"></div>
                    </div>
                );
              })}

               {/* Finish Line */}
               <div className="flex justify-center pt-8 relative z-10">
                   <div className="p-8 rounded-full bg-slate-900 border-4 border-slate-800 flex items-center justify-center relative group cursor-pointer hover:border-yellow-500/50 transition-colors">
                        <div className="absolute inset-0 bg-yellow-500/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <Trophy className="w-12 h-12 text-slate-700 group-hover:text-yellow-500 transition-colors" />
                   </div>
               </div>

            </div>
         </div>
      </div>
    </div>
  );
};
