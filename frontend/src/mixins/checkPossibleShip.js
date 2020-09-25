export default {
  methods: {
    $_checkIfCanPlaceShip(shipPosition, ship, horizontal) {
      // if (this.$_checkOccupiedCells(this.$store.state.possibleShip))
      //   return true;
      if (ship.size === 1) return false;

      const horizontalPos = [10, 9, 8];
      const verticalPos = [91, 81, 71];

      const positions = horizontal ? horizontalPos : verticalPos;
      const step = horizontal ? 10 : 1;

      if (
        this.$_checkPosition(
          this.$_allowedPositions(positions, ship.size),
          step,
          shipPosition
        )
      )
        return true;

      return false;
    },

    $_checkPosition(positions, step, shipPosition) {

      for (let i = 0; i < 10; i++) {
        let notAllowedPosition = positions.some(
          (pos) => pos + i * step === shipPosition
        );
        if (notAllowedPosition) {
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
