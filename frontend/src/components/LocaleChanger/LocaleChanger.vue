<template>
  <div class="parent-locale-changer">
    <div class="locale-changer" @click="showAvailableLangs">
      {{ this.chosenLang }}
    </div>
    <button
        class="change-btn"
        :class="{ btn_active: show }"
        v-for="lang in languages"
        @click.stop="changeLocale"
        :value="lang"
    >
      {{ lang }}
    </button>
  </div>

</template>

<script>
export default {
  name: "LocaleChanger",
  data: () => ({
    show: false,
    languages: ["en", "ru"],
    currentLang: "",
  }),
  methods: {
    showAvailableLangs() {
      this.show = !this.show;
    },
    changeLocale(e) {
      this.currentLang = e.target.value;
      this.$i18n.locale = e.target.value;
    },
  },
  mounted() {
    this.currentLang = this.languages[0];
  },
  computed: {
    chosenLang() {
      return this.currentLang.toUpperCase();
    },
  },
};
</script>

<style lang="scss">
@import "locale-changer";
</style>
