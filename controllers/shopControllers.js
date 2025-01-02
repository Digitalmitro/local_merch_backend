const Shop = require("../models/shop");
const fs = require("fs");
const path = require("path");
const User = require("../models/user");

// Create a new shop
exports.createShop = async (req, res) => {
  try {
    const userId = req.user.id; // Extract user ID from auth middleware
    const { title, description, type, location } = req.body;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check for required fields
    if (!title || !description || !type || !location ) {
      return res.status(400).json({ message: "All fields are mandatory" });
    }

    // Save images
    const images = req.files.map((file) => `uploads/${file.filename}`);

    // Create shop data
    const shop = new Shop({
      title,
      description,
      type,
      location,
      images,
      phone: req.body.phone,
      email: req.body.email,
      user_id: userId,
    });

    // Save shop in database
    const savedShop = await shop.save();

    // Update user's shop_id and set isSeller to true
    user.shop_id.push(savedShop._id);
    user.isSeller = true;
    await user.save();

    // Respond with the created shop data
    res.status(201).json({ message: "Shop created successfully", shop: savedShop });
  } catch (error) {
    console.error("Error creating shop:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Get user's shop
exports.getUserShop = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find the user by ID
    const user = await User.findById(userId).populate("shop_id"); // Populate the shop_id field
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user has any shops
    if (!user.shop_id || user.shop_id.length === 0) {
      return res.status(404).json({ message: "No shops found for this user" });
    }

    // Return the shop(s) associated with the user
    res.status(200).json({ message: "Shops retrieved successfully", shops: user.shop_id });
  } catch (error) {
    console.error("Error retrieving user's shop:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Update shop details
exports.updateShop = async (req, res) => {
  try {
    const userId = req.user.id;  
    const { shopId } = req.params;  
    const { title, description, type, location, phone, email } = req.body;
    console.log("shopId", shopId  )
   
    if (phone) {
      const existingPhone = await Shop.findOne({ phone, _id: { $ne: shopId } });
      if (existingPhone) {
        return res.status(400).json({ message: "Phone number must be unique" });
      }
    }
    
    if (email) {
      const existingEmail = await Shop.findOne({ email, _id: { $ne: shopId } });
      if (existingEmail) {
        return res.status(400).json({ message: "Email must be unique" });
      }
    }

    // Find the shop by ID
    const shop = await Shop.findById(shopId);
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    // Ensure the shop belongs to the authenticated user
    if (!shop.user_id.equals(userId)) {
      return res.status(403).json({ message: "You do not have permission to update this shop" });
    }

    // Prepare the updates for the shop
    const updatedShopData = {};

    // Update fields if provided in the request body
    if (title) updatedShopData.title = title;
    if (description) updatedShopData.description = description;
    if (type) updatedShopData.type = type;
    if (location) updatedShopData.location = location;
    if (phone) updatedShopData.phone = phone;
    if (email) updatedShopData.email = email;

    // Handle image uploads: if new images are provided, replace existing ones
    let images = shop.images || [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => `uploads/${file.filename}`);
      updatedShopData.images = images;  // Replace with new images
    }

    // Apply the updates
    Object.assign(shop, updatedShopData);

    // Save the updated shop
    const updatedShop = await shop.save();

    // Respond with the updated shop data
    res.status(200).json({
      message: "Shop updated successfully",
      shop: updatedShop
    });
  } catch (error) {
    console.error("Error updating shop:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// exports.createShop = async (req, res) => {
 
//   try {
//     const { title, description, location, type,  user_id } = req.body;
//     const images = req.files ? req.files.map((file) => `uploads/${file.filename}`) : [];
//     const newShop = new Shop({
//       title,
//       type,
//       description,
//       location, 
//       images,
//       user_id
//     });
//     await newShop.save();
//     res.status(201).json({ message: "Shop created successfully", shop: newShop });
//   } catch (error) {
//     res.status(500).json({ message: "Error creating shop", error: error.message });
//   }
// };

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
// exports.updateShop = async (req, res) => {

//   try {
//     const { id } = req.params;
//     const updates = req.body;

//     if (req.files) {
//       updates.images = req.files.map((file) => `uploads/${file.filename}`);
//     }

//     // if (updates.location) {
//     //   updates.location = JSON.parse(updates.location); 
//     // }
//     if (updates.location) {
//         const shop = await Shop.findById(id);
//         if (!shop) {
//           return res.status(404).json({ message: "Shop not found" });
//         }
  
//         // Merge the current `location` object with the incoming `location` updates
//         updates.location = { ...shop.location.toObject(), ...updates.location };
//       }
//     const updatedShop = await Shop.findByIdAndUpdate(id, updates, { new: true });

//     if (!updatedShop) {
//       return res.status(404).json({ message: "Shop not found" });
//     }

//     res.status(200).json({ message: "Shop updated successfully", shop: updatedShop });
//   } catch (error) {
//     res.status(500).json({ message: "Error updating shop", error: error.message });
//   }
// };

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
  
exports.verifyShop = async (req, res) => {
    try {
      const userId = req.user._id; 
      const shop = await Shop.findOne({ user_id: userId });
      if (shop) {
        return res.status(200).json({ hasShop: true, shop });
      }
      return res.status(200).json({ hasShop: false });
    } catch (error) {
      res.status(500).json({ message: "Error checking shop", error: error.message });
    }
};
  
