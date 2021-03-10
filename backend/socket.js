import { register, login } from "./controllers/auth";
import GameManager from "./GameManager";
import MatchManager from "./MatchManager";

const game = new GameManager();
const match = new MatchManager();

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

export default function socketHandler(socket) {
  // socket.use((packet, next) => {
  //   console.log("handler");
  //   next();
  // });

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

  socket.on("declineGameRequest", (request, cb) => {
    game.removeInvitation(reverseRequest(request));
    socket.to(request.to.id).emit("gameRequestDeclined", {
      from: request.from,
      playersList: game.players,
    });
    cb({ playersList: game.players });
    socket.broadcast.emit("updatePlayers", game.players);
  });

  socket.on("findMatch", (player) => {
    const foundPlayer = match.findReadyToPlayPlayers(player.id);
    if (foundPlayer) {
      const gameData = match.createMatch(player, foundPlayer);
      socket.emit("matchCreated", { gameData, foundPlayer });
      socket
        .to(foundPlayer.id)
        .emit("matchCreated", { gameData, foundPlayer: player });
    } else {
      match.addPlayerToReadyToPLayList(player);
    }
  });

  socket.on("playerLeft", () => {
    game.removePlayer(socket.id);
    match.deletePlayerFromReadyToPLayList(socket.id);
    socket.broadcast.emit("updatePlayers", game.players);
  });

  socket.on("disconnect", () => {
    game.removePlayer(socket.id);
    match.deletePlayerFromReadyToPLayList(socket.id);
    socket.broadcast.emit("updatePlayers", game.players);
  });
}
