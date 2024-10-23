const mongoose = require("mongoose");
const colors= require('colors');

const mongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("MongoDB is Connected".bgGreen);
  } 
  catch (err) {
    console.log("MongoDB connection error:", err.message.bgRed);
    process.exit(1);
  }
};
module.exports = mongoDB;
