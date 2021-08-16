<template>
  <div class="list-block">
    <div class="list-header">{{$t('lobby.statistics')}}</div>
      <transition-group name="stats-animation" tag="ul" class="players-stats-list" :style="{ '--total': stats.length }">
        <li
          v-if="showItems"
          class="players-stats-list-item"
          v-for="(stat, i) in stats"
          :key="stat.name"
          :style="{'--i': i}"
        >
          {{ stat.name }}: {{ stat.value }}
        </li>
      </transition-group>
    </div>
</template>

<script>
export default {
  name: "PlayerStats",
  data: () => ({
    showItems: false,
    stats: [
      { name: "Shots fired", value: 140 },
      { name: "Bullseye", value: 12 },
      { name: "Shots Missed", value: 128 },
      { name: "Games Played", value: 12 },
      { name: "Wins", value: 1 },
      { name: "Losses", value: 11 },
      { name: "Win Rate", value: "10%" },
    ],
  }),
  mounted() {
    this.$nextTick(() => this.showItems = true)
  }
}
</script>

<style lang="scss">
@import "player-stats";
</style>