const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    challenge_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Challenge',
      required: true,
    },
    submitted_flag: { type: String, required: true },
    isCorrect: { type: Boolean, required: true },
    points_awarded: { type: Number, default: 0 },
    time_taken_seconds: { type: Number, default: 0 },
    ip_address: { type: String },
  },
  { timestamps: true }
);

// Compound index to check duplicate correct submissions
submissionSchema.index({ user_id: 1, challenge_id: 1 });

module.exports = mongoose.model('Submission', submissionSchema);
