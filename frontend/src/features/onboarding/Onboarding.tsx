import { ArrowRight, Rocket, Sparkles } from 'lucide-react';
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserPersona } from '../../types';

interface OnboardingProps {
  onComplete: (profile: any) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [persona, setPersona] = useState<UserPersona | null>(null);
  const [goal, setGoal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuth();

  const personas = [
    {
      id: UserPersona.KID,
      title: 'Visual Learner',
      description: 'Fun, visual, and simple explanations.',
      icon: '🎨',
      color: 'from-pink-500 to-purple-500'
    },
    {
      id: UserPersona.PROFESSIONAL,
      title: 'Career Focused',
      description: 'Fast-track to professional skills.',
      icon: '💼',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: UserPersona.DOCTOR_ENGINEER,
      title: 'Project Builder',
      description: 'Learn by building real useful tools.',
      icon: '🚀',
      color: 'from-emerald-500 to-teal-500'
    }
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
        courseId: data.id, // Pass DB ID
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

  return (
    <div className="min-h-[calc(100vh-120px)] flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 text-brand-400 text-sm font-medium mb-6 border border-brand-500/20">
            <Sparkles className="w-4 h-4" />
            Let's personalize your learning
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            Start Your Coding Journey
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Tell us about yourself and we'll create a custom learning path just for you
          </p>
        </div>

        {/* Onboarding Card */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-8 md:p-12 shadow-2xl">
          
          {/* Step 1: Name */}
          <div className="mb-10">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-brand-500/20 text-brand-400 text-xs">1</span>
              What should we call you?
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-6 py-4 text-lg text-white placeholder:text-slate-500 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
              autoFocus
            />
          </div>

          {/* Step 2: Persona */}
          <div className="mb-10">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-4">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-brand-500/20 text-brand-400 text-xs">2</span>
              Choose your learning style
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {personas.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPersona(p.id)}
                  className={`group relative p-6 rounded-2xl border-2 transition-all text-left ${
                    persona === p.id
                      ? 'border-brand-500 bg-brand-500/10 shadow-lg shadow-brand-500/20'
                      : 'border-slate-700 bg-slate-800/30 hover:border-slate-600 hover:bg-slate-800/50'
                  }`}
                >
                  <div className={`text-4xl mb-3 transition-transform ${persona === p.id ? 'scale-110' : 'group-hover:scale-105'}`}>
                    {p.icon}
                  </div>
                  <h3 className="font-bold text-white mb-1">{p.title}</h3>
                  <p className="text-sm text-slate-400">{p.description}</p>
                  
                  {persona === p.id && (
                    <div className="absolute top-3 right-3">
                      <div className="w-6 h-6 rounded-full bg-brand-500 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Goal */}
          <div className="mb-10">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-brand-500/20 text-brand-400 text-xs">3</span>
              What do you want to build or learn?
            </label>
            <textarea
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="E.g., I want to build a mobile app, create a website, automate tasks..."
              rows={4}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-6 py-4 text-lg text-white placeholder:text-slate-500 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all resize-none"
            />
            <p className="text-xs text-slate-500 mt-2">Be specific! The more details, the better your personalized course.</p>
          </div>

          {/* Start Button */}
          <button
            onClick={handleStart}
            disabled={!name || !persona || !goal || isLoading}
            className="group w-full relative overflow-hidden bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white font-semibold py-5 px-8 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-500/30 hover:shadow-xl hover:shadow-brand-500/40 disabled:hover:shadow-lg"
          >
            <span className="relative z-10 flex items-center justify-center gap-3 text-lg">
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Creating your personalized course...
                </>
              ) : (
                <>
                  <Rocket className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  Start Learning Journey
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          </button>

          {/* Progress Indicator */}
          <div className="mt-6 flex items-center justify-center gap-2">
            <div className={`h-1.5 w-12 rounded-full transition-all ${name ? 'bg-brand-500' : 'bg-slate-700'}`}></div>
            <div className={`h-1.5 w-12 rounded-full transition-all ${persona ? 'bg-brand-500' : 'bg-slate-700'}`}></div>
            <div className={`h-1.5 w-12 rounded-full transition-all ${goal ? 'bg-brand-500' : 'bg-slate-700'}`}></div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 flex items-center justify-center gap-8 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
            AI-Powered
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-400"></div>
            100% Free
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-400"></div>
            No Credit Card
          </div>
        </div>
      </div>
    </div>
  );
};
