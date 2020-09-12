<template>
  <div class="ships">
    <div
      v-for="ship in ships"
      :key="ship.name"
      :class="ship.name + chosenShip(ship.name)"
    >
      <div class="ship">
        <div
          v-for="deck in ship.size"
          class="cell"
          :key="ship.name + deck"
          :id="ship.name"
          @click="chooseShip"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Ships",
  data: () => ({
    ships: [
      { name: "deck-4", size: 4 },
      { name: "deck-3", size: 3 },
      { name: "deck-2", size: 2 },
      { name: "deck-1", size: 1 },
    ],
    currentShip: "deck-4",
  }),
  methods: {
    chooseShip(e) {
      this.currentShip = e.target.id;
    },
    chosenShip(ship) {
      return ship === this.currentShip ? " current-ship" : "";
    },
  },
};
</script>

<style lang="scss">
@import "ships";
</style>
