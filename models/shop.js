

const mongoose = require("mongoose");

// Regular expression for validating email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Regular expression for validating phone numbers (10-15 digits)
const phoneRegex = /^[0-9]{10,15}$/;

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
    phone: {
      type: String,
      required: true,
      validate: [
        // {
        //   validator: (value) => phoneRegex.test(value),
        //   message: (props) => `${props.value} is not a valid phone number!`,
        // },
        {
          validator: async function (value) {
            const existingShop = await mongoose.models.Shop.findOne({ phone: value });
            return !existingShop || existingShop._id.equals(this._id);
          },
          message: "Phone number must be unique.",
        },
      ],
    },
    email: {
      type: String,
      required: true,
      validate: [
        {
          validator: (value) => emailRegex.test(value),
          message: (props) => `${props.value} is not a valid email!`,
        },
        {
          validator: async function (value) {
            const existingShop = await mongoose.models.Shop.findOne({ email: value });
            return !existingShop || existingShop._id.equals(this._id);
          },
          message: "Email must be unique.",
        },
      ],
    },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);
const Shop = mongoose.model("Shop", shopSchema);
module.exports = Shop;
