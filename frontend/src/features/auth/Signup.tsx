import { AlertCircle, ArrowRight, Loader2, Lock, Mail, Sparkles, Star, User } from 'lucide-react';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/auth.service';

export const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { token, user } = await authService.signup(name, email, password);
      login(token, user);
      navigate('/onboarding');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    // Redirect to backend for real OAuth
    window.location.href = `http://localhost:8081/api/auth/${provider}/login`;
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left Column: Testimonial & Benefits */}
      <div className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden bg-slate-900 border-r border-slate-800">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-600/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10">
            <Link to="/" className="flex items-center gap-2 mb-2 hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
                    <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-xl tracking-tight text-white">CodeFuture</span>
            </Link>
        </div>

        <div className="relative z-10 max-w-lg">
            <div className="mb-12">
                <div className="flex gap-1 text-yellow-400 mb-4">
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                </div>
                <blockquote className="text-2xl font-medium text-white mb-6 leading-relaxed">
                    "This platform completely changed how I learn. The AI mentorship feels like having a senior engineer by my side 24/7."
                </blockquote>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                        <User className="w-6 h-6 text-slate-400" />
                    </div>
                    <div>
                        <div className="font-semibold text-white">Alex Morgan</div>
                        <div className="text-slate-400 text-sm">Full Stack Developer</div>
                    </div>
                </div>
            </div>
            
            <div className="flex gap-8 border-t border-slate-800 pt-8">
                <div>
                    <div className="text-3xl font-bold text-white mb-1">10k+</div>
                    <div className="text-slate-500 text-sm">Active Learners</div>
                </div>
                <div>
                    <div className="text-3xl font-bold text-white mb-1">500+</div>
                    <div className="text-slate-500 text-sm">Daily Projects</div>
                </div>
            </div>
        </div>

        <div className="relative z-10 text-sm text-slate-500">
            © 2025 CodeFuture Academy. All rights reserved.
        </div>
      </div>

      {/* Right Column: Sign Up Form */}
      <div className="flex items-center justify-center p-6 bg-slate-950">
        <div className="w-full max-w-md space-y-8">
            <div className="text-center lg:text-left">
                <h1 className="text-3xl font-bold text-white tracking-tight">Create an account</h1>
                <p className="mt-2 text-slate-400">Join thousands of developers leveling up their skills.</p>
            </div>

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm animate-shake">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Full Name</label>
                    <div className="relative group">
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 pl-11 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 outline-none transition-all group-hover:border-slate-600"
                            placeholder="John Doe"
                            required
                        />
                        <User className="w-5 h-5 text-slate-500 absolute left-4 top-3.5 transition-colors group-focus-within:text-brand-400" />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Email Address</label>
                    <div className="relative group">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 pl-11 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 outline-none transition-all group-hover:border-slate-600"
                            placeholder="name@example.com"
                            required
                        />
                        <Mail className="w-5 h-5 text-slate-500 absolute left-4 top-3.5 transition-colors group-focus-within:text-brand-400" />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Password</label>
                    <div className="relative group">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 pl-11 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 outline-none transition-all group-hover:border-slate-600"
                            placeholder="Create a password (min. 8 chars)"
                            required
                            minLength={8}
                        />
                        <Lock className="w-5 h-5 text-slate-500 absolute left-4 top-3.5 transition-colors group-focus-within:text-brand-400" />
                    </div>
                    {/* Password Strength Indicator (Simplified) */}
                    <div className="flex gap-1 h-1 mt-2">
                        <div className={`flex-1 rounded-full ${password.length > 0 ? 'bg-red-500' : 'bg-slate-800'}`}></div>
                        <div className={`flex-1 rounded-full ${password.length > 6 ? 'bg-yellow-500' : 'bg-slate-800'}`}></div>
                        <div className={`flex-1 rounded-full ${password.length > 10 ? 'bg-emerald-500' : 'bg-slate-800'}`}></div>
                    </div>
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-start gap-3">
                    <div className="flex items-center h-5">
                        <input
                            id="terms"
                            type="checkbox"
                            required
                            className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-brand-500 focus:ring-brand-500 focus:ring-offset-0"
                        />
                    </div>
                    <label htmlFor="terms" className="text-sm text-slate-400">
                        I agree to the <a href="#" className="text-brand-400 hover:text-brand-300">Terms of Service</a> and <a href="#" className="text-brand-400 hover:text-brand-300">Privacy Policy</a>
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-brand-600 hover:bg-brand-500 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                >
                    {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            Create account
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>
            </form>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-800"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-slate-950 px-2 text-slate-500">Or continue with</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <button 
                  type="button"
                  onClick={() => handleSocialLogin('google')}
                  disabled={isLoading}
                  className="flex items-center justify-center px-4 py-2.5 border border-slate-700 rounded-xl bg-slate-900/50 hover:bg-slate-800 transition-colors text-slate-300 gap-2 text-sm font-medium disabled:opacity-50"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Google
                </button>
                <button 
                  type="button"
                  onClick={() => handleSocialLogin('github')}
                  disabled={isLoading}
                  className="flex items-center justify-center px-4 py-2.5 border border-slate-700 rounded-xl bg-slate-900/50 hover:bg-slate-800 transition-colors text-slate-300 gap-2 text-sm font-medium disabled:opacity-50"
                >
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                    GitHub
                </button>
            </div>

            <p className="text-center text-slate-400 text-sm">
                Already have an account?{' '}
                <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
                    Sign in here
                </Link>
            </p>
        </div>
      </div>
    </div>
  );
};
