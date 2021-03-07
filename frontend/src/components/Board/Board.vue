<template>
  <div class="board">
    <div class="battleship-grid user">
      <div
        v-for="cell in playerCells"
        :id="cell.id"
        :class="cell.className"
        @mouseover="canPlaceShip"
        @mouseleave="deletePossibleShip"
        @click="placeShip"
      />
    </div>
    <div class="battleship-grid enemy" ref="enemyBoard">
      <div v-for="i in 100" @click="makeShot" />
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import {
  CHANGE_SHIP_COUNT,
  SET_CURRENT_SHIP,
  SET_OCCUPIED_CELLS,
  SET_POSSIBLE_SHIP,
} from "../../store/modules/ship";

export default {
  name: "Board",
  data: () => ({
    POSSIBLE_SHIP_CLASS_NAME: " possible-ship",
    playerCells: [],
    cannotPlaceShip: true,
  }),
  computed: {
    ...mapState({
      currentShip: (state) => state.ship.currentShip,
      horizontal: (state) => state.ship.horizontal,
      notAllowedPositions: (state) => state.ship.notAllowedPositions,
      possibleShip: (state) => state.ship.possibleShip,
      playerReadyFlag: (state) => state.ship.playerReadyFlag,
      playerShipsAreSet: (state) => state.ship.playerShipsAreSet,
      occupiedCells: (state) => state.ship.occupiedCells,
      resetShipsSwitch: (state) => state.ship.resetShipsSwitch,
    }),
    ...mapGetters(["getNextShip"]),
  },
  watch: {
    resetShipsSwitch() {
      this.playerCells = [];
      this.drawBoard(this.playerCells);
    },
  },
  methods: {
    makeShot(e) {
      if (!this.playerReadyFlag) {
        this.$_notify(this.$t("messages.playerNotReady"));
        return;
      }
      e.target.className = "hit";
    },

    drawPossibleShip(shipPosition, shipSize, horizontal) {
      // if horizontal then we draw cells one after one
      // if not then we draw each 10-th from current
      const step = horizontal ? 1 : 10;
      const ship = [];

      for (let i = 0; i < shipSize; i++) {
        let id = shipPosition + i * step;
        ship.push(id);
      }

      return ship;
    },

    canPlaceShip(e) {
      // player ships are set, we dont want to bombard our store with
      // unnecessary actions and checks
      if (this.playerShipsAreSet) return;

      const shipPosition = parseInt(e.target.id);

      const ship = this.drawPossibleShip(
        shipPosition,
        this.currentShip.size,
        this.horizontal
      );

      this.$store.commit(SET_POSSIBLE_SHIP, ship);

      this.cannotPlaceShip = this.$_checkIfCanPlaceShip(
        shipPosition,
        this.notAllowedPositions
      );

      if (
        this.cannotPlaceShip ||
        ship.some((id) => id > 100) ||
        this.$_checkOccupiedCells(this.possibleShip, this.occupiedCells)
      )
        return;
      else this.drawShip(ship, this.horizontal, this.POSSIBLE_SHIP_CLASS_NAME);
    },

    drawShip(ship, horizontal, className) {
      this.deletePossibleShip();

      ship.forEach((id) => {
        this.playerCells.find((cell) => cell.id === id).className += className;
      });

      if (className !== this.POSSIBLE_SHIP_CLASS_NAME) {
        const occupiedCells = [...this.$_occupyCells(ship)];
        this.$store.commit(SET_OCCUPIED_CELLS, occupiedCells);
      }
    },

    placeShip() {
      // no ships left, ready to play
      if (this.playerShipsAreSet) {
        this.$_notify(this.$t(`messages.shipsAreSetUp`));
        // TODO looks like watch is asynchronous
        // this.$_notify(this.$t(`messages.clickReset`));
        return;
      }

      if (
        this.cannotPlaceShip ||
        this.$_checkOccupiedCells(this.possibleShip, this.occupiedCells)
      ) {
        this.$_notify(this.$t(`messages.cannotPlaceShip`));
        return;
      }

      this.$store.commit(CHANGE_SHIP_COUNT, this.currentShip);
      this.drawShip(
        this.possibleShip,
        this.horizontal,
        ` ${this.currentShip.name}`
      );

      // TODO save player ship here!

      if (this.currentShip.count === 0 && this.getNextShip) {
        this.$store.commit(SET_CURRENT_SHIP, this.getNextShip);
      }
    },

    deletePossibleShip() {
      this.playerCells.forEach((cell) => {
        cell.className = cell.className
          .split(" ")
          .filter((name) => name !== this.POSSIBLE_SHIP_CLASS_NAME.trim())
          .join(" ");
      });
    },

    drawBoard(arr) {
      for (let i = 1; i < 101; i++) {
        arr.push({ className: "", id: i });
      }
    },
  },
  mounted() {
    this.drawBoard(this.playerCells);
  },
};
</script>

<style lang="scss">
@import "board";
</style>
