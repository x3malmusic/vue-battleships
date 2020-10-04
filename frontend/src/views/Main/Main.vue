<template>
  <div class="main">
    <h1>{{ $t("main.title") }}</h1>
    <app-form />
  </div>
</template>

<script>
import AppForm from "../../components/Form/AppForm";

export default {
  name: "Main",
  components: {
    AppForm,
  },
};
</script>

<style lang="scss">
@import "main";
</style>
