import { RouteRecordRaw, createRouter, createWebHistory } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("../components/Login.vue"),
  },
  {
    path: "/home",
    component: () => import("../components/Search.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
