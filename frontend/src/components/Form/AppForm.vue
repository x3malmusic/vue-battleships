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
import { mapMutations } from "vuex";
import { LOGIN, REGISTER } from "../../store/actions";
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
    ...mapMutations(["setUser"]),

    login() {
      const player = {
        name: this.playerName,
        password: this.password,
      };
      this.$store.dispatch(LOGIN, player);
    },

    register() {
      const player = {
        name: this.playerName,
        password: this.password,
      };
      this.$store.dispatch(REGISTER, player);
    },
  },
};
</script>

<style lang="scss">
@import "form";
</style>
