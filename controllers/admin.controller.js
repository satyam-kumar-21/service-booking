const User = require('../models/User');
const Partner = require('../models/Partner');

// @desc    Get All Users
// @route   GET /api/v1/admin/users
// @access  Private (Admin)
exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({ role: 'user' });
        res.status(200).json({ success: true, count: users.length, data: users });
    } catch (error) {
        next(error);
    }
};

// @desc    Block/Unblock User
// @route   PUT /api/v1/admin/users/:id/status
// @access  Private (Admin)
exports.toggleUserStatus = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        user.status = user.status === 'active' ? 'blocked' : 'active';
        await user.save();

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
}

// @desc    Get All Partners (filter by status)
// @route   GET /api/v1/admin/partners
// @access  Private (Admin)
exports.getAllPartners = async (req, res, next) => {
    try {
        const { isApproved } = req.query;
        let query = {};

        // Find partners first
        let partnerQuery = {};
        if (isApproved !== undefined) {
            partnerQuery.isApproved = isApproved === 'true';
        }

        const partners = await Partner.find(partnerQuery);
        res.status(200).json({ success: true, count: partners.length, data: partners });
    } catch (error) {
        next(error);
    }
}

// @desc    Approve/Reject Partner
// @route   PUT /api/v1/admin/partners/:id/approval
// @access  Private (Admin)
exports.approvePartner = async (req, res, next) => {
    try {
        const { isApproved } = req.body; // true or false
        const partner = await Partner.findById(req.params.id);

        if (!partner) return res.status(404).json({ success: false, message: 'Partner not found' });

        partner.isApproved = isApproved;
        if (isApproved) {
            partner.isActive = true; // Auto activate on approval? or let them toggle. Let's auto activate.
        }
        await partner.save();

        res.status(200).json({ success: true, data: partner });
    } catch (error) {
        next(error);
    }
}

// @desc    Get Dashboard Stats
// @route   GET /api/v1/admin/stats
// @access  Private (Admin)
exports.getDashboardStats = async (req, res, next) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'user' });
        const totalPartners = await Partner.countDocuments();
        const totalBookings = await require('../models/Booking').countDocuments();

        // simple revenue calc (all bookings for now, better to filter by completed)
        // const completedBookings = await require('../models/Booking').find({ status: 'completed' });
        // const totalRevenue = completedBookings.reduce((acc, curr) => acc + curr.amount, 0);

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalPartners,
                totalBookings,
                // totalRevenue
            }
        });
    } catch (error) {
        next(error);
    }
}
