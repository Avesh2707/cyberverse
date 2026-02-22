const express = require('express');
const router = express.Router();
const { getLearnModules, getModuleById } = require('../controllers/learn.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/module/:id', protect, getModuleById);
router.get('/:domain', protect, getLearnModules);

module.exports = router;
