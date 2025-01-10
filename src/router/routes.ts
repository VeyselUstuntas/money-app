import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/PageEntries.vue'), name: 'Entries' },
      { path: 'settings', component: () => import('pages/PageSettings.vue'), name: 'Settings', meta: { role: 'ADMIN' } },
      { path: 'customers', component: () => import('pages/CustomersPage.vue'), name: 'Customers' },
      { path: 'customer-add', component: () => import('pages/CustomerAddPage.vue'), name: 'CustomerAdd', meta: { role: 'ADMIN' } },
    ],
    meta: {
      authRequired: true,
    },
  },
  {
    path: '/auth',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      { path: '/login', component: () => import('pages/LoginPage.vue'), name: 'Login' },
      { path: '/register', component: () => import('pages/RegisterPage.vue'), name: 'Register' },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
