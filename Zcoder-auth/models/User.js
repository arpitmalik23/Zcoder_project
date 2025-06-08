const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  profileImage: { type: String, default: "" } // <-- Use profileImage
});

module.exports = mongoose.model("User", userSchema);
