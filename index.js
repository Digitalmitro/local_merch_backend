const express = require("express")
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require('./routes/authRoutes')
const  connectDB  = require("./config/db")
require("dotenv").config()
connectDB()

const app = express()
const port = process.env.PORT
app.use(express.json());
app.use(cors())
app.use('/uploads', express.static('public/uploads'));

app.use('/api/auth', authRoutes);

app.get('/', (req,res) => {
    res.send("hello")
})

app.listen(port, () => {
    console.log(`server is running ${port}`)
})