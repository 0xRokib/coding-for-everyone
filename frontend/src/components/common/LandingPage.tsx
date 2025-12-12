import { ArrowRight, BookOpen, CheckCircle2, Code2, Cpu, Globe, LayoutDashboard, Rocket, Target, Terminal, Trophy, Users, Zap } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface LandingPageProps {
  onStart: () => void;
  hideNav?: boolean;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, hideNav = false }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
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
    <div className="min-h-screen bg-slate-950 font-sans selection:bg-brand-500/30 relative overflow-hidden">
      {/* Minimal Header - Hidden if hideNav is true (when wrapped in FullPageLayout) */}
      {!hideNav && (
        <nav className="absolute top-0 left-0 right-0 z-50 px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
              <div className="relative w-10 h-10 bg-gradient-to-br from-brand-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
                <Code2 className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl text-white tracking-tight group-hover:text-brand-200 transition-colors">Code Anyone</span>
          </div>
          
          <div className="flex items-center gap-8">
               {/* Public Nav Links (Desktop) */}
               <div className="hidden md:flex items-center gap-6">
                   {['Community', 'Roadmap', 'Contact'].map((item) => (
                       <button 
                           key={item}
                           onClick={() => navigate(`/${item.toLowerCase()}`)}
                           className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
                       >
                           {item}
                       </button>
                   ))}
               </div>

               {user ? (
                   <div className="flex items-center gap-4">
                        <button 
                            onClick={() => navigate('/dashboard')}
                            className="hidden md:flex items-center gap-2 text-slate-300 hover:text-white font-medium transition-colors"
                        >
                            <LayoutDashboard className="w-4 h-4" />
                            Dashboard
                        </button>
                        <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                            <div className="text-right hidden sm:block">
                                <div className="text-sm font-bold text-white leading-none">{user.name}</div>
                                <div className="text-[10px] text-brand-400 font-medium uppercase tracking-wider">Pro Member</div>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-500 to-purple-500 p-[1px] cursor-pointer group/profile relative">
                                <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-sm font-bold text-white group-hover/profile:bg-transparent transition-colors">
                                    {user.name?.charAt(0).toUpperCase()}
                                </div>
                            </div>
                        </div>
                   </div>
               ) : (
                   <div className="flex items-center gap-4 pl-6 border-l border-slate-800/50">
                        <button 
                            onClick={() => navigate('/login')} 
                            className="px-4 py-2 text-slate-400 hover:text-white font-semibold transition-colors relative group"
                        >
                            <span className="relative z-10">Sign In</span>
                            <div className="absolute inset-x-0 bottom-0 h-px bg-white scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                        </button>
                        <button 
                            onClick={onStart} 
                            className="relative group px-6 py-2.5 font-bold rounded-xl overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)]"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-brand-600 via-purple-600 to-brand-600 bg-[length:200%_100%] animate-gradient-x"></div>
                            <div className="relative flex items-center gap-2 text-white">
                                <span>Get Started</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </button>
                   </div>
               )}
          </div>
        </nav>
      )}
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
          Code for Anyone
        </div>
        
        {/* Hero Heading */}
        <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tight leading-none">
          <span className="block bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-slate-400 mb-2">
            Build the Future.
          </span>
          <span className="block bg-clip-text text-transparent bg-gradient-to-r from-brand-400 via-purple-400 to-pink-400 animate-gradient">
            Break the Limits.
          </span>
        </h1>
        
        {/* Subheading */}
        <p className="text-lg md:text-2xl text-slate-400 max-w-2xl mb-10 leading-relaxed font-light">
          From <span className="text-white font-semibold">kids</span> to <span className="text-brand-400 font-semibold">doctors</span>, <span className="text-purple-400 font-semibold">engineers</span> to <span className="text-pink-400 font-semibold">teachers</span>.
          <br className="hidden md:block" />
          The most inclusive way to master technology. Use AI to build your dreams.
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
          Start Creating Now
          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

        <p className="mt-4 text-sm text-slate-500">100% Free • No Sign Up Required • Start in 30 Seconds</p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 mt-16 w-full max-w-3xl">
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-1">10K+</div>
            <div className="text-sm text-slate-400">Everyone is Welcome</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-1">50+</div>
            <div className="text-sm text-slate-400">Missions Completed</div>
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
            <p className="text-slate-400 leading-relaxed">AI creates a custom learning journey based on your goals. Play with code. Build games. Create art.</p>
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

        {/* --- ULTRA-MODERN SECTION: The Journey --- */}
        <div className="relative mt-32 w-full max-w-7xl mb-24">
            {/* Floating Particles Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-2 h-2 bg-brand-400 rounded-full animate-ping opacity-20"></div>
                <div className="absolute top-40 right-20 w-3 h-3 bg-purple-400 rounded-full animate-pulse opacity-30"></div>
                <div className="absolute bottom-32 left-1/4 w-2 h-2 bg-emerald-400 rounded-full animate-ping opacity-20" style={{animationDelay: '1s'}}></div>
                <div className="absolute top-60 right-1/3 w-2 h-2 bg-pink-400 rounded-full animate-pulse opacity-25" style={{animationDelay: '0.5s'}}></div>
            </div>

            {/* Section Header - Redesigned */}
            <div className="text-center mb-24 relative">
                {/* Animated Background Gradient */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-r from-brand-500/20 via-purple-500/20 to-emerald-500/20 blur-[120px] animate-pulse"></div>
                </div>

                {/* Badge with Animation */}
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-brand-500/20 via-purple-500/20 to-emerald-500/20 backdrop-blur-xl border border-white/10 text-sm font-bold mb-8 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-500/0 via-white/10 to-brand-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    <Rocket className="w-4 h-4 text-brand-400 animate-bounce" />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-400 via-purple-400 to-emerald-400">Your Path to Mastery</span>
                </div>
                
                {/* Main Heading with Gradient Animation */}
                <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tight relative">
                    <span className="inline-block">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-brand-200 to-white animate-gradient bg-[length:200%_auto]">
                            Start Your
                        </span>
                    </span>
                    <br/>
                    <span className="inline-block relative">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-400 via-purple-400 to-emerald-400 animate-gradient bg-[length:200%_auto]">
                            Coding Journey
                        </span>
                        {/* Decorative underline */}
                        <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-brand-500/0 via-brand-500/50 to-brand-500/0 rounded-full"></div>
                    </span>
                </h2>
                
                <p className="text-slate-300 text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed font-light">
                    Three powerful steps to transform from{' '}
                    <span className="text-brand-400 font-semibold">complete beginner</span>
                    {' '}to{' '}
                    <span className="text-emerald-400 font-semibold">confident developer</span>
                    <br className="hidden md:block"/>
                    <span className="text-slate-400 text-lg mt-2 block">No experience required. Just bring your curiosity.</span>
                </p>
            </div>
            
            {/* Enhanced Vertical Timeline with Extraordinary Effects */}
            <div className="relative">
                {/* Animated Central Vertical Line with Glow */}
                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 hidden md:block">
                    <div className="absolute inset-0 bg-gradient-to-b from-brand-500 via-purple-500 to-emerald-500 opacity-30"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-brand-500 via-purple-500 to-emerald-500 blur-sm animate-pulse"></div>
                </div>
                
                {/* Mobile Vertical Line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-brand-500 via-purple-500 to-emerald-500 opacity-40 md:hidden"></div>

                <div className="space-y-32 md:space-y-48">
                    {/* Step 1 - Enhanced with 3D Effects */}
                    <div className="relative group">
                        {/* Holographic Timeline Dot */}
                        <div className="absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full hidden md:block z-20">
                            <div className="absolute inset-0 bg-brand-500 rounded-full animate-ping opacity-40"></div>
                            <div className="absolute inset-0 bg-gradient-to-r from-brand-400 to-brand-600 rounded-full shadow-lg shadow-brand-500/50"></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/30 rounded-full"></div>
                        </div>
                        <div className="absolute left-8 -translate-x-1/2 w-8 h-8 rounded-full md:hidden z-20">
                            <div className="absolute inset-0 bg-brand-500 rounded-full animate-ping opacity-40"></div>
                            <div className="absolute inset-0 bg-gradient-to-r from-brand-400 to-brand-600 rounded-full shadow-lg shadow-brand-500/50"></div>
                        </div>
                        
                        {/* Content */}
                        <div className="md:grid md:grid-cols-2 md:gap-20 items-center">
                            {/* Left: 3D Number Badge (Desktop) */}
                            <div className="hidden md:flex justify-end">
                                <div className="relative group/badge">
                                    {/* Multi-layer glow effect */}
                                    <div className="absolute inset-0 bg-brand-500 rounded-3xl blur-3xl opacity-40 group-hover/badge:opacity-70 transition-opacity duration-500"></div>
                                    <div className="absolute inset-0 bg-brand-400 rounded-3xl blur-2xl opacity-30 group-hover/badge:opacity-50 transition-opacity duration-500 animate-pulse"></div>
                                    
                                    {/* 3D Card */}
                                    <div className="relative w-40 h-40 rounded-3xl bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700 flex items-center justify-center border-4 border-slate-900 shadow-2xl transform-gpu group-hover/badge:scale-110 group-hover/badge:rotate-12 transition-all duration-700 perspective-1000">
                                        {/* Shine effect */}
                                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent rounded-3xl opacity-0 group-hover/badge:opacity-100 transition-opacity duration-500"></div>
                                        <span className="text-7xl font-black text-white relative z-10 drop-shadow-2xl">01</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Enhanced Content Card */}
                            <div className="ml-16 md:ml-0">
                                {/* Mobile Number Badge with 3D effect */}
                                <div className="md:hidden mb-8 relative group/badge inline-block">
                                    <div className="absolute inset-0 bg-brand-500 rounded-2xl blur-2xl opacity-50"></div>
                                    <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700 flex items-center justify-center border-4 border-slate-900 shadow-xl">
                                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent rounded-2xl"></div>
                                        <span className="text-4xl font-black text-white relative z-10">01</span>
                                    </div>
                                </div>

                                <div className="group/content cursor-default relative">
                                    {/* Floating background orb */}
                                    <div className="absolute -inset-10 bg-gradient-to-r from-brand-500/10 to-purple-500/10 rounded-3xl blur-3xl opacity-0 group-hover/content:opacity-100 transition-opacity duration-700 -z-10"></div>
                                    
                                    {/* Animated Badge */}
                                    <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-brand-500/20 to-brand-600/20 backdrop-blur-sm text-brand-300 text-xs font-bold mb-5 uppercase tracking-wider border border-brand-500/30 relative overflow-hidden group/badge-small">
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/badge-small:translate-x-full transition-transform duration-1000"></div>
                                        <Target className="w-4 h-4 animate-pulse" />
                                        <span className="relative z-10">Choose Your Path</span>
                                    </div>
                                    
                                    <h3 className="text-4xl md:text-5xl font-black text-white mb-5 group-hover/content:text-transparent group-hover/content:bg-clip-text group-hover/content:bg-gradient-to-r group-hover/content:from-brand-400 group-hover/content:to-purple-400 transition-all duration-500 leading-tight">
                                        Tell Us Your Dream
                                    </h3>
                                    <p className="text-slate-300 text-lg md:text-xl leading-relaxed mb-8 group-hover/content:text-slate-200 transition-colors">
                                        What do you want to build? Games that millions play? Websites that change lives? AI that solves problems? Share your vision, and we'll create a personalized roadmap designed specifically for your goals.
                                    </p>
                                    
                                    {/* Enhanced Feature Tags with hover effects */}
                                    <div className="flex flex-wrap gap-4 mb-8">
                                        <div className="group/tag px-5 py-3 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl hover:border-brand-500/50 hover:shadow-lg hover:shadow-brand-500/20 transition-all cursor-pointer transform hover:scale-105 hover:-translate-y-1">
                                            <div className="flex items-center gap-3">
                                                <span className="text-3xl group-hover/tag:scale-125 transition-transform duration-300">🎮</span>
                                                <span className="text-sm font-semibold text-slate-300 group-hover/tag:text-brand-300 transition-colors">Game Development</span>
                                            </div>
                                        </div>
                                        <div className="group/tag px-5 py-3 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl hover:border-brand-500/50 hover:shadow-lg hover:shadow-brand-500/20 transition-all cursor-pointer transform hover:scale-105 hover:-translate-y-1">
                                            <div className="flex items-center gap-3">
                                                <span className="text-3xl group-hover/tag:scale-125 transition-transform duration-300">🌐</span>
                                                <span className="text-sm font-semibold text-slate-300 group-hover/tag:text-brand-300 transition-colors">Web Development</span>
                                            </div>
                                        </div>
                                        <div className="group/tag px-5 py-3 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl hover:border-brand-500/50 hover:shadow-lg hover:shadow-brand-500/20 transition-all cursor-pointer transform hover:scale-105 hover:-translate-y-1">
                                            <div className="flex items-center gap-3">
                                                <span className="text-3xl group-hover/tag:scale-125 transition-transform duration-300">🤖</span>
                                                <span className="text-sm font-semibold text-slate-300 group-hover/tag:text-brand-300 transition-colors">AI & Machine Learning</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Enhanced Stats */}
                                    <div className="flex items-center gap-8 text-sm">
                                        <div className="flex items-center gap-2 text-slate-400 group-hover/content:text-brand-400 transition-colors">
                                            <div className="relative w-3 h-3">
                                                <div className="absolute inset-0 rounded-full bg-brand-500 animate-ping"></div>
                                                <div className="absolute inset-0 rounded-full bg-brand-500"></div>
                                            </div>
                                            <span className="font-medium">30 seconds</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-400 group-hover/content:text-emerald-400 transition-colors">
                                            <CheckCircle2 className="w-5 h-5 text-brand-400" />
                                            <span className="font-medium">No signup required</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 2 - Enhanced with Holographic Effects */}
                    <div className="relative group">
                        {/* Holographic Timeline Dot */}
                        <div className="absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full hidden md:block z-20">
                            <div className="absolute inset-0 bg-purple-500 rounded-full animate-ping opacity-40"></div>
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-600 rounded-full shadow-lg shadow-purple-500/50"></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/30 rounded-full"></div>
                        </div>
                        <div className="absolute left-8 -translate-x-1/2 w-8 h-8 rounded-full md:hidden z-20">
                            <div className="absolute inset-0 bg-purple-500 rounded-full animate-ping opacity-40"></div>
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-600 rounded-full shadow-lg shadow-purple-500/50"></div>
                        </div>
                        
                        {/* Content */}
                        <div className="md:grid md:grid-cols-2 md:gap-20 items-center">
                            {/* Left: Content Card (Desktop) */}
                            <div className="hidden md:block">
                                <div className="group/content cursor-default text-right relative">
                                    {/* Floating background orb */}
                                    <div className="absolute -inset-10 bg-gradient-to-l from-purple-500/10 to-pink-500/10 rounded-3xl blur-3xl opacity-0 group-hover/content:opacity-100 transition-opacity duration-700 -z-10"></div>
                                    
                                    <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm text-purple-300 text-xs font-bold mb-5 uppercase tracking-wider border border-purple-500/30 relative overflow-hidden group/badge-small">
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/badge-small:translate-x-full transition-transform duration-1000"></div>
                                        <Cpu className="w-4 h-4 animate-pulse" />
                                        <span className="relative z-10">AI-Powered Magic</span>
                                    </div>
                                    
                                    <h3 className="text-4xl md:text-5xl font-black text-white mb-5 group-hover/content:text-transparent group-hover/content:bg-clip-text group-hover/content:bg-gradient-to-r group-hover/content:from-purple-400 group-hover/content:to-pink-400 transition-all duration-500 leading-tight">
                                        Get Your Custom Curriculum
                                    </h3>
                                    <p className="text-slate-300 text-lg md:text-xl leading-relaxed mb-8 group-hover/content:text-slate-200 transition-colors">
                                        Our advanced AI analyzes your goals, experience level, and learning style to generate a personalized curriculum in seconds. Every lesson, project, and challenge is tailored specifically for you.
                                    </p>
                                    
                                    {/* Enhanced Features Grid */}
                                    <div className="grid grid-cols-2 gap-4 mb-8">
                                        <div className="flex items-center justify-end gap-3 text-base text-slate-300 group-hover/content:text-purple-300 transition-colors">
                                            <span className="font-medium">Personalized Lessons</span>
                                            <CheckCircle2 className="w-6 h-6 text-purple-400" />
                                        </div>
                                        <div className="flex items-center justify-end gap-3 text-base text-slate-300 group-hover/content:text-purple-300 transition-colors">
                                            <span className="font-medium">Adaptive Difficulty</span>
                                            <CheckCircle2 className="w-6 h-6 text-purple-400" />
                                        </div>
                                        <div className="flex items-center justify-end gap-3 text-base text-slate-300 group-hover/content:text-purple-300 transition-colors">
                                            <span className="font-medium">Real Projects</span>
                                            <CheckCircle2 className="w-6 h-6 text-purple-400" />
                                        </div>
                                        <div className="flex items-center justify-end gap-3 text-base text-slate-300 group-hover/content:text-purple-300 transition-colors">
                                            <span className="font-medium">24/7 AI Tutor</span>
                                            <CheckCircle2 className="w-6 h-6 text-purple-400" />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-end gap-2 text-sm text-slate-400 group-hover/content:text-purple-400 transition-colors">
                                        <Zap className="w-5 h-5 text-purple-400 animate-pulse" />
                                        <span className="font-medium">Instant generation</span>
                                    </div>
                                </div>
                            </div>

                            {/* Mobile Content */}
                            <div className="ml-16 md:hidden">
                                <div className="mb-8 relative group/badge inline-block">
                                    <div className="absolute inset-0 bg-purple-500 rounded-2xl blur-2xl opacity-50"></div>
                                    <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500 via-purple-600 to-pink-700 flex items-center justify-center border-4 border-slate-900 shadow-xl">
                                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent rounded-2xl"></div>
                                        <span className="text-4xl font-black text-white relative z-10">02</span>
                                    </div>
                                </div>

                                <div className="group/content cursor-default">
                                    <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm text-purple-300 text-xs font-bold mb-5 uppercase tracking-wider border border-purple-500/30">
                                        <Cpu className="w-4 h-4" />
                                        AI-Powered Magic
                                    </div>
                                    <h3 className="text-4xl font-black text-white mb-5 group-hover/content:text-purple-400 transition-colors leading-tight">
                                        Get Your Custom Curriculum
                                    </h3>
                                    <p className="text-slate-300 text-lg leading-relaxed mb-8">
                                        Our advanced AI analyzes your goals, experience level, and learning style to generate a personalized curriculum in seconds.
                                    </p>
                                    
                                    <div className="grid grid-cols-2 gap-4 mb-8">
                                        <div className="flex items-center gap-2 text-sm text-slate-300">
                                            <CheckCircle2 className="w-5 h-5 text-purple-400 flex-shrink-0" />
                                            <span>Personalized</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-300">
                                            <CheckCircle2 className="w-5 h-5 text-purple-400 flex-shrink-0" />
                                            <span>Adaptive</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-300">
                                            <CheckCircle2 className="w-5 h-5 text-purple-400 flex-shrink-0" />
                                            <span>Real Projects</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-300">
                                            <CheckCircle2 className="w-5 h-5 text-purple-400 flex-shrink-0" />
                                            <span>24/7 Tutor</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right: 3D Number Badge (Desktop) */}
                            <div className="hidden md:flex justify-start">
                                <div className="relative group/badge">
                                    <div className="absolute inset-0 bg-purple-500 rounded-3xl blur-3xl opacity-40 group-hover/badge:opacity-70 transition-opacity duration-500"></div>
                                    <div className="absolute inset-0 bg-pink-500 rounded-3xl blur-2xl opacity-30 group-hover/badge:opacity-50 transition-opacity duration-500 animate-pulse"></div>
                                    
                                    <div className="relative w-40 h-40 rounded-3xl bg-gradient-to-br from-purple-500 via-purple-600 to-pink-700 flex items-center justify-center border-4 border-slate-900 shadow-2xl transform-gpu group-hover/badge:scale-110 group-hover/badge:-rotate-12 transition-all duration-700">
                                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent rounded-3xl opacity-0 group-hover/badge:opacity-100 transition-opacity duration-500"></div>
                                        <span className="text-7xl font-black text-white relative z-10 drop-shadow-2xl">02</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 3 - Enhanced with Neon Effects */}
                    <div className="relative group">
                        {/* Holographic Timeline Dot */}
                        <div className="absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full hidden md:block z-20">
                            <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-40"></div>
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-600 rounded-full shadow-lg shadow-emerald-500/50"></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/30 rounded-full"></div>
                        </div>
                        <div className="absolute left-8 -translate-x-1/2 w-8 h-8 rounded-full md:hidden z-20">
                            <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-40"></div>
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-600 rounded-full shadow-lg shadow-emerald-500/50"></div>
                        </div>
                        
                        {/* Content */}
                        <div className="md:grid md:grid-cols-2 md:gap-20 items-center">
                            {/* Left: 3D Number Badge (Desktop) */}
                            <div className="hidden md:flex justify-end">
                                <div className="relative group/badge">
                                    <div className="absolute inset-0 bg-emerald-500 rounded-3xl blur-3xl opacity-40 group-hover/badge:opacity-70 transition-opacity duration-500"></div>
                                    <div className="absolute inset-0 bg-teal-500 rounded-3xl blur-2xl opacity-30 group-hover/badge:opacity-50 transition-opacity duration-500 animate-pulse"></div>
                                    
                                    <div className="relative w-40 h-40 rounded-3xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 flex items-center justify-center border-4 border-slate-900 shadow-2xl transform-gpu group-hover/badge:scale-110 group-hover/badge:rotate-12 transition-all duration-700">
                                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent rounded-3xl opacity-0 group-hover/badge:opacity-100 transition-opacity duration-500"></div>
                                        <span className="text-7xl font-black text-white relative z-10 drop-shadow-2xl">03</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Enhanced Content Card */}
                            <div className="ml-16 md:ml-0">
                                <div className="md:hidden mb-8 relative group/badge inline-block">
                                    <div className="absolute inset-0 bg-emerald-500 rounded-2xl blur-2xl opacity-50"></div>
                                    <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 flex items-center justify-center border-4 border-slate-900 shadow-xl">
                                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent rounded-2xl"></div>
                                        <span className="text-4xl font-black text-white relative z-10">03</span>
                                    </div>
                                </div>

                                <div className="group/content cursor-default relative">
                                    <div className="absolute -inset-10 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-3xl blur-3xl opacity-0 group-hover/content:opacity-100 transition-opacity duration-700 -z-10"></div>
                                    
                                    <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-sm text-emerald-300 text-xs font-bold mb-5 uppercase tracking-wider border border-emerald-500/30 relative overflow-hidden group/badge-small">
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/badge-small:translate-x-full transition-transform duration-1000"></div>
                                        <Trophy className="w-4 h-4 animate-pulse" />
                                        <span className="relative z-10">Build & Launch</span>
                                    </div>
                                    
                                    <h3 className="text-4xl md:text-5xl font-black text-white mb-5 group-hover/content:text-transparent group-hover/content:bg-clip-text group-hover/content:bg-gradient-to-r group-hover/content:from-emerald-400 group-hover/content:to-teal-400 transition-all duration-500 leading-tight">
                                        Master Through Practice
                                    </h3>
                                    <p className="text-slate-300 text-lg md:text-xl leading-relaxed mb-8 group-hover/content:text-slate-200 transition-colors">
                                        Learn by building real projects that matter. Write code directly in your browser, get instant feedback, earn achievements, and build a portfolio. From "Hello World" to launching your own applications.
                                    </p>
                                    
                                    {/* Enhanced Highlight Box with Neon Effect */}
                                    <div className="relative bg-gradient-to-br from-emerald-500/10 to-teal-600/10 border border-emerald-500/30 rounded-3xl p-8 mb-8 overflow-hidden group-hover/content:border-emerald-500/50 transition-all">
                                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/10 to-emerald-500/0 opacity-0 group-hover/content:opacity-100 transition-opacity duration-1000"></div>
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
                                            <div className="flex items-center gap-4 group/item">
                                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/30 to-emerald-600/30 flex items-center justify-center group-hover/item:scale-110 group-hover/item:rotate-6 transition-all duration-300">
                                                    <Zap className="w-7 h-7 text-emerald-400" />
                                                </div>
                                                <div>
                                                    <div className="text-base font-bold text-emerald-300 mb-1">Instant Execution</div>
                                                    <div className="text-sm text-slate-400">Run code in browser</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 group/item">
                                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/30 to-emerald-600/30 flex items-center justify-center group-hover/item:scale-110 group-hover/item:rotate-6 transition-all duration-300">
                                                    <Rocket className="w-7 h-7 text-emerald-400" />
                                                </div>
                                                <div>
                                                    <div className="text-base font-bold text-emerald-300 mb-1">Portfolio Ready</div>
                                                    <div className="text-sm text-slate-400">Showcase projects</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm text-slate-400 group-hover/content:text-emerald-400 transition-colors">
                                        <div className="relative w-3 h-3">
                                            <div className="absolute inset-0 rounded-full bg-emerald-500 animate-ping"></div>
                                            <div className="absolute inset-0 rounded-full bg-emerald-500"></div>
                                        </div>
                                        <span className="font-medium">Start building in minutes</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Final CTA */}
        <div className="mt-32 text-center">
                <div className="inline-block relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-500 via-purple-500 to-emerald-500 rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                    <button 
                        onClick={onStart}
                        className="relative px-12 py-6 text-xl font-black text-white bg-gradient-to-r from-brand-600 via-purple-600 to-emerald-600 rounded-3xl hover:scale-105 transition-all duration-500 shadow-2xl flex items-center gap-4 animate-gradient bg-[length:200%_auto]"
                    >
                        <Rocket className="w-7 h-7 group-hover:animate-bounce" />
                        Start Creating for Free
                        <ArrowRight className="w-7 h-7 group-hover:translate-x-2 transition-transform" />
                    </button>
                </div>
                
                <div className="mt-8 flex items-center justify-center gap-8 text-sm text-slate-400">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        <span>100% Free Forever</span>
                    </div>
                    <div className="h-4 w-px bg-slate-700"></div>
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        <span>No Credit Card</span>
                    </div>
                    <div className="h-4 w-px bg-slate-700"></div>
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        <span>Start in 30 Seconds</span>
                    </div>
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
