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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Community Feed</h1>
          <p className="text-slate-400">Ask questions, share wins, and help others.</p>
        </div>
        <button 
          onClick={() => setIsCreating(!isCreating)}
          className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          New Post
        </button>
      </div>

      {isCreating && (
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 mb-8 animate-in fade-in slide-in-from-top-4">
          <h3 className="text-lg font-bold text-white mb-4">Create a Post</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Title</label>
              <input 
                type="text" 
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-brand-500 outline-none"
                placeholder="What's on your mind?"
                required
              />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Topic</label>
                <select 
                    value={topic}
                    onChange={e => setTopic(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-brand-500 outline-none"
                >
                    <option>General</option>
                    <option>Help Wanted</option>
                    <option>Showcase</option>
                    <option>Career Advice</option>
                </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Content</label>
              <textarea 
                value={content}
                onChange={e => setContent(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-brand-500 outline-none min-h-[100px]"
                placeholder="Share more details..."
                required
              />
            </div>
            <div className="flex justify-end gap-3">
              <button 
                type="button" 
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-6 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg"
              >
                Post
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {isLoading ? (
            <div className="text-center py-12 text-slate-500">Loading posts...</div>
        ) : posts.length === 0 ? (
            <div className="text-center py-12 bg-slate-900/50 rounded-2xl border border-slate-800">
                <p className="text-slate-400">No posts yet. Be the first to start a discussion!</p>
            </div>
        ) : (
            posts.map(post => (
                <div key={post.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center text-brand-400 font-bold">
                                {post.author_name ? post.author_name[0].toUpperCase() : <User className="w-5 h-5" />}
                            </div>
                            <div>
                                <h3 className="font-semibold text-white">{post.title}</h3>
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <span>{post.author_name}</span>
                                    <span>•</span>
                                    <span>{new Date(post.created_at).toLocaleDateString()}</span>
                                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">{post.topic}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <p className="text-slate-300 leading-relaxed mb-6">
                        {post.content}
                    </p>
                    <div className="flex items-center gap-4 text-slate-500">
                        <button className="flex items-center gap-2 hover:text-brand-400 transition-colors">
                            <ThumbsUp className="w-4 h-4" />
                            <span className="text-sm">{post.likes} Likes</span>
                        </button>
                        <button className="flex items-center gap-2 hover:text-brand-400 transition-colors">
                            <MessageSquare className="w-4 h-4" />
                            <span className="text-sm">Reply</span>
                        </button>
                    </div>
                </div>
            ))
        )}
      </div>
    </div>
  );
};
