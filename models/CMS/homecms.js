const mongoose = require("mongoose");

const HomeCMSchema = new mongoose.Schema(  {
    carousel: [
        {
            imageUrl: { type: String, required: false },
            altText: { type: String, default: "" },
        },
    ],
    popularCategories: [
        {
            categoryName: { type: String, required: false },
            Description: { type: String, required: false },
            imageUrl: { type: String, required: false },
        },
    ],
    portfolio: {
        title: { type: String, required: false },
        paragraph: { type: String, required: false },
        imageUrl: { type: String, required: false },
        buttonText: { type: String, default: "Our Portfolio" },
    },
    browseByProduct: {
        heading: { type: String, required: false },
        paragraph: { type: String, required: false },
        products: [
            {
                productName: { type: String, required: false },
                imageUrl: { type: String, required: false },
            },
        ],
    },
    browseByState: {
        heading: { type: String, required: false },
        states: [
            {
                stateName: { type: String, required: false },
            },
        ],
    },
});

module.exports = mongoose.model("HomeCMS", HomeCMSchema);
