import { createRouter, createWebHashHistory } from 'vue-router';

import MainPage from '@/pages/MainPage.vue';

export const routes = [
  {
    path: '/',
    name: 'index',
    component: MainPage,
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
