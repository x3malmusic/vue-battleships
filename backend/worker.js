import process from "process";
import { DATABASE_ERROR } from "./helpers/errorTypes";
import { connectDB } from "./database";
import { saveGameResult } from "./services/dbService";

process.on("message", async (data) => {
  try {
    await connectDB()
    const result = await saveGameResult(data)
    process.send(result)
  } catch (e) {
    process.send({ error: DATABASE_ERROR })
  }
})