<template>
  <div id="app">
    <notification />
    <component :is="header" />
    <router-view />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import AppHeader from "./components/AppHeader/AppHeader";
import Notification from "./components/Notification/Notification";

export default {
  name: "App",
  components: {
    AppHeader,
    Notification,
  },
  methods: {
    connectToApp() {
      if(this.player.name) {
        this.$socket.connect();
      }
    },
  },
  computed: {
    ...mapState(['player']),

    header() {
      if (this.$route.meta.header) return "AppHeader";
    },
  },
  watch: {
    player() {
      this.connectToApp();
    }
  },
  mounted() {
    this.connectToApp();
  },
};
</script>

<style lang="scss"></style>
