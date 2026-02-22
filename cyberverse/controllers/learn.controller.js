const LearningModule = require('../models/LearningModule.model');
const Domain = require('../models/Domain.model');
const { asyncHandler, AppError } = require('../middleware/error.middleware');

/**
 * @desc    Get learning modules for a domain
 * @route   GET /api/learn/:domain
 * @access  Private
 */
const getLearnModules = asyncHandler(async (req, res) => {
  const domain = await Domain.findOne({ slug: req.params.domain, isActive: true });
  if (!domain) throw new AppError('Domain not found', 404);

  const modules = await LearningModule.find({ domain_id: domain._id, isActive: true })
    .sort('order')
    .populate('prerequisites', 'title order');

  res.json({
    success: true,
    data: { domain, modules },
  });
});

/**
 * @desc    Get single learning module
 * @route   GET /api/learn/module/:id
 * @access  Private
 */
const getModuleById = asyncHandler(async (req, res) => {
  const module = await LearningModule.findById(req.params.id)
    .populate('domain_id', 'name slug')
    .populate('prerequisites', 'title order');

  if (!module || !module.isActive) throw new AppError('Module not found', 404);

  res.json({ success: true, data: module });
});

module.exports = { getLearnModules, getModuleById };
