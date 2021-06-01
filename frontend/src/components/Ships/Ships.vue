<template>
  <div class="ships">
    <app-button @click="playerReady" :disabled="activateReadyButton" :class="{'btn-alive': !activateReadyButton}">
      {{ $t("gamePage.readyBtn") }}
    </app-button>
    <app-button @click="chooseDirection">{{
      $t("gamePage.rotateBtn")
    }}</app-button>
    <app-button @click="resetShips" :disabled="activateResetButton">{{
      $t("gamePage.resetBtn")
    }}</app-button>
    <div class="ships-wrapper">
      <div class="direction">
        {{ $t("gamePage.direction") }}: {{ currentDirection }}
      </div>
      <div v-for="ship in ships" :key="ship.name" class="ship-wrapper">
        <div class="ships-wrapper-left">
          {{ $t("gamePage.left") }}: {{ ship.count }}
        </div>
        <div class="ship" :class="ship.name + chosenShip(ship.name)">
          <div
            v-for="deck in ship.size"
            class="cell"
            :key="ship.name + deck"
            :id="ship.name"
            @click="setCurrentShip(ship)"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import {
  SET_CURRENT_SHIP,
  SET_DIRECTION,
  SET_NOT_ALLOWED_POSITIONS,
  SET_PLAYER_READY_FLAG,
  SET_PLAYER_SHIPS_ARE_SET,
  SET_RESET_SHIPS,
} from "../../store/modules/ship";
import { PLAYER_READY_TO_BEGIN_MATCH } from "../../store/mutations";
import AppButton from "../Button/AppButton";

export default {
  name: "Ships",
  components: {
    AppButton,
  },
  computed: {
    ...mapState({
      ships: (state) => state.ship.ships,
      currentShip: (state) => state.ship.currentShip,
      horizontal: (state) => state.ship.horizontal,
      resetShipsSwitch: (state) => state.ship.resetShipsSwitch,
      playerReadyFlag: (state) => state.ship.playerReadyFlag,
      game: (state) => state.game,
      playerId: (state) => state.player.id,
    }),

    currentDirection() {
      return this.horizontal
        ? this.$t("gamePage.horizontal")
        : this.$t("gamePage.vertical");
    },

    activateReadyButton() {
      return !!this.ships.reduce((count, ship) => (count += ship.count), 0);
    },

    activateResetButton() {
      return (
        this.playerReadyFlag ||
        this.ships.reduce((count, ship) => (count += ship.count), 0) === 10
      );
    },
  },
  watch: {
    currentShip() {
      this.reCalculateNotAllowedPositions();
    },

    ships() {
      if (!this.activateReadyButton) {
        this.$_notify(this.$t("messages.playerReady"));
        setTimeout(() => {
          this.$_notify(this.$t(`messages.clickReset`));
        }, 2000)
        this.$store.commit(SET_PLAYER_SHIPS_ARE_SET, true);
      }
    },
  },
  methods: {
    setCurrentShip(ship) {
      this.$store.commit(SET_CURRENT_SHIP, ship);
    },

    playerReady() {
      this.$store.commit(SET_PLAYER_READY_FLAG, true);
      this.$store.commit(PLAYER_READY_TO_BEGIN_MATCH);
    },

    chosenShip(ship) {
      return ship === this.currentShip.name ? " current-ship" : "";
    },

    chooseDirection() {
      this.$store.commit(SET_DIRECTION, !this.horizontal);
      this.reCalculateNotAllowedPositions();
    },

    resetShips() {
      this.$store.commit(SET_RESET_SHIPS, !this.resetShipsSwitch);
    },

    reCalculateNotAllowedPositions() {
      this.$store.commit(
        SET_NOT_ALLOWED_POSITIONS,
        this.$_calculateNotAllowedPositions(
          this.horizontal,
          this.currentShip.size
        )
      );
    },
  },

  mounted() {
    this.reCalculateNotAllowedPositions();
  },
};
</script>

<style lang="scss">
@import "ships";
</style>
