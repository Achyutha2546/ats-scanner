import mongoose from 'mongoose';

const atsReportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  resumeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' },
  atsScore: { type: Number, required: true },
  keywordScore: { type: Number },
  structureScore: { type: Number },
  formatScore: { type: Number },
  contentScore: { type: Number },
  suggestions: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('ATSReport', atsReportSchema);
