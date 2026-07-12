const express = require('express');
const router = express.Router();
const { getAllProducts, createProduct } = require('../controllers/productController');

// GET route to fetch all products (http://localhost:8000/api/products)
router.get('/', getAllProducts);

// POST route to add a new product (http://localhost:8000/api/products)
router.post('/', createProduct);

module.exports = router;