const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`.magenta.underline);
  } catch (error) {
    console.log(`Error: ${error.message}`.red.italic);
    process.exit();
  }
};

module.exports = connectDB;
