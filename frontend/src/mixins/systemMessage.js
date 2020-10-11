import { SET_SYSTEM_MESSAGE } from "../store/modules/ship";

export default {
  methods: {
    $_notify(message) {
      this.$store.commit(SET_SYSTEM_MESSAGE, {
        text: message,
        id: Date.now().toLocaleString(),
      });
    },
  },
};
