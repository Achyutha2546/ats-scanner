import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { saveResume, getResumeData, rewriteDescription } from '../api';

const ResumeBuilder = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [aiLoading, setAiLoading] = useState(null);

  const [profile, setProfile] = useState({ targetRole: '', summary: '', skills: '', linkedin: '', github: '', portfolioLink: '', phone: '' });
  const [education, setEducation] = useState([{ degree: '', institution: '', year: '', cgpa: '' }]);
  const [experience, setExperience] = useState([{ company: '', role: '', duration: '', description: '' }]);
  const [projects, setProjects] = useState([{ title: '', description: '', technologies: '', githubLink: '' }]);
  const [certifications, setCertifications] = useState([{ title: '', organization: '', year: '' }]);

  const roles = [
    'Software Developer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
    'Data Scientist', 'Data Engineer', 'DevOps Engineer', 'Mobile Developer',
    'ML Engineer', 'Cyber Security Analyst', 'Cloud Architect', 'UI/UX Designer'
  ];

  const roleRequirementMap = {
    'Software Developer': {
      skills: ['Data Structures', 'Algorithms', 'C/C++', 'Java', 'Git', 'OOPs', 'Operating Systems'],
      projects: ['Personal Portfolio', 'Library Management System', 'Chat Application']
    },
    'Frontend Developer': {
      skills: ['React', 'JavaScript', 'HTML5', 'CSS3', 'Tailwind', 'Next.js', 'Responsive Design'],
      projects: ['Weather Dashboard', 'E-commerce UI', 'Next.js Blog']
    },
    'Backend Developer': {
      skills: ['Node.js', 'Express', 'Python', 'SQL', 'MongoDB', 'REST APIs', 'Docker'],
      projects: ['Authentication System', 'Task Manager API', 'Microservices Demo']
    },
    'Full Stack Developer': {
      skills: ['React', 'Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'Docker', 'Git'],
      projects: ['Social Media Web App', 'Food Delivery Platform', 'Admin Dashboard']
    },
    'Data Scientist': {
      skills: ['Python', 'R', 'Machine Learning', 'Pandas', 'Statistics', 'Power BI', 'SQL'],
      projects: ['Stock Price Predictor', 'Customer Segmentation', 'Sentiment Analysis']
    },
    'DevOps Engineer': {
      skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Linux', 'Terraform', 'Bash Scripting'],
      projects: ['Auto-Deployment Pipeline', 'Server Monitoring Tool', 'Cloud migration script']
    },
    'Mobile Developer': {
      skills: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase', 'Mobile UI/UX'],
      projects: ['Budget Tracker App', 'Food Ordering App', 'Fitness Tracker']
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getResumeData();
        if (data.profile) setProfile({ ...profile, ...data.profile, skills: (data.profile.skills || []).join(', ') });
        if (data.education?.length) setEducation(data.education);
        if (data.experience?.length) setExperience(data.experience);
        if (data.projects?.length) setProjects(data.projects.map(p => ({ ...p, technologies: (p.technologies || []).join(', ') })));
      } catch (err) { /* no data yet */ }
    };
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveResume({
        profile: { ...profile, skills: profile.skills.split(',').map(s => s.trim()).filter(Boolean) },
        education,
        experience,
        projects: projects.map(p => ({ ...p, technologies: p.technologies.split(',').map(t => t.trim()).filter(Boolean) })),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 8000);
    } catch (err) {
      alert('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleAIRewrite = async (text, callback, idx) => {
    setAiLoading(idx);
    try {
      const { data } = await rewriteDescription(text);
      callback(data.result);
    } catch (err) {
      alert('AI rewrite failed');
    } finally {
      setAiLoading(null);
    }
  };

  const tabs = [
    { id: 'personal', label: 'Personal', icon: '👤' },
    { id: 'education', label: 'Education', icon: '🎓' },
    { id: 'skills', label: 'Skills', icon: '⚡' },
    { id: 'experience', label: 'Experience', icon: '💼' },
    { id: 'projects', label: 'Projects', icon: '🚀' },
    { id: 'certs', label: 'Certifications', icon: '📜' },
  ];

  const addItem = (setter, template) => setter(prev => [...prev, { ...template }]);
  const removeItem = (setter, idx) => setter(prev => prev.filter((_, i) => i !== idx));
  const updateItem = (setter, idx, field, value) => setter(prev => prev.map((item, i) => i === idx ? { ...item, [field]: value } : item));

  return (
    <div className="min-h-screen flex" style={{ background: '#0f172a' }}>
      <Sidebar />
      <main style={{ marginLeft: '260px', padding: '2.5rem 3rem', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
          <div>
            <h1 className="text-3xl font-bold text-white" style={{ marginBottom: '0.5rem' }}>Resume Builder</h1>
            <p className="text-slate-400">Fill in your details to create a professional resume</p>
          </div>
          <button onClick={handleSave} className={`btn-primary ${saved ? '!bg-emerald-600' : ''}`} disabled={saving}>
            {saving ? 'Saving...' : saved ? '✓ Saved' : 'Save Resume'}
          </button>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.id ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'}`}>
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Personal Info */}
        {activeTab === 'personal' && (
          <div className="glass-card fade-in" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h2 className="text-lg font-semibold text-white">Personal Information</h2>
            
            <div style={{ marginBottom: '0.5rem' }}>
              <label className="block text-sm text-slate-300" style={{ marginBottom: '0.5rem' }}>Target Role</label>
              <select className="input-field" value={profile.targetRole} onChange={e => setProfile({...profile, targetRole: e.target.value})}>
                <option value="">Select Target Role...</option>
                {roles.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <p className="text-xs text-slate-500" style={{ marginTop: '0.5rem' }}>Selecting a role helps us tailor your ATS score and recommendations.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
              <div><label className="block text-sm text-slate-300" style={{ marginBottom: '0.5rem' }}>Phone</label><input className="input-field" placeholder="+91 9876543210" value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} /></div>
              <div><label className="block text-sm text-slate-300" style={{ marginBottom: '0.5rem' }}>LinkedIn URL</label><input className="input-field" placeholder="https://linkedin.com/in/yourname" value={profile.linkedin} onChange={e => setProfile({...profile, linkedin: e.target.value})} /></div>
              <div><label className="block text-sm text-slate-300" style={{ marginBottom: '0.5rem' }}>GitHub URL</label><input className="input-field" placeholder="https://github.com/yourname" value={profile.github} onChange={e => setProfile({...profile, github: e.target.value})} /></div>
              <div><label className="block text-sm text-slate-300" style={{ marginBottom: '0.5rem' }}>Portfolio Link</label><input className="input-field" placeholder="https://yourportfolio.com" value={profile.portfolioLink} onChange={e => setProfile({...profile, portfolioLink: e.target.value})} /></div>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <label className="text-sm text-slate-300">Professional Summary</label>
                <button onClick={() => handleAIRewrite(profile.summary, (result) => setProfile({...profile, summary: result}), 'summary')} className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1" disabled={!!aiLoading}>
                  {aiLoading === 'summary' ? '✨ Rewriting...' : '✨ AI Enhance'}
                </button>
              </div>
              <textarea className="input-field h-32 resize-none" placeholder="Write a professional summary about yourself..." value={profile.summary} onChange={e => setProfile({...profile, summary: e.target.value})} />
            </div>
          </div>
        )}

        {/* Skills */}
        {activeTab === 'skills' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="fade-in">
            <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h2 className="text-lg font-semibold text-white">Skills</h2>
              <p className="text-sm text-slate-400">Separate skills with commas (e.g., React, Node.js, Python, MongoDB)</p>
              <textarea className="input-field h-40 resize-none" placeholder="React, Node.js, Python, MongoDB, Docker, Git, REST APIs, TypeScript..." value={profile.skills} onChange={e => setProfile({...profile, skills: e.target.value})} />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
                {profile.skills.split(',').map(s => s.trim()).filter(Boolean).map((skill, i) => (
                  <span key={i} className="px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-lg text-sm font-medium">{skill}</span>
                ))}
              </div>
            </div>

            {profile.targetRole && roleRequirementMap[profile.targetRole] && (
              <div className="glass-card" style={{ padding: '2rem', border: '1px solid rgba(99,102,241,0.3)', background: 'rgba(99,102,241,0.05)' }}>
                <h3 className="text-sm font-semibold text-indigo-300 mb-4 flex items-center gap-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                  Essential Skills for {profile.targetRole}
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
                  {roleRequirementMap[profile.targetRole].skills.map(skill => {
                    const hasSkill = profile.skills.toLowerCase().includes(skill.toLowerCase());
                    return (
                      <button
                        key={skill}
                        onClick={() => {
                          if (!hasSkill) {
                            const currentSkills = profile.skills.split(',').map(s => s.trim()).filter(Boolean);
                            const newSkills = [...currentSkills, skill].join(', ');
                            setProfile({...profile, skills: newSkills});
                          }
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${hasSkill ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default' : 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 hover:bg-indigo-500/20'}`}
                      >
                        {hasSkill ? '✓ ' : '+ '}{skill}
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-slate-500 mt-4 italic">These skills are highly valued by ATS systems for this role. Click to add them to your profile.</p>
              </div>
            )}
          </div>
        )}

        {/* Education */}
        {activeTab === 'education' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="fade-in">
            {education.map((edu, idx) => (
              <div key={idx} className="glass-card" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <h3 className="text-white font-medium">Education #{idx + 1}</h3>
                  {education.length > 1 && <button onClick={() => removeItem(setEducation, idx)} className="text-red-400 text-sm hover:text-red-300">Remove</button>}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }}>
                  <div><label className="block text-sm text-slate-300" style={{ marginBottom: '0.5rem' }}>Degree</label><input className="input-field" placeholder="B.Tech Computer Science" value={edu.degree} onChange={e => updateItem(setEducation, idx, 'degree', e.target.value)} /></div>
                  <div><label className="block text-sm text-slate-300" style={{ marginBottom: '0.5rem' }}>Institution</label><input className="input-field" placeholder="XYZ University" value={edu.institution} onChange={e => updateItem(setEducation, idx, 'institution', e.target.value)} /></div>
                  <div><label className="block text-sm text-slate-300" style={{ marginBottom: '0.5rem' }}>Year</label><input className="input-field" placeholder="2024" value={edu.year} onChange={e => updateItem(setEducation, idx, 'year', e.target.value)} /></div>
                  <div><label className="block text-sm text-slate-300" style={{ marginBottom: '0.5rem' }}>CGPA</label><input className="input-field" placeholder="8.5" value={edu.cgpa} onChange={e => updateItem(setEducation, idx, 'cgpa', e.target.value)} /></div>
                </div>
              </div>
            ))}
            <button onClick={() => addItem(setEducation, { degree: '', institution: '', year: '', cgpa: '' })} className="btn-secondary w-full justify-center">+ Add Education</button>
          </div>
        )}

        {/* Experience */}
        {activeTab === 'experience' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="fade-in">
            {experience.map((exp, idx) => (
              <div key={idx} className="glass-card" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <h3 className="text-white font-medium">Experience #{idx + 1}</h3>
                  {experience.length > 1 && <button onClick={() => removeItem(setExperience, idx)} className="text-red-400 text-sm hover:text-red-300">Remove</button>}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }}>
                  <div><label className="block text-sm text-slate-300" style={{ marginBottom: '0.5rem' }}>Company</label><input className="input-field" placeholder="Google" value={exp.company} onChange={e => updateItem(setExperience, idx, 'company', e.target.value)} /></div>
                  <div><label className="block text-sm text-slate-300" style={{ marginBottom: '0.5rem' }}>Role</label><input className="input-field" placeholder="Software Engineer" value={exp.role} onChange={e => updateItem(setExperience, idx, 'role', e.target.value)} /></div>
                  <div style={{ gridColumn: 'span 2' }}><label className="block text-sm text-slate-300" style={{ marginBottom: '0.5rem' }}>Duration</label><input className="input-field" placeholder="Jan 2023 - Present" value={exp.duration} onChange={e => updateItem(setExperience, idx, 'duration', e.target.value)} /></div>
                </div>
                <div style={{ marginTop: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <label className="text-sm text-slate-300">Description</label>
                    <button onClick={() => handleAIRewrite(exp.description, (result) => updateItem(setExperience, idx, 'description', result), `exp-${idx}`)} className="text-xs text-indigo-400 hover:text-indigo-300" disabled={!!aiLoading}>
                      {aiLoading === `exp-${idx}` ? '✨ Rewriting...' : '✨ AI Enhance'}
                    </button>
                  </div>
                  <textarea className="input-field h-24 resize-none" placeholder="Describe your responsibilities..." value={exp.description} onChange={e => updateItem(setExperience, idx, 'description', e.target.value)} />
                </div>
              </div>
            ))}
            <button onClick={() => addItem(setExperience, { company: '', role: '', duration: '', description: '' })} className="btn-secondary w-full justify-center">+ Add Experience</button>
          </div>
        )}

        {/* Projects */}
        {activeTab === 'projects' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="fade-in">
            {profile.targetRole && roleRequirementMap[profile.targetRole] && (
              <div className="glass-card" style={{ padding: '2rem', border: '1px solid rgba(14,165,233,0.3)', background: 'rgba(14,165,233,0.05)' }}>
                <h3 className="text-sm font-semibold text-cyan-300 mb-4 flex items-center gap-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  Essential Projects for {profile.targetRole}
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                  {roleRequirementMap[profile.targetRole].projects.map(projTitle => (
                    <div key={projTitle} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 text-center">
                      <p className="text-xs font-semibold text-white mb-2">{projTitle}</p>
                      <button 
                        onClick={() => addItem(setProjects, { title: projTitle, description: '', technologies: '', githubLink: '' })}
                        className="text-[10px] text-cyan-400 hover:text-cyan-300 font-medium uppercase tracking-wider"
                      >
                        + Add Placeholder
                      </button>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-500 mt-4 italic">Freshers should aim to complete at least 2 of these projects to build a strong portfolio.</p>
              </div>
            )}

            {projects.map((proj, idx) => (
              <div key={idx} className="glass-card" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <h3 className="text-white font-medium">Project #{idx + 1}</h3>
                  {projects.length > 1 && <button onClick={() => removeItem(setProjects, idx)} className="text-red-400 text-sm hover:text-red-300">Remove</button>}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }}>
                  <div><label className="block text-sm text-slate-300" style={{ marginBottom: '0.5rem' }}>Project Title</label><input className="input-field" placeholder="E-Commerce Platform" value={proj.title} onChange={e => updateItem(setProjects, idx, 'title', e.target.value)} /></div>
                  <div><label className="block text-sm text-slate-300" style={{ marginBottom: '0.5rem' }}>Technologies</label><input className="input-field" placeholder="React, Node.js, MongoDB" value={proj.technologies} onChange={e => updateItem(setProjects, idx, 'technologies', e.target.value)} /></div>
                  <div style={{ gridColumn: 'span 2' }}><label className="block text-sm text-slate-300" style={{ marginBottom: '0.5rem' }}>GitHub Link</label><input className="input-field" placeholder="https://github.com/yourname/project" value={proj.githubLink} onChange={e => updateItem(setProjects, idx, 'githubLink', e.target.value)} /></div>
                </div>
                <div style={{ marginTop: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <label className="text-sm text-slate-300">Description</label>
                    <button onClick={() => handleAIRewrite(proj.description, (result) => updateItem(setProjects, idx, 'description', result), `proj-${idx}`)} className="text-xs text-indigo-400 hover:text-indigo-300" disabled={!!aiLoading}>
                      {aiLoading === `proj-${idx}` ? '✨ Rewriting...' : '✨ AI Enhance'}
                    </button>
                  </div>
                  <textarea className="input-field h-24 resize-none" placeholder="Describe what this project does..." value={proj.description} onChange={e => updateItem(setProjects, idx, 'description', e.target.value)} />
                </div>
              </div>
            ))}
            <button onClick={() => addItem(setProjects, { title: '', description: '', technologies: '', githubLink: '' })} className="btn-secondary w-full justify-center">+ Add Project From Scratch</button>
          </div>
        )}

        {/* Certifications */}
        {activeTab === 'certs' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="fade-in">
            {certifications.map((cert, idx) => (
              <div key={idx} className="glass-card" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <h3 className="text-white font-medium">Certification #{idx + 1}</h3>
                  {certifications.length > 1 && <button onClick={() => removeItem(setCertifications, idx)} className="text-red-400 text-sm hover:text-red-300">Remove</button>}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
                  <div><label className="block text-sm text-slate-300" style={{ marginBottom: '0.5rem' }}>Title</label><input className="input-field" placeholder="AWS Certified Developer" value={cert.title} onChange={e => updateItem(setCertifications, idx, 'title', e.target.value)} /></div>
                  <div><label className="block text-sm text-slate-300" style={{ marginBottom: '0.5rem' }}>Organization</label><input className="input-field" placeholder="Amazon" value={cert.organization} onChange={e => updateItem(setCertifications, idx, 'organization', e.target.value)} /></div>
                  <div><label className="block text-sm text-slate-300" style={{ marginBottom: '0.5rem' }}>Year</label><input className="input-field" placeholder="2024" value={cert.year} onChange={e => updateItem(setCertifications, idx, 'year', e.target.value)} /></div>
                </div>
              </div>
            ))}
            <button onClick={() => addItem(setCertifications, { title: '', organization: '', year: '' })} className="btn-secondary w-full justify-center">+ Add Certification</button>
          </div>
        )}

        {/* Success Notification */}
        {saved && (
          <div className="fixed top-24 right-8 z-50 flex items-center gap-3 animate-slide-in">
            <div className="bg-emerald-500 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-2 font-medium">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              Resume Saved!
            </div>
            <Link to="/career" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-2 transition-all font-medium">
              View Career Insights 🚀
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default ResumeBuilder;
