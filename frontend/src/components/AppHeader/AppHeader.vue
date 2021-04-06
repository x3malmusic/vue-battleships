<template>
  <header class="header">
    <locale-changer />
    <div class="user-info">
      <span
        >{{ $t("header.welcome") }}: <strong>{{ player.name }}</strong></span
      >
      <span class="user-img-circle"></span>
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
    ...mapState(["player"]),
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
