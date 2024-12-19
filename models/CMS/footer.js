const mongoose = require("mongoose");

const FooterCMSchema = new mongoose.Schema({
    logo: { type: String, required: false },
    quickContacts: {
        phone: { type: String, required: false },
        email: { type: String, required: false },
        address: { type: String, required: false },
    },
    recentArticles: [
        {
            title: { type: String, required: false },
            date: { type: String, required: false },
        },
    ],
    ourCompany: [
        {
            name: { type: String, required: false },
            link: { type: String, required: false },
        },
    ],
    ourServices: [
        { name: { type: String, required: false } },
    ],
    copyrightText: { type: String, required: false },
});


module.exports = mongoose.model("FooterCMS", FooterCMSchema);