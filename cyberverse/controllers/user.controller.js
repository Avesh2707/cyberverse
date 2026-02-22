const User = require('../models/User.model');
const Submission = require('../models/Submission.model');
const Leaderboard = require('../models/Leaderboard.model');
const { asyncHandler, AppError } = require('../middleware/error.middleware');

/**
 * @desc    Get user profile by username
 * @route   GET /api/users/:username
 * @access  Private
 */
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findOne({ username: req.params.username }).select(
    '-password -email'
  );
  if (!user || !user.isActive) throw new AppError('User not found', 404);

  const leaderboardEntry = await Leaderboard.findOne({ user_id: user._id });
  const recentSubmissions = await Submission.find({ user_id: user._id, is_correct: true })
    .sort('-createdAt')
    .limit(10)
    .populate('challenge_id', 'title difficulty points');

  res.json({
    success: true,
    data: {
      user: { ...user.toObject(), rank: leaderboardEntry?.rank },
      recentActivity: recentSubmissions,
    },
  });
});

/**
 * @desc    Update own profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
const updateProfile = asyncHandler(async (req, res) => {
  const allowedFields = ['bio', 'avatar', 'college_name'];
  const updates = {};
  allowedFields.forEach((field) => { if (req.body[field] !== undefined) updates[field] = req.body[field]; });

  const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
  res.json({ success: true, data: user });
});

/**
 * @desc    Get user submission history
 * @route   GET /api/users/submissions
 * @access  Private
 */
const getMySubmissions = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;

  const submissions = await Submission.find({ user_id: req.user._id })
    .sort('-createdAt')
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('challenge_id', 'title difficulty points domain_id');

  const total = await Submission.countDocuments({ user_id: req.user._id });

  res.json({
    success: true,
    data: submissions,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

/**
 * @desc    Generate certificate for completed domain
 * @route   GET /api/users/certificate/:domain_slug
 * @access  Private
 */
const generateCertificate = asyncHandler(async (req, res) => {
  const Domain = require('../models/Domain.model');
  const Challenge = require('../models/Challenge.model');

  const domain = await Domain.findOne({ slug: req.params.domain_slug });
  if (!domain) throw new AppError('Domain not found', 404);

  const totalChallenges = await Challenge.countDocuments({ domain_id: domain._id, isActive: true });
  const solvedChallenges = await Challenge.countDocuments({
    domain_id: domain._id,
    solvedBy: req.user._id,
  });

  const completionPercentage = Math.round((solvedChallenges / totalChallenges) * 100);

  if (completionPercentage < 80) {
    throw new AppError(`You need to complete at least 80% of ${domain.name} challenges to earn a certificate. Current: ${completionPercentage}%`, 400);
  }

  const certificate = {
    id: `CV-${req.user._id.toString().slice(-6).toUpperCase()}-${domain.slug.toUpperCase()}`,
    recipient: req.user.username,
    college: req.user.college_name,
    domain: domain.name,
    completion_percentage: completionPercentage,
    challenges_solved: solvedChallenges,
    total_challenges: totalChallenges,
    issued_at: new Date().toISOString(),
    platform: 'OPENLABS',
    verify_url: `https://OPENLABS.io/verify/CV-${req.user._id.toString().slice(-6).toUpperCase()}-${domain.slug.toUpperCase()}`,
  };

  res.json({ success: true, data: certificate });
});

module.exports = { getUserProfile, updateProfile, getMySubmissions, generateCertificate };
