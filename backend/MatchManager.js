export default class MatchManager {
  constructor(player1, player2) {
    this[player1.id] = player1;
    this[player2.id] = player2;
    this.ids = [player1.id, player2.id]
    this.switchTurn = this.playerTurnSwitch();
    this.whosGo = this.switchTurn.next().value;
    this.gameHasBegun = false;
  }

  *playerTurnSwitch() {
    let i = 0;

    while(true) {
      if (i > 1) i = 0;
      yield this.whosGo = this.ids[i];
      i++;
    }
  }

  isPlayersTurn(playerId) {
    return this.whosGo === playerId
  }

  playerSetShips(playerId, shipPositions, shotPositions) {
    this[playerId].shipPositions = shipPositions;
    this[playerId].shotPositions = shotPositions;
    this.gameHasBegun = this.ids.every(id => this[id].shipPositions && this[id].shotPositions);
  }

  playerShot(oponentId, fieldId, playerId) {
    this.switchTurn.next();

    if(!!this[oponentId].shipPositions[fieldId - 1].className) {
      this[oponentId].shipPositions[fieldId - 1].className += " hit";
      this[playerId].shotPositions[fieldId - 1].className += " hit";

    } else {
      this[oponentId].shipPositions[fieldId - 1].className += " miss";
      this[playerId].shotPositions[fieldId - 1].className += "miss";
    }
  }

  getPlayerShipPosition(id){
    return this[id].shipPositions
  }

  getPlayerShotPosition(id){
    return this[id].shotPositions
  }
}
