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

  const player = JSON.parse(socket.handshake.query.auth)
  const user = createPlayer(player.name, socket.id, [], []);
  game.addPlayer(user);
  socket.broadcast.emit("updatePlayers", game.players);
  socket.emit("updatePlayers", game.players);
  socket.emit('initUserId', socket.id);


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

  socket.on("disconnect", () => {
    game.removePlayer(socket.id);
    match.deletePlayerFromReadyToPLayList(socket.id);
    socket.broadcast.emit("updatePlayers", game.players);
  });
}
