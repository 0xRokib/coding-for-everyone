import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const Login = () => {
    const { loginWithGoogle, loginWithGithub, error, isLoading } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen w-full flex bg-[#030712] text-white font-mono selection:bg-brand-500/30 overflow-hidden">
            
            {/* LEFT SIDE: Terminal Interface */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-12 lg:px-20 xl:px-24 py-12 relative z-10">
                {/* Top Bar Decoration */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-600 via-purple-600 to-transparent opacity-50"></div>
                
                <div className="max-w-md w-full mx-auto">
                    {/* Header */}
                    <div className="mb-12">
                        <div className="flex items-center gap-2 text-brand-400 mb-4 animate-pulse">
                            <div className="w-2 h-2 bg-brand-500 rounded-full"></div>
                            <span className="text-xs tracking-widest uppercase">System Online</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-white mb-2">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">Identify.</span>
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-purple-400">Access Core.</span>
                        </h1>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-8 p-4 bg-red-500/5 border border-red-500/20 text-red-400 text-sm font-mono flex items-center gap-3">
                            <span className="text-red-500">⚠</span> {error}
                        </div>
                    )}

                    {/* Form */}
                    <form className="space-y-6">
                        <div className="space-y-2 group">
                            <label className="text-xs uppercase tracking-widest text-slate-500 group-focus-within:text-brand-400 transition-colors">User.Email</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 select-none">{'>'}</span>
                                <input 
                                    type="email" 
                                    className="w-full bg-slate-900/50 border border-slate-800 focus:border-brand-500/50 rounded-none px-4 py-4 pl-8 text-white outline-none transition-all placeholder:text-slate-700 font-mono focus:bg-slate-900"
                                    placeholder="enter_email..."
                                />
                                <div className="absolute top-0 right-0 h-full w-1 bg-brand-500 opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                            </div>
                        </div>
                        
                        <div className="space-y-2 group">
                             <div className="flex justify-between items-center">
                                <label className="text-xs uppercase tracking-widest text-slate-500 group-focus-within:text-brand-400 transition-colors">User.Password</label>
                                <button type="button" className="text-xs text-slate-600 hover:text-brand-400 transition-colors tracking-tight">[RESET_CREDENTIALS]</button>
                            </div>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 select-none">{'>'}</span>
                                <input 
                                    type="password" 
                                    className="w-full bg-slate-900/50 border border-slate-800 focus:border-brand-500/50 rounded-none px-4 py-4 pl-8 text-white outline-none transition-all placeholder:text-slate-700 font-mono focus:bg-slate-900"
                                    placeholder="enter_passcode..."
                                />
                                <div className="absolute top-0 right-0 h-full w-1 bg-brand-500 opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                            </div>
                        </div>

                        <button className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-4 uppercase tracking-widest text-sm transition-all hover:shadow-[0_0_20px_-5px_rgba(79,70,229,0.5)] border border-transparent hover:border-brand-400">
                            Initialize Session
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-10 flex items-center gap-4">
                        <div className="h-px bg-slate-800 flex-1"></div>
                        <span className="text-xs text-slate-600 tracking-widest uppercase">Or Authenticate With</span>
                        <div className="h-px bg-slate-800 flex-1"></div>
                    </div>

                    {/* Social Buttons */}
                    <div className="grid grid-cols-2 gap-4">
                        <button 
                            onClick={loginWithGoogle}
                            disabled={isLoading}
                            className="flex items-center justify-center gap-3 bg-slate-900 border border-slate-800 hover:border-slate-600 text-slate-300 hover:text-white py-3 px-4 transition-all disabled:opacity-70 text-sm h-12 group"
                        >
                            <svg className="w-5 h-5 flex-shrink-0 grayscale group-hover:grayscale-0 transition-all opacity-50 group-hover:opacity-100" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            </svg>
                            GOOGLE
                        </button>
                        <button 
                            onClick={loginWithGithub}
                            disabled={isLoading}
                            className="flex items-center justify-center gap-3 bg-slate-900 border border-slate-800 hover:border-slate-600 text-slate-300 hover:text-white py-3 px-4 transition-all disabled:opacity-70 text-sm h-12 group"
                        >
                            <svg className="w-5 h-5 flex-shrink-0 grayscale group-hover:grayscale-0 transition-all opacity-50 group-hover:opacity-100" viewBox="0 0 24 24" fill="currentColor">
                                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12c0-5.523-4.477-10-10-10z" />
                            </svg>
                            GITHUB
                        </button>
                    </div>

                    {/* Footer */}
                    <div className="mt-12 pt-6 border-t border-slate-900 flex justify-between items-center text-xs text-slate-500">
                        <p>SECURE CONNECTION v4.0</p>
                        <button onClick={() => navigate('/signup')} className="text-brand-400 hover:text-brand-300 hover:underline tracking-wider uppercase">
                            [Create_Account]
                        </button>
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE: AI Visual Core */}
            <div className="hidden lg:flex w-1/2 relative bg-black items-center justify-center p-12 overflow-hidden border-l border-slate-900">
                 {/* Moving Grid Background */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-50" />
                
                {/* Glowing Core Pulse */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/5 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-2xl animate-pulse delay-75"></div>

                {/* Central AI Visual */}
                <div className="relative z-10 w-full max-w-sm">
                    <div className="relative border border-slate-800 bg-black/50 backdrop-blur-sm p-6 rounded-lg animate-in fade-in zoom-in-95 duration-1000 border-l-4 border-l-brand-500">
                        <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-2">
                            <div className="text-xs text-brand-500 font-mono flex items-center gap-2">
                                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-brand-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
                                AI_AGENT_ACTIVE
                            </div>
                            <div className="text-[10px] text-slate-600 font-mono">ID: 8X-929</div>
                        </div>
                        <div className="space-y-2 font-mono text-sm leading-relaxed">
                            <p className="text-slate-400"><span className="text-purple-500">➜</span> Initializing learning environment...</p>
                            <p className="text-slate-400"><span className="text-purple-500">➜</span> Loading personalized curriculum...</p>
                            <p className="text-slate-400"><span className="text-purple-500">➜</span> Optimization complete.</p>
                            <div className="mt-4 p-3 bg-slate-900/50 border border-slate-800 text-xs text-slate-500">
                                {`{ "status": "ready", "latency": "12ms", "secure": true }`}
                            </div>
                        </div>
                    </div>

                     {/* Floating Nodes Decoration */}
                     <div className="absolute top-[-50px] right-[-50px] w-24 h-24 border border-brand-500/20 rounded-full flex items-center justify-center animate-[spin_10s_linear_infinite]">
                        <div className="w-2 h-2 bg-brand-500 rounded-full"></div>
                     </div>
                </div>
            </div>
        </div>
    );
};
