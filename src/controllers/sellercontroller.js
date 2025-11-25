const Order = require('../models/order');
const FoodBag = require('../models/foodbag');

// fetch seller's orders
const sellerOrders = async (req, res) => {
  const orders = await Order.find({ sellerId: req.user._id }).populate('foodBagId').populate('buyerId', 'name email');
  res.json(orders);
};

// simple stats computed on the fly
const sellerStats = async (req, res) => {
  const sellerId = req.user._id;
  // fetch orders completed in ranges
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay()); // sunday start
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [dayOrders, weekOrders, monthOrders, totalSoldBags] = await Promise.all([
    Order.find({ sellerId, status: 'completed', completedAt: { $gte: startOfDay } }),
    Order.find({ sellerId, status: 'completed', completedAt: { $gte: startOfWeek } }),
    Order.find({ sellerId, status: 'completed', completedAt: { $gte: startOfMonth } }),
    Order.find({ sellerId, status: 'completed' })
  ]);

  const sumRevenue = ordersArr => ordersArr.reduce((s, o) => s + (o.totalPrice || 0), 0);

  res.json({
    dailyRevenue: sumRevenue(dayOrders),
    weeklyRevenue: sumRevenue(weekOrders),
    monthlyRevenue: sumRevenue(monthOrders),
    totalBagsSold: totalSoldBags.length
  });
};

module.exports = { sellerOrders, sellerStats };
