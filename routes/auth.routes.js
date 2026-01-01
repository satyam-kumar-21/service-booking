const express = require('express');
const { loginWithOtp, verifyOtp, getMe } = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/login-otp', loginWithOtp);
router.post('/verify-otp', verifyOtp);
router.get('/me', protect, getMe);

module.exports = router;
