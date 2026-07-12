const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // <-- We added JWT here!

// Function to handle User Registration
const registerUser = async (req, res) => {
  try {
    const { username, email, password, usertype } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "A user with this email already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      usertype 
    });

    await newUser.save(); 

    res.status(201).json({ 
      message: "User registered successfully!",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        usertype: newUser.usertype
      }
    });

  } catch (error) {
    console.error("Registration Error: ", error);
    res.status(500).json({ message: "Server error during registration." });
  }
};

// Function to handle User Login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check if the user exists in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // 2. Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password!" });
    }

    // 3. Generate the JWT "ID Badge"
    const token = jwt.sign(
      { id: user._id, usertype: user.usertype }, // Data to put in the badge
      process.env.JWT_SECRET,                    // Your secret key
      { expiresIn: '1d' }                        // Badge expires in 1 day
    );

    // 4. Send the badge and user info back to the frontend
    res.status(200).json({
      message: "Login successful!",
      token, // <-- Here is the JWT token!
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        usertype: user.usertype
      }
    });

  } catch (error) {
    console.error("Login Error: ", error);
    res.status(500).json({ message: "Server error during login." });
  }
};

// Export both functions now!
module.exports = { registerUser, loginUser };