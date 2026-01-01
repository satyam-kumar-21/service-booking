const express = require('express');
const { 
    createBooking, getBookings, 
    assignPartner, updateBookingStatus 
} = require('../controllers/booking.controller');
const { protect, protectAdmin, protectOrAdmin, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

// protect only affects following if we use router.use, but here we specific in chain
// or we can use specific middlewares

router.route('/')
    .post(protect, authorize('user'), createBooking)
    .get(protectOrAdmin, getBookings); // Admin needs to see too, so protectOrAdmin

router.put('/:id/assign', protectAdmin, authorize('admin', 'superadmin'), assignPartner);
router.put('/:id/status', protectOrAdmin, authorize('admin', 'superadmin', 'partner'), updateBookingStatus);

module.exports = router;
