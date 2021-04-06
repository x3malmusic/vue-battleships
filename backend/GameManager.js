export default class GameManager {
  constructor() {
    this.players = [];
    // this.players = {};
  }

  playersList() {
    return Object.values(this.players)
  }

  addPlayer(player) {
    this.players.push(player);
    // this.players[player.id] = player;
  }

  removePlayer(id) {
    // delete this.players[id];
    this.players = this.players.filter((player) => player.id !== id);
  }

  addInvitation(request) {
    // this.players[request.to.id] = [...this.players[request.to.id].to, request.to.id]
    // this.players[request.from.id] = [...this.players[request.from.id].from, request.from.id]
    this.players = this.players.map((player) => {
      if (player.id === request.to.id)
        return {
          ...player,
          from: [...player.from, request.from.id],
        };
      else if (player.id === request.from.id)
        return {
          ...player,
          to: [...player.to, request.to.id],
        };
      else return player;
    });
  }

  removeInvitation(request) {
    this.players = this.players.map((player) => {
      if (player.id === request.to.id)
        return {
          ...player,
          from: player.from.filter((id) => id !== request.from.id),
        };
      else if (player.id === request.from.id)
        return {
          ...player,
          to: player.to.filter((id) => id !== request.to.id),
        };
      else return player;
    });
  }
}
