const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const userRoute = require('./routes/userRoute');
const bodyParser = require("body-parser");
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use("/user", userRoute);

const PORT = process.env.PORT
const MONGO_URI = process.env.MONGO_URI

mongoose.connect(MONGO_URI).then(()=>{
    app.listen(PORT,()=>{
    console.log(`server is running on: ${PORT}`);
})
console.log("database connected");
})