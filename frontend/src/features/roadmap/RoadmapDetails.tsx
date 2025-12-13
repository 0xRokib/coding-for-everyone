import { ArrowLeft, Brain, Code2, Cpu, Database, Globe, Layers, Layout, Lock, Server, Settings, Terminal, Zap } from 'lucide-react';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { roadmapService } from '../../services/roadmap.service';

const ScrollReveal = ({ children, className = '' }: { children: ReactNode; className?: string }) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            {
                threshold: 0.1,
                rootMargin: '50px'
            }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, []);

    return (
        <div 
            ref={ref} 
            className={`transition-all duration-700 ease-out transform ${
                isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
            } ${className}`}
        >
            {children}
        </div>
    );
};

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
        description: 'Master HTML, CSS, JavaScript, and React to build beautiful user interfaces.',
        sections: [
            {
                title: 'The Internet & Web',
                icon: Globe,
                topics: [
                    { 
                        title: 'How the Internet Works', 
                        description: 'DNS, Domains, Hosting, and HTTP basics.', 
                        priority: 'high',
                        technologies: ['DNS', 'HTTP/HTTPS', 'Browsers'],
                        bookmarks: [
                            { title: 'How the Internet Works (Video)', url: 'https://www.youtube.com/watch?v=DXv1_f3b6gw' },
                            { title: 'MDN: How the Web Works', url: 'https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Web_mechanics/How_does_the_Internet_work' }
                        ]
                    },
                    { 
                        title: 'Browsers', 
                        description: 'Rendering engine, parsing, and compositing.', 
                        priority: 'high',
                        technologies: ['V8 Engine', 'DOM', 'Render Tree'],
                        bookmarks: [
                            { title: 'Populating the page: how browsers work', url: 'https://developer.mozilla.org/en-US/docs/Web/Performance/How_browsers_work' }
                        ]
                    }
                ]
            },
            {
                title: 'HTML & CSS',
                icon: Layout,
                topics: [
                    { 
                        title: 'Semantic HTML', 
                        description: 'Structure your content meaningfully.', 
                        priority: 'high',
                        technologies: ['Tags', 'Forms', 'SEO', 'Accessibility'],
                        bookmarks: [
                            { title: 'Semantic HTML5 Guide', url: 'https://developer.mozilla.org/en-US/docs/Glossary/Semantics' },
                            { title: 'A11y Project', url: 'https://www.a11yproject.com/' }
                        ]
                    },
                    { 
                        title: 'Modern CSS', 
                        description: 'Layouts and styling.', 
                        priority: 'high',
                        technologies: ['Flexbox', 'Grid', 'Variables', 'Animations'],
                        bookmarks: [
                            { title: 'A Complete Guide to Flexbox', url: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/' },
                            { title: 'Grid Garden Game', url: 'https://cssgridgarden.com/' }
                        ]
                    },
                    { 
                        title: 'Responsive Design', 
                        description: 'Mobile-first approach.', 
                        priority: 'high',
                        technologies: ['Media Queries', 'Viewport'],
                        bookmarks: [
                            { title: 'Responsive Web Design Basics', url: 'https://web.dev/responsive-web-design-basics/' }
                        ]
                    }
                ]
            },
            {
                title: 'JavaScript Ecosystem',
                icon: Code2,
                topics: [
                    { 
                        title: 'JavaScript Core', 
                        description: 'The language of the web.', 
                        priority: 'high',
                        technologies: ['ES6+', 'Async/Await', 'DOM Manipulation', 'Fetch API'],
                        bookmarks: [
                            { title: 'JavaScript.info (Best Resource)', url: 'https://javascript.info/' },
                            { title: 'Namaste JavaScript (Video)', url: 'https://www.youtube.com/playlist?list=PLlasXeu85E9cQ32gLCvAvr9vNaUccPVNP' }
                        ]
                    },
                    { 
                        title: 'Build Tools', 
                        description: 'Bundlers and transpilers.', 
                        priority: 'medium',
                        technologies: ['Vite', 'Webpack', 'Babel', 'npm/yarn'],
                        bookmarks: [
                            { title: 'Vite in 100 Seconds', url: 'https://www.youtube.com/watch?v=KCrXgy8qtjM' }
                        ]
                    },
                    { 
                        title: 'React', 
                        description: 'Component-based UI library.', 
                        priority: 'high',
                        technologies: ['Hooks', 'Context', 'State Management', 'JSX'],
                        bookmarks: [
                            { title: 'React Documentation (Official)', url: 'https://react.dev/' },
                            { title: 'React Course - Beginner\'s Guide', url: 'https://www.youtube.com/watch?v=bMknfKXIFA8' }
                        ]
                    }
                ]
            }
        ]
    },
    'backend': {
        id: 'backend',
        title: 'Backend Developer',
        description: 'Design robust APIs, manage databases, and ensure server scalability.',
        sections: [
            {
                title: 'Server Fundamentals',
                icon: Server,
                topics: [
                    { 
                        title: 'HTTP & Protocols', 
                        description: 'Understanding data transmission.', 
                        priority: 'high',
                        technologies: ['HTTP/1.1 vs 2', 'REST', 'GraphQL', 'gRPC'],
                        bookmarks: [
                            { title: 'HTTP: The Protocol Every Web Dev Must Know', url: 'https://code.tutsplus.com/tutorials/http-the-protocol-every-web-developer-must-know-part-1--net-31177' }
                        ]
                    },
                    { 
                        title: 'OS & Terminal', 
                        description: 'Linux command line mastery.', 
                        priority: 'medium',
                        technologies: ['Bash/Zsh', 'SSH', 'Process Management', 'Permissions'],
                        bookmarks: [
                            { title: 'Linux Journey', url: 'https://linuxjourney.com/' },
                            { title: 'Missing Semester (MIT)', url: 'https://missing.csail.mit.edu/' }
                        ]
                    }
                ]
            },
            {
                title: 'Databases',
                icon: Database,
                topics: [
                    { 
                        title: 'Relational DBs', 
                        description: 'Structured data storage.', 
                        priority: 'high',
                        technologies: ['PostgreSQL', 'MySQL', 'Normalization', 'ACID'],
                        bookmarks: [
                            { title: 'PostgreSQL Tutorial', url: 'https://www.postgresqltutorial.com/' },
                            { title: 'SQLZoo (Practice)', url: 'https://sqlzoo.net/' }
                        ]
                    },
                    { 
                        title: 'NoSQL & Caching', 
                        description: 'High performance data stores.', 
                        priority: 'medium',
                        technologies: ['MongoDB', 'Redis', 'ElasticSearch'],
                        bookmarks: [
                            { title: 'MongoDB Crash Course', url: 'https://www.youtube.com/watch?v=ofme2o29ngU' }
                        ]
                    },
                    { 
                        title: 'ORMs', 
                        description: 'Bridging code and data.', 
                        priority: 'medium',
                        technologies: ['Prisma', 'GORM', 'TypeORM'],
                        bookmarks: [
                             { title: 'Prisma 101', url: 'https://www.prisma.io/docs/getting-started' }
                        ]
                    }
                ]
            },
            {
                title: 'API Security',
                icon: Lock,
                topics: [
                   { 
                       title: 'Authentication', 
                       description: 'Verifying user identity.', 
                       priority: 'high',
                       technologies: ['JWT', 'OAuth2', 'Session Auth'],
                       bookmarks: [
                           { title: 'JWT.io Introduction', url: 'https://jwt.io/introduction' },
                           { title: 'OAuth 2.0 Simplified', url: 'https://www.oauth.com/' }
                       ]
                   },
                   { 
                       title: 'Authorization', 
                       description: 'Access control.', 
                       priority: 'high',
                       technologies: ['RBAC', 'Scopes', 'Policies'],
                        bookmarks: [
                            { title: 'OWASP Security Cheat Sheet', url: 'https://cheatsheetseries.owasp.org/' }
                        ]
                   }
                ]
            }
        ]
    },
    'fullstack': {
        id: 'fullstack',
        title: 'Full Stack Developer',
        description: 'Master the entire stack from beautiful UIs to scalable backends.',
        sections: [
            {
                title: 'Frontend Mastery',
                icon: Layout,
                topics: [
                    { 
                        title: 'React & Ecosystem', 
                        priority: 'high', 
                        description: 'Advanced UI patterns.', 
                        technologies: ['Hooks', 'Patterns', 'TanStack Query'],
                        bookmarks: [
                            { title: 'React Patterns', url: 'https://reactpatterns.com/' },
                            { title: 'TanStack Query Docs', url: 'https://tanstack.com/query/latest' }
                        ]
                    },
                    { 
                        title: 'CSS Frameworks', 
                        priority: 'medium', 
                        description: 'Rapid styling.', 
                        technologies: ['Tailwind', 'Shadcn/UI'],
                        bookmarks: [
                            { title: 'Tailwind CSS Docs', url: 'https://tailwindcss.com/docs' }
                        ]
                    }
                ]
            },
            {
                title: 'Backend Integration',
                icon: Server,
                topics: [
                    { 
                        title: 'API Design', 
                        priority: 'high', 
                        description: 'Connecting front and back.', 
                        technologies: ['REST', 'tRPC'],
                        bookmarks: [
                             { title: 'RESTful API Design', url: 'https://restfulapi.net/' }
                        ]
                    },
                    { 
                        title: 'Serverless', 
                        priority: 'medium', 
                        description: 'Modern deployment.', 
                        technologies: ['Edge Functions', 'AWS Lambda'],
                         bookmarks: [
                             { title: 'Vercel Serverless Functions', url: 'https://vercel.com/docs/functions' }
                         ]
                    }
                ]
            },
            {
                title: 'Deployment',
                icon: Globe,
                topics: [
                    { 
                        title: 'CI/CD', 
                        priority: 'high', 
                        description: 'Automated pipelines.', 
                        technologies: ['GitHub Actions', 'Vercel'],
                        bookmarks: [
                            { title: 'GitHub Actions Documentation', url: 'https://docs.github.com/en/actions' }
                        ]
                    },
                    { 
                        title: 'Docker', 
                        priority: 'medium', 
                        description: 'Containerization.', 
                        technologies: ['Dockerfile', 'Compose'],
                        bookmarks: [
                            { title: 'Docker for Beginners', url: 'https://docker-curriculum.com/' }
                        ]
                    }
                ]
            }
        ]
    },
    'ai-engineer': {
        id: 'ai-engineer',
        title: 'AI Engineer',
        description: 'Build the future with LLMs, agents, and machine learning models.',
        sections: [
            {
                title: 'Python Foundation',
                icon: Terminal,
                topics: [
                    { 
                        title: 'Python Core', 
                        priority: 'high', 
                        description: 'Language of AI.', 
                        technologies: ['Python 3.11+', 'Virtual Envs'],
                        bookmarks: [
                            { title: 'Real Python', url: 'https://realpython.com/' },
                            { title: 'Automate the Boring Stuff', url: 'https://automatetheboringstuff.com/' }
                        ]
                    },
                    { 
                        title: 'Data Handling', 
                        priority: 'high', 
                        description: 'NumPy and Pandas.', 
                        technologies: ['DataFrames', 'Vectorization'],
                        bookmarks: [
                            { title: 'Pandas Documentation', url: 'https://pandas.pydata.org/docs/' }
                        ]
                    }
                ]
            },
            {
                title: 'LLMs & APIs',
                icon: Zap,
                topics: [
                    { 
                        title: 'OpenAI API', 
                        priority: 'high', 
                        description: 'Integrating GPT models.', 
                        technologies: ['ChatCompletions', 'Embeddings'],
                        bookmarks: [
                            { title: 'OpenAI Cookbook', url: 'https://github.com/openai/openai-cookbook' }
                        ]
                    },
                    { 
                        title: 'Prompt Engineering', 
                        priority: 'high', 
                        description: 'Optimizing inputs.', 
                        technologies: ['Chain-of-thought', 'ReAct'],
                        bookmarks: [
                             { title: 'Prompt Engineering Guide', url: 'https://www.promptingguide.ai/' }
                        ]
                    },
                    { 
                        title: 'LangChain', 
                        priority: 'medium', 
                        description: 'Orchestrating chains.', 
                        technologies: ['Agents', 'Tools'],
                        bookmarks: [
                            { title: 'LangChain JS/TS Docs', url: 'https://js.langchain.com/docs/get_started/introduction' }
                        ]
                    }
                ]
            },
            {
                title: 'Vector Databases',
                icon: Database,
                topics: [
                    { 
                        title: 'RAG Architecture', 
                        priority: 'high', 
                        description: 'Retrieval Augmented Generation.', 
                        technologies: ['Pinecone', 'ChromaDB'],
                        bookmarks: [
                            { title: 'What is RAG?', url: 'https://help.openai.com/en/articles/8868588-retrieval-augmented-generation-rag-and-semantic-search-for-gpts' }
                        ]
                    },
                    { 
                        title: 'Embeddings', 
                        priority: 'high', 
                        description: 'Semantic search.', 
                        technologies: ['Vector Math', 'Similarity Search']
                    }
                ]
            }
        ]
    },
    'devops': {
        id: 'devops',
        title: 'DevOps Engineer',
        description: 'Bridge the gap between code and operations with automation.',
        sections: [
            {
                title: 'Infrastructure as Code',
                icon: Server,
                topics: [
                    { 
                        title: 'Linux', 
                        priority: 'high', 
                        description: 'Operating System fundamentals.', 
                        technologies: ['Bash', 'Scripting'],
                        bookmarks: [
                            { title: 'Linux Command Line', url: 'https://linuxcommand.org/' }
                        ]
                    },
                    { 
                        title: 'Terraform', 
                        priority: 'high', 
                        description: 'Provisioning infrastructure.', 
                        technologies: ['HCL', 'Modules', 'State'],
                        bookmarks: [
                            { title: 'Terraform Tutorials', url: 'https://developer.hashicorp.com/terraform/tutorials' }
                        ]
                    }
                ]
            },
            {
                title: 'Containers',
                icon: Layers,
                topics: [
                    { 
                        title: 'Docker', 
                        priority: 'high', 
                        description: 'Packaging apps.', 
                        technologies: ['Images', 'Containers', 'Compose'],
                        bookmarks: [
                            { title: 'Play with Docker', url: 'https://labs.play-with-docker.com/' }
                        ]
                    },
                    { 
                        title: 'Kubernetes', 
                        priority: 'high', 
                        description: 'Orchestration.', 
                        technologies: ['Pods', 'Services', 'Helm'],
                        bookmarks: [
                            { title: 'Kubernetes Basics', url: 'https://kubernetes.io/docs/tutorials/kubernetes-basics/' }
                        ]
                    }
                ]
            },
            {
                title: 'CI/CD Pipelines',
                icon: Settings,
                topics: [
                    { 
                        title: 'Automation', 
                        priority: 'high', 
                        description: 'Testing and deployment.', 
                        technologies: ['GitHub Actions', 'GitLab CI', 'Jenkins']
                    },
                    { 
                        title: 'Monitoring', 
                        priority: 'medium', 
                        description: 'Observability.', 
                        technologies: ['Prometheus', 'Grafana', 'ELK'],
                         bookmarks: [
                             { title: 'Prometheus Overview', url: 'https://prometheus.io/docs/introduction/overview/' }
                         ]
                    }
                ]
            }
        ]
    },
    'data-science': {
        id: 'data-science',
        title: 'Data Scientist',
        description: 'Turn raw data into actionable insights using statistics and ML.',
        sections: [
            {
                title: 'Mathematics',
                icon: Cpu,
                topics: [
                    { 
                        title: 'Statistics', 
                        priority: 'high', 
                        description: 'Foundational math.', 
                        technologies: ['Probability', 'Distribution', 'Hypothesis Testing'],
                        bookmarks: [
                             { title: 'Khan Academy: Statistics', url: 'https://www.khanacademy.org/math/statistics-probability' }
                        ]
                    },
                    { 
                        title: 'Linear Algebra', 
                        priority: 'medium', 
                        description: 'Matrix operations.', 
                        technologies: ['Vectors', 'Matrices'],
                         bookmarks: [
                             { title: '3Blue1Brown Linear Algebra', url: 'https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab' }
                         ]
                    }
                ]
            },
            {
                title: 'Analysis Tools',
                icon: Database,
                topics: [
                    { 
                        title: 'Python Stack', 
                        priority: 'high', 
                        description: 'Data manipulation.', 
                        technologies: ['Pandas', 'NumPy', 'Matplotlib', 'Seaborn'],
                        bookmarks: [
                            { title: 'Kaggle Learn: Python', url: 'https://www.kaggle.com/learn/python' }
                        ]
                    },
                    { 
                        title: 'SQL', 
                        priority: 'high', 
                        description: 'Querying data.', 
                        technologies: ['Joins', 'Aggregations', 'Window Functions'],
                        bookmarks: [
                             { title: 'Mode Analytics SQL Tutorial', url: 'https://mode.com/sql-tutorial/' }
                        ]
                    }
                ]
            },
            {
                title: 'Machine Learning',
                icon: Brain,
                topics: [
                    { 
                        title: 'Supervised Learning', 
                        priority: 'high', 
                        description: 'Labeled data.', 
                        technologies: ['Regression', 'Classification', 'Scikit-Learn'],
                        bookmarks: [
                            { title: 'Andrew Ng ML Course', url: 'https://www.coursera.org/learn/machine-learning' }
                        ]
                    },
                    { 
                        title: 'Unsupervised Learning', 
                        priority: 'medium', 
                        description: 'Clustering.', 
                        technologies: ['K-Means', 'PCA']
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
    
    // Scroll Progress Logic
    const timelineRef = useRef<HTMLDivElement>(null);
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            if (!timelineRef.current) return;
            
            const rect = timelineRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const elementTop = rect.top;
            const elementHeight = rect.height;
            
            // Start tracking when the top of the element hits the middle of the screen
            const startOffset = windowHeight / 2;
            const endOffset = windowHeight / 2;
            
            // Calculate how much of the element has passed the center of the screen
            let percentage = (windowHeight / 2 - elementTop) / elementHeight;
            
            // Clamp between 0 and 1
            percentage = Math.max(0, Math.min(1, percentage));
            
            setScrollProgress(percentage * 100);
        };

        window.addEventListener('scroll', handleScroll);
        // Trigger once on mount
        handleScroll();
        
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Check if it's a known static role or a dynamic ID
    const isStatic = roleId && ROADMAP_DATA[roleId];
    
    useEffect(() => {
        if (!isStatic && roleId) {
            setLoading(true);
            roadmapService.getRoadmapById(roleId)
                .then(res => {
                    if (res.success && res.data && res.data.content) {
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
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-brand-500/30">
            {/* Header */}
            <div className="border-b border-slate-900 bg-slate-950/95 backdrop-blur z-40 sticky top-16">
                 <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
                     <div className="flex items-center gap-4">
                        <button 
                            onClick={() => navigate('/roadmap')}
                            className="w-8 h-8 flex items-center justify-center rounded-md bg-slate-900 border border-slate-800 text-slate-400 hover:text-brand-400 hover:border-brand-500/30 transition-all shrink-0"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </button>
                        <div>
                            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-100">{roadmap.title}</h1>
                        </div>
                     </div>
                 </div>
            </div>

            {/* Timeline Content */}
            <div className="max-w-5xl mx-auto px-6 py-12">
                
                {/* Timeline Wrapper */}
                <div ref={timelineRef} className="relative pb-12">
                    {/* Background Line */}
                    <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[2px] bg-slate-800/50 md:-translate-x-1/2 rounded-full"></div>
                    
                    {/* Magic Cursor (Progress Line) */}
                    <div 
                        className="absolute left-6 md:left-1/2 top-0 w-[2px] bg-gradient-to-b from-brand-500 via-brand-400 to-transparent md:-translate-x-1/2 rounded-full transition-[height] duration-100 ease-out will-change-transform shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                        style={{ height: `${scrollProgress}%` }}
                    >
                        {/* Glowing Tip */}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-brand-400 rounded-full blur-[6px]"></div>
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-brand-100 rounded-full"></div>
                    </div>

                    <div className="space-y-20 pt-10">
                        {roadmap.sections.map((section, idx) => {
                            const isRight = idx % 2 === 0;

                             return (
                                 <ScrollReveal key={idx} className={`relative flex flex-col md:flex-row gap-16 ${isRight ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                                     
                                     {/* Center Node Area */}
                                     {/* We use strict absolute positioning to align with the central line */}
                                     <div className="absolute left-6 md:left-1/2 top-0 -translate-x-1/2 z-20 flex flex-col items-center">
                                         <div className={`w-4 h-4 rounded-full border-[3px] transition-colors duration-500 ${
                                             // Highlight node if passed
                                             (idx + 1) / roadmap.sections.length * 100 <= scrollProgress + 10 
                                                ? 'bg-slate-950 border-brand-400 shadow-[0_0_10px_rgba(99,102,241,0.5)]' 
                                                : 'bg-slate-950 border-slate-700'
                                         }`}></div>
                                     </div>

                                     {/* Content Side */}
                                     <div className={`flex-1 pl-16 md:pl-0 ${isRight ? 'md:pr-16 md:text-right' : 'md:pl-16 md:text-left'} z-10`}>
                                          <div className={`flex flex-col gap-2 mb-6 ${isRight ? 'md:items-end' : 'md:items-start'}`}>
                                              <span className="text-brand-500 font-mono text-xs font-bold tracking-widest uppercase opacity-80">
                                                  Phase 0{idx + 1}
                                              </span>
                                              <h2 className="text-3xl font-bold text-white">{section.title}</h2>
                                          </div>

                                          <div className={`grid gap-6 ${isRight ? 'md:justify-items-end' : 'md:justify-items-start'}`}>
                                              {section.topics.map((topic, tIdx) => (
                                                  <div 
                                                    key={tIdx} 
                                                    className={`group relative w-full md:w-[90%] bg-slate-900/40 hover:bg-slate-900/80 border border-slate-800/80 hover:border-brand-500/30 rounded-xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-brand-500/10 ${
                                                        isRight ? 'border-r-2 border-r-slate-800 hover:border-r-brand-500' : 'border-l-2 border-l-slate-800 hover:border-l-brand-500'
                                                    }`}
                                                  >
                                                      {/* Card Header */}
                                                      <div className={`flex justify-between items-start gap-4 mb-3 ${isRight ? 'flex-row-reverse' : ''}`}>
                                                          <h3 className="text-lg font-bold text-slate-100 group-hover:text-brand-400 transition-colors">{topic.title}</h3>
                                                          <PriorityBadge priority={topic.priority} />
                                                      </div>
                                                      
                                                      {/* Description */}
                                                      <p className="text-sm text-slate-400 leading-relaxed mb-5">{topic.description}</p>
                                                      
                                                      {/* Footer with Tech & Resources */}
                                                      <div className={`flex flex-col gap-4 border-t border-slate-800/50 pt-4 ${isRight ? 'md:items-end' : ''}`}>
                                                          {/* Tech Stack */}
                                                          {topic.technologies && topic.technologies.length > 0 && (
                                                              <div className={`flex flex-wrap gap-2 ${isRight ? 'justify-end' : 'justify-start'}`}>
                                                                  {topic.technologies.map(tech => (
                                                                      <span key={tech} className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-950 px-2 py-1 rounded border border-slate-800">
                                                                          {tech}
                                                                      </span>
                                                                  ))}
                                                              </div>
                                                          )}
                                                          
                                                          {/* Links - Compact */}
                                                          {topic.bookmarks && topic.bookmarks.length > 0 && (
                                                              <div className={`flex flex-wrap gap-3 ${isRight ? 'justify-end' : 'justify-start'}`}>
                                                                  {topic.bookmarks.map((b, i) => (
                                                                     <a 
                                                                        key={i} 
                                                                        href={b.url} 
                                                                        target="_blank" 
                                                                        rel="noreferrer" 
                                                                        className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-brand-400 transition-colors"
                                                                     >
                                                                         <Globe className="w-3 h-3" />
                                                                         {b.title}
                                                                     </a> 
                                                                  ))}
                                                              </div>
                                                          )}
                                                      </div>
                                                  </div>
                                              ))}
                                          </div>
                                     </div>

                                     {/* Empty Space for Balance */}
                                     <div className="flex-1 hidden md:block"></div>
                                 </ScrollReveal>
                             );
                        })}
                    </div>
                </div>

                 {/* Bottom CTA */}
                <div className="mt-20 text-center pb-20">
                    <div className="max-w-xl mx-auto">
                        <h3 className="text-xl font-bold text-white mb-2">Build Your Personal Plan</h3>
                        <p className="text-slate-400 mb-6 text-sm">Need a schedule tailored to your pace?</p>
                        <button 
                            onClick={() => navigate('/roadmap-generator', { state: { role: roadmap.id } })}
                            className="px-6 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-lg hover:scale-105 transition-all flex items-center justify-center gap-2 mx-auto text-sm shadow-lg shadow-brand-500/20"
                        >
                            <Zap className="w-4 h-4" />
                            Generate Custom Roadmap
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
