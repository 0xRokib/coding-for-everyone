import { Mail, MessageSquare, Send } from 'lucide-react';
import React, { useState } from 'react';

export const Contact = () => {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here we would typically send to an API
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-in fade-in">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 text-emerald-400">
                    <Send className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">Message Sent!</h2>
                <p className="text-slate-400 max-w-md">
                    Thanks for reaching out. We'll get back to you within 24 hours.
                </p>
            </div>
        );
    }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Left Info */}
        <div className="space-y-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
                Let's build something <span className="text-brand-400">amazing together.</span>
            </h1>
            
            <p className="text-slate-400 text-lg leading-relaxed max-w-lg">
                Whether you have a question about our curriculum, pricing, or just want to say hi, our team is ready to answer all your questions.
            </p>

            <div className="space-y-4 pt-4">
                <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-800 bg-slate-900/50">
                    <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center text-slate-200">
                        <Mail className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="font-bold text-white mb-1">Email Us</div>
                        <div className="text-slate-400 text-sm">hello@codefuture.io</div>
                    </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-800 bg-slate-900/50">
                    <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center text-slate-200">
                        <MessageSquare className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="font-bold text-white mb-1">Community Support</div>
                        <div className="text-slate-400 text-sm">Join our specialized Discord</div>
                    </div>
                </div>
            </div>
        </div>

        {/* Right Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-white mb-6">Send us a message</h3>
            
            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400">First Name</label>
                        <input className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all placeholder:text-slate-600" placeholder="John" required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400">Last Name</label>
                        <input className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all placeholder:text-slate-600" placeholder="Doe" required />
                    </div>
                </div>
                
                <div className="space-y-2">
                     <label className="text-sm font-medium text-slate-400">Email Address</label>
                     <input type="email" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all placeholder:text-slate-600" placeholder="john@example.com" required />
                </div>
                
                <div className="space-y-2">
                     <label className="text-sm font-medium text-slate-400">Message</label>
                     <textarea rows={4} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none resize-none transition-all placeholder:text-slate-600" placeholder="How can we help..." required />
                </div>
                
                <button type="submit" className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-500 text-white font-bold py-3 rounded-lg transition-all shadow-sm">
                    <span>Send Message</span>
                    <Send className="w-4 h-4" />
                </button>
            </form>
        </div>
      </div>
    </div>
  );
};
