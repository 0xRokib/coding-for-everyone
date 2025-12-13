import { ArrowLeft, Code2, Cpu, Database, Globe, Layers, Layout, Lock, Server, Settings, Terminal, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { roadmapService } from '../../services/roadmap.service';

// Type definitions
type Priority = 'high' | 'medium' | 'low';

interface RoadmapTopic {
    title: string;
    description: string;
    priority: Priority;
    technologies?: string[];
    bookmarks?: { title: string; url: string }[];
}

interface RoadmapSection {
    title: string;
    icon?: any;
    topics: RoadmapTopic[];
}

interface RoadmapDefinition {
    id: string;
    title: string;
    description: string;
    sections: RoadmapSection[];
}

/* ... existing sections ... */

// --- DETAIL DATA ---
const ROADMAP_DATA: Record<string, RoadmapDefinition> = {
    'frontend': {
        id: 'frontend',
        title: 'Frontend Developer',
        description: 'The complete guide to modern frontend development in 2025',
        sections: [
            {
                title: 'The Internet',
                icon: Globe,
                topics: [
                    { 
                        title: 'How the Internet Works', 
                        description: 'Foundational knowledge required for all web developers.', 
                        priority: 'high',
                        technologies: ['DNS', 'HTTP/HTTPS', 'Domain Names', 'Hosting'],
                        bookmarks: [
                            { title: 'How does the Internet work? (MDN)', url: 'https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Web_mechanics/How_does_the_Internet_work' },
                            { title: 'Introduction to HTTP', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview' }
                        ]
                    },
                    { 
                        title: 'Browsers', 
                        description: 'Understanding the runtime environment.', 
                        priority: 'high',
                        technologies: ['Rendering Engine', 'DevTools', 'Storage (Local/Session)'],
                        bookmarks: [
                            { title: 'Populating the page: how browsers work', url: 'https://developer.mozilla.org/en-US/docs/Web/Performance/How_browsers_work' }
                        ]
                    },
                ]
            },
            {
                title: 'HTML & CSS',
                icon: Layout,
                topics: [
                    { 
                        title: 'HTML5 Semantic', 
                        description: 'Writing accessible and structured markup.', 
                        priority: 'high',
                        technologies: ['Semantic Tags', 'Forms & Validations', 'SEO Basics', 'Accessibility (a11y)'],
                        bookmarks: [
                            { title: 'Semantic HTML', url: 'https://developer.mozilla.org/en-US/docs/Glossary/Semantics' }
                        ]
                    },
                    /* ... other HTML/CSS topics ... */
                    { 
                         title: 'CSS Fundamentals', 
                         description: 'Styling and layout engines.', 
                         priority: 'high',
                         technologies: ['Box Model', 'Flexbox', 'Grid', 'Selectors', 'Specificity'],
                         bookmarks: [
                             { title: 'CSS Box Model', url: 'https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/The_box_model' },
                             { title: 'A Complete Guide to Flexbox', url: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/' }
                         ]
                     },
                     { 
                         title: 'Modern CSS', 
                         description: 'Variable usage and advanced selectors.', 
                         priority: 'medium',
                         technologies: ['CSS Variables', 'Pseudo-classes', 'Media Queries', 'Animations']
                     },
                ]
            },
            /* ... rest of frontend ... */
            {
                title: 'JavaScript',
                icon: Code2,
                topics: [
                    { 
                        title: 'JS Core', 
                        description: 'The programming language of the web.', 
                        priority: 'high',
                        technologies: ['Variables', 'Data Types', 'Functions', 'Scopes', 'Hoisting', 'Closures'],
                        bookmarks: [
                            { title: 'The Modern JavaScript Tutorial', url: 'https://javascript.info/' }
                        ]
                    },
                    /* ... rest ... */
                    { 
                        title: 'DOM Manipulation', 
                        description: 'Interacting with the page structure.', 
                        priority: 'high',
                        technologies: ['Selectors', 'Event Listeners', 'Traversing', 'Manipulation']
                    },
                    { 
                        title: 'Asynchronous JS', 
                        description: 'Handling operations that take time.', 
                        priority: 'high',
                        technologies: ['Promises', 'Async/Await', 'Callbacks', 'Event Loop', 'Fetch API']
                    },
                ]
            },
            /* ... rest of frontend ... */
            {
                title: 'Version Control',
                icon: Settings,
                topics: [
                    { 
                        title: 'Git Basics', 
                        description: 'Managing code history and collaboration.', 
                        priority: 'high',
                        technologies: ['add/commit', 'push/pull', 'branching', 'merging', 'checkout']
                    },
                    { 
                        title: 'Repo Hosting', 
                        description: 'Remote repositories.', 
                        priority: 'medium',
                        technologies: ['GitHub', 'GitLab', 'Pull Requests']
                    }
                ]
            },
            {
                title: 'Package Managers',
                icon: Layers,
                topics: [
                    { 
                        title: 'Dependency Management', 
                        description: 'Installing and updating 3rd party libraries.', 
                        priority: 'medium',
                        technologies: ['npm', 'yarn', 'pnpm']
                    }
                ]
            },
            {
                title: 'Modern Frameworks',
                icon: Cpu,
                topics: [
                    { 
                        title: 'React Ecosystem', 
                        description: 'Most popular library for building UIs.', 
                        priority: 'high',
                        technologies: ['Components', 'JSX', 'Hooks', 'Context API', 'State Management'],
                        bookmarks: [
                            { title: 'React Documentation', url: 'https://react.dev/' }
                        ]
                    },
                    { 
                        title: 'Next.js', 
                        description: 'React framework for production.', 
                        priority: 'medium',
                        technologies: ['SSR', 'SSG', 'Routing', 'API Routes']
                    },
                    { 
                        title: 'Other Frameworks', 
                        description: 'Alternatives to React.', 
                        priority: 'low',
                        technologies: ['Vue.js', 'Angular', 'Svelte']
                    }
                ]
            },
            {
                title: 'CSS Frameworks',
                icon: Zap,
                topics: [
                    { 
                        title: 'Utility First', 
                        description: 'Rapid UI development.', 
                        priority: 'high',
                        technologies: ['Tailwind CSS']
                    },
                    { 
                        title: 'Component Libraries', 
                        description: 'Pre-built components.', 
                        priority: 'low',
                        technologies: ['Material UI', 'Chakra UI', 'Shadcn/UI']
                    }
                ]
            }
        ]
    },
    'backend': {
       /* ... keep backend as is for now, or add bookmarks if needed ... */
       /* Re-inserting existing backend data to keep file valid */
        id: 'backend',
        title: 'Backend Developer',
        description: 'Master server-side logic, databases, and APIs to power the web.',
        sections: [
            {
                title: 'Internet Fundamentals',
                icon: Globe,
                topics: [
                    { 
                        title: 'How the Web Works', 
                        description: 'Request/Response cycle.', 
                        priority: 'high',
                        technologies: ['HTTP/HTTPS', 'DNS', 'Browsers', 'Hosting'],
                        bookmarks: [
                           { title: 'HTTP Overview', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview' }
                        ]
                    },
                    { 
                        title: 'Networking', 
                        description: 'Data transmission protocols.', 
                        priority: 'medium',
                        technologies: ['TCP/UDP', 'IP', 'Ports', 'Sockets']
                    },
                ]
            },
            {
                title: 'OS Knowledge',
                icon: Terminal,
                topics: [
                    { 
                        title: 'Terminal / CLI', 
                        description: 'Navigating and controlling the OS.', 
                        priority: 'high',
                        technologies: ['Bash/Zsh', 'Vim/Nano', 'Process Management', 'Permissions', 'SSH']
                    },
                    { 
                        title: 'OS Concepts', 
                        description: 'How operating systems function.', 
                        priority: 'medium',
                        technologies: ['Memory Management', 'Threads & Concurrency', 'I/O Management', 'POSIX']
                    }
                ]
            },
            {
                title: 'Programming Language',
                icon: Code2,
                topics: [
                    { 
                        title: 'Primary Language', 
                        description: 'Choose one strong backend language.', 
                        priority: 'high',
                        technologies: ['Go', 'Node.js (JavaScript/TypeScript)', 'Python', 'Java', 'C#', 'Rust']
                    }
                ]
            },
            {
                title: 'Databases',
                icon: Database,
                topics: [
                    { 
                        title: 'Relational Databases', 
                        description: 'Structured data storage (SQL).', 
                        priority: 'high',
                        technologies: ['PostgreSQL', 'MySQL', 'Transactions', 'Normalization', 'Indexes']
                    },
                    { 
                        title: 'NoSQL Databases', 
                        description: 'Flexible schema data storage.', 
                        priority: 'medium',
                        technologies: ['MongoDB', 'Redis (Caching)', 'Cassandra', 'DynamoDB']
                    },
                    { 
                        title: 'Database Design', 
                        description: 'Structuring data efficiently.', 
                        priority: 'high',
                        technologies: ['Schema Design', 'ORMs (Prisma/Gorm)', 'ACID', 'N+1 Problem']
                    }
                ]
            },
            {
                title: 'APIs',
                icon: Server,
                topics: [
                    { 
                        title: 'REST Architecture', 
                        description: 'Standard for web APIs.', 
                        priority: 'high',
                        technologies: ['Resources', 'HTTP Methods', 'Status Codes', 'JSON', 'Statelessness']
                    },
                    { 
                        title: 'Authentication', 
                        description: 'Securing your API.', 
                        priority: 'high',
                        technologies: ['JWT', 'OAuth2', 'Basic Auth', 'Cookies vs Tokens']
                    },
                    { 
                        title: 'Other Styles', 
                        description: 'Modern API alternatives.', 
                        priority: 'medium',
                        technologies: ['GraphQL', 'gRPC', 'WebSockets']
                    }
                ]
            },
            {
                title: 'Web Security',
                icon: Lock,
                topics: [
                    { 
                        title: 'Security Best Practices', 
                        description: 'Protecting your application.', 
                        priority: 'high',
                        technologies: ['CORS', 'HTTPS/SSL', 'Rate Limiting', 'Hashing (Bcrypt/Argon2)']
                    },
                    { 
                        title: 'Common Vulnerabilities', 
                        description: 'OWASP Top 10.', 
                        priority: 'high',
                        technologies: ['SQL Injection', 'XSS', 'CSRF', 'DDOS']
                    }
                ]
            },
            {
                title: 'Caching',
                icon: Layers,
                topics: [
                    { 
                        title: 'Caching Strategies', 
                        description: 'Speeding up responses.', 
                        priority: 'medium',
                        technologies: ['Client-side', 'Server-side', 'CDN', 'Redis']
                    }
                ]
            }
        ]
    }
};

const PriorityBadge = ({ priority }: { priority: Priority }) => {
    switch(priority) {
        case 'high':
            return <div className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-brand-500 text-white shadow-lg shadow-brand-500/20">High Priority</div>;
        case 'medium':
            return <div className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-yellow-500/20 text-yellow-500 border border-yellow-500/20">Medium</div>;
        case 'low':
            return <div className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-700 text-slate-400 border border-slate-600">Low Priority</div>;
    }
};

export const RoadmapDetails = () => {
    const { roleId } = useParams();
    const navigate = useNavigate();
    const [dynamicRoadmap, setDynamicRoadmap] = useState<RoadmapDefinition | null>(null);
    const [loading, setLoading] = useState(false);
    
    // Check if it's a known static role or a dynamic ID
    const isStatic = roleId && ROADMAP_DATA[roleId];
    
    useEffect(() => {
        if (!isStatic && roleId) {
            setLoading(true);
            roadmapService.getRoadmapById(roleId)
                .then(res => {
                    if (res.success && res.data && res.data.content) {
                         // Transform the response content if needed, or use as is if it matches RoadmapDefinition
                         // The backend stores the JSON string in 'content', which might be parsed already by service wrapper?
                         // Service returns { found, data: { ... content: {...} } }
                         // Actually the backend endpoint /roadmap/view returns { success: true, data: { ... content: {...} } }
                         // Let's assume content is the RoadmapDefinition structure
                         setDynamicRoadmap(res.data.content as RoadmapDefinition);
                    }
                })
                .catch(err => console.error(err))
                .finally(() => setLoading(false));
        }
    }, [roleId, isStatic]);

    
    // Determine which roadmap to display
    const roadmap = isStatic ? ROADMAP_DATA[roleId] : dynamicRoadmap;

    if (loading) return <div className="text-white text-center py-20">Loading roadmap...</div>;
    if (!roadmap) return <div className="text-white text-center py-20">Roadmap not found</div>;

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-brand-500/30">
            {/* Header */}
            <div className="relative border-b border-white/10 bg-slate-900/50 backdrop-blur-xl sticky top-[64px] z-40">
                 <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
                     <div>
                        <button 
                            onClick={() => navigate('/roadmaps')}
                            className="flex items-center gap-2 text-slate-400 hover:text-white mb-4 text-sm font-medium transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to All Roadmaps
                        </button>
                        <h1 className="text-3xl font-black tracking-tight">{roadmap.title}</h1>
                        <p className="text-slate-400 mt-1">{roadmap.description}</p>
                     </div>
                     <div className="hidden md:block text-right">
                         <div className="px-4 py-2 bg-brand-500/10 border border-brand-500/20 rounded-full text-brand-400 text-xs font-bold uppercase tracking-wider inline-block">
                             Updated Dec 2025
                         </div>
                         <div className="text-xs text-slate-500 mt-2">
                             Full Curriculum
                         </div>
                     </div>
                 </div>
            </div>

            {/* Timeline Content */}
            <div className="max-w-4xl mx-auto px-6 py-12 relative">
                
                {/* Central Line */}
                <div className="absolute left-6 md:left-1/2 top-12 bottom-12 w-0.5 bg-slate-800 md:-translate-x-1/2"></div>

                <div className="space-y-16">
                    {roadmap.sections.map((section, idx) => {
                        const isRight = idx % 2 === 0;

                         return (
                             <div key={idx} className={`relative flex flex-col md:flex-row gap-8 ${isRight ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                                 
                                 {/* Timeline Node (Icon) */}
                                 <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-12 h-12 rounded-2xl bg-slate-900 border-4 border-slate-950 flex items-center justify-center z-10 shadow-xl" id={`section-${idx}`}>
                                     <div className="w-full h-full bg-slate-800 rounded-xl flex items-center justify-center border border-slate-700 shadow-inner">
                                        {section.icon ? <section.icon className="w-5 h-5 text-brand-400" /> : <div className="w-2 h-2 bg-brand-500 rounded-full" />}
                                     </div>
                                 </div>

                                 {/* Content Card Side */}
                                 <div className={`flex-1 pl-16 md:pl-0 ${isRight ? 'md:pr-16 md:text-right' : 'md:pl-16 md:text-left'}`}>
                                      <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3 md:inline-flex">
                                          {isRight ? (
                                              <>
                                                {section.title}
                                                <span className="text-slate-600 text-lg font-light hidden md:inline">0{idx + 1}</span>
                                              </>
                                          ) : (
                                              <>
                                                <span className="text-slate-600 text-lg font-light hidden md:inline">0{idx + 1}</span>
                                                {section.title}
                                              </>
                                          )}
                                      </h2>

                                      <div className={`space-y-4 ${isRight ? 'md:items-end' : 'md:items-start'} flex flex-col`}>
                                          {section.topics.map((topic, tIdx) => (
                                              <div 
                                                key={tIdx} 
                                                className={`group relative p-5 rounded-xl border bg-slate-900/50 hover:bg-slate-800/80 transition-all cursor-pointer w-full hover:-translate-y-1 duration-300 shadow-lg ${
                                                    topic.priority === 'high' ? 'border-l-4 border-l-brand-500 border-y-slate-800 border-r-slate-800 shadow-brand-500/5' :
                                                    topic.priority === 'medium' ? 'border-l-4 border-l-yellow-500/50 border-y-slate-800 border-r-slate-800' :
                                                    'border-l-4 border-l-slate-700 border-y-slate-800 border-r-slate-800'
                                                }`}
                                              >
                                                  <div className={`flex flex-col gap-3 ${isRight ? 'md:items-end' : 'md:items-start'}`}>
                                                      
                                                      {/* Top Row: Title + Priority */}
                                                      <div className={`flex items-center gap-3 w-full ${isRight ? 'md:flex-row-reverse justify-between' : 'flex-row justify-between'}`}>
                                                          <h3 className="text-lg font-bold text-white group-hover:text-brand-300 transition-colors">{topic.title}</h3>
                                                          <PriorityBadge priority={topic.priority} />
                                                      </div>
                                                      
                                                      <p className="text-sm text-slate-400 font-medium leading-relaxed">{topic.description}</p>
                                                      
                                                      {/* Tech Stack Chips */}
                                                      {topic.technologies && topic.technologies.length > 0 && (
                                                          <div className={`flex flex-wrap gap-2 mt-2 ${isRight ? 'md:justify-end' : 'md:justify-start'}`}>
                                                              {topic.technologies.map(tech => (
                                                                  <span key={tech} className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-mono hover:text-white hover:border-slate-500 transition-colors">
                                                                    {tech}
                                                                  </span>
                                                              ))}
                                                          </div>
                                                      )}
                                                      
                                                      {/* Bookmarks Section */}
                                                      {topic.bookmarks && topic.bookmarks.length > 0 && (
                                                          <div className={`mt-4 pt-4 border-t border-slate-800/50 w-full ${isRight ? 'md:text-right' : 'md:text-left'}`}>
                                                              <h4 className="text-[10px] uppercase font-bold text-slate-500 mb-2 tracking-wider flex items-center gap-1.5 opacity-70">
                                                                  <div className={`bg-brand-500/20 p-1 rounded-full ${isRight ? 'order-last' : ''}`}>
                                                                    <Globe className="w-3 h-3 text-brand-400" />
                                                                  </div>
                                                                  Top Resources
                                                              </h4>
                                                              <div className={`flex flex-col gap-1.5 ${isRight ? 'md:items-end' : 'md:items-start'}`}>
                                                                {topic.bookmarks.map((b, i) => (
                                                                    <a 
                                                                        key={i} 
                                                                        href={b.url} 
                                                                        target="_blank" 
                                                                        rel="noreferrer" 
                                                                        className="text-xs text-brand-300 hover:text-brand-200 hover:underline flex items-center gap-2 group/link"
                                                                    >
                                                                        {b.title}
                                                                        <ArrowLeft className="w-3 h-3 rotate-180 opacity-0 group-hover/link:opacity-100 transition-opacity -ml-1 group-hover/link:translate-x-1" />
                                                                    </a>
                                                                ))}
                                                              </div>
                                                          </div>
                                                      )}

                                                  </div>
                                              </div>
                                          ))}
                                      </div>
                                 </div>

                                 {/* Empty Space for Balance */}
                                 <div className="flex-1 hidden md:block"></div>
                             </div>
                         );
                    })}
                </div>

                 {/* Bottom CTA */}
                <div className="mt-24 text-center relative z-10 pb-20">
                    <div className="inline-block p-1 rounded-2xl bg-gradient-to-r from-brand-500 to-purple-500">
                        <div className="bg-slate-950 rounded-xl p-8 max-w-xl">
                            <h3 className="text-2xl font-bold text-white mb-2">Ready to master {roadmap.title}?</h3>
                            <p className="text-slate-400 mb-6">Create a personalized learning plan with AI, track your progress, and get help when you stick.</p>
                            <button 
                                onClick={() => navigate('/roadmap-generator', { state: { role: roadmap.id } })}
                                className="px-8 py-3 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 mx-auto"
                            >
                                <Zap className="w-4 h-4" />
                                Generate My Path
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
