const mongoose = require("mongoose");
const FooterCMS = require("../models/CMS/footer");

// Validate MongoDB ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Create or Update FooterCMS Entry
exports.createFooter = async (req, res) => {
    try {
      const data = req.body;
  
      // Check if a footer already exists in the database
      const existingFooter = await FooterCMS.findOne();
  
      if (existingFooter) {
        // If it exists, update it
        const updatedFooter = await FooterCMS.findByIdAndUpdate(existingFooter._id, data, {
          new: true,  // Return the updated document
          runValidators: true, // Ensures validation of updated data
        });
        return res.status(200).json({ message: "Footer updated successfully", footer: updatedFooter });
      }
  
      // If it doesn't exist, create a new footer
      const footer = new FooterCMS(data);
      await footer.save();
      res.status(201).json({ message: "Footer created successfully", footer });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
};

// Get FooterCMS Data
exports.getFooter = async (req, res) => {
  try {
    const footer = await FooterCMS.findOne();
    if (!footer) return res.status(404).json({ message: "Footer not found" });
    res.status(200).json(footer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update FooterCMS Entry
exports.updateFooter = async (req, res) => {
  try {
    const id = req.params.id;
    if (!isValidObjectId(id))
      return res.status(400).json({ message: "Invalid ID format" });

    const updatedData = req.body;
    const footer = await FooterCMS.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true, // Ensures validation of updated data
    });

    if (!footer) return res.status(404).json({ message: "Footer not found" });

    res.status(200).json({ message: "Footer updated successfully", footer });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete FooterCMS Entry
exports.deleteFooter = async (req, res) => {
  try {
    const id = req.params.id;
    if (!isValidObjectId(id))
      return res.status(400).json({ message: "Invalid ID format" });

    const footer = await FooterCMS.findByIdAndDelete(id);

    if (!footer) return res.status(404).json({ message: "Footer not found" });

    res.status(200).json({ message: "Footer deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
