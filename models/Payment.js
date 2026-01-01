const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true,
  },
  amount: {
      type: Number,
      required: true,
  },
  method: {
      type: String,
      enum: ['cash', 'card', 'upi', 'wallet'],
      default: 'cash',
  },
  status: {
      type: String,
      enum: ['pending', 'success', 'failed'],
      default: 'pending',
  },
  transactionId: String,
}, {
  timestamps: true,
});

module.exports = mongoose.model('Payment', paymentSchema);
