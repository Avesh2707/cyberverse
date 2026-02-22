const User = require('../models/User');
const Challenge = require('../models/Challenge');
const Submission = require('../models/Submission');
const Leaderboard = require('../models/Leaderboard');
const { sendSuccess, sendError, getPagination } = require('../utils/response');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Admin
exports.getAdminStats = async (req, res, next) => {
  try {
    const [totalUsers, totalChallenges, totalSubmissions, correctSubmissions] = await Promise.all([
      User.countDocuments(),
      Challenge.countDocuments({ isActive: true }),
      Submission.countDocuments(),
      Submission.countDocuments({ isCorrect: true }),
    ]);

    const recentUsers = await User.find().select('username email college_name createdAt').sort({ createdAt: -1 }).limit(5);

    return sendSuccess(res, 200, 'Admin stats fetched', {
      stats: {
        totalUsers,
        totalChallenges,
        totalSubmissions,
        correctSubmissions,
        successRate: totalSubmissions > 0 ? ((correctSubmissions / totalSubmissions) * 100).toFixed(1) + '%' : '0%',
      },
      recentUsers,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (Admin)
// @route   GET /api/admin/users
// @access  Admin
exports.getAllUsers = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const users = await User.find().select('-password').skip(skip).limit(limit).sort({ createdAt: -1 });
    const total = await User.countDocuments();
    return sendSuccess(res, 200, 'Users fetched', { users, pagination: { total, page, limit } });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle user active status (Admin)
// @route   PATCH /api/admin/users/:id/toggle
// @access  Admin
exports.toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return sendError(res, 404, 'User not found');

    user.isActive = !user.isActive;
    await user.save();

    return sendSuccess(res, 200, `User ${user.isActive ? 'activated' : 'deactivated'}`, {
      user: { id: user._id, username: user.username, isActive: user.isActive },
    });
  } catch (error) {
    next(error);
  }
};
