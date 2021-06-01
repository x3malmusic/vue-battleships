import GameManager from "./GameManager";

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

export default function socketHandler(socket, clients) {

  const player = JSON.parse(socket.handshake.query.auth)
  const user = createPlayer(player.name, socket.id, [], []);
  game.addPlayer(user);

  clients.emit("updatePlayers", game.players)
  socket.emit('initUserId', socket.id);

  // TODO make invitations http requests

  socket.on("sendInvitation", (request) => {
    game.addInvitation(request);
    socket.to(request.to.id).emit("gameRequest", request.from);
    clients.emit("updatePlayers", game.players)
  });

  socket.on("cancelInvitation", (request) => {
    game.removeInvitation(request);
    socket.to(request.to.id).emit("gameRequestCanceled", {
      from: request.from,
      playersList: game.players,
    });
    clients.emit("updatePlayers", game.players)
  });

  socket.on("acceptGameRequest", (request) => {
    game.removeInvitation(reverseRequest(request));
    socket.to(request.to.id).emit("gameRequestAccepted", {
      from: request.from,
      playersList: game.players,
    });
    clients.emit("updatePlayers", game.players)
  });

  socket.on("declineGameRequest", (request) => {
    game.removeInvitation(reverseRequest(request));
    socket.to(request.to.id).emit("gameRequestDeclined", {
      from: request.from,
      playersList: game.players,
    });
    clients.emit("updatePlayers", game.players)
  });

  socket.on("findMatch", (player) => {
    const foundPlayer = game.findReadyToPlayPlayers(player.id);

    if (!foundPlayer) return game.addPlayerToReadyToPLayList(player);

    const gameData = game.createMatch(player, foundPlayer);
    socket.emit("matchCreated", { gameData, foundPlayer });
    socket
      .to(foundPlayer.id)
      .emit("matchCreated", { gameData, foundPlayer: player });
  });

  socket.on("connectToMatch" ,(gameId) => {
    socket.join(gameId);
  });

  socket.on("playerSetShips", ({ gameId, playerId, shipPositions, shotPositions }) => {
    game.gameList[gameId].playerSetShips(playerId, shipPositions, shotPositions);
  });

  socket.on("playerShot", ({ gameId, playerId, fieldId, oponentId }) => {
    game.gameList[gameId].playerShot(oponentId, fieldId, playerId);

    socket.to(oponentId).emit("showPlayerShot", game.gameList[gameId].getPlayerShipPosition(oponentId));
    socket.emit("showMyShot", game.gameList[gameId].getPlayerShotPosition(playerId));
  });

  socket.on("disconnect", () => {
    game.removePlayer(socket.id);
    game.deletePlayerFromReadyToPLayList(socket.id);
    socket.broadcast.emit("updatePlayers", game.players);
  });
}
