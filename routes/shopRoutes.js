const express = require("express");
const { upload } = require("../config/multerConfig"); // Multer upload instance
const {
  createShop,
  getShops,
  updateShop,
  getShopById,
} = require("../controllers/shopControllers");

const router = express.Router();
// POST API to create a shop
router.post("/shops", upload.array("images", 10), createShop); 

// GET API to fetch all shops
router.get("/shops", getShops);
router.get("/shops/:id", getShopById);

// PUT API to update a shop by ID
router.put("/shops/:id", upload.array("images", 10), updateShop);

module.exports = router;
