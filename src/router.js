import Vue from "vue";
import Router from "vue-router";

import Home from "./pages/Home.vue";
import Vehicles from "./pages/Vehicles.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    { name: "home-page", path: "/", component: Home },
    { name: "vehicles", path: "/vehicles", component: Vehicles }
  ]
});