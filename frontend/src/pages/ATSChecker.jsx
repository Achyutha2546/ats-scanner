import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { getResumeData, analyzeATS } from '../api';

const ATSChecker = () => {
  const [resume, setResume] = useState(null);
  const [jobDesc, setJobDesc] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('resume');

  useEffect(() => {
    getResumeData().then(({ data }) => setResume(data)).catch(() => {});
  }, []);

  const roleKeywords = {
    'Frontend Developer': ['HTML', 'CSS', 'JavaScript', 'React', 'Git', 'REST API'],
    'Backend Developer': ['Node.js', 'Express', 'MongoDB', 'MySQL', 'REST API', 'Docker'],
    'Data Scientist': ['Python', 'Machine Learning', 'Pandas', 'NumPy', 'Statistics', 'TensorFlow'],
    'Full Stack Developer': ['JavaScript', 'React', 'Node.js', 'MongoDB', 'REST API', 'Git'],
    'Mobile Developer': ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase', 'Git'],
    'DevOps Engineer': ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Linux', 'Jenkins'],
    'UI/UX Designer': ['Figma', 'User Interface', 'User Experience', 'Prototyping', 'Adobe XD', 'Wireframing'],
    'ML Engineer': ['Machine Learning', 'PyTorch', 'TensorFlow', 'NLP', 'Computer Vision', 'Python'],
    'Cyber Security Analyst': ['Security', 'Network Security', 'Penetration Testing', 'Firewalls', 'Encryption', 'Threat Analysis']
  };

  const runAnalysis = async () => {
    setLoading(true);
    try {
      // If no resume, use a scaffold so the backend can still give a "Roadmap" score
      const resumeData = resume || { 
        profile: { name: 'New User', summary: '', skills: [] },
        education: [], experience: [], projects: [], certifications: [] 
      };

      // Use our NEW advanced ATS engine (Step 10)
      const { data } = await analyzeATS({ 
        resumeData, 
        jobDescription: jobDesc.trim(),
        targetRole: targetRole || resumeData.profile?.targetRole
      });
      setReport(data);
    } catch (err) {
      alert('Analysis failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const ScoreBar = ({ label, score, color }) => (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-2">
        <span className="text-slate-300">{label}</span>
        <span className={`font-semibold ${score >= 70 ? 'text-emerald-400' : score >= 40 ? 'text-amber-400' : 'text-red-400'}`}>{(score || 0)}%</span>
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
                <h3 className="text-white font-semibold">Job Details</h3>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded uppercase tracking-wider font-bold">Paste Below</span>
              </div>
              
              <div className="mb-4">
                <label className="text-xs text-slate-400 block mb-2">Target Role (Optional)</label>
                <select 
                  className="input-field w-full py-2" 
                  value={targetRole} 
                  onChange={e => setTargetRole(e.target.value)}
                >
                  <option value="">Auto-detect from Profile/JD</option>
                  {Object.keys(roleKeywords).map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>

              <label className="text-xs text-slate-400 block mb-2">Job Description</label>
              <textarea className="input-field h-40 resize-none" placeholder="Paste the job description here to check keyword matching against your resume..." value={jobDesc} onChange={e => setJobDesc(e.target.value)} />
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
                      <circle cx="90" cy="90" r="78" fill="none" stroke="url(#atsGrad)" strokeWidth="12" strokeDasharray={`${Math.max(report.atsScore, 1) * 4.9} 490`} className="score-ring" strokeLinecap="round" />
                      <defs><linearGradient id="atsGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor={report.atsScore >= 75 ? '#10b981' : report.atsScore >= 50 ? '#f59e0b' : '#ef4444'}/><stop offset="100%" stopColor={report.atsScore >= 75 ? '#0ea5e9' : report.atsScore >= 50 ? '#fbbf24' : '#f87171'}/></linearGradient></defs>
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
                  <ScoreBar label="Job Keyword Alignment" score={report.keywordScore} color="bg-gradient-to-r from-indigo-500 to-purple-500" />
                  <ScoreBar label="Technical Skill Match" score={report.skillScore} color="bg-gradient-to-r from-emerald-500 to-teal-500" />
                  <ScoreBar label="Semantic Similarity" score={report.semanticScore} color="bg-gradient-to-r from-cyan-500 to-blue-500" />
                  <ScoreBar label="Experience Alignment" score={report.experienceScore} color="bg-gradient-to-r from-amber-500 to-orange-500" />
                  <ScoreBar label="Resume Structure Quality" score={report.structureScore} color="bg-gradient-to-r from-pink-500 to-rose-500" />
                </div>

                {/* Missing Skills */}
                {report.missingSkills?.length > 0 && (
                  <div className="glass-card" style={{ padding: '2rem' }}>
                    <h3 className="text-white font-semibold" style={{ marginBottom: '1rem' }}>Missing Key Skills</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {report.missingSkills.map((skill, i) => (
                        <span key={i} className="px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-300 rounded-lg text-xs font-medium">{skill}</span>
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
