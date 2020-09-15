<template>
  <div class="ships">
    <app-button @click="setDirection(!direction)">Rotate ships</app-button>
    <div class="ships-wrapper">
      <div class="direction">Current Direction: {{ currentDirection }}</div>
      <div v-for="ship in ships" :key="ship.name" class="ship-wrapper">
        <div class="ships-wrapper-left">Left: {{ ship.count }}</div>
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
    ...mapState(["ships", "currentShip", "direction"]),

    currentDirection() {
      return this.direction ? "Horizontal" : "Vertical";
    },
  },
  methods: {
    ...mapMutations(["setCurrentShip", "setDirection"]),

    chosenShip(ship) {
      return ship === this.currentShip.name ? " current-ship" : "";
    },
  },
};
</script>

<style lang="scss">
@import "ships";
</style>
