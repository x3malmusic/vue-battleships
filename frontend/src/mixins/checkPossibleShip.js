export default {
  methods: {
    $_checkIfCanPlaceShip(shipPosition, notAllowedPositions) {
      return notAllowedPositions.some((pos) => pos === shipPosition);
    },

    $_calculateNotAllowedPositions(horizontal, shipSize) {
      const horizontalPos = [10, 9, 8];
      const verticalPos = [91, 81, 71];

      const positions = horizontal ? horizontalPos : verticalPos;
      const step = horizontal ? 10 : 1;

      return this.$_notAllowedPositions(positions, step, shipSize);
    },

    $_notAllowedPositions(positionMultiply, step, shipSize) {
      const resultPositions = [];
      if (shipSize === 1) return resultPositions;

      const newPossiblePositions = positionMultiply.slice(0, shipSize - 1);

      for (let i = 0; i < 10; i++) {
        for (let x = 0; x < shipSize - 1; x++) {
          let id = newPossiblePositions[x] + i * step;
          resultPositions.push(id);
        }
      }

      return resultPositions;
    },
  },
};
