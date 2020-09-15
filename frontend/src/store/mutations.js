export default {
  setCurrentShip(state, ship) {
    state.currentShip = ship;
  },

  setDirection(state, direction) {
    state.direction = direction;
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
};
