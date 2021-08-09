import { SET_SYSTEM_MESSAGE } from "../store/mutations";

export default {
  methods: {
    $_notify(message) {
      this.$store.commit(SET_SYSTEM_MESSAGE,  { type: message });
    },
  },
};
