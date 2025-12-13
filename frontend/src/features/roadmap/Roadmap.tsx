import { ArrowRight, Brain, CheckCircle2, Database, Globe, Layout, Lock, Play, Server, Sparkles, Terminal, Trophy, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { RoadmapData, roadmapService } from '../../services/roadmap.service';

const PUBLIC_ROADMAPS = [
    { 
        id: 'frontend', 
        title: 'Frontend Developer', 
        icon: Layout, 
        desc: 'Master HTML, CSS, React & Modern UI to build stunning web interfaces.', 
        color: 'text-brand-400', 
        gradient: 'from-brand-500/20 to-brand-600/5',
        border: 'group-hover:border-brand-500/50', 
        tags: ['Popular', 'Career Path'],
        level: 'Beginner Friendly',
        duration: '6 Months'
    },
    { 
        id: 'backend', 
        title: 'Backend Developer', 
        icon: Server, 
        desc: 'Build robust APIs, handle databases, and architect scalable server systems.', 
        color: 'text-purple-400', 
        gradient: 'from-purple-500/20 to-purple-600/5',
        border: 'group-hover:border-purple-500/50',
        tags: ['High Demand'],
        level: 'Intermediate',
        duration: '8 Months'
    },
    { 
        id: 'fullstack', 
        title: 'Full Stack', 
        icon: Globe, 
        desc: 'The complete package. Build entire web applications from front to back.', 
        color: 'text-emerald-400', 
        gradient: 'from-emerald-500/20 to-emerald-600/5',
        border: 'group-hover:border-emerald-500/50',
        tags: ['Best Value', 'Comprehensive'],
        level: 'Advanced',
        duration: '12 Months'
    },
    { 
        id: 'ai-engineer', 
        title: 'AI Engineer', 
        icon: Brain, 
        desc: 'Train models, build LLM interfaces, and create the next generation of AI agents.', 
        color: 'text-rose-400', 
        gradient: 'from-rose-500/20 to-rose-600/5',
        border: 'group-hover:border-rose-500/50',
        tags: ['Trending', 'Future Tech'],
        level: 'Advanced',
        duration: '10 Months'
    },
    { 
        id: 'devops', 
        title: 'DevOps & Cloud', 
        icon: Terminal, 
        desc: 'Master CI/CD, Docker, Kubernetes, and cloud infrastructure on AWS/GCP.', 
        color: 'text-orange-400', 
        gradient: 'from-orange-500/20 to-orange-600/5',
        border: 'group-hover:border-orange-500/50',
        tags: ['Infrastructure'],
        level: 'Intermediate',
        duration: '6 Months'
    },
    { 
        id: 'data-science', 
        title: 'Data Scientist', 
        icon: Database, 
        desc: 'Analyze complex data, build predictive models, and drive decision making.', 
        color: 'text-blue-400', 
        gradient: 'from-blue-500/20 to-blue-600/5',
        border: 'group-hover:border-blue-500/50',
        tags: ['Analytics'],
        level: 'Intermediate',
        duration: '8 Months'
    },
];

export const Roadmap = () => {
    const { token, user } = useAuth();
    const navigate = useNavigate();
    const [data, setData] = useState<RoadmapData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
      if (token) {
          // If we have a token, we SHOULD fetch user's active roadmap.
          // However, if the user hasn't generated one, the backend might return 404 or empty.
          // We need to handle that gracefully to show the catalog.
          roadmapService.getRoadmap(token)
              .then(response => {
                  if (response && response.found) {
                      setData(response);
                  } else {
                      // Valid token but no roadmap found -> Show Catalog
                      setData(null);
                  }
              })
              .catch((err) => {
                  console.error("Failed to fetch roadmap", err);
                  // On error (e.g. 404 if not found), show catalog
                  setData(null);
              })
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
  
    // --- PUBLIC CATALOG VIEW (Show if no user OR (user has no active plan)) ---
    if (!data?.data) {
         return (
            <div className="flex-1 min-h-screen bg-slate-950 relative overflow-hidden flex flex-col items-center py-24 px-4 sm:px-6">
                 {/* Ambient Background */}
                 <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-brand-500/10 rounded-full blur-[120px] animate-pulse pointer-events-none"></div>
  
                <div className="relative z-10 max-w-7xl w-full text-center">
                     <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/50 border border-slate-700/50 text-slate-300 text-sm font-medium mb-8 backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-700">
                         <span className="relative flex h-2 w-2">
                           <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                           <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
                         </span>
                         Career Tracks 2025
                     </div>
                     
                     <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-slate-400 mb-6 tracking-tight animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100">
                         Choose Your Legend
                     </h1>
                     <p className="text-slate-400 text-lg md:text-xl mb-20 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
                         Select a professional career path to start your journey. Each roadmap is crafted by industry experts and tailored to modern market standards.
                     </p>
  
                     {/* Roadmap Grid */}
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 text-left">
                         {PUBLIC_ROADMAPS.map((map) => (
                             <button 
                                  key={map.id}
                                  onClick={() => navigate(`/roadmap/view/${map.id}`)}
                                  className={`group relative flex flex-col h-full bg-slate-900/40 backdrop-blur-sm border border-slate-800 rounded-3xl p-1 overflow-hidden transition-all duration-300 hover:border-slate-700 hover:shadow-2xl hover:shadow-brand-500/10 hover:-translate-y-1 ${map.border}`}
                             >
                                 <div className={`absolute inset-0 bg-gradient-to-br ${map.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                                 
                                 <div className="relative z-10 flex flex-col h-full bg-slate-950/50 rounded-[20px] p-6 lg:p-8">
                                    {/* Header: Icon & Tags */}
                                    <div className="flex items-start justify-between mb-6">
                                        <div className={`p-3.5 rounded-2xl bg-slate-900 border border-slate-800 group-hover:scale-110 transition-transform duration-300 shadow-lg ${map.color}`}>
                                            <map.icon className="w-8 h-8" strokeWidth={1.5} />
                                        </div>
                                        <div className="flexflex-col items-end gap-2">
                                            {map.tags.map(tag => (
                                                <span key={tag} className="px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
  
                                    {/* Content */}
                                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-brand-100 transition-colors">{map.title}</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed mb-8 flex-1">{map.desc}</p>
  
                                    {/* Footer: Metadata & Action */}
                                    <div className="pt-6 border-t border-slate-800/50 flex items-center justify-between mt-auto">
                                        <div className="text-xs font-medium text-slate-500 flex flex-col gap-1">
                                            <span className="flex items-center gap-1.5">
                                                <Trophy className="w-3.5 h-3.5 text-slate-600" />
                                                {map.level}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <CheckCircle2 className="w-3.5 h-3.5 text-slate-600" />
                                                {map.duration}
                                            </span>
                                        </div>
                                        
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-slate-800 group-hover:bg-brand-600 group-hover:text-white transition-all duration-300 ${map.color} group-hover:text-white`}>
                                            <ArrowRight className="w-5 h-5 -ml-0.5 group-hover:translate-x-0.5 transition-transform" />
                                        </div>
                                    </div>
                                 </div>
                             </button>
                         ))}
                     </div>
                     
                     <div className="mt-24 max-w-4xl mx-auto p-1 rounded-3xl bg-gradient-to-r from-slate-800 via-brand-900/40 to-slate-800 relative overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500">
                         <div className="bg-slate-950/90 backdrop-blur-xl rounded-[20px] p-8 md:p-12 md:flex items-center justify-between gap-8 text-left relative overflow-hidden">
                             {/* Accents */}
                             <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 blur-[80px] rounded-full pointer-events-none"></div>
  
                             <div className="relative z-10">
                                 <h3 className="text-3xl font-bold text-white mb-3">Custom AI Learning Path</h3>
                                 <p className="text-slate-400 text-lg max-w-lg">Don't fit into a box? Tell our AI your exact goals, experience, and timeline. We'll architect a bespoke curriculum just for you.</p>
                             </div>
                             <button 
                               onClick={() => navigate('/roadmap-generator')}
                               className="mt-8 md:mt-0 relative z-10 px-8 py-4 bg-white text-slate-950 font-bold rounded-xl shadow-xl shadow-brand-900/20 hover:scale-105 hover:bg-brand-50 transition-all flex items-center gap-3 whitespace-nowrap group"
                             >
                                 <Sparkles className="w-5 h-5 text-brand-600" />
                                 <span>Generate With AI</span>
                                 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                             </button>
                         </div>
                     </div>
  
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
