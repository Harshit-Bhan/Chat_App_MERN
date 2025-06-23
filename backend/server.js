const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const colors = require('colors')
const userRoutes = require('./routes/userRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json())
connectDB();

app.get('/',(req,res) => {
    res.send("API is Running");
})

app.use(notFound);
app.use(errorHandler);

app.use('/api/user',userRoutes)

const PORT = process.env.PORT || 5002;

app.listen(PORT,console.log(`Server Started on Port ${PORT}`.blue.bold));