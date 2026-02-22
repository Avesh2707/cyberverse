const Challenge = require('../models/Challenge.model');
const { asyncHandler } = require('../middleware/error.middleware');

/**
 * @desc    Get random practice challenges
 * @route   GET /api/practice
 * @access  Private
 */
const getPracticeChallenges = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const domain = req.query.domain;

  const filter = { type: 'practice', difficulty: 'medium', isActive: true };
  if (domain) filter.domain_id = domain;

  // Exclude already solved challenges
  filter.solvedBy = { $nin: [req.user._id] };

  const challenges = await Challenge.aggregate([
    { $match: filter },
    { $sample: { size: limit } },
    { $project: { flag: 0 } },
  ]);

  res.json({
    success: true,
    message: 'Practice mode: Points earned here won\'t affect the public leaderboard',
    count: challenges.length,
    data: challenges,
  });
});

module.exports = { getPracticeChallenges };
