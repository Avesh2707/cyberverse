const express = require('express');
const router = express.Router();
const {
  createDomain, updateDomain, deleteDomain,
  createChallenge, updateChallenge, deleteChallenge,
  createModule, updateModule,
  getAllUsers, toggleUserStatus,
  getPlatformStats,
} = require('../controllers/admin.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');

// All admin routes require authentication + admin role
router.use(protect, adminOnly);

// Stats
router.get('/stats', getPlatformStats);

// Domain management
router.post('/domains', createDomain);
router.put('/domains/:id', updateDomain);
router.delete('/domains/:id', deleteDomain);

// Challenge management
router.post('/challenges', validate('challenge'), createChallenge);
router.put('/challenges/:id', updateChallenge);
router.delete('/challenges/:id', deleteChallenge);

// Learning module management
router.post('/modules', createModule);
router.put('/modules/:id', updateModule);

// User management
router.get('/users', getAllUsers);
router.patch('/users/:id/toggle', toggleUserStatus);

module.exports = router;
