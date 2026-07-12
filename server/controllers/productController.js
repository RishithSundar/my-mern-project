const Product = require('../models/Product');

// Get all products (For users browsing the store)
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products: ", error);
    res.status(500).json({ message: "Server error while fetching products" });
  }
};

// Create a new product (For the Admin dashboard)
const createProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json({ message: "Product created successfully", product: savedProduct });
  } catch (error) {
    console.error("Error creating product: ", error);
    res.status(500).json({ message: "Server error while creating product" });
  }
};

module.exports = { getAllProducts, createProduct };