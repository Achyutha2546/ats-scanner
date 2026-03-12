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
    printWindow.document.write(`
      <html><head><title>Resume</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', sans-serif; color: #1e293b; padding: 40px; }
        h1 { font-size: 28px; margin-bottom: 8px; }
        h2 { font-size: 16px; color: #6366f1; border-bottom: 2px solid #6366f1; padding-bottom: 4px; margin: 20px 0 10px; }
        h3 { font-size: 14px; }
        p, li { font-size: 13px; line-height: 1.6; color: #334155; }
        ul { padding-left: 20px; }
        .skills { display: flex; flex-wrap: wrap; gap: 6px; }
        .skill { background: #eef2ff; color: #4f46e5; padding: 4px 10px; border-radius: 4px; font-size: 12px; }
        .section { margin-bottom: 16px; }
        .item { margin-bottom: 12px; }
        .meta { font-size: 12px; color: #64748b; }
        .header-links { font-size: 12px; color: #64748b; }
      </style></head><body>
      ${el.innerHTML}
      </body></html>
    `);
    printWindow.document.close();
    setTimeout(() => { printWindow.print(); }, 500);
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
          <div ref={previewRef} className="bg-white text-slate-900 rounded-lg" style={{ padding: '3rem', minHeight: '800px', fontFamily: "'Segoe UI', 'Inter', sans-serif" }}>
            {/* Header */}
            <div style={{ borderBottom: `3px solid ${templates.find(t => t.id === selected)?.color || '#6366f1'}`, paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a' }}>{profile.summary ? 'Your Name' : 'Your Name'}</h1>
              <div className="header-links" style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {profile.phone && <span>📱 {profile.phone}</span>}
                {profile.linkedin && <span>🔗 LinkedIn</span>}
                {profile.github && <span>💻 GitHub</span>}
              </div>
            </div>

            {/* Summary */}
            {profile.summary && (
              <div className="section" style={{ marginBottom: '1.25rem' }}>
                <h2 style={{ fontSize: '0.9375rem', fontWeight: 700, color: templates.find(t => t.id === selected)?.color || '#6366f1', borderBottom: `2px solid ${templates.find(t => t.id === selected)?.color || '#6366f1'}`, paddingBottom: '0.25rem', marginBottom: '0.5rem' }}>PROFESSIONAL SUMMARY</h2>
                <p style={{ fontSize: '0.8125rem', lineHeight: 1.6, color: '#334155' }}>{profile.summary}</p>
              </div>
            )}

            {/* Skills */}
            {(profile.skills?.length > 0) && (
              <div className="section" style={{ marginBottom: '1.25rem' }}>
                <h2 style={{ fontSize: '0.9375rem', fontWeight: 700, color: templates.find(t => t.id === selected)?.color || '#6366f1', borderBottom: `2px solid ${templates.find(t => t.id === selected)?.color || '#6366f1'}`, paddingBottom: '0.25rem', marginBottom: '0.5rem' }}>SKILLS</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                  {profile.skills.map((s, i) => (
                    <span key={i} style={{ background: '#eef2ff', color: '#4f46e5', padding: '0.2rem 0.625rem', borderRadius: '0.25rem', fontSize: '0.75rem' }}>{s}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Experience */}
            {experience.length > 0 && (
              <div className="section" style={{ marginBottom: '1.25rem' }}>
                <h2 style={{ fontSize: '0.9375rem', fontWeight: 700, color: templates.find(t => t.id === selected)?.color || '#6366f1', borderBottom: `2px solid ${templates.find(t => t.id === selected)?.color || '#6366f1'}`, paddingBottom: '0.25rem', marginBottom: '0.5rem' }}>EXPERIENCE</h2>
                {experience.map((exp, i) => (
                  <div key={i} style={{ marginBottom: '0.75rem' }}>
                    <h3 style={{ fontSize: '0.875rem', fontWeight: 600 }}>{exp.role} — {exp.company}</h3>
                    <p style={{ fontSize: '0.75rem', color: '#64748b' }}>{exp.duration}</p>
                    <p style={{ fontSize: '0.8125rem', color: '#334155', marginTop: '0.25rem' }}>{exp.description}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Projects */}
            {projects.length > 0 && (
              <div className="section" style={{ marginBottom: '1.25rem' }}>
                <h2 style={{ fontSize: '0.9375rem', fontWeight: 700, color: templates.find(t => t.id === selected)?.color || '#6366f1', borderBottom: `2px solid ${templates.find(t => t.id === selected)?.color || '#6366f1'}`, paddingBottom: '0.25rem', marginBottom: '0.5rem' }}>PROJECTS</h2>
                {projects.map((proj, i) => (
                  <div key={i} style={{ marginBottom: '0.75rem' }}>
                    <h3 style={{ fontSize: '0.875rem', fontWeight: 600 }}>{proj.title}</h3>
                    <p style={{ fontSize: '0.75rem', color: '#64748b' }}>{(proj.technologies || []).join(', ')}</p>
                    <p style={{ fontSize: '0.8125rem', color: '#334155', marginTop: '0.25rem' }}>{proj.description}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Education */}
            {education.length > 0 && (
              <div className="section">
                <h2 style={{ fontSize: '0.9375rem', fontWeight: 700, color: templates.find(t => t.id === selected)?.color || '#6366f1', borderBottom: `2px solid ${templates.find(t => t.id === selected)?.color || '#6366f1'}`, paddingBottom: '0.25rem', marginBottom: '0.5rem' }}>EDUCATION</h2>
                {education.map((edu, i) => (
                  <div key={i} style={{ marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '0.875rem', fontWeight: 600 }}>{edu.degree}</h3>
                    <p style={{ fontSize: '0.75rem', color: '#64748b' }}>{edu.institution} — {edu.year} {edu.cgpa ? `| CGPA: ${edu.cgpa}` : ''}</p>
                  </div>
                ))}
              </div>
            )}

            {!profile.summary && !experience.length && !projects.length && (
              <div style={{ textAlign: 'center', padding: '3.75rem 0', color: '#94a3b8' }}>
                <p style={{ fontSize: '1rem' }}>No resume data yet</p>
                <p style={{ fontSize: '0.8125rem', marginTop: '0.5rem' }}>Build your resume first to preview it here</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Templates;
