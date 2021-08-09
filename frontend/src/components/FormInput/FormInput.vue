<template>
  <div class="form-input">
    <span
      :class="inputFocus || input ? 'form-input-txt show' : 'form-input-txt'"
      >{{ placeholder }}</span
    >
    <input
      :type="type || 'text'"
      class="form-input-control"
      @focus="inputFocus = true"
      @blur="inputFocus = false"
      @input="handleInput"
      v-model="input"
    />
  </div>
</template>

<script>
export default {
  name: "FormInput",
  props: {
    placeholder: String,
    type: String,
  },
  data: () => ({
    inputFocus: false,
    input: "",
  }),
  methods: {
    handleInput(e) {
      this.$emit("input", e.target.value);
    },
  },
};
</script>

<style lang="scss">
@import "form-input";
</style>
