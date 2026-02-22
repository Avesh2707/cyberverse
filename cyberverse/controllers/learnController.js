const LearningModule = require('../models/LearningModule');
const Domain = require('../models/Domain');
const { sendSuccess, sendError } = require('../utils/response');

// @desc    Get learning modules for a domain
// @route   GET /api/learn/:domain
// @access  Private
exports.getLearnModules = async (req, res, next) => {
  try {
    const domain = await Domain.findOne({ slug: req.params.domain, isActive: true });
    if (!domain) return sendError(res, 404, 'Domain not found');

    const modules = await LearningModule.find({ domain_id: domain._id, isActive: true })
      .sort({ order: 1 })
      .select('-__v');

    return sendSuccess(res, 200, 'Learning modules fetched', {
      domain: { name: domain.name, slug: domain.slug, description: domain.description },
      count: modules.length,
      modules,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single learning module
// @route   GET /api/learn/:domain/:moduleId
// @access  Private
exports.getModuleById = async (req, res, next) => {
  try {
    const module = await LearningModule.findById(req.params.moduleId).populate('domain_id', 'name slug');
    if (!module || !module.isActive) return sendError(res, 404, 'Module not found');

    return sendSuccess(res, 200, 'Module fetched', { module });
  } catch (error) {
    next(error);
  }
};

// @desc    Create learning module (Admin)
// @route   POST /api/admin/modules
// @access  Admin
exports.createModule = async (req, res, next) => {
  try {
    const module = await LearningModule.create(req.body);
    return sendSuccess(res, 201, 'Module created', { module });
  } catch (error) {
    next(error);
  }
};

// @desc    Update learning module (Admin)
// @route   PUT /api/admin/modules/:id
// @access  Admin
exports.updateModule = async (req, res, next) => {
  try {
    const module = await LearningModule.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!module) return sendError(res, 404, 'Module not found');
    return sendSuccess(res, 200, 'Module updated', { module });
  } catch (error) {
    next(error);
  }
};
