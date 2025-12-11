import { CheckCircle2, Circle, Lock } from 'lucide-react';

export const Roadmap = () => {
  const steps = [
    {
      title: 'Level 1: The Basics',
      description: 'Understand variables, loops, and logic. Build your first interactive script.',
      status: 'completed',
      topics: ['Variables', 'Data Types', 'Loops', 'Conditions']
    },
    {
      title: 'Level 2: Frontend Fundamentals',
      description: 'Learn to build beautiful interfaces with HTML, CSS, and basic JavaScript DOM.',
      status: 'in-progress',
      topics: ['HTML5', 'CSS3', 'Flexbox', 'DOM Manipulation']
    },
    {
      title: 'Level 3: Modern React',
      description: 'Build complex single-page applications with components and specific state management.',
      status: 'locked',
      topics: ['Components', 'Hooks', 'State', 'Props']
    },
    {
        title: 'Level 4: Backend Integration',
        description: 'Connect your app to the world with APIs and Databases.',
        status: 'locked',
        topics: ['APIs', 'Node.js', 'Databases', 'Auth']
     }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-white mb-4">Your Learning Roadmap</h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
            A structured path from beginner to pro. This roadmap adapts as you complete lessons.
        </p>
      </div>

      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-[28px] top-0 bottom-0 w-0.5 bg-slate-800"></div>

        <div className="space-y-12">
          {steps.map((step, index) => (
            <div key={index} className="relative flex gap-8 group">
              {/* Status Icon */}
              <div className={`relative z-10 w-14 h-14 rounded-full flex items-center justify-center border-4 bg-slate-900 transition-all ${
                step.status === 'completed' ? 'border-emerald-500 text-emerald-500 shadow-lg shadow-emerald-500/20' :
                step.status === 'in-progress' ? 'border-brand-500 text-brand-500 shadow-lg shadow-brand-500/20 animate-pulse' :
                'border-slate-700 text-slate-700'
              }`}>
                {step.status === 'completed' ? <CheckCircle2 className="w-6 h-6" /> :
                 step.status === 'locked' ? <Lock className="w-6 h-6" /> :
                 <Circle className="w-6 h-6 fill-current" />}
              </div>

              {/* Content Card */}
              <div className={`flex-1 p-6 rounded-2xl border transition-all ${
                step.status === 'locked' ? 'bg-slate-900/50 border-slate-800 opacity-70' :
                'bg-slate-900 border-slate-700 hover:border-brand-500/50'
              }`}>
                <div className="flex justify-between items-start mb-2">
                    <h3 className={`text-xl font-bold ${step.status === 'locked' ? 'text-slate-500' : 'text-white'}`}>
                        {step.title}
                    </h3>
                    {step.status === 'in-progress' && (
                        <span className="text-xs font-bold text-brand-400 bg-brand-500/10 px-3 py-1 rounded-full border border-brand-500/20">
                            CURRENT
                        </span>
                    )}
                </div>
                <p className="text-slate-400 mb-6">{step.description}</p>
                
                <div className="flex flex-wrap gap-2">
                    {step.topics.map(topic => (
                        <span key={topic} className="px-3 py-1 bg-slate-950 rounded-lg text-xs font-mono text-slate-500 border border-slate-800">
                            {topic}
                        </span>
                    ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
