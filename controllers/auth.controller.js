const User = require('../models/User');
const Partner = require('../models/Partner');
const { generateToken, generateRefreshToken } = require('../utils/generateToken');

// @desc    Register User (Initiate)
// @route   POST /api/v1/auth/register-otp
// @access  Public
exports.registerUser = async (req, res, next) => {
  try {
    const { name, email, mobile, password } = req.body;

    if (!name || !email || !mobile) {
      return res.status(400).json({ success: false, message: 'Please provide name, email and mobile' });
    }

    let user = await User.findOne({ mobile });
    if (user) {
      return res.status(400).json({ success: false, message: 'User already registered with this mobile' });
    }

    // Check email uniqueness if needed
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ success: false, message: 'Email already in use' });
    }

    // Generate OTP
    const otp = '123456';
    const otpExpires = Date.now() + 10 * 60 * 1000;

    user = await User.create({
      name,
      email,
      mobile,
      password, // Optional, hashed by pre-save
      otp: { code: otp, expiresAt: otpExpires }
    });

    console.log(`OTP for ${mobile}: ${otp}`);

    res.status(200).json({
      success: true,
      message: `OTP sent to ${mobile} for registration`,
      data: { otp }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login User (Initiate)
// @route   POST /api/v1/auth/login-otp
// @access  Public
exports.loginUser = async (req, res, next) => {
  try {
    const { mobile } = req.body;
    if (!mobile) {
      return res.status(400).json({ success: false, message: 'Please provide mobile number' });
    }

    const user = await User.findOne({ mobile });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found. Please register first.' });
    }

    const otp = '123456';
    const otpExpires = Date.now() + 10 * 60 * 1000;

    user.otp = { code: otp, expiresAt: otpExpires };
    await user.save();

    console.log(`OTP for ${mobile}: ${otp}`);

    res.status(200).json({
      success: true,
      message: `OTP sent to ${mobile} for login`,
      data: { otp }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Login User (Password)
// @route   POST /api/v1/auth/login-password
// @access  Public
exports.loginWithPassword = async (req, res, next) => {
  try {
    const { email, mobile, password } = req.body;

    if ((!email && !mobile) || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email/mobile and password' });
    }

    // Find user (allow email or mobile)
    let query = {};
    if (email) query.email = email;
    if (mobile) query.mobile = mobile;

    const user = await User.findOne(query).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if password exists (migrated users might not have one)
    if (!user.password) {
      return res.status(400).json({ success: false, message: 'Password not set for this account. Use OTP login.' });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

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

// @desc    Update User Details
// @route   PUT /api/v1/auth/updatedetails
// @access  Private
exports.updateDetails = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      email: req.body.email
    };

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};
