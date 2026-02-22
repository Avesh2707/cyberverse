const mongoose = require('mongoose');

const leaderboardSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    username: { type: String, required: true },
    college_name: { type: String },
    total_points: { type: Number, default: 0 },
    challenges_solved: { type: Number, default: 0 },
    rank: { type: Number, default: 0 },
  },
  { timestamps: true }
);

leaderboardSchema.index({ total_points: -1 });

module.exports = mongoose.model('Leaderboard', leaderboardSchema);
