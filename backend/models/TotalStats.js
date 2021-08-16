import mongoose, { Schema, model } from "mongoose";

const totalStatsSchema = new Schema({
  shots: { type: Number, default: 0 },
  hit: { type: Number, default: 0 },
  miss: { type: Number, default: 0 },
  totalMatches: { type: Number, default: 0 },
  wins: { type: Number, default: 0 },
  losses: { type: Number, default: 0 },
  bullseye: { type: Number, default: 0 },
  winrate: { type: String, default: '100%' },
  user: { type: mongoose.Types.ObjectId, ref: "User" },
});

export const TotalStats = model("TotalStats", totalStatsSchema);
