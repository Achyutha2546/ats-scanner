import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { getResumeData } from '../api';

const templates = [
  { id: 'modern', name: 'Modern', desc: 'Clean layout with accent colors and modern typography', color: '#6366f1' },
  { id: 'minimal', name: 'Minimal', desc: 'Simple and elegant with maximum readability', color: '#64748b' },
  { id: 'professional', name: 'Professional', desc: 'Traditional format preferred by corporate recruiters', color: '#0f766e' },
  { id: 'creative', name: 'Creative', desc: 'Bold design with unique layout for creative roles', color: '#c026d3' },
];

const Templates = () => {
  const [selected, setSelected] = useState('modern');
  const [resume, setResume] = useState(null);
  const previewRef = useRef();

  useEffect(() => {
    getResumeData().then(({ data }) => setResume(data)).catch(() => {});
  }, []);

  const handleDownload = () => {
    const el = previewRef.current;
    if (!el) return;
    const printWindow = window.open('', '_blank');
    const color = templates.find(t => t.id === selected)?.color || '#6366f1';
    
    printWindow.document.write(`
      <html><head><title>Resume</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', 'Segoe UI', sans-serif; color: #1e293b; padding: 0; }
        .print-container { width: 100%; height: 100%; }
        ${selected === 'professional' ? `
          .resume-grid { display: flex; min-height: 100vh; }
          .resume-sidebar { width: 33%; background: #f8fafc; padding: 30px; border-right: 1px solid #e2e8f0; }
          .resume-main { width: 67%; padding: 40px; }
        ` : selected === 'creative' ? `
          .resume-header { background: ${color}; color: white; padding: 40px; }
          .resume-content { padding: 40px; }
        ` : `
          .resume-content { padding: 50px; }
        `}
        h1 { font-size: 28px; line-height: 1.2; }
        h2 { font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: ${color}; border-bottom: 2px solid ${color}; padding-bottom: 4px; margin: 25px 0 12px; }
        .minimal h2 { border-bottom: 1px solid #e2e8f0; text-align: center; }
        h3 { font-size: 15px; font-weight: 600; }
        p, li { font-size: 13px; line-height: 1.6; color: #334155; }
        .section { margin-bottom: 20px; }
        .meta { font-size: 11px; color: #64748b; }
      </style></head><body class="${selected}">
      <div class="print-container">
      ${el.innerHTML}
      </div>
      </body></html>
    `);
    printWindow.document.close();
    setTimeout(() => { printWindow.print(); }, 800);
  };

  const profile = resume?.profile || {};
  const education = resume?.education || [];
  const experience = resume?.experience || [];
  const projects = resume?.projects || [];

  const renderSections = (order, color, center = false) => {
    return order.map(type => {
      if (type === 'summary' && profile.summary) {
        return (
          <div key="summary" className="section" style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color, borderBottom: `2px solid ${color}`, paddingBottom: '0.25rem', marginBottom: '1rem', textAlign: center ? 'center' : 'left' }}>SUMMARY</h2>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.6 }}>{profile.summary}</p>
          </div>
        );
      }
      if (type === 'skills' && profile.skills?.length) {
        return (
          <div key="skills" className="section" style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color, borderBottom: `2px solid ${color}`, paddingBottom: '0.25rem', marginBottom: '1rem', textAlign: center ? 'center' : 'left' }}>SKILLS</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: center ? 'center' : 'flex-start' }}>
              {profile.skills.map((s, i) => (
                <span key={i} style={{ background: selected === 'minimal' ? 'none' : '#eff6ff', color: selected === 'minimal' ? '#1e293b' : '#3b82f6', border: selected === 'minimal' ? '1px solid #e2e8f0' : 'none', padding: '0.25rem 0.75rem', borderRadius: '0.25rem', fontSize: '0.75rem', fontWeight: 500 }}>{s}</span>
              ))}
            </div>
          </div>
        );
      }
      if (type === 'experience' && experience.length) {
        return (
          <div key="experience" className="section" style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color, borderBottom: `2px solid ${color}`, paddingBottom: '0.25rem', marginBottom: '1rem', textAlign: center ? 'center' : 'left' }}>EXPERIENCE</h2>
            {experience.map((exp, i) => (
              <div key={i} style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>{exp.role}</h3>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{exp.duration}</span>
                </div>
                <p style={{ fontSize: '0.9rem', color, fontWeight: 600, marginBottom: '0.35rem' }}>{exp.company}</p>
                <p style={{ fontSize: '0.875rem', color: '#334155' }}>{exp.description}</p>
              </div>
            ))}
          </div>
        );
      }
      if (type === 'projects' && projects.length) {
        return (
          <div key="projects" className="section" style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color, borderBottom: `2px solid ${color}`, paddingBottom: '0.25rem', marginBottom: '1rem', textAlign: center ? 'center' : 'left' }}>PROJECTS</h2>
            {projects.map((proj, i) => (
              <div key={i} style={{ marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>{proj.title}</h3>
                <p style={{ fontSize: '0.8rem', color, fontWeight: 600, marginBottom: '0.35rem' }}>{(proj.technologies || []).join(' | ')}</p>
                <p style={{ fontSize: '0.875rem', color: '#334155' }}>{proj.description}</p>
              </div>
            ))}
          </div>
        );
      }
      if (type === 'education' && education.length) {
        return (
          <div key="education" className="section" style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color, borderBottom: `2px solid ${color}`, paddingBottom: '0.25rem', marginBottom: '1rem', textAlign: center ? 'center' : 'left' }}>EDUCATION</h2>
            {education.map((edu, i) => (
                <div key={i} style={{ marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: 700 }}>{edu.degree}</h3>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{edu.year}</span>
                  </div>
                  <p style={{ fontSize: '0.85rem' }}>{edu.institution} {edu.cgpa && `| CGPA: ${edu.cgpa}`}</p>
                </div>
            ))}
          </div>
        );
      }
      if (type === 'certifications' && resume?.certifications?.length) {
        return (
          <div key="certs" className="section" style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color, borderBottom: `2px solid ${color}`, paddingBottom: '0.25rem', marginBottom: '1rem', textAlign: center ? 'center' : 'left' }}>CERTIFICATIONS</h2>
            {resume.certifications.map((cert, i) => (
              <p key={i} style={{ fontSize: '0.875rem', marginBottom: '0.4rem' }}>
                <strong>{cert.title}</strong> — {cert.organization} ({cert.year})
              </p>
            ))}
          </div>
        );
      }
      return null;
    });
  };

  const renderSidebarSections = (order) => {
    return order.map(type => {
      if (type === 'skills' && profile.skills?.length) {
        return (
          <div key="skills" style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>SKILLS</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {profile.skills.map((s, i) => (
                <div key={i} style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#6366f1' }}></div>
                  {s}
                </div>
              ))}
            </div>
          </div>
        );
      }
      if (type === 'certifications' && resume?.certifications?.length) {
        return (
          <div key="certs" style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>CERTIFICATIONS</h2>
            {resume.certifications.map((cert, i) => (
              <div key={i} style={{ fontSize: '0.75rem', marginBottom: '0.65rem' }}>
                <div style={{ fontWeight: 600 }}>{cert.title}</div>
                <div style={{ opacity: 0.8 }}>{cert.organization}</div>
              </div>
            ))}
          </div>
        );
      }
      if (type === 'education' && education.length) {
        return (
          <div key="education" style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>EDUCATION</h2>
            {education.map((edu, i) => (
              <div key={i} style={{ fontSize: '0.75rem', marginBottom: '0.75rem' }}>
                <div style={{ fontWeight: 600 }}>{edu.degree}</div>
                <div style={{ opacity: 0.8 }}>{edu.institution}</div>
                <div style={{ fontStyle: 'italic', opacity: 0.6 }}>{edu.year}</div>
              </div>
            ))}
          </div>
        );
      }
      return null;
    });
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#0f172a' }}>
      <Sidebar />
      <main style={{ marginLeft: '260px', padding: '2.5rem 3rem', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
          <div>
            <h1 className="text-3xl font-bold text-white" style={{ marginBottom: '0.5rem' }}>Resume Templates</h1>
            <p className="text-slate-400">Choose a template and download your resume as PDF</p>
          </div>
          <button onClick={handleDownload} className="btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '0.5rem' }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Download PDF
          </button>
        </div>

        {/* Template Selector */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2.5rem' }}>
          {templates.map(t => (
            <button key={t.id} onClick={() => setSelected(t.id)}
              className={`glass-card p-4 text-left transition-all ${selected === t.id ? 'border-indigo-500/50 ring-2 ring-indigo-500/20' : ''}`}>
              <div className="w-full h-2 rounded-full mb-3" style={{ background: t.color }}></div>
              <h3 className="text-white font-semibold text-sm">{t.name}</h3>
              <p className="text-slate-500 text-xs mt-1">{t.desc}</p>
            </button>
          ))}
        </div>

        {/* Resume Preview */}
        <div className="glass-card overflow-hidden" style={{ padding: '0.5rem' }}>
          <div ref={previewRef} className={`bg-white text-slate-900 rounded-lg ${selected}`} style={{ minHeight: '1000px', fontFamily: selected === 'professional' ? "'Georgia', serif" : "'Inter', sans-serif" }}>
            
            {/* Template 1: Modern & Template 4: Creative (Shared Base, different Header) */}
            {(selected === 'modern' || selected === 'creative') && (
              <div className="resume-container">
                <div style={{ 
                  background: selected === 'creative' ? templates.find(t => t.id === selected)?.color : 'white', 
                  color: selected === 'creative' ? 'white' : 'inherit',
                  padding: '3.5rem 3rem',
                  borderBottom: selected === 'modern' ? `5px solid ${templates.find(t => t.id === selected)?.color}` : 'none'
                }}>
                  <h1 style={{ fontSize: '2.5rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px' }}>{profile.name || 'Your Name'}</h1>
                  <p style={{ fontSize: '1.15rem', fontWeight: 600, opacity: 0.9 }}>{profile.targetRole || 'Target Role'}</p>
                  <div style={{ display: 'flex', gap: '1.25rem', marginTop: '1rem', flexWrap: 'wrap', fontSize: '0.8rem', opacity: 0.8 }}>
                    {profile.email && <span>📧 {profile.email}</span>}
                    {profile.phone && <span>📱 {profile.phone}</span>}
                    {profile.location && <span>📍 {profile.location}</span>}
                    {profile.website && <span>🌐 {profile.website}</span>}
                  </div>
                </div>
                <div style={{ padding: '3rem' }}>
                  {renderSections(['summary', 'skills', 'experience', 'projects', 'education', 'certifications'], templates.find(t => t.id === selected)?.color)}
                </div>
              </div>
            )}

            {/* Template 2: Minimal (Centered & Elegant) */}
            {selected === 'minimal' && (
              <div style={{ padding: '4rem 3rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2.25rem', fontWeight: 300, letterSpacing: '4px', textTransform: 'uppercase' }}>{profile.name || 'Your Name'}</h1>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '1rem', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {profile.email} | {profile.phone} | {profile.location}
                </div>
                <div style={{ height: '1px', background: '#e2e8f0', margin: '2rem auto', width: '80%' }}></div>
                <div style={{ textAlign: 'left', maxWidth: '800px', margin: '0 auto' }}>
                  {renderSections(['summary', 'experience', 'projects', 'education', 'skills', 'certifications'], '#1e293b', true)}
                </div>
              </div>
            )}

            {/* Template 3: Professional (Two Column Layout) */}
            {selected === 'professional' && (
              <div style={{ display: 'flex', minHeight: '1000px' }}>
                {/* Left Sidebar */}
                <div style={{ width: '33%', background: '#f8fafc', padding: '3rem 2rem', borderRight: '1px solid #e2e8f0' }}>
                  <div style={{ marginBottom: '2.5rem' }}>
                     <h1 style={{ fontSize: '1.75rem', fontWeight: 700, lineHeight: 1.1, marginBottom: '0.5rem' }}>{profile.name || 'Your Name'}</h1>
                     <p style={{ fontSize: '0.9rem', color: '#6366f1', fontWeight: 600 }}>{profile.targetRole}</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.75rem', color: '#475569', marginBottom: '2.5rem' }}>
                    {profile.email && <div><strong>E:</strong> {profile.email}</div>}
                    {profile.phone && <div><strong>P:</strong> {profile.phone}</div>}
                    {profile.location && <div><strong>L:</strong> {profile.location}</div>}
                    {profile.linkedin && <div><strong>IN:</strong> LinkedIn</div>}
                  </div>
                  {renderSidebarSections(['skills', 'certifications', 'education'])}
                </div>
                {/* Main Content */}
                <div style={{ width: '67%', padding: '3rem' }}>
                  {renderSections(['summary', 'experience', 'projects'], '#0f172a')}
                </div>
              </div>
            )}

            {!profile.name && (
              <div style={{ textAlign: 'center', padding: '5rem 0', color: '#94a3b8' }}>
                <p>No resume data yet</p>
                <Link to="/resume-builder" className="text-indigo-400 mt-2 hover:underline inline-block">Go to Builder</Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Templates;
