import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  company: { type: String, required: true },
  role: { type: String, required: true },
  duration: { type: String },
  description: { type: String, required: false },
  proofUrl: { type: String, required: false },
  proofText: { type: String, required: false }
});

export default mongoose.model('Experience', experienceSchema);
