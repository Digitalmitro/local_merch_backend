const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    images: [{ type: String }], 
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    type: { type: String, required: true },
    featured: { type: Boolean, default: false },
    shop_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true }],
  },
  { timestamps: true } 
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
