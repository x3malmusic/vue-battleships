import express from "express";
import http from "http";
import socketio from "socket.io";
import GameManager from "./GameManager";

export const app = express();
export const server = http.createServer(app);
const io = socketio(server);

const game = new GameManager();

const createPlayer = (name, id, from, to) => ({
  name,
  id,
  from,
  to,
});

io.on("connection", (socket) => {
  socket.on("login", (player, cb) => {
    if (!player.name || !player.password) {
      //return error
      return;
    } else {
      //login
      const user = createPlayer(player.name, socket.id, [], []);
      game.addPlayer(user);
      cb({
        playersList: game.players,
        user: {
          name: player.name,
          id: socket.id,
        },
      });
      socket.broadcast.emit("updatePlayers", game.players);
    }
  });

  socket.on("register", (player, cb) => {
    if (!player.name || !player.password) {
      //return error
      return;
    } else {
      //register
      game.addPlayer({ name: player.name, id: socket.id });
      cb(game.players);
      socket.broadcast.emit("updatePlayers", game.players);
    }
  });

  socket.on("sendInvitation", (request, cb) => {
    game.addInvitation(request);
    socket.to(request.to.id).emit("gameRequest", request.from);
    cb({ playersList: game.players });
    socket.broadcast.emit("updatePlayers", game.players);
  });

  socket.on("cancelInvitation", (request, cb) => {
    game.removeInvitation(request);
    socket.to(request.to.id).emit("gameRequestCanceled", {
      from: request.from,
      playersList: game.players,
    });
    cb({ playersList: game.players });
    socket.broadcast.emit("updatePlayers", game.players);
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
