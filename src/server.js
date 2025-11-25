require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const foodbagRoutes = require('./routes/foodbag');
const orderRoutes = require('./routes/order');
const sellerRoutes = require('./routes/seller');

const app = express();
app.use(cors());
app.use(express.json());

// Connect DB
connectDB(process.env.MONGO_URI);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/foodbags', foodbagRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/seller', sellerRoutes);

// simple health
app.get('/', (req, res) => res.send('Food Rescue API up'));

// Start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
