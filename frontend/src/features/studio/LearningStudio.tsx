import Editor from '@monaco-editor/react';
import { ArrowLeft, ArrowRight, BookOpen, Lightbulb, MessageSquare, Play, Send, Sparkles, Terminal } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { chatWithTutor, simulateCodeExecution } from '../../services/gemini';
import { Lesson, UserPersona } from '../../types';

interface LearningStudioProps {
  user: any;
}

export const LearningStudio: React.FC<LearningStudioProps> = ({ user }) => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatting, setIsChatting] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);

  useEffect(() => {
    loadCourse();
  }, [courseId]);

  const loadCourse = async () => {
    try {
      if (!token || !courseId) return;
      
      const response = await fetch(`http://localhost:8081/api/courses`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const courses = await response.json();
      const course = courses.find((c: any) => c.id === parseInt(courseId || '0'));
      
      if (course && course.curriculum) {
        const curriculum = typeof course.curriculum === 'string' 
          ? JSON.parse(course.curriculum) 
          : course.curriculum;
        
        setLessons(curriculum.lessons || []);
        if (curriculum.lessons && curriculum.lessons.length > 0) {
          setCurrentLesson(curriculum.lessons[0]);
          setCode(curriculum.lessons[0].initialCode || '');
          setCurrentLessonIndex(0);
        }
      }
    } catch (error) {
      console.error('Failed to load course:', error);
    }
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput('Running code...');
    
    try {
      const result = await simulateCodeExecution(
        code,
        'javascript'
      );
      setOutput(result);
    } catch (error) {
      setOutput(`Error: ${error}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    
    const userMessage = { role: 'user', content: chatInput };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsChatting(true);
    
    try {
      // Convert chat messages to the format expected by the API
      const history = chatMessages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' as const : 'user' as const,
        text: msg.content
      }));
      
      const response = await chatWithTutor(
        chatInput,
        history,
        user?.persona || UserPersona.PROFESSIONAL,
        code
      );
      
      setChatMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setIsChatting(false);
    }
  };

  const handleNextLesson = () => {
    if (currentLessonIndex < lessons.length - 1) {
      const nextIndex = currentLessonIndex + 1;
      setCurrentLessonIndex(nextIndex);
      setCurrentLesson(lessons[nextIndex]);
      setCode(lessons[nextIndex].initialCode || '');
      setOutput('');
      setChatMessages([]);
    }
  };

  const handlePrevLesson = () => {
    if (currentLessonIndex > 0) {
      const prevIndex = currentLessonIndex - 1;
      setCurrentLessonIndex(prevIndex);
      setCurrentLesson(lessons[prevIndex]);
      setCode(lessons[prevIndex].initialCode || '');
      setOutput('');
      setChatMessages([]);
    }
  };

  if (!currentLesson) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading course...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-slate-900 flex flex-col overflow-hidden">
      {/* Top Navigation Bar */}
      <div className="bg-slate-950 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/course/${courseId}`)}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-white">
              Lesson {currentLessonIndex + 1}: {currentLesson.title}
            </h1>
            <p className="text-sm text-slate-400">
              {currentLessonIndex + 1} of {lessons.length} lessons
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrevLesson}
            disabled={currentLessonIndex === 0}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </button>
          
          <button
            onClick={handleNextLesson}
            disabled={currentLessonIndex === lessons.length - 1}
            className="px-4 py-2 bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-semibold"
          >
            Next Lesson
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Instructions */}
        <div className="w-2/5 bg-slate-900 border-r border-slate-800 flex flex-col overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-slate-800">
            <button
              onClick={() => setShowChat(false)}
              className={`flex-1 px-6 py-3 font-medium transition-colors flex items-center justify-center gap-2 ${
                !showChat 
                  ? 'bg-slate-800 text-white border-b-2 border-brand-500' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Instructions
            </button>
            <button
              onClick={() => setShowChat(true)}
              className={`flex-1 px-6 py-3 font-medium transition-colors flex items-center justify-center gap-2 ${
                showChat 
                  ? 'bg-slate-800 text-white border-b-2 border-brand-500' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              AI Assistant
              {chatMessages.length > 0 && (
                <span className="bg-brand-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {chatMessages.length}
                </span>
              )}
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {!showChat ? (
              <div className="p-6 space-y-6">
                {/* Lesson Content */}
                <div className="prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown>{currentLesson.content}</ReactMarkdown>
                </div>

                {/* Hints Section */}
                <div className="bg-brand-500/10 border border-brand-500/20 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-brand-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-white mb-2">💡 Hint</h3>
                      <p className="text-sm text-slate-300">
                        Try running the code first to see what happens. Then modify it to experiment!
                      </p>
                    </div>
                  </div>
                </div>

                {/* Progress */}
                <div className="bg-slate-800 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-300">Course Progress</span>
                    <span className="text-sm font-bold text-brand-400">
                      {Math.round(((currentLessonIndex + 1) / lessons.length) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-brand-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${((currentLessonIndex + 1) / lessons.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col h-full">
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {chatMessages.length === 0 ? (
                    <div className="text-center py-12">
                      <Sparkles className="w-12 h-12 text-brand-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-white mb-2">AI Coding Assistant</h3>
                      <p className="text-slate-400 text-sm">
                        Ask me anything about the code or lesson!
                      </p>
                    </div>
                  ) : (
                    chatMessages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                            msg.role === 'user'
                              ? 'bg-brand-600 text-white'
                              : 'bg-slate-800 text-slate-100'
                          }`}
                        >
                        <div className="prose prose-sm prose-invert">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                        </div>
                      </div>
                    ))
                  )}
                  {isChatting && (
                    <div className="flex justify-start">
                      <div className="bg-slate-800 rounded-2xl px-4 py-3">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Chat Input */}
                <div className="p-4 border-t border-slate-800">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Ask a question..."
                      className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none"
                      disabled={isChatting}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={isChatting || !chatInput.trim()}
                      className="px-4 py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Code Editor & Output */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Code Editor */}
          <div className="flex-1 flex flex-col bg-slate-950">
            <div className="bg-slate-900 px-6 py-3 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
                <Terminal className="w-4 h-4" />
                Code Editor
              </div>
              <button
                onClick={handleRunCode}
                disabled={isRunning}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white rounded-lg transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20"
              >
                <Play className="w-4 h-4" />
                {isRunning ? 'Running...' : 'Run Code'}
              </button>
            </div>
            
            <div className="flex-1">
              <Editor
                height="100%"
                defaultLanguage="javascript"
                value={code}
                onChange={(value) => setCode(value || '')}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  roundedSelection: true,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                  wordWrap: 'on',
                }}
              />
            </div>
          </div>

          {/* Output Console */}
          <div className="h-48 bg-slate-950 border-t border-slate-800 flex flex-col">
            <div className="bg-slate-900 px-6 py-3 border-b border-slate-800 flex items-center gap-2 text-sm font-medium text-slate-300">
              <Terminal className="w-4 h-4" />
              Output
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {output ? (
                <pre className="text-sm text-slate-100 font-mono whitespace-pre-wrap">
                  {output}
                </pre>
              ) : (
                <div className="text-slate-500 text-sm italic">
                  Click "Run Code" to see the output here...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
