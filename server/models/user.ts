import mongoose from "mongoose";

const Schema = mongoose.Schema;
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  target: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  grade: {
    type: Number,
    min: 9,
    max: 12,
  },
  score: {
    type: Number,
    default: 0,
  },
  alive: {
    type: Boolean,
    default: true,
  },
});

export const UserSchema = mongoose.model("User", userSchema);
