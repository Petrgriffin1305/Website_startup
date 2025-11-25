const FoodBag = require('../models/foodbag');

const createFoodBag = async (req, res) => {
  const data = req.body;
  data.sellerId = req.user._id;
  const fb = new FoodBag(data);
  await fb.save();
  res.json({ message: 'Tạo foodbag thành công', foodbag: fb });
};

const updateFoodBag = async (req, res) => {
  const id = req.params.id;
  const fb = await FoodBag.findById(id);
  if (!fb) return res.status(404).json({ message: 'Không tìm thấy foodbag' });
  if (fb.sellerId.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Không có quyền' });
  Object.assign(fb, req.body);
  await fb.save();
  res.json({ message: 'Cập nhật thành công', foodbag: fb });
};

const listFoodBags = async (req, res) => {
  // supports optional query: lat,lng,maxDistanceKm,allergens
  const { lat, lng, maxDistanceKm, allergens } = req.query;
  let q = { status: 'available' };
  if (allergens) {
    const arr = allergens.split(',');
    // exclude foodbags that contain any of these allergens
    q['items.allergens'] = { $nin: arr };
  }
  let foodbags = await FoodBag.find(q).populate('sellerId', 'name address location');
  if (lat && lng && maxDistanceKm) {
    const { haversineDistance } = require('../utils/distance');
    const latNum = parseFloat(lat), lngNum = parseFloat(lng), maxD = parseFloat(maxDistanceKm);
    foodbags = foodbags.map(fb => {
      if (fb.pickupLocation && fb.pickupLocation.lat && fb.pickupLocation.lng) {
        fb = fb.toObject();
        fb.distanceKm = haversineDistance(latNum, lngNum, fb.pickupLocation.lat, fb.pickupLocation.lng);
        return fb;
      } else {
        return fb.toObject();
      }
    }).filter(fb => fb.distanceKm == null || fb.distanceKm <= maxD);
  }
  res.json(foodbags);
};

const getFoodBag = async (req, res) => {
  const fb = await FoodBag.findById(req.params.id).populate('sellerId', 'name address location');
  if (!fb) return res.status(404).json({ message: 'Không tìm thấy' });
  res.json(fb);
};

module.exports = { createFoodBag, updateFoodBag, listFoodBags, getFoodBag };
