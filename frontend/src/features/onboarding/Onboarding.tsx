import { ArrowRight, ChevronRight, Code2, Terminal } from 'lucide-react';
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
      title: 'visual_learner',
      description: 'Interactive examples with visual feedback',
      codeExample: 'if (style === "visual") {\n  return show();\n}'
    },
    {
      id: UserPersona.PROFESSIONAL,
      title: 'career_focused',
      description: 'Industry standards & best practices',
      codeExample: 'const goal = "professional";\nbuildCareer(goal);'
    },
    {
      id: UserPersona.DOCTOR_ENGINEER,
      title: 'project_builder',
      description: 'Learn by building real applications',
      codeExample: 'function learn() {\n  while (true) build();\n}'
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
    } else if (canProceed() && currentStep === 3) {
      handleStart();
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-mono">
      <div className="w-full max-w-3xl">
        {/* Terminal Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <Terminal className="w-4 h-4" />
            <span>~/setup</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-brand-400">step_{currentStep}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <div className={`w-1.5 h-1.5 rounded-full ${currentStep >= 1 ? 'bg-brand-500' : 'bg-slate-700'}`}></div>
            <div className={`w-1.5 h-1.5 rounded-full ${currentStep >= 2 ? 'bg-brand-500' : 'bg-slate-700'}`}></div>
            <div className={`w-1.5 h-1.5 rounded-full ${currentStep >= 3 ? 'bg-brand-500' : 'bg-slate-700'}`}></div>
          </div>
        </div>

        {/* Main Terminal Window */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl overflow-hidden">
          {/* Window Controls */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/50 border-b border-slate-700/50">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-600"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-slate-600"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-slate-600"></div>
            </div>
            <div className="text-xs text-slate-500">setup.config.ts</div>
            <div className="w-16"></div>
          </div>

          {/* Content */}
          <div className="p-6 min-h-[400px]">
            {/* Step 1: Name */}
            {currentStep === 1 && (
              <div className="space-y-4 animate-fadeIn">
                <div className="space-y-1">
                  <div className="text-sm text-slate-500">
                    <span className="text-purple-400">const</span> <span className="text-brand-400">userName</span> <span className="text-purple-400">=</span>
                  </div>
                  <div className="text-xl text-white">What should we call you?</div>
                  <div className="text-sm text-slate-500">// Enter your name</div>
                </div>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && canProceed() && nextStep()}
                  placeholder='"John Doe"'
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder:text-slate-600 focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20 outline-none transition-all"
                  autoFocus
                />
              </div>
            )}

            {/* Step 2: Persona */}
            {currentStep === 2 && (
              <div className="space-y-4 animate-fadeIn">
                <div className="space-y-1">
                  <div className="text-sm text-slate-500">
                    <span className="text-purple-400">interface</span> <span className="text-brand-400">LearningStyle</span>
                  </div>
                  <div className="text-xl text-white">Select your learning mode</div>
                  <div className="text-sm text-slate-500">// Choose your approach</div>
                </div>

                <div className="space-y-2">
                  {personas.map((p, idx) => (
                    <button
                      key={p.id}
                      onClick={() => setPersona(p.id)}
                      className={`w-full text-left p-4 rounded-lg border transition-all ${
                        persona === p.id
                          ? 'border-brand-500 bg-brand-500/5'
                          : 'border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs ${persona === p.id ? 'text-brand-400' : 'text-slate-500'}`}>
                            [{idx + 1}]
                          </span>
                          <span className={`text-sm ${persona === p.id ? 'text-brand-400' : 'text-white'}`}>
                            {p.title}
                          </span>
                          {persona === p.id && (
                            <span className="text-xs text-emerald-400">← selected</span>
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-slate-400 mb-2 ml-6">{p.description}</div>
                      <div className="text-xs p-2 rounded bg-slate-900/50 border border-slate-700/50 ml-6">
                        <pre className="text-slate-500">{p.codeExample}</pre>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Goal */}
            {currentStep === 3 && (
              <div className="space-y-4 animate-fadeIn">
                <div className="space-y-1">
                  <div className="text-sm text-slate-500">
                    <span className="text-purple-400">function</span> <span className="text-brand-400">defineGoal</span>()
                  </div>
                  <div className="text-xl text-white">What do you want to build?</div>
                  <div className="text-sm text-slate-500">// Describe your project</div>
                </div>

                <textarea
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder='"Build a task management app..."'
                  rows={5}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder:text-slate-600 focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20 outline-none transition-all resize-none text-sm"
                  autoFocus
                />

                <div className="p-3 bg-brand-500/5 border border-brand-500/20 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Code2 className="w-4 h-4 text-brand-400 mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-slate-400">
                      <span className="text-brand-400 font-semibold">Tip:</span> Be specific for better results
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-3 bg-slate-900/50 border-t border-slate-700/50 flex items-center justify-between">
            <div className="text-xs text-slate-500">
              Step {currentStep}/3
            </div>

            <button
              onClick={nextStep}
              disabled={!canProceed() || isLoading}
              className="flex items-center gap-2 px-5 py-2 bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-brand-600"
            >
              {isLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Generating...</span>
                </>
              ) : currentStep === 3 ? (
                <>
                  <span>$ init</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Bottom Status */}
        <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
          <span>AI-powered curriculum</span>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
            <span>Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
};
