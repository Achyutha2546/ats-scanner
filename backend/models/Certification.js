import mongoose from 'mongoose';

const certificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  organization: { type: String },
  year: { type: String },
  description: { type: String, required: false },
  proofUrl: { type: String, required: false },
  proofText: { type: String, required: false }
});

export default mongoose.model('Certification', certificationSchema);
