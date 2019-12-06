import Vue from "vue";
import Router from "vue-router";

import Vehicles from "./pages/Vehicles.vue";
import Rides from "./pages/Rides.vue";
import Driver from "./pages/Driver.vue";
import Passenger from "./pages/Passenger.vue";
import Authorizations from "./pages/Authorizations.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    { name: "home-passenger", path: "/", component: Passenger },
    { name: "vehicles", path: "/vehicles", component: Vehicles },
    { name: "rides", path: "/rides", component: Rides },
    { name: "driver", path: "/driver", component: Driver },
    { name: "passenger", path: "/passenger", component: Passenger },
    { name: "authorizations", path: "/authorizations", component: Authorizations }
  ]
});