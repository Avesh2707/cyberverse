const express = require('express');
const router = express.Router();
const { getLiveCTFs } = require('../controllers/ctf.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/', protect, getLiveCTFs);

module.exports = router;
