const Domain = require('../models/Domain.model');
const Challenge = require('../models/Challenge.model');
const { asyncHandler, AppError } = require('../middleware/error.middleware');

/**
 * @desc    Get all domains
 * @route   GET /api/domains
 * @access  Private
 */
const getAllDomains = asyncHandler(async (req, res) => {
  const domains = await Domain.find({ isActive: true }).sort('order');

  // Append solve count per domain for the current user
  const domainData = await Promise.all(
    domains.map(async (domain) => {
      const totalChallenges = await Challenge.countDocuments({ domain_id: domain._id, isActive: true });
      const solvedCount = await Challenge.countDocuments({
        domain_id: domain._id,
        solvedBy: req.user._id,
      });
      return { ...domain.toObject(), total_challenges: totalChallenges, user_solved: solvedCount };
    })
  );

  res.json({ success: true, count: domains.length, data: domainData });
});

/**
 * @desc    Get single domain with challenges
 * @route   GET /api/domains/:slug
 * @access  Private
 */
const getDomainBySlug = asyncHandler(async (req, res) => {
  const domain = await Domain.findOne({ slug: req.params.slug, isActive: true });
  if (!domain) throw new AppError('Domain not found', 404);

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const filter = { domain_id: domain._id, isActive: true };
  if (req.query.difficulty) filter.difficulty = req.query.difficulty;
  if (req.query.type) filter.type = req.query.type;
  if (req.query.search) filter.title = { $regex: req.query.search, $options: 'i' };

  const [challenges, total] = await Promise.all([
    Challenge.find(filter).select('-flag').skip(skip).limit(limit).sort({ points: 1 }),
    Challenge.countDocuments(filter),
  ]);

  // Mark solved challenges for current user
  const challengesWithStatus = challenges.map((c) => ({
    ...c.toObject(),
    isSolved: c.solvedBy.includes(req.user._id),
  }));

  res.json({
    success: true,
    data: {
      domain,
      challenges: challengesWithStatus,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    },
  });
});

module.exports = { getAllDomains, getDomainBySlug };
