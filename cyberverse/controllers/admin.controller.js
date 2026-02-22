const User = require('../models/User.model');
const Domain = require('../models/Domain.model');
const Challenge = require('../models/Challenge.model');
const LearningModule = require('../models/LearningModule.model');
const Submission = require('../models/Submission.model');
const Leaderboard = require('../models/Leaderboard.model');
const { asyncHandler, AppError } = require('../middleware/error.middleware');

// ─── Domain Management ────────────────────────────────────────────────────────

const createDomain = asyncHandler(async (req, res) => {
  const domain = await Domain.create(req.body);
  res.status(201).json({ success: true, data: domain });
});

const updateDomain = asyncHandler(async (req, res) => {
  const domain = await Domain.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!domain) throw new AppError('Domain not found', 404);
  res.json({ success: true, data: domain });
});

const deleteDomain = asyncHandler(async (req, res) => {
  await Domain.findByIdAndUpdate(req.params.id, { isActive: false });
  res.json({ success: true, message: 'Domain deactivated' });
});

// ─── Challenge Management ─────────────────────────────────────────────────────

const createChallenge = asyncHandler(async (req, res) => {
  const challenge = await Challenge.create({ ...req.body, author: req.user._id });
  // Update domain challenge count
  await Domain.findByIdAndUpdate(req.body.domain_id, { $inc: { total_challenges: 1 } });
  res.status(201).json({ success: true, data: challenge });
});

const updateChallenge = asyncHandler(async (req, res) => {
  const challenge = await Challenge.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!challenge) throw new AppError('Challenge not found', 404);
  res.json({ success: true, data: challenge });
});

const deleteChallenge = asyncHandler(async (req, res) => {
  const challenge = await Challenge.findById(req.params.id);
  if (!challenge) throw new AppError('Challenge not found', 404);
  await challenge.updateOne({ isActive: false });
  await Domain.findByIdAndUpdate(challenge.domain_id, { $inc: { total_challenges: -1 } });
  res.json({ success: true, message: 'Challenge deactivated' });
});

// ─── Learning Module Management ───────────────────────────────────────────────

const createModule = asyncHandler(async (req, res) => {
  const module = await LearningModule.create(req.body);
  res.status(201).json({ success: true, data: module });
});

const updateModule = asyncHandler(async (req, res) => {
  const module = await LearningModule.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!module) throw new AppError('Module not found', 404);
  res.json({ success: true, data: module });
});

// ─── User Management ─────────────────────────────────────────────────────────

const getAllUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const users = await User.find()
    .select('-password')
    .skip((page - 1) * limit)
    .limit(limit)
    .sort('-createdAt');
  const total = await User.countDocuments();
  res.json({ success: true, data: users, pagination: { page, limit, total } });
});

const toggleUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new AppError('User not found', 404);
  user.isActive = !user.isActive;
  await user.save();
  res.json({ success: true, message: `User ${user.isActive ? 'activated' : 'deactivated'}`, data: { isActive: user.isActive } });
});

// ─── Platform Stats ───────────────────────────────────────────────────────────

const getPlatformStats = asyncHandler(async (req, res) => {
  const [totalUsers, totalChallenges, totalSubmissions, correctSubmissions, totalDomains] = await Promise.all([
    User.countDocuments(),
    Challenge.countDocuments({ isActive: true }),
    Submission.countDocuments(),
    Submission.countDocuments({ is_correct: true }),
    Domain.countDocuments({ isActive: true }),
  ]);

  res.json({
    success: true,
    data: {
      totalUsers,
      totalChallenges,
      totalDomains,
      totalSubmissions,
      correctSubmissions,
      successRate: totalSubmissions ? ((correctSubmissions / totalSubmissions) * 100).toFixed(1) + '%' : '0%',
    },
  });
});

module.exports = {
  createDomain, updateDomain, deleteDomain,
  createChallenge, updateChallenge, deleteChallenge,
  createModule, updateModule,
  getAllUsers, toggleUserStatus,
  getPlatformStats,
};
