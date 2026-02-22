const express = require('express');
const router = express.Router();
const { getCompeteChallenges } = require('../controllers/compete.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/', protect, getCompeteChallenges);

module.exports = router;
