<i18n src="./locales/lang.json"></i18n>

<template>
  <div class="error-page">
    <h2>{{ $t("message") }}</h2>
    <router-link to="/">&#8592; {{ $t("action") }}</router-link>
  </div>
</template>

<script>
export default {
  name: "Error",
};
</script>

<style lang="scss">
@import "error";
</style>
