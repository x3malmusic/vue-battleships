export default class GameManager {
  constructor() {
    this.players = [];
  }

  addPlayer(player) {
    this.players.push(player);
  }

  removePlayer(id) {
    this.players = this.players.filter((player) => player.id !== id);
  }

  addInvitation(request) {
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
