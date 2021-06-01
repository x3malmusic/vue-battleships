<template>
  <div class="game">
    <ships />
    <board />
  </div>
</template>

<script>
import Board from "../../components/Board/Board";
import Ships from "../../components/Ships/Ships";

export default {
  name: "Home",
  components: {
    Board,
    Ships,
  },
};
</script>

<style lang="scss">
@import "game";
</style>
