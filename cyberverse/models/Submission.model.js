const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    challenge_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge', required: true },
    submitted_flag: { type: String, required: true },
    is_correct: { type: Boolean, required: true },
    points_earned: { type: Number, default: 0 },
    time_taken: { type: Number }, // seconds
    attempt_number: { type: Number, default: 1 },
    ip_address: String,
  },
  { timestamps: true }
);

// Compound index to find user's submissions per challenge
submissionSchema.index({ user_id: 1, challenge_id: 1 });

module.exports = mongoose.model('Submission', submissionSchema);
