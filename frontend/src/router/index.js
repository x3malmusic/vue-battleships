import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store";

Vue.use(VueRouter);

const routes = [
  {
    path: "*",
    name: "Error",
    component: () => import("../views/Error/Error.vue"),
    meta: {
      header: false,
    },
  },
  {
    path: "/game",
    name: "Game",
    component: () => import("../views/Game/Game.vue"),
    meta: {
      header: true,
    },
  },
  {
    path: "/lobby",
    name: "Lobby",
    component: () => import("../views/Lobby/Lobby.vue"),
    meta: {
      header: true,
    },
  },
  {
    path: "/",
    name: "Main",
    component: () => import("../views/Main/Main.vue"),
    meta: {
      header: false,
    },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

//route guards need
// router.beforeEach((to, from, next) => {
//   if (to.path === "/" && store.state.player.name) next(from.path);
//   else if (to.path === "/lobby" && !store.state.player.name) next(from.path);
//   else next();
// });

export default router;
