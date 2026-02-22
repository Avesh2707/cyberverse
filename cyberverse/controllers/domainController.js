const Domain = require('../models/Domain');
const Challenge = require('../models/Challenge');
const { sendSuccess, sendError, getPagination } = require('../utils/response');

// @desc    Get all domains
// @route   GET /api/domains
// @access  Private
exports.getAllDomains = async (req, res, next) => {
  try {
    const domains = await Domain.find({ isActive: true });
    return sendSuccess(res, 200, 'Domains fetched', { count: domains.length, domains });
  } catch (error) {
    next(error);
  }
};

// @desc    Get domain by slug with its challenges
// @route   GET /api/domains/:slug
// @access  Private
exports.getDomainBySlug = async (req, res, next) => {
  try {
    const domain = await Domain.findOne({ slug: req.params.slug, isActive: true });
    if (!domain) return sendError(res, 404, 'Domain not found');

    const { page, limit, skip } = getPagination(req.query);
    const { difficulty, type, search } = req.query;

    const filter = { domain_id: domain._id, isActive: true };
    if (difficulty) filter.difficulty = difficulty;
    if (type) filter.type = type;
    if (search) filter.$text = { $search: search };

    const challenges = await Challenge.find(filter)
      .select('-flag')
      .populate('domain_id', 'name slug')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Challenge.countDocuments(filter);

    return sendSuccess(res, 200, 'Domain fetched', {
      domain,
      challenges,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create domain (Admin)
// @route   POST /api/domains
// @access  Admin
exports.createDomain = async (req, res, next) => {
  try {
    const domain = await Domain.create(req.body);
    return sendSuccess(res, 201, 'Domain created', { domain });
  } catch (error) {
    next(error);
  }
};

// @desc    Update domain (Admin)
// @route   PUT /api/domains/:id
// @access  Admin
exports.updateDomain = async (req, res, next) => {
  try {
    const domain = await Domain.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!domain) return sendError(res, 404, 'Domain not found');
    return sendSuccess(res, 200, 'Domain updated', { domain });
  } catch (error) {
    next(error);
  }
};
