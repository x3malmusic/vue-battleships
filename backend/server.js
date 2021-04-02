import express from "express";
import socketio from "socket.io";
import httpServer from 'http';
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/authRoutes";
import errorHandler from "./middlewares/errorHandler";
import { connectDB } from "./database";
import socketHandler from "./socket";

const app = express();
const server = httpServer.createServer(app);

dotenv.config();
connectDB();

app.use(express.json({ extended: true }));

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use('/api/auth', authRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 8000;

const io = socketio(server, { path: '/socket.io' });

// io.use((socket, next) => {
//   console.log(socket.handshake.query);
//   next();
// });

server.listen(PORT, () => {
  console.log(`Socket server is running on ${PORT}`);
});

io.on("connection", (socket) => {
  console.log('conn')

  socket.on("disconnecting", (reason) => {
    console.log('disconnect');
  });

  socketHandler(socket);
});