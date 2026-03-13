import express from 'express';
import jwt from 'jsonwebtoken';
import { OpenAI } from 'openai';
import dotenv from 'dotenv';
import multer from 'multer';
import { parseResumeFile, calculateATSScore } from '../utils/atsScoring.js';
import path from 'path';

dotenv.config();

const router = express.Router();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const upload = multer({ limits: { fileSize: 5 * 1024 * 1024 } });

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid token' });
  }
};

const isValidApiKey = (key) => key && key.length > 10 && !key.includes('your_') && !key.includes('placeholder');

const localRewrite = (input) => {
  if (!input || !input.trim()) {
    return 'Spearheaded the design and development of scalable, high-performance solutions, leveraging modern technologies and industry best practices to deliver measurable business impact.';
  }

  // --- Step 1: Grammar fixes ---
  let text = input.trim();

  // Fix common grammar mistakes: "i " -> "I ", spacing around punctuation
  text = text.replace(/\bi\b/g, 'I');
  text = text.replace(/\s+,/g, ',').replace(/\s+\./g, '.').replace(/,(\S)/g, ', $1');
  text = text.replace(/\s{2,}/g, ' ');
  // Ensure text ends with a period if it doesn't end with punctuation
  text = text.replace(/([a-zA-Z0-9])\s*$/, '$1.');

  // --- Step 2: Split into sentences and process each ---
  const sentenceRaw = text.split(/(?<=[.!?])\s+/);
  const sentences = sentenceRaw.map(s => s.trim()).filter(Boolean);

  // Weak verb -> strong professional verb replacements
  const verbMap = {
    'made': 'developed', 'make': 'developed', 'did': 'executed', 'do': 'executed',
    'worked on': 'engineered', 'worked': 'collaborated on',
    'helped': 'contributed to', 'help': 'support',
    'used': 'leveraged', 'use': 'utilized',
    'wrote': 'authored', 'write': 'authored',
    'fixed': 'resolved', 'fix': 'resolved',
    'changed': 'optimized', 'change': 'optimized',
    'added': 'implemented', 'add': 'integrated',
    'tested': 'validated', 'test': 'validated',
    'set up': 'configured', 'setup': 'configured',
    'looked into': 'analyzed', 'look into': 'investigated',
    'got': 'achieved', 'get': 'achieved',
    'shown': 'demonstrated', 'show': 'demonstrated',
    'run': 'executed', 'ran': 'executed',
    'started': 'initiated', 'start': 'initiated',
    'handled': 'managed', 'handle': 'managed',
    'built': 'engineered', 'build': 'architected',
    'tried': 'explored', 'try': 'explored',
    'learned': 'acquired expertise in', 'learn': 'acquired expertise in',
    'know': 'proficient in', 'knew': 'proficient in',
  };

  // Strong action verbs to start sentences with
  const actionVerbs = [
    'Engineered', 'Developed', 'Architected', 'Implemented', 'Designed',
    'Optimized', 'Spearheaded', 'Delivered', 'Orchestrated', 'Streamlined',
    'Led', 'Managed', 'Leveraged', 'Automated', 'Integrated',
    'Deployed', 'Configured', 'Maintained', 'Established', 'Collaborated on',
  ];

  // Filler words/phrases to remove
  const fillerPhrases = [
    /\bbasically\b/gi, /\bactually\b/gi, /\bjust\b/gi, /\bvery\b/gi,
    /\breally\b/gi, /\bkind of\b/gi, /\bsort of\b/gi,
    /\ba lot\b/gi, /\bstuff\b/gi, /\bthings\b/gi, /\bsome stuff\b/gi,
  ];

  const rewritten = sentences.map((sentence, i) => {
    let s = sentence.trim();

    // Remove filler words
    fillerPhrases.forEach(filler => { s = s.replace(filler, ''); });
    s = s.replace(/\s{2,}/g, ' ').trim();

    // Replace weak verbs (longer phrases first to avoid partial matches)
    const sortedVerbs = Object.entries(verbMap).sort((a, b) => b[0].length - a[0].length);
    sortedVerbs.forEach(([weak, strong]) => {
      const regex = new RegExp(`\\b${weak}\\b`, 'gi');
      s = s.replace(regex, strong);
    });

    // Capitalize first letter
    s = s.charAt(0).toUpperCase() + s.slice(1);

    // If sentence starts with "I ", "My ", "We ", "Our " — remove pronoun & add action verb
    const weakStart = /^(I |My |We |Our |There is |There was )/i.test(s);
    if (weakStart) {
      s = s.replace(/^(I |My |We |Our |There is |There was )/i, '').trim();
      s = s.charAt(0).toUpperCase() + s.slice(1);
      const alreadyStrong = actionVerbs.some(v => s.toLowerCase().startsWith(v.toLowerCase()));
      if (!alreadyStrong) {
        const verb = actionVerbs[i % actionVerbs.length];
        s = `${verb} ${s.charAt(0).toLowerCase() + s.slice(1)}`;
      }
    }

    // Ensure proper ending punctuation
    if (!/[.!?]$/.test(s)) s += '.';

    return s;
  });

  // --- Step 3: Append an impact/outcome phrase to the last sentence ---
  const impactPhrases = [
    'resulting in improved system performance and scalability',
    'enhancing user experience and overall product reliability',
    'driving measurable efficiency gains across the team',
    'ensuring high code quality, maintainability, and robustness',
    'contributing to successful on-time project delivery',
    'enabling seamless cross-functional collaboration and integration',
  ];
  const impact = impactPhrases[Math.floor(Math.random() * impactPhrases.length)];

  const hasImpact = /result|improv|enhanc|achiev|deliver|reduc|increas|optim/i.test(rewritten[rewritten.length - 1] || '');
  if (!hasImpact && rewritten.length > 0) {
    const last = rewritten[rewritten.length - 1];
    rewritten[rewritten.length - 1] = last.replace(/\.$/, `, ${impact}.`);
  }

  return rewritten.join(' ');
};

router.post('/rewrite-description', authMiddleware, async (req, res) => {
  try {
    const { input } = req.body;
    
    if (!isValidApiKey(process.env.OPENAI_API_KEY)) {
      return res.json({ result: localRewrite(input) });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a professional resume writer. Rewrite the following text to sound highly professional, action-oriented, and impactful for a corporate resume. Fix all grammar mistakes, punctuation errors, and spelling issues. Replace weak verbs with strong action verbs. Keep it concise and results-focused. Return only the rewritten text, no explanations." },
        { role: "user", content: input }
      ],
    });
    res.json({ result: response.choices[0].message.content });
  } catch (err) {
    res.json({ result: localRewrite(input) });
  }
});

router.post('/ats-score', authMiddleware, upload.single('resume'), async (req, res) => {
  try {
    let resumeText = '';
    const { jobDescription } = req.body;
    let resumeData = req.body.resumeData;

    if (req.file) {
      resumeText = await parseResumeFile(req.file.buffer, req.file.mimetype);
      // For file uploads, we wrap the text in a simple structure
      resumeData = { profile: { summary: resumeText }, text: resumeText };
    } else if (resumeData) {
      resumeData = typeof resumeData === 'string' ? JSON.parse(resumeData) : resumeData;
    }

    if (!resumeData) {
      return res.status(400).json({ error: 'Missing resume data' });
    }

    const report = await calculateATSScore(resumeData, jobDescription, req.body.targetRole);
    res.json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// STEP 10: Advanced ATS Analysis Endpoint
router.post('/ats/analyze', authMiddleware, async (req, res) => {
  try {
    const { resumeData, jobDescription, targetRole } = req.body;
    
    if (!resumeData) {
      return res.status(400).json({ error: 'UserID or ResumeData missing in request context' });
    }

    const report = await calculateATSScore(resumeData, jobDescription, targetRole);
    res.json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Storage for proofs
const proofStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `proof-${Date.now()}-${file.originalname}`)
});
const proofUpload = multer({ storage: proofStorage });

router.post('/upload-proof', authMiddleware, proofUpload.single('proof'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    
    // Extract text from proof if possible (PDF/Image)
    const fs = (await import('fs')).default;
    const buffer = fs.readFileSync(req.file.path);
    const extractedText = await parseResumeFile(buffer, req.file.mimetype);
    
    res.json({ 
      proofUrl: `/uploads/${req.file.filename}`,
      proofText: extractedText 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
