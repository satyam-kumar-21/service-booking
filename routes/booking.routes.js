const express = require('express');
const {
    createBooking, getBookings,
    assignPartner, updateBookingStatus
} = require('../controllers/booking.controller');
const { protect, protectAdmin, protectUniversal, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

// protect only affects following if we use router.use, but here we specific in chain
// or we can use specific middlewares

router.route('/')
    .post(protect, authorize('user'), createBooking)
    .get(protectUniversal, getBookings); // User, Partner, Admin

router.put('/:id/assign', protectAdmin, authorize('admin', 'superadmin'), assignPartner);
router.put('/:id/status', protectUniversal, authorize('admin', 'superadmin', 'partner'), updateBookingStatus);

module.exports = router;
