import express from "express";
import http from "http";
import socketio from "socket.io";
import GameManager from "./GameManager";

export const app = express();
export const server = http.createServer(app);
const io = socketio(server);

const game = new GameManager();

io.on("connection", (socket) => {
  socket.on("login", (player, cb) => {
    if (!player.name || !player.password) {
      //return error
      return;
    } else {
      game.addPlayer({ name: player.name, id: socket.id });
      cb(game.players);
      socket.broadcast.emit("updatePlayers", game.players);
    }
  });

  socket.on("playerLeft", (cb) => {
    game.removePlayer(socket.id);
    socket.broadcast.emit("updatePlayers", game.players);
  });

  socket.on("disconnect", (cb) => {
    game.removePlayer(socket.id);
    socket.broadcast.emit("updatePlayers", game.players);
  });
});

export default {
  app,
  server,
};
