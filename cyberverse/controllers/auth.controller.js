const User = require('../models/User.model');
const Leaderboard = require('../models/Leaderboard.model');
const { generateToken } = require('../middleware/auth.middleware');
const { asyncHandler, AppError } = require('../middleware/error.middleware');

/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = asyncHandler(async (req, res) => {
  const { username, email, password, college_name, role } = req.body;

  // Check for existing user
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    const field = existingUser.email === email ? 'Email' : 'Username';
    throw new AppError(`${field} is already registered`, 409);
  }

  const user = await User.create({ username, email, password, college_name, role: role || 'student' });

  // Create leaderboard entry
  await Leaderboard.create({
    user_id: user._id,
    username: user.username,
    college_name: user.college_name,
    total_points: 0,
    rank: 0,
  });

  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    message: `Welcome to OPENLABS, ${user.username}! 🚀`,
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      college_name: user.college_name,
      role: user.role,
      totalPoints: user.totalPoints,
    },
  });
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password', 401);
  }

  if (!user.isActive) {
    throw new AppError('Account is deactivated. Contact support.', 403);
  }

  await user.updateLastLogin();

  const token = generateToken(user._id);

  res.json({
    success: true,
    message: `Hi ${user.username} 👋`,
    token,
    user: {
      id: user._id,
      username: user.username,
      college_name: user.college_name,
      role: user.role,
      totalPoints: user.totalPoints,
      rank: user.rank,
    },
  });
});

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('completedChallenges', 'title points domain_id');

  res.json({ success: true, user });
});

/**
 * @desc    Change password
 * @route   PUT /api/auth/change-password
 * @access  Private
 */
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select('+password');

  if (!(await user.comparePassword(currentPassword))) {
    throw new AppError('Current password is incorrect', 401);
  }

  user.password = newPassword;
  await user.save();

  res.json({ success: true, message: 'Password changed successfully' });
});

module.exports = { register, login, getMe, changePassword };
