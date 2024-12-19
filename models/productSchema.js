const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define Shop schema (assume shops exist)
const ShopSchema = new Schema({
  name: { type: String, required: true },
  location: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Shop = mongoose.model('Shop', ShopSchema);

// Define Product schema
const ProductSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  images: [{ type: String, required: true }], 
  price: { type: Number, required: true },
  category: { type: String, required: true },
  productType: { type: String, required: true },
  featured: { type: Boolean, default: false },
  shopId: { type: Schema.Types.ObjectId, ref: 'Shop', required: true }, 
  createdAt: { type: Date, default: Date.now },
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = { Shop, Product };
