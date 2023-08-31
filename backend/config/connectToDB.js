const mongoose = require("mongoose");
//important makes every file able to read .env file variables
require("dotenv").config();

module.exports = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB ^_^");
  } catch (error) {
    console.log("Connection failed to mongoDB", error);
  }
};
