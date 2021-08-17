<template>
  <div class="list-block">
    <router-view></router-view>
    <div class="list-block-text">
      <div class="list-header">{{$t('lobby.statistics')}}</div>
      <router-link to="/lobby/last-game">{{ $t('lobby.lastGame') }} &#8594;</router-link>
    </div>
      <transition-group name="stats-animation" tag="ul" class="players-stats-list" :style="{ '--total': getStats.length }">
        <li
          v-if="showItems"
          class="players-stats-list-item"
          v-for="(stat, i) in getStats"
          :key="stat.name"
          :style="{'--i': i}"
        >
          {{ stat.name }}: {{ stat.value }}
        </li>
      </transition-group>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { GET_PLAYER_STATS } from "../../store/actions";

export default {
  name: "PlayerStats",
  data: () => ({
    showItems: false,
  }),
  computed: {
    ...mapState(['playerStats']),

    getStats() {
      const stats = Object.entries(this.playerStats)
      if (!stats.length) return [];
      return stats.map(([key, value]) => ({ name: `${this.$t(`lobby.${key}`)}`, value }))
    }
  },
  mounted() {
    if (!Object.keys(this.playerStats).length) this.$store.dispatch(GET_PLAYER_STATS)
    this.$nextTick(() => this.showItems = true)
  }
}
</script>

<style lang="scss">
@import "player-stats";
</style>