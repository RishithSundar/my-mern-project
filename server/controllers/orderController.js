const Order = require('../models/Order');

// Create a new order
const createOrder = async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Error saving order:", error);
    res.status(500).json({ error: 'Failed to place order.' });
  }
};

// Get orders
const getOrders = async (req, res) => {
  try {
    const emailQuery = req.query.email;
    const orders = emailQuery ? await Order.find({ userEmail: emailQuery }) : await Order.find();
    
    res.status(200).json(orders.reverse()); 
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: 'Failed to fetch orders.' });
  }
};

// Update an order's status
const updateOrderStatus = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id, 
      { status: req.body.status }, 
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ error: 'Failed to update order status.' });
  }
};

module.exports = { createOrder, getOrders, updateOrderStatus };