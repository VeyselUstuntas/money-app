import { boot } from 'quasar/wrappers';
import axios, { AxiosError, AxiosInstance } from 'axios';
import { useAuthStore } from 'src/stores/authStore';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
  }
}

// Authenticated Axios instance
const authenticatedApi = axios.create({ baseURL: process.env.apiUrl! });

export default boot(({ store }) => {
  const authStore = useAuthStore(store);

  // Request interceptor
  authenticatedApi.interceptors.request.use(
    (reqConf) => {
      if (authStore.accessToken) {
        reqConf.headers['Authorization'] = 'Bearer ' + authStore.accessToken;
        // console.log("Authorization Header: ", reqConf.headers['Authorization']);
      } else {
        console.warn("Access token not available.");
      }
      return reqConf;
    },
    (error) => {
      console.error("Request interceptor error: ", error);
      return Promise.reject(error);
    }
  );

  // Response interceptor
  authenticatedApi.interceptors.response.use(
    (res) => res.data,
    async (error) => {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        console.error(axiosError);
        if (axiosError.response?.status === 401) {
          console.error("401 Unauthorized: Access token invalid or expired.");
          // Token refresh veya kullanıcıyı logout etme
          await authStore.logout(); // Kullanıcıyı çıkışa yönlendirin
        } else if (axiosError.response?.status === 403) {
          console.error("403 Forbidden: Access denied.");
        } else {
          console.error("Unhandled error: ", axiosError.response?.status, axiosError.message);
        }
      }
      return Promise.reject(error); // Hataları yukarıya ilet
    }
  );
});

export { authenticatedApi };
