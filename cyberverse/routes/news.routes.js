const express = require('express');
const router = express.Router();
const { getCyberNews } = require('../controllers/news.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/', protect, getCyberNews);

module.exports = router;
