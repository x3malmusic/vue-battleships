<template>
  <div class="board">
    <div class="battleship-grid user">
      <div
        v-for="i in 100"
        :id="i"
        :ref="`user${i}`"
        @mouseover="setPossibleShipHere"
        @click="placeShip"
      ></div>
    </div>
    <div class="battleship-grid computer">
      <div v-for="i in 100" class="board-cell"></div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  name: "Board",
  computed: {
    ...mapState(["currentShip", "direction"]),
  },
  methods: {
    ...mapMutations(["changeShipCount"]),

    setPossibleShipHere(e) {
      const shipPosition = parseInt(e.target.id);

      const cannotPlaceShip = this.checkIfCanPlaceShip(
        shipPosition,
        this.currentShip,
        this.direction
      );

      if (!cannotPlaceShip) {
        if (this.direction) {
          this.placePossibleShip(shipPosition);
        } else this.placePossibleShip(shipPosition, 10);
      }
    },

    placePossibleShip(shipPosition, step = 1) {
      this.clearClassList();
      for (let i = 0; i < this.currentShip.size; i++) {
        let id = shipPosition + i * step;
        this.$refs[`user${id}`][0].className += " possible-ship";
      }
    },

    placeShip(e) {
      if (this.currentShip.count === 0) return;
      this.changeShipCount(this.currentShip);
      const shipPosition = parseInt(e.target.id);
      const step = this.direction ? 1 : 10;
      this.clearClassList();
      for (let i = 0; i < this.currentShip.size; i++) {
        let id = shipPosition + i * step;
        this.$refs[`user${id}`][0].className += ` ${this.currentShip.name}`;
      }
    },

    checkValidPosition(positions, step, shipPosition) {
      for (let i = 0; i < 10; i++) {
        let validPosition = positions.some(
          (pos) => pos + i * step === shipPosition
        );
        if (validPosition) {
          return true;
        }
      }
      return false;
    },

    allowedPositions(possiblePositions, shipSize) {
      return possiblePositions.slice(0, shipSize - 1);
    },

    checkIfCanPlaceShip(shipPosition, ship, horizontal = true) {
      if (ship.size === 1) return;
      const horizontalPos = [10, 9, 8];
      const verticalPos = [91, 81, 71];

      if (horizontal) {
        return this.checkValidPosition(
          this.allowedPositions(horizontalPos, ship.size),
          10,
          shipPosition
        );
      } else
        return this.checkValidPosition(
          this.allowedPositions(verticalPos, ship.size),
          1,
          shipPosition
        );
    },

    clearClassList() {
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
</script>

<style lang="scss">
@import "board";
</style>
