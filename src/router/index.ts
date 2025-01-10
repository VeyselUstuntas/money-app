import { defineRouter } from '#q-app/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import routes from './routes';
import { useAuthStore } from 'src/stores/authStore';
import { Notify } from 'quasar';
/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default defineRouter(function ({ store }) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory);

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });


  Router.beforeEach((to, from, next) => {
    const authStore = useAuthStore(store);
    const userRole = authStore.loadRole();

    if (to.meta.authRequired && !authStore.isAuthenticated) {
      next({ name: 'Login' });
    }
    else if (to.name === 'Login' && authStore.isAuthenticated) {
      next({ name: 'Entries' });
    }
    else if (to.name === 'Login' && authStore.isAuthenticated) {
      next({ name: 'Entries' });
    }
    else if((to.name === 'CustomerAdd' || to.name === 'Settings') && authStore.isAuthenticated && userRole === 'USER'){
      next({name:'Entries'});
      Notify.create({message: 'Yetkisiz Erişim', color:'warning', position: 'top'});
    }
    else {
      next();
    }
  })

  return Router;
});
