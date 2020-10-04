import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "*",
    name: "Error",
    component: () => import("../views/Error/Error.vue"),
  },
  {
    path: "/game",
    name: "Game",
    component: () => import("../views/Game/Game.vue"),
  },
  {
    path: "/lobby",
    name: "Lobby",
    component: () => import("../views/Lobby/Lobby.vue"),
  },
  {
    path: "/",
    name: "Main",
    component: () => import("../views/Main/Main.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
