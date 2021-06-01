export default class MatchManager {
  constructor(player1, player2) {
    this[player1.id] = player1;
    this[player2.id] = player2;
  }

  *nextGo() {
    while(true){
      yield this[player1.id];
      yield this[player2.id];
    }
  }

  playerSetShips(playerId, shipPositions, shotPositions) {
    this[playerId].shipPositions = shipPositions;
    this[playerId].shotPositions = shotPositions;
  }

  playerShot(oponentId, fieldId, playerId) {
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
