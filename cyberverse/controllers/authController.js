const User = require('../models/User');
const Leaderboard = require('../models/Leaderboard');
const { generateToken } = require('../utils/jwt');
const { sendSuccess, sendError } = require('../utils/response');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { username, email, password, college_name } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return sendError(res, 409, existingUser.email === email ? 'Email already in use' : 'Username already taken');
    }

    const user = await User.create({ username, email, password, college_name });

    // Initialize leaderboard entry
    await Leaderboard.create({
      user_id: user._id,
      username: user.username,
      college_name: user.college_name,
    });

    const token = generateToken(user._id);

    return sendSuccess(res, 201, `Welcome to OPENLABS, ${user.username}!`, {
      token,
      user: { id: user._id, username: user.username, college_name: user.college_name, role: user.role },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return sendError(res, 401, 'Invalid email or password');
    }

    if (!user.isActive) {
      return sendError(res, 403, 'Your account has been deactivated');
    }

    const token = generateToken(user._id);

    return sendSuccess(res, 200, `Hi ${user.username}`, {
      token,
      user: { id: user._id, username: user.username, college_name: user.college_name, role: user.role },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('completedChallenges', 'title points difficulty');

    return sendSuccess(res, 200, 'Profile fetched', { user });
  } catch (error) {
    next(error);
  }
};
