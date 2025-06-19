const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const colors = require('colors')


const app = express();
// app.use(cors());
dotenv.config();
connectDB();

app.get('/api',(req,res) => {
    res.send("API is Running");
})

const PORT = process.env.PORT || 5002;

app.listen(PORT,console.log(`Server Started on Port ${PORT}`.blue.bold));