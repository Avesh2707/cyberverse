const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard', 'insane'],
      required: true,
    },
    points: { type: Number, required: true, min: 10 },
    type: {
      type: String,
      enum: ['learn', 'practice', 'compete'],
      required: true,
    },
    domain_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Domain',
      required: true,
    },
    flag: { type: String, required: true, select: false },
    hints: [{ type: String }],
    attachments: [{ name: String, url: String }],
    solvedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    solveCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

// Text index for search
challengeSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Challenge', challengeSchema);
