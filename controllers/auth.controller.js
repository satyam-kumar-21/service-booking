const User = require('../models/User');
const Partner = require('../models/Partner');
const { generateToken, generateRefreshToken } = require('../utils/generateToken');

// @desc    Register/Login with Mobile & OTP
// @route   POST /api/v1/auth/login-otp
// @access  Public
exports.loginWithOtp = async (req, res, next) => {
  try {
    const { mobile } = req.body;
    if (!mobile) {
      return res.status(400).json({ success: false, message: 'Please provide mobile number' });
    }

    let user = await User.findOne({ mobile });

    // Mock OTP generation
    const otp = '123456'; // In production, use random 6 digits
    const otpExpires = Date.now() + 10 * 60 * 1000; // 10 mins

    if (!user) {
      // Create temporary user or wait for verification to create?
      // Strategy: Upsert logic usually involves creating a record with flag or checking existence
      // For this MVP, let's create user if not exists but with 'user' role default.
      // Name is required in schema, so we might need to ask it later or make it optional. 
      // Let's relax name requirement or provide placeholder.
      user = await User.create({
        mobile,
        name: 'New User', // Placeholder
        otp: { code: otp, expiresAt: otpExpires }
      });
    } else {
      user.otp = { code: otp, expiresAt: otpExpires };
      await user.save();
    }

    // In production, send SMS here
    console.log(`OTP for ${mobile}: ${otp}`);

    res.status(200).json({
      success: true,
      message: `OTP sent to ${mobile}`,
      // Dev only: return OTP in response for testing
      data: { otp } 
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Verify OTP and Get Token
// @route   POST /api/v1/auth/verify-otp
// @access  Public
exports.verifyOtp = async (req, res, next) => {
  try {
    const { mobile, otp } = req.body;
    
    if (!mobile || !otp) {
       return res.status(400).json({ success: false, message: 'Provide mobile and OTP' });
    }

    const user = await User.findOne({ mobile });

    if (!user) {
      return res.status(400).json({ success: false, message: 'User not found' });
    }

    if (user.otp.code !== otp || user.otp.expiresAt < Date.now()) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    // Clear OTP
    user.otp = undefined;
    await user.save();

    // Generate Tokens
    const accessToken = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Check if partner
    let partnerProfile = null;
    if (user.role === 'partner') {
        partnerProfile = await Partner.findOne({ user: user._id });
    }

    res.status(200).json({
      success: true,
      token: accessToken,
      refreshToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        partnerProfile
      }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get current user
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
}
