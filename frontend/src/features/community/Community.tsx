import { Clock, Flag, Flame, MessageSquare, MoreHorizontal, Plus, Share2, ThumbsUp, Trophy, User } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { communityService, Post } from '../../services/community.service';

export const Community = () => {
  const { token, user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState('hot');

  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [topic, setTopic] = useState('General');

  useEffect(() => {
    loadPosts();
  }, [token]);

  const loadPosts = async () => {
    try {
      // In a real app, we'd pass 'activeTab' to the backend to sort
      const data = await communityService.getPosts(token);
      setPosts(data);
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      const newPost = await communityService.createPost(token, title, content, topic);
      setPosts([newPost, ...posts]);
      setIsCreating(false);
      setTitle('');
      setContent('');
      setTopic('General');
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  const getTopicColor = (topic: string) => {
      switch (topic) {
          case 'Help Wanted': return 'text-red-400 bg-red-500/10 border-red-500/20';
          case 'Showcase': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
          case 'Career Advice': return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
          default: return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Main Feed (8 cols) */}
        <div className="lg:col-span-8">
            
            {/* Mobile Header / Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
                <h1 className="text-3xl font-bold text-white tracking-tight">Community Feed</h1>
                <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
                    {['hot', 'new', 'top'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                                activeTab === tab 
                                ? 'bg-slate-800 text-white shadow-sm' 
                                : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            {tab === 'hot' && <Flame className="w-4 h-4" />}
                            {tab === 'new' && <Clock className="w-4 h-4" />}
                            {tab === 'top' && <Trophy className="w-4 h-4" />}
                            <span className="capitalize hidden sm:inline">{tab}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Create Post Input (Collapsed) */}
            {!isCreating && (
                <div 
                    onClick={() => setIsCreating(true)}
                    className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 mb-6 cursor-pointer transition-all flex items-center gap-4 group"
                >
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 group-hover:bg-slate-700 group-hover:text-slate-300 transition-colors">
                        <User className="w-5 h-5" />
                    </div>
                    <input 
                        type="text" 
                        placeholder="Create a post..." 
                        className="bg-transparent border-none outline-none text-slate-400 placeholder:text-slate-500 flex-1 cursor-pointer"
                        readOnly
                    />
                    <div className="p-2 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-white transition-colors">
                        <Plus className="w-5 h-5" />
                    </div>
                </div>
            )}

            {/* Create Post Form (Expanded) */}
            {isCreating && (
                <div className="bg-slate-900 border border-slate-700/50 rounded-2xl p-6 mb-8 animate-in fade-in slide-in-from-top-2 shadow-2xl relative z-10">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-white">Share with the Community</h3>
                        <button onClick={() => setIsCreating(false)} className="text-slate-400 hover:text-white"><Plus className="w-5 h-5 rotate-45" /></button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <input 
                            type="text" 
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none font-medium text-lg placeholder:text-slate-600"
                            placeholder="Title of your post"
                            autoFocus
                            required
                        />
                        <div className="relative">
                            <textarea 
                                value={content}
                                onChange={e => setContent(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-4 text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none min-h-[160px] resize-none placeholder:text-slate-600 leading-relaxed"
                                placeholder="What's on your mind? You can use Markdown."
                                required
                            />
                        </div>
                        <div className="flex items-center justify-between pt-2">
                             <select 
                                value={topic}
                                onChange={e => setTopic(e.target.value)}
                                className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-300 focus:border-brand-500 outline-none cursor-pointer"
                            >
                                <option>General</option>
                                <option>Help Wanted</option>
                                <option>Showcase</option>
                                <option>Career Advice</option>
                            </select>
                            <div className="flex gap-3">
                                <button 
                                    type="button" 
                                    onClick={() => setIsCreating(false)}
                                    className="px-4 py-2 text-slate-400 hover:text-white text-sm font-medium"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="px-6 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg font-medium shadow-sm transition-all"
                                >
                                    Post
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            {/* Posts Feed */}
            <div className="space-y-4">
                {isLoading ? (
                    [1, 2, 3].map(i => (
                        <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-48 animate-pulse"></div>
                    ))
                ) : posts.length === 0 ? (
                    <div className="text-center py-20 bg-slate-900/50 border border-slate-800 border-dashed rounded-2xl">
                        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-500">
                             <MessageSquare className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-medium text-white">No discussion yet</h3>
                        <p className="text-slate-400">Be the first to create a post!</p>
                    </div>
                ) : (
                    posts.map(post => (
                        <div key={post.id} className="group bg-slate-900/40 backdrop-blur-sm hover:bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-1 transition-all cursor-pointer">
                            <div className="p-5 sm:p-6 flex gap-4">
                                {/* Voting (Sidebar Style) */}
                                <div className="hidden sm:flex flex-col items-center gap-1 min-w-[32px]">
                                    <button className="text-slate-500 hover:text-brand-400 transition-colors p-1 hover:bg-brand-500/10 rounded">
                                        <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] border-b-current"></div>
                                    </button>
                                    <span className="text-sm font-bold text-slate-300">{post.likes}</span>
                                    <button className="text-slate-500 hover:text-red-400 transition-colors p-1 hover:bg-red-500/10 rounded">
                                        <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[10px] border-t-current"></div>
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="flex-1">
                                    {/* Meta Header */}
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-[10px] font-bold text-white">
                                            {post.author_name?.[0]?.toUpperCase() || 'U'}
                                        </div>
                                        <span className="text-xs font-bold text-slate-300 hover:underline">{post.author_name}</span>
                                        <span className="text-xs text-slate-500">• {new Date(post.created_at).toLocaleDateString()}</span>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${getTopicColor(post.topic)} uppercase tracking-wide font-bold ml-auto sm:ml-2`}>
                                            {post.topic}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-semibold text-white mb-2 leading-snug group-hover:text-brand-400 transition-colors">
                                        {post.title}
                                    </h3>
                                    
                                    <div className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-3">
                                        {post.content}
                                    </div>

                                    {/* Actions Footer */}
                                    <div className="flex items-center gap-4 border-t border-slate-800/50 pt-3">
                                        {/* Mobile Vote (Visible only on small screens) */}
                                        <div className="flex sm:hidden items-center gap-1.5 bg-slate-800/50 rounded-full px-2 py-1">
                                            <ThumbsUp className="w-3.5 h-3.5 text-slate-400" />
                                            <span className="text-xs font-bold text-slate-300">{post.likes}</span>
                                        </div>

                                        <button className="flex items-center gap-2 text-slate-500 hover:text-slate-300 px-2 py-1 rounded-lg hover:bg-slate-800 transition-colors">
                                            <MessageSquare className="w-4 h-4" />
                                            <span className="text-xs font-medium">Comments</span>
                                        </button>
                                        <button className="flex items-center gap-2 text-slate-500 hover:text-slate-300 px-2 py-1 rounded-lg hover:bg-slate-800 transition-colors">
                                            <Share2 className="w-4 h-4" />
                                            <span className="text-xs font-medium">Share</span>
                                        </button>
                                        <button className="ml-auto text-slate-500 hover:text-slate-300 p-1 rounded-lg hover:bg-slate-800 transition-colors">
                                            <MoreHorizontal className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>

        {/* RIGHT COLUMN: Sidebar (4 cols) - Sticky */}
        <div className="hidden lg:block lg:col-span-4 space-y-6">
            
            {/* About Community Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sticky top-24">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-brand-500/10 rounded-xl flex items-center justify-center text-brand-400">
                        <Flame className="w-5 h-5" />
                    </div>
                    <h2 className="text-lg font-bold text-white">About Community</h2>
                </div>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                    The premier place for <strong>CodeFuture</strong> learners to discuss stack traces, share projects, and debug life together.
                </p>
                <div className="flex justify-between items-center border-t border-slate-800 pt-4 mb-6">
                    <div>
                        <div className="text-lg font-bold text-white">10.2k</div>
                        <div className="text-xs text-slate-500">Members</div>
                    </div>
                    <div>
                        <div className="text-lg font-bold text-white">150+</div>
                        <div className="text-xs text-slate-500">Online</div>
                    </div>
                </div>
                <button 
                    onClick={() => setIsCreating(true)}
                    className="w-full py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-200 transition-colors shadow-lg"
                >
                    Create Post
                </button>
            </div>

            {/* Trending Topics */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sticky top-[400px]">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Trending Topics</h3>
                <div className="space-y-4">
                    {['#reactjs', '#golang', '#career_advice', '#showcase'].map(tag => (
                        <div key={tag} className="flex justify-between items-center group cursor-pointer">
                            <span className="text-slate-300 group-hover:text-brand-400 transition-colors font-medium">{tag}</span>
                            <span className="text-xs px-2 py-1 bg-slate-800 rounded-full text-slate-500 group-hover:bg-brand-500/10 group-hover:text-brand-400 transition-all">24 posts</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Rules */}
             <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sticky top-[650px]">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Rules</h3>
                    <Flag className="w-4 h-4 text-slate-600" />
                </div>
                <ul className="space-y-3 text-sm text-slate-400">
                    <li className="flex gap-2">
                        <span className="font-bold text-slate-500">1.</span> Be kind and respectful.
                    </li>
                    <li className="flex gap-2">
                        <span className="font-bold text-slate-500">2.</span> No spam or self-promotion.
                    </li>
                    <li className="flex gap-2">
                        <span className="font-bold text-slate-500">3.</span> Use code blocks for code.
                    </li>
                </ul>
            </div>
        </div>

      </div>
    </div>
  );
};
