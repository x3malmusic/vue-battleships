<template>
  <header class="header">
    <locale-changer />
    <div class="user-info">
      <span
        >Welcome: <strong>{{ player.name }}</strong></span
      >
      <span class="user-img-circle"></span>
      <app-button @click="logout">Log Out</app-button>
    </div>
  </header>
</template>

<script>
import { mapState, mapMutations } from "vuex";
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
    ...mapMutations(["setUser"]),

    logout() {
      this.setUser({});
      this.$socket.emit("playerLeft");
      this.$router.push("/");
    },
  },
};
</script>

<style lang="scss">
@import "app-header";
</style>
