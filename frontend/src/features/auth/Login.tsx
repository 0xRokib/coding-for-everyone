import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const Login = () => {
    const { loginWithGoogle, loginWithGithub, error, isLoading } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen w-full flex bg-slate-950 text-white font-sans selection:bg-brand-500/30">
            {/* LEFT SIDE: Form Section */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-12 lg:px-20 xl:px-24 py-12 relative z-10 bg-slate-950">
                <div className="max-w-md w-full mx-auto">
                    {/* Header */}
                    <div className="mb-10">
                        <h1 className="text-4xl font-bold tracking-tight text-white mb-3">Welcome back</h1>
                        <p className="text-slate-400 text-lg">
                            Please enter your details to sign in.
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm animate-in slide-in-from-top-2">
                            <div className="w-2 h-2 rounded-full bg-red-500" />
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-300">Email Address</label>
                            <input 
                                type="email" 
                                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3.5 text-white focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 outline-none transition-all placeholder:text-slate-600 hover:border-slate-700"
                                placeholder="name@company.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-semibold text-slate-300">Password</label>
                                <button type="button" className="text-sm font-semibold text-brand-400 hover:text-brand-300 transition-colors">Forgot password?</button>
                            </div>
                            <input 
                                type="password" 
                                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3.5 text-white focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 outline-none transition-all placeholder:text-slate-600 hover:border-slate-700"
                                placeholder="••••••••"
                            />
                        </div>

                        <button className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-brand-500/20 hover:shadow-brand-500/40 hover:scale-[1.01] active:scale-[0.98]">
                            Sign In
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-800"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase tracking-wider font-semibold">
                            <span className="bg-slate-950 px-4 text-slate-500">Or continue with</span>
                        </div>
                    </div>

                    {/* Social Buttons */}
                    <div className="grid grid-cols-2 gap-4">
                        <button 
                            onClick={loginWithGoogle}
                            disabled={isLoading}
                            className="flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-slate-900 font-bold py-3 px-4 rounded-xl transition-all shadow-sm hover:shadow-md border border-slate-200 disabled:opacity-70 text-sm h-12"
                        >
                            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
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
                            className="flex items-center justify-center gap-3 bg-[#24292F] hover:bg-[#24292F]/90 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-sm hover:shadow-md disabled:opacity-70 text-sm h-12"
                        >
                            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12c0-5.523-4.477-10-10-10z" />
                            </svg>
                            GitHub
                        </button>
                    </div>

                    {/* Footer */}
                    <p className="mt-10 text-center text-slate-400 text-sm">
                        Don't have an account?{' '}
                        <button onClick={() => navigate('/signup')} className="text-brand-400 hover:text-brand-300 font-bold hover:underline transition-all">
                            Sign up for free
                        </button>
                    </p>
                </div>
            </div>

            {/* RIGHT SIDE: Branding/Ambience */}
            <div className="hidden lg:flex w-1/2 relative bg-slate-900 items-center justify-center p-12 overflow-hidden">
                 {/* Decorative Background */}
                <div className="absolute inset-0 bg-slate-900">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px] animate-pulse" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-[100px] animate-pulse delay-1000" />
                    {/* Grid Pattern */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-20" />
                </div>

                {/* Glass Card with Testimonial/Text */}
                <div className="relative z-10 max-w-lg bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-2xl">
                    <div className="text-4xl text-brand-400 mb-6 font-serif opacity-50">"</div>
                    <blockquote className="text-2xl font-medium text-white leading-relaxed mb-6">
                        Learning to code has never been this accessible. The AI-powered breakdown of complex topics is a game-changer.
                    </blockquote>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-brand-500 to-purple-600 flex items-center justify-center font-bold text-white text-lg">
                            AS
                        </div>
                        <div>
                            <div className="font-bold text-white">Alex Smith</div>
                            <div className="text-slate-400 text-sm">Frontend Developer at TechCorp</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
