export default {
  methods: {
    $_addTokenToLocalStorage(token) {
      localStorage.setItem("battleships-token", token);
    },
    $_getToken() {
      return localStorage.getItem("battleships-token");
    },
  },
};
