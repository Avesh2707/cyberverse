const Challenge = require('../models/Challenge.model');
const { asyncHandler } = require('../middleware/error.middleware');

/**
 * @desc    Get competitive challenges
 * @route   GET /api/compete
 * @access  Private
 */
const getCompeteChallenges = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 15;
  const skip = (page - 1) * limit;

  const filter = { type: 'compete', isActive: true };
  if (req.query.difficulty) filter.difficulty = req.query.difficulty;

  const [challenges, total] = await Promise.all([
    Challenge.find(filter)
      .select('-flag')
      .skip(skip)
      .limit(limit)
      .populate('domain_id', 'name slug color icon')
      .sort({ points: -1 }),
    Challenge.countDocuments(filter),
  ]);

  const challengesWithStatus = challenges.map((c) => ({
    ...c.toObject(),
    isSolved: c.solvedBy.includes(req.user._id),
  }));

  res.json({
    success: true,
    message: 'Compete mode: Points here affect the public leaderboard!',
    data: challengesWithStatus,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

module.exports = { getCompeteChallenges };
