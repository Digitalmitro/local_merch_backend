// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name:{type: String, required: true},
  email:    {type: String, required: true, unique: true },
  password: {type: String},
  // isSeller: { type: Boolean, default: false },
  phone: { type: String, required: false },
  // dob: { type: Date, required: false },
  state: { type: String, required: false },
  area: { type: String, required: false },
  pincode: { type: String, required: false },
 shop_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Shop' }],

});
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
userSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);