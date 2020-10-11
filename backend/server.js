import { app, server } from "./socket";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});