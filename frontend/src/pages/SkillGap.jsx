import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { getResumeData } from '../api';

const roleSkillMap = {
  'Software Developer': ['software development', 'programming', 'algorithms', 'data structures', 'problem solving', 'git', 'coding'],
  'Frontend Developer': ['react', 'javascript', 'typescript', 'html', 'css', 'tailwind', 'next.js', 'redux', 'webpack', 'responsive design', 'git'],
  'Backend Developer': ['node.js', 'express', 'python', 'java', 'sql', 'mongodb', 'rest api', 'graphql', 'docker', 'aws', 'git'],
  'Full Stack Developer': ['react', 'node.js', 'javascript', 'typescript', 'mongodb', 'sql', 'rest api', 'docker', 'git', 'aws', 'html', 'css'],
  'Data Scientist': ['python', 'machine learning', 'tensorflow', 'pandas', 'numpy', 'sql', 'statistics', 'deep learning', 'data visualization', 'scikit-learn'],
  'Data Engineer': ['etl', 'data pipelines', 'spark', 'hadoop', 'sql', 'big data', 'python', 'data architecture'],
  'DevOps Engineer': ['docker', 'kubernetes', 'aws', 'ci/cd', 'terraform', 'linux', 'jenkins', 'ansible', 'monitoring', 'git'],
  'Mobile Developer': ['react native', 'flutter', 'swift', 'kotlin', 'javascript', 'firebase', 'rest api', 'git', 'ui/ux', 'app store deployment'],
  'ML Engineer': ['python', 'tensorflow', 'pytorch', 'machine learning', 'deep learning', 'nlp', 'computer vision', 'mlops', 'docker', 'aws'],
  'Cyber Security Analyst': ['security', 'network security', 'penetration testing', 'firewalls', 'encryption', 'threat analysis', 'cybersecurity'],
  'Cloud Architect': ['aws', 'azure', 'google cloud', 'cloud infrastructure', 'architecture', 'scalability', 'serverless'],
  'UI/UX Designer': ['figma', 'user interface', 'user experience', 'prototyping', 'adobe xd', 'wireframing', 'design systems', 'visual design']
};

const SkillGap = () => {
  const [userSkills, setUserSkills] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    getResumeData().then(({ data }) => {
      if (data.profile?.skills) setUserSkills(data.profile.skills.map(s => s.toLowerCase()));
    }).catch(() => {});
  }, []);

  const analyze = () => {
    if (!selectedRole) return;
    const required = roleSkillMap[selectedRole] || [];
    const matched = required.filter(s => userSkills.some(us => us.includes(s) || s.includes(us)));
    const missing = required.filter(s => !userSkills.some(us => us.includes(s) || s.includes(us)));
    const matchPct = Math.round((matched.length / required.length) * 100);
    setAnalysis({ matched, missing, matchPct, required });
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#0f172a' }}>
      <Sidebar />
      <main style={{ marginLeft: '260px', padding: '2.5rem 3rem', flex: 1 }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 className="text-3xl font-bold text-white" style={{ marginBottom: '0.5rem' }}>Skill Gap Analyzer</h1>
          <p className="text-slate-400">Compare your skills against target job roles and discover gaps</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.75rem' }}>
          {/* Input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="glass-card" style={{ padding: '2rem' }}>
              <h3 className="text-white font-semibold" style={{ marginBottom: '1.25rem' }}>Your Skills</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {userSkills.length > 0 ? userSkills.map((s, i) => (
                  <span key={i} className="px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-lg text-sm">{s}</span>
                )) : <p className="text-slate-500 text-sm">No skills found. Add skills in the Resume Builder first.</p>}
              </div>
            </div>

            <div className="glass-card" style={{ padding: '2rem' }}>
              <h3 className="text-white font-semibold" style={{ marginBottom: '1.25rem' }}>Target Job Role</h3>
              <select className="input-field" style={{ marginBottom: '1.25rem' }} value={selectedRole} onChange={e => setSelectedRole(e.target.value)}>
                <option value="">Select a role...</option>
                {Object.keys(roleSkillMap).map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
              <button onClick={analyze} className="btn-primary w-full justify-center" style={{ padding: '1rem' }} disabled={!selectedRole}>🔍 Analyze Skill Gap</button>
            </div>
          </div>

          {/* Results */}
          <div>
            {analysis ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="fade-in">
                {/* Match Percentage */}
                <div className="glass-card text-center" style={{ padding: '2rem' }}>
                  <h3 className="text-white font-semibold" style={{ marginBottom: '1.25rem' }}>Skill Match for {selectedRole}</h3>
                  <div className="relative inline-block">
                    <svg width="160" height="160" viewBox="0 0 160 160">
                      <circle cx="80" cy="80" r="70" fill="none" stroke="#1e293b" strokeWidth="10" />
                      <circle cx="80" cy="80" r="70" fill="none" stroke={analysis.matchPct >= 70 ? '#10b981' : analysis.matchPct >= 40 ? '#f59e0b' : '#ef4444'} strokeWidth="10" strokeDasharray={`${analysis.matchPct * 4.4} 440`} className="score-ring" strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-bold text-white">{analysis.matchPct}%</span>
                      <span className="text-xs text-slate-400">match</span>
                    </div>
                  </div>
                </div>

                {/* Matched */}
                <div className="glass-card" style={{ padding: '2rem' }}>
                  <h3 className="text-emerald-400 font-semibold" style={{ marginBottom: '1rem' }}>✅ Skills You Have ({analysis.matched.length})</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {analysis.matched.map((s, i) => (
                      <span key={i} className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded-lg text-sm">{s}</span>
                    ))}
                  </div>
                </div>

                {/* Missing */}
                <div className="glass-card" style={{ padding: '2rem' }}>
                  <h3 className="text-red-400 font-semibold" style={{ marginBottom: '1rem' }}>❌ Missing Skills ({analysis.missing.length})</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
                    {analysis.missing.map((s, i) => (
                      <span key={i} className="px-3 py-1.5 bg-red-500/10 border border-red-500/20 text-red-300 rounded-lg text-sm">{s}</span>
                    ))}
                  </div>
                  <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl" style={{ padding: '1.25rem', marginTop: '1rem' }}>
                    <p className="text-indigo-300 text-sm font-medium" style={{ marginBottom: '0.5rem' }}>🧑‍🏫 Mentor Advice</p>
                    <p className="text-slate-300 text-sm">To bridge this gap, start by learning <strong className="text-white">{analysis.missing.slice(0, 3).join(', ')}</strong>. Consider building a small project that uses these tools to demonstrate practical knowledge on your resume.</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="glass-card text-center" style={{ padding: '4.5rem 2rem' }}>
                <div className="text-6xl" style={{ marginBottom: '1.5rem' }}>🔍</div>
                <h3 className="text-white font-semibold text-lg" style={{ marginBottom: '0.5rem' }}>Select a Target Role</h3>
                <p className="text-slate-400 text-sm">Choose a job role to compare your skills against its requirements.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SkillGap;
