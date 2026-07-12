const mongoose = require('mongoose');

// Define the User Schema based on your project design
const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true // Ensures no two users can register with the same email
  },
  password: { 
    type: String, 
    required: true 
  },
  usertype: { 
    type: String, 
    default: 'USER' // Defaults to regular user unless specified as ADMIN
  }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt dates

// Export the model so we can use it in other files
module.exports = mongoose.model('User', userSchema);