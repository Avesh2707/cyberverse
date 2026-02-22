const express = require('express');
const router = express.Router();
const { getCTFNews, getLiveCTFs } = require('../controllers/newsController');
const { protect } = require('../middleware/auth');

router.get('/ctf-news', protect, getCTFNews);
router.get('/live-ctfs', protect, getLiveCTFs);

module.exports = router;
