const Joi = require('joi');

/**
 * Validation schemas
 */
const schemas = {
  register: Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .min(8)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .required()
      .messages({
        'string.pattern.base': 'Password must contain at least one uppercase, one lowercase, and one number',
      }),
    college_name: Joi.string().min(2).max(100).required(),
    role: Joi.string().valid('student').default('student'),
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  flagSubmission: Joi.object({
    challenge_id: Joi.string().hex().length(24).required(),
    submitted_flag: Joi.string().min(1).max(255).required(),
  }),

  challenge: Joi.object({
    title: Joi.string().min(3).max(100).required(),
    description: Joi.string().min(10).required(),
    difficulty: Joi.string().valid('easy', 'medium', 'hard', 'insane').required(),
    points: Joi.number().integer().min(10).required(),
    type: Joi.string().valid('learn', 'practice', 'compete').required(),
    domain_id: Joi.string().hex().length(24).required(),
    flag: Joi.string().required(),
    hints: Joi.array().items(
      Joi.object({ text: Joi.string(), cost: Joi.number().default(0) })
    ),
    tags: Joi.array().items(Joi.string()),
  }),
};

/**
 * Validate middleware factory
 */
const validate = (schemaName) => (req, res, next) => {
  const schema = schemas[schemaName];
  if (!schema) return next();

  const { error, value } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const errors = error.details.map((d) => d.message);
    return res.status(400).json({ success: false, message: 'Validation error', errors });
  }

  req.body = value;
  next();
};

module.exports = { validate };
