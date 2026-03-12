import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { getResumeData } from '../api';

const Portfolio = () => {
  const { user } = useAuth();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getResumeData().then(({ data }) => setResume(data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

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
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <span className="px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-xl" style={{ fontWeight: 500 }}>
              /portfolio/{user?.name?.toLowerCase().replace(/\s+/g, '-') || 'username'}
            </span>
          </div>
        </div>

        {/* Portfolio Preview */}
        <div className="glass-card overflow-hidden">
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 min-h-[600px]" style={{ padding: '0' }}>
            {/* Hero */}
            <div className="text-center" style={{ padding: '5rem 2rem' }}>
              <div className="w-24 h-24 gradient-bg rounded-full flex items-center justify-center text-4xl text-white font-bold mx-auto" style={{ marginBottom: '1.5rem' }}>
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <h1 className="text-4xl font-bold text-white text-3xl md:text-4xl" style={{ marginBottom: '0.75rem' }}>{user?.name || 'Your Name'}</h1>
              <p className="text-lg text-slate-400 max-w-xl mx-auto leading-relaxed">{profile.summary || 'Add a professional summary in the Resume Builder to see it here.'}</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', marginTop: '1.5rem' }}>
                {profile.linkedin && <a href={profile.linkedin} className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors">LinkedIn</a>}
                {profile.github && <a href={profile.github} className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors">GitHub</a>}
                {profile.portfolioLink && <a href={profile.portfolioLink} className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors">Website</a>}
              </div>
            </div>

            {/* Skills */}
            {profile.skills?.length > 0 && (
              <div style={{ padding: '0 3rem 4rem 3rem' }}>
                <h2 className="text-xl font-bold text-white text-center" style={{ marginBottom: '1.5rem' }}>⚡ Skills</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.5rem' }}>
                  {profile.skills.map((s, i) => (
                    <span key={i} className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-xl text-sm font-medium">{s}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {projects.length > 0 && (
              <div style={{ padding: '0 3rem 4rem 3rem' }}>
                <h2 className="text-xl font-bold text-white text-center" style={{ marginBottom: '2rem' }}>🚀 Projects</h2>
                <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '1.25rem' }}>
                  {projects.map((proj, i) => (
                    <div key={i} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl" style={{ padding: '1.5rem' }}>
                      <h3 className="text-white font-semibold" style={{ marginBottom: '0.5rem' }}>{proj.title}</h3>
                      <p className="text-slate-400 text-sm" style={{ marginBottom: '1rem' }}>{proj.description}</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                        {(proj.technologies || []).map((t, j) => (
                          <span key={j} className="px-2 py-1 bg-cyan-500/10 text-cyan-300 rounded text-xs">{t}</span>
                        ))}
                      </div>
                      {proj.githubLink && <a href={proj.githubLink} className="text-indigo-400 hover:text-indigo-300 text-xs inline-block" style={{ marginTop: '1rem' }}>View on GitHub →</a>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Experience */}
            {experience.length > 0 && (
              <div style={{ padding: '0 3rem 4rem 3rem' }}>
                <h2 className="text-xl font-bold text-white text-center" style={{ marginBottom: '2rem' }}>💼 Experience</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '42rem', margin: '0 auto' }}>
                  {experience.map((exp, i) => (
                    <div key={i} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl" style={{ padding: '1.5rem' }}>
                      <h3 className="text-white font-semibold">{exp.role}</h3>
                      <p className="text-indigo-400 text-sm">{exp.company} • {exp.duration}</p>
                      <p className="text-slate-400 text-sm" style={{ marginTop: '0.5rem' }}>{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {education.length > 0 && (
              <div style={{ padding: '0 3rem 4rem 3rem' }}>
                <h2 className="text-xl font-bold text-white text-center" style={{ marginBottom: '2rem' }}>🎓 Education</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '42rem', margin: '0 auto' }}>
                  {education.map((edu, i) => (
                    <div key={i} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl" style={{ padding: '1.25rem' }}>
                      <h3 className="text-white font-semibold">{edu.degree}</h3>
                      <p className="text-slate-400 text-sm">{edu.institution} — {edu.year} {edu.cgpa ? `| CGPA: ${edu.cgpa}` : ''}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact */}
            <div className="text-center border-t border-white/5" style={{ padding: '3rem 2rem' }}>
              <h2 className="text-xl font-bold text-white" style={{ marginBottom: '0.75rem' }}>📬 Get In Touch</h2>
              <p className="text-slate-400 text-sm">{user?.email || 'your@email.com'}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Portfolio;
