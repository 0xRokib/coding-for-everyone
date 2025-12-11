import { ArrowLeft, ArrowRight, Check, Lightbulb, Rocket, Sparkles, Target, User, Zap } from 'lucide-react';
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserPersona } from '../../types';

interface OnboardingProps {
  onComplete: (profile: any) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [name, setName] = useState('');
  const [persona, setPersona] = useState<UserPersona | null>(null);
  const [goal, setGoal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuth();

  const personas = [
    {
      id: UserPersona.KID,
      title: 'Visual Learner',
      description: 'Fun, visual, and simple explanations with lots of examples.',
      icon: '🎨',
      gradient: 'from-pink-500 via-purple-500 to-violet-500',
      features: ['Interactive visuals', 'Step-by-step guides', 'Fun projects']
    },
    {
      id: UserPersona.PROFESSIONAL,
      title: 'Career Focused',
      description: 'Fast-track to professional skills and job-ready knowledge.',
      icon: '💼',
      gradient: 'from-blue-500 via-cyan-500 to-teal-500',
      features: ['Industry standards', 'Best practices', 'Portfolio projects']
    },
    {
      id: UserPersona.DOCTOR_ENGINEER,
      title: 'Project Builder',
      description: 'Learn by building real, useful tools and applications.',
      icon: '🚀',
      gradient: 'from-emerald-500 via-green-500 to-lime-500',
      features: ['Hands-on projects', 'Real-world apps', 'Problem solving']
    }
  ];

  const goalSuggestions = [
    '🎮 Build a game',
    '🌐 Create a website',
    '🤖 Learn AI/ML',
    '📱 Make a mobile app',
    '⚡ Automate tasks',
    '💾 Work with databases'
  ];

  const handleStart = async () => {
    if (!name || !persona || !goal) return;
    
    setIsLoading(true);
    
    try {
      const headers: any = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('http://localhost:8081/api/lesson-plan', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ persona, goals: goal })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate curriculum');
      }

      const curriculumContent = data.text;
      const curriculum = typeof curriculumContent === 'string' ? JSON.parse(curriculumContent) : curriculumContent;
      
      if (!curriculum || !curriculum.lessons) {
          throw new Error("Invalid curriculum format received from AI");
      }
      
      onComplete({
        name,
        persona,
        goals: goal,
        courseId: data.id,
        currentCurriculum: curriculum,
        progress: {
          completedLessons: [],
          currentLessonId: curriculum.lessons?.[0]?.id || '1',
          xp: 0
        }
      });
    } catch (error) {
      console.error('Failed to generate curriculum:', error);
      setIsLoading(false);
    }
  };

  const canProceed = () => {
    if (currentStep === 1) return name.trim().length > 0;
    if (currentStep === 2) return persona !== null;
    if (currentStep === 3) return goal.trim().length > 10;
    return false;
  };

  const nextStep = () => {
    if (canProceed() && currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-4xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div className={`relative flex items-center justify-center w-12 h-12 rounded-full border-4 transition-all duration-500 ${
                  currentStep >= step 
                    ? 'border-brand-500 bg-brand-500 shadow-lg shadow-brand-500/50' 
                    : 'border-slate-700 bg-slate-800'
                }`}>
                  {currentStep > step ? (
                    <Check className="w-6 h-6 text-white" />
                  ) : (
                    <span className={`text-lg font-bold ${currentStep >= step ? 'text-white' : 'text-slate-500'}`}>
                      {step}
                    </span>
                  )}
                </div>
                {step < 3 && (
                  <div className={`flex-1 h-1 mx-2 rounded-full transition-all duration-500 ${
                    currentStep > step ? 'bg-brand-500' : 'bg-slate-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm">
            <span className={`transition-colors ${currentStep >= 1 ? 'text-brand-400 font-medium' : 'text-slate-500'}`}>
              Your Name
            </span>
            <span className={`transition-colors ${currentStep >= 2 ? 'text-brand-400 font-medium' : 'text-slate-500'}`}>
              Learning Style
            </span>
            <span className={`transition-colors ${currentStep >= 3 ? 'text-brand-400 font-medium' : 'text-slate-500'}`}>
              Your Goal
            </span>
          </div>
        </div>

        {/* Main Card */}
        <div className="relative">
          {/* Background Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-brand-500/20 via-purple-500/20 to-emerald-500/20 rounded-3xl blur-3xl opacity-30"></div>
          
          <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-8 md:p-12 shadow-2xl min-h-[500px] flex flex-col">
            
            {/* Step 1: Name */}
            {currentStep === 1 && (
              <div className="flex-1 flex flex-col animate-fadeIn">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500/20 to-brand-600/20 mb-6">
                    <User className="w-10 h-10 text-brand-400" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
                    Welcome! What's your name?
                  </h2>
                  <p className="text-slate-400 text-lg">
                    Let's make this personal. We'll use your name throughout your learning journey.
                  </p>
                </div>

                <div className="flex-1 flex items-center justify-center">
                  <div className="w-full max-w-md">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && canProceed() && nextStep()}
                      placeholder="Enter your name..."
                      className="w-full bg-slate-950/50 border-2 border-slate-700 rounded-2xl px-6 py-5 text-xl text-white placeholder:text-slate-500 focus:ring-4 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
                      autoFocus
                    />
                    <p className="text-sm text-slate-500 mt-3 text-center">
                      Press Enter or click Next to continue
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Persona */}
            {currentStep === 2 && (
              <div className="flex-1 flex flex-col animate-fadeIn">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 mb-6">
                    <Target className="w-10 h-10 text-purple-400" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
                    How do you learn best, {name}?
                  </h2>
                  <p className="text-slate-400 text-lg">
                    Choose the learning style that matches your goals and preferences.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                  {personas.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setPersona(p.id)}
                      className={`group relative p-6 rounded-2xl border-2 transition-all text-left ${
                        persona === p.id
                          ? 'border-brand-500 bg-brand-500/10 shadow-xl shadow-brand-500/20 scale-105'
                          : 'border-slate-700/50 bg-slate-800/30 hover:border-slate-600 hover:bg-slate-800/50 hover:scale-102'
                      }`}
                    >
                      {/* Gradient Glow */}
                      {persona === p.id && (
                        <div className={`absolute inset-0 bg-gradient-to-br ${p.gradient} opacity-10 rounded-2xl`}></div>
                      )}
                      
                      <div className="relative">
                        <div className={`text-5xl mb-4 transition-transform ${persona === p.id ? 'scale-110' : 'group-hover:scale-105'}`}>
                          {p.icon}
                        </div>
                        <h3 className="font-bold text-xl text-white mb-2">{p.title}</h3>
                        <p className="text-sm text-slate-400 mb-4">{p.description}</p>
                        
                        {/* Features */}
                        <div className="space-y-2">
                          {p.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs text-slate-500">
                              <div className={`w-1.5 h-1.5 rounded-full ${persona === p.id ? 'bg-brand-400' : 'bg-slate-600'}`}></div>
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>

                        {/* Check Mark */}
                        {persona === p.id && (
                          <div className="absolute top-2 right-2">
                            <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center shadow-lg">
                              <Check className="w-5 h-5 text-white" />
                            </div>
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Goal */}
            {currentStep === 3 && (
              <div className="flex-1 flex flex-col animate-fadeIn">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 mb-6">
                    <Lightbulb className="w-10 h-10 text-emerald-400" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
                    What do you want to create?
                  </h2>
                  <p className="text-slate-400 text-lg">
                    Tell us your dream project. The more specific, the better we can help!
                  </p>
                </div>

                <div className="flex-1">
                  <textarea
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder="E.g., I want to build a mobile app that helps people track their fitness goals..."
                    rows={6}
                    className="w-full bg-slate-950/50 border-2 border-slate-700 rounded-2xl px-6 py-5 text-lg text-white placeholder:text-slate-500 focus:ring-4 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all resize-none"
                    autoFocus
                  />
                  
                  {/* Suggestions */}
                  <div className="mt-4">
                    <p className="text-sm text-slate-400 mb-3">Quick ideas:</p>
                    <div className="flex flex-wrap gap-2">
                      {goalSuggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => setGoal(suggestion.substring(2))}
                          className="px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 hover:border-brand-500/50 rounded-xl text-sm text-slate-300 hover:text-brand-300 transition-all"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-brand-500/5 border border-brand-500/20 rounded-xl">
                    <div className="flex items-start gap-3">
                      <Zap className="w-5 h-5 text-brand-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-slate-300">
                        <span className="font-semibold text-brand-400">Pro tip:</span> Be specific! Instead of "learn Python", try "build a web scraper to track product prices" for a more tailored curriculum.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-700/50">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all disabled:opacity-0 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back</span>
              </button>

              {currentStep < 3 ? (
                <button
                  onClick={nextStep}
                  disabled={!canProceed()}
                  className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-500/30 hover:shadow-xl hover:shadow-brand-500/40 hover:scale-105"
                >
                  <span>Next Step</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              ) : (
                <button
                  onClick={handleStart}
                  disabled={!canProceed() || isLoading}
                  className="group relative overflow-hidden flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-brand-600 via-purple-600 to-emerald-600 hover:from-brand-500 hover:via-purple-500 hover:to-emerald-500 text-white font-black rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl shadow-brand-500/40 hover:scale-105"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Crafting Your Journey...</span>
                    </>
                  ) : (
                    <>
                      <Rocket className="w-6 h-6 group-hover:translate-y-[-2px] transition-transform" />
                      <span>Start Learning!</span>
                      <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                    </>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 flex items-center justify-center gap-8 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <span>AI-Powered</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
            <span>100% Free</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></div>
            <span>Personalized</span>
          </div>
        </div>
      </div>
    </div>
  );
};
