import { asyncHandler } from "../middlewares/async";
import { getGameHistory, saveGameResult } from "../services/dbService";

export const getUserGameHistory = asyncHandler(async (req, res, next) => {
  const { userId } = req.user
  const gameHistory = await getGameHistory(userId)
  res.json(gameHistory)
})

export const saveUserGameResult = asyncHandler(async (req, res, next) => {
  const { userId } = req.user
  const game = req.body
  const gameResult = await saveGameResult({ ...game, userId });
  res.json(gameResult)
})