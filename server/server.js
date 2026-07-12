require('dotenv').config(); 
const express = require('express');
const cors = require('cors');

// 1. Import Database Configuration
const connectDB = require('./config/db');

// Initialize the Express app
const app = express();

// --- Middleware ---
app.use(express.json()); 
app.use(cors());         

// --- Database Connection ---
connectDB(); // Replaces the mongoose.connect block

// --- Modular API Routes ---
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/product'); 
const orderRoutes = require('./routes/orderRoutes'); // <-- NEW ORDER ROUTE IMPORT

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);           
app.use('/api/orders', orderRoutes); // <-- USE THE ORDER ROUTE

// --- Test Route ---
app.get('/', (req, res) => {
  res.send('ShopEZ Backend API is Running!');
});

// --- Start the Server ---
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});