import { asyncHandler } from "../middlewares/async";
import { getLastGame, getTotalStats } from "../services/dbService";

export const getUserLastGame = asyncHandler(async (req, res, next) => {
  const { userId } = req.user
  const lastGame = await getLastGame(userId)
  res.json(lastGame)
})

export const getUserTotalStats = asyncHandler(async (req, res, next) => {
  const { userId } = req.user
  const totalStats = await getTotalStats(userId);
  res.json(totalStats)
})