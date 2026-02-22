const Leaderboard = require('../models/Leaderboard.model');
const { asyncHandler } = require('../middleware/error.middleware');

/**
 * @desc    Get global leaderboard
 * @route   GET /api/leaderboard
 * @access  Private
 */
const getLeaderboard = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const skip = (page - 1) * limit;

  const [entries, total] = await Promise.all([
    Leaderboard.find().sort({ total_points: -1 }).skip(skip).limit(limit),
    Leaderboard.countDocuments(),
  ]);

  // Attach rank numbers
  const ranked = entries.map((entry, index) => ({
    ...entry.toObject(),
    rank: skip + index + 1,
    isCurrentUser: entry.user_id.toString() === req.user._id.toString(),
  }));

  // Get current user's position
  const userEntry = await Leaderboard.findOne({ user_id: req.user._id });
  const userRank = userEntry
    ? await Leaderboard.countDocuments({ total_points: { $gt: userEntry.total_points } }) + 1
    : null;

  res.json({
    success: true,
    data: {
      leaderboard: ranked,
      currentUser: userEntry ? { ...userEntry.toObject(), rank: userRank } : null,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    },
  });
});

module.exports = { getLeaderboard };
