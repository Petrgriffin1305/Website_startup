const Order = require('../models/order');
const FoodBag = require('../models/foodbag');
const { generateQRCode } = require('../utils/qr');
const { haversineDistance } = require('../utils/distance');

const createOrder = async (req, res) => {
  const { foodBagId, quantity, buyerLat, buyerLng } = req.body;
  if (!foodBagId) return res.status(400).json({ message: 'foodBagId là bắt buộc' });

  const fb = await FoodBag.findById(foodBagId);
  if (!fb) return res.status(404).json({ message: 'FoodBag không tồn tại' });
  if (fb.status !== 'available') return res.status(400).json({ message: 'FoodBag không khả dụng' });

  // calculate distance if possible
  let distanceKm = null;
  if (buyerLat != null && buyerLng != null && fb.pickupLocation && fb.pickupLocation.lat != null && fb.pickupLocation.lng != null) {
    distanceKm = haversineDistance(parseFloat(buyerLat), parseFloat(buyerLng), fb.pickupLocation.lat, fb.pickupLocation.lng);
  }

  const totalPrice = (fb.price || 0) * (quantity || 1);

  const order = new Order({
    buyerId: req.user._id,
    sellerId: fb.sellerId,
    foodBagId,
    quantity: quantity || 1,
    totalPrice,
    distanceKm
  });

  // generate QR that includes order id (or any data you want)
  const qrData = JSON.stringify({ orderId: order._id.toString(), foodBagId: fb._id.toString() });
  order.qrCodeDataUrl = await generateQRCode(qrData);

  await order.save();

  // Mark foodbag reserved (simple approach: set reserved)
  fb.status = 'reserved';
  await fb.save();

  res.json({ message: 'Tạo đơn thành công', order });
};

const getOrder = async (req, res) => {
  const order = await Order.findById(req.params.id).populate('buyerId', 'name email').populate('sellerId', 'name');
  if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn' });
  // Only buyer or seller can view
  if (req.user._id.toString() !== order.buyerId._id.toString() && req.user._id.toString() !== order.sellerId._id.toString()) {
    return res.status(403).json({ message: 'Không có quyền' });
  }
  res.json(order);
};

const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const order = await Order.findById(id);
  if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn' });

  // Seller can change to confirmed/picked_up/completed. Buyer can cancel.
  if (req.user.role === 'seller') {
    if (req.user._id.toString() !== order.sellerId.toString()) return res.status(403).json({ message: 'Không có quyền' });
    order.status = status;
    if (status === 'completed') order.completedAt = new Date();
  } else if (req.user.role === 'buyer') {
    if (req.user._id.toString() !== order.buyerId.toString()) return res.status(403).json({ message: 'Không có quyền' });
    if (status === 'cancelled') order.status = 'cancelled';
    else return res.status(400).json({ message: 'Buyer chỉ có thể huỷ đơn' });
  } else {
    return res.status(403).json({ message: 'Không có quyền' });
  }

  order.updatedAt = new Date();
  await order.save();

  // update foodbag status accordingly
  if (order.status === 'completed') {
    const fb = await FoodBag.findById(order.foodBagId);
    if (fb) {
      fb.status = 'sold';
      await fb.save();
    }
  } else if (order.status === 'cancelled') {
    const fb = await FoodBag.findById(order.foodBagId);
    if (fb) {
      fb.status = 'available';
      await fb.save();
    }
  }

  res.json({ message: 'Cập nhật trạng thái thành công', order });
};

module.exports = { createOrder, getOrder, updateOrderStatus };
