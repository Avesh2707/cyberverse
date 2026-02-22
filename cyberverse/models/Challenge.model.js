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
    domain_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Domain', required: true },
    flag: { type: String, required: true, select: false },
    hints: [
      {
        text: String,
        cost: { type: Number, default: 0 }, // points deducted for using hint
      },
    ],
    files: [{ name: String, url: String }],
    tags: [String],
    solvedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    solveCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    labUrl: String, // optional embedded lab
  },
  { timestamps: true }
);

// Index for performance
challengeSchema.index({ domain_id: 1, difficulty: 1, type: 1 });

module.exports = mongoose.model('Challenge', challengeSchema);
