const express = require('express');
const router = express.Router();
const { submitFlag } = require('../controllers/flag.controller');
const { protect } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');

router.post('/', protect, validate('flagSubmission'), submitFlag);

module.exports = router;
