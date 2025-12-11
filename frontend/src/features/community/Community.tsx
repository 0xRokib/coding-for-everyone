import { MessageSquare, Plus, ThumbsUp, User } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { communityService, Post } from '../../services/community.service';

export const Community = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [topic, setTopic] = useState('General');

  useEffect(() => {
    loadPosts();
  }, [token]);

  const loadPosts = async () => {
    try {
      const data = await communityService.getPosts(token || undefined);
      setPosts(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      await communityService.createPost(token, title, content, topic);
      setIsCreating(false);
      setTitle('');
      setContent('');
      loadPosts(); // Reload feed
    } catch (error) {
      alert('Failed to post');
    }
  };

  if (!user && !isLoading) {
      return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
              <MessageSquare className="w-16 h-16 text-slate-700 mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Join the Conversation</h2>
              <p className="text-slate-400 mb-6">Log in to post questions and share your progress.</p>
              <button 
                onClick={() => navigate('/login')}
                className="px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-medium transition-all"
              >
                  Sign In to Join
              </button>
          </div>
      );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6 border-b border-slate-800 pb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Community Hub
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            Connect with fellow developers, share code, and grow together.
          </p>
        </div>
        <button 
          onClick={() => setIsCreating(!isCreating)}
          className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-lg transition-all font-medium border border-transparent shadow-sm hover:shadow-brand-500/20"
        >
          <Plus className="w-5 h-5" />
          <span>Start Discussion</span>
        </button>
      </div>

      {isCreating && (
        <div className="bg-slate-900 border border-slate-700/50 rounded-xl p-6 mb-12 animate-in fade-in slide-in-from-top-2">
          <h3 className="text-xl font-bold text-white mb-6">Create New Post</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-400 mb-2">Title</label>
                    <input 
                        type="text" 
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all placeholder:text-slate-600"
                        placeholder="e.g., How do I use React Effects?"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Topic</label>
                    <select 
                        value={topic}
                        onChange={e => setTopic(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
                    >
                        <option>General</option>
                        <option>Help Wanted</option>
                        <option>Showcase</option>
                        <option>Career Advice</option>
                    </select>
                </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Content</label>
              <textarea 
                value={content}
                onChange={e => setContent(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none min-h-[120px] transition-all placeholder:text-slate-600"
                placeholder="Share your thoughts..."
                required
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button 
                type="button" 
                onClick={() => setIsCreating(false)}
                className="px-5 py-2 text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-6 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg font-medium shadow-sm transition-all"
              >
                Publish Post
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-6">
        {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-slate-500">Loading discussion feed...</p>
            </div>
        ) : posts.length === 0 ? (
            <div className="text-center py-20 bg-slate-900/30 rounded-3xl border border-dashed border-slate-800">
                <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-600">
                    <MessageSquare className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">It's quiet here</h3>
                <p className="text-slate-400 max-w-sm mx-auto">Be the first to ask a question or share your project with the community.</p>
            </div>
        ) : (
            posts.map(post => (
                <div key={post.id} className="group relative bg-slate-900/40 backdrop-blur-sm border border-slate-800/60 hover:border-brand-500/30 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-brand-500/5 hover:-translate-y-1">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 flex items-center justify-center text-xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-brand-400 to-purple-400 shadow-inner">
                                {post.author_name ? post.author_name[0].toUpperCase() : <User className="w-5 h-5 text-slate-500" />}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-100 group-hover:text-brand-400 transition-colors">{post.title}</h3>
                                <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                                    <span className="font-medium text-slate-400">{post.author_name}</span>
                                    <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                                    <span>{new Date(post.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                            post.topic === 'Help Wanted' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                            post.topic === 'Showcase' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                            post.topic === 'Career Advice' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                            'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        }`}>
                            {post.topic}
                        </span>
                    </div>
                    
                    <div className="pl-16">
                        <p className="text-slate-300 leading-relaxed mb-6 whitespace-pre-wrap">
                            {post.content}
                        </p>
                        <div className="flex items-center gap-6 border-t border-slate-800/50 pt-4">
                            <button className="flex items-center gap-2 text-slate-500 hover:text-brand-400 transition-colors group/btn">
                                <div className="p-2 rounded-lg group-hover/btn:bg-brand-500/10 transition-colors">
                                    <ThumbsUp className="w-4 h-4" />
                                </div>
                                <span className="text-sm font-medium">{post.likes} Likes</span>
                            </button>
                            <button className="flex items-center gap-2 text-slate-500 hover:text-purple-400 transition-colors group/btn">
                                <div className="p-2 rounded-lg group-hover/btn:bg-purple-500/10 transition-colors">
                                    <MessageSquare className="w-4 h-4" />
                                </div>
                                <span className="text-sm font-medium">Reply</span>
                            </button>
                        </div>
                    </div>
                </div>
            ))
        )}
      </div>
    </div>
  );
};
