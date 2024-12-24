const express = require("express")
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require('./routes/authRoutes')
const  connectDB  = require("./config/db")
const CMSRoutes = require('./routes/cmsRoutes')
const productRoutes = require('./routes/productRouter')
const shopRoutes = require('./routes/shopRoutes')
require("dotenv").config()
connectDB()

const app = express()
const port = process.env.PORT
app.use(express.json());
app.use(cors());

app.use('/uploads', express.static('public/uploads'));
app.use('/api/auth', authRoutes);
app.use("/api/cms", CMSRoutes);
app.use("/api", productRoutes);
app.use("/api", shopRoutes);
// app.use("/api/cms", CMSRoutes);
app.get('/', (req,res) => {
    res.send("hello")
})

app.listen(port, () => {
    console.log(`server is running ${port}`)
})