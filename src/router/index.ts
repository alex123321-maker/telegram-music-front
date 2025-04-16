import { createRouter, createWebHashHistory } from 'vue-router';
import IndexPage from '@/pages/IndexPage.vue';
import InitDataPage from '@/pages/InitDataPage.vue';
import ThemeParamsPage from '@/pages/ThemeParamsPage.vue';
import LaunchParamsPage from '@/pages/LaunchParamsPage.vue';
import TonConnectPage from '@/pages/TonConnectPage.vue';
import IconTonConnect from '@/components/IconTonConnect.vue';
import MainPage from '@/pages/MainPage.vue';

export const routes = [
  {
    path: '/main',
    name: 'main',
    component: MainPage,
    meta:{
    title: 'MAIN PAGE',
    },
  },
  {
    path: '/',
    name: 'index',
    component: IndexPage,
  },
  {
    path: '/init-data',
    name: 'init-data',
    component: InitDataPage,
    meta: {
      title: 'Init Data',
    },
  },
  {
    path: '/theme-params',
    name: 'theme-params',
    component: ThemeParamsPage,
    meta: {
      title: 'Theme Params',
    },
  },
  {
    path: '/launch-params',
    name: 'launch-params',
    component: LaunchParamsPage,
    meta: {
      title: 'Launch Params',
    },
  },
  {
    path: '/ton-connect',
    name: 'ton-connect',
    component: TonConnectPage,
    meta: {
      icon: IconTonConnect,
      title: 'TON Connect',
    },
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
