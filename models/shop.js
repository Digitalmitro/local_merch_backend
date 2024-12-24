

const mongoose = require("mongoose");

const shopSchema = new mongoose.Schema(
  {

    title: { type: String, required: true }, 
    description: { type: String, required: true },
    type: { type: String, required: true },
    location: {
      street: { type: String, required: true },
      zipCode: { type: String, required: true },
      locality: { type: String, required: true },
      state: { type: String, required: true },
      city: { type: String, required: true },
      landmark: { type: String },
    },
    images: [{ type: String }], 
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

const Shop = mongoose.model("Shop", shopSchema);
module.exports = Shop;
