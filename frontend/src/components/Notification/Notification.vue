<template>
  <div class="notification">
    <transition-group name="notification-animation">
      <div
        class="notification-content"
        v-for="message in messages"
        :key="message.id"
      >
        {{ message.text }}
      </div>
    </transition-group>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Notification",
  data: () => ({
    messages: [],
  }),
  computed: {
    ...mapState({ systemMessage: (state) => state.systemMessage }),
  },
  watch: {
    systemMessage() {
      this.messages.unshift(this.systemMessage);
      this.hideNotification();
    },
  },
  methods: {
    hideNotification() {
      const ctx = this;
      if (this.messages.length) {
        setTimeout(() => {
          ctx.messages.splice(ctx.messages.length - 1, 1);
        }, 3000);
      }
    },
  },
  mounted() {
    this.hideNotification();
  },
};
</script>

<style lang="scss">
@import "notification";
</style>
