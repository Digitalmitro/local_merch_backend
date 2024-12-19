const HomeCMS = require('../models/CMS/homecms');

exports.createHomeCMS = async (req, res) => {
    try {
        const data = req.body;

        if (req.files) {
            if (req.files.carousel) {
                data.carousel = req.files.carousel.map((file) => ({
                    imageUrl: `uploads/${file.filename}`,
                    altText: "",
                }));
            }
            if (req.files.popularCategories) {
                data.popularCategories = JSON.parse(data.popularCategories).map((category, index) => ({
                    ...category,
                    imageUrl: `uploads/${req.files.popularCategories[index].filename}`,
                }));
            }
            if (req.files.portfolio) {
                data.portfolio.imageUrl = `uploads/${req.files.portfolio[0].filename}`;
            }
            if (req.files.portfolio) {
                data.portfolio.imageUrl = `uploads/${req.files.portfolio[0].filename}`;
            }
            if (req.files.productImages) {
                data.browseByProduct = {
                    heading: data.browseByProductHeading || "",
                    paragraph: data.browseByProductParagraph || "",
                    products: data.products.map((product, index) => ({
                        ...product,
                        imageUrl: req.files.productImages[index]
                            ? `uploads/${req.files.productImages[index].filename}`
                            : null,
                    })),
                };
            }
        }

        const homeCMS = new HomeCMS(data);
        await homeCMS.save();
        res.status(201).json({ message: "HomeCMS created successfully", homeCMS });
    } catch (error) {
        res.status(500).json({ message: "An error occurred", error: error.message });
    }
};

exports.updateHomeCMS = async (req, res) => {
    try {
        const data = req.body;

        // Handle file uploads if any
        const updates = {};
        if (req.files) {
            if (req.files.carousel) {
                updates.$push = {
                    carousel: {
                        $each: req.files.carousel.map((file) => ({
                            imageUrl: `uploads/${file.filename}`,
                            altText: "",
                        })),
                    },
                };
            }
            if (req.files.popularCategories) {
                updates.$push = {
                    popularCategories: {
                        $each: JSON.parse(data.popularCategories).map((category, index) => ({
                            ...category,
                            imageUrl: `uploads/${req.files.popularCategories[index].filename}`,
                        })),
                    },
                };
            }
            if (req.files.portfolio) {
                updates.$set = {
                    "portfolio.imageUrl": `uploads/${req.files.portfolio[0].filename}`,
                };
            }
        }

        // Update HomeCMS document
        const homeCMS = await HomeCMS.findOneAndUpdate({}, updates, { new: true });
        if (!homeCMS) {
            return res.status(404).json({ message: "HomeCMS not found" });
        }
        res.status(200).json({ message: "HomeCMS updated successfully", homeCMS });
    } catch (error) {
        res.status(500).json({ message: "An error occurred", error: error.message });
    }
};

// Get HomeCMS Data
exports.getHomeCMS = async (req, res) => {
    try {
        const homeCMS = await HomeCMS.findOne();
        if (!homeCMS) return res.status(404).json({ message: "HomeCMS not found" });
        res.status(200).json(homeCMS);
    } catch (error) {
        res.status(500).json({ message: "An error occurred", error: error.message });
    }
};