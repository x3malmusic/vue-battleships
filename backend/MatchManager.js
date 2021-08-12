import { HIT, MISS, SUNK, shipsLeftTemplate } from "./constants";

export default class MatchManager {
  constructor(player1, player2) {
    this[player1.id] = player1;
    this[player2.id] = player2;
    this.ids = [player1.id, player2.id];
    this.switchTurn = this.playerTurnSwitch();
    this.whosGo = this.nextTurn();
    this.gameHasBegun = false;
    this.gameIsOver = false;
  }

  gameOver() {
    this.gameIsOver = true;
  }

  getSecondPlayer(playerId) {
    return this.ids.filter(id => id !== playerId)[0];
  }

  *playerTurnSwitch() {
    let i = 0;

    while(true) {
      if (i > 1) i = 0;
      yield this.whosGo = this.ids[i];
      i++;
    }
  }

  nextTurn() {
    return this.switchTurn.next().value;
  }

  isPlayersTurn(playerId) {
    return this.whosGo === playerId;
  }

  hasPreviouslyShot(playerId, fieldId) {
    const regEx = new RegExp(`(${HIT}|${MISS})`, "gi");
    return this[playerId].shotPositions[fieldId].className.match(regEx);
  }

  playerHasShipsAlive(playerId) {
    return Object.values(this[playerId].shipsLeft).reduce((acc, positions) => acc += positions.length, 0);
  }

  changePlayerShipStatus(playerId, shipName, cellId) {
    const filterdPositions = this[playerId].shipsLeft[shipName].filter(pos => pos !== cellId)
    this[playerId].shipsLeft[shipName] = filterdPositions;
    return filterdPositions.length;
  }

  playerSetShips(playerId, shipPositions, shotPositions) {
    this[playerId].shipPositions = shipPositions;
    this[playerId].shotPositions = shotPositions;

    const template = shipsLeftTemplate();
    this[playerId].shipsLeft = shipPositions.reduce((acc, item) => {
      if (item.className) {
        acc[item.className.trim()].push(item.id)
      }
      return acc
    }, template);

    return this.gameHasBegun = this.ids.every(id => this[id].shipPositions && this[id].shotPositions);
  }

  playerShot(oponentId, fieldId, playerId) {
    if (this.gameIsOver) return;

    if(!!this[oponentId].shipPositions[fieldId].className) {
      const shipName = this[oponentId].shipPositions[fieldId].className.trim();
      const enemyShipStatus = this.changePlayerShipStatus(oponentId, shipName, fieldId + 1);

      this[oponentId].shipPositions[fieldId].className += ` ${HIT}`;
      this[playerId].shotPositions[fieldId].className += ` ${HIT}`;
      return enemyShipStatus !== 0 ? HIT : SUNK;
    } else {
      this[oponentId].shipPositions[fieldId].className += ` ${MISS}`;
      this[playerId].shotPositions[fieldId].className += ` ${MISS}`;
    }
  }

  getPlayerShipPosition(id){
    return this[id].shipPositions;
  }

  getPlayerShotPosition(id){
    return this[id].shotPositions;
  }
}
