const express = require('express');
const router = express.Router();
const { getLearnModules, getModuleById } = require('../controllers/learnController');
const { protect } = require('../middleware/auth');

router.get('/:domain', protect, getLearnModules);
router.get('/:domain/:moduleId', protect, getModuleById);

module.exports = router;
