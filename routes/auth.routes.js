const express = require('express');
const {
      registerUser,
      loginUser,
      loginWithPassword,
      verifyOtp,
      getMe,
      updateDetails
} = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/register-otp', registerUser);
router.post('/login-otp', loginUser);
router.post('/login-password', loginWithPassword);
router.post('/verify-otp', verifyOtp);

// Protect routes
router.use(protect);

router.get('/me', getMe);
router.put('/updatedetails', updateDetails);

module.exports = router;
