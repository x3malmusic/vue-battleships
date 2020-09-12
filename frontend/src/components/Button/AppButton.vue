<template>
  <button @click="$emit('click')" :class="type" class="btn">
    <slot>name</slot>
  </button>
</template>

<script>
export default {
  name: "AppButton",
  props: {
    type: {
      type: String,
      default: "btn-main",
    },
  },
};
</script>

<style lang="scss">
@import "./app-button";
</style>
