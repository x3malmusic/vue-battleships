export default {
  methods: {
    $_drawShip(shipPosition, horizontal, className, shipIsReal = false) {
      const step = horizontal ? 1 : 10;
      const drawedShip = [];
      this.$_deletePossibleShip();

      if (
        shipIsReal &&
        this.$_checkOccupiedCells(this.$store.state.possibleShip)
      )
        return;

      for (let i = 0; i < this.currentShip.size; i++) {
        let id = shipPosition + i * step;
        drawedShip.push(id);
        if (shipIsReal) {
          const occupiedCells = [...this.$_occupyCells(id)];
          this.$store.commit("setOccupiedCells", occupiedCells);
        }
        this.$refs[`user${id}`][0].className += className;
      }
      this.$store.commit("setPossibleShip", drawedShip);
      if (this.$_checkOccupiedCells(this.$store.state.possibleShip))
        this.$_deletePossibleShip();
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

    $_checkOccupiedCells(possibleShip) {
      //find in the store
      for (let i = 0; i < possibleShip.length; i++) {
        const found = this.$store.state.occupiedCells.some(
          (cell) => cell === possibleShip[i]
        );
        if (found) return true;
      }
      return false;
    },

    $_deletePossibleShip() {
      for (let i = 1; i < 101; i++) {
        let possibleShip = this.$refs[`user${i}`][0];

        possibleShip.className = possibleShip.className
          .split(" ")
          .filter((c) => c !== "possible-ship")
          .join(" ");
      }
    },
  },
};
