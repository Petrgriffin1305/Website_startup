const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  name: { type: String },
  phone: { type: String },
  role: { type: String, enum: ['buyer', 'seller'], default: 'buyer' },
  address: { type: String },
  location: {
    // optional geolocation (lat, lng)
    lat: Number,
    lng: Number
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
