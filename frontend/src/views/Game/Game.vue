<template>
  <div class="game">
    <notification />
    <board />
    <ships />
  </div>
</template>

<script>
import Board from "../../components/Board/Board";
import Ships from "../../components/Ships/Ships";
import Notification from "../../components/Notification/Notification";

export default {
  name: "Home",
  components: {
    Board,
    Ships,
    Notification,
  },
};
</script>

<style lang="scss">
@import "game";
</style>
