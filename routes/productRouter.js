const express = require("express");
const { upload } = require("../config/multerConfig"); 
const {createProduct,
  getProducts,
  updateProduct,
  getProductsById,
} = require("../controllers/productControllers");

const router = express.Router();

// POST API to create a product
router.post("/products", upload.array("images", 10), createProduct); 

// GET API to fetch all products
router.get("/products", getProducts);
router.get("/products-by-id/:id", getProductsById);

// PUT API to update a product by ID
router.put("/products/:id", upload.array("images", 10), updateProduct);

module.exports = router;
