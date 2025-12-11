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
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left Info */}
        <div>
            <h1 className="text-4xl font-bold text-white mb-6">Get in Touch</h1>
            <p className="text-slate-400 text-lg leading-relaxed mb-8">
                Have questions about the courses? Want to partner with us? 
                We'd love to hear from you.
            </p>

            <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="w-10 h-10 rounded-full bg-brand-500/10 flex items-center justify-center text-brand-400">
                        <Mail className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="font-semibold text-white">Email Us</div>
                        <div className="text-slate-400 text-sm">hello@codefuture.io</div>
                    </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400">
                        <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="font-semibold text-white">Community Support</div>
                        <div className="text-slate-400 text-sm">Join our specialized Discord</div>
                    </div>
                </div>
            </div>
        </div>

        {/* Right Form */}
        <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">First Name</label>
                        <input className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-brand-500 outline-none" placeholder="John" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Last Name</label>
                        <input className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-brand-500 outline-none" placeholder="Doe" required />
                    </div>
                </div>
                <div>
                     <label className="block text-sm font-medium text-slate-400 mb-2">Email</label>
                     <input type="email" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-brand-500 outline-none" placeholder="john@example.com" required />
                </div>
                <div>
                     <label className="block text-sm font-medium text-slate-400 mb-2">Message</label>
                     <textarea rows={4} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-brand-500 outline-none resize-none" placeholder="How can we help..." required />
                </div>
                <button type="submit" className="w-full bg-brand-600 hover:bg-brand-500 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-brand-500/20">
                    Send Message
                </button>
            </form>
        </div>
      </div>
    </div>
  );
};
