import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Repos from "./views/Repos.vue";
import Callback from "./views/Callback.vue";
import Contents from "./views/Contents.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/repos",
      name: "repos",
      component: Repos
    },
    {
      path: "/callback",
      name: "callback",
      component: Callback
    },
    {
      path: "/:owner/:repo",
      alias: ["/:owner/:repo/*"],
      name: "contents",
      component: Contents
    }
  ]
});
