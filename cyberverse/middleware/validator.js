const { body, param, query, validationResult } = require('express-validator');

// Handle validation errors
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

// Auth validators
exports.registerValidator = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be 3–30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain uppercase, lowercase, and a number'),
  body('college_name').trim().notEmpty().withMessage('College name is required'),
];

exports.loginValidator = [
  body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

// Flag submission validator
exports.flagValidator = [
  body('challenge_id').isMongoId().withMessage('Invalid challenge ID'),
  body('submitted_flag').trim().notEmpty().withMessage('Flag cannot be empty'),
];

// Challenge validator (admin)
exports.challengeValidator = [
  body('title').trim().isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('difficulty').isIn(['easy', 'medium', 'hard', 'insane']).withMessage('Invalid difficulty'),
  body('points').isInt({ min: 10 }).withMessage('Points must be at least 10'),
  body('type').isIn(['learn', 'practice', 'compete']).withMessage('Invalid challenge type'),
  body('domain_id').isMongoId().withMessage('Invalid domain ID'),
  body('flag').trim().notEmpty().withMessage('Flag is required'),
];
