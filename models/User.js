const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
  },
  email: {
    type: String,
    unique: true,
    sparse: true, // Allow multiple nulls if mobile is used primarily
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
  role: {
    type: String,
    enum: ['user', 'partner'],
    default: 'user',
  },
  status: {
    type: String,
    enum: ['active', 'blocked'],
    default: 'active',
  },
  otp: {
    code: String,
    expiresAt: Date,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('User', userSchema);
