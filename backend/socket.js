import GameManager from "./GameManager";

const game = new GameManager();

const createPlayer = (name, id) => ({
  name,
  id,
  from: [],
  to: [],
  gameId: "",
});

const reverseRequest = (request) => ({
  from: request.to,
  to: request.from,
});

export default function socketHandler(socket, clients) {

  const player = JSON.parse(socket.handshake.query.auth);
  const user = createPlayer(player.name, socket.id);
  game.addPlayer(user);

  clients.emit("updatePlayers", game.playersList());
  socket.emit('initUserId', socket.id);


  socket.on("sendInvitation", (request) => {
    game.addInvitation(request);
    socket.to(request.to.id).emit("gameRequest", request.from);

    const playersList = game.playersList();
    socket.to(request.to.id).emit("updatePlayers", playersList);
    socket.emit("updatePlayers", playersList);
  });

  socket.on("cancelInvitation", (request) => {
    game.removeInvitation(request);
    socket.to(request.to.id).emit("gameRequestCanceled", {
      from: request.from,
    });

    const playersList = game.playersList();
    socket.to(request.to.id).emit("updatePlayers", playersList);
    socket.emit("updatePlayers", playersList);
  });

  socket.on("acceptGameRequest", (request) => {
    game.removeInvitation(reverseRequest(request));
    socket.to(request.to.id).emit("gameRequestAccepted", {
      from: request.from,
    });

    const playersList = game.playersList();
    socket.to(request.to.id).emit("updatePlayers", playersList);
    socket.emit("updatePlayers", playersList);

    const player1 = game.getPlayerById(request.from.id);
    const player2 = game.getPlayerById(request.to.id);

    const gameData = game.createMatch(player1, player2);
    socket.emit("matchCreated", { gameData, foundPlayer: player2 });
    socket
      .to(player2.id)
      .emit("matchCreated", { gameData, foundPlayer: player1 });
  });

  socket.on("declineGameRequest", (request) => {
    game.removeInvitation(reverseRequest(request));
    socket.to(request.to.id).emit("gameRequestDeclined", {
      from: request.from,
    });

    const playersList = game.playersList();
    socket.to(request.to.id).emit("updatePlayers", playersList);
    socket.emit("updatePlayers", playersList);
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

  socket.on("disconnectFromGame", (gameId) => {
    socket.leave(gameId);
    game.players[socket.id].gameId = "";

    if (!clients.adapter.rooms[gameId]) delete game.gameList[gameId];
  });

  socket.on("playerSetShips", ({ gameId, playerId, shipPositions, shotPositions }) => {
    const playersReadyToPlay = game.gameList[gameId].playerSetShips(playerId, shipPositions, shotPositions);

    if (playersReadyToPlay) clients.to(gameId).emit("playersReadyToPlay", game.gameList[gameId].whosGo);
  });

  socket.on("playerShot", ({ gameId, playerId, fieldId, oponentId }) => {
    if (!game.gameList[gameId].gameHasBegun) return socket.emit("systemMessage", "oponentNotReady");

    if (!game.gameList[gameId].isPlayersTurn(playerId)) return socket.emit("systemMessage", "notYourTurn");

    if (game.gameList[gameId].hasPreviouslyShot(playerId, fieldId)) return socket.emit("systemMessage", "cellAlreadyShot");

    const shotResult = game.gameList[gameId].playerShot(oponentId, fieldId, playerId);

    if (shotResult) socket.emit("systemMessage", shotResult);

    if (!game.gameList[gameId].playerHasShipsAlive(oponentId)) {
      game.gameList[gameId].gameOver();
      clients.to(gameId).emit("gameOver", { winnerId: playerId, gameHasBegun: false, gameIsOver: true });
    };

    const whosGo = shotResult ? game.gameList[gameId].whosGo : game.gameList[gameId].switchTurn.next().value;

    socket.to(oponentId).emit("showPlayerShot", { board: game.gameList[gameId].getPlayerShipPosition(oponentId), whosGo });
    socket.emit("showMyShot", { shots: game.gameList[gameId].getPlayerShotPosition(playerId), whosGo });
  });

  socket.on("disconnect", () => {
    if (game.isPlayerInGame(socket.id)) {
      const gameId = game.players[socket.id].gameId;
      game.gameList[gameId].gameOver();

      const secondPlayerId = game.gameList[gameId].getSecondPlayer(socket.id);
      socket.to(secondPlayerId).emit("systemMessage", "winByDisconnect");
      socket.to(secondPlayerId).emit("gameOverByDisconnect", { gameHasBegun: false, gameIsOver: true });

      socket.leave(gameId);
      if (!clients.adapter.rooms[gameId]) delete game.gameList[gameId];
    }

    game.removePlayer(socket.id);
    game.deletePlayerFromReadyToPLayList(socket.id);

    socket.broadcast.emit("updatePlayers", game.playersList());
  });
}
