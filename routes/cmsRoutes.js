const express = require("express");
const { createHomeCMS, getHomeCMS } = require("../controllers/homeCmsController");
const { upload } = require("../config/multerConfig");
const {createFooter, getFooter, updateFooter, deleteFooter} = require('../controllers/footerCms')
const router = express.Router();

// Get HomeCMS Data
router.get("/homecms", getHomeCMS);
router.post(
    "/homecms",
    upload.fields([
        { name: "carouselImages", maxCount: 10 },
        { name: "popularCategoryImages", maxCount: 10 },
        { name: "portfolioImage", maxCount: 1 },
        { name: "productImages", maxCount: 10 },
    ]),
    createHomeCMS
);

// Routes
router.post("/footer", createFooter);
router.get("/footer", getFooter);
router.put("/footer/:id", updateFooter);
router.delete("/footer/:id", deleteFooter);
module.exports = router;