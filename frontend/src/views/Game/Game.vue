<template>
  <div class="game">
    <app-button
      v-if="gameIsOver"
      type="back-btn btn-main"
      @click="backToLobbyClick"
    >
      {{ $t("gamePage.backToLobby") }}
    </app-button>
    <ships />
    <board />
  </div>
</template>

<script>
import { mapState } from "vuex";
import { RESET_GAMEDATA, DISCONNECT_FROM_GAME } from "../../store/mutations";
import { SET_RESET_SHIPS } from "../../store/modules/ship";
import Board from "../../components/Board/Board";
import Ships from "../../components/Ships/Ships";
import AppButton from "../../components/Button/AppButton";

export default {
  name: "Home",
  components: {
    Board,
    Ships,
    AppButton
  },
  computed: {
    ...mapState({
      gameIsOver: (state) => state.game.gameIsOver
    })
  },
  methods: {
    backToLobbyClick() {
      this.$store.commit(DISCONNECT_FROM_GAME);
      this.$store.commit(RESET_GAMEDATA);
      this.$store.commit(SET_RESET_SHIPS);
      this.$router.push("/lobby");
    }
  },
};
</script>

<style lang="scss">
@import "game";
</style>
