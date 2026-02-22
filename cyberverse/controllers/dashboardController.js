const User = require('../models/User');
const Domain = require('../models/Domain');
const Leaderboard = require('../models/Leaderboard');
const { sendSuccess, sendError } = require('../utils/response');

// @desc    Get main dashboard
// @route   GET /api/dashboard
// @access  Private
exports.getDashboard = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    // Get user rank from leaderboard
    const leaderboardEntry = await Leaderboard.findOne({ user_id: user._id });

    // Get all active domains
    const domains = await Domain.find({ isActive: true }).select('-__v');

    const stats = {
      completedChallenges: user.completedChallenges.length,
      totalPoints: user.totalPoints,
      rank: leaderboardEntry ? leaderboardEntry.rank : 0,
    };

    return sendSuccess(res, 200, `Hi ${user.username}`, {
      greeting: `Hi ${user.username}`,
      stats,
      domains,
    });
  } catch (error) {
    next(error);
  }
};
