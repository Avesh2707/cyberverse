const Challenge = require('../models/Challenge');
const Domain = require('../models/Domain');
const { sendSuccess, sendError, getPagination } = require('../utils/response');

// @desc    Get practice challenges (random, medium difficulty)
// @route   GET /api/practice
// @access  Private
exports.getPracticeChallenges = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;
    const count = Math.min(parseInt(limit), 20);

    const challenges = await Challenge.aggregate([
      { $match: { type: 'practice', difficulty: { $in: ['easy', 'medium'] }, isActive: true } },
      { $sample: { size: count } },
      { $project: { flag: 0 } },
    ]);

    // Populate domain info
    await Challenge.populate(challenges, { path: 'domain_id', select: 'name slug icon' });

    return sendSuccess(res, 200, 'Practice challenges fetched', {
      count: challenges.length,
      challenges,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get compete challenges (advanced only)
// @route   GET /api/compete
// @access  Private
exports.getCompeteChallenges = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);

    const challenges = await Challenge.find({
      type: 'compete',
      difficulty: { $in: ['hard', 'insane'] },
      isActive: true,
    })
      .select('-flag')
      .populate('domain_id', 'name slug icon')
      .skip(skip)
      .limit(limit)
      .sort({ points: -1 });

    const total = await Challenge.countDocuments({ type: 'compete', difficulty: { $in: ['hard', 'insane'] }, isActive: true });

    return sendSuccess(res, 200, 'Compete challenges fetched', {
      challenges,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single challenge
// @route   GET /api/challenges/:id
// @access  Private
exports.getChallengeById = async (req, res, next) => {
  try {
    const challenge = await Challenge.findById(req.params.id)
      .select('-flag')
      .populate('domain_id', 'name slug');

    if (!challenge || !challenge.isActive) return sendError(res, 404, 'Challenge not found');

    // Check if current user has already solved it
    const solved = challenge.solvedBy.includes(req.user._id);

    return sendSuccess(res, 200, 'Challenge fetched', { challenge: { ...challenge.toObject(), solved } });
  } catch (error) {
    next(error);
  }
};

// @desc    Create challenge (Admin)
// @route   POST /api/admin/challenges
// @access  Admin
exports.createChallenge = async (req, res, next) => {
  try {
    const domain = await Domain.findById(req.body.domain_id);
    if (!domain) return sendError(res, 404, 'Domain not found');

    const challenge = await Challenge.create({ ...req.body, author: req.user._id });

    // Increment domain challenge count
    await Domain.findByIdAndUpdate(domain._id, { $inc: { total_challenges: 1 } });

    return sendSuccess(res, 201, 'Challenge created', { challenge: { ...challenge.toObject(), flag: undefined } });
  } catch (error) {
    next(error);
  }
};

// @desc    Update challenge (Admin)
// @route   PUT /api/admin/challenges/:id
// @access  Admin
exports.updateChallenge = async (req, res, next) => {
  try {
    const challenge = await Challenge.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!challenge) return sendError(res, 404, 'Challenge not found');
    return sendSuccess(res, 200, 'Challenge updated', { challenge });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete challenge (Admin)
// @route   DELETE /api/admin/challenges/:id
// @access  Admin
exports.deleteChallenge = async (req, res, next) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) return sendError(res, 404, 'Challenge not found');

    challenge.isActive = false;
    await challenge.save();

    await Domain.findByIdAndUpdate(challenge.domain_id, { $inc: { total_challenges: -1 } });

    return sendSuccess(res, 200, 'Challenge removed');
  } catch (error) {
    next(error);
  }
};

// @desc    Search challenges
// @route   GET /api/challenges/search
// @access  Private
exports.searchChallenges = async (req, res, next) => {
  try {
    const { q, difficulty, type, domain } = req.query;
    if (!q) return sendError(res, 400, 'Search query is required');

    const filter = { isActive: true, $text: { $search: q } };
    if (difficulty) filter.difficulty = difficulty;
    if (type) filter.type = type;

    const challenges = await Challenge.find(filter)
      .select('-flag')
      .populate('domain_id', 'name slug icon')
      .limit(20);

    return sendSuccess(res, 200, 'Search results', { count: challenges.length, challenges });
  } catch (error) {
    next(error);
  }
};
