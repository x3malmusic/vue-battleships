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

  // TODO make invitations db requests

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

  socket.on("connectToMatch", (gameId) => {
    socket.join(gameId);
  });

  socket.on("playerSetShips", ({ gameId, playerId, shipPositions, shotPositions }) => {
    const playersReadyToPlay = game.gameList[gameId].playerSetShips(playerId, shipPositions, shotPositions);

    if (playersReadyToPlay) clients.to(gameId).emit("playersReadyToPlay", game.gameList[gameId].whosGo);
  });

  socket.on("playerShot", ({ gameId, playerId, fieldId, oponentId }) => {
    if (!game.gameList[gameId].gameHasBegun) return socket.emit("oponentNotReady");

    if (!game.gameList[gameId].isPlayersTurn(playerId)) return socket.emit("notYourTurn");

    if (game.gameList[gameId].hasPreviouslyShot(playerId, fieldId)) return socket.emit("fieldWasAlreadyShot");

    game.gameList[gameId].playerShot(oponentId, fieldId, playerId);

    if (!game.gameList[gameId].playerHasShipsAlive(oponentId)) {
      clients.to(gameId).emit("gameOver", { winnerId: playerId, gameHasBegun: false })
    }

    const whosGo = game.gameList[gameId].whosGo;

    socket.to(oponentId).emit("showPlayerShot", { board: game.gameList[gameId].getPlayerShipPosition(oponentId), whosGo });
    socket.emit("showMyShot", { shots: game.gameList[gameId].getPlayerShotPosition(playerId), whosGo });
  });

  socket.on("disconnect", () => {
    game.removePlayer(socket.id);
    game.deletePlayerFromReadyToPLayList(socket.id);
    socket.broadcast.emit("updatePlayers", game.players);
  });
}
