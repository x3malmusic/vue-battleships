import MatchManager from "./MatchManager";

export default class GameManager {
  constructor() {
    this.players = [];
    this.readyToPlayList = {};
    this.gameList = {};
  }

  playersList() {
    return Object.values(this.players);
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
    this.deletePlayerFromReadyToPLayList(player1.id);
    this.deletePlayerFromReadyToPLayList(player2.id);
    return { gameId, gameData: { [player1.id]: player1, [player2.id]: player2 } };
  }
}
