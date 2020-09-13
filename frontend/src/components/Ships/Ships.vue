<template>
  <div class="ships">
    <app-button @click="setDirection(!direction)">Rotate ships</app-button>
    <div class="ships-wrapper">
      <div
        v-for="ship in ships"
        :key="ship.name"
        :class="ship.name + chosenShip(ship.name)"
      >
        <div
          v-for="deck in ship.size"
          class="cell"
          :key="ship.name + deck"
          :id="ship.name"
          @click="chooseCurrentShip(ship)"
        ></div>
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
  },
  methods: {
    ...mapMutations(["setCurrentShip", "setDirection"]),

    chooseCurrentShip({ name, size }) {
      this.setCurrentShip({ name, size });
    },

    chosenShip(ship) {
      return ship === this.currentShip.name ? " current-ship" : "";
    },
  },
};
</script>

<style lang="scss">
@import "ships";
</style>
