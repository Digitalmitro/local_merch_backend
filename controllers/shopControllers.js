const Shop = require("../models/shop");
const fs = require("fs");
const path = require("path");
// Create a new shop
exports.createShop = async (req, res) => {
    console.log(req.body);
    console.log(req.body.location);

  try {
    const { title, description, location, type,  user_id } = req.body;
    const images = req.files ? req.files.map((file) => `uploads/${file.filename}`) : [];
    const newShop = new Shop({
      title,
      type,
      description,
      location, 
    //location: JSON.parse(location),
      images,
      user_id
    });
    await newShop.save();
    res.status(201).json({ message: "Shop created successfully", shop: newShop });
  } catch (error) {
    res.status(500).json({ message: "Error creating shop", error: error.message });
  }
};

// Get all shops
exports.getShops = async (req, res) => {
  try {
    const shops = await Shop.find();
    res.status(200).json({ shops });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving shops", error: error.message });
  }
};

// Update a shop by ID
exports.updateShop = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    
    if (req.files) {
      updates.images = req.files.map((file) => `uploads/${file.filename}`);
    }

    // if (updates.location) {
    //   updates.location = JSON.parse(updates.location); 
    // }
    if (updates.location) {
        const shop = await Shop.findById(id);
        if (!shop) {
          return res.status(404).json({ message: "Shop not found" });
        }
  
        // Merge the current `location` object with the incoming `location` updates
        updates.location = { ...shop.location.toObject(), ...updates.location };
      }
    const updatedShop = await Shop.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedShop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    res.status(200).json({ message: "Shop updated successfully", shop: updatedShop });
  } catch (error) {
    res.status(500).json({ message: "Error updating shop", error: error.message });
  }
};

exports.deleteImage = async (req, res) => {
    try {
      const { shopId, imageName } = req.params; // Expecting shopId and imageName to be passed in the request
  
      // Find the shop by ID
      const shop = await Shop.findById(shopId);
      if (!shop) {
        return res.status(404).json({ message: "Shop not found" });
      }
  
      // Check if the image exists in the shop's images array
      const imageIndex = shop.images.findIndex((image) => image.includes(imageName));
      if (imageIndex === -1) {
        return res.status(404).json({ message: "Image not found in this shop" });
      }
  
      // Delete the image from the server
      const imagePath = path.join(__dirname, "../public", shop.images[imageIndex]);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath); // Delete the image file
        // Remove the image from the shop's images array
        shop.images.splice(imageIndex, 1);
        await shop.save(); // Save the updated shop data
      } else {
        return res.status(404).json({ message: "Image file not found" });
      }
  
      res.status(200).json({ message: "Image deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting image", error: error.message });
    }
};

// Get a shop by ID
exports.getShopById = async (req, res) => {
    try {
      const { id } = req.params;
  
      const shop = await Shop.findById(id);
      if (!shop) {
        return res.status(404).json({ message: "Shop not found" });
      }
  
      res.status(200).json({ shop });
    } catch (error) {
      res.status(500).json({ message: "Error retrieving shop", error: error.message });
    }
  };
  
