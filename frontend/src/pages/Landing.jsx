import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText, CheckCircle, Search, Compass, LayoutTemplate, Monitor } from 'lucide-react';

const Landing = () => {
  const features = [
    { icon: <FileText size={24} className="text-white" />, title: 'AI Resume Builder', desc: 'Build professional resumes with intelligent content suggestions and dynamic optimization.' },
    { icon: <CheckCircle size={24} className="text-white" />, title: 'ATS Score Checker', desc: 'Ensure your resume passes automated filters with detailed compatibility analysis.' },
    { icon: <Search size={24} className="text-white" />, title: 'Skill Gap Analysis', desc: 'Identify missing skills for your target role and get actionable learning recommendations.' },
    { icon: <Compass size={24} className="text-white" />, title: 'Career Guidance', desc: 'Receive tailored career path suggestions based on your unique experience and skills.' },
    { icon: <LayoutTemplate size={24} className="text-white" />, title: 'Premium Templates', desc: 'Select from meticulously crafted templates designed for maximum readability and impact.' },
    { icon: <Monitor size={24} className="text-white" />, title: 'Portfolio Generator', desc: 'Automatically generate a responsive, beautiful portfolio website from your resume data.' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-white/20">
      
      {/* Navbar */}
      <nav className="w-full px-6 py-6 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white text-slate-950 flex items-center justify-center rounded-lg font-bold">
            <FileText size={18} strokeWidth={2.5} />
          </div>
          <span className="text-xl font-semibold tracking-tight text-white">ResumeAI</span>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/login" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Log in</Link>
          <Link to="/register" className="text-sm font-medium bg-white text-slate-950 px-5 py-2.5 rounded-full hover:bg-slate-200 transition-colors">Start building</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="w-full px-6 pt-32 pb-24 text-center max-w-4xl mx-auto">
        <div className="slide-up">
          <h1 className="text-6xl md:text-8xl font-medium text-white mb-8 tracking-tighter leading-[1.1]">
            The definitive resume platform.
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed font-light">
            Craft ATS-optimized resumes, discover critical skill gaps, and generate stunning portfolios with our advanced AI engine.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
            <Link to="/register" className="inline-flex items-center gap-2 bg-white text-slate-950 text-lg font-medium px-8 py-4 rounded-full hover:bg-slate-200 transition-colors">
              Start building for free
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="w-full max-w-7xl mx-auto px-6">
        <div className="h-px w-full bg-white/10"></div>
      </div>

      {/* Features Grid */}
      <section className="w-full px-6 py-32 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-white max-w-xl">
            Everything you need to advance your career.
          </h2>
          <p className="text-lg text-slate-400 max-w-md font-light leading-relaxed">
            A cohesive suite of tools designed to remove friction from the job application process and elevate your professional presence.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {features.map((f, i) => (
            <div key={i} className="group slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="inline-block p-3 bg-white/5 rounded-2xl border border-white/10 mb-6 group-hover:bg-white/10 transition-colors">
                {f.icon}
              </div>
              <h3 className="text-xl font-medium text-white mb-3 tracking-tight">{f.title}</h3>
              <p className="text-slate-400 leading-relaxed font-light">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="w-full px-6 py-12 text-center text-slate-600 text-sm font-light">
        &copy; 2026 ResumeAI. Crafted with precision.
      </footer>
    </div>
  );
};

export default Landing;
