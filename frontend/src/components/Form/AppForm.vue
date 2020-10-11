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
    ...mapMutations(["setUser", "SOCKET_updatePlayers"]),

    login() {
      if (this.playerName.trim() && this.password.trim()) {
        const player = {
          name: this.playerName,
          password: this.password,
        };

        this.$socket.emit("login", player, ({ playersList, user }) => {
          this.setUser(user);
          this.SOCKET_updatePlayers(playersList);
          this.$router.push("/lobby");
        });
      } else {
        this.$_notify(this.$t("messages.namePasswordEmpty"));
      }
    },

    register() {
      if (this.playerName.trim() && this.password.trim()) {
        const player = {
          name: this.playerName,
          password: this.password,
        };
        this.$socket.emit("register", player, ({ playersList, user }) => {
          this.setUser(user);
          this.SOCKET_updatePlayers(playersList);
          this.$router.push("/lobby");
        });
      } else {
        this.$_notify(this.$t("messages.namePasswordEmpty"));
      }
    },
  },
};
</script>

<style lang="scss">
@import "form";
</style>
