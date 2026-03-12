import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  const features = [
    { icon: '📝', title: 'AI Resume Builder', desc: 'Build professional resumes with AI-powered content suggestions and optimization.' },
    { icon: '🎯', title: 'ATS Score Checker', desc: 'Get your resume scored for ATS compatibility with detailed improvement tips.' },
    { icon: '🔍', title: 'Skill Gap Analysis', desc: 'Discover missing skills for your target role and get learning recommendations.' },
    { icon: '💼', title: 'Career Recommendations', desc: 'AI-powered career path suggestions based on your skills and experience.' },
    { icon: '🎨', title: 'Resume Templates', desc: 'Choose from Modern, Minimal, Professional, and Creative templates.' },
    { icon: '🌐', title: 'Portfolio Generator', desc: 'Auto-generate a stunning portfolio website from your resume data.' },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)' }}>
      {/* Ambient glow effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/8 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[300px] bg-cyan-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Navbar */}
      <nav className="relative z-10 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/>
              </svg>
            </div>
            <span className="text-xl font-bold text-white">ResumeAI</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-slate-300 hover:text-white font-medium transition-colors px-4 py-2">Sign In</Link>
            <Link to="/register" className="btn-primary text-sm">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32 text-center">
        <div className="slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-8">
            <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></span>
            AI-Powered Resume Building
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Build Your Perfect<br/>
            <span className="gradient-text">Resume & Portfolio</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Leverage artificial intelligence to create ATS-optimized resumes, analyze skill gaps, and generate stunning portfolio websites — all in one platform.
          </p>
          <div className="flex items-center gap-4 justify-center">
            <Link to="/register" className="btn-primary text-lg px-8 py-4">
              Start Building Free
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <Link to="/login" className="btn-secondary text-lg px-8 py-4">Sign In</Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto mt-20">
          {[['4+', 'Templates'], ['100', 'ATS Score'], ['AI', 'Powered']].map(([num, label]) => (
            <div key={label} className="text-center">
              <div className="text-3xl font-bold gradient-text">{num}</div>
              <div className="text-sm text-slate-500 mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-32">
        <h2 className="text-3xl font-bold text-white text-center mb-4">Everything You Need</h2>
        <p className="text-slate-400 text-center mb-16 max-w-xl mx-auto">Powerful AI tools to supercharge your career journey from resume to job offer.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={i} className="glass-card p-6" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-slate-500 text-sm">
          &copy; 2026 ResumeAI. Built with AI-powered intelligence.
        </div>
      </footer>
    </div>
  );
};

export default Landing;
