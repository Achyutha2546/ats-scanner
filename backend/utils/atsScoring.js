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

import { spawnSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// NEW Advanced ATS Scoring Engine (Integrated with Python)
export const calculateATSScore = async (resumeDataRaw, jobDescriptionRaw, explicitRole) => {
    const aggregated = aggregateResumeData(resumeDataRaw);
    const targetRole = explicitRole || (aggregated.raw?.profile?.targetRole || "");
    const resumeText = aggregated.contentText;
    const jdText = jobDescriptionRaw || "";
    
    // Prepare input for Python script
    const pythonInput = {
        resume_text: resumeText,
        job_description: jdText,
        skills: aggregated.skills || [],
        projects_text: aggregated.projectDescriptions || "",
        experience_text: aggregated.experienceDescriptions || "",
        target_role: targetRole
    };

    try {
        const pythonScriptPath = path.join(__dirname, '..', '..', 'ats_engine', 'scoring.py');
        const pythonProcess = spawnSync('python', [pythonScriptPath, JSON.stringify(pythonInput)]);
        
        if (pythonProcess.error) {
            console.error('Python child process error:', pythonProcess.error);
            throw new Error('Failed to run ATS engine');
        }

        const stdout = pythonProcess.stdout.toString();
        const stderr = pythonProcess.stderr.toString();

        if (stderr && !stdout) {
            console.error('Python stderr:', stderr);
            throw new Error(`ATS Engine Error: ${stderr}`);
        }

        const result = JSON.parse(stdout);
        
        // Map Python results to expected frontend schema if necessary
        // The requested fields are:
        // { score, keyword_score, semantic_score, skill_score, evidence_score, matched_skills, missing_skills, suggestions, role_ranking }
        
        return {
            atsScore: result.score || 0,
            score: result.score || 0, // Frontend might use 'score' or 'atsScore'
            keywordScore: result.keyword_score || 0,
            keyword_score: result.keyword_score || 0,
            semanticScore: result.semantic_score || 0,
            semantic_score: result.semantic_score || 0,
            skillScore: result.skill_score || 0,
            skill_score: result.skill_score || 0,
            evidenceScore: result.evidence_score || 0,
            evidence_score: result.evidence_score || 0,
            matchedSkills: result.matched_skills || [],
            matched_skills: result.matched_skills || [],
            missingSkills: result.missing_skills || [],
            missing_skills: result.missing_skills || [],
            suggestions: result.suggestions || [],
            roleRanking: result.role_ranking || [],
            role_ranking: result.role_ranking || []
        };
    } catch (error) {
        console.error('Error in ATS scoring integration:', error);
        return {
            atsScore: 0,
            score: 0,
            keyword_score: 0,
            semantic_score: 0,
            skill_score: 0,
            evidence_score: 0,
            matched_skills: [],
            missing_skills: [],
            suggestions: ["Error calculating score. Please try again later."],
            role_ranking: []
        };
    }
};

