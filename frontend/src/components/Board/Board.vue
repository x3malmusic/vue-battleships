<template>
  <div class="board">
    <div class="battleship-grid user">
      <div v-for="i in 100" class="board-cell"></div>
    </div>
    <div class="battleship-grid computer">
      <div v-for="i in 100" class="board-cell"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Board",
};
</script>

<style lang="scss">
@import "board";
</style>
