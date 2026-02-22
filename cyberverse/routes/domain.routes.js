const express = require('express');
const router = express.Router();
const { getAllDomains, getDomainBySlug } = require('../controllers/domain.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/', protect, getAllDomains);
router.get('/:slug', protect, getDomainBySlug);

module.exports = router;
