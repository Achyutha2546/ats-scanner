import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import dns from 'dns';
import authRoutes from './routes/auth.js';
import resumeRoutes from './routes/resume.js';
import aiRoutes from './routes/ai.js';

// Force Google DNS so SRV lookups work for MongoDB Atlas
dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static('uploads'));
app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/ai', aiRoutes);

app.get('/', (req, res) => {
  res.send('AI Resume & Portfolio API is running...');
});

const PORT = process.env.PORT || 5000;
const mongoOptions = {
  serverApi: { version: '1', strict: true, deprecationErrors: true }
};

const connectToMongo = async () => {
  const primaryUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ai-resume-builder';
  const fallbackUri = 'mongodb://127.0.0.1:27017/ai-resume-builder';
  const uris = primaryUri === fallbackUri ? [primaryUri] : [primaryUri, fallbackUri];

  for (const uri of uris) {
    try {
      await mongoose.connect(uri, mongoOptions);
      console.log(`✅ Connected to MongoDB at ${uri}`);
      return;
    } catch (err) {
      console.error(`⚠️ MongoDB connection failed for ${uri}:`, err.message);
    }
  }

  console.warn('⚠️ MongoDB is unavailable. The server will continue running, but database-backed routes may fail until MongoDB is reachable.');
};

connectToMongo().finally(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});
