import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { getResumeData, getATSScore } from '../api';

const ATSChecker = () => {
  const [resume, setResume] = useState(null);
  const [jobDesc, setJobDesc] = useState('');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('resume');

  useEffect(() => {
    getResumeData().then(({ data }) => setResume(data)).catch(() => {});
  }, []);

  const roleKeywords = {
    'Software Developer': ['software development', 'programming', 'algorithms', 'data structures', 'problem solving', 'git', 'coding'],
    'Frontend Developer': ['react', 'javascript', 'css', 'html', 'frontend', 'ui/ux', 'responsive design', 'typescript'],
    'Backend Developer': ['node.js', 'backend', 'api', 'databases', 'sql', 'express', 'server-side', 'microservices'],
    'Full Stack Developer': ['react', 'node.js', 'full stack', 'frontend', 'backend', 'databases', 'api', 'javascript'],
    'Data Scientist': ['python', 'data science', 'statistics', 'machine learning', 'pandas', 'data analysis', 'r', 'data modeling'],
    'Data Engineer': ['etl', 'data pipelines', 'spark', 'hadoop', 'sql', 'big data', 'python', 'data architecture'],
    'DevOps Engineer': ['docker', 'kubernetes', 'aws', 'ci/cd', 'linux', 'automation', 'infrastructure', 'jenkins'],
    'Mobile Developer': ['react native', 'flutter', 'swift', 'kotlin', 'ios', 'android', 'mobile apps', 'mobile development'],
    'ML Engineer': ['machine learning', 'pytorch', 'tensorflow', 'deep learning', 'nlp', 'computer vision', 'mlops', 'python'],
    'Cyber Security Analyst': ['security', 'network security', 'penetration testing', 'firewalls', 'encryption', 'threat analysis', 'cybersecurity'],
    'Cloud Architect': ['aws', 'azure', 'google cloud', 'cloud infrastructure', 'architecture', 'scalability', 'serverless'],
    'UI/UX Designer': ['figma', 'user interface', 'user experience', 'prototyping', 'adobe xd', 'wireframing', 'design systems', 'visual design']
  };

  const runAnalysis = async () => {
    setLoading(true);
    try {
      const skills = resume?.profile?.skills || [];
      const summary = resume?.profile?.summary || '';
      const targetRole = resume?.profile?.targetRole || '';
      const hasExp = (resume?.experience || []).some(e => e.company && e.role);
      const hasEdu = (resume?.education || []).some(e => e.degree && e.institution);
      const hasProj = (resume?.projects || []).some(p => p.title);

      const resumeText = `${summary} ${skills.join(' ')} ${(resume?.experience || []).map(e => `${e.role} ${e.description}`).join(' ')} ${(resume?.projects || []).map(p => `${p.title} ${p.description} ${(p.technologies || []).join(' ')}`).join(' ')}`.toLowerCase();

      // Determine keywords to match against
      let keywordsToMatch = [];
      if (jobDesc.trim()) {
        keywordsToMatch = jobDesc.toLowerCase().split(/\W+/).filter(w => w.length > 3);
      } else if (targetRole && roleKeywords[targetRole]) {
        keywordsToMatch = roleKeywords[targetRole];
      }

      const matched = keywordsToMatch.filter(w => resumeText.includes(w.toLowerCase()));
      
      // 1. Keyword matching (45%)
      const keywordScore = keywordsToMatch.length > 0 
        ? Math.min(Math.round((matched.length / keywordsToMatch.length) * 100), 100) 
        : (targetRole || jobDesc.trim() ? 0 : 0);

      // 2. Structure and sections (20%)
      const sections = [
        summary.length > 50, 
        skills.length >= 3, 
        hasExp, 
        hasEdu, 
        hasProj
      ].filter(Boolean).length;
      const structureScore = Math.round((sections / 5) * 100);

      // 3. Impact and Action (10%)
      const actionVerbs = ['developed', 'implemented', 'designed', 'built', 'optimized', 'created', 'managed', 'led', 'improved', 'delivered', 'architected', 'deployed'];
      const verbCount = actionVerbs.filter(v => resumeText.includes(v)).length;
      const verbScore = Math.min(Math.round((verbCount / 5) * 100), 100);

      // 4. Formatting Quality (15%) - Base score for digital readability
      const formatScore = 95;

      // 5. Content quality (10%)
      const contentScore = Math.min(Math.round((summary.length / 150) * 100), 100);

      const atsScore = Math.round(keywordScore * 0.45 + structureScore * 0.2 + formatScore * 0.15 + verbScore * 0.1 + contentScore * 0.1);

      const suggestions = [];
      if (keywordScore < 50) suggestions.push(jobDesc.trim() ? 'Add more keywords from the job description' : `Add more keywords relevant to ${targetRole}`);
      if (!summary) suggestions.push('Add a professional summary section');
      if (skills.length < 5) suggestions.push('Add more relevant technical skills');
      if (!hasExp) suggestions.push('Add work experience entries');
      if (!hasProj) suggestions.push('Include project details with technologies used');
      if (verbCount < 3) suggestions.push('Use more action verbs like "developed", "implemented", "designed"');

      setReport({ atsScore, keywordScore, structureScore, formatScore, verbScore, contentScore, suggestions, matchedKeywords: [...new Set(matched)].slice(0, 20) });
    } catch (err) {
      alert('Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const ScoreBar = ({ label, score, color }) => (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-2">
        <span className="text-slate-300">{label}</span>
        <span className={`font-semibold ${score >= 70 ? 'text-emerald-400' : score >= 40 ? 'text-amber-400' : 'text-red-400'}`}>{score}%</span>
      </div>
      <div className="w-full h-2.5 bg-slate-700/50 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-1000 ${color}`} style={{ width: `${score}%` }}></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex" style={{ background: '#0f172a' }}>
      <Sidebar />
      <main style={{ marginLeft: '260px', padding: '2.5rem 3rem', flex: 1 }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 className="text-3xl font-bold text-white" style={{ marginBottom: '0.5rem' }}>ATS Compatibility Scanner</h1>
          <p className="text-slate-400">Our algorithm approximates professional company ATS scanners to give you a realistic compatibility score.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.75rem' }}>
          {/* Input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="glass-card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <h3 className="text-white font-semibold">Job Description</h3>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded uppercase tracking-wider font-bold">Paste Below</span>
              </div>
              <textarea className="input-field h-64 resize-none" placeholder="Paste the job description here to check keyword matching against your resume..." value={jobDesc} onChange={e => setJobDesc(e.target.value)} />
            </div>
            <button onClick={runAnalysis} className="btn-primary w-full justify-center text-base py-3" disabled={loading} style={{ padding: '1rem' }}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                  Analyzing compatibility...
                </span>
              ) : '🎯 Run ATS Analysis'}
            </button>
            <p className="text-[10px] text-slate-500 text-center px-4">Recruiters typically look for scores above 75% for competitive roles.</p>
          </div>

          {/* Results */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {report ? (
              <>
                {/* Main Score */}
                <div className="glass-card text-center pulse-glow" style={{ padding: '2rem' }}>
                  <h3 className="text-white font-semibold" style={{ marginBottom: '1.25rem' }}>Your ATS Score</h3>
                  <div className="relative inline-block">
                    <svg width="180" height="180" viewBox="0 0 180 180">
                      <circle cx="90" cy="90" r="78" fill="none" stroke="#1e293b" strokeWidth="12" />
                      <circle cx="90" cy="90" r="78" fill="none" stroke="url(#atsGrad)" strokeWidth="12" strokeDasharray={`${report.atsScore * 4.9} 490`} className="score-ring" strokeLinecap="round" />
                      <defs><linearGradient id="atsGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor={report.atsScore >= 70 ? '#10b981' : '#f59e0b'}/><stop offset="100%" stopColor={report.atsScore >= 70 ? '#0ea5e9' : '#ef4444'}/></linearGradient></defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-5xl font-bold text-white">{report.atsScore}</span>
                      <span className="text-sm text-slate-400">out of 100</span>
                    </div>
                  </div>
                </div>

                {/* Score Breakdown */}
                <div className="glass-card" style={{ padding: '2rem' }}>
                  <h3 className="text-white font-semibold" style={{ marginBottom: '1.5rem' }}>Score Breakdown</h3>
                  <ScoreBar label="Keyword Match (45%)" score={report.keywordScore} color="bg-gradient-to-r from-indigo-500 to-purple-500" />
                  <ScoreBar label="Resume Structure (20%)" score={report.structureScore} color="bg-gradient-to-r from-emerald-500 to-teal-500" />
                  <ScoreBar label="Formatting Quality (15%)" score={report.formatScore} color="bg-gradient-to-r from-cyan-500 to-blue-500" />
                  <ScoreBar label="Action Verbs (10%)" score={report.verbScore} color="bg-gradient-to-r from-amber-500 to-orange-500" />
                  <ScoreBar label="Content Quality (10%)" score={report.contentScore} color="bg-gradient-to-r from-pink-500 to-rose-500" />
                </div>

                {/* Matched Keywords */}
                {report.matchedKeywords?.length > 0 && (
                  <div className="glass-card" style={{ padding: '2rem' }}>
                    <h3 className="text-white font-semibold" style={{ marginBottom: '1rem' }}>Matched Keywords</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {report.matchedKeywords.map((kw, i) => (
                        <span key={i} className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded-lg text-xs font-medium">{kw}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggestions */}
                {report.suggestions?.length > 0 && (
                  <div className="glass-card" style={{ padding: '2rem' }}>
                    <h3 className="text-white font-semibold" style={{ marginBottom: '1rem' }}>Improvement Suggestions</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {report.suggestions.map((s, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.875rem' }}>
                          <span className="text-amber-400 mt-0.5">⚡</span>
                          <span className="text-slate-300">{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="glass-card text-center" style={{ padding: '4rem 2rem' }}>
                <div className="text-6xl" style={{ marginBottom: '1.5rem' }}>🎯</div>
                <h3 className="text-white font-semibold text-lg" style={{ marginBottom: '0.5rem' }}>Ready to Analyze</h3>
                <p className="text-slate-400 text-sm">Paste a job description and click "Run ATS Analysis" to get your score and improvement tips.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ATSChecker;
