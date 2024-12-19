
const bcrypt = require('bcrypt');
const User = require('../models/user.js');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.register = async (req, res) => {
  console.log("dg" , req.body)

    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password ) {
        return res.status(400).json({ message: "Please provide full name, email, and password" });
      }
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email is already registered" });
      }
      const user = new User({ name, email, password });
      await user.save();
  
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      if (error.name === 'ValidationError') {
        return res.status(400).json({ message: "Invalid data provided" });
      }
      res.status(500).json({ message: "internal server error" });
    }
  };
  
exports.login = async (req, res) => {
  console.log("login api ",req.body)

    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: "Please provide both email and password" });
      }
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Invalid email " });
      }
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid  password" });
      }
  console.log("login  ",process.env.JWT_SECRET)

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
      console.log("token", token)
      res.status(200).json({ message: "Login successful", token });
    } catch (error) {
  
      res.status(500).json({ message: "An error occurred during login" });
    }
  };

exports.googleLogin = async (req, res) => {
    try {
      const { tokenId } = req.body;
      const ticket = await client.verifyIdToken({
        idToken: tokenId,
        audience: process.env.GOOGLE_CLIENT_ID
      });
  
      const { email, name, picture } = ticket.getPayload();
  
      if (!email || !name) {
        return res.status(400).json({ message: 'Invalid Google token' });
      }
  
      let user = await User.findOne({ email });
  
      if (!user) {
        user = new User({
          full_name: name,
          email,
          password: '', 
          userImage: picture
        });
        await user.save();
      }
  
      // Generate JWT token
      const payload = { id: user._id};
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
  
      res.status(200).json({
        message: 'Login successful',
        token
      });
    } catch (error) {
      res.status(500).json({ message: 'Google login failed', error: error.message });
    }
  };
  
exports.getUserProfile = async (req,res) =>{
    try {
      const userId = req.user.id;
      if(!userId) return res.status(401).json({"message": "provide corrct token"})
      const user = await User.findById(userId).select('-password');
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
  
exports.updateUserProfile = async (req,res) =>{
    const userId = req.user.id; 
    const updates = req.body;
    let iconUrl;
    try {
        if (req.file) {
            iconUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
            updates.userImage = iconUrl; 
        }
        const updatedUser = await User.findByIdAndUpdate(userId, updates, {
            new: true, 
            runValidators: true, 
        })
  
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
  
        res.status(200).json({
            message: 'Profile updated successfully',
            user: updatedUser,
        });
    } catch (error) {
        res.status(500).json({
            message: 'An error occurred while updating the profile',
            error: error.message,
        });
    }
  }
  