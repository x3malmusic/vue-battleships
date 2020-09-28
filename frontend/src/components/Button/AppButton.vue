<template>
  <button
    @click="$emit('click')"
    :class="type"
    class="btn"
    :disabled="disabled"
  >
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
    disabled: Boolean,
  },
};
</script>

<style lang="scss">
@import "./app-button";
</style>
