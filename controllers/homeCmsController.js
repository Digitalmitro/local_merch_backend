const HomeCMS = require('../models/CMS/homecms');

exports.createHomeCMS = async (req, res) => {
    try {
        const data = req.body;
        if (req.files) {
            if (req.files.carousel) {
                data.carousel = req.files.carousel.map((file) => ({
                    imageUrl: `uploads/${file.filename}`,
                    altText: data.altText || "",
                }));
            }
            console.log(req.files)
            if (req.files.popularCategories) {
                data.popularCategories = JSON.parse(data.popularCategories).map((category, index) => ({
                    ...category,
                    imageUrl: `uploads/${req.files.popularCategories[index].filename}`,
                }));
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
        const { id } = req.params; 
        const data = req.body;
      
        if (!id) {
            return res.status(400).json({ message: "ID is required" });
        }
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
            if (req.files.browseByProductImages) {
                updates.$set = updates.$set || {};
                updates.$set["browseByProduct.products"] = req.files.browseByProductImages.map((file, index) => ({
                    ...data.products[index],
                    imageUrl: `uploads/${file.filename}`,
                }));
            }
        }

        if (data.portfolio) {
            updates.$set = updates.$set || {};
            updates.$set["portfolio.title"] = data.portfolio.title;
            updates.$set["portfolio.paragraph"] = data.portfolio.paragraph;
            updates.$set["portfolio.buttonText"] = data.portfolio.buttonText;
        }

        if (data.browseByProduct) {
            updates.$set = updates.$set || {};
            updates.$set["browseByProduct.heading"] = data.browseByProduct.heading;
            updates.$set["browseByProduct.paragraph"] = data.browseByProduct.paragraph;
        }

        if (data.browseByState) {
            updates.$set = updates.$set || {};
            updates.$set["browseByState.heading"] = data.browseByState.heading;
            updates.$set["browseByState.states"] = data.browseByState.states;
        }

        // Update HomeCMS document
        const homeCMS = await HomeCMS.findByIdAndUpdate(id, updates, { new: true });
        if (!homeCMS) {
            return res.status(404).json({ message: "HomeCMS not found" });
        }
        res.status(200).json({ message: "HomeCMS updated successfully", homeCMS });
    } catch (error) {
        res.status(500).json({ message: "An error occurred", error: error.message });
    }
}
// exports.updateFile = async (req, res) => {
//     try {
//         const { homeCMSId, objectId } = req.params;
//         const { arrayName } = req.body;

//         if (!homeCMSId || !objectId || !arrayName) {
//             return res.status(400).json({ message: "homeCMSId, objectId, and arrayName are required." });
//         }

//         if (!req.file) {
//             return res.status(400).json({ message: "New image file is required." });
//         }

//         const imageUrl = `uploads/${req.file.filename}`; // Assuming Multer is used to handle file uploads.

//         // Find the document by ID
//         const document = await HomeCMS.findById(homeCMSId);

//         if (!document) {
//             return res.status(404).json({ message: "HomeCMS document not found." });
//         }

//         // Check if the array exists
//         if (!document[arrayName] || !Array.isArray(document[arrayName])) {
//             return res.status(400).json({ message: `Array ${arrayName} does not exist in the document.` });
//         }

//         // Find the specific object by objectId
//         const targetObject = document[arrayName].id(objectId);

//         if (!targetObject) {
//             return res.status(404).json({ message: "Object not found in the specified array." });
//         }

//         // Replace the image URL
//         targetObject.imageUrl = imageUrl;

//         // Save the updated document
//         await document.save();

//         res.status(200).json({ message: "Image replaced successfully.", updatedObject: targetObject });
//     } catch (error) {
//         res.status(500).json({ message: "An error occurred.", error: error.message });
//     }
// };

exports.updateHomeCMSField = async (req, res) => {
    try {
        const { homeCMSId, fieldId } = req.params;  
        const data = req.body;
        if (!homeCMSId || !fieldId) {
            return res.status(400).json({ message: "HomeCMS ID and Field ID are required" });
        }
        const homeCMS = await HomeCMS.findById(homeCMSId);
        if (!homeCMS) {
            return res.status(404).json({ message: "HomeCMS not found" });
        }
       
        if (req.files && req.files.carousel) {
            const updatedCarousel = req.files.carousel.map((file) => ({
                imageUrl: `uploads/${file.filename}`,
                altText: data.altText || "",
            }));

            // Find and update the specific carousel image by fieldId
            const carouselIndex = homeCMS.carousel.findIndex((item) => item._id.toString() === fieldId);
            if (carouselIndex !== -1) {
                homeCMS.carousel[carouselIndex] = updatedCarousel[0];  // Replace the old carousel item
            } else {
                return res.status(404).json({ message: "Carousel item not found" });
            }
        }
       
        if (req.files && req.files.popularCategories) {
            const updatedCategories = JSON.parse(data.popularCategories).map((category, index) => ({
                ...category,
                imageUrl: `uploads/${req.files.popularCategories[index].filename}`,
            }));

            // Find and update the specific popular category by fieldId
            const categoryIndex = homeCMS.popularCategories.findIndex((category) => category._id.toString() === fieldId);
            if (categoryIndex !== -1) {
                homeCMS.popularCategories[categoryIndex] = updatedCategories[0];  // Replace the old category
            } else {
                return res.status(404).json({ message: "Popular category not found" });
            }
        }
        // If the portfolio field is being updated
        if (req.files && req.files.portfolio) {
            if (fieldId === "portfolio") {
                homeCMS.portfolio.imageUrl = `uploads/${req.files.portfolio[0].filename}`;
            } else {
                return res.status(404).json({ message: "Portfolio field ID not found" });
            }
        }
        // If the browseByProduct field is being updated
        if (req.files && req.files.browseByProductImages) {
            const updatedProducts = req.files.browseByProductImages.map((file, index) => ({
                ...data.products[index],
                imageUrl: `uploads/${file.filename}`,
            }));

            const productIndex = homeCMS.browseByProduct.products.findIndex((product) => product._id.toString() === fieldId);
            if (productIndex !== -1) {
                homeCMS.browseByProduct.products[productIndex] = updatedProducts[0];  // Replace the old product
            } else {
                return res.status(404).json({ message: "Product not found" });
            }
        }
        // If updating browseByState fields
        if (data.browseByState) {
            const stateIndex = homeCMS.browseByState.states.findIndex((state) => state._id.toString() === fieldId);
            if (stateIndex !== -1) {
                homeCMS.browseByState.states[stateIndex] = data.browseByState.states[0];  // Replace the state
            } else {
                return res.status(404).json({ message: "State not found" });
            }
        }

        // Save the updated HomeCMS document
        await homeCMS.save();
        res.status(200).json({ message: "HomeCMS field updated successfully", homeCMS });
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