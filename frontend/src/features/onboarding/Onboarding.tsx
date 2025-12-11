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
      displayName: 'Visual Learner',
      description: 'Interactive examples with visual feedback',
      codeExample: 'if (learning.style === "visual") {\n  return "show_me";\n}',
      color: 'text-pink-400',
      borderColor: 'border-pink-500/50',
      bgColor: 'bg-pink-500/5'
    },
    {
      id: UserPersona.PROFESSIONAL,
      title: 'career_focused',
      displayName: 'Career Focused',
      description: 'Industry standards & best practices',
      codeExample: 'const goal = "professional";\nreturn buildCareer(goal);',
      color: 'text-cyan-400',
      borderColor: 'border-cyan-500/50',
      bgColor: 'bg-cyan-500/5'
    },
    {
      id: UserPersona.DOCTOR_ENGINEER,
      title: 'project_builder',
      displayName: 'Project Builder',
      description: 'Learn by building real applications',
      codeExample: 'function learn() {\n  while (true) build();\n}',
      color: 'text-emerald-400',
      borderColor: 'border-emerald-500/50',
      bgColor: 'bg-emerald-500/5'
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
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center p-4 md:p-6 font-mono">
      <div className="w-full max-w-4xl">
        {/* Terminal Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-[#8b949e] text-sm mb-2">
            <Terminal className="w-4 h-4" />
            <span>~/setup/onboarding</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#58a6ff]">step_{currentStep}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#8b949e]">
            <div className="w-2 h-2 rounded-full bg-[#3fb950]"></div>
            <span>Ready to configure</span>
          </div>
        </div>

        {/* Main Terminal Window */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden shadow-2xl">
          {/* Window Controls */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#0d1117] border-b border-[#30363d]">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff6b6b]"></div>
              <div className="w-3 h-3 rounded-full bg-[#ffd93d]"></div>
              <div className="w-3 h-3 rounded-full bg-[#6bcf7f]"></div>
            </div>
            <div className="text-xs text-[#8b949e] font-mono">
              setup.config.ts
            </div>
            <div className="w-16"></div>
          </div>

          {/* Content */}
          <div className="p-8 min-h-[500px]">
            {/* Step 1: Name */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[#8b949e] text-sm">
                    <span className="text-[#ff7b72]">const</span>
                    <span className="text-[#79c0ff]">userName</span>
                    <span className="text-[#ff7b72]">=</span>
                  </div>
                  <div className="text-2xl text-[#c9d1d9] mb-2">
                    What should we call you?
                  </div>
                  <div className="text-sm text-[#8b949e]">
                    // Enter your name to personalize the experience
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8b949e]">
                    <Code2 className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && canProceed() && nextStep()}
                    placeholder='e.g., "John Doe"'
                    className="w-full bg-[#0d1117] border border-[#30363d] rounded-md pl-12 pr-4 py-4 text-[#c9d1d9] placeholder:text-[#6e7681] focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] outline-none transition-all font-mono"
                    autoFocus
                  />
                </div>

                <div className="flex items-center gap-2 text-xs text-[#8b949e]">
                  <span className="text-[#3fb950]">✓</span>
                  <span>Press Enter or click Continue</span>
                </div>
              </div>
            )}

            {/* Step 2: Persona */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[#8b949e] text-sm">
                    <span className="text-[#ff7b72]">interface</span>
                    <span className="text-[#79c0ff]">LearningStyle</span>
                  </div>
                  <div className="text-2xl text-[#c9d1d9] mb-2">
                    Select your learning mode
                  </div>
                  <div className="text-sm text-[#8b949e]">
                    // Choose the approach that works best for you
                  </div>
                </div>

                <div className="space-y-3">
                  {personas.map((p, idx) => (
                    <button
                      key={p.id}
                      onClick={() => setPersona(p.id)}
                      className={`w-full text-left p-5 rounded-md border transition-all ${
                        persona === p.id
                          ? `${p.borderColor} ${p.bgColor} border-2`
                          : 'border-[#30363d] hover:border-[#484f58]'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`text-sm ${persona === p.id ? p.color : 'text-[#8b949e]'}`}>
                            [{idx + 1}]
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className={`font-mono ${persona === p.id ? p.color : 'text-[#c9d1d9]'}`}>
                                {p.title}
                              </span>
                              {persona === p.id && (
                                <span className="text-xs text-[#3fb950]">← selected</span>
                              )}
                            </div>
                            <div className="text-sm text-[#8b949e] mt-1">
                              {p.description}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className={`font-mono text-xs p-3 rounded bg-[#0d1117] border border-[#30363d] ${
                        persona === p.id ? 'opacity-100' : 'opacity-50'
                      }`}>
                        <pre className="text-[#8b949e] whitespace-pre-wrap">
                          {p.codeExample}
                        </pre>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Goal */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[#8b949e] text-sm">
                    <span className="text-[#ff7b72]">function</span>
                    <span className="text-[#d2a8ff]">defineGoal</span>
                    <span className="text-[#c9d1d9]">()</span>
                  </div>
                  <div className="text-2xl text-[#c9d1d9] mb-2">
                    What do you want to build?
                  </div>
                  <div className="text-sm text-[#8b949e]">
                    // Describe your project goal in detail
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute left-3 top-3 text-[#6e7681] text-xs">
                    1
                  </div>
                  <textarea
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder='e.g., "Build a task management app with real-time collaboration"'
                    rows={6}
                    className="w-full bg-[#0d1117] border border-[#30363d] rounded-md pl-10 pr-4 py-3 text-[#c9d1d9] placeholder:text-[#6e7681] focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] outline-none transition-all font-mono text-sm resize-none"
                    autoFocus
                  />
                </div>

                <div className="p-4 bg-[#1f6feb]/10 border border-[#1f6feb]/30 rounded-md">
                  <div className="flex items-start gap-3">
                    <div className="text-[#58a6ff] mt-0.5">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 1.5c-2.363 0-4 1.69-4 3.75 0 .984.424 1.625.984 2.304l.214.253c.223.264.47.556.673.848.284.411.537.896.621 1.49a.75.75 0 0 1-1.484.211c-.04-.282-.163-.547-.37-.847a8.456 8.456 0 0 0-.542-.68c-.084-.1-.173-.205-.268-.32C3.201 7.75 2.5 6.766 2.5 5.25 2.5 2.31 4.863 0 8 0s5.5 2.31 5.5 5.25c0 1.516-.701 2.5-1.328 3.259-.095.115-.184.22-.268.319-.207.245-.383.453-.541.681-.208.3-.33.565-.37.847a.751.751 0 0 1-1.485-.212c.084-.593.337-1.078.621-1.489.203-.292.45-.584.673-.848.075-.088.147-.173.213-.253.561-.679.985-1.32.985-2.304 0-2.06-1.637-3.75-4-3.75ZM5.75 12h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1 0-1.5ZM6 15.25a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75Z"></path>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-[#58a6ff] mb-1">
                        Pro tip
                      </div>
                      <div className="text-sm text-[#8b949e]">
                        Be specific! "Build a weather app" → "Build a weather app that shows 7-day forecasts with interactive maps"
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-8 py-4 bg-[#0d1117] border-t border-[#30363d] flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-[#8b949e]">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${currentStep >= 1 ? 'bg-[#3fb950]' : 'bg-[#30363d]'}`}></div>
                <span>name</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${currentStep >= 2 ? 'bg-[#3fb950]' : 'bg-[#30363d]'}`}></div>
                <span>style</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${currentStep >= 3 ? 'bg-[#3fb950]' : 'bg-[#30363d]'}`}></div>
                <span>goal</span>
              </div>
            </div>

            <button
              onClick={nextStep}
              disabled={!canProceed() || isLoading}
              className="group flex items-center gap-2 px-6 py-2.5 bg-[#238636] hover:bg-[#2ea043] text-white text-sm font-semibold rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#238636]"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Generating...</span>
                </>
              ) : currentStep === 3 ? (
                <>
                  <span>$ init</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              ) : (
                <>
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="mt-4 flex items-center justify-between text-xs text-[#8b949e]">
          <div className="flex items-center gap-4">
            <span>Step {currentStep}/3</span>
            <span>•</span>
            <span>AI-powered curriculum</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#3fb950]">●</span>
            <span>Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
};
