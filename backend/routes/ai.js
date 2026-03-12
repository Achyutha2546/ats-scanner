import express from 'express';
import jwt from 'jsonwebtoken';
import { OpenAI } from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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

router.post('/rewrite-description', authMiddleware, async (req, res) => {
  try {
    const { input } = req.body;
    if(!process.env.OPENAI_API_KEY) return res.json({ result: `Developed a robust solution implementing modern practices based on: ${input}` });

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "system", content: "Rewrite the following project description to sound highly professional, action-oriented, and impactful for a resume." }, { role: "user", content: input }],
    });
    res.json({ result: response.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/ats-score', authMiddleware, async (req, res) => {
  try {
    const { resumeData, jobDescription } = req.body;
    // Mock algorithm for demonstration
    const score = Math.floor(Math.random() * 40) + 60;
    const report = {
      atsScore: score,
      keywordScore: score - 10,
      structureScore: 90,
      formatScore: 95,
      contentScore: score - 5,
      suggestions: ["Add more keywords matching the job description", "Use stronger action verbs"]
    };
    res.json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
