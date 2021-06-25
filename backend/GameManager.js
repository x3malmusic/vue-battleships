import MatchManager from "./MatchManager";

export default class GameManager {
  constructor() {
    this.players = {};
    this.readyToPlayList = {};
    this.gameList = {};
  }

  isPlayerInGame(id) {
    return !!this.players[id].gameId;
  }

  getPlayerById(id) {
    return this.players[id];
  }

  playersList() {
    return Object.values(this.players);
  }

  addPlayer(player) {
    this.players[player.id] = player;
  }

  removePlayer(id) {
    delete this.players[id];
  }

  addInvitation(request) {
    this.players[request.to.id].from.push(request.from.id);
    this.players[request.from.id].to.push(request.to.id);
  }

  removeInvitation(request) {
    this.players[request.from.id].to = this.players[request.from.id].to.filter((id) => id !== request.to.id);
    this.players[request.to.id].from = this.players[request.to.id].from.filter((id) => id !== request.from.id);
  }

  addPlayerToReadyToPLayList(player) {
    if (!player.id) return;
    this.readyToPlayList[player.id] = player;
  }

  deletePlayerFromReadyToPLayList(id) {
    delete this.readyToPlayList[id];
  }

  findReadyToPlayPlayers(id) {
    if (Object.keys(this.readyToPlayList).length) {
      const players = Object.keys(this.readyToPlayList).filter(
        (playerId) => playerId !== id
      );
      const foundPlayer = players.length ? players[0] : false;
      return this.readyToPlayList[foundPlayer];
    } else return false;
  }

  createMatch(player1, player2) {
    const gameId = Date.now();
    this.gameList[gameId] = new MatchManager(player1, player2);

    this.players[player1.id].gameId = gameId;
    this.players[player2.id].gameId = gameId;

    this.deletePlayerFromReadyToPLayList(player1.id);
    this.deletePlayerFromReadyToPLayList(player2.id);


    return { gameId, gameData: { [player1.id]: player1, [player2.id]: player2 } };
  }
}
