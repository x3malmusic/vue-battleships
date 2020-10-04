export default {
  setCurrentShip(state, ship) {
    state.currentShip = ship;
  },

  setDirection(state, horizontal) {
    state.horizontal = horizontal;
  },

  changeShipCount(state, ship) {
    state.ships = this.state.ships.map((stateShip) => {
      if (stateShip.name === ship.name && stateShip.count !== 0) {
        const newShip = {
          ...stateShip,
          count: stateShip.count - 1,
        };
        state.currentShip = newShip;
        return newShip;
      }
      return stateShip;
    });
  },

  setOccupiedCells(state, cells) {
    state.occupiedCells = [...new Set([...state.occupiedCells, ...cells])];
  },

  setPossibleShip(state, possibleShip) {
    state.possibleShip = possibleShip;
  },

  setPlayerShips(state, ship) {
    const newShip = { [ship.name]: [...ship.positions] };
    state.playerShips = { ...state.playerShips, newShip };
  },

  setNotAllowedPositions(state, positions) {
    state.notAllowedPositions = positions;
  },

  setPlayerReadyFlag(state, flag) {
    state.playerReadyFlag = flag;
  },

  setSystemMessage(state, message) {
    state.systemMessage = message;
  },

  setUser(state, player) {
    state.player = player;
  },

  SOCKET_updatePlayers(state, players) {
    state.playersOnline = players;
  },
};
