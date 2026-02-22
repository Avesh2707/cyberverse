const express = require('express');
const router = express.Router();
const { submitFlag, getMySubmissions } = require('../controllers/submissionController');
const { protect } = require('../middleware/auth');
const { flagValidator, validate } = require('../middleware/validator');
const { flagLimiter } = require('../middleware/rateLimiter');

router.post('/submit-flag', protect, flagLimiter, flagValidator, validate, submitFlag);
router.get('/submissions', protect, getMySubmissions);

module.exports = router;
