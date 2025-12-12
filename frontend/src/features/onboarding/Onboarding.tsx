import { ArrowRight, Brain, Code2, Rocket, Sparkles, Trophy } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { courseService } from '../../services/course.service';

interface OnboardingProps {
  onComplete?: () => void;
}

const LoadingOverlay = ({ status }: { status: string }) => (
  <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-md transition-all duration-500">
    <div className="relative">
      <div className="w-24 h-24 bg-brand-500/20 rounded-full animate-pulse absolute inset-0 blur-xl"></div>
      <div className="relative bg-slate-900 border border-slate-700/50 p-6 rounded-2xl shadow-2xl flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-brand-500/30 border-t-brand-500 rounded-full animate-spin"></div>
        <div className="text-center">
          <h3 className="text-xl font-bold text-white mb-1">Creating Course</h3>
          <p className="text-slate-400 text-sm animate-pulse">{status}</p>
        </div>
      </div>
    </div>
  </div>
);

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('');
  const [goalInput, setGoalInput] = useState('');

  const handleCreateCourse = async (goal: string) => {
    if (!goal.trim() || !token) return;
    
    setLoading(true);
    setLoadingStatus('Analyzing your request...');
    
    const statusInterval = setInterval(() => {
      setLoadingStatus(prev => {
        if (prev === 'Analyzing your request...') return 'Designing curriculum...';
        if (prev === 'Designing curriculum...') return 'Generating modules...';
        if (prev === 'Generating modules...') return 'Finalizing course...';
        return prev;
      });
    }, 2000);

    try {
      const newCourse = await courseService.createCourse(
        {
          persona: 'professional',
          goals: goal
        },
        token
      );
      
      setLoadingStatus('Redirecting to studio...');
      // Force a slight delay to ensure redirect feels smooth
      setTimeout(() => {
        clearInterval(statusInterval);
        navigate(`/studio/${newCourse.id}`);
      }, 500);
      
    } catch (error) {
      console.error('Failed to create course:', error);
      alert('Failed to create course. Please try again.');
      setLoading(false);
      clearInterval(statusInterval);
    }
  };

  const suggestions = [
    { icon: Code2, label: "Web Development", goal: "I want to build a modern website with React", color: "from-blue-500 to-cyan-500" },
    { icon: Rocket, label: "Game Dev", goal: "I want to create a 2D game with Python", color: "from-purple-500 to-pink-500" },
    { icon: Brain, label: "Data Science", goal: "Teach me data analysis with Python", color: "from-emerald-500 to-teal-500" },
    { icon: Sparkles, label: "AI Apps", goal: "How to build AI applications", color: "from-orange-500 to-red-500" },
    { icon: Trophy, label: "DevOps", goal: "Master Docker and Kubernetes", color: "from-indigo-500 to-purple-500" },
  ];

  return (
    <div className="flex-1 relative flex flex-col items-center justify-center p-6 md:p-12 overflow-hidden h-full">
      {loading && <LoadingOverlay status={loadingStatus} />}

      {/* Main Content */}
        {/* Animated Background Effects */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-brand-500/5 rounded-full blur-[100px] animate-pulse"></div> */}
          {/* <div className="absolute bottom-[20%] right-[20%] w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px] animate-pulse" style={{animationDelay: '1.5s'}}></div> */}
          {/* Grid Pattern is provided by layout now, but we can add specific glows here */}
        </div>
        
        <div className="max-w-4xl w-full z-10 relative">
           {/* Center Logo/Icon */}
           <div className="flex justify-center mb-10">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-brand-500 to-purple-500 rounded-3xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative w-20 h-20 bg-slate-900 rounded-2xl flex items-center justify-center border border-slate-700/50 shadow-2xl">
                   <Brain className="w-10 h-10 text-brand-400" />
                </div>
              </div>
           </div>

           <h1 className="text-5xl md:text-6xl font-black text-center text-white mb-6 tracking-tight leading-tight">
             What would you like to <br/>
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-purple-400 to-emerald-400 animate-gradient-x">learn today?</span>
           </h1>
           
           <p className="text-slate-400 text-center text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
             Enter any topic and our advanced AI will design a <span className="text-brand-200 font-medium">personalized curriculum</span> just for you in seconds.
           </p>

           {/* Large Search Input */}
           <div className="relative group max-w-2xl mx-auto mb-16 transform transition-all duration-300 focus-within:scale-[1.02]">
             <div className="absolute -inset-1 bg-gradient-to-r from-brand-500 via-purple-500 to-emerald-500 rounded-3xl opacity-30 group-hover:opacity-70 blur-xl transition duration-500 animate-tilt"></div>
             <div className="relative flex items-center bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-2 shadow-2xl ring-1 ring-white/10">
                <input
                  id="course-input"
                  type="text"
                  value={goalInput}
                  onChange={(e) => setGoalInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !loading && handleCreateCourse(goalInput)}
                  placeholder="I want to learn how to build AI agents..."
                  className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-slate-500 px-6 py-5 text-lg font-medium"
                  autoComplete="off"
                  disabled={loading}
                  autoFocus
                />
                <button
                  onClick={() => handleCreateCourse(goalInput)}
                  disabled={loading || !goalInput.trim()}
                  className="p-4 bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white rounded-xl transition-all shadow-lg hover:shadow-brand-500/25 disabled:opacity-50 disabled:cursor-not-allowed group/btn relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <ArrowRight className="w-6 h-6 relative z-10" />
                  )}
                </button>
             </div>
           </div>

           {/* Suggestion Pills */}
           <div className="relative">
             <div className="text-center mb-6">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Popular Suggestions</p>
             </div>
             <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
                {suggestions.map((suggestion, idx) => {
                  const Icon = suggestion.icon;
                  return (
                    <button
                      key={idx}
                      disabled={loading}
                      onClick={() => {
                          setGoalInput(suggestion.goal);
                          handleCreateCourse(suggestion.goal);
                      }}
                      className="group flex items-center gap-3 px-5 py-3 bg-slate-800/40 hover:bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 hover:border-brand-500/50 rounded-2xl transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-500/10"
                    >
                      <div className={`p-1.5 rounded-lg bg-slate-800 group-hover:bg-white/10 transition-colors`}>
                        <Icon className={`w-4 h-4 text-slate-400 group-hover:text-brand-400 transition-colors`} />
                      </div>
                      <span className="text-sm font-medium text-slate-300 group-hover:text-white">{suggestion.label}</span>
                    </button>
                  );
                })}
             </div>
           </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-6 left-0 right-0 text-center">
            <p className="text-xs text-slate-600 font-medium">
               Powered by Code Anyone • v1.0.0
            </p>
        </div>
    </div>
  );
};
