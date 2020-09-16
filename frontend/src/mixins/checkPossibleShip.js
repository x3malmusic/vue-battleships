export default {
  methods: {
    $_checkIfCanPlaceShip(shipPosition, ship, horizontal) {
      //fix next line
      if (ship.size === 1) return false;
      const horizontalPos = [10, 9, 8];
      const verticalPos = [91, 81, 71];

      const positions = horizontal ? horizontalPos : verticalPos;
      const step = horizontal ? 10 : 1;

      return this.$_checkPosition(
        this.$_allowedPositions(positions, ship.size),
        step,
        shipPosition
      );
    },

    $_checkPosition(positions, step, shipPosition) {
      //check occupied cells first
      // if (this.checkOccupiedCells(shipPosition)) return true;

      for (let i = 0; i < 10; i++) {
        let validPosition = positions.some(
          (pos) => pos + i * step === shipPosition
        );
        if (validPosition) {
          //cannot place ship here
          return true;
        }
      }
      return false;
    },

    $_allowedPositions(possiblePositions, shipSize) {
      return possiblePositions.slice(0, shipSize - 1);
    },
  },
};
