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
      subtitle: 'Interactive & Engaging',
      description: 'Learn through visual examples, interactive demos, and step-by-step guides.',
      icon: '🎨',
      gradient: 'from-pink-500 to-purple-600',
      bgGradient: 'from-pink-500/10 to-purple-600/10',
      features: ['Visual examples', 'Interactive demos', 'Guided tutorials']
    },
    {
      id: UserPersona.PROFESSIONAL,
      title: 'Career Focused',
      subtitle: 'Industry Ready',
      description: 'Master professional skills with industry best practices and real-world projects.',
      icon: '💼',
      gradient: 'from-blue-500 to-cyan-600',
      bgGradient: 'from-blue-500/10 to-cyan-600/10',
      features: ['Industry standards', 'Best practices', 'Portfolio projects']
    },
    {
      id: UserPersona.DOCTOR_ENGINEER,
      title: 'Project Builder',
      subtitle: 'Hands-On Learning',
      description: 'Build real applications and solve practical problems from day one.',
      icon: '🚀',
      gradient: 'from-emerald-500 to-teal-600',
      bgGradient: 'from-emerald-500/10 to-teal-600/10',
      features: ['Real projects', 'Practical skills', 'Problem solving']
    }
  ];

  const goalSuggestions = [
    { icon: '🎮', text: 'Build a game', category: 'Gaming' },
    { icon: '🌐', text: 'Create a website', category: 'Web' },
    { icon: '🤖', text: 'Learn AI/ML', category: 'AI' },
    { icon: '📱', text: 'Make a mobile app', category: 'Mobile' },
    { icon: '⚡', text: 'Automate tasks', category: 'Automation' },
    { icon: '💾', text: 'Work with databases', category: 'Data' }
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

  const progress = (currentStep / 3) * 100;

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 md:p-6 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="w-full max-w-5xl relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-brand-500/10 to-purple-500/10 border border-brand-500/20 text-brand-400 text-sm font-semibold mb-6 backdrop-blur-sm">
            <Sparkles className="w-4 h-4" />
            Personalized Learning Path
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tight">
            Let's Get Started
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Answer a few questions to create your perfect learning journey
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="relative h-2 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-brand-500 to-purple-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-4">
            {['Personal Info', 'Learning Style', 'Your Goals'].map((label, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  currentStep > idx + 1 
                    ? 'bg-brand-500 text-white' 
                    : currentStep === idx + 1
                    ? 'bg-brand-500 text-white ring-4 ring-brand-500/20'
                    : 'bg-slate-800 text-slate-500'
                }`}>
                  {currentStep > idx + 1 ? <Check className="w-4 h-4" /> : idx + 1}
                </div>
                <span className={`text-sm font-medium hidden md:block ${
                  currentStep >= idx + 1 ? 'text-white' : 'text-slate-500'
                }`}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-slate-800/50 backdrop-blur-2xl rounded-3xl border border-slate-700/50 shadow-2xl overflow-hidden">
          <div className="p-8 md:p-12 min-h-[550px] flex flex-col">
            
            {/* Step 1: Name */}
            {currentStep === 1 && (
              <div className="flex-1 flex flex-col justify-center animate-fadeIn">
                <div className="max-w-2xl mx-auto w-full">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500/20 to-brand-600/20 flex items-center justify-center">
                      <User className="w-8 h-8 text-brand-400" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-black text-white">What's your name?</h2>
                      <p className="text-slate-400 mt-1">Let's personalize your experience</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && canProceed() && nextStep()}
                      placeholder="Enter your full name"
                      className="w-full bg-slate-900/50 border-2 border-slate-700/50 rounded-2xl px-6 py-5 text-2xl text-white placeholder:text-slate-600 focus:ring-4 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
                      autoFocus
                    />
                    <p className="text-sm text-slate-500 flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      We'll use this to personalize your learning journey
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Persona */}
            {currentStep === 2 && (
              <div className="flex-1 flex flex-col animate-fadeIn">
                <div className="mb-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center">
                      <Target className="w-8 h-8 text-purple-400" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-black text-white">Choose your learning style</h2>
                      <p className="text-slate-400 mt-1">How do you learn best, {name}?</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
                  {personas.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setPersona(p.id)}
                      className={`group relative p-8 rounded-2xl border-2 transition-all text-left overflow-hidden ${
                        persona === p.id
                          ? 'border-transparent shadow-2xl scale-105'
                          : 'border-slate-700/50 hover:border-slate-600 hover:scale-102'
                      }`}
                    >
                      {/* Background Gradient */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${persona === p.id ? p.bgGradient : 'from-slate-800/50 to-slate-900/50'} transition-all`}></div>
                      
                      {/* Border Gradient */}
                      {persona === p.id && (
                        <div className={`absolute inset-0 bg-gradient-to-br ${p.gradient} opacity-100 -z-10 blur-xl`}></div>
                      )}
                      
                      <div className="relative z-10">
                        {/* Icon */}
                        <div className="text-6xl mb-6">{p.icon}</div>
                        
                        {/* Title */}
                        <div className="mb-4">
                          <h3 className="font-black text-2xl text-white mb-1">{p.title}</h3>
                          <p className={`text-sm font-semibold ${persona === p.id ? 'text-brand-300' : 'text-slate-500'}`}>
                            {p.subtitle}
                          </p>
                        </div>
                        
                        {/* Description */}
                        <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                          {p.description}
                        </p>
                        
                        {/* Features */}
                        <div className="space-y-2">
                          {p.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <div className={`w-1.5 h-1.5 rounded-full ${persona === p.id ? 'bg-brand-400' : 'bg-slate-600'}`}></div>
                              <span className="text-xs text-slate-400">{feature}</span>
                            </div>
                          ))}
                        </div>

                        {/* Selected Badge */}
                        {persona === p.id && (
                          <div className="absolute top-4 right-4">
                            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${p.gradient} flex items-center justify-center shadow-lg`}>
                              <Check className="w-6 h-6 text-white" strokeWidth={3} />
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
                <div className="mb-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 flex items-center justify-center">
                      <Lightbulb className="w-8 h-8 text-emerald-400" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-black text-white">What do you want to build?</h2>
                      <p className="text-slate-400 mt-1">Tell us your dream project</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 flex-1">
                  <textarea
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder="Describe your goal in detail... For example: 'I want to build a mobile app that helps people track their daily water intake and sends reminders'"
                    rows={6}
                    className="w-full bg-slate-900/50 border-2 border-slate-700/50 rounded-2xl px-6 py-5 text-lg text-white placeholder:text-slate-600 focus:ring-4 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all resize-none"
                    autoFocus
                  />
                  
                  {/* Quick Suggestions */}
                  <div>
                    <p className="text-sm font-semibold text-slate-400 mb-3">Popular goals:</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {goalSuggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => setGoal(suggestion.text)}
                          className="group flex items-center gap-3 p-4 bg-slate-900/50 hover:bg-slate-800/50 border border-slate-700/50 hover:border-brand-500/50 rounded-xl transition-all text-left"
                        >
                          <span className="text-2xl">{suggestion.icon}</span>
                          <div className="flex-1">
                            <div className="text-sm font-semibold text-white group-hover:text-brand-300 transition-colors">
                              {suggestion.text}
                            </div>
                            <div className="text-xs text-slate-500">{suggestion.category}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Pro Tip */}
                  <div className="p-5 bg-gradient-to-r from-brand-500/10 to-purple-500/10 border border-brand-500/20 rounded-2xl">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-brand-500/20 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-5 h-5 text-brand-400" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white mb-1">Pro Tip</h4>
                        <p className="text-sm text-slate-300 leading-relaxed">
                          The more specific you are, the better we can tailor your curriculum. Instead of "learn Python", try "build a web scraper to track Amazon prices".
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Navigation */}
          <div className="px-8 md:px-12 py-6 bg-slate-900/50 border-t border-slate-700/50 flex items-center justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all disabled:opacity-0 disabled:cursor-not-allowed font-semibold"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>

            <div className="flex items-center gap-3">
              {currentStep < 3 ? (
                <button
                  onClick={nextStep}
                  disabled={!canProceed()}
                  className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-500/30 hover:shadow-xl hover:shadow-brand-500/40 hover:scale-105"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              ) : (
                <button
                  onClick={handleStart}
                  disabled={!canProceed() || isLoading}
                  className="group relative overflow-hidden flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-brand-600 via-purple-600 to-emerald-600 hover:from-brand-500 hover:via-purple-500 hover:to-emerald-500 text-white font-black text-lg rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl shadow-brand-500/40 hover:scale-105"
                >
                  {isLoading ? (
                    <>
                      <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Generating Your Path...</span>
                    </>
                  ) : (
                    <>
                      <Rocket className="w-6 h-6" />
                      <span>Start My Journey</span>
                      <Sparkles className="w-6 h-6" />
                    </>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 flex items-center justify-center gap-8 text-sm">
          <div className="flex items-center gap-2 text-slate-400">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <span className="font-medium">AI-Powered Curriculum</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
            <span className="font-medium">100% Free Forever</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></div>
            <span className="font-medium">Personalized for You</span>
          </div>
        </div>
      </div>
    </div>
  );
};
