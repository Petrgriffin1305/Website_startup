const express = require('express');
const router = express.Router();
const { auth, permit } = require('../middlewares/auth');
const { createOrder, getOrder, updateOrderStatus } = require('../controllers/ordercontroller');

router.post('/', auth, permit('buyer'), createOrder);
router.get('/:id', auth, getOrder);
router.put('/:id/status', auth, updateOrderStatus);

module.exports = router;
