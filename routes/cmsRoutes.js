const express = require("express");
const { createHomeCMS, getHomeCMS, updateHomeCMS, updateHomeCMSField } = require("../controllers/homeCmsController");
const { upload } = require("../config/multerConfig");
const {createFooter, getFooter, updateFooter, deleteFooter} = require('../controllers/footerCms')
const router = express.Router();

// Get HomeCMS Data
router.get("/homecms", getHomeCMS);
router.post(
    "/homecms",
    upload.fields([
        { name: "carousel", maxCount: 10 },
        { name: "popularCategories", maxCount: 10 },
        { name: "portfolio", maxCount: 1 },
        { name: "productImages", maxCount: 10 },
    ]),
    createHomeCMS
);
router.put(
    "/homecms/:id",
    upload.fields([
        { name: "carousel", maxCount: 10 },
        { name: "popularCategories", maxCount: 10 },
        { name: "portfolio", maxCount: 1 },
        { name: "productImages", maxCount: 10 },
    ]),
    updateHomeCMS
);
router.put(
    "/updateCms/:homeCMSId/:fieldId",
    upload.fields([
        { name: 'carousel', maxCount: 5 },  
        { name: 'popularCategories', maxCount: 10 },
        { name: 'portfolio', maxCount: 1 },
        { name: 'browseByProductImages', maxCount: 5 },
    ]),
    updateHomeCMSField
);

// Routes
router.post("/footer", createFooter);
router.get("/footer", getFooter);
router.put("/footer/:id", updateFooter);
router.delete("/footer/:id", deleteFooter);
module.exports = router;