<i18n src="./locales/lang.json"></i18n>

<template>
  <div class="game">
    <board />
    <ships />
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
