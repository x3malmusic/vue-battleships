import Vue from "vue";
import VueRouter from "vue-router";
import store from '../store'
import { getToken } from "../services/token";
import { SILENT_LOGIN } from "../store/actions";

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
      authRequired: true
    },
  },
  {
    path: "/lobby",
    name: "Lobby",
    component: () => import("../views/Lobby/Lobby.vue"),
    children: [{
      path: "last-game",
      component: () => import("../components/LastGame/LastGame.vue"),
      meta: {
        header: true,
      },
    }],
    meta: {
      header: true,
      authRequired: true
    },
  },
  {
    path: "/profile",
    name: "Profile",
    component: () => import("../views/Profile/Profile.vue"),
    meta: {
      header: true,
      authRequired: true
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

router.beforeEach(async (to, from, next) => {
  if (!store.state.player.name && !store.state.isLoading && getToken()) {
    await store.dispatch(SILENT_LOGIN, () => {
      if (!to.meta.authRequired) return next()
      if (to.meta.authRequired && store.state.player.name) return next()
      return router.push('/')
    });
  }

  if (store.state.isLoading) return
  if (!to.meta.authRequired) return next()
  if (to.meta.authRequired && store.state.player.name) return next()
  return router.push('/')
})

export default router;
