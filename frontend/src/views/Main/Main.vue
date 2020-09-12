<i18n src="./locales/lang.json"></i18n>

<template>
  <div class="main">
    <h1>BattleShips</h1>
    <div class="buttons">
      <app-button @click="playSinglePlayer">{{ $t("single") }}</app-button>
      <app-button>{{ $t("multi") }}</app-button>
    </div>
  </div>
</template>

<script>
import AppButton from "../../components/Button/AppButton";

export default {
  name: "Main",
  components: {
    AppButton,
  },
  methods: {
    playSinglePlayer() {
      this.$router.push("/game");
    },
  },
};
</script>

<style lang="scss">
@import "main";
</style>
