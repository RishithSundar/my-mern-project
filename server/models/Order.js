const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  // The person who ordered it (we will save their email from the form)
  userEmail: { type: String, required: true }, 
  
  // The array of products they bought from the cart
  items: { type: Array, required: true },
  
  // Name, address, pincode, etc.
  shippingData: { type: Object, required: true },
  
  // The final calculated price
  totalAmount: { type: Number, required: true },
  
  // Tracking status (Order placed, In-transit, Delivered)
  status: { type: String, default: 'Order placed' },
  
  // When the order was made
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);