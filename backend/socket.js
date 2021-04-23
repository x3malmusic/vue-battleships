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

export default function socketHandler(socket, clients) {

  const player = JSON.parse(socket.handshake.query.auth)
  const user = createPlayer(player.name, socket.id, [], []);
  game.addPlayer(user);

  clients.emit("updatePlayers", game.players)
  socket.emit('initUserId', socket.id);


  socket.on("sendInvitation", (request, cb) => {
    game.addInvitation(request);
    socket.to(request.to.id).emit("gameRequest", request.from);
    clients.emit("updatePlayers", game.players)
  });

  socket.on("cancelInvitation", (request, cb) => {
    game.removeInvitation(request);
    socket.to(request.to.id).emit("gameRequestCanceled", {
      from: request.from,
      playersList: game.players,
    });
    clients.emit("updatePlayers", game.players)
  });

  socket.on("acceptGameRequest", (request, cb) => {
    game.removeInvitation(reverseRequest(request));
    socket.to(request.to.id).emit("gameRequestAccepted", {
      from: request.from,
      playersList: game.players,
    });
    clients.emit("updatePlayers", game.players)
  });

  socket.on("declineGameRequest", (request, cb) => {
    game.removeInvitation(reverseRequest(request));
    socket.to(request.to.id).emit("gameRequestDeclined", {
      from: request.from,
      playersList: game.players,
    });
    clients.emit("updatePlayers", game.players)
  });

  socket.on("findMatch", (player) => {
    const foundPlayer = match.findReadyToPlayPlayers(player.id);

    if (!foundPlayer) return match.addPlayerToReadyToPLayList(player);

    const gameData = match.createMatch(player, foundPlayer);
    socket.emit("matchCreated", { gameData, foundPlayer });
    socket
      .to(foundPlayer.id)
      .emit("matchCreated", { gameData, foundPlayer: player });
  });

  socket.on("connectToMatch" ,(gameId) => {
    socket.join(gameId);
  });

  socket.on("playerSetShips", ({ gameId, playerId, shipPositions }) => {
    console.log(match.gameList)
    console.log(gameId)
    match.gameList[gameId][playerId].shipPositions = shipPositions;
  });

  socket.on("playerShot", ({ gameId, playerId, shots }) => {
    match.gameList[gameId][playerId].shots = shots;
  });

  socket.on("disconnect", () => {
    game.removePlayer(socket.id);
    match.deletePlayerFromReadyToPLayList(socket.id);
    socket.broadcast.emit("updatePlayers", game.players);
  });
}
