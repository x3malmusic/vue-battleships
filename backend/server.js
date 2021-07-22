import express from "express";
import socketio from "socket.io";
import httpServer from 'http';
import fs from "fs";
import dotenv from "dotenv";
import cors from "cors";

import verifyToken from "./helpers/jwtVerify";
import authRoutes from "./routes/authRoutes";
import uploadRoutes from "./routes/uploadRoutes";
import errorHandler from "./middlewares/errorHandler";
import { avatarTempPath } from "./constants";
import { connectDB } from "./database";
import socketHandler from "./socket";

if (!fs.existsSync(avatarTempPath)) {
  fs.mkdirSync(avatarTempPath);
}

const app = express();
const server = httpServer.createServer(app);

dotenv.config();
connectDB();

app.use(express.json({ extended: true }));

app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/avatar', uploadRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 8000;

const io = socketio(server, { path: '/socket.io' });

const clients = io.sockets;

io.use(async (socket, next) => {
  const jwtError = await verifyToken(socket.handshake.query.auth)
  if(jwtError) return next(new Error(jwtError));
  next()
});

server.listen(PORT, () => {
  console.log(`Socket server is running on ${PORT}`);
});

io.on("connection", (socket) => {
  socketHandler(socket, clients);
});