import { RouterPrefix } from '@/config';
import type { RouteRecordRaw } from 'vue-router';

// 404 路由 和 404 组件
export const NotFoundComponent = () => import('src/pages/404/index.vue');
export const NotFoundRoute = [
  {
    path: `${RouterPrefix}/:pathMatch(.*)*`, // 捕获所有路由或 404 Not found 路由
    component: NotFoundComponent
  }
];

// 登录路由 和 登录组件
export const LoginComponent = () => import('src/pages/login/index.vue');
export const LoginRoute = [
  {
    path: `${RouterPrefix}/login`,
    name: 'login',
    component: LoginComponent
  },
];

// 插件路由页面
export const PluginRoutesComponent = [
  {
    path: '/',
    redirect: '/wx'
  },
  {
    path: `${RouterPrefix}/wx`,
    name: 'wx',
    component: () => import('src/layouts/index.vue'),
  },
];

// 静态路由
export const Routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/wx/system'
  },
  {
    path: '/system',
    name: 'layout',
    component: () => import('src/layouts/index.vue'),
    children: [
      {
        path: `${RouterPrefix}menu`,
        name: 'menu',
        component: () => import('src/pages/system/menu/index.vue')
      },
      {
        path: `${RouterPrefix}role`,
        name: 'role',
        component: () => import('src/pages/system/role/index.vue')
      },
      {
        path: `${RouterPrefix}user`,
        name: 'user',
        component: () => import('src/pages/system/user/index.vue')
      }
    ]
  },
  {
    path: '/wx',
    name: 'layout',
    component: () => import('src/layouts/index.vue'),
    children: [
      {
        path: `${RouterPrefix}system`,
        name: 'system',
        component: () => import('src/pages/system/menu/index.vue')
      }
    ]
  },
];

