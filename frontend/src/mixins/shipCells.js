export default {
  methods: {
    $_conditions(atLeftEdge, cell) {
      return atLeftEdge ? cell % 10 === 0 : cell % 10 === 1;
    },

    $_canOccupyCell(cell, atLeftEdge, ...rest) {
      const newOccupiedCells = [];
      rest.forEach((c) => {
        const condition = this.$_conditions(atLeftEdge, c);
        if (c <= 0 || condition || c > 100) return;
        else newOccupiedCells.push(c);
      });

      return newOccupiedCells;
    },

    $_occupyCells(ship) {
      const stage = -10;
      const stageMultiply = 10;
      const stageCount = 3;
      const resultCells = [];
      const atLeftEdge = ship[0] % 10 === 1;

      for (let x = 0; x < ship.length; x++) {
        for (let i = 0; i < stageCount; i++) {
          let possibleCell = ship[x] + (stage + i * stageMultiply);
          const result = this.$_canOccupyCell(
            ship[i],
            atLeftEdge,
            possibleCell - 1,
            possibleCell,
            possibleCell + 1
          );
          resultCells.push(...result);
        }
      }

      return [...resultCells];
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
