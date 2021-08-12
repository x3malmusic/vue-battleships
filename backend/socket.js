import GameManager from "./GameManager";
import {
  PLAYER_SEND_REQUEST,
  PLAYER_CANCEL_REQUEST,
  PLAYER_ACCEPTED_GAME_REQUEST,
  PLAYER_DECLINED_GAME_REQUEST,
  YOUR_NEXT_ENEMY,
  OPPONENT_NOT_READY,
  NOT_YOUR_TURN,
  CELL_ALREADY_SHOT,
  WIN_BY_DISCONNECT
} from "./constants/messages";
import {
  UPDATE_PLAYERS,
  INIT_USER_ID,
  SEND_INVITATION,
  CANCEL_INVITATION,
  ACCEPT_GAME_REQUEST,
  DECLINE_GAME_REQUEST,
  SYSTEM_MESSAGE,
  FIND_MATCH,
  MATCH_CREATED,
  CONNECT_TO_MATCH,
  DISCONNECT_FROM_GAME,
  GAME_OVER,
  GAME_OVER_BY_DISCONNECT,
  SHOW_PLAYER_SHOT,
  SHOW_MY_SHOT,
  PLAYER_SHOT,
  PLAYER_SET_SHIPS,
  PLAYERS_READY_TO_PLAY
} from "./constants/socket_events";

const game = new GameManager();

const createPlayer = (name, id, dbId) => ({
  name,
  id,
  from: [],
  to: [],
  gameId: "",
  dbId,
});

const reverseRequest = (request) => ({
  from: request.to,
  to: request.from,
});

export default function socketHandler(socket, clients) {

  const player = JSON.parse(socket.handshake.query.auth);
  const user = createPlayer(player.name, socket.id, player.userId);
  game.addPlayer(user);

  clients.emit(UPDATE_PLAYERS, game.playersList());
  socket.emit(INIT_USER_ID, socket.id);


  socket.on(SEND_INVITATION, (request) => {
    game.addInvitation(request);
    socket.to(request.to.id).emit(SYSTEM_MESSAGE, { name: request.from.name, type: PLAYER_SEND_REQUEST });

    const playersList = game.playersList();
    socket.to(request.to.id).emit(UPDATE_PLAYERS, playersList);
    socket.emit(UPDATE_PLAYERS, playersList);
  });

  socket.on(CANCEL_INVITATION, (request) => {
    game.removeInvitation(request);
    socket.to(request.to.id).emit(SYSTEM_MESSAGE, { name: request.from.name, type: PLAYER_CANCEL_REQUEST });

    const playersList = game.playersList();
    socket.to(request.to.id).emit(UPDATE_PLAYERS, playersList);
    socket.emit(UPDATE_PLAYERS, playersList);
  });

  socket.on(ACCEPT_GAME_REQUEST, (request) => {
    game.removeInvitation(reverseRequest(request));
    socket.to(request.to.id).emit(SYSTEM_MESSAGE, { name: request.from.name, type: PLAYER_ACCEPTED_GAME_REQUEST });

    const playersList = game.playersList();
    socket.to(request.to.id).emit(UPDATE_PLAYERS, playersList);
    socket.emit(UPDATE_PLAYERS, playersList);

    const player1 = game.getPlayerById(request.from.id);
    const player2 = game.getPlayerById(request.to.id);

    const gameData = game.createMatch(player1, player2);

    socket.to(request.to.id).emit(SYSTEM_MESSAGE, { name: request.from.name, type: YOUR_NEXT_ENEMY });
    socket.emit(SYSTEM_MESSAGE, { name: request.to.name, type: YOUR_NEXT_ENEMY });

    socket.emit(MATCH_CREATED, { gameData, foundPlayer: player2 });
    socket
      .to(player2.id)
      .emit(MATCH_CREATED, { gameData, foundPlayer: player1 });
  });

  socket.on(DECLINE_GAME_REQUEST, (request) => {
    game.removeInvitation(reverseRequest(request));
    socket.to(request.to.id).emit(SYSTEM_MESSAGE, { name: request.from.name, type: PLAYER_DECLINED_GAME_REQUEST });

    const playersList = game.playersList();
    socket.to(request.to.id).emit(UPDATE_PLAYERS, playersList);
    socket.emit(UPDATE_PLAYERS, playersList);
  });

  socket.on(FIND_MATCH, (player) => {
    const foundPlayer = game.findReadyToPlayPlayers(player.id);

    if (!foundPlayer) return game.addPlayerToReadyToPLayList(player);

    const gameData = game.createMatch(player, foundPlayer);

    socket.to(foundPlayer.id).emit(SYSTEM_MESSAGE, { name: player.name, type: YOUR_NEXT_ENEMY });
    socket.emit(SYSTEM_MESSAGE, { name: foundPlayer.name, type: YOUR_NEXT_ENEMY });

    socket.emit(MATCH_CREATED, { gameData, foundPlayer });
    socket.to(foundPlayer.id).emit(MATCH_CREATED, { gameData, foundPlayer: player });
  });

  socket.on(CONNECT_TO_MATCH, (gameId) => {
    socket.join(gameId);
  });

  socket.on(DISCONNECT_FROM_GAME, (gameId) => {
    socket.leave(gameId);
    game.players[socket.id].gameId = "";

    if (!clients.adapter.rooms[gameId]) delete game.gameList[gameId];
  });

  socket.on(PLAYER_SET_SHIPS, ({ gameId, playerId, shipPositions, shotPositions }) => {
    const playersReadyToPlay = game.gameList[gameId].playerSetShips(playerId, shipPositions, shotPositions);

    if (playersReadyToPlay) clients.to(gameId).emit(PLAYERS_READY_TO_PLAY, game.gameList[gameId].whosGo);
  });

  socket.on(PLAYER_SHOT, ({ gameId, playerId, fieldId, oponentId }) => {
    const currentGame = game.gameList[gameId];

    if (!currentGame.gameHasBegun) return socket.emit(SYSTEM_MESSAGE, { type: OPPONENT_NOT_READY });

    if (!currentGame.isPlayersTurn(playerId)) return socket.emit(SYSTEM_MESSAGE, { type: NOT_YOUR_TURN });

    if (currentGame.hasPreviouslyShot(playerId, fieldId)) return socket.emit(SYSTEM_MESSAGE, { type: CELL_ALREADY_SHOT });

    const shotResult = currentGame.playerShot(oponentId, fieldId, playerId);

    if (shotResult) socket.emit(SYSTEM_MESSAGE, { type: shotResult });

    if (!currentGame.playerHasShipsAlive(oponentId)) {
      currentGame.gameOver();
      clients.to(gameId).emit(GAME_OVER, { winnerId: playerId, gameHasBegun: false, gameIsOver: true });
    };

    const whosGo = shotResult ? currentGame.whosGo : currentGame.nextTurn();

    socket.to(oponentId).emit(SHOW_PLAYER_SHOT, { board: currentGame.getPlayerShipPosition(oponentId), whosGo });
    socket.emit(SHOW_MY_SHOT, { shots: currentGame.getPlayerShotPosition(playerId), whosGo });
  });

  socket.on("disconnect", () => {
    if (game.isPlayerInGame(socket.id)) {
      const gameId = game.players[socket.id].gameId;

      const currentGame = game.gameList[gameId];
      currentGame.gameOver();

      const secondPlayerId = currentGame.getSecondPlayer(socket.id);
      socket.to(secondPlayerId).emit(SYSTEM_MESSAGE, { type: WIN_BY_DISCONNECT });
      socket.to(secondPlayerId).emit(GAME_OVER_BY_DISCONNECT, { gameHasBegun: false, gameIsOver: true });

      socket.leave(gameId);
      if (!clients.adapter.rooms[gameId]) delete game.gameList[gameId];
    }

    game.removePlayer(socket.id);
    game.deletePlayerFromReadyToPLayList(socket.id);

    socket.broadcast.emit(UPDATE_PLAYERS, game.playersList());
  });
}
