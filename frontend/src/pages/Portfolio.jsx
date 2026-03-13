import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { getResumeData } from '../api';

const Portfolio = () => {
  const { user } = useAuth();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);

  const portfolioRef = useRef();

  useEffect(() => {
    getResumeData().then(({ data }) => setResume(data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleDownload = () => {
    const el = portfolioRef.current;
    if (!el) return;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html><head><title>${user?.name || 'User'} Portfolio</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', 'Segoe UI', sans-serif; color: #f8fafc; background: #0f172a; }
        .portfolio-print { padding: 40px; }
        nav { display: none !important; }
        h1 { font-size: 40px; font-weight: 800; margin-bottom: 20px; color: #fff; }
        h2 { font-size: 20px; font-weight: 800; margin: 40px 0 20px; color: #6366f1; border-left: 4px solid #6366f1; padding-left: 15px; text-transform: uppercase; }
        h3 { font-size: 18px; font-weight: 700; margin-bottom: 5px; color: #fff; }
        p { font-size: 14px; line-height: 1.6; color: #94a3b8; }
        .glass-card { margin-top: 15px; border: 1px solid rgba(255,255,255,0.05); padding: 20px; border-radius: 15px; background: rgba(255,255,255,0.02); }
        .row { display: flex; gap: 40px; margin-top: 30px; }
        .col { flex: 1; }
        .chip { display: inline-block; padding: 5px 12px; margin: 5px; background: rgba(99, 102, 241, 0.1); border: 1px solid rgba(99, 102, 241, 0.2); border-radius: 8px; color: #818cf8; font-size: 12px; }
      </style></head><body>
      <div class="portfolio-print">
      ${el.innerHTML}
      </div>
      </body></html>
    `);
    printWindow.document.close();
    setTimeout(() => { printWindow.print(); }, 1000);
  };

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const profile = resume?.profile || {};
  const education = resume?.education || [];
  const experience = resume?.experience || [];
  const projects = resume?.projects || [];

  return (
    <div className="min-h-screen flex" style={{ background: '#0f172a' }}>
      <Sidebar />
      <main style={{ marginLeft: '260px', padding: '2.5rem 3rem', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
          <div>
            <h1 className="text-3xl font-bold text-white" style={{ marginBottom: '0.5rem' }}>Portfolio Preview</h1>
            <p className="text-slate-400">Your auto-generated portfolio website</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <span className="px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-xl" style={{ fontWeight: 500 }}>
                /portfolio/{user?.name?.toLowerCase().replace(/\s+/g, '-') || 'username'}
              </span>
            </div>
            <button onClick={handleDownload} className="btn-secondary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '0.5rem' }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Download PDF
            </button>
          </div>
        </div>

        {/* Portfolio Preview Browser Interface */}
        <div className="glass-card overflow-hidden border-0 shadow-2xl" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 200px)' }}>
          
          {/* Simulated Browser Top Bar */}
          <div style={{ background: '#1e293b', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f56' }}></div>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ffbd2e' }}></div>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#27c93f' }}></div>
            </div>
            <div style={{ flex: 1, background: '#0f172a', borderRadius: '6px', padding: '0.25rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid rgba(255,255,255,0.1)' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <span style={{ fontSize: '0.7rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                https://ats-portfolio.com/portfolio/{user?.name?.toLowerCase().replace(/\s+/g, '-') || 'user'}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <div style={{ width: '14px', height: '1px', background: '#64748b' }}></div>
              <div style={{ width: '10px', height: '10px', border: '1px solid #64748b' }}></div>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', background: '#0f172a' }}>
            {/* Live Portfolio Navigation */}
            <nav style={{ padding: '1.25rem 4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,0.03)', position: 'sticky', top: 0, zIndex: 10 }}>
              <span style={{ fontWeight: 900, fontSize: '1.2rem', color: '#6366f1', letterSpacing: '2px' }}>{user?.name?.split(' ')[0].toUpperCase()}</span>
              <div style={{ display: 'flex', gap: '2.5rem', fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8' }}>
                <button onClick={() => scrollTo('hero')} className="hover:text-indigo-400 transition-colors uppercase tracking-widest">ABOUT</button>
                <button onClick={() => scrollTo('projects')} className="hover:text-indigo-400 transition-colors uppercase tracking-widest">PROJECTS</button>
                <button onClick={() => scrollTo('experience')} className="hover:text-indigo-400 transition-colors uppercase tracking-widest">EXPERIENCE</button>
                <button onClick={() => scrollTo('contact')} className="hover:text-indigo-400 transition-colors uppercase tracking-widest">CONTACT</button>
              </div>
            </nav>

            <div ref={portfolioRef}>
            {/* Hero Section */}
            <div id="hero" style={{ 
              padding: '6rem 3rem', 
              background: 'radial-gradient(circle at top right, rgba(99, 102, 241, 0.15), transparent 400px), radial-gradient(circle at bottom left, rgba(6, 182, 212, 0.15), transparent 400px)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', gap: '4rem', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <div className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-lg text-xs font-bold tracking-widest uppercase inline-block mb-4">Available for New Projects</div>
                  <h1 style={{ fontSize: '3.5rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem', background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    {user?.name || 'Your Name'}
                  </h1>
                  <p style={{ fontSize: '1.125rem', color: '#94a3b8', lineHeight: 1.7, marginBottom: '2rem' }}>
                    {profile.summary || 'Aspiring professional looking to build impactful digital experiences. Add your summary in the Resume Builder.'}
                  </p>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <button className="btn-primary" style={{ padding: '0.75rem 2rem' }}>Get Portfolio</button>
                    {(profile.linkedin || profile.github) && (
                      <div style={{ display: 'flex', gap: '1rem', marginLeft: '1rem' }}>
                        {profile.github && <a href={profile.github} className="text-slate-400 hover:text-white transition-colors">GitHub</a>}
                        {profile.linkedin && <a href={profile.linkedin} className="text-slate-400 hover:text-white transition-colors">LinkedIn</a>}
                      </div>
                    )}
                  </div>
                </div>
                <div style={{ width: '320px', height: '320px', position: 'relative', display: 'none', md: 'block' }}>
                   <div style={{ position: 'absolute', inset: 0, borderRadius: '2rem', background: 'linear-gradient(45deg, #6366f1, #06b6d4)', transform: 'rotate(6deg)', opacity: 0.3 }}></div>
                   <div className="glass-card" style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '6rem', fontWeight: 800, color: 'white', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                     {user?.name?.charAt(0) || 'U'}
                   </div>
                </div>
              </div>
            </div>

            {/* Content Layout: 2 Column */}
            <div style={{ padding: '4rem 3rem', maxWidth: '1200px', margin: '0 auto' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>
                
                {/* Left Column: Skills & Experience */}
                <div>
                  {/* Skills Section */}
                  {profile.skills?.length > 0 && (
                    <section style={{ marginBottom: '4rem' }}>
                      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ width: '30px', height: '2px', background: '#6366f1' }}></span> Core Expertise
                      </h2>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                        {profile.skills.map((s, i) => (
                          <div key={i} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-medium hover:scale-105 transition-transform" style={{ color: '#e2e8f0' }}>{s}</div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Experience Section */}
                  {experience.length > 0 && (
                    <section id="experience" style={{ marginBottom: '4rem' }}>
                      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ width: '30px', height: '2px', background: '#6366f1' }}></span> Professional Path
                      </h2>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {experience.map((exp, i) => (
                          <div key={i} style={{ borderLeft: '2px solid rgba(99, 102, 241, 0.3)', paddingLeft: '1.5rem', position: 'relative' }}>
                            <div style={{ position: 'absolute', width: '12px', height: '12px', background: '#6366f1', borderRadius: '50%', left: '-7px', top: '5px', boxShadow: '0 0 10px rgba(99, 102, 241, 0.5)' }}></div>
                            <h3 style={{ fontWeight: 700, fontSize: '1.1rem' }}>{exp.role}</h3>
                            <div style={{ color: '#6366f1', fontSize: '0.85rem', fontWeight: 600, marginTop: '0.25rem' }}>{exp.company} • {exp.duration}</div>
                            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.75rem', lineHeight: 1.6 }}>{exp.description}</p>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                </div>

                {/* Right Column: Projects & Education */}
                <div>
                   {/* Projects Section */}
                   {projects.length > 0 && (
                    <section id="projects" style={{ marginBottom: '4rem' }}>
                      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ width: '30px', height: '2px', background: '#6366f1' }}></span> Featured Projects
                      </h2>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
                        {projects.map((proj, i) => (
                          <div key={i} className="glass-card hover:border-indigo-500/50 transition-all p-6 group cursor-default">
                             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                               <h3 className="text-white font-bold text-lg group-hover:text-indigo-400 transition-colors">{proj.title}</h3>
                               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-600 group-hover:text-indigo-400 transition-colors"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                             </div>
                             <p className="text-slate-400 text-sm mb-4 leading-relaxed">{proj.description}</p>
                             <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {(proj.technologies || []).map((t, j) => (
                                  <span key={j} className="text-[0.7rem] px-2 py-1 bg-indigo-500/5 border border-indigo-500/10 text-indigo-300 rounded uppercase font-bold tracking-tight">{t}</span>
                                ))}
                             </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Certifications & Education Section */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '3rem' }}>
                      {resume?.certifications?.length > 0 && (
                        <section>
                          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <span style={{ width: '30px', height: '2px', background: '#6366f1' }}></span> Verified Certificates
                          </h2>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {resume.certifications.map((cert, i) => (
                              <div key={i} className="bg-white/5 border border-white/5 rounded-xl p-4 flex items-center gap-4">
                                <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">📜</div>
                                <div>
                                  <div className="text-white text-sm font-bold">{cert.title}</div>
                                  <div className="text-slate-500 text-xs">{cert.organization} ({cert.year})</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </section>
                      )}

                      {education.length > 0 && (
                        <section>
                          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <span style={{ width: '30px', height: '2px', background: '#6366f1' }}></span> Education
                          </h2>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {education.map((edu, i) => (
                              <div key={i}>
                                <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>{edu.degree}</div>
                                <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.2rem' }}>{edu.institution} • {edu.year}</div>
                              </div>
                            ))}
                          </div>
                        </section>
                      )}
                  </div>
                </div>

              </div>

            </div>

            {/* Footer Footer */}
            <footer id="contact" style={{ padding: '5rem 3rem', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>Let's Work Together</h2>
                <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>Interested in hiring me? Shoot me an email or find me on socials!</p>
                <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#6366f1', marginBottom: '2.5rem' }}>{user?.email}</div>
                <div style={{ fontSize: '0.75rem', color: '#475569' }}>© 2026 {user?.name}. Auto-generated by ATS & Portfolio.</div>
            </footer>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Portfolio;
