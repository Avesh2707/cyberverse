const express = require('express');
const router = express.Router();
const { getAllDomains, getDomainBySlug, createDomain, updateDomain } = require('../controllers/domainController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', protect, getAllDomains);
router.get('/:slug', protect, getDomainBySlug);
router.post('/', protect, adminOnly, createDomain);
router.put('/:id', protect, adminOnly, updateDomain);

module.exports = router;
