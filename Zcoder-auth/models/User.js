const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
    image: { type: String, default: "" } // <-- Add this line
});

module.exports = mongoose.model("User", userSchema);
