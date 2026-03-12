import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { getResumeData } from '../api';

const careerPaths = {
  'react': ['Frontend Developer', 'Full Stack Developer', 'React Developer', 'UI Engineer'],
  'node.js': ['Backend Developer', 'Full Stack Developer', 'API Developer'],
  'python': ['Data Scientist', 'ML Engineer', 'Backend Developer', 'AI Research'],
  'machine learning': ['ML Engineer', 'Data Scientist', 'AI Research', 'Computer Vision Engineer'],
  'java': ['Backend Developer', 'Android Developer', 'Enterprise Developer'],
  'docker': ['DevOps Engineer', 'Cloud Engineer', 'SRE'],
  'aws': ['Cloud Engineer', 'DevOps Engineer', 'Solutions Architect'],
  'flutter': ['Mobile Developer', 'Cross-Platform Developer'],
  'sql': ['Database Administrator', 'Data Analyst', 'Backend Developer'],
  'tensorflow': ['ML Engineer', 'Deep Learning Engineer', 'AI Research'],
  'javascript': ['Frontend Developer', 'Full Stack Developer', 'Node.js Developer'],
  'typescript': ['Frontend Developer', 'Full Stack Developer'],
  'mongodb': ['Full Stack Developer', 'Backend Developer'],
  'css': ['Frontend Developer', 'UI Developer'],
  'html': ['Frontend Developer', 'Web Developer'],
  'kubernetes': ['DevOps Engineer', 'Cloud Engineer', 'Platform Engineer'],
  'statistics': ['Data Scientist', 'Data Analyst', 'Statistician'],
};

const learningPaths = {
  'Frontend Developer': ['Advanced React Patterns', 'TypeScript', 'Testing (Jest/Cypress)', 'Performance Optimization', 'Accessibility'],
  'Backend Developer': ['System Design', 'Database Optimization', 'API Security', 'Microservices', 'Message Queues'],
  'Full Stack Developer': ['DevOps Basics', 'Cloud Services', 'CI/CD', 'WebSockets', 'GraphQL'],
  'Data Scientist': ['Deep Learning', 'NLP', 'Feature Engineering', 'A/B Testing', 'Big Data (Spark)'],
  'ML Engineer': ['MLOps', 'Model Deployment', 'Distributed Training', 'Edge Computing', 'AutoML'],
  'DevOps Engineer': ['IaC (Terraform)', 'Monitoring (Prometheus)', 'Service Mesh', 'GitOps', 'Security'],
  'Mobile Developer': ['App Performance', 'Push Notifications', 'Offline-First', 'App Store Optimization', 'CI/CD'],
};

const roleSkillMap = {
  'Software Developer': ['software development', 'programming', 'algorithms', 'data structures', 'problem solving', 'git', 'coding'],
  'Frontend Developer': ['react', 'javascript', 'typescript', 'html', 'css', 'tailwind', 'next.js', 'redux', 'webpack', 'responsive design', 'git'],
  'Backend Developer': ['node.js', 'express', 'python', 'java', 'sql', 'mongodb', 'rest api', 'graphql', 'docker', 'aws', 'git'],
  'Full Stack Developer': ['react', 'node.js', 'javascript', 'typescript', 'mongodb', 'sql', 'rest api', 'docker', 'git', 'aws', 'html', 'css'],
  'Data Scientist': ['python', 'machine learning', 'tensorflow', 'pandas', 'numpy', 'sql', 'statistics', 'deep learning', 'data visualization', 'scikit-learn'],
  'DevOps Engineer': ['docker', 'kubernetes', 'aws', 'ci/cd', 'terraform', 'linux', 'jenkins', 'ansible', 'monitoring', 'git'],
  'Mobile Developer': ['react native', 'flutter', 'swift', 'kotlin', 'javascript', 'firebase', 'rest api', 'git', 'ui/ux', 'app store deployment'],
  'ML Engineer': ['python', 'tensorflow', 'pytorch', 'machine learning', 'deep learning', 'nlp', 'computer vision', 'mlops', 'docker', 'aws'],
  'Cyber Security Analyst': ['security', 'network security', 'penetration testing', 'firewalls', 'encryption', 'threat analysis', 'cybersecurity'],
  'Cloud Architect': ['aws', 'azure', 'google cloud', 'cloud infrastructure', 'architecture', 'scalability', 'serverless'],
  'UI/UX Designer': ['figma', 'user interface', 'user experience', 'prototyping', 'adobe xd', 'wireframing', 'design systems', 'visual design']
};

const Career = () => {
  const [userSkills, setUserSkills] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getResumeData();
        const skills = (data.profile?.skills || []).map(s => s.toLowerCase());
        setUserSkills(skills);
        generateRecommendations(skills);
      } catch (err) { /* empty */ }
      setLoading(false);
    };
    load();
  }, []);

  const generateRecommendations = (skills) => {
    const roleScores = {};
    
    // Calculate match scores for all roles in roleSkillMap
    Object.entries(roleSkillMap).forEach(([role, requiredSkills]) => {
      const matched = requiredSkills.filter(req => 
        skills.some(userSkill => userSkill.includes(req) || req.includes(userSkill))
      );
      const score = Math.round((matched.length / requiredSkills.length) * 100);
      const missing = requiredSkills.filter(req => 
        !skills.some(userSkill => userSkill.includes(req) || req.includes(userSkill))
      );
      
      roleScores[role] = {
        score,
        matched: matched.length,
        missing: missing.slice(0, 5) // Top 5 missing skills
      };
    });

    const sorted = Object.entries(roleScores)
      .sort((a, b) => b[1].score - a[1].score)
      .slice(0, 5)
      .map(([role, data]) => ({
        role,
        matchScore: data.score,
        missingSkills: data.missing,
        learningPath: learningPaths[role] || ['Continue building projects', 'Focus on fundamentals'],
      }));

    setRecommendations(sorted);
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#0f172a' }}>
      <Sidebar />
      <main style={{ marginLeft: '260px', padding: '2.5rem 3rem', flex: 1 }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 className="text-3xl font-bold text-white" style={{ marginBottom: '0.5rem' }}>Career Recommendations</h1>
          <p className="text-slate-400">AI-powered career path suggestions based on your skills and experience</p>
        </div>

        {/* User Skills */}
        <div className="glass-card" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
          <h3 className="text-white font-semibold" style={{ marginBottom: '1.25rem' }}>Your Skills Profile</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {userSkills.length > 0 ? userSkills.map((s, i) => (
              <span key={i} className="px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-lg text-sm">{s}</span>
            )) : <p className="text-slate-500 text-sm">Add skills in the Resume Builder to get recommendations.</p>}
          </div>
        </div>

        {/* Student Career Roadmap */}
        <div className="glass-card" style={{ padding: '2rem', marginBottom: '2.5rem', border: '1px solid rgba(99,102,241,0.2)' }}>
          <h3 className="text-white font-semibold" style={{ marginBottom: '1.25rem' }}>🎓 Student Career Roadmap</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }}>
            <div className="p-4 bg-white/5 rounded-xl border border-white/5">
              <span className="text-indigo-400 font-bold block mb-1">1st Year</span>
              <p className="text-[10px] text-slate-400">Focus on C/C++, Data Structures, and building basic logical foundations.</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl border border-white/5">
              <span className="text-emerald-400 font-bold block mb-1">2nd Year</span>
              <p className="text-[10px] text-slate-400">Learn Web/App dev, Git, and start small personal projects.</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl border border-white/5">
              <span className="text-amber-400 font-bold block mb-1">3rd Year</span>
              <p className="text-[10px] text-slate-400">Master one tech stack, build complex projects, and start LeetCode.</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl border border-white/5">
              <span className="text-rose-400 font-bold block mb-1">Final Year</span>
              <p className="text-[10px] text-slate-400">Mock interviews, refine resume, and apply for internships/jobs.</p>
            </div>
          </div>
          <div className="mt-6 p-4 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
            <p className="text-xs text-indigo-300 font-medium italic">💡 Fresher Tip: Most companies use ATS to filter resumes. Aim for a score of 75+ by adding role-specific keywords and quantifiable achievements!</p>
          </div>
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h3 className="text-white font-semibold">Recommended Paths for You</h3>
            {recommendations.map((rec, i) => (
              <div key={i} className="glass-card fade-in" style={{ padding: '2rem', animationDelay: `${i * 0.1}s` }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center text-white font-bold text-lg">
                      #{i + 1}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">{rec.role}</h3>
                      <p className="text-sm text-slate-400">Based on your skill profile</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${rec.matchScore >= 60 ? 'text-emerald-400' : 'text-amber-400'}`}>{rec.matchScore}%</div>
                    <div className="text-xs text-slate-500">match</div>
                  </div>
                </div>

                <div className="w-full h-2 bg-slate-700/50 rounded-full overflow-hidden" style={{ marginBottom: '1.5rem' }}>
                  <div className="h-full gradient-bg rounded-full transition-all duration-1000" style={{ width: `${rec.matchScore}%` }}></div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                  <div>
                    <h4 className="text-sm font-medium text-slate-300" style={{ marginBottom: '1rem' }}>📚 Suggested Learning Path</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {rec.learningPath.map((item, j) => (
                        <span key={j} className="px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 rounded-lg text-xs font-medium">{item}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-red-400" style={{ marginBottom: '1rem' }}>❌ Missing Skills</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {rec.missingSkills.length > 0 ? rec.missingSkills.map((skill, j) => (
                        <span key={j} className="px-3 py-1.5 bg-red-500/10 border border-red-500/20 text-red-300 rounded-lg text-xs font-medium">{skill}</span>
                      )) : <span className="text-xs text-emerald-400">All key skills matched!</span>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : !loading ? (
          <div className="glass-card text-center" style={{ padding: '4.5rem 2rem' }}>
            <div className="text-6xl" style={{ marginBottom: '1.5rem' }}>💼</div>
            <h3 className="text-white font-semibold text-lg" style={{ marginBottom: '0.5rem' }}>No Recommendations Yet</h3>
            <p className="text-slate-400 text-sm">Add skills to your resume to get personalized career recommendations.</p>
          </div>
        ) : null}
      </main>
    </div>
  );
};

export default Career;
