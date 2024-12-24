const Product = require("../models/productSchema");
const Shop = require("../models/shop");

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const { title, description, price, category, type, featured, shop_id, } = req.body;

    const shop = await Shop.findById(shop_id);
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }


    const images = req.files ? req.files.map((file) => `uploads/${file.filename}`) : [];
    
    
    const newProduct = new Product({
      title,
      images,
      description,
      price,
      category,
      type,
      featured,
      shop_id,
    })
    await newProduct.save();
    res.status(201).json({ message: "Product created successfully", product: newProduct });
  } catch (error) {
    res.status(500).json({ message: "Error creating product", error: error.message });
  }
};

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving products", error: error.message });
  }
};


// Get products by ID
exports.getProductsById = async (req, res) => {
    const {id} = req.params
    console.log("id", id)

    try {
      const products = await Product.findById(id);
      res.status(200).json({ products });
    } catch (error) {
      res.status(500).json({ message: "Error retrieving products", error: error.message });
    }
  };

// Update a product by ID
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Collect new image file paths, if provided
    if (req.files) {
      updates.images = req.files.map((file) => `uploads/${file.filename}`);
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: "Error updating product", error: error.message });
  }
};
