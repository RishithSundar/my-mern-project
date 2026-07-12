const express = require('express');
const router = express.Router();
const { createOrder, getOrders, updateOrderStatus } = require('../controllers/orderController');

// Clean endpoints pointing to the controller!
router.post('/', createOrder);
router.get('/', getOrders);
router.put('/:id', updateOrderStatus);

module.exports = router;