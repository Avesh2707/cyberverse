const User = require('../models/User.model');
const Domain = require('../models/Domain.model');
const Leaderboard = require('../models/Leaderboard.model');
const { asyncHandler } = require('../middleware/error.middleware');

/**
 * @desc    Get user dashboard
 * @route   GET /api/dashboard
 * @access  Private
 */
const getDashboard = asyncHandler(async (req, res) => {
  const [user, domains, leaderboardEntry] = await Promise.all([
    User.findById(req.user._id).populate('completedChallenges', 'title points domain_id difficulty'),
    Domain.find({ isActive: true }).sort('order'),
    Leaderboard.findOne({ user_id: req.user._id }),
  ]);

  // Recalculate rank dynamically
  const userRank = await Leaderboard.countDocuments({
    total_points: { $gt: leaderboardEntry?.total_points || 0 },
  });

  res.json({
    success: true,
    message: `Hi ${user.username} 👋`,
    data: {
      user: {
        id: user._id,
        username: user.username,
        college_name: user.college_name,
        avatar: user.avatar,
        bio: user.bio,
        role: user.role,
        badges: user.badges,
        joinedAt: user.createdAt,
        lastLogin: user.lastLogin,
      },
      stats: {
        completedChallenges: user.completedChallenges.length,
        totalPoints: user.totalPoints,
        rank: userRank + 1,
        badgesEarned: user.badges.length,
      },
      domains,
    },
  });
});

module.exports = { getDashboard };
