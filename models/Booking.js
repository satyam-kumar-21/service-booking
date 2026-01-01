const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  partner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Partner',
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true,
  },
  status: {
    type: String,
    enum: ['requested', 'assigned', 'in-progress', 'completed', 'cancelled'],
    default: 'requested',
    required: true,
  },
  schedule: {
    date: { type: Date, required: true },
    slot: String,
  },
  address: {
      location: String,
      pincode: String,
  },
  paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
  },
  amount: {
      type: Number,
      required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Booking', bookingSchema);
