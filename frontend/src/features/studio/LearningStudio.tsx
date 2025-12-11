import { BookOpen, CheckCircle, Code2, Lightbulb, MessageSquare, Play, Send, Terminal } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { chatWithTutor, simulateCodeExecution } from '../../services/gemini';
import { Lesson, User, UserPersona } from '../../types';

interface LearningStudioProps {
  user: User;
}

export const LearningStudio: React.FC<LearningStudioProps> = ({ user }) => {
  // Provide defaults for UserProfile fields that may not exist on basic User type
  const userPersona = UserPersona.STUDENT; // Default persona
  const currentCurriculum = undefined; // Will be loaded from backend or onboarding
  const programmingLanguage = currentCurriculum?.language || 'python';
  
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'model', text: string}[]>([
    { role: 'model', text: `Hi ${user.name}! 👋 I'm here to help you learn **${programmingLanguage}**. Ask me anything when you need help!` }
  ]);
  const [isRunning, setIsRunning] = useState(false);
  const [isChatting, setIsChatting] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const lessons = currentCurriculum?.lessons || [];
  const currentLesson = lessons[currentLessonIndex] || { title: "Loading...", content: "No lessons found.", initialCode: "" };

  useEffect(() => {
    if (currentLesson) {
        setCode(currentLesson.initialCode || "");
    }
  }, [currentLessonIndex, currentLesson]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput('Running...');
    const result = await simulateCodeExecution(code, programmingLanguage);
    setOutput(result);
    setIsRunning(false);
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    
    const userMsg = chatInput;
    setChatInput('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsChatting(true);

    const helperHistory = chatHistory.map(h => ({ role: h.role, text: h.text }));
    
    const response = await chatWithTutor(userMsg, helperHistory, userPersona, code);
    
    setChatHistory(prev => [...prev, { role: 'model', text: response }]);
    setIsChatting(false);
  };


  return (
    <div className="grid grid-cols-12 gap-4 h-[calc(100vh-120px)] p-4">
      {/* Lesson Panel - Left Sidebar */}
      <div className="col-span-3 bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-2xl border border-slate-700/50 overflow-hidden flex flex-col backdrop-blur-sm shadow-xl">
        <div className="p-4 border-b border-slate-700/50 bg-slate-900/50 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-brand-400" />
            <h2 className="font-semibold text-slate-100">Lessons</h2>
            <span className="ml-auto text-xs text-slate-500">{currentLessonIndex + 1}/{lessons.length}</span>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Current Lesson Content */}
            <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/30">
              <h3 className="text-lg font-bold mb-2 text-white flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                {currentLesson.title}
              </h3>
              <div className="prose prose-invert prose-sm max-w-none text-slate-300">
                  <ReactMarkdown>{currentLesson.content}</ReactMarkdown>
              </div>
            </div>
            
            {/* Lesson List */}
            <div>
                <h4 className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider px-2">All Lessons</h4>
                 <div className="space-y-1.5">
                    {lessons.map((l: Lesson, idx: number) => (
                        <button 
                            key={l.id}
                            onClick={() => setCurrentLessonIndex(idx)}
                            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm flex items-center gap-3 transition-all ${
                              idx === currentLessonIndex 
                                ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40 shadow-lg shadow-brand-500/10' 
                                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                            }`}
                        >
                            {idx < currentLessonIndex ? (
                              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                            ) : idx === currentLessonIndex ? (
                              <div className="w-4 h-4 rounded-full border-2 border-brand-400 flex-shrink-0" />
                            ) : (
                              <div className="w-4 h-4 rounded-full border border-slate-600 flex-shrink-0" />
                            )}
                            <span className="truncate">{l.title}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
      </div>

      {/* Code Editor & Output - Center */}
      <div className="col-span-6 flex flex-col gap-4">
        {/* Code Editor */}
        <div className="bg-slate-900 rounded-2xl border border-slate-700/50 overflow-hidden flex-1 flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-4 py-3 bg-slate-950/80 border-b border-slate-800 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 text-sm font-mono">
                      <Code2 className="w-4 h-4" />
                      main.{programmingLanguage === 'python' ? 'py' : 'js'}
                  </div>
                </div>
                <button 
                    onClick={handleRunCode}
                    disabled={isRunning}
                    className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white rounded-lg text-sm font-medium transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                >
                    {isRunning ? <span className="animate-spin">⌛</span> : <Play className="w-4 h-4 fill-current" />}
                    {isRunning ? 'Running...' : 'Run Code'}
                </button>
            </div>
            
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 w-full bg-[#0d1117] text-slate-300 font-mono text-sm p-6 resize-none outline-none leading-relaxed border-0"
              spellCheck={false}
              placeholder="// Write your code here..."
              style={{ 
                caretColor: '#60a5fa',
                fontFamily: '"Fira Code", "Consolas", "Monaco", monospace'
              }}
            />
        </div>

        {/* Output Console */}
        <div className="h-48 bg-slate-950 rounded-2xl border border-slate-800/50 overflow-hidden flex flex-col shadow-xl">
             <div className="px-4 py-2.5 border-b border-slate-800 bg-slate-900/50 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-semibold text-slate-300">Output</span>
            </div>
            <div className="flex-1 p-4 font-mono text-sm text-slate-300 whitespace-pre-wrap overflow-y-auto bg-[#0d1117]">
                {output || <span className="text-slate-600 italic">Click "Run Code" to see the output...</span>}
            </div>
        </div>
      </div>

      {/* AI Chat - Right Sidebar */}
      <div className="col-span-3 bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-2xl border border-slate-700/50 overflow-hidden flex flex-col backdrop-blur-sm shadow-xl">
        <div className="p-4 border-b border-slate-700/50 bg-slate-900/50 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-brand-400" />
            <h2 className="font-semibold text-slate-100">AI Helper</h2>
            <div className="ml-auto">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatHistory.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-lg ${
                        msg.role === 'user' 
                        ? 'bg-gradient-to-br from-brand-600/30 to-brand-700/30 text-brand-50 border border-brand-500/40' 
                        : 'bg-slate-700/60 text-slate-100 border border-slate-600/40'
                    }`}>
                        <div className="prose prose-invert prose-sm max-w-none">
                          <ReactMarkdown>{msg.text}</ReactMarkdown>
                        </div>
                    </div>
                </div>
            ))}
            {isChatting && (
                <div className="flex justify-start">
                     <div className="bg-slate-700/60 rounded-2xl px-4 py-3 border border-slate-600/40">
                        <span className="flex gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"></span>
                            <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{animationDelay: '0.1s'}}></span>
                            <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{animationDelay: '0.2s'}}></span>
                        </span>
                     </div>
                </div>
            )}
            <div ref={chatEndRef} />
        </div>

        <div className="p-4 bg-slate-900/50 border-t border-slate-700/50">
            <div className="flex gap-2">
              <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all placeholder:text-slate-500"
              />
              <button
                onClick={handleSendMessage}
                disabled={!chatInput.trim() || isChatting}
                className="px-4 py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-500/20"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-2 text-center">Press Enter to send • Shift+Enter for new line</p>
        </div>
      </div>
    </div>
  );
};
