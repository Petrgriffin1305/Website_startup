const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  allergens: [String]
}, { _id: false });

const FoodBagSchema = new mongoose.Schema({
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: String,
  items: [ItemSchema],
  price: { type: Number, required: true, default: 0 },
  co2SavedKg: { type: Number, default: 0 },
  availableFrom: Date,
  availableTo: Date,
  pickupLocation: {
    address: String,
    lat: Number,
    lng: Number
  },
  status: { type: String, enum: ['available','reserved','sold','expired'], default: 'available' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FoodBag', FoodBagSchema);
