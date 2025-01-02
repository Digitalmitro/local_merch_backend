const express = require("express");
const { upload } = require("../config/multerConfig"); // Multer upload instance
const {
  createShop,
  getShops,
  updateShop,
  getShopById,
  verifyShop,
  getUserShop,
} = require("../controllers/shopControllers");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();
// POST API to create a shop
router.post("/shops", authMiddleware, upload.array("images", 10),  createShop); 

router.get("/verify-shop", authMiddleware, verifyShop);
router.get("/user-shop", authMiddleware, getUserShop);

// GET API to fetch all shops
router.get("/shops", getShops);
router.get("/shops/:id", getShopById);

// PUT API to update a shop by ID
router.put("/shops/:shopId",authMiddleware, upload.array("images", 10), updateShop);



module.exports = router;
