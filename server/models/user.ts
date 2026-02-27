import mongoose, { type InferSchemaType, Schema } from "mongoose";

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
  weekScore: {
    type: Number,
    required: true,
    default: 0,
  },
});

export type User = InferSchemaType<typeof userSchema>;

export const UserSchema = mongoose.model("User", userSchema);
