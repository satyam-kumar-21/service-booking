const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Can be User or Partner (since Partner has User ref)
    required: true,
  },
  title: {
      type: String,
      required: true,
  },
  message: {
      type: String,
      required: true,
  },
  type: {
      type: String,
      enum: ['booking', 'system', 'promotion'],
      default: 'system',
  },
  read: {
      type: Boolean,
      default: false,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Notification', notificationSchema);
