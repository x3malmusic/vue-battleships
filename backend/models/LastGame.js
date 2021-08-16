import mongoose, { Schema, model } from "mongoose";

const gameSchema = new Schema({
  shots: { type: Number, default: 0 },
  hit: { type: Number, default: 0 },
  miss: { type: Number, default: 0 },
  win: { type: Boolean, default: false },
  bullseye: { type: Boolean, default: false },
  opponent: { type: String, default: "" },
  user: { type: mongoose.Types.ObjectId, ref: "User" },
});

export const LastGame = model("LastGame", gameSchema);
