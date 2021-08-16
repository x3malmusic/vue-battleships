import process from "process";
import { DATABASE_ERROR } from "./helpers/errorTypes";
import { connectDB } from "./database";
import { updateGameResult, updateTotalStats } from "./services/dbService";

process.on("message", async (data) => {
  try {
    await connectDB()
    const lastGame = await updateGameResult(data)
    const totalStats = await updateTotalStats(data)
    process.send({ lastGame, totalStats })
  } catch (e) {
    console.log(e)
    process.send({ error: DATABASE_ERROR })
  }
})