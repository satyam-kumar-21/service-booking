const mongoose = require('mongoose');

const partnerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  serviceArea: {
    pincodes: [String],
    locality: String,
    city: String,
  },
  services: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
  }],
  isApproved: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: false, // Partner controls this (online/offline)
  },
  documents: {
    idProof: String, // URL
    addressProof: String, // URL
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Partner', partnerSchema);
