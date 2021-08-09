<template>
  <div class="board">
    <div class="battleship-grid user">
      <div
        v-for="cell in playerShips"
        :id="cell.id"
        :class="{[cell.className]: cell.className, occupied: showOccupied(cell.id)}"
        @mouseover="canPlaceShip"
        @mouseleave="deletePossibleShip"
        @click="placeShip"
      />
    </div>
    <div class="battleship-grid enemy">
      <div
        v-for="cell in playerShots"
        @click="makeShot"
        :id="cell.id"
        :class="cell.className"
      />
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
  INITIALIZE_BOARD
} from "../../store/modules/ship";
import { CANNOT_PLACE_SHIP, PLAYER_NOT_READY, SHIPS_ARE_SET_UP } from "../../constants/messages";
import { MAKE_SHOT } from "../../store/mutations";

export default {
  name: "Board",
  data: () => ({
    POSSIBLE_SHIP_CLASS_NAME: " possible-ship",
    cannotPlaceShip: true,
  }),
  computed: {
    ...mapState({
      currentShip: (state) => state.ship.currentShip,
      horizontal: (state) => state.ship.horizontal,
      notAllowedPositions: (state) => state.ship.notAllowedPositions,
      possibleShip: (state) => state.ship.possibleShip,
      playerShips: (state) => state.ship.playerShips,
      playerShots: (state) => state.ship.playerShots,
      playerReadyFlag: (state) => state.ship.playerReadyFlag,
      playerShipsAreSet: (state) => state.ship.playerShipsAreSet,
      occupiedCells: (state) => state.ship.occupiedCells,
      resetShipsSwitch: (state) => state.ship.resetShipsSwitch,
    }),
    ...mapGetters(["getNextShip"]),
  },
  methods: {
    makeShot(e) {
      if (!this.playerReadyFlag) {
        this.$_notify(PLAYER_NOT_READY);
        return;
      }
      this.$store.commit(MAKE_SHOT, e.target.id)
    },

    showOccupied(id) {
      return !!this.occupiedCells.find(cell => cell === id);
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
      this.drawShip(ship, this.horizontal, this.POSSIBLE_SHIP_CLASS_NAME);
    },

    drawShip(ship, horizontal, className) {
      this.deletePossibleShip();

      ship.forEach((id) => {
        this.playerShips.find((cell) => cell.id === id).className += className;
      });

      if (className !== this.POSSIBLE_SHIP_CLASS_NAME) {
        const occupiedCells = this.$_occupyCells(ship, horizontal);
        this.$store.commit(SET_OCCUPIED_CELLS, occupiedCells);
      }
    },

    placeShip() {
      // no ships left, ready to play
      if (this.playerShipsAreSet) {
        this.$_notify(SHIPS_ARE_SET_UP);
        return;
      }

      if (
        this.cannotPlaceShip ||
        this.$_checkOccupiedCells(this.possibleShip, this.occupiedCells)
      ) {
        this.$_notify(CANNOT_PLACE_SHIP);
        return;
      }

      this.$store.commit(CHANGE_SHIP_COUNT, this.currentShip);
      this.drawShip(
        this.possibleShip,
        this.horizontal,
        `${this.currentShip.name}-${this.currentShip.count}`
      );

      if (this.currentShip.count === 0 && this.getNextShip) {
        this.$store.commit(SET_CURRENT_SHIP, this.getNextShip);
      }
    },

    deletePossibleShip() {
      this.playerShips.forEach((cell) => {
        cell.className = cell.className
          .split(" ")
          .filter((name) => name !== this.POSSIBLE_SHIP_CLASS_NAME.trim())
          .join(" ");
      });
    },

  },
  mounted() {
    this.$store.commit(INITIALIZE_BOARD);
  },
};
</script>

<style lang="scss">
@import "board";
</style>
