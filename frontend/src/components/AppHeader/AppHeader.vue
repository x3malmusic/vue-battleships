<template>
  <header class="header">
    <locale-changer />
    <span class="whos-turn" :class="{ green: whosGo, red: !whosGo }" v-if="game.gameHasBegun">{{ whosGoText }}</span>
    <div class="user-info">
      <span>{{ $t("header.welcome") }}:&nbsp;</span>
      <router-link to="/profile" class="link">
        {{ player.name }}
      </router-link>

      <div class="avatar-container">
        <img v-if="player.avatar" :src="avatarPath" alt="img">
        <span v-else class="user-img-circle"></span>
      </div>

      <app-button @click="logout">{{ $t("header.logOut") }}</app-button>
    </div>
  </header>
</template>

<script>
import { LOG_OUT } from "../../store/actions";
import { mapState } from "vuex";
import LocaleChanger from "../LocaleChanger/LocaleChanger";
import AppButton from "../Button/AppButton";

export default {
  name: "AppHeader",
  computed: {
    ...mapState(["player", "game"]),

    whosGo() {
      return this.game.whosGo === this.player.id;
    },

    whosGoText() {
      const yourTurnMsg = `${this.player.name}${this.$t("messages.TURN")}`;
      const oponentTurnMsg = `${this.game.gameData[this.game.whosGo].name}${this.$t("messages.TURN")}`;
      return this.whosGo ? yourTurnMsg : oponentTurnMsg;
    },

    avatarPath() {
      return this.player.avatar && `${process.env.VUE_APP_URL}/api/avatar/${this.player.avatar}`;
    }
  },
  components: {
    AppButton,
    LocaleChanger,
  },
  methods: {
    logout() {
      this.$store.dispatch(LOG_OUT);
      this.$socket.disconnect();
      this.$router.push("/");
    },
  },
};
</script>

<style lang="scss">
@import "app-header";
</style>
