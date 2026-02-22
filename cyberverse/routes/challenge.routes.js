const express = require('express');
const router = express.Router();
const Challenge = require('../models/Challenge.model');
const { protect } = require('../middleware/auth.middleware');
const { asyncHandler, AppError } = require('../middleware/error.middleware');

// Get single challenge
router.get('/:id', protect, asyncHandler(async (req, res) => {
  const challenge = await Challenge.findById(req.params.id)
    .select('-flag')
    .populate('domain_id', 'name slug');
  if (!challenge || !challenge.isActive) throw new AppError('Challenge not found', 404);
  res.json({ success: true, data: { ...challenge.toObject(), isSolved: challenge.solvedBy.includes(req.user._id) } });
}));

// Search challenges
router.get('/', protect, asyncHandler(async (req, res) => {
  const { search, difficulty, type, domain } = req.query;
  const filter = { isActive: true };
  if (search) filter.title = { $regex: search, $options: 'i' };
  if (difficulty) filter.difficulty = difficulty;
  if (type) filter.type = type;
  if (domain) filter.domain_id = domain;

  const challenges = await Challenge.find(filter).select('-flag').populate('domain_id', 'name slug').limit(50);
  res.json({ success: true, count: challenges.length, data: challenges });
}));

module.exports = router;
