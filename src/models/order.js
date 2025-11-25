const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  foodBagId: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodBag', required: true },
  quantity: { type: Number, default: 1 },
  totalPrice: { type: Number, default: 0 },
  qrCodeDataUrl: String, // base64 data url of QR
  distanceKm: Number,
  status: { type: String, enum: ['pending','confirmed','picked_up','completed','cancelled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
  completedAt: Date
});

module.exports = mongoose.model('Order', OrderSchema);
