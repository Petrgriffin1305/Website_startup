const express = require('express');
const router = express.Router();
const { auth, permit } = require('../middlewares/auth');
const { sellerOrders, sellerStats } = require('../controllers/sellercontroller');

router.get('/orders', auth, permit('seller'), sellerOrders);
router.get('/stats', auth, permit('seller'), sellerStats);

module.exports = router;
