const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

const app = express();
// app.use(cors());
dotenv.config();

app.get('/api',(req,res) => {
    res.send("API is Running");
})

const PORT = process.env.PORT || 5002;

app.listen(PORT,console.log(`Server Started on Port ${PORT}`));