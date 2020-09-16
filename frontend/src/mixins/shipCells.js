export default {
  methods: {
    $_drawShip(shipPosition, horizontal, className, shipIsReal = false) {
      const step = horizontal ? 1 : 10;
      for (let i = 0; i < this.currentShip.size; i++) {
        let id = shipPosition + i * step;
        if (shipIsReal) {
          // add drawed ships here

          const occupiedCells = [...this.$_occupyCells(id)];
          this.$store.commit("setOccupiedCells", occupiedCells);
        }
        this.$refs[`user${id}`][0].className += className;
      }
    },

    $_conditions(atRightEdge, cell) {
      return atRightEdge ? cell % 10 === 0 : cell % 10 === 1;
    },

    $_canOccupyCell(cell, ...rest) {
      const newOccupiedCells = [];
      const atRightEdge = cell % 10 === 1;
      rest.forEach((c) => {
        const condition = this.$_conditions(atRightEdge, c);
        if (c <= 0 || condition || c > 100) return;
        else newOccupiedCells.push(c);
      });

      return newOccupiedCells;
    },

    $_occupyCells(cell) {
      const stage = -10;
      const resultCells = [];

      for (let i = 0; i < 3; i++) {
        let possibleCell = cell + (stage + i * 10);
        const result = this.$_canOccupyCell(
          cell,
          possibleCell - 1,
          possibleCell,
          possibleCell + 1
        );
        resultCells.push(...result);
      }

      return [...resultCells];
    },

    $_checkOccupiedCells(shipPosition) {
      //find in the store
      return this.occupiedCells.some((cell) => cell === shipPosition);
    },
  },
};
