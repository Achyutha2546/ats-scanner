import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText, CheckCircle, Search, Compass, LayoutTemplate, Monitor, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const Landing = () => {
  const features = [
    { icon: <FileText size={24} />, title: 'AI Resume Builder', desc: 'Craft professional resumes with intelligent content suggestions and dynamic ATS optimization.', gridClass: 'md:col-span-2' },
    { icon: <CheckCircle size={24} />, title: 'ATS Score Checker', desc: 'Ensure your resume passes automated filters.', gridClass: 'md:col-span-1' },
    { icon: <Search size={24} />, title: 'Skill Gap Analysis', desc: 'Identify missing skills for your target role.', gridClass: 'md:col-span-1' },
    { icon: <Compass size={24} />, title: 'Career Guidance', desc: 'Receive tailored career path suggestions based on your unique experience and skills.', gridClass: 'md:col-span-2' },
    { icon: <LayoutTemplate size={24} />, title: 'Premium Templates', desc: 'Select from meticulously crafted templates designed for maximum readability and impact.', gridClass: 'md:col-span-2' },
    { icon: <Monitor size={24} />, title: 'Portfolio Generator', desc: 'Auto-generate a responsive portfolio website.', gridClass: 'md:col-span-1' },
  ];

  const FADE_UP = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80, damping: 20 } }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 font-sans selection:bg-indigo-500/30 overflow-x-hidden relative">
      
      {/* Background Effects */}
      <div className="absolute top-0 inset-x-0 h-screen overflow-hidden pointer-events-none flex justify-center">
        <div className="w-[800px] h-[600px] bg-indigo-600/15 blur-[120px] rounded-full translate-y-[-20%]"></div>
      </div>

      {/* Navbar */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-20 w-full px-8 py-6 flex items-center justify-between max-w-[95%] xl:max-w-screen-2xl mx-auto"
      >
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-9 h-9 bg-indigo-500 text-white flex items-center justify-center rounded-xl font-bold shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Sparkles size={18} strokeWidth={2.5} />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">ResumeAI</span>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/login" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Log in</Link>
          <Link to="/register" className="text-sm font-medium bg-white text-slate-950 px-5 py-2.5 rounded-full hover:bg-slate-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            Start building
          </Link>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative z-10 w-full px-8 min-h-[75vh] flex flex-col justify-center items-center text-center max-w-[90%] xl:max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.15 } }
          }}
          className="flex flex-col items-center justify-center w-full"
        >
          <motion.div variants={FADE_UP} className="inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-8">
            <Sparkles size={14} />
            <span className="tracking-wide">AI-Powered Career Engine v2.0</span>
          </motion.div>
          
          <motion.h1 variants={FADE_UP} className="text-5xl md:text-7xl lg:text-8xl font-semibold text-white mb-8 tracking-tighter leading-[1.05] max-w-5xl mx-auto text-center">
            Land your dream job with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">precision.</span>
          </motion.h1>
          
          <motion.p variants={FADE_UP} className="text-lg md:text-xl lg:text-2xl text-slate-400 max-w-4xl mx-auto mb-10 leading-relaxed font-light text-center">
            Automate your job search. Craft ATS-optimized resumes, discover critical skill gaps, and generate stunning portfolios instantly.
          </motion.p>
          
          <motion.div variants={FADE_UP} className="flex flex-col sm:flex-row items-center gap-4 justify-center w-full">
            <Link to="/register" className="group flex items-center justify-center gap-2 bg-indigo-600 text-white text-base font-medium px-8 py-3.5 rounded-full hover:bg-indigo-500 transition-all w-full sm:w-auto shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5">
              Build your resume
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/login" className="flex items-center justify-center gap-2 bg-slate-800 text-white text-base font-medium px-8 py-3.5 rounded-full hover:bg-slate-700 border border-slate-700 transition-colors w-full sm:w-auto">
              View Demo
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Bento Grid Features Section */}
      <section className="relative z-10 w-full px-8 py-20 max-w-[95%] xl:max-w-screen-2xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center flex flex-col items-center justify-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-white mb-6 text-center">
            A complete career toolkit.
          </h2>
          <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto font-light text-center">
            Everything you need to stand out to recruiters, bypass ATS filters, and secure interviews faster than ever before.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((f, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`group relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 p-8 hover:bg-slate-800/80 transition-colors flex flex-col items-start text-left ${f.gridClass}`}
            >
              {/* Subtle hover gradient inside card */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-transparent to-purple-500/0 group-hover:from-indigo-500/5 group-hover:to-purple-500/5 transition-colors" />
              
              <div className="relative z-10 w-full">
                <div className="inline-flex p-3 bg-slate-800 rounded-xl text-indigo-400 mb-6 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all duration-300">
                  {f.icon}
                </div>
                <h3 className="text-2xl font-semibold text-white mb-3 tracking-tight">{f.title}</h3>
                <p className="text-slate-400 leading-relaxed font-light text-base md:text-lg">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Footer */}
      <section className="relative z-10 w-full px-6 py-24 mt-12 border-t border-slate-800/50 bg-slate-900/30 flex flex-col items-center justify-center text-center">
        <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-white mb-8 text-center">
          Ready to get hired?
        </h2>
        <Link to="/register" className="inline-flex items-center justify-center gap-2 bg-white text-slate-950 text-lg font-medium px-10 py-4 rounded-full hover:bg-slate-200 transition-colors hover:scale-105 transform duration-300 shadow-xl shadow-white/10">
          Create your profile today
          <ArrowRight size={20} />
        </Link>
      </section>
      
      {/* Minimal Footer */}
      <footer className="w-full px-6 py-8 flex items-center justify-center text-center text-slate-600 text-sm font-light border-t border-slate-800/50 bg-[#030712]">
        <p>&copy; 2026 ResumeAI. Crafted with precision for the modern professional.</p>
      </footer>
    </div>
  );
};

export default Landing;
