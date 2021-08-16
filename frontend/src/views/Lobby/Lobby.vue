<template>
  <div class="lobby">
    <player-stats />
    <app-button @click="findMatch" :disabled="isLookingForMatch">
      <span v-if="isLookingForMatch" :class="loading">
        <loader />
      </span>
      <span :class="{'no-text': isLookingForMatch}">{{$t('lobby.findMatch')}}</span>
    </app-button>
    <players-list />
  </div>
</template>

<script>
import { mapState } from "vuex";
import AppButton from "../../components/Button/AppButton";
import Loader from "../../components/Loader/Loader";
import PlayerStats from "../../components/PlayerStats/PlayerStats";
import PlayersList from "../../components/PlayersList/PlayersList";
import { FIND_MATCH } from "../../store/actions";

export default {
  name: "Lobby",
  components: {
    AppButton,
    Loader,
    PlayerStats,
    PlayersList
  },
  computed: {
    ...mapState(["isLookingForMatch"]),

    loading() {
      return this.isLookingForMatch && "loading"
    }
  },
  methods: {
    findMatch() {
      this.$store.dispatch(FIND_MATCH, this.$socket);
    },
  }
};
</script>

<style lang="scss">
@import "lobby";
</style>
