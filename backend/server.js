import express from "express";
import socketio from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./database";
import socketHandler from "./socket";

const app = express();
dotenv.config();
connectDB();

app.use(express.json({ extended: true }));

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json({ extended: true }));

const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

const io = socketio(server);

// io.use((socket, next) => {
//   console.log(socket.handshake.query);
//   next();
// });

io.on("connection", (socket) => {
  socketHandler(socket);
});
