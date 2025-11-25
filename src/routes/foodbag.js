const express = require('express');
const router = express.Router();
const { auth, permit } = require('../middlewares/auth');
const { createFoodBag, updateFoodBag, listFoodBags, getFoodBag } = require('../controllers/foodbagcontrollers');

router.get('/', listFoodBags);
router.get('/:id', getFoodBag);

// seller only
router.post('/', auth, permit('seller'), createFoodBag);
router.put('/:id', auth, permit('seller'), updateFoodBag);

module.exports = router;
