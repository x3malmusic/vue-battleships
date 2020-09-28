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
import { mapState, mapMutations } from "vuex";
import AppButton from "../Button/AppButton";

export default {
  name: "Ships",
  components: {
    AppButton,
  },
  computed: {
    ...mapState(["ships", "currentShip", "horizontal"]),

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
        this.setSystemMessage({
          text: this.$t("game.messages.playerReady"),
          id: Date.now().toLocaleString(),
        });
      }
    },
  },
  methods: {
    ...mapMutations([
      "setCurrentShip",
      "setDirection",
      "setNotAllowedPositions",
      "setPlayerReadyFlag",
      "setSystemMessage",
    ]),

    playerReady() {
      this.setPlayerReadyFlag(true);
      //send to backend that u're ready to play
    },

    chosenShip(ship) {
      return ship === this.currentShip.name ? " current-ship" : "";
    },

    chooseDirection() {
      this.setDirection(!this.horizontal);
      this.reCalculateNotAllowedPositions();
    },

    reCalculateNotAllowedPositions() {
      this.setNotAllowedPositions(
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
