<template>
  <div class="app-form">
    <form-input
      :placeholder="$t('main.name')"
      v-model="playerName"
    ></form-input>
    <form-input
      :placeholder="$t('main.password')"
      type="password"
      v-model="password"
    ></form-input>
    <div class="buttons">
      <app-button @click="login">{{ $t("main.login") }}</app-button>
      <app-button @click="register">{{ $t("main.register") }}</app-button>
    </div>
  </div>
</template>

<script>
import FormInput from "../FormInput/FormInput";
import AppButton from "../Button/AppButton";

export default {
  name: "AppForm",
  data: () => ({
    playerName: "",
    password: "",
  }),
  components: {
    FormInput,
    AppButton,
  },
  methods: {
    login() {
      this.$router.push("/game");
    },
    register() {
      this.$router.push("/game");
    },
  },
};
</script>

<style lang="scss">
@import "form";
</style>
