<template>
  <div id="app">
    <locale-changer />
    <transition name="fade" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<script>
import LocaleChanger from "./components/LocaleChanger/LocaleChanger";

export default {
  name: "App",
  components: {
    LocaleChanger,
  },
};
</script>
]

<style lang="scss"></style>
