const mongoose = require('mongoose');

const leaderboardSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    username: { type: String, required: true },
    college_name: String,
    total_points: { type: Number, default: 0 },
    rank: { type: Number, default: 0 },
    challenges_solved: { type: Number, default: 0 },
    last_submission: Date,
  },
  { timestamps: true }
);

leaderboardSchema.index({ total_points: -1 });

// Static method to recalculate all ranks
leaderboardSchema.statics.recalculateRanks = async function () {
  const entries = await this.find().sort({ total_points: -1 });
  const updates = entries.map((entry, index) =>
    this.updateOne({ _id: entry._id }, { $set: { rank: index + 1 } })
  );
  await Promise.all(updates);
};

module.exports = mongoose.model('Leaderboard', leaderboardSchema);
