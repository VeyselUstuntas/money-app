import axios, { AxiosError, AxiosInstance } from 'axios';
import { Notify } from 'quasar';
import { boot } from 'quasar/wrappers';
import { useAuthStore } from 'src/stores/authStore';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
  }
}

const api = axios.create({ baseURL: process.env.apiUrl! });

export default boot(({ store }) => {
  const authStore = useAuthStore(store);

  api.interceptors.response.use(
    (res) => {
      return res.data;
    },
    (error: AxiosError) => {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          authStore.clearAccessToken();
        }

        const axiosError = error as AxiosError;

        const errorResponseData = axiosError.response?.data;

        if (errorResponseData && typeof errorResponseData === 'object' && 'message' in errorResponseData) {
          Notify.create(
            {
              message: errorResponseData.message as string,
              color: 'warning',
              position: 'top'
            }
          )
        } else {
          Notify.create(
            {
              message: "Error",
              color: 'warning',
              position: 'top'
            }
          )
        }
      } else {
        console.error('Axios Dışı Hata', error);
      }
    },
  );
});

export { api };
