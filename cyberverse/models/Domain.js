const mongoose = require('mongoose');

const domainSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    difficulty_level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    total_challenges: { type: Number, default: 0 },
    image_url: { type: String, default: '' },
    icon: { type: String, default: '🔐' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Domain', domainSchema);
