import { Bold, Clock, Code, Eye, Flame, Heading, Italic, Link as LinkIcon, List, MessageSquare, PenTool, Share2, Terminal, ThumbsUp, Trash2, Trophy } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '../../context/AuthContext';
import { communityService, Post } from '../../services/community.service';

const MarkdownEditor = ({ value, onChange, placeholder }: { value: string, onChange: (val: string) => void, placeholder: string }) => {
    const [isPreview, setIsPreview] = useState(false);

    const insertFormat = (prefix: string, suffix: string = '') => {
        const textarea = document.getElementById('post-content') as HTMLTextAreaElement;
        if (!textarea) return;
        
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const before = text.substring(0, start);
        const selection = text.substring(start, end);
        const after = text.substring(end);

        const newText = before + prefix + (selection || 'text') + suffix + after;
        onChange(newText);
        
        // Restore focus (timeout needed for React render cycle)
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + prefix.length, end + prefix.length);
        }, 0);
    };

    return (
        <div className="border border-slate-700 rounded-xl overflow-hidden bg-slate-950/50">
            <div className="flex items-center justify-between px-2 py-2 bg-slate-900 border-b border-slate-700">
                <div className="flex gap-1">
                    <button 
                        type="button"
                        onClick={() => setIsPreview(false)}
                        className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${!isPreview ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                        Write
                    </button>
                    <button 
                        type="button"
                        onClick={() => setIsPreview(true)}
                        className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${isPreview ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                        Preview
                    </button>
                </div>
                {!isPreview && (
                    <div className="flex items-center gap-1 border-l border-slate-700 pl-2">
                        <button type="button" onClick={() => insertFormat('**', '**')} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded" title="Bold"><Bold className="w-4 h-4" /></button>
                        <button type="button" onClick={() => insertFormat('*', '*')} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded" title="Italic"><Italic className="w-4 h-4" /></button>
                        <button type="button" onClick={() => insertFormat('[', '](url)')} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded" title="Link"><LinkIcon className="w-4 h-4" /></button>
                        <button type="button" onClick={() => insertFormat('`', '`')} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded" title="Inline Code"><Code className="w-4 h-4" /></button>
                        <button type="button" onClick={() => insertFormat('```\n', '\n```')} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded" title="Code Block"><Terminal className="w-4 h-4" /></button>
                        <button type="button" onClick={() => insertFormat('### ')} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded" title="Heading"><Heading className="w-4 h-4" /></button>
                        <button type="button" onClick={() => insertFormat('- ')} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded" title="List"><List className="w-4 h-4" /></button>
                    </div>
                )}
            </div>

            {isPreview ? (
                <div className="p-4 min-h-[200px] prose prose-invert max-w-none text-slate-300">
                    {value ? <ReactMarkdown>{value}</ReactMarkdown> : <p className="text-slate-500 italic">Nothing to preview</p>}
                </div>
            ) : (
                <textarea
                    id="post-content"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full bg-slate-950 p-4 min-h-[200px] outline-none text-slate-200 placeholder:text-slate-600 font-mono text-sm resize-y"
                    required
                />
            )}
        </div>
    );
};

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
        if (!title.trim() || !content.trim()) return;
        
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
            
            {/* Header + Actions */}
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

            {/* Create Post Interaction */}
            {!isCreating ? (
                <div 
                    onClick={() => setIsCreating(true)}
                    className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 mb-8 cursor-pointer transition-all flex items-center gap-4 group"
                >
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 group-hover:bg-brand-500/10 group-hover:text-brand-400 transition-colors">
                        <PenTool className="w-5 h-5" />
                    </div>
                    <span className="text-slate-400 font-medium group-hover:text-slate-300">Write something amazing...</span>
                </div>
            ) : (
                <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 mb-8 animate-in fade-in zoom-in-95 duration-200 shadow-2xl">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-white">Create Post</h3>
                        <button onClick={() => setIsCreating(false)} className="text-slate-400 hover:text-white"><Trash2 className="w-5 h-5" /></button>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                             <input 
                                type="text" 
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                className="w-full bg-transparent border-b border-slate-700 px-0 py-2 text-3xl font-bold text-white focus:border-brand-500 outline-none placeholder:text-slate-600 transition-colors"
                                placeholder="New post title here..."
                                autoFocus
                                required
                            />
                        </div>

                         <div className="flex gap-2 mb-2">
                             {['General', 'Help Wanted', 'Showcase', 'Career Advice'].map(t => (
                                 <button
                                    type="button"
                                    key={t}
                                    onClick={() => setTopic(t)}
                                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                                        topic === t 
                                        ? 'bg-brand-500/20 border-brand-500 text-brand-400' 
                                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'
                                    }`}
                                 >
                                     #{t.replace(' ', '')}
                                 </button>
                             ))}
                         </div>

                        <MarkdownEditor 
                            value={content} 
                            onChange={setContent} 
                            placeholder="Write your post content here... You can use formatting to structure your thoughts!" 
                        />

                        <div className="flex justify-end gap-3 pt-2">
                            <button 
                                type="button" 
                                onClick={() => setIsCreating(false)}
                                className="px-5 py-2.5 text-slate-400 hover:text-white font-medium"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit"
                                className="px-8 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-lg font-bold shadow-lg shadow-brand-500/20 transition-all hover:scale-[1.02]"
                            >
                                Publish
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Posts Feed */}
            <div className="space-y-4">
                {isLoading ? (
                    <div className="space-y-4">
                         {[1, 2, 3].map(i => (
                            <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-48 animate-pulse"></div>
                        ))}
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-20 bg-slate-900 border border-slate-800 border-dashed rounded-2xl">
                        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-500">
                             <MessageSquare className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No posts yet</h3>
                        <p className="text-slate-400 max-w-sm mx-auto">The feed is empty. Be the first to start a conversation!</p>
                    </div>
                ) : (
                    posts.map(post => (
                        <div key={post.id} className="group bg-slate-900 border border-slate-800 hover:border-brand-500/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-brand-500/5">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-sm font-bold text-white border border-slate-600 shadow-inner flex-shrink-0">
                                    {post.author_name?.[0]?.toUpperCase() || 'U'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-bold text-slate-200 hover:text-brand-400 cursor-pointer">{post.author_name}</span>
                                        <span className="text-xs text-slate-500">• {new Date(post.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <h2 className="text-2xl font-bold text-white mb-3 leading-tight group-hover:text-brand-400 transition-colors cursor-pointer">
                                        {post.title}
                                    </h2>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                         <span className={`text-[10px] px-2 py-0.5 rounded border ${getTopicColor(post.topic)} uppercase font-bold`}>
                                            #{post.topic.replace(/\s+/g, '')}
                                        </span>
                                    </div>
                                    
                                    {/* Render Content Preview properly */}
                                    <div className="prose prose-invert prose-sm max-w-none text-slate-400 mb-6 line-clamp-4">
                                        <ReactMarkdown>{post.content}</ReactMarkdown>
                                    </div>

                                    <div className="flex items-center justify-between border-t border-slate-800 pt-4">
                                        <div className="flex items-center gap-6">
                                             <button className="flex items-center gap-2 text-slate-400 hover:text-brand-400 transition-colors text-sm font-medium">
                                                <ThumbsUp className="w-4 h-4" />
                                                <span>{post.likes} <span className="hidden sm:inline">Reactions</span></span>
                                            </button>
                                            <button className="flex items-center gap-2 text-slate-400 hover:text-brand-400 transition-colors text-sm font-medium">
                                                <MessageSquare className="w-4 h-4" />
                                                <span><span className="hidden sm:inline">Add</span> Comment</span>
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-500 text-sm">
                                            <span className="flex items-center gap-1">
                                                <Eye className="w-4 h-4" /> 120
                                            </span>
                                             <button className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors">
                                                <Share2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>

        {/* RIGHT COLUMN: Sidebar (Sticky) */}
        <div className="hidden lg:block lg:col-span-4 space-y-6">
             {/* Profile Card */}
             {user && (
                 <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-brand-600 rounded-full flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-brand-500/20">
                            {user.name[0].toUpperCase()}
                        </div>
                        <div>
                            <div className="font-bold text-white text-lg">{user.name}</div>
                            <div className="text-slate-400 text-sm">@{user.name.toLowerCase().replace(' ', '')}</div>
                        </div>
                    </div>
                    <button className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors border border-slate-700">
                        View Profile
                    </button>
                 </div>
             )}

            {/* Trending */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sticky top-24">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                    <Flame className="w-5 h-5 text-orange-500" />
                    Trending Discussions
                </h3>
                <div className="space-y-4">
                     {[1, 2, 3].map(i => (
                        <div key={i} className="group cursor-pointer">
                            <div className="text-slate-300 font-medium group-hover:text-brand-400 transition-colors line-clamp-2">
                                The future of React 19: Everything you need to know
                            </div>
                            <div className="text-slate-500 text-xs mt-1">124 comments</div>
                        </div>
                     ))}
                </div>
            </div>

            {/* Rules */}
             <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sticky top-80">
                <h3 className="font-bold text-white mb-4">Community Rules</h3>
                <ul className="space-y-3 text-sm text-slate-400">
                    <li className="flex gap-2">
                        <div className="min-w-[4px] h-4 bg-brand-500 rounded-full mt-0.5"></div>
                        Be respectful and kind
                    </li>
                    <li className="flex gap-2">
                         <div className="min-w-[4px] h-4 bg-brand-500 rounded-full mt-0.5"></div>
                        No spam or self-promotion
                    </li>
                    <li className="flex gap-2">
                         <div className="min-w-[4px] h-4 bg-brand-500 rounded-full mt-0.5"></div>
                        Use code blocks for sharing code
                    </li>
                </ul>
            </div>
        </div>

      </div>
    </div>
  );
};
