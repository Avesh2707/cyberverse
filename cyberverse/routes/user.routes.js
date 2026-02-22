const express = require('express');
const router = express.Router();
const { getUserProfile, updateProfile, getMySubmissions, generateCertificate } = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/submissions', protect, getMySubmissions);
router.put('/profile', protect, updateProfile);
router.get('/certificate/:domain_slug', protect, generateCertificate);
router.get('/:username', protect, getUserProfile);

module.exports = router;
