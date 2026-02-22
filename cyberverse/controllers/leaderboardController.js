const Leaderboard = require('../models/Leaderboard');
const { sendSuccess, sendError, getPagination } = require('../utils/response');

// @desc    Get global leaderboard
// @route   GET /api/leaderboard
// @access  Private
exports.getLeaderboard = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);

    const leaderboard = await Leaderboard.find()
      .sort({ total_points: -1 })
      .skip(skip)
      .limit(limit)
      .select('-__v');

    const total = await Leaderboard.countDocuments();

    // Get requesting user's position
    const myEntry = await Leaderboard.findOne({ user_id: req.user._id });

    return sendSuccess(res, 200, 'Leaderboard fetched', {
      leaderboard,
      my_rank: myEntry ? myEntry.rank : null,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};
