import mongoose, { Schema, model } from "mongoose";

const userSchema = new Schema({
  name: { type: String, required: [true, "name is required"], unique: true },
  password: { type: String, required: [true, "password is required"] },
  avatar: { type: String, default: "" },
  gameHistory: [{ type: mongoose.Types.ObjectId, ref: "GameHistory" }],
});

export const User = model("User", userSchema);
