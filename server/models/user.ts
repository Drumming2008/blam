const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  target: String,
  grade: {
    type: Number,
    min: 9,
    max: 12,
  },
  score: Number,
});

module.exports = mongoose.model("User", userSchema);
