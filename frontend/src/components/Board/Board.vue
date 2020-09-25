<template>
  <div class="board">
    <div class="battleship-grid user">
      <div
        v-for="i in 100"
        :id="i"
        :ref="`user${i}`"
        @mouseover="canYouPlacePossibleShipHere"
        @mouseleave="deletePossibleShip"
        @click="placeShip"
      />
    </div>
    <div class="battleship-grid computer">
      <div v-for="i in 100" class="board-cell" />
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from "vuex";

export default {
  name: "Board",
  data: () => ({
    cannotPlaceShip: true,
    occupiedCells: [],
  }),
  computed: {
    ...mapState(["currentShip", "horizontal"]),
    ...mapGetters(["getNextShip"]),
  },
  methods: {
    ...mapMutations(["changeShipCount", "setCurrentShip"]),

    canYouPlacePossibleShipHere(e) {
      const shipPosition = parseInt(e.target.id);

      this.cannotPlaceShip = this.$_checkIfCanPlaceShip(
        shipPosition,
        this.currentShip,
        this.horizontal
      );

      if (this.cannotPlaceShip) return;
      else
        this.$_drawShip(shipPosition, this.horizontal, " possible-ship", false);
    },

    placeShip(e) {
      if (this.cannotPlaceShip) return;

      //no ships left, ready to play
      if (this.currentShip.count === 0) return;

      this.changeShipCount(this.currentShip);
      const shipPosition = parseInt(e.target.id);
      this.$_drawShip(
        shipPosition,
        this.horizontal,
        ` ${this.currentShip.name}`,
        true
      );
      if (this.currentShip.count === 0 && this.getNextShip) {
        this.setCurrentShip(this.getNextShip);
      }
    },

    deletePossibleShip() {
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
