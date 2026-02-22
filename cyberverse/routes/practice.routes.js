const express = require('express');
const router = express.Router();
const { getPracticeChallenges } = require('../controllers/practice.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/', protect, getPracticeChallenges);

module.exports = router;
