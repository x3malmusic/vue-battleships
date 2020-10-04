export default class GameManager {
  constructor() {
    this.players = [];
  }

  addPlayer(player) {
    if (!this.findPlayer(player.name)) {
      this.players.push(player);
    }
  }

  removePlayer(id) {
    this.players = this.players.filter((player) => player.id !== id);
  }

  findPlayer(playerName) {
    return this.players.find((player) => player.name === playerName);
  }
}
