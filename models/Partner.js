const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const partnerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  mobile: {
    type: String,
    required: [true, 'Please add a mobile number'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false,
  },
  role: {
    type: String,
    default: 'partner',
  },
  serviceType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: [true, 'Please add a service type (Service ID)'],
  },
  serviceArea: {
    pincodes: [String],
    locality: String,
    city: String,
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: false, // Partner controls this (online/offline)
  },
  image: {
    type: String, // Profile picture URL
  },
  documents: {
    idProof: String, // URL
    addressProof: String, // URL
  },
}, {
  timestamps: true,
});

// Encrypt password using bcrypt
// Encrypt password using bcrypt
// Encrypt password using bcrypt
partnerSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
partnerSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Sign JWT and return
partnerSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

module.exports = mongoose.model('Partner', partnerSchema);
