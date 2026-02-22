const express = require('express');
const router = express.Router();
const { register, login, getMe, changePassword } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');

router.post('/register', validate('register'), register);
router.post('/login', validate('login'), login);
router.get('/me', protect, getMe);
router.put('/change-password', protect, changePassword);

module.exports = router;
