<template>
  <div class="error-page">
    <h2>{{ $t("error.message") }}</h2>
    <router-link to="/lobby">&#8592; {{ $t("error.goBack") }}</router-link>
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
