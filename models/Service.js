const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a service name'],
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  description: String,
  basePrice: {
    type: Number,
    required: true,
  },
  visitCharge: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
  image: String,
}, {
  timestamps: true,
});

module.exports = mongoose.model('Service', serviceSchema);
