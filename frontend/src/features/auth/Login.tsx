import { Code2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const Login = () => {
    const { loginWithGoogle, loginWithGithub, loginWithEmail, login, error, isLoading } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const hasProcessedCallback = useRef(false);

    useEffect(() => {
        const token = searchParams.get('token');
        const userId = searchParams.get('user_id');
        const name = searchParams.get('name');
        const emailParam = searchParams.get('email');
        
        if (token && !hasProcessedCallback.current) {
            hasProcessedCallback.current = true;
            const user = {
                id: Number(userId) || 0,
                name: name || 'User',
                email: emailParam || '',
            };
            
            login(token, user);
            navigate('/dashboard');
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await loginWithEmail(email, password);
            navigate('/dashboard');
        } catch (err) {
            // Error is handled in context
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen w-full flex bg-slate-950 text-white font-sans selection:bg-brand-500/30">
            {/* Navbar - Consistent with Landing */}
            <nav className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-50">
                <div onClick={() => navigate('/')} className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative w-10 h-10 bg-gradient-to-br from-brand-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
                        <Code2 className="w-6 h-6 text-white" />
                    </div>
                    <span className="font-bold text-xl text-white tracking-tight group-hover:text-brand-200 transition-colors">Code Anyone</span>
                </div>
                <button onClick={() => navigate('/signup')} className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                    Don't have an account? <span className="text-brand-400 hover:text-brand-300 ml-1">Sign up</span>
                </button>
            </nav>
            
            {/* LEFT SIDE: Elegant AI Visual */}
            <div className="hidden lg:flex w-[55%] relative bg-slate-950 items-center justify-center p-12 overflow-hidden border-r border-slate-800/50">
                 {/* Modern Grid Background */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />
                
                {/* Ambient Glows */}
                <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-brand-600/10 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] animate-pulse delay-1000"></div>

                {/* Central Visual Card */}
                <div className="relative z-10 w-full max-w-xl">
                    <div className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                        {/* Decorative Top Bar */}
                        <div className="flex items-center gap-2 mb-8">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                            </div>
                        </div>

                        {/* Code/Content Preview */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <div className="h-2 w-24 bg-white/20 rounded mb-2"></div>
                                    <div className="h-2 w-16 bg-white/10 rounded"></div>
                                </div>
                                <div className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-medium">98% Match</div>
                            </div>

                             <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 cursor-pointer hover:bg-white/10 transition-colors">
                                <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <div className="h-2 w-32 bg-white/20 rounded mb-2"></div>
                                    <div className="h-2 w-20 bg-white/10 rounded"></div>
                                </div>
                                <div className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center text-white/40 text-xs">
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-white/10">
                            <blockquote className="text-xl font-medium text-white/90 leading-relaxed mb-6">
                                "The most intuitive platform for mastering modern development stacks. It feels like the future."
                            </blockquote>
                             <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 flex items-center justify-center font-bold text-white text-sm">
                                    JS
                                </div>
                                <div>
                                    <div className="font-semibold text-white text-sm">Jordan Smith</div>
                                    <div className="text-slate-400 text-xs">Full Stack Engineer</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE: Form Interface */}
            <div className="w-full lg:w-[45%] flex flex-col justify-center px-8 sm:px-12 lg:px-16 xl:px-20 py-12 relative z-10 bg-slate-950">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-500/20 to-transparent"></div>
                
                <div className="max-w-md w-full mx-auto">
                    {/* Header */}
                    <div className="mb-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-medium mb-6">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse"></span>
                            AI-Powered Learning Platform
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-white mb-3">
                            Welcome back
                        </h1>
                        <p className="text-slate-400 text-lg leading-relaxed">
                            Sign in to access your personalized learning dashboard and AI assistant.
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-400 text-sm animate-in slide-in-from-top-2">
                            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-slate-300 ml-1">Email address</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-slate-500 group-focus-within:text-brand-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                    <input 
                                        type="email" 
                                        className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3.5 pl-11 pr-4 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all font-sans"
                                        placeholder="name@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        
                         <div className="space-y-1.5">
                            <div className="flex justify-between items-center ml-1">
                                <label className="block text-sm font-medium text-slate-300">Password</label>
                                <button type="button" className="text-sm text-brand-400 hover:text-brand-300 font-medium transition-colors">Forgot password?</button>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-slate-500 group-focus-within:text-brand-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <input 
                                    type="password" 
                                    className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3.5 pl-11 pr-4 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all font-sans"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button disabled={isLoading} className="w-full disabled:opacity-50 disabled:cursor-not-allowed bg-brand-600 hover:bg-brand-500 text-white font-semibold py-3.5 rounded-xl transition-all shadow-[0_0_20px_-5px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_-5px_rgba(79,70,229,0.5)] hover:scale-[1.01] active:scale-[0.98]">
                            {isLoading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-800"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase tracking-wider font-medium">
                            <span className="bg-slate-950 px-4 text-slate-500">Or continue with</span>
                        </div>
                    </div>

                    {/* Social Buttons */}
                    <div className="grid grid-cols-2 gap-4">
                        <button 
                            onClick={loginWithGoogle}
                            disabled={isLoading}
                            className="flex items-center justify-center gap-3 bg-slate-900/50 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-white font-medium py-3 px-4 rounded-xl transition-all disabled:opacity-70 text-sm h-12"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            </svg>
                            Google
                        </button>
                        <button 
                            onClick={loginWithGithub}
                            disabled={isLoading}
                            className="flex items-center justify-center gap-3 bg-slate-900/50 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-white font-medium py-3 px-4 rounded-xl transition-all disabled:opacity-70 text-sm h-12"
                        >
                            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12c0-5.523-4.477-10-10-10z" />
                            </svg>
                            GitHub
                        </button>
                    </div>

                    {/* Footer */}
                    <div className="mt-10 text-center">
                        <p className="text-slate-400 text-sm">
                            Don't have an account?{' '}
                            <button onClick={() => navigate('/signup')} className="text-brand-400 hover:text-brand-300 font-semibold hover:underline transition-all">
                                Sign up for free
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
