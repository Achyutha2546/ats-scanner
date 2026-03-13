import mongoose from 'mongoose';

const educationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  degree: { type: String, required: true },
  institution: { type: String, required: true },
  year: { type: String, required: true },
  cgpa: { type: String, required: false },
  proofUrl: { type: String, required: false },
  proofText: { type: String, required: false }
});

export default mongoose.model('Education', educationSchema);
