import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import { OpenAI } from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
import { removeStopwords } from 'stopword';
import natural from 'natural';
import lemmatize from 'wink-lemmatizer';
import Tesseract from 'tesseract.js';

const ROLE_SKILLS = {
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

const SKILL_DB = [
  ...new Set([
    ...Object.values(ROLE_SKILLS).flat().map(s => s.toLowerCase()),
    'python', 'java', 'react', 'node.js', 'sql', 'mongodb', 'aws', 'docker', 
    'javascript', 'typescript', 'html', 'css', 'express', 'git', 'linux', 
    'kubernetes', 'c++', 'c#', 'ruby', 'go', 'php', 'swift', 'kotlin', 
    'angular', 'vue', 'django', 'flask', 'spring', 'hibernate', 'mysql', 
    'postgresql', 'redis', 'elasticsearch', 'kafka', 'rabbitmq', 'graphql',
    'rest api', 'soap', 'azure', 'gcp', 'terraform', 'ansible', 'jenkins',
    'ci/cd', 'agile', 'scrum', 'jira', 'confluence', 'tensorflow', 'pytorch',
    'machine learning', 'data science', 'pandas', 'numpy', 'scipy', 'nlp',
    'computer vision', 'opencv', 'keras', 'hadoop', 'spark', 'scala', 
    'bash', 'powershell', 'shell scripting', 'c', 'rust', 'dart', 'flutter',
    'react native', 'ionic', 'xamarin', 'objective-c', 'firebase', 'supabase',
    'dynamodb', 'cassandra', 'neo4j', 'apollo', 'redux', 'mobx',
    'rxjs', 'ngrx', 'jest', 'mocha', 'chai', 'cypress', 'selenium', 'puppeteer',
    'playwright', 'webpack', 'babel', 'vite', 'npm', 'yarn', 'pnpm', 'docker-compose',
    'microservices', 'serverless', 'lambda', 's3', 'ec2', 'ecs', 'eks', 'fargate',
    'cloudformation', 'auth0', 'oauth', 'jwt', 'saml', 'openid',
    'figma', 'sketch', 'adobe xd', 'photoshop', 'illustrator', 'ui/ux',
    'tableau', 'power bi', 'looker', 'snowflake', 'redshift', 'bigquery'
  ])
];

// Helper to clean and lemmatize text
export const cleanAndLemmatize = (text) => {
  if (!text || typeof text !== 'string') return '';
  const clean = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  const tokens = clean.split(' ');
  const noStopWords = removeStopwords(tokens);
  const lemmatized = noStopWords.map(word => lemmatize.verb(lemmatize.noun(word)));
  return lemmatized.join(' ');
};

// Skill Synonyms Mapping
const SKILL_SYNONYMS = {
  'html': ['html5', 'html', 'xhtml'],
  'css': ['css3', 'css', 'scss', 'sass'],
  'javascript': ['js', 'javascript', 'es6', 'ecmascript'],
  'react': ['react.js', 'reactjs', 'react'],
  'node.js': ['nodejs', 'node.js', 'node'],
  'mongodb': ['mongo', 'mongodb'],
  'rest api': ['rest', 'restful', 'rest api'],
  'machine learning': ['ml', 'machine learning'],
  'ui/ux': ['ui', 'ux', 'ui/ux', 'design'],
  'postgresql': ['postgres', 'postgresql'],
  'next.js': ['nextjs', 'next.js', 'next'],
  'express': ['expressjs', 'express.js', 'express']
};

const normalizeSkill = (skill) => {
  const s = skill.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
  for (const [canonical, variations] of Object.entries(SKILL_SYNONYMS)) {
    if (variations.some(v => v.toLowerCase().replace(/[^a-z0-9]/g, '') === s)) {
      return canonical;
    }
  }
  return s;
};

// 1. Resume Parsing - extract text from PDF/DOCX
export const parseResumeFile = async (buffer, mimetype) => {
  try {
    if (mimetype === 'application/pdf') {
      const data = await pdfParse(buffer);
      return data.text;
    } else if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || mimetype === 'application/msword') {
      const result = await mammoth.extractRawText({ buffer });
      return result.value || '';
    } else if (mimetype.startsWith('image/')) {
      const { data: { text } } = await Tesseract.recognize(buffer, 'eng');
      return text;
    }
  } catch (error) {
    console.error('File parsing error:', error);
  }
  return '';
};

// Step 1: Resume Data Aggregation - Combine into structured analysis object
export const aggregateResumeData = (data) => {
  if (!data) return { skills: [], contentText: '', sections: {} };
  if (typeof data === 'string') return { skills: [], contentText: data, sections: { summary: data.length > 50 } };
  
  const p = data.profile || {};
  const skills = Array.isArray(p.skills) ? p.skills.filter(s => s && s.trim()) : [];
  const projects = Array.isArray(data.projects) ? data.projects : [];
  const experience = Array.isArray(data.experience) ? data.experience : [];
  const education = Array.isArray(data.education) ? data.education : [];
  const certifications = Array.isArray(data.certifications) ? data.certifications : [];

  const projectText = projects.map(proj => `${proj.title || ''} ${proj.description || ''} ${(proj.technologies || []).join(' ')}`).join(' ');
  const experienceText = experience.map(exp => `${exp.role || ''} ${exp.company || ''} ${exp.description || ''}`).join(' ');
  const eduText = education.map(edu => `${edu.degree || ''} ${edu.institution || ''}`).join(' ');

  const contentText = `${p.summary || ''} ${skills.join(' ')} ${projectText} ${experienceText} ${eduText} ${certifications.map(c => c.title || '').join(' ')}`.trim();

  return {
    name: p.name || '',
    skills,
    projectDescriptions: projectText,
    experienceDescriptions: experienceText,
    fullText: `${p.name || ''} ${p.targetRole || ''} ${contentText}`,
    contentText: contentText,
    sections: {
      summary: !!(p.summary && p.summary.length > 10),
      skills: skills.length > 0,
      projects: projects.length > 0,
      experience: experience.length > 0,
      education: education.length > 0
    },
    raw: data
  };
};

// Embedding helper
const getEmbeddings = async (text) => {
  try {
    if (!text || typeof text !== 'string' || text.trim().length === 0) return null;
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey.includes('your_') || apiKey.length < 10) return null;
    
    const openai = new OpenAI({ apiKey });
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text.slice(0, 8000), // OpenAI limit
    });
    return response.data[0].embedding;
  } catch (e) {
    console.error("Embedding error:", e);
    return null;
  }
};

const dotProduct = (a, b) => a.reduce((sum, val, i) => sum + val * b[i], 0);
const magnitude = (arr) => Math.sqrt(arr.reduce((sum, val) => sum + val * val, 0));

export const cosineSimilarity = (vecA, vecB) => {
  const magA = magnitude(vecA);
  const magB = magnitude(vecB);
  if (magA === 0 || magB === 0) return 0;
  return dotProduct(vecA, vecB) / (magA * magB);
};

// Helper for TF-IDF Keyword Match (Step 2)
const calculateKeywordScore = (resumeText, jdText) => {
  const resumeTokens = cleanAndLemmatize(resumeText).split(' ').filter(t => t.length > 1);
  const jdTokes = cleanAndLemmatize(jdText).split(' ').filter(w => w.length > 3 || SKILL_DB.includes(w));
  const uniqueJdKeywords = [...new Set(jdTokes)];
  
  if (uniqueJdKeywords.length === 0 || resumeTokens.length === 0) return 0;
  
  const tfidf = new natural.TfIdf();
  tfidf.addDocument(resumeTokens.join(' '));
  
  const matched = uniqueJdKeywords.filter(kw => {
    // Check if the keyword exists with significant weight or just presence
    return resumeTokens.includes(kw);
  });

  return (matched.length / uniqueJdKeywords.length) * 100;
};

// Role-Based Technical Skill Matching (Step 3)
const calculateSkillScore = (userSkills, jdText, targetRole) => {
  const jdTextLower = (jdText || '').toLowerCase();
  
  // 1. Determine Required Skills (Target Role vs JD Extraction)
  let requiredSkills = [];
  
  // If targetRole is provided and exists in mapping, use those first
  if (targetRole && ROLE_SKILLS[targetRole]) {
    requiredSkills = ROLE_SKILLS[targetRole];
  } else if (jdTextLower.length > 20) {
    // Otherwise, extract from JD
    requiredSkills = SKILL_DB.filter(skill => {
      const reg = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      return reg.test(jdTextLower);
    });
  }
  
  if (requiredSkills.length === 0) {
    // Fallback: If no role or JD detected, give breadth points for having *any* valid skills
    return (userSkills.length > 0 && jdTextLower.length < 20) ? Math.min((userSkills.length / 5) * 100, 100) : 0;
  }

  const userSkillsNormalized = userSkills.map(s => normalizeSkill(s));
  const matchedSkills = [];
  const missingSkills = [];

  requiredSkills.forEach(req => {
    const normReq = normalizeSkill(req);
    if (userSkillsNormalized.includes(normReq)) {
      matchedSkills.push(req);
    } else {
      missingSkills.push(req);
    }
  });
  
  const score = (matchedSkills.length / requiredSkills.length) * 100;

  return { 
    score, 
    matched: matchedSkills, 
    missing: missingSkills 
  };
};

// NEW Advanced ATS Scoring Engine
export const calculateATSScore = async (resumeDataRaw, jobDescriptionRaw, explicitRole) => {
  const aggregated = aggregateResumeData(resumeDataRaw);
  const targetRole = explicitRole || aggregated.name ? aggregated.raw?.profile?.targetRole : null;
  const resumeText = aggregated.contentText; // Use content only, skip name/targetRole for keyword match
  const jdText = (jobDescriptionRaw || '').toLowerCase();
  
  // Content Penalty for nearly empty resumes
  const contentPenalty = resumeText.length < 200 ? (resumeText.length / 200) : 1;

  // STEP 2: Job Keyword Alignment
  const keywordScore = calculateKeywordScore(resumeText, jobDescriptionRaw || '');

  // STEP 3: Role-Based Technical Skill Match
  const skillResults = calculateSkillScore(aggregated.skills, jobDescriptionRaw, targetRole);
  const skillScore = typeof skillResults === 'number' ? skillResults : (skillResults.score || 0);
  const missingSkills = skillResults.missing || [];

  // STEP 4: Semantic Similarity (Embeddings)
  let semanticScore = 0;
  const resumeEmb = await getEmbeddings(resumeText);
  const jdEmb = await getEmbeddings(jobDescriptionRaw);
  
  if (resumeEmb && jdEmb) {
    semanticScore = cosineSimilarity(resumeEmb, jdEmb) * 100;
  } else {
    // Fallback to TF-IDF Cosine Similarity
    const tfidf = new natural.TfIdf();
    tfidf.addDocument(cleanAndLemmatize(resumeText));
    tfidf.addDocument(cleanAndLemmatize(jobDescriptionRaw));
    
    const terms = new Set();
    const vec1 = {};
    const vec2 = {};
    tfidf.listTerms(0).forEach(item => { terms.add(item.term); vec1[item.term] = item.tfidf; });
    tfidf.listTerms(1).forEach(item => { terms.add(item.term); vec2[item.term] = item.tfidf; });
    
    let dot = 0, m1 = 0, m2 = 0;
    terms.forEach(t => {
      const v1 = vec1[t] || 0, v2 = vec2[t] || 0;
      dot += v1 * v2; m1 += v1 * v1; m2 += v2 * v2;
    });
    if (m1 > 0 && m2 > 0) semanticScore = (dot / (Math.sqrt(m1) * Math.sqrt(m2))) * 100;
  }

  // STEP 5: Experience Alignment
  const expMatchJD = jdText.match(/(\d+)\+?\s*years?(?:\s+of)?\s+experience/);
  const reqYears = expMatchJD ? parseInt(expMatchJD[1]) : 0;
  
  let totalResumeYears = 0;
  const rawExperience = aggregated.raw?.experience || [];
  rawExperience.forEach(exp => {
    const start = exp.duration?.match(/(20\d{2})/);
    const end = exp.duration?.match(/[-–to]+\s*(20\d{2}|present|now|current)/i);
    if (start) {
      const sY = parseInt(start[1]);
      let eY = new Date().getFullYear();
      if (end && !/present|now|current/i.test(end[1])) eY = parseInt(end[1]);
      totalResumeYears += Math.max(0, eY - sY);
    }
  });

  let experienceScore = 0;
  const hasExpSection = aggregated.sections.experience;
  
  if (reqYears === 0) {
    experienceScore = (totalResumeYears > 0 && hasExpSection) ? 100 : (hasExpSection ? 50 : 0);
  } else {
    experienceScore = hasExpSection ? Math.min(totalResumeYears / reqYears, 1) * 100 : 0;
  }
  if (!hasExpSection || (totalResumeYears === 0 && reqYears > 0)) experienceScore = 0;

  // STEP 6: Resume Structure Quality
  let structureScore = 0;
  const sections = aggregated.sections;
  if (sections.summary) structureScore += 20;
  if (sections.skills) structureScore += 20;
  if (sections.projects) structureScore += 20;
  if (sections.experience) structureScore += 20;
  if (sections.education) structureScore += 20;

  // STEP 7: Final ATS Score Calculation (Weighted)
  // Keyword Alignment = 30%
  // Technical Skill Match = 25%
  // Semantic Similarity = 20%
  // Experience Alignment = 15%
  // Resume Structure = 10%
  
  const finalATSScore = Math.round(
    (0.30 * (keywordScore || 0) +
     0.25 * (skillScore || 0) +
     0.20 * (semanticScore || 0) +
     0.15 * (experienceScore || 0) +
     0.10 * (structureScore || 0)) * contentPenalty
  );

  // STEP 9: Improvement Suggestions
  const suggestions = [];
  
  // Use JD-extracted missing skills if no role-based ones found
  const jdMissingSkills = missingSkills.length > 0 ? missingSkills : SKILL_DB.filter(s => jdText.includes(s.toLowerCase()) && !aggregated.skills.map(us => us.toLowerCase()).includes(s.toLowerCase()));

  if (keywordScore < 50 && jdText.length > 50) suggestions.push("Low Keyword Alignment: Identify top terms in JD and integrate them naturally.");
  if (skillScore < 50) suggestions.push(`Low Skill Match: Consider adding missing technical skills: ${jdMissingSkills.slice(0, 3).join(', ')}`);
  if (semanticScore < 50) suggestions.push("Low Semantic Similarity: Rewrite project/experience descriptions to better align with the core themes of the job description.");
  if (experienceScore < 70) suggestions.push("Experience Gap: Highlight transferable skills or specific tools that match the years of expertise required.");
  if (structureScore < 100) {
    const missing = [];
    if (!sections.summary) missing.push("Summary");
    if (!sections.projects) missing.push("Projects");
    if (!sections.experience) missing.push("Experience");
    suggestions.push(`Structure Quality: Add missing sections: ${missing.join(', ')}`);
  }

  return {
    atsScore: finalATSScore || 0,
    keywordScore: Math.round(keywordScore) || 0,
    skillScore: Math.round(skillScore) || 0,
    semanticScore: Math.round(semanticScore) || 0,
    experienceScore: Math.round(experienceScore) || 0,
    structureScore: Math.round(structureScore) || 0,
    suggestions,
    missingSkills: jdMissingSkills
  };
};
