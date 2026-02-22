const express = require('express');
const router = express.Router();
const { getAdminStats, getAllUsers, toggleUserStatus } = require('../controllers/adminController');
const { createChallenge, updateChallenge, deleteChallenge } = require('../controllers/challengeController');
const { createModule, updateModule } = require('../controllers/learnController');
const { createDomain, updateDomain } = require('../controllers/domainController');
const { protect, adminOnly } = require('../middleware/auth');
const { challengeValidator, validate } = require('../middleware/validator');

// All admin routes require auth + admin role
router.use(protect, adminOnly);

// Stats
router.get('/stats', getAdminStats);

// Users
router.get('/users', getAllUsers);
router.patch('/users/:id/toggle', toggleUserStatus);

// Challenges
router.post('/challenges', challengeValidator, validate, createChallenge);
router.put('/challenges/:id', updateChallenge);
router.delete('/challenges/:id', deleteChallenge);

// Domains
router.post('/domains', createDomain);
router.put('/domains/:id', updateDomain);

// Learning Modules
router.post('/modules', createModule);
router.put('/modules/:id', updateModule);

module.exports = router;
