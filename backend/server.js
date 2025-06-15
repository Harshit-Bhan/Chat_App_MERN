const express = require('express');
const dotenv = require('dotenv');

const app = express();
dotenv.config();

app.get('/',(req,res) => {
    res.send("API is Running");
})

const PORT = process.env.PORT || 5002;

app.listen(PORT,console.log(`Server Started on Port ${PORT}`));