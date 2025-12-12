
import {
    Bold as BoldIcon, BookOpen, Code as CodeIcon,
    Hash, Heart,
    Image as ImageIcon, Italic as ItalicIcon, Layout, Link as LinkIcon,
    List as ListIcon, MessageCircle, MessageSquare,
    PenTool, Search, Share2,
    Trophy,
    X
} from 'lucide-react';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { communityService, Post } from '../../services/community.service';

export const Community = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  
  // Editor State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [topic, setTopic] = useState('General');
  const [isPreview, setIsPreview] = useState(false);

  const [filter, setFilter] = useState('');

  useEffect(() => {
    loadPosts();
  }, [token, filter]);

  const loadPosts = async () => {
    setIsLoading(true);
    try {
      const data = await communityService.getPosts(token || undefined, filter);
      setPosts(data);
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return navigate('/login');
    if (!title.trim() || !content.trim()) return;

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

  const navItems = [
      { icon: Layout, label: 'Home', value: '' },
      { icon: Hash, label: 'WebDev', value: 'WebDev' },
      { icon: MessageCircle, label: 'General', value: 'General' },
      { icon: BookOpen, label: 'Help', value: 'Help' },
      { icon: Trophy, label: 'Showcase', value: 'Showcase' },
  ];

  return (
    <div className="min-h-full bg-slate-950 text-slate-200 font-sans selection:bg-brand-500/30">
       
       {/* Top Navigation Bar / Filter Header */}
       <div className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800">
           {/* ... Header Content ... */}
           <div className="max-w-[1400px] mx-auto px-4 h-16 flex items-center justify-between gap-4">
               <div className="flex items-center gap-4 flex-1 max-w-xl">
                   <div className="relative w-full group">
                       <input 
                           type="text" 
                           placeholder="Search..." 
                           className="w-full bg-slate-950 border border-slate-700/50 rounded-lg px-4 py-2 pl-10 text-sm focus:border-brand-500 outline-none transition-all placeholder:text-slate-600 group-hover:bg-slate-950/80"
                       />
                       <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500 group-focus-within:text-brand-400 transition-colors" />
                   </div>
               </div>
               
               <div className="flex items-center gap-3">
                   {user ? (
                       <button 
                         onClick={() => setIsCreating(true)}
                         className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-lg transition-all shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30 flex items-center gap-2"
                       >
                           <PenTool className="w-4 h-4" />
                           <span className="hidden sm:inline">Create Post</span>
                       </button>
                   ) : (
                       <button 
                         onClick={() => navigate('/login')}
                         className="px-4 py-2 border border-brand-500/50 text-brand-400 font-bold rounded-lg hover:bg-brand-500/10 transition-colors"
                       >
                           Log in to Post
                       </button>
                   )}
               </div>
           </div>
       </div>

       <div className="max-w-[1400px] mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-[240px_1fr_300px] gap-6">
           
           {/* Left Sidebar: Navigation */}
           <div className="hidden lg:block space-y-6">
               <div className="space-y-1">
                   {navItems.map((item) => (
                       <button 
                         key={item.label} 
                         onClick={() => setFilter(item.value)}
                         className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left group ${filter === item.value ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20' : 'text-slate-400 hover:bg-brand-500/10 hover:text-brand-300'}`}
                       >
                           <item.icon className={`w-5 h-5 group-hover:scale-110 transition-transform ${filter === item.value ? 'text-brand-400' : ''}`} />
                           <span className="font-medium">{item.label}</span>
                       </button>
                   ))}
               </div>

               <div className="pt-6 border-t border-slate-800">
                   <h3 className="px-4 text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Popular Tags</h3>
                   <div className="space-y-1">
                       {['WebDev', 'Career', 'Showcase'].map(tag => (
                           <button 
                             key={tag} 
                             onClick={() => setFilter(tag)}
                             className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors text-left text-sm"
                           >
                               <Hash className="w-4 h-4 text-slate-600" />
                               <span>{tag}</span>
                           </button>
                       ))}
                   </div>
               </div>
           </div>

           {/* Main Feed */}
           <div className="min-w-0">
               
               {/* Create Post Editor (Inline) */}
               {isCreating && (
                   <div className="mb-8 bg-slate-900 border border-slate-700/50 rounded-xl overflow-hidden animate-in slide-in-from-top-4 duration-300">
                       <div className="bg-slate-900/50 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
                           <h3 className="font-bold text-white">Create New Post</h3>
                           <button onClick={() => setIsCreating(false)} className="text-slate-500 hover:text-white"><X className="w-5 h-5"/></button>
                       </div>
                       
                       <div className="p-4">
                            <input 
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                placeholder="New post title here..."
                                className="w-full bg-transparent text-3xl font-black text-white placeholder:text-slate-600 border-none outline-none mb-4"
                                autoFocus
                            />
                            
                            <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
                                {['General', 'WebDev', 'Showcase', 'Help', 'Career'].map(t => (
                                    <button 
                                        key={t}
                                        onClick={() => setTopic(t)}
                                        className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${
                                            topic === t 
                                            ? 'bg-brand-500/20 border-brand-500 text-brand-400' 
                                            : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-600'
                                        }`}
                                    >
                                        #{t}
                                    </button>
                                ))}
                            </div>

                            <div className="bg-slate-950 rounded-lg border border-slate-800 overflow-hidden">
                                <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/50 px-2 py-1.5">
                                    <div className="flex items-center gap-1">
                                        <button 
                                            onClick={() => setIsPreview(false)}
                                            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${!isPreview ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
                                        >
                                            Write
                                        </button>
                                        <button 
                                            onClick={() => setIsPreview(true)}
                                            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${isPreview ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
                                        >
                                            Preview
                                        </button>
                                    </div>
                                    
                                    {!isPreview && (
                                        <div className="flex items-center gap-0.5 border-l border-slate-800 pl-2 ml-2">
                                            {[
                                                { icon: <BoldIcon className="w-3.5 h-3.5" />, label: 'Bold', token: '**', type: 'wrap' },
                                                { icon: <ItalicIcon className="w-3.5 h-3.5" />, label: 'Italic', token: '_', type: 'wrap' },
                                                { icon: <LinkIcon className="w-3.5 h-3.5" />, label: 'Link', token: '[Link](url)', type: 'replace' },
                                                { icon: <CodeIcon className="w-3.5 h-3.5" />, label: 'Code', token: '`', type: 'wrap' },
                                                { icon: <ListIcon className="w-3.5 h-3.5" />, label: 'List', token: '- ', type: 'prefix' },
                                                { icon: <ImageIcon className="w-3.5 h-3.5" />, label: 'Image', token: '![Alt](url)', type: 'replace' },
                                            ].map((btn, idx) => (
                                                <button
                                                    key={idx}
                                                    title={btn.label}
                                                    onClick={() => {
                                                        const textarea = document.getElementById('post-content') as HTMLTextAreaElement;
                                                        if (!textarea) return;
                                                        
                                                        const start = textarea.selectionStart;
                                                        const end = textarea.selectionEnd;
                                                        const text = textarea.value;
                                                        
                                                        let newText = text;
                                                        let newCursor = end;

                                                        if (btn.type === 'wrap') {
                                                            newText = text.substring(0, start) + btn.token + text.substring(start, end) + btn.token + text.substring(end);
                                                            newCursor = end + btn.token.length;
                                                        } else if (btn.type === 'prefix') {
                                                            newText = text.substring(0, start) + btn.token + text.substring(start);
                                                            newCursor = start + btn.token.length;
                                                        } else {
                                                            newText = text.substring(0, start) + btn.token + text.substring(end);
                                                            newCursor = start + btn.token.length;
                                                        }

                                                        setContent(newText);
                                                        // Note: Focus restoration would require simpler ref usage in real app, simplified here
                                                        setTimeout(() => {
                                                            textarea.focus();
                                                            textarea.setSelectionRange(newCursor, newCursor);
                                                        }, 0);
                                                    }}
                                                    className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                                                >
                                                    {btn.icon}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                {isPreview ? (
                                    <div className="p-4 min-h-[250px] prose prose-invert prose-sm max-w-none bg-slate-950/30">
                                        <ReactMarkdown>{content || '*Nothing to preview*'}</ReactMarkdown>
                                    </div>
                                ) : (
                                    <textarea 
                                        id="post-content"
                                        value={content}
                                        onChange={e => setContent(e.target.value)}
                                        placeholder="Write your masterpiece here..."
                                        className="w-full bg-transparent p-4 min-h-[250px] text-slate-200 placeholder:text-slate-600 border-none outline-none font-mono text-sm resize-y leading-relaxed"
                                    />
                                )}
                            </div>

                            <div className="flex justify-end pt-4 gap-3">
                                <button onClick={() => setIsCreating(false)} className="px-4 py-2 text-slate-400 font-bold hover:text-white transition-colors">Cancel</button>
                                <button onClick={handleSubmit} className="px-6 py-2 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-lg transition-colors shadow-lg shadow-brand-500/20">Publish</button>
                            </div>
                       </div>
                   </div>
               )}

               {/* Posts Feed */}
               <div className="space-y-4">
                   {isLoading ? (
                       [1, 2, 3].map(i => (
                           <div key={i} className="h-64 rounded-xl bg-slate-900 border border-slate-800 animate-pulse"></div>
                       ))
                   ) : posts.length === 0 ? (
                       <div className="text-center py-20 bg-slate-900/50 rounded-xl border border-slate-800 border-dashed">
                           <MessageSquare className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                           <h3 className="text-xl font-bold text-white mb-2">Community is quiet</h3>
                           <p className="text-slate-400">Be the first to start a discussion!</p>
                       </div>
                   ) : (
                       posts.map(post => (
                           <div key={post.id} className="group bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-black/50">
                               {/* Random Cover Gradient based on ID */}
                               {post.id % 3 === 0 && (
                                   <div className="h-32 w-full bg-gradient-to-r from-brand-600 via-purple-600 to-indigo-600 opacity-80 group-hover:opacity-100 transition-opacity"></div>
                               )}
                               
                               <div className="p-6">
                                   <div className="flex items-center gap-3 mb-4">
                                       <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sm font-bold text-white">
                                           {post.author_name?.[0]?.toUpperCase() || 'U'}
                                       </div>
                                       <div>
                                           <div className="font-bold text-white text-sm hover:text-brand-400 cursor-pointer">{post.author_name || 'Anonymous'}</div>
                                           <div className="text-xs text-slate-500">{new Date(post.created_at).toLocaleDateString()}</div>
                                       </div>
                                   </div>

                                   <div className="pl-0 sm:pl-12">
                                       <h2 className="text-2xl font-black text-white mb-3 hover:text-brand-400 cursor-pointer leading-tight">
                                           {post.title}
                                       </h2>
                                       
                                       <div className="flex flex-wrap gap-2 mb-4">
                                           <span className="text-sm text-slate-400 hover:text-brand-300 hover:bg-brand-500/10 px-1.5 py-0.5 rounded transition-colors cursor-pointer">#{post.topic.toLowerCase()}</span>
                                           <span className="text-sm text-slate-400 hover:text-purple-300 hover:bg-purple-500/10 px-1.5 py-0.5 rounded transition-colors cursor-pointer">#programming</span>
                                           <span className="text-sm text-slate-400 hover:text-emerald-300 hover:bg-emerald-500/10 px-1.5 py-0.5 rounded transition-colors cursor-pointer">#discuss</span>
                                       </div>

                                       <div className="flex items-center justify-between pt-2">
                                           <div className="flex items-center gap-6">
                                               <button className="flex items-center gap-2 text-slate-400 hover:text-white hover:bg-slate-800 px-2 py-1 rounded-lg transition-colors">
                                                   <Heart className="w-5 h-5" />
                                                   <span className="text-sm">{post.likes} <span className="hidden sm:inline">Reactions</span></span>
                                               </button>
                                               <button className="flex items-center gap-2 text-slate-400 hover:text-white hover:bg-slate-800 px-2 py-1 rounded-lg transition-colors">
                                                   <MessageCircle className="w-5 h-5" />
                                                   <span className="text-sm">Comments</span>
                                               </button>
                                           </div>
                                           
                                           <div className="flex items-center gap-2 text-xs text-slate-500">
                                               <span>3 min read</span>
                                               <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
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

           {/* Right Sidebar: Widgets */}
           <div className="hidden lg:block space-y-6">
               
               {/* Listings Widget */}
               <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                   <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                       <h3 className="font-bold text-white">#listings</h3>
                       <button className="text-xs text-brand-400 font-bold hover:underline">See all</button>
                   </div>
                   <div className="divide-y divide-slate-800">
                       <div className="p-4 hover:bg-slate-800/50 transition-colors cursor-pointer group">
                           <div className="text-sm font-medium text-slate-200 group-hover:text-brand-300 mb-1">Looking for Open Source contributors for AI project</div>
                           <div className="text-xs text-slate-500">Collabs</div>
                       </div>
                       <div className="p-4 hover:bg-slate-800/50 transition-colors cursor-pointer group">
                           <div className="text-sm font-medium text-slate-200 group-hover:text-brand-300 mb-1">Senior Go Developer Wanted (Remote)</div>
                           <div className="text-xs text-slate-500">Jobs</div>
                       </div>
                       <div className="p-4 hover:bg-slate-800/50 transition-colors cursor-pointer group">
                           <div className="text-sm font-medium text-slate-200 group-hover:text-brand-300 mb-1">Free eBook: Mastering System Design</div>
                           <div className="text-xs text-slate-500">Education</div>
                       </div>
                   </div>
                   <div className="p-3 text-center border-t border-slate-800">
                       <button className="text-xs font-bold text-white hover:text-brand-400">Create a Listing</button>
                   </div>
               </div>

               {/* Discuss Widget */}
               <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                   <div className="p-4 border-b border-slate-800">
                       <h3 className="font-bold text-white">#discuss</h3>
                   </div>
                   <div className="divide-y divide-slate-800">
                       <div className="p-4 hover:bg-slate-800/50 transition-colors cursor-pointer">
                           <div className="text-sm font-medium text-slate-200 hover:text-brand-300">What was your big "Aben" moment in coding?</div>
                           <div className="mt-1 text-xs text-slate-500">45 comments</div>
                       </div>
                       <div className="p-4 hover:bg-slate-800/50 transition-colors cursor-pointer">
                           <div className="text-sm font-medium text-slate-200 hover:text-brand-300">Rust vs Go in 2025: Thoughts?</div>
                           <div className="mt-1 text-xs text-slate-500">12 comments</div>
                       </div>
                   </div>
               </div>

           </div>

       </div>
    </div>
  );
};
