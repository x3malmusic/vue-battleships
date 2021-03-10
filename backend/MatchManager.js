export default class MatchManager {
  constructor() {
    this.readyToPlayList = {};
    this.gameList = [];
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
    this.gameList[gameId] = { [player1.id]: player1, [player2.id]: player2 };
    this.deletePlayerFromReadyToPLayList(player1.id);
    this.deletePlayerFromReadyToPLayList(player2.id);
    return this.gameList[gameId];
  }
}
