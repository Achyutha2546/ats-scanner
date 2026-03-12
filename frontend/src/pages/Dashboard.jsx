import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getResumeData } from '../api';
import Sidebar from '../components/Sidebar';

const Dashboard = () => {
  const { user } = useAuth();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [atsScore, setAtsScore] = useState(0);

  const roleKeywords = {
    'Software Developer': ['software development', 'programming', 'algorithms', 'data structures', 'git'],
    'Frontend Developer': ['react', 'javascript', 'css', 'html', 'frontend', 'ui/ux', 'typescript'],
    'Backend Developer': ['node.js', 'backend', 'api', 'databases', 'sql', 'express'],
    'Full Stack Developer': ['react', 'node.js', 'full stack', 'frontend', 'backend', 'javascript'],
    'Data Scientist': ['python', 'data science', 'statistics', 'machine learning', 'pandas'],
    'Data Engineer': ['etl', 'data pipelines', 'spark', 'hadoop', 'sql', 'python'],
    'DevOps Engineer': ['docker', 'kubernetes', 'aws', 'ci/cd', 'linux', 'automation'],
    'Mobile Developer': ['react native', 'flutter', 'swift', 'kotlin', 'ios', 'android'],
    'ML Engineer': ['machine learning', 'pytorch', 'tensorflow', 'deep learning', 'python'],
    'Cyber Security Analyst': ['security', 'network security', 'penetration testing', 'encryption'],
    'Cloud Architect': ['aws', 'azure', 'google cloud', 'cloud infrastructure'],
    'UI/UX Designer': ['figma', 'user interface', 'user experience', 'prototyping', 'design systems']
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await getResumeData();
        setResume(data);
        if (data) calculateAtsScore(data);
      } catch (err) {
        console.log('No resume data yet');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const calculateAtsScore = (data) => {
    const skills = data.profile?.skills || [];
    const summary = data.profile?.summary || '';
    const targetRole = data.profile?.targetRole || '';
    const hasExp = (data.experience || []).some(e => e.company && e.role);
    const hasEdu = (data.education || []).some(e => e.institution && e.degree);
    const hasProj = (data.projects || []).some(p => p.title);

    // Profile completeness (30%)
    const sectionsScore = ([
      summary.length > 50, 
      skills.length >= 3, 
      hasExp, 
      hasEdu, 
      hasProj
    ].filter(Boolean).length / 5) * 30;

    // Content relevance (70%)
    let relevanceScore = 0;
    if (targetRole && roleKeywords[targetRole]) {
      const resumeText = `${summary} ${skills.join(' ')} ${(data.experience || []).map(e => `${e.role} ${e.description}`).join(' ')}`.toLowerCase();
      const targetKws = roleKeywords[targetRole];
      const matches = targetKws.filter(kw => resumeText.includes(kw.toLowerCase())).length;
      relevanceScore = (matches / targetKws.length) * 70;
    } else if (!targetRole) {
      // If no role is selected, we can't judge relevance, so the score is capped at structural quality
      relevanceScore = 0;
    }

    setAtsScore(Math.round(sectionsScore + relevanceScore));
  };

  const profileCompletion = () => {
    if (!resume) return 0;
    let filled = 0, total = 5;
    if (resume.profile?.targetRole) filled++;
    if (resume.profile?.summary) filled++;
    if (resume.education?.length > 0) filled++;
    if (resume.experience?.length > 0) filled++;
    if (resume.projects?.length > 0) filled++;
    return Math.round((filled / total) * 100);
  };

  const completion = profileCompletion();

  const quickActions = [
    { title: 'Build Resume', desc: 'Create or edit your resume', icon: '📝', path: '/resume-builder', color: 'from-indigo-500 to-purple-600' },
    { title: 'ATS Score', desc: 'Check ATS compatibility', icon: '🎯', path: '/ats-checker', color: 'from-emerald-500 to-teal-600' },
    { title: 'Skill Gap', desc: 'Analyze missing skills', icon: '🔍', path: '/skill-gap', color: 'from-amber-500 to-orange-600' },
    { title: 'Career Path', desc: 'Get AI recommendations', icon: '💼', path: '/career', color: 'from-cyan-500 to-blue-600' },
  ];

  return (
    <div className="min-h-screen flex" style={{ background: '#0f172a' }}>
      <Sidebar />
      <main style={{ marginLeft: '260px', padding: '2.5rem 3rem', flex: 1 }}>
        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }} className="fade-in">
          <h1 className="text-3xl font-bold text-white" style={{ marginBottom: '0.5rem' }}>Welcome back, <span className="gradient-text">{user?.name || 'User'}</span></h1>
          <p className="text-slate-400">Here's an overview of your resume and career progress.</p>
        </div>

        {/* Progress Card */}
        <div className="glass-card slide-up" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <h2 className="text-lg font-semibold text-white" style={{ marginBottom: '0.25rem' }}>Profile Completion</h2>
              <p className="text-sm text-slate-400">Complete your profile to boost your ATS score</p>
            </div>
            <div className="text-3xl font-bold gradient-text">{completion}%</div>
          </div>
          <div className="w-full h-3 bg-slate-700/50 rounded-full overflow-hidden">
            <div className="h-full gradient-bg rounded-full transition-all duration-1000 ease-out" style={{ width: `${completion}%` }}></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginTop: '1.25rem' }}>
            {['Summary', 'Education', 'Experience', 'Projects'].map((item, i) => {
              const done = resume && (
                (i === 0 && resume.profile?.summary) ||
                (i === 1 && resume.education?.length > 0) ||
                (i === 2 && resume.experience?.length > 0) ||
                (i === 3 && resume.projects?.length > 0)
              );
              return (
                <div key={item} className={`flex items-center gap-2 text-sm ${done ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {done ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/></svg>
                  )}
                  {item}
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <h2 className="text-xl font-semibold text-white" style={{ marginBottom: '1.25rem' }}>Quick Actions</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
          {quickActions.map((action, i) => (
            <Link key={i} to={action.path} className="glass-card group cursor-pointer" style={{ padding: '1.75rem', animationDelay: `${i * 0.1}s` }}>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`} style={{ marginBottom: '1.25rem' }}>
                {action.icon}
              </div>
              <h3 className="text-white font-semibold" style={{ marginBottom: '0.35rem' }}>{action.title}</h3>
              <p className="text-sm text-slate-400">{action.desc}</p>
            </Link>
          ))}
        </div>

        {/* ATS Score + Resume Preview */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.75rem' }}>
          {/* ATS Score Card */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <h3 className="text-lg font-semibold text-white" style={{ marginBottom: '1.25rem' }}>ATS Score Summary</h3>
            <div className="flex items-center justify-center" style={{ padding: '2rem 0' }}>
              <div className="relative">
                <svg width="160" height="160" viewBox="0 0 160 160">
                  <circle cx="80" cy="80" r="70" fill="none" stroke="#1e293b" strokeWidth="10" />
                  <circle cx="80" cy="80" r="70" fill="none" stroke="url(#scoreGrad)" strokeWidth="10" strokeDasharray={`${atsScore * 4.4} 440`} className="score-ring" strokeLinecap="round" />
                  <defs><linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#6366f1"/><stop offset="100%" stopColor="#0ea5e9"/></linearGradient></defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold text-white">{atsScore || '--'}</span>
                  <span className="text-sm text-slate-400">out of 100</span>
                </div>
              </div>
            </div>
            <Link to="/ats-checker" className="btn-secondary w-full justify-center text-sm" style={{ marginTop: '1rem' }}>Run Full ATS Analysis</Link>
          </div>

          {/* Resume Preview */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <h3 className="text-lg font-semibold text-white" style={{ marginBottom: '1.25rem' }}>Resume Preview</h3>
            {resume?.profile ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="bg-slate-800/50 rounded-xl" style={{ padding: '1.25rem' }}>
                  <p className="text-sm text-slate-300 leading-relaxed">{resume.profile.summary || 'No summary added yet'}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(resume.profile.skills || []).slice(0, 6).map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-lg text-xs font-medium">{skill}</span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-500" style={{ padding: '3rem 0' }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginBottom: '1rem' }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/></svg>
                <p className="text-sm">No resume data yet</p>
              </div>
            )}
            <Link to="/resume-builder" className="btn-primary w-full justify-center text-sm" style={{ marginTop: '1.25rem' }}>
              {resume?.profile ? 'Edit Resume' : 'Build Resume'}
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
