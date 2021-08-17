<template>
  <transition name="modal-animation" appear>
    <div class="modal" @click="backToLobby">
      <div class="modal-body" @click.stop="">
        <router-link to="/lobby" class="link">
          <span>{{ $t('error.goBack') }} &#8594;</span>
        </router-link>

        <transition-group name="stats-animation" tag="ul" class="modal-body-list" :style="{ '--total': getLastGameResult.length }">
          <li
            v-if="showItems"
            class="modal-body-list-item"
            v-for="(stat, i) in getLastGameResult"
            :key="stat.name"
            :style="{'--i': i}"
          >
            {{ stat.name }}: {{ stat.value }}
          </li>
        </transition-group>

      </div>
    </div>
  </transition>
</template>

<script>
import { mapState } from "vuex";
import { GET_LAST_GAME } from "../../store/actions";

export default {
  name: "LastGame",
  data: () => ({
    showItems: false,
  }),
  methods: {
    backToLobby() {
      this.$router.push('/lobby')
    },

    getValue(val) {
      if (typeof val === "boolean") return val ? this.$t('lobby.yes') : this.$t('lobby.no')
      return val
    }
  },
  computed: {
    ...mapState(["lastGame"]),

    getLastGameResult() {
      const result = Object.entries(this.lastGame)
      if (!result.length) return [];
      return result.map(([key, value]) => ({ name: `${this.$t(`lobby.${key}`)}`, value: this.getValue(value) }))
    }
  },
  mounted() {
    if (!Object.keys(this.lastGame).length) this.$store.dispatch(GET_LAST_GAME)
    this.$nextTick(() => this.showItems = true)
  }
}
</script>

<style lang="scss">
@import "last-game";
</style>