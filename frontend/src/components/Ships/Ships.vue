<template>
  <div class="ships">
    <app-button @click="playerReady" :disabled="activateReadyButton">
      {{ $t("game.readyBtn") }}
    </app-button>
    <app-button @click="chooseDirection">{{ $t("game.rotateBtn") }}</app-button>
    <div class="ships-wrapper">
      <div class="direction">
        {{ $t("game.direction") }}: {{ currentDirection }}
      </div>
      <div v-for="ship in ships" :key="ship.name" class="ship-wrapper">
        <div class="ships-wrapper-left">
          {{ $t("game.left") }}: {{ ship.count }}
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
  SET_SYSTEM_MESSAGE,
} from "../../store/modules/ship";
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
    }),

    currentDirection() {
      return this.horizontal
        ? this.$t("game.horizontal")
        : this.$t("game.vertical");
    },

    activateReadyButton() {
      return !!this.ships.reduce((count, ship) => (count += ship.count), 0);
    },
  },
  watch: {
    currentShip() {
      this.reCalculateNotAllowedPositions();
    },

    ships() {
      if (!this.activateReadyButton) {
        this.$_notify(this.$t("messages.playerReady"));
      }
    },
  },
  methods: {
    setCurrentShip(ship) {
      this.$store.commit(SET_CURRENT_SHIP, ship);
    },

    playerReady() {
      this.$store.commit(SET_PLAYER_READY_FLAG, true);
      //send to backend that u're ready to play
    },

    chosenShip(ship) {
      return ship === this.currentShip.name ? " current-ship" : "";
    },

    chooseDirection() {
      this.$store.commit(SET_DIRECTION, !this.horizontal);
      this.reCalculateNotAllowedPositions();
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
