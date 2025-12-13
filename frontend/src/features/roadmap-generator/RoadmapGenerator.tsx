import { ArrowRight, Brain, Check, Code2, Cpu, Globe, GraduationCap, Layout, Lightbulb, Server, Sparkles, Target, Zap } from 'lucide-react';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { roadmapService } from '../../services/roadmap.service';

type Step = 'role' | 'goal' | 'experience' | 'refine' | 'generating' | 'complete';

const ROLES = [
  { id: 'frontend', title: 'Frontend Developer', icon: Layout, color: 'text-brand-400', bg: 'bg-brand-500/10', border: 'border-brand-500/20' },
  { id: 'backend', title: 'Backend Developer', icon:  Cpu, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
  { id: 'fullstack', title: 'Full Stack Developer', icon: Globe, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  { id: 'ai-engineer', title: 'AI Engineer', icon: Brain, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
  { id: 'devops', title: 'DevOps Engineer', icon: Server, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
];

const EXPERIENCE_LEVELS = [
  { id: 'beginner', title: 'Absolute Beginner', description: 'No coating experience yet', icon: Lightbulb },
  { id: 'intermediate', title: 'Some Experience', description: 'Built a few small projects', icon: Code2 },
  { id: 'advanced', title: 'Experienced', description: 'Looking to master advanced concepts', icon: GraduationCap },
];

const GOALS = [
  { id: 'job', title: 'Get Hired', icon: Target },
  { id: 'freelance', title: 'Freelance', icon: Zap },
  { id: 'hobby', title: 'Just for Fun', icon: Sparkles },
];

export const RoadmapGenerator = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    
    // Check for passed state (e.g. from Roadmap catalog click)
    const initialRole = location.state?.role || '';
    
    const [step, setStep] = useState<Step>(initialRole ? 'experience' : 'role');
    const [selections, setSelections] = useState({
        role: initialRole,
        experience: '',
        goal: '',
        other: ''
    });

    const [generatedId, setGeneratedId] = useState<number | null>(null);

    const handleGenerate = async () => {
        if (!token) {
            navigate('/login');
            return;
        }

        setStep('generating');
        
        // Update selection with goal first as it's the last step
        // But state update helps, actually we can pass directly
        const finalSelections = { ...selections, goal: selections.goal || 'job' }; // fallback

        try {
            const result = await roadmapService.generateCustomRoadmap(token, finalSelections);
             if (result.success && result.plan_id) {
                 setGeneratedId(result.plan_id);
                 setStep('complete');
             } else {
                 alert("Failed to generate roadmap. Please try again.");
                 setStep('role');
             }
        } catch (error) {
             console.error(error);
             alert("Something went wrong with AI generation.");
             setStep('role');
        }
    };

    const renderRoles = () => (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center">
                <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Choose Your Path</h2>
                <p className="text-slate-400 text-lg">What do you want to become?</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                {ROLES.map((role) => (
                    <button
                        key={role.id}
                        onClick={() => {
                            setSelections({ ...selections, role: role.id });
                            setStep('experience');
                        }}
                        className={`group relative p-6 rounded-2xl border transition-all duration-300 text-left hover:scale-[1.02] ${role.bg} ${role.border} hover:border-white/20`}
                    >
                         <div className="flex items-center gap-4">
                             <div className={`w-12 h-12 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center ${role.color}`}>
                                 <role.icon className="w-6 h-6" />
                             </div>
                             <div>
                                 <h3 className="text-xl font-bold text-white group-hover:text-brand-300 transition-colors">{role.title}</h3>
                             </div>
                             <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                 <ArrowRight className="w-5 h-5 text-slate-400" />
                             </div>
                         </div>
                    </button>
                ))}
            </div>
        </div>
    );

    const renderExperience = () => (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="text-center">
                <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Your Experience</h2>
                <p className="text-slate-400 text-lg">How much coding have you done before?</p>
            </div>

            <div className="grid grid-cols-1 gap-4 max-w-xl mx-auto">
                {EXPERIENCE_LEVELS.map((level) => (
                    <button
                        key={level.id}
                        onClick={() => {
                            setSelections({ ...selections, experience: level.id });
                            setStep('refine');
                        }}
                        className="group p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-brand-500/50 hover:bg-slate-900 transition-all text-left flex items-center gap-6"
                    >
                        <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-brand-500/20 group-hover:text-brand-400 transition-colors">
                            <level.icon className="w-6 h-6 text-slate-400 group-hover:text-brand-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white mb-1">{level.title}</h3>
                            <p className="text-slate-400 text-sm">{level.description}</p>
                        </div>
                    </button>
                ))}
            </div>
            
             <button onClick={() => setStep('role')} className="mx-auto block text-slate-500 hover:text-white text-sm mt-8">Back</button>
        </div>
    );

    const renderRefine = () => {
        const QUICK_TAGS = [
            "🕒 1 hour/day", "📅 Weekends only", "🐍 Python preferred", 
            "🎨 Visual Learner", "💼 Career switch", "🚀 Fast paced",
            "⚛️ React focus", "🏗️ Backend heavy", "📱 Mobile interested"
        ];

        const addTag = (tag: string) => {
            const rawTag = tag.substring(2).trim(); // Remove emoji for cleaner text if needed, or keep it. Let's keep full for now or strip.
            // Actually, keeping the emoji might be cute, but let's strip it for the prompt context to be safer for AI? 
            // Nah, AI understands emojis. Let's keep it simple.
            
            if (!selections.other.includes(tag)) {
                setSelections(prev => ({
                    ...prev,
                    other: prev.other ? `${prev.other}, ${tag}` : tag
                }));
            }
        };

        return (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto w-full">
               <div className="text-center">
                   <div className="inline-flex w-12 h-12 bg-indigo-500/20 rounded-full items-center justify-center mb-4 ring-1 ring-indigo-500/40 shadow-lg shadow-indigo-500/20">
                       <Sparkles className="w-6 h-6 text-indigo-400" />
                   </div>
                   <h2 className="text-3xl md:text-4xl font-black text-white mb-2">Personalize Your AI Path</h2>
                   <p className="text-slate-400 text-lg">Tell us a bit more about your preferences, or pick some quick priorities.</p>
               </div>
               
               <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl shadow-indigo-500/10 ring-1 ring-white/5 focus-within:ring-brand-500/50 focus-within:border-brand-500/50 transition-all group">
                   
                   {/* Quick Tags Header */}
                   <div className="bg-slate-950/30 px-4 py-3 border-b border-white/5 flex gap-2 overflow-x-auto no-scrollbar">
                        {QUICK_TAGS.map(tag => (
                            <button 
                                key={tag}
                                onClick={() => addTag(tag)}
                                className="whitespace-nowrap px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700 text-slate-300 text-xs font-medium hover:bg-brand-500/20 hover:text-white hover:border-brand-500/30 transition-all flex items-center gap-1.5 active:scale-95"
                            >
                                {tag}
                                <span className="opacity-50 text-indigo-400">+</span>
                            </button>
                        ))}
                   </div>

                   <textarea 
                       className="w-full bg-transparent p-6 text-white text-lg placeholder:text-slate-600 focus:outline-none min-h-[160px] resize-none leading-relaxed selection:bg-brand-500/30"
                       placeholder="e.g. I want to build a portfolio website, I learn best by doing projects, I have a background in design..."
                       value={selections.other}
                       onChange={(e) => setSelections({...selections, other: e.target.value})}
                       autoFocus
                   />
                   
                   <div className="px-4 py-3 bg-slate-950/30 border-t border-white/5 flex justify-between items-center text-xs text-slate-500 group-focus-within:text-brand-400/80 transition-colors">
                       <span className="flex items-center gap-2">
                           <Brain className="w-3 h-3" />
                           AI Optimization Active
                       </span>
                       <span className="font-mono">{selections.other.length} chars</span>
                   </div>
               </div>

               <div className="flex gap-4 justify-center pt-4">
                   <button onClick={() => setStep('experience')} className="px-6 py-3 text-slate-400 hover:text-white transition-colors text-sm font-medium hover:bg-white/5 rounded-lg">Back</button>
                   <button 
                      onClick={() => setStep('goal')}
                      className="px-8 py-3 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-brand-500/25 transition-all hover:scale-105 flex items-center gap-2 border border-brand-400/20"
                   >
                       Continue
                       <ArrowRight className="w-4 h-4" />
                   </button>
               </div>
           </div>
        );
    };

    const renderGoal = () => (
         <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="text-center">
                <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Your Goal</h2>
                <p className="text-slate-400 text-lg">Why do you want to learn?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                 {GOALS.map((goal) => (
                    <button
                        key={goal.id}
                        onClick={() => {
                            setSelections({ ...selections, goal: goal.id });
                            handleGenerate();
                        }}
                         className="group p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-brand-500/50 hover:bg-slate-900 transition-all flex flex-col items-center justify-center text-center gap-4 hover:-translate-y-1"
                    >
                         <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-brand-500/20 group-hover:text-brand-400 transition-colors">
                            <goal.icon className="w-8 h-8 text-slate-400 group-hover:text-brand-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white">{goal.title}</h3>
                    </button>
                 ))}
            </div>
             <button onClick={() => setStep('refine')} className="mx-auto block text-slate-500 hover:text-white text-sm mt-8">Back</button>
        </div>
    );

    const renderGenerating = () => (
        <div className="flex flex-col items-center justify-center text-center py-20 px-4 animate-in fade-in duration-700">
            <div className="relative w-24 h-24 mb-8">
                 <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
                 <div className="absolute inset-0 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                 <Brain className="absolute inset-0 m-auto w-10 h-10 text-brand-500 animate-pulse" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">AI is Crafting Your Roadmap...</h2>
            <div className="h-6 overflow-hidden">
                <div className="animate-slide-up text-slate-400 space-y-2">
                    <p>Analyzing market trends...</p>
                    <p>Curating best resources...</p>
                    <p>Building project ideas...</p>
                    <p>Finalizing your path...</p>
                </div>
            </div>
        </div>
    );

    const renderComplete = () => (
         <div className="flex flex-col items-center justify-center text-center py-20 px-4 animate-in zoom-in duration-500">
             <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mb-8 ring-4 ring-emerald-500/10">
                 <Check className="w-12 h-12 text-emerald-500" />
             </div>
             <h2 className="text-4xl font-black text-white mb-4">Roadmap Ready!</h2>
             <p className="text-slate-400 text-lg max-w-md mx-auto mb-10">
                 We've generated a personalized step-by-step plan for you to become a <span className="text-brand-400 font-bold">{ROLES.find(r => r.id === selections.role)?.title}</span>.
             </p>
             <button 
                onClick={() => navigate(`/roadmap/view/${generatedId}`)} 
                className="px-8 py-4 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl shadow-xl shadow-brand-500/20 hover:scale-105 transition-all flex items-center gap-2"
            >
                View My Roadmap
                <ArrowRight className="w-5 h-5" />
            </button>
         </div>
    );
    
    return (
        <div className="min-h-[calc(100vh-80px)] bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden py-20 px-4">
             {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 opacity-80" />
                 <div className="absolute top-[-20%] right-[20%] w-[500px] h-[500px] bg-brand-500/20 rounded-full blur-[120px] animate-pulse" />
                 <div className="absolute bottom-[-20%] left-[20%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] animate-pulse delay-700" />
            </div>

            <div className="relative z-10 w-full max-w-5xl">
                {step === 'role' && renderRoles()}
                {step === 'experience' && renderExperience()}
                {step === 'refine' && renderRefine()}
                {step === 'goal' && renderGoal()}
                {step === 'generating' && renderGenerating()}
                {step === 'complete' && renderComplete()}
            </div>
        </div>
    );
};
