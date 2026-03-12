import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  company: { type: String, required: true },
  role: { type: String, required: true },
  duration: { type: String },
  description: { type: String }
});

export default mongoose.model('Experience', experienceSchema);
