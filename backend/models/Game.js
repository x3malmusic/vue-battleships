import mongoose, { Schema, model } from "mongoose";

const gameSchema = new Schema({
  shots: { type: Number, default: 0 },
  miss: { type: Number, default: 0 },
  win: { type: Boolean, default: false },
  bullseye: { type: Boolean, default: false },
  user: { type: mongoose.Types.ObjectId, ref: "User" },
});

export const Game = model("Game", gameSchema);
