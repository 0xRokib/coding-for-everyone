import { Facebook, Github, Instagram, Mail, MapPin, MessageSquare, Send, Twitter } from 'lucide-react';
import React, { useState } from 'react';
import { contactService } from '../../services/contact.service';

export const Contact = () => {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    
    // Form State
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        message: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await contactService.submit(formData);
            setSubmitted(true);
            setFormData({ firstName: '', lastName: '', email: '', message: '' }); // Reset
        } catch (error) {
            console.error(error);
            alert("Failed to send message. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col bg-slate-950 relative overflow-hidden min-h-full font-sans selection:bg-brand-500/30 justify-center">
            {/* Ambient Background */}
            <div className="absolute inset-0 pointer-events-none z-0">
                 <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />
                 <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-brand-500/10 rounded-full blur-[120px] animate-pulse" />
                 <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-purple-500/10 rounded-full blur-[120px] animate-pulse" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto w-full px-6 py-12 lg:py-20 flex flex-col lg:flex-row gap-16 lg:gap-20 items-stretch">
                 
                 {/* Left Column: Info & Context */}
                 <div className="flex-1 flex flex-col justify-center space-y-10">
                     <div className="space-y-6">
                         <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-brand-500/30 text-brand-400 text-xs font-bold uppercase tracking-wider shadow-lg shadow-brand-500/10">
                            <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span>
                            24/7 Support
                         </div>
                         <h1 className="text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
                             Let's start a <br/>
                             <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-purple-400">conversation.</span>
                         </h1>
                         <p className="text-lg text-slate-400 leading-relaxed max-w-lg">
                             Whether you have questions about the curriculum, pricing, or just want to connect, our team is ready to answer all your questions.
                         </p>
                     </div>

                     {/* Contact Methods - Vertical Stack for Clarity */}
                     <div className="space-y-4 max-w-lg">
                        <div className="group flex items-center gap-5 p-5 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-brand-500/40 hover:bg-slate-900/80 transition-all duration-300">
                            <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                <Mail className="w-6 h-6 text-brand-400" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-white mb-0.5">Email Support</h3>
                                <p className="text-sm text-slate-400">hello@codeanyone.io</p>
                            </div>
                        </div>

                        <div className="group flex items-center gap-5 p-5 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-purple-500/40 hover:bg-slate-900/80 transition-all duration-300">
                            <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                <MessageSquare className="w-6 h-6 text-purple-400" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-white mb-0.5">Live Chat</h3>
                                <p className="text-sm text-slate-400">Available Mon-Fri, 9am - 5pm EST</p>
                            </div>
                        </div>

                        <div className="group flex items-center gap-5 p-5 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-emerald-500/40 hover:bg-slate-900/80 transition-all duration-300">
                             <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                <MapPin className="w-6 h-6 text-emerald-400" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-white mb-0.5">Headquarters</h3>
                                <p className="text-sm text-slate-400">San Francisco, CA</p>
                            </div>
                        </div>
                     </div>

                     <div className="flex gap-4 pt-2">
                         {[Github, Twitter, Facebook, Instagram].map((Icon, i) => (
                             <a key={i} href="#" className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 hover:border-slate-600 transition-all">
                                 <Icon className="w-5 h-5" />
                             </a>
                         ))}
                     </div>
                 </div>

                 {/* Right Column: Balanced Form */}
                 <div className="flex-1 lg:max-w-xl w-full flex items-center">
                     <div className="w-full bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 lg:p-10 shadow-2xl relative overflow-hidden">
                         <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-500 via-purple-500 to-emerald-500 opacity-80"></div>
                         
                         {submitted ? (
                             <div className="min-h-[440px] flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-500">
                                 <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 text-emerald-400 ring-1 ring-emerald-500/20 shadow-lg shadow-emerald-500/10">
                                     <Send className="w-9 h-9" />
                                 </div>
                                 <h3 className="text-2xl font-bold text-white mb-3">Message Received!</h3>
                                 <p className="text-slate-400 mb-8 max-w-xs mx-auto">
                                     Your inquiry has been sent to our team. Expect a reply within 24 hours.
                                 </p>
                                 <button onClick={() => setSubmitted(false)} className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all border border-slate-700 hover:border-slate-600">
                                     Send Another Message
                                 </button>
                             </div>
                         ) : (
                             <form onSubmit={handleSubmit} className="space-y-6">
                                 <div>
                                     <h3 className="text-2xl font-bold text-white mb-2">Send us a message</h3>
                                     <p className="text-sm text-slate-400">We usually respond within a few hours.</p>
                                 </div>
                                 
                                 <div className="grid grid-cols-2 gap-4">
                                     <div className="space-y-2">
                                         <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">First Name</label>
                                         <input 
                                             name="firstName" 
                                             value={formData.firstName} 
                                             onChange={handleChange}
                                             className="w-full bg-slate-950/50 border border-slate-700/60 rounded-xl px-4 py-3 text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20 outline-none transition-all placeholder:text-slate-600" 
                                             placeholder="John" 
                                             required 
                                         />
                                     </div>
                                     <div className="space-y-2">
                                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Last Name</label>
                                         <input 
                                             name="lastName" 
                                             value={formData.lastName}
                                             onChange={handleChange}
                                             className="w-full bg-slate-950/50 border border-slate-700/60 rounded-xl px-4 py-3 text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20 outline-none transition-all placeholder:text-slate-600" 
                                             placeholder="Doe" 
                                             required 
                                         />
                                     </div>
                                 </div>
                                 
                                 <div className="space-y-2">
                                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email Address</label>
                                      <input 
                                          type="email" 
                                          name="email"
                                          value={formData.email}
                                          onChange={handleChange}
                                          className="w-full bg-slate-950/50 border border-slate-700/60 rounded-xl px-4 py-3 text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20 outline-none transition-all placeholder:text-slate-600" 
                                          placeholder="john@example.com" 
                                          required 
                                      />
                                 </div>
                                 
                                 <div className="space-y-2">
                                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Your Message</label>
                                      <textarea 
                                          rows={4} 
                                          name="message"
                                          value={formData.message}
                                          onChange={handleChange}
                                          className="w-full bg-slate-950/50 border border-slate-700/60 rounded-xl px-4 py-3 text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20 outline-none transition-all resize-none placeholder:text-slate-600 font-sans" 
                                          placeholder="How can we help you?" 
                                          required 
                                      />
                                 </div>
                                 
                                 <button disabled={loading} type="submit" className="group w-full py-3.5 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
                                     <span>{loading ? 'Sending...' : 'Send Message'}</span>
                                     <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                 </button>
                             </form>
                         )}
                     </div>
                 </div>
            </div>
        </div>
    );
};
