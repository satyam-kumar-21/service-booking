const Booking = require('../models/Booking');
const Service = require('../models/Service');
const Partner = require('../models/Partner');

// @desc    Create Booking
// @route   POST /api/v1/bookings
// @access  Private (User)
exports.createBooking = async (req, res, next) => {
    try {
        const { serviceId, schedule, address } = req.body;

        const service = await Service.findById(serviceId);
        if (!service) return res.status(404).json({ success: false, message: 'Service not found' });

        const booking = await Booking.create({
            customer: req.user.id,
            service: serviceId,
            schedule,
            address,
            amount: service.basePrice + service.visitCharge, // Simple calc
        });

        res.status(201).json({ success: true, data: booking });
    } catch (error) {
        next(error);
    }
}

// @desc    Get Bookings (User/Partner/Admin)
// @route   GET /api/v1/bookings
// @access  Private
exports.getBookings = async (req, res, next) => {
    try {
        let query = {};
        if (req.user.role === 'user') {
            query.customer = req.user.id;
        } else if (req.user.role === 'partner') {
            // req.user is the partner document itself (aliased by middleware)
            query.partner = req.user.id;
        }
        // Admin sees all

        const bookings = await Booking.find(query)
            .populate('service', 'name email mobile')
            .populate('customer', 'name mobile')
            .populate('partner'); // Populate with partner ref which has User details embedded or ref'd

        res.status(200).json({ success: true, count: bookings.length, data: bookings });
    } catch (error) {
        next(error);
    }
}

// @desc    Assign Partner (Admin)
// @route   PUT /api/v1/bookings/:id/assign
// @access  Private (Admin)
exports.assignPartner = async (req, res, next) => {
    try {
        const { partnerId } = req.body;
        const booking = await Booking.findById(req.params.id);

        if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

        booking.partner = partnerId;
        booking.status = 'assigned';
        await booking.save();

        res.status(200).json({ success: true, data: booking });
    } catch (error) {
        next(error);
    }
}

// @desc    Update Status (Partner/Admin)
// @route   PUT /api/v1/bookings/:id/status
// @access  Private (Partner/Admin)
exports.updateBookingStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const booking = await Booking.findById(req.params.id);

        if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

        // Add logic to check if partner owns this booking
        if (req.user.role === 'partner') {
            if (booking.partner.toString() !== req.user.id) {
                return res.status(403).json({ success: false, message: 'Not authorized to update this booking' });
            }
        }

        booking.status = status;
        if (status === 'completed') {
            booking.paymentStatus = 'paid'; // Mock auto-pay or cash collection
        }
        await booking.save();

        res.status(200).json({ success: true, data: booking });
    } catch (error) {
        next(error);
    }
}
