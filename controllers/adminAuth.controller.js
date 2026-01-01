const Admin = require('../models/Admin');
const { generateToken } = require('../utils/generateToken');

// @desc    Register Admin
// @route   POST /api/v1/admin/auth/register
// @access  Public (Should be protected or removed in production)
exports.registerAdmin = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        // Create admin
        const admin = await Admin.create({
            name,
            email,
            password,
            role // Optional, defaults to admin
        });

        const token = generateToken(admin._id);

        res.status(201).json({
            success: true,
            token,
            data: {
                _id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Login Admin
// @route   POST /api/v1/admin/auth/login
// @access  Public
exports.loginAdmin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide email and password' });
        }

        // Check for admin
        const admin = await Admin.findOne({ email }).select('+password');

        if (!admin) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Check if password matches
        const isMatch = await admin.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const token = generateToken(admin._id);

        res.status(200).json({
            success: true,
            token,
            data: {
                 _id: admin._id,
                 name: admin.name,
                 email: admin.email,
                 role: admin.role
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get Current Admin
// @route   GET /api/v1/admin/auth/me
// @access  Private (Admin)
exports.getAdminMe = async (req, res, next) => {
    try {
        const admin = await Admin.findById(req.admin.id);
        res.status(200).json({ success: true, data: admin });
    } catch (error) {
        next(error);
    }
}
