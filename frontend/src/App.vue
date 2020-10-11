<template>
  <div id="app">
    <notification />
    <component :is="header" />
    <router-view />
  </div>
</template>

<script>
import AppHeader from "./components/AppHeader/AppHeader";
import Notification from "./components/Notification/Notification";

export default {
  name: "App",
  computed: {
    header() {
      if (this.$route.meta.header) return "AppHeader";
    },
  },
  components: {
    AppHeader,
    Notification,
  },
};
</script>

<style lang="scss"></style>
