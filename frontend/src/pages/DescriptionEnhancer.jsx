import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { enhanceDescription } from '../api';

const modes = [
  {
    key: 'experience',
    label: 'Experience Bullet',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
    placeholder: 'e.g. "I worked on building the company website using react and also fixed many bugs and helped team members with their tasks"',
    description: 'Turn rough bullet points into polished, impact-driven resume lines.',
    tips: [
      'Start each bullet with a strong action verb',
      'Include quantifiable results (%, $, time saved)',
      'Focus on impact, not just duties',
      'Keep each bullet to 1-2 lines max',
      'Use past tense for previous roles',
    ],
  },
  {
    key: 'jobDescription',
    label: 'Job Description',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
    placeholder: 'Paste a job description here...\n\ne.g. "We need someone who can do python and javascript coding and make websites and also do some database stuff and work with the team"',
    description: 'Rewrite job descriptions with ATS-optimized keywords and clear structure.',
    tips: [
      'Include specific technical skills and tools',
      'Use standard job title terminology',
      'Clearly separate responsibilities from requirements',
      'Add measurable expectations when possible',
      'Use industry-standard keywords',
    ],
  },
  {
    key: 'summary',
    label: 'Professional Summary',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
      </svg>
    ),
    placeholder: 'e.g. "I am a software developer with 3 years of experience. I know java python and react. I have worked at two companies and I am looking for a new opportunity to grow"',
    description: 'Craft a compelling professional summary that hooks recruiters instantly.',
    tips: [
      'Lead with your strongest qualifier',
      'Mention years of experience + specialization',
      'Include 2-3 top skills or technologies',
      'End with your value proposition',
      'Keep it to 3-5 impactful sentences',
    ],
  },
];

const DescriptionEnhancer = () => {
  const [activeMode, setActiveMode] = useState('experience');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [source, setSource] = useState('');

  const currentMode = modes.find((m) => m.key === activeMode);

  const handleEnhance = async () => {
    if (!input.trim()) {
      setError('Please enter some text to enhance.');
      return;
    }
    setError('');
    setOutput('');
    setLoading(true);
    setSource('');
    try {
      const { data } = await enhanceDescription(input, activeMode);
      setOutput(data.result);
      setSource(data.source || '');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError('');
    setSource('');
  };

  const handleModeChange = (mode) => {
    setActiveMode(mode);
    setOutput('');
    setError('');
    setSource('');
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#0f172a' }}>
      <Sidebar />
      <main style={{ marginLeft: '260px', padding: '2.5rem 3rem', flex: 1 }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }} className="fade-in">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <div className="gradient-bg" style={{ width: '42px', height: '42px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                AI <span className="gradient-text">Writer</span>
              </h1>
              <p className="text-slate-400 text-sm">Enhance your descriptions to be ATS-friendly & human-written</p>
            </div>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="glass-card slide-up" style={{ padding: '0.5rem', marginBottom: '1.5rem', display: 'flex', gap: '0.5rem' }}>
          {modes.map((mode) => (
            <button
              key={mode.key}
              onClick={() => handleModeChange(mode.key)}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.85rem 1rem',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: 600,
                transition: 'all 0.3s ease',
                background: activeMode === mode.key ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'transparent',
                color: activeMode === mode.key ? '#fff' : '#94a3b8',
                boxShadow: activeMode === mode.key ? '0 4px 20px rgba(99,102,241,0.3)' : 'none',
              }}
              onMouseEnter={(e) => {
                if (activeMode !== mode.key) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.color = '#e2e8f0';
                }
              }}
              onMouseLeave={(e) => {
                if (activeMode !== mode.key) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#94a3b8';
                }
              }}
            >
              {mode.icon}
              {mode.label}
            </button>
          ))}
        </div>

        {/* Mode Description */}
        <p className="text-slate-400 text-sm" style={{ marginBottom: '1.25rem', paddingLeft: '0.25rem' }}>
          {currentMode.description}
        </p>

        {/* Main Content Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.5rem' }}>
          {/* Left: Input/Output */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Input Area */}
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3 className="text-white font-semibold" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                  Your Text
                </h3>
                {input && (
                  <button
                    onClick={handleClear}
                    style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem', transition: 'color 0.2s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#f87171')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    Clear
                  </button>
                )}
              </div>
              <textarea
                className="input-field"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={currentMode.placeholder}
                style={{
                  minHeight: '180px',
                  resize: 'vertical',
                  lineHeight: '1.7',
                  fontSize: '0.925rem',
                }}
              />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem' }}>
                <span className="text-slate-500 text-xs">{input.length} characters · {input.trim().split(/\s+/).filter(Boolean).length} words</span>
                <button
                  className="btn-primary"
                  onClick={handleEnhance}
                  disabled={loading || !input.trim()}
                  style={{
                    opacity: loading || !input.trim() ? 0.6 : 1,
                    cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                    padding: '0.7rem 1.75rem',
                  }}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Enhancing...
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                      </svg>
                      Enhance
                    </>
                  )}
                </button>
              </div>
              {error && (
                <div style={{ marginTop: '0.75rem', padding: '0.65rem 0.85rem', borderRadius: '8px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', fontSize: '0.85rem' }}>
                  {error}
                </div>
              )}
            </div>

            {/* Output Area */}
            {(output || loading) && (
              <div className="glass-card slide-up" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <h3 className="text-white font-semibold" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                    Enhanced Result
                    {source === 'local' && (
                      <span style={{ fontSize: '0.7rem', color: '#f59e0b', background: 'rgba(245,158,11,0.1)', padding: '0.2rem 0.5rem', borderRadius: '6px', border: '1px solid rgba(245,158,11,0.2)' }}>
                        Local Enhancement
                      </span>
                    )}
                  </h3>
                  {output && (
                    <button
                      onClick={handleCopy}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        background: copied ? 'rgba(16,185,129,0.1)' : 'rgba(99,102,241,0.1)',
                        border: copied ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(99,102,241,0.3)',
                        color: copied ? '#10b981' : '#818cf8',
                        padding: '0.45rem 0.85rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {copied ? (
                        <>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                          Copied!
                        </>
                      ) : (
                        <>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                          Copy
                        </>
                      )}
                    </button>
                  )}
                </div>
                {loading ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1.5rem 0' }}>
                    {[1, 2, 3].map((i) => (
                      <div key={i} style={{ height: '14px', background: 'rgba(99,102,241,0.1)', borderRadius: '6px', width: `${100 - i * 15}%`, animation: 'pulse 1.5s ease-in-out infinite', animationDelay: `${i * 0.2}s` }} />
                    ))}
                  </div>
                ) : (
                  <div style={{
                    background: 'rgba(15,23,42,0.5)',
                    border: '1px solid rgba(16,185,129,0.15)',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    color: '#e2e8f0',
                    fontSize: '0.925rem',
                    lineHeight: '1.8',
                    whiteSpace: 'pre-wrap',
                  }}>
                    {output}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: Tips Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* ATS Tips Card */}
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <h3 className="text-white font-semibold" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
                ATS Writing Tips
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {currentMode.tips.map((tip, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', padding: '0.6rem 0.7rem', background: 'rgba(15,23,42,0.4)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '6px', background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
                      <span style={{ fontSize: '0.65rem', color: '#818cf8', fontWeight: 700 }}>{i + 1}</span>
                    </div>
                    <span style={{ fontSize: '0.825rem', color: '#cbd5e1', lineHeight: '1.5' }}>{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* How It Works Card */}
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <h3 className="text-white font-semibold" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                How It Works
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {[
                  { step: '1', text: 'Paste your rough text or description', color: '#6366f1' },
                  { step: '2', text: 'AI analyzes tone, keywords & structure', color: '#0ea5e9' },
                  { step: '3', text: 'Get ATS-optimized, human-style output', color: '#10b981' },
                ].map((item) => (
                  <div key={item.step} style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '8px',
                      background: `${item.color}20`,
                      border: `1px solid ${item.color}40`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <span style={{ fontSize: '0.75rem', color: item.color, fontWeight: 700 }}>{item.step}</span>
                    </div>
                    <span style={{ fontSize: '0.825rem', color: '#94a3b8' }}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Examples */}
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <h3 className="text-white font-semibold" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14,2 14,8 20,8" /></svg>
                Before / After
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ padding: '0.75rem', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: '10px' }}>
                  <span style={{ fontSize: '0.65rem', color: '#f87171', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Before</span>
                  <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.35rem', lineHeight: '1.5', fontStyle: 'italic' }}>
                    "I worked on making the website faster and fixed some bugs"
                  </p>
                </div>
                <div style={{ padding: '0.75rem', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: '10px' }}>
                  <span style={{ fontSize: '0.65rem', color: '#10b981', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>After</span>
                  <p style={{ fontSize: '0.8rem', color: '#e2e8f0', marginTop: '0.35rem', lineHeight: '1.5' }}>
                    "Optimized web application performance by 40%, resolving critical bugs and enhancing overall user experience."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Inline keyframes for loading skeleton */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
};

export default DescriptionEnhancer;
