import mongoose from 'mongoose';

const careerRecommendationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recommendedRoles: [{ type: String }],
  skillGapAnalysis: { type: Object },
  generatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('CareerRecommendation', careerRecommendationSchema);
