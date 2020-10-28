import express from "express";
import http from "http";
import socketio from "socket.io";
import { register, login } from "./controllers/auth";
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

const reverseRequest = (request) => ({
  from: request.to,
  to: request.from,
});

io.on("connection", (socket) => {
  socket.on("login", async (player, cb) => {
    try {
      const loggedUser = await login(player);
      const user = createPlayer(loggedUser.name, socket.id, [], []);
      game.addPlayer(user);
      cb({
        playersList: game.players,
        user: {
          name: player.name,
          id: socket.id,
          token: loggedUser.token,
        },
      });
      socket.broadcast.emit("updatePlayers", game.players);
    } catch (e) {
      socket.emit("ERROR", {
        text: e.message,
        id: Date.now().toLocaleString(),
      });
    }
  });

  socket.on("register", async (player, cb) => {
    try {
      const registeredUser = await register(player);
      const user = createPlayer(registeredUser.name, socket.id, [], []);
      game.addPlayer(user);
      cb({
        playersList: game.players,
        user: {
          name: user.name,
          id: socket.id,
          token: registeredUser.token,
        },
      });
      socket.broadcast.emit("updatePlayers", game.players);
    } catch (e) {
      socket.emit("ERROR", {
        text: e.message,
        id: Date.now().toLocaleString(),
      });
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

  socket.on("acceptGameRequest", (request, cb) => {
    game.removeInvitation(reverseRequest(request));
    socket.to(request.to.id).emit("gameRequestAccepted", {
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
