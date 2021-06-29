export default {
  methods: {
    $_addCells(cell, num) {
      return [cell - num, cell, cell + num];
    },

    $_atLeftEdge(cell) {
      return cell % 10 === 1;
    },

    $_atRightEdge(cell) {
      return cell % 10 === 0;
    },

    $_occupyCells(ship, horizontal) {
      const directionMultiply = horizontal ? 10 : 1;
      let resultCells = [];

      if (horizontal) {
        for (let x = 0; x < ship.length; x++) {
          const firstCell = x === 0;
          const atLeftEdge = firstCell && this.$_atLeftEdge(ship[0]);

          const lastCell = x === ship.length - 1;
          const atRightEdge = lastCell && this.$_atRightEdge(ship[ship.length - 1]);

          const firstCellPositions = firstCell && !atLeftEdge && this.$_addCells(ship[0] - 1, directionMultiply);
          const lastCellPositions = lastCell && !atRightEdge && this.$_addCells(ship[ship.length - 1] + 1, directionMultiply);
          const cellPositions = this.$_addCells(ship[x], directionMultiply);

          const firstPos = firstCellPositions || [];
          const lastPos = lastCellPositions || [];

          resultCells = [...resultCells, ...firstPos, ...cellPositions, ...lastPos];
        }
      } else {
        const atLeftEdge = this.$_atLeftEdge(ship[0]);
        const atRightEdge = this.$_atRightEdge(ship[ship.length - 1]);

        for (let x = 0; x < ship.length; x++) {
          const firstCell = x === 0;
          const lastCell = x === ship.length - 1;

          let firstCellPositions = [];
          let lastCellPositions = [];
          let cellPositions = [];

          if (firstCell) {
            if (atLeftEdge) firstCellPositions = [ship[x], ship[x] - 10, ship[x] - 9];
            else if (atRightEdge) firstCellPositions = [ship[x], ship[x] - 10, ship[x] - 11];
            else firstCellPositions = this.$_addCells(ship[0] - 10, directionMultiply);
          }

          if (lastCell) {
            if (atLeftEdge) lastCellPositions = [ship[x], ship[x] + 10, ship[x] + 11];
            else if (atRightEdge) lastCellPositions = [ship[x], ship[x] + 10, ship[x] + 9];
            else lastCellPositions = this.$_addCells(ship[x] + 10, directionMultiply);
          }

          const leftEdgePos = atLeftEdge ? [ship[x], ship[x] + 1] : [];
          const rightEdgePos = atRightEdge ? [ship[x] - 1, ship[x]] : [];

          if (!atLeftEdge && !atRightEdge) cellPositions = this.$_addCells(ship[x], directionMultiply);

          resultCells = [...resultCells, ...firstCellPositions, ...leftEdgePos, ...rightEdgePos, ...cellPositions, ...lastCellPositions];
        }
      }
      return resultCells.filter(c => c <= 100 && c > 0);
    },

    $_checkOccupiedCells(possibleShip, occupiedCells) {
      //find in the store
      for (let i = 0; i < possibleShip.length; i++) {
        const found = occupiedCells.some((cell) => cell === possibleShip[i]);
        if (found) return true;
      }
      return false;
    },
  },
};
