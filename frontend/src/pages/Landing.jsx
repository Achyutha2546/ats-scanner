import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText, CheckCircle, Search, Monitor, LayoutTemplate, Compass, X } from 'lucide-react';

const Landing = () => {
  const [showInstallBanner, setShowInstallBanner] = useState(true);

  const features = [
    {
      icon: <FileText size={22} className="text-purple-400" />,
      title: 'AI Resume Builder',
      desc: 'Build recruiter-ready resumes formatted for Workday, Taleo, and Greenhouse ATS parsing.'
    },
    {
      icon: <CheckCircle size={22} className="text-emerald-400" />,
      title: 'ATS Score Checker',
      desc: 'Analyze your resume keyword density, formatting accuracy, and role compatibility instantly.'
    },
    {
      icon: <Search size={22} className="text-cyan-400" />,
      title: 'Skill Gap Analysis',
      desc: 'Compare your resume with target job postings to discover missing technical competencies.'
    },
    {
      icon: <Monitor size={22} className="text-indigo-400" />,
      title: 'Developer Portfolio',
      desc: 'Auto-generate a hosted personal portfolio website with live project links in one click.'
    },
    {
      icon: <LayoutTemplate size={22} className="text-amber-400" />,
      title: 'Executive Templates',
      desc: 'Tested single-column layouts designed for maximum readability by bots and hiring managers.'
    },
    {
      icon: <Compass size={22} className="text-rose-400" />,
      title: 'Career Guidance',
      desc: 'Tailored recommendations to help you bridge skill gaps and level up to senior roles.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 font-sans selection:bg-purple-500/30 selection:text-white relative overflow-x-hidden w-full">
      
      {/* Subtle Background Radial Lighting */}
      <div className="absolute top-0 inset-x-0 h-[600px] overflow-hidden pointer-events-none flex justify-center z-0">
        <div className="w-full h-[350px] bg-purple-600/10 blur-[140px] rounded-full"></div>
      </div>

      {/* Navbar */}
      <header className="relative z-20 w-full px-8 py-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-purple-600/30">
            R
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">
            Resume<span className="text-purple-400">AI</span>
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/login" className="text-base font-medium text-slate-300 hover:text-white transition-colors">
            Sign In
          </Link>
          <Link to="/register" className="btn-purple text-base px-7 py-3">
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 w-full">
        <section className="pt-24 pb-28 px-8 w-full text-center flex flex-col items-center justify-center min-h-[75vh]">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#131b2e] border border-slate-800 text-sm font-medium text-slate-300 mb-8">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Next-Gen Career Intelligence</span>
          </div>

          {/* Main Title */}
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight text-white leading-[1.1] mb-8 w-full max-w-6xl">
            Land your dream job with{' '}
            <span className="gradient-text-purple inline">
              effortless precision.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl lg:text-2xl text-slate-400 w-full max-w-4xl mx-auto leading-relaxed mb-12 font-normal">
            Craft ATS-optimized resumes, discover critical skill gaps, analyze recruiter trends, and achieve your career goals with an intuitive modern dashboard.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full max-w-lg">
            <Link to="/register" className="btn-purple text-lg px-9 py-4 w-full sm:w-auto justify-center">
              <span>Start Free Trial</span>
              <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn-dark-pill text-lg px-9 py-4 w-full sm:w-auto justify-center">
              <span>Explore Demo</span>
            </Link>
          </div>

        </section>

        {/* Features Section */}
        <section id="features" className="py-24 px-8 w-full border-t border-slate-800/80">
          <div className="text-center mb-20 w-full">
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
              Everything you need for smart career growth.
            </h2>
            <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">
              A cohesive suite of tools designed to remove friction from your job applications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-[95%] mx-auto">
            {features.map((f, i) => (
              <div 
                key={i} 
                className="p-8 rounded-2xl bg-[#121827]/80 border border-slate-800/80 hover:border-purple-500/30 transition-all duration-200"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-800/80 flex items-center justify-center mb-5">
                  {f.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{f.title}</h3>
                <p className="text-sm sm:text-base text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Floating Bottom Right Install Banner */}
      {showInstallBanner && (
        <div className="fixed bottom-6 right-6 z-50 p-5 rounded-2xl bg-[#131b2e] border border-slate-800 shadow-2xl max-w-md flex items-center justify-between gap-5 backdrop-blur-md">
          <div>
            <div className="text-sm font-bold text-white mb-1">Install ResumeAI App</div>
            <div className="text-xs text-slate-400">Add to home screen for near-native experience & offline access.</div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/register" className="btn-purple text-xs px-4 py-2 shrink-0">
              Install
            </Link>
            <button 
              onClick={() => setShowInstallBanner(false)} 
              className="text-slate-400 hover:text-white p-1 transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Minimal Footer */}
      <footer className="w-full border-t border-slate-800/80 py-10 px-8 text-center text-sm text-slate-500">
        &copy; {new Date().getFullYear()} ResumeAI. All rights reserved.
      </footer>

    </div>
  );
};

export default Landing;
