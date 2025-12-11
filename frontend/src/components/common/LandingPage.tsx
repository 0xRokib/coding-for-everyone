import { ArrowRight, BookOpen, CheckCircle2, Cpu, Globe, Rocket, Target, Terminal, Trophy, Users, Zap } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const [typedText, setTypedText] = useState('');
  const codeSnippet = 'print("Hello, World!")';
  
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= codeSnippet.length) {
        setTypedText(codeSnippet.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20" />
      
      {/* Gradient Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-500/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="relative flex flex-col items-center justify-center py-20 text-center px-4">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-brand-500/10 to-purple-500/10 text-brand-400 text-sm font-medium mb-8 border border-brand-500/20 backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
          </span>
          <Users className="w-4 h-4" />
          Code for Everyone
        </div>
        
        {/* Hero Heading */}
        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-slate-400">
            Learn to Code,
          </span>
          <br/>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-400 via-purple-400 to-pink-400 animate-gradient">
            Your Way
          </span>
        </h1>
        
        {/* Subheading */}
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed">
          AI-powered learning paths tailored to your goals. 
          <br className="hidden md:block" />
          From complete beginner to building real projects—start coding today.
        </p>

        {/* Code Preview Card */}
        <div className="mb-10 w-full max-w-md">
          <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl shadow-brand-500/10">
            <div className="flex items-center gap-2 px-4 py-3 bg-slate-950/50 border-b border-slate-800">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              <span className="text-slate-500 text-xs font-mono ml-2">main.py</span>
            </div>
            <div className="p-6 font-mono text-sm">
              <div className="flex items-start gap-3">
                <Terminal className="w-4 h-4 text-brand-400 mt-1 flex-shrink-0" />
                <div>
                  <span className="text-purple-400">print</span>
                  <span className="text-slate-400">(</span>
                  <span className="text-emerald-400">"{typedText}"</span>
                  <span className="text-slate-400">)</span>
                  <span className="inline-block w-2 h-5 bg-brand-400 ml-1 animate-pulse"></span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-800 text-slate-500">
                <span className="text-emerald-400">→</span> Hello, World!
              </div>
            </div>
          </div>
        </div>
        
        {/* CTA Button */}
        <button 
          onClick={onStart}
          className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white transition-all bg-gradient-to-r from-brand-600 to-purple-600 rounded-full hover:from-brand-500 hover:to-purple-500 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:ring-offset-slate-900 shadow-lg shadow-brand-500/50"
        >
          <Rocket className="mr-2 w-5 h-5 group-hover:animate-bounce" />
          Start Coding Now
          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

        <p className="mt-4 text-sm text-slate-500">100% Free • No Sign Up Required • Start in 30 Seconds</p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 mt-16 w-full max-w-3xl">
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-1">10K+</div>
            <div className="text-sm text-slate-400">People Learning</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-1">50+</div>
            <div className="text-sm text-slate-400">Learning Paths</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-1">100%</div>
            <div className="text-sm text-slate-400">Free Forever</div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 w-full max-w-6xl">
          <div className="group p-8 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 hover:border-brand-500/50 transition-all hover:shadow-xl hover:shadow-brand-500/10 backdrop-blur-sm">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500/20 to-indigo-600/20 flex items-center justify-center mb-6 text-indigo-400 group-hover:scale-110 transition-transform">
              <BookOpen className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-white">Your Own Path</h3>
            <p className="text-slate-400 leading-relaxed">AI creates a custom learning journey based on your goals. Want to build games? Automate tasks? We've got you covered.</p>
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-indigo-500/10 text-indigo-300 rounded-full text-xs font-medium border border-indigo-500/20">Python</span>
              <span className="px-3 py-1 bg-indigo-500/10 text-indigo-300 rounded-full text-xs font-medium border border-indigo-500/20">JavaScript</span>
            </div>
          </div>
          
          <div className="group p-8 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 hover:border-pink-500/50 transition-all hover:shadow-xl hover:shadow-pink-500/10 backdrop-blur-sm">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-pink-500/20 to-pink-600/20 flex items-center justify-center mb-6 text-pink-400 group-hover:scale-110 transition-transform">
              <Cpu className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-white">AI Assistant</h3>
            <p className="text-slate-400 leading-relaxed">Get instant help whenever you're stuck. Our AI adapts to your learning style and explains concepts in a way that makes sense to you.</p>
            <div className="mt-6 space-y-2">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-pink-400" />
                Available 24/7
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-pink-400" />
                Personalized Hints
              </div>
            </div>
          </div>

          <div className="group p-8 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 hover:border-emerald-500/50 transition-all hover:shadow-xl hover:shadow-emerald-500/10 backdrop-blur-sm">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 flex items-center justify-center mb-6 text-emerald-400 group-hover:scale-110 transition-transform">
              <Globe className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-white">Code in Your Browser</h3>
            <p className="text-slate-400 leading-relaxed">Write and run code instantly—no downloads, no setup. Start coding from any device, anywhere in the world.</p>
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-300 rounded-lg text-sm font-medium border border-emerald-500/20">
              <Zap className="w-4 h-4" />
              Zero Setup
            </div>
          </div>
        </div>

        {/* --- ENHANCED SECTION: The Journey --- */}
        <div className="relative mt-32 w-full max-w-6xl mb-24">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 text-center tracking-tight">
              Start Your Coding Journey
            </h2>
            <p className="text-slate-400 text-lg text-center mb-20 max-w-2xl mx-auto">
              From zero to hero in three simple steps. No prior experience needed—just bring your curiosity.
            </p>
            
            <div className="space-y-24 relative px-4">
                {/* Vertical Progress Line (Mobile/Tablet) */}
                <div className="md:hidden absolute left-12 top-0 bottom-0 w-0.5 bg-gradient-to-b from-brand-500/50 via-purple-500/50 to-emerald-500/50"></div>
                
                {/* Step 1 - Slide in from left */}
                <div className="relative flex flex-col md:flex-row items-center gap-8 group">
                    {/* Step Number Badge */}
                    <div className="relative z-10 flex-shrink-0">
                        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-brand-600 to-brand-700 border-4 border-slate-900 flex items-center justify-center shadow-[0_0_40px_-10px_rgba(79,70,229,0.6)] group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                             <div className="text-center">
                                <div className="text-3xl font-black text-white">01</div>
                             </div>
                        </div>
                        {/* Connecting dot for mobile */}
                        <div className="md:hidden absolute left-1/2 -translate-x-1/2 -bottom-16 w-3 h-3 rounded-full bg-brand-500 animate-pulse"></div>
                    </div>

                    {/* Content Card */}
                    <div className="flex-1 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 group-hover:border-brand-500/50 transition-all duration-500 group-hover:shadow-[0_0_60px_-15px_rgba(79,70,229,0.4)] group-hover:translate-x-2">
                        <div className="flex items-start gap-6">
                            <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-brand-500/10 flex items-center justify-center group-hover:bg-brand-500/20 transition-colors">
                                <Target className="w-8 h-8 text-brand-400" />
                            </div>
                            <div className="flex-1">
                                <div className="inline-block px-3 py-1 bg-brand-500/10 text-brand-400 rounded-full text-xs font-bold mb-3 uppercase tracking-wider border border-brand-500/20">
                                    Choose Your Path
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3">Tell Us Your Dream</h3>
                                <p className="text-slate-300 leading-relaxed mb-4">
                                    Want to build games? Create websites? Automate boring tasks? Just tell us what excites you, and we'll craft a personalized learning path designed specifically for your goals.
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-3 py-1.5 bg-slate-700/50 text-slate-300 rounded-lg text-sm font-medium border border-slate-600/50 hover:border-brand-500/50 hover:text-brand-300 transition-all cursor-default">🎮 Game Development</span>
                                    <span className="px-3 py-1.5 bg-slate-700/50 text-slate-300 rounded-lg text-sm font-medium border border-slate-600/50 hover:border-brand-500/50 hover:text-brand-300 transition-all cursor-default">🌐 Web Development</span>
                                    <span className="px-3 py-1.5 bg-slate-700/50 text-slate-300 rounded-lg text-sm font-medium border border-slate-600/50 hover:border-brand-500/50 hover:text-brand-300 transition-all cursor-default">🤖 AI & ML</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Step 2 - Slide in from right */}
                <div className="relative flex flex-col md:flex-row-reverse items-center gap-8 group">
                    {/* Step Number Badge */}
                    <div className="relative z-10 flex-shrink-0">
                        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-600 to-purple-700 border-4 border-slate-900 flex items-center justify-center shadow-[0_0_40px_-10px_rgba(168,85,247,0.6)] group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500">
                             <div className="text-center">
                                <div className="text-3xl font-black text-white">02</div>
                             </div>
                        </div>
                        {/* Connecting dot for mobile */}
                        <div className="md:hidden absolute left-1/2 -translate-x-1/2 -bottom-16 w-3 h-3 rounded-full bg-purple-500 animate-pulse"></div>
                    </div>

                    {/* Content Card */}
                    <div className="flex-1 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 group-hover:border-purple-500/50 transition-all duration-500 group-hover:shadow-[0_0_60px_-15px_rgba(168,85,247,0.4)] group-hover:-translate-x-2">
                        <div className="flex items-start gap-6">
                            <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                                <Cpu className="w-8 h-8 text-purple-400" />
                            </div>
                            <div className="flex-1">
                                <div className="inline-block px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full text-xs font-bold mb-3 uppercase tracking-wider border border-purple-500/20">
                                    AI-Powered Magic
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3">Get Your Custom Curriculum</h3>
                                <p className="text-slate-300 leading-relaxed mb-4">
                                    Our AI instantly analyzes your goals and creates a step-by-step learning plan tailored just for you. No two journeys are the same—yours is uniquely designed to match your pace and interests.
                                </p>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="flex items-center gap-2 text-sm text-slate-300">
                                        <CheckCircle2 className="w-5 h-5 text-purple-400 flex-shrink-0" />
                                        <span>Personalized Lessons</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-300">
                                        <CheckCircle2 className="w-5 h-5 text-purple-400 flex-shrink-0" />
                                        <span>Adaptive Difficulty</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-300">
                                        <CheckCircle2 className="w-5 h-5 text-purple-400 flex-shrink-0" />
                                        <span>Real-World Projects</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-300">
                                        <CheckCircle2 className="w-5 h-5 text-purple-400 flex-shrink-0" />
                                        <span>24/7 AI Assistant</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Step 3 - Slide in from left */}
                <div className="relative flex flex-col md:flex-row items-center gap-8 group">
                    {/* Step Number Badge */}
                    <div className="relative z-10 flex-shrink-0">
                        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-600 to-emerald-700 border-4 border-slate-900 flex items-center justify-center shadow-[0_0_40px_-10px_rgba(16,185,129,0.6)] group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                             <div className="text-center">
                                <div className="text-3xl font-black text-white">03</div>
                             </div>
                        </div>
                    </div>

                    {/* Content Card */}
                    <div className="flex-1 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 group-hover:border-emerald-500/50 transition-all duration-500 group-hover:shadow-[0_0_60px_-15px_rgba(16,185,129,0.4)] group-hover:translate-x-2">
                        <div className="flex items-start gap-6">
                            <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                                <Trophy className="w-8 h-8 text-emerald-400" />
                            </div>
                            <div className="flex-1">
                                <div className="inline-block px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-bold mb-3 uppercase tracking-wider border border-emerald-500/20">
                                    Build & Launch
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3">Master Through Practice</h3>
                                <p className="text-slate-300 leading-relaxed mb-4">
                                    Learn by building real projects that matter. Code directly in your browser, get instant feedback, earn achievements, and watch your skills grow. From your first "Hello World" to launching your own apps.
                                </p>
                                <div className="flex items-center gap-4 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                                    <div className="flex items-center gap-2">
                                        <Zap className="w-5 h-5 text-emerald-400" />
                                        <span className="text-sm font-medium text-emerald-300">Instant Code Execution</span>
                                    </div>
                                    <div className="h-4 w-px bg-emerald-500/30"></div>
                                    <div className="flex items-center gap-2">
                                        <Rocket className="w-5 h-5 text-emerald-400" />
                                        <span className="text-sm font-medium text-emerald-300">Portfolio Ready</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA at bottom */}
            <div className="mt-20 text-center">
                <button 
                    onClick={onStart}
                    className="group relative inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-white transition-all bg-gradient-to-r from-brand-600 via-purple-600 to-emerald-600 rounded-2xl hover:from-brand-500 hover:via-purple-500 hover:to-emerald-500 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-brand-400/50 shadow-[0_0_40px_-10px_rgba(79,70,229,0.8)] hover:shadow-[0_0_60px_-10px_rgba(79,70,229,1)] animate-gradient bg-[length:200%_auto]"
                >
                    <Rocket className="mr-3 w-6 h-6 group-hover:animate-bounce" />
                    Begin Your Journey Now
                    <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </button>
                <p className="mt-4 text-sm text-slate-400">
                    <span className="inline-flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        Free Forever
                    </span>
                    <span className="mx-3 text-slate-700">•</span>
                    <span className="inline-flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        No Credit Card
                    </span>
                    <span className="mx-3 text-slate-700">•</span>
                    <span className="inline-flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        Start in 30 Seconds
                    </span>
                </p>
            </div>
        </div>

        {/* Social Proof */}
        <div className="mt-24 max-w-4xl">
          <p className="text-slate-500 text-sm mb-6">Powered by cutting-edge technology</p>
          <div className="flex flex-wrap justify-center gap-8 items-center opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
            <div className="text-slate-400 font-semibold text-lg">Google Gemini AI</div>
            <div className="text-slate-400 font-semibold text-lg">React</div>
            <div className="text-slate-400 font-semibold text-lg">TypeScript</div>
            <div className="text-slate-400 font-semibold text-lg">Go</div>
          </div>
        </div>
      </div>
    </div>
  );
};
