import express from 'express';
import jwt from 'jsonwebtoken';
import Profile from '../models/Profile.js';
import Education from '../models/Education.js';
import Experience from '../models/Experience.js';
import Project from '../models/Project.js';

const router = express.Router();

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied' });
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid token' });
  }
};

router.post('/save', authMiddleware, async (req, res) => {
  try {
    const { profile, education, experience, projects } = req.body;
    const userId = req.user.userId;

    let userProfile = await Profile.findOne({ userId });
    if (!userProfile) userProfile = new Profile({ ...profile, userId });
    else Object.assign(userProfile, profile);
    await userProfile.save();

    await Education.deleteMany({ userId });
    const validEducation = education?.filter(e => e.degree && e.institution) || [];
    if (validEducation.length) {
      const edocs = validEducation.map(e => ({ ...e, userId }));
      await Education.insertMany(edocs);
    }

    await Experience.deleteMany({ userId });
    const validExperience = experience?.filter(e => e.company && e.role) || [];
    if (validExperience.length) {
      const exdocs = validExperience.map(e => ({ ...e, userId }));
      await Experience.insertMany(exdocs);
    }

    await Project.deleteMany({ userId });
    const validProjects = projects?.filter(p => p.title) || [];
    if (validProjects.length) {
      const pdocs = validProjects.map(p => ({ ...p, userId }));
      await Project.insertMany(pdocs);
    }

    res.json({ message: 'Resume saved successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/data', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const profile = await Profile.findOne({ userId });
    const education = await Education.find({ userId });
    const experience = await Experience.find({ userId });
    const projects = await Project.find({ userId });
    
    res.json({ profile, education, experience, projects });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
