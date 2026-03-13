import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String },
  email: { type: String },
  phone: { type: String },
  location: { type: String },
  website: { type: String },
  dob: { type: String },
  targetRole: { type: String },
  summary: { type: String },
  skills: [{ type: String }],
  linkedin: { type: String },
  github: { type: String },
  portfolioLink: { type: String }
});

export default mongoose.model('Profile', profileSchema);
