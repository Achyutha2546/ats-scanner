import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  FileText, 
  CheckCircle, 
  Search, 
  Compass, 
  LayoutTemplate, 
  Monitor, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  TrendingUp, 
  Star, 
  ChevronDown, 
  ChevronRight,
  Code2,
  CheckCircle2,
  XCircle,
  Award,
  Layers,
  BarChart3,
  Sliders,
  ExternalLink,
  Bot
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Landing = () => {
  // Interactive Hero Demo State
  const [selectedRole, setSelectedRole] = useState('fullstack');
  const [activeFaq, setActiveFaq] = useState(null);

  const roleDemos = {
    fullstack: {
      title: 'Full Stack Engineer',
      score: 96,
      keywordMatch: '98%',
      experienceMatch: '94%',
      matchedSkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'AWS', 'GraphQL', 'Tailwind CSS'],
      missingSkills: ['Kubernetes', 'Redis'],
      sampleBefore: 'Worked on backend APIs and built frontend pages for client web applications.',
      sampleAfter: 'Architected high-throughput REST & GraphQL microservices in Node.js/TypeScript, reducing p99 latency by 42% and scaling to 120k daily active users.',
      metricBoost: '+48% Recruiter Inquiries'
    },
    frontend: {
      title: 'Senior Frontend Developer',
      score: 94,
      keywordMatch: '96%',
      experienceMatch: '92%',
      matchedSkills: ['React', 'Next.js', 'TypeScript', 'Redux', 'Tailwind CSS', 'Jest', 'Webpack', 'Accessibility (a11y)'],
      missingSkills: ['Cypress', 'Vite SSR'],
      sampleBefore: 'Created UI components and fixed bugs on dashboard pages.',
      sampleAfter: 'Engineered a modular design system of 40+ accessible React components, slashing sprint delivery cycle times by 30% across 5 engineering squads.',
      metricBoost: '+54% Callbacks'
    },
    backend: {
      title: 'Backend & Distributed Systems',
      score: 92,
      keywordMatch: '95%',
      experienceMatch: '90%',
      matchedSkills: ['Python', 'Go', 'PostgreSQL', 'Redis', 'Kafka', 'Docker', 'Microservices', 'gRPC'],
      missingSkills: ['Terraform', 'Prometheus'],
      sampleBefore: 'Handled databases, queries, and server uptime maintenance.',
      sampleAfter: 'Designed asynchronous event-driven pipelines using Apache Kafka & Go, processing 4M+ daily events with 99.99% uptime compliance.',
      metricBoost: '+41% Interview Rate'
    },
    datascience: {
      title: 'Data Scientist & ML Engineer',
      score: 95,
      keywordMatch: '97%',
      experienceMatch: '93%',
      matchedSkills: ['Python', 'TensorFlow', 'PyTorch', 'Pandas', 'SQL', 'Scikit-Learn', 'Feature Engineering'],
      missingSkills: ['MLflow', 'Kubeflow'],
      sampleBefore: 'Built predictive machine learning models on dataset records.',
      sampleAfter: 'Trained and deployed transformer-based NLP classification models into production, boosting user recommendation accuracy by 26%.',
      metricBoost: '+60% Tech Screens'
    }
  };

  const currentRole = roleDemos[selectedRole];

  const faqs = [
    {
      q: 'What is an ATS and why do over 75% of resumes get rejected?',
      a: 'Applicant Tracking Systems (ATS) are automated screening algorithms used by 99% of Fortune 500 companies (like Workday, Greenhouse, Taleo, and Lever). They parse resumes for specific job keywords, standard formatting, and quantifiable evidence. If a resume has complex multi-column graphics, non-standard headings, or lacks core target keywords, it gets filtered out before a human recruiter ever sees it.'
    },
    {
      q: 'How does ResumeAI guarantee my resume passes ATS filters?',
      a: 'ResumeAI reverse-engineers the exact parsing rules of major ATS software. Our AI cross-references your resume against real job descriptions, scores your semantic keyword relevance, flags missing hard and soft skills, and outputs clean, parseable single-column formatting that scores 90%+ on all standard checkers.'
    },
    {
      q: 'Can I generate a personal web portfolio from the same data?',
      a: 'Yes! With one click, your structured resume data is converted into a modern, mobile-responsive, and hosted developer portfolio website with interactive project cards, skills cloud, and direct contact buttons.'
    },
    {
      q: 'Is it free to get started and build my resume?',
      a: 'Absolutely. You can start creating your resume, run automated ATS compatibility checks, view skill gaps, and preview templates completely free without any credit card required.'
    },
    {
      q: 'Can I export my resume to PDF without breaking the layout?',
      a: 'Yes, our export engine generates clean, pixel-perfect, printer-friendly PDFs that preserve strict text-layer hierarchies so that both bots and human hiring managers can read them flawlessly.'
    }
  ];

  const FADE_UP = {
    hidden: { opacity: 0, y: 25 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 70, damping: 18 } }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 font-sans selection:bg-indigo-500/30 selection:text-white relative overflow-x-hidden">
      
      {/* Background Ambient Glow & Subtle Grid */}
      <div className="absolute top-0 inset-x-0 h-[1000px] overflow-hidden pointer-events-none flex justify-center z-0">
        <div className="w-[1000px] h-[700px] bg-gradient-to-tr from-indigo-600/15 via-purple-600/10 to-cyan-500/10 blur-[140px] rounded-full translate-y-[-25%]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>

      {/* Top Notification Announcement Banner */}
      <div className="relative z-30 bg-gradient-to-r from-indigo-950/80 via-slate-900/90 to-indigo-950/80 border-b border-indigo-500/20 py-2.5 px-4 text-center text-xs sm:text-sm">
        <div className="inline-flex items-center gap-2 text-indigo-300 font-medium">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="bg-indigo-500/20 text-indigo-200 text-[11px] font-semibold px-2 py-0.5 rounded-full border border-indigo-500/30">
            NEW v2.4
          </span>
          <span>Next-Gen Multi-Factor ATS Scoring Engine is live</span>
          <Link to="/register" className="text-white hover:text-indigo-200 underline font-semibold ml-1 inline-flex items-center gap-1">
            Try Free Scan <ArrowRight size={12} />
          </Link>
        </div>
      </div>

      {/* Sticky Glass Navbar */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-40 backdrop-blur-xl bg-slate-950/70 border-b border-slate-800/60 w-full"
      >
        <div className="w-full px-6 lg:px-12 py-4 flex items-center justify-between max-w-7xl mx-auto">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-indigo-400 text-white flex items-center justify-center rounded-xl font-bold shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-300">
              <Sparkles size={20} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-white">Resume<span className="text-indigo-400">AI</span></span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded">Pro</span>
              </div>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#demo" className="hover:text-white transition-colors">Interactive Demo</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#testimonials" className="hover:text-white transition-colors">Success Stories</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white px-4 py-2 rounded-lg hover:bg-slate-800/50 transition-colors">
              Sign in
            </Link>
            <Link 
              to="/register" 
              className="text-sm font-semibold bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-white px-5 py-2.5 rounded-full hover:shadow-[0_0_25px_rgba(99,102,241,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 inline-flex items-center gap-1.5"
            >
              <span>Build Free Resume</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative z-10 w-full px-6 pt-16 pb-16 lg:pt-24 lg:pb-24 max-w-7xl mx-auto flex flex-col items-center text-center">
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.12 } }
          }}
          className="flex flex-col items-center justify-center max-w-5xl mx-auto"
        >
          {/* Tag Pill */}
          <motion.div variants={FADE_UP} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.15)] mb-8">
            <ShieldCheck size={16} className="text-indigo-400" />
            <span className="text-xs sm:text-sm font-medium text-indigo-200">
              Tested against Workday, Greenhouse, Lever & Taleo ATS
            </span>
          </motion.div>
          
          {/* Main Headline */}
          <motion.h1 variants={FADE_UP} className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white mb-8 tracking-tight leading-[1.05]">
            Land 3x more interviews with an{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-400">
              ATS-proof resume
            </span>
            {' '}& portfolio.
          </motion.h1>
          
          {/* Subtitle */}
          <motion.p variants={FADE_UP} className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed font-normal">
            Stop losing job opportunities to automated recruiter bots. ResumeAI diagnoses keyword gaps, writes impactful metric-driven bullets, and crafts stunning portfolio websites that get you hired.
          </motion.p>
          
          {/* Action CTAs */}
          <motion.div variants={FADE_UP} className="flex flex-col sm:flex-row items-center gap-4 justify-center w-full max-w-md mx-auto mb-10">
            <Link 
              to="/register" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-white text-base font-semibold px-8 py-4 rounded-xl hover:shadow-[0_0_30px_rgba(99,102,241,0.55)] hover:-translate-y-0.5 transition-all duration-200 group"
            >
              <span>Build My Resume Now</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a 
              href="#demo" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900/90 text-slate-200 text-base font-medium px-7 py-4 rounded-xl border border-slate-700 hover:border-slate-500 hover:bg-slate-800 transition-all duration-200"
            >
              <Zap size={18} className="text-indigo-400" />
              <span>See Live ATS Demo</span>
            </a>
          </motion.div>

          {/* Quick Perks */}
          <motion.div variants={FADE_UP} className="flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs sm:text-sm text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={16} className="text-emerald-400" /> Free instant preview
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={16} className="text-emerald-400" /> No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={16} className="text-emerald-400" /> One-click PDF export
            </span>
          </motion.div>
        </motion.div>
      </section>

      {/* Social Proof Logo Carousel / Grid */}
      <section className="relative z-10 w-full px-6 py-10 border-y border-slate-800/60 bg-slate-950/40">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-6">
            Trusted by engineers & designers landing offers at industry leaders
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-75 grayscale hover:grayscale-0 transition-all duration-300">
            {['Google', 'Microsoft', 'Amazon', 'Meta', 'Stripe', 'Netflix', 'Uber', 'Airbnb'].map((company, i) => (
              <span key={i} className="text-base sm:text-xl font-bold tracking-tight text-slate-300 hover:text-white transition-colors">
                {company}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Metrics Banner */}
      <section className="relative z-10 w-full px-6 py-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            { metric: '98.4%', label: 'ATS Parser Pass Rate', desc: 'Accredited against standard recruiting filters' },
            { metric: '3.4x', label: 'More Callbacks', desc: 'Reported by active candidates within 14 days' },
            { metric: '120K+', label: 'Resumes Optimized', desc: 'Engineered for high-impact tech & business roles' },
            { metric: '< 15s', label: 'Instant AI Analysis', desc: 'Real-time feedback on keywords, grammar & tone' },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800 text-center hover:border-indigo-500/30 transition-all duration-300 group"
            >
              <div className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 mb-2 group-hover:scale-105 transition-transform">
                {stat.metric}
              </div>
              <div className="text-base font-semibold text-white mb-1">{stat.label}</div>
              <div className="text-xs text-slate-400 leading-relaxed">{stat.desc}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Interactive Hero Showcase Demo */}
      <section id="demo" className="relative z-10 w-full px-6 py-16 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3">
            <Sliders size={14} />
            <span>Interactive Live Simulation</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
            See how ResumeAI transforms your chances.
          </h2>
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">
            Select your target career path below to preview real-time ATS scoring, keyword matching, and bullet point enhancements.
          </p>

          {/* Role Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-8">
            {[
              { id: 'fullstack', label: 'Full Stack' },
              { id: 'frontend', label: 'Frontend' },
              { id: 'backend', label: 'Backend' },
              { id: 'datascience', label: 'Data Science' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedRole(tab.id)}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  selectedRole === tab.id
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-105'
                    : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Live Mockup Dashboard Window */}
        <div className="rounded-3xl bg-slate-950/90 border border-slate-800 shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden backdrop-blur-xl">
          {/* Window Chrome Header */}
          <div className="px-6 py-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
              <span className="ml-3 text-xs font-mono text-slate-400 hidden sm:inline">
                ats-optimizer --target="{currentRole.title}"
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
                <CheckCircle2 size={12} /> ATS Passed
              </span>
            </div>
          </div>

          {/* Interactive Showcase Grid */}
          <div className="p-6 sm:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Col: ATS Score & Metric Gauges */}
            <div className="lg:col-span-4 flex flex-col justify-between p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80">
              <div>
                <div className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-2">
                  Overall ATS Compatibility Score
                </div>
                <div className="flex items-baseline gap-3 mb-6">
                  <span className="text-6xl font-black text-white tracking-tight">{currentRole.score}</span>
                  <span className="text-xl text-slate-400 font-semibold">/ 100</span>
                  <span className="ml-auto text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                    High Match
                  </span>
                </div>

                {/* Metric Bars */}
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-medium text-slate-300 mb-1.5">
                      <span>Keyword Relevance</span>
                      <span className="text-indigo-400 font-bold">{currentRole.keywordMatch}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full" style={{ width: currentRole.keywordMatch }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-medium text-slate-300 mb-1.5">
                      <span>Experience Proof Density</span>
                      <span className="text-indigo-400 font-bold">{currentRole.experienceMatch}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-400 rounded-full" style={{ width: currentRole.experienceMatch }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-medium text-slate-300 mb-1.5">
                      <span>Layout & ATS Typography</span>
                      <span className="text-emerald-400 font-bold">100%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full w-full"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic Metric Boost Card */}
              <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp size={18} className="text-emerald-400" />
                  <span className="text-sm font-semibold text-slate-200">Expected Outcome:</span>
                </div>
                <span className="text-sm font-bold text-emerald-400">{currentRole.metricBoost}</span>
              </div>
            </div>

            {/* Right Col: Skills & Experience Rewriter */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              {/* Skills Analysis */}
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80">
                <div className="text-sm font-bold text-white mb-3 flex items-center justify-between">
                  <span>Detected Role Keywords ({currentRole.matchedSkills.length})</span>
                  <span className="text-xs font-semibold text-indigo-400">Synced to {currentRole.title}</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {currentRole.matchedSkills.map((skill, idx) => (
                    <span 
                      key={idx} 
                      className="px-2.5 py-1 text-xs font-medium rounded-lg bg-indigo-500/10 text-indigo-200 border border-indigo-500/20 flex items-center gap-1"
                    >
                      <CheckCircle size={12} className="text-emerald-400" />
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="text-xs font-semibold text-rose-400 mb-2 flex items-center gap-1">
                  <span>Critical Missing Skills Detected:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {currentRole.missingSkills.map((skill, idx) => (
                    <span 
                      key={idx} 
                      className="px-2.5 py-1 text-xs font-medium rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/20 flex items-center gap-1"
                    >
                      <XCircle size={12} className="text-rose-400" />
                      Add "{skill}" to boost score
                    </span>
                  ))}
                </div>
              </div>

              {/* AI Bullet Enhancer Before & After */}
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80">
                <div className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <Sparkles size={16} className="text-amber-400" />
                  <span>AI Real-Time Bullet Enhancement</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/30">
                    <div className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <XCircle size={14} /> Before (Weak / Generic)
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                      "{currentRole.sampleBefore}"
                    </p>
                    <div className="mt-3 text-[11px] text-rose-300/80">
                      ⚠️ No quantifiable impact • Low keyword density
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/40 relative">
                    <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <CheckCircle2 size={14} /> After (ResumeAI Optimized)
                    </div>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                      "{currentRole.sampleAfter}"
                    </p>
                    <div className="mt-3 text-[11px] text-emerald-300 font-semibold flex items-center gap-1">
                      ✨ Active action verbs + metrics + tech stack included
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Mockup Bottom Bar */}
          <div className="px-6 py-4 bg-slate-900/90 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-400">
              Ready to test your real resume? It takes less than 30 seconds.
            </div>
            <Link 
              to="/register" 
              className="text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition-colors inline-flex items-center gap-1.5"
            >
              <span>Scan My Resume Free</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Bento Grid Section */}
      <section id="features" className="relative z-10 w-full px-6 py-20 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3">
            <Layers size={14} />
            <span>Full-Stack Career Platform</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
            Everything you need to secure top offers.
          </h2>
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">
            A unified suite designed to eliminate recruiter friction, optimize technical presence, and accelerate your interview pipeline.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Resume Builder (2 cols) */}
          <div className="md:col-span-2 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-8 hover:border-indigo-500/40 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl group-hover:bg-indigo-600/15 transition-all pointer-events-none"></div>
            <div className="inline-flex p-3 rounded-xl bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 mb-6">
              <FileText size={24} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">AI Intelligent Resume Builder</h3>
            <p className="text-slate-300 leading-relaxed mb-6 max-w-lg">
              Generate job-tailored bullet points, summaries, and technical skills with contextual AI prompts that conform strictly to Harvard & ATS single-column standards.
            </p>
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 font-mono text-xs text-slate-300 flex items-center justify-between">
              <span className="text-indigo-400">⚡ prompt: "Rewrite experience with senior engineering metrics"</span>
              <span className="text-emerald-400 font-bold">Done in 1.2s</span>
            </div>
          </div>

          {/* Card 2: ATS Checker (1 col) */}
          <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-8 hover:border-indigo-500/40 transition-all duration-300 group">
            <div className="inline-flex p-3 rounded-xl bg-emerald-600/10 text-emerald-400 border border-emerald-500/20 mb-6">
              <CheckCircle size={24} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Deep ATS Checker</h3>
            <p className="text-slate-400 leading-relaxed text-sm mb-4">
              Real-time scoring breakdown analyzing keyword frequency, parseability, section headers, and semantic job description fit.
            </p>
            <div className="flex items-center gap-3">
              <div className="text-3xl font-black text-emerald-400">98%</div>
              <div className="text-xs text-slate-400">Automated screener pass confidence</div>
            </div>
          </div>

          {/* Card 3: Skill Gap Analysis (1 col) */}
          <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-8 hover:border-indigo-500/40 transition-all duration-300 group">
            <div className="inline-flex p-3 rounded-xl bg-cyan-600/10 text-cyan-400 border border-cyan-500/20 mb-6">
              <Search size={24} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Skill Gap Diagnosis</h3>
            <p className="text-slate-400 leading-relaxed text-sm mb-4">
              Compare your current resume directly against any job posting to uncover the missing frameworks and competencies recruiters seek.
            </p>
            <div className="inline-block px-3 py-1 bg-cyan-500/10 text-cyan-300 text-xs font-semibold rounded-lg border border-cyan-500/20">
              Role-specific keyword roadmap
            </div>
          </div>

          {/* Card 4: Portfolio Generator (2 cols) */}
          <div className="md:col-span-2 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-8 hover:border-indigo-500/40 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl group-hover:bg-purple-600/15 transition-all pointer-events-none"></div>
            <div className="inline-flex p-3 rounded-xl bg-purple-600/10 text-purple-400 border border-purple-500/20 mb-6">
              <Monitor size={24} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Instant Web Portfolio Generator</h3>
            <p className="text-slate-300 leading-relaxed mb-6 max-w-lg">
              No need to build a personal site from scratch. Your resume data instantly generates a sleek, responsive portfolio webpage with live project links and a custom domain address.
            </p>
            <div className="flex flex-wrap gap-2 text-xs font-medium">
              <span className="px-3 py-1.5 rounded-lg bg-purple-500/10 text-purple-300 border border-purple-500/20">
                🚀 Hosted live on yourname.resumeai.dev
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300">
                📱 100% Mobile & Tablet responsive
              </span>
            </div>
          </div>

          {/* Card 5: Templates (1 col) */}
          <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-8 hover:border-indigo-500/40 transition-all duration-300 group">
            <div className="inline-flex p-3 rounded-xl bg-amber-600/10 text-amber-400 border border-amber-500/20 mb-6">
              <LayoutTemplate size={24} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Recruiter-Approved Templates</h3>
            <p className="text-slate-400 leading-relaxed text-sm">
              Tested formats that human recruiters love to read and automated scrapers never stumble over.
            </p>
          </div>

          {/* Card 6: Career Guidance (2 cols) */}
          <div className="md:col-span-2 rounded-3xl bg-slate-900/80 border border-slate-800 p-8 hover:border-indigo-500/40 transition-all duration-300 group">
            <div className="inline-flex p-3 rounded-xl bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 mb-6">
              <Compass size={24} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Personalized Career Roadmap</h3>
            <p className="text-slate-300 leading-relaxed mb-4">
              Get intelligent suggestions on which roles you naturally qualify for based on your current background, plus actionable learning resources to move up to senior or lead tiers.
            </p>
          </div>

        </div>
      </section>

      {/* How It Works (3 Steps) */}
      <section id="how-it-works" className="relative z-10 w-full px-6 py-20 max-w-7xl mx-auto border-t border-slate-800/60">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3">
            <span>Seamless 3-Step Process</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
            How ResumeAI secures you interviews.
          </h2>
          <p className="text-base sm:text-lg text-slate-400 max-w-xl mx-auto">
            From empty page to a hired professional in three guided steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {[
            {
              step: '01',
              title: 'Upload or Enter Details',
              desc: 'Import your existing resume or fill in our intuitive form with work history, projects, and target role.'
            },
            {
              step: '02',
              title: 'AI Scan & Gap Analysis',
              desc: 'Our engine parses your resume, identifies missing high-value keywords, and elevates your bullet points with measurable impact.'
            },
            {
              step: '03',
              title: 'Export & Get Hired',
              desc: 'Download your 100% ATS-tested PDF and launch your personal portfolio website to share directly with recruiters.'
            }
          ].map((item, idx) => (
            <div key={idx} className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 relative group hover:border-indigo-500/40 transition-all">
              <span className="text-5xl font-black text-indigo-500/20 group-hover:text-indigo-500/40 transition-colors mb-4 block">
                {item.step}
              </span>
              <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="relative z-10 w-full px-6 py-20 max-w-7xl mx-auto border-t border-slate-800/60">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3">
            <Star size={14} className="fill-emerald-400 text-emerald-400" />
            <span>Success Stories</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
            Hear from candidates who got hired.
          </h2>
          <p className="text-base sm:text-lg text-slate-400 max-w-xl mx-auto">
            Real developers and engineers who transformed their job hunt using ResumeAI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'Alex Rivera',
              role: 'Senior Full Stack Engineer',
              company: 'Hired at Series B Fintech',
              text: 'I sent 40+ resumes with zero callbacks. After running ResumeAI, my ATS score went from 62 to 94. Within two weeks, I had 5 recruiter screens and signed an offer.',
              stars: 5
            },
            {
              name: 'Priya Sharma',
              role: 'Frontend Developer',
              company: 'Hired at Enterprise SaaS',
              text: 'The AI bullet rewriter is magic. It converted my vague bullet points into crisp, metric-focused statements with the exact keywords the job posting was looking for.',
              stars: 5
            },
            {
              name: 'Marcus Chen',
              role: 'DevOps & Cloud Engineer',
              company: 'Hired at Cloud Platform',
              text: 'The portfolio generator alone is worth it. Having my projects and skills formatted cleanly online made an immediate impression during my technical interviews.',
              stars: 5
            }
          ].map((t, idx) => (
            <div key={idx} className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors">
              <div>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(t.stars)].map((_, s) => (
                    <Star key={s} size={16} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-300 leading-relaxed mb-6">"{t.text}"</p>
              </div>
              <div className="pt-4 border-t border-slate-800/80">
                <div className="font-bold text-white text-sm">{t.name}</div>
                <div className="text-xs text-indigo-400">{t.role}</div>
                <div className="text-[11px] text-emerald-400 mt-1 font-semibold">{t.company}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive FAQ Accordion */}
      <section id="faq" className="relative z-10 w-full px-6 py-20 max-w-4xl mx-auto border-t border-slate-800/60">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            Have questions about ATS systems or our resume builder? We have answers.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div 
                key={idx} 
                className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-semibold text-white hover:text-indigo-300 transition-colors cursor-pointer"
                >
                  <span className="text-base sm:text-lg">{faq.q}</span>
                  <ChevronDown 
                    size={20} 
                    className={`text-slate-400 transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180 text-indigo-400' : ''}`}
                  />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="px-5 pb-6 sm:px-6 text-sm sm:text-base text-slate-300 leading-relaxed border-t border-slate-800/40 pt-4"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* Final High-Converting Bottom CTA Banner */}
      <section className="relative z-10 w-full px-6 py-24 max-w-7xl mx-auto">
        <div className="relative rounded-3xl bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-slate-950 border border-indigo-500/30 p-10 sm:p-16 text-center overflow-hidden shadow-[0_20px_60px_rgba(99,102,241,0.25)]">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-600/20 blur-[100px] pointer-events-none rounded-full"></div>
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-6">
              Ready to start receiving recruiter callbacks?
            </h2>
            <p className="text-base sm:text-lg text-slate-200 mb-8 leading-relaxed font-light">
              Build your ATS-optimized resume and personalized portfolio today. Join thousands of candidates landing their dream jobs.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                to="/register" 
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-white text-slate-950 font-bold text-base px-9 py-4 rounded-xl hover:bg-slate-200 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/10"
              >
                <span>Create Free Account</span>
                <ArrowRight size={18} />
              </Link>
              <Link 
                to="/login" 
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900/90 text-slate-200 font-semibold text-base px-8 py-4 rounded-xl border border-slate-700 hover:bg-slate-800 transition-colors"
              >
                <span>Existing Member Sign In</span>
              </Link>
            </div>
            <div className="mt-6 text-xs text-slate-400">
              No credit card required • Instant setup • 100% Free to build
            </div>
          </div>
        </div>
      </section>

      {/* Multi-Column Modern Footer */}
      <footer className="w-full border-t border-slate-800/60 bg-slate-950/80 py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          
          {/* Brand Col */}
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white">
                <Sparkles size={16} />
              </div>
              <span className="text-lg font-bold text-white">ResumeAI</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-sm mb-4 leading-relaxed">
              The modern career intelligence platform. Optimize your resume for automated ATS filters and create beautiful hosted portfolios in seconds.
            </p>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              All systems operational
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-xs uppercase font-bold text-slate-300 tracking-wider mb-4">Product</h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400 font-medium">
              <li><Link to="/register" className="hover:text-white transition-colors">Resume Builder</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">ATS Checker</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Portfolio Generator</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Skill Gap Analysis</Link></li>
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h4 className="text-xs uppercase font-bold text-slate-300 tracking-wider mb-4">Features</h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400 font-medium">
              <li><a href="#demo" className="hover:text-white transition-colors">Interactive Demo</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">ATS Templates</a></li>
              <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">ATS FAQ</a></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-xs uppercase font-bold text-slate-300 tracking-wider mb-4">Account</h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400 font-medium">
              <li><Link to="/login" className="hover:text-white transition-colors">Sign In</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Create Account</Link></li>
              <li><Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
            </ul>
          </div>

        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>&copy; {new Date().getFullYear()} ResumeAI. Crafted for ambitious engineers & tech professionals.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Security</a>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Landing;
