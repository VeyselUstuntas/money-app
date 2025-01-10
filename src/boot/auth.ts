import { jwtDecode } from 'jwt-decode';
import { boot } from 'quasar/wrappers';
import { TokenPayload } from 'src/models/auth/token-payload.auth.model';
import { useAuthStore } from 'src/stores/authStore';


export default boot(async ({ store, router }) => {
  const authStore = useAuthStore(store);
  authStore.fetchPersistAccessToken();
  authStore.fetchPersistRefreshToken();


  let interval: any = null;
  interval = setInterval(async () => {
    const refreshToken = authStore.refreshToken;
    if (refreshToken) {
      const newAccessToken = await authStore.refresh(refreshToken);
      console.log(newAccessToken);
    }
  }, 6000);

  if (authStore.accessToken && authStore.refreshToken) {
    router.push({
      name: 'Entries',
    });

  }
  else {
    router.push({
      name: 'Login',
    });
  }
});
