import { jwtDecode } from 'jwt-decode';
import { defineStore } from 'pinia';
import { Cookies } from 'quasar';
import { api } from 'src/boot/api';
import { TokenPayload } from 'src/models/auth/token-payload.auth.model';
import { LoginInput, LoginResult } from 'src/models/auth/login.auth.model';
import { RegisterInput, RegisterResult } from 'src/models/auth/register.auth.model';
import { RefreshTokensResult } from 'src/models/auth/refresh-tokens.auth.model';
import {authenticatedApi} from 'src/boot/authenticated-api';

interface State {
  accessToken: string | null;
  refreshToken: string | null;
  accessTokenPayload: TokenPayload | null;
  refreshTokenPayload: TokenPayload | null;
  userRole: string | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): State => ({
    accessToken: null,
    refreshToken: null,
    accessTokenPayload: null,
    refreshTokenPayload: null,
    userRole: null,
  }),

  getters: {
    isAuthenticated: (state) => {
      if (state.accessToken) {
        return true;
      }
      return false
    },
  },

  actions: {
    async login(loginInput: LoginInput): Promise<LoginResult | null> {
      try {
        const result: LoginResult = await api.post('Auth/login', loginInput);
        const accessToken = result.data.accessToken;
        const refreshToken = result.data.refreshToken;
        console.log("access ",accessToken);
        console.log("refresh ",refreshToken);
        this.setAccessToken(accessToken);
        this.setRefreshToken(refreshToken);
        return result;
      }
      catch (error) {
        console.error('login hatası ', error);
        return null;
      }
    },

    async register(registerInput: RegisterInput): Promise<RegisterResult | null> {
      try {
        const result: RegisterResult = await api.post('Auth/register', registerInput)
        const accessToken = result.data.accessToken;
        const refreshToken = result.data.refreshToken;
        this.setAccessToken(accessToken);
        this.setRefreshToken(refreshToken);

        return result;
      }
      catch (error) {
        console.error('register hatası ', error);
        return null;
      }
    },


    async refresh(refreshToken: string): Promise<string | null> {
      try {
        this.fetchPersistRefreshToken();
        const response: RefreshTokensResult = await api.post('Auth/refresh', { refreshToken: refreshToken });
        const newAccessToken = response.data.accessToken;
        this.setAccessToken(newAccessToken);
        this.fetchPersistAccessToken();
        return newAccessToken;
      } catch (error) {
        console.error('refreshTokens hatası new token alamadı ', error);
        this.clearRefreshToken();
        return null;
      }
    },


    async logout() {
      try {
        // await authenticatedApi.post('auth/logout').finally(() => { // })
        this.clearAccessToken();
        this.clearRefreshToken();
        this.router.push({name:'Login'});
      }
      catch (error) {
        console.error('logout hatası ', error);
        return null;
      }
    },

    setAccessToken(accessToken: string) {
      this.accessToken = accessToken;
      const decodeJwt = jwtDecode<TokenPayload>(accessToken);
      this.accessTokenPayload = decodeJwt;

      this.persistAccessToken(accessToken, new Date(this.accessTokenPayload.exp * 1000));
    },

    setRefreshToken(refreshToken: string) {
      this.refreshToken = refreshToken;
      const decodeJwt = jwtDecode<TokenPayload>(refreshToken);
      this.refreshTokenPayload = decodeJwt;

      this.persistRefreshToken(refreshToken, new Date(this.refreshTokenPayload.exp * 1001));
    },

    persistAccessToken(accessToken: string, expirationDate: Date) {
      Cookies.set('accessToken', accessToken, { expires: expirationDate });
    },

    persistRefreshToken(refreshToken: string, expirationDate: Date) {
      Cookies.set('refreshToken', refreshToken, { expires: expirationDate });
    },

    fetchPersistAccessToken(): string | null {
      const accessToken = Cookies.get('accessToken');
      if (accessToken) {
        this.setAccessToken(accessToken);
      }
      return accessToken;
    },

    fetchPersistRefreshToken(): string | null {
      const refreshToken = Cookies.get('refreshToken');
      if (refreshToken) {
        this.setRefreshToken(refreshToken);
      }
      return refreshToken;
    },

    clearAccessToken() {
      this.removePersistedAccessToken();
      this.$reset();
    },

    clearRefreshToken() {
      this.removePersistedRefreshToken();
      this.$reset();
    },

    removePersistedAccessToken() {
      Cookies.remove('accessToken');
    },

    removePersistedRefreshToken() {
      Cookies.remove('refreshToken');
    },

    loadRole() {
      if(this.accessTokenPayload){
        this.userRole = this.accessTokenPayload?.roles!;
        return this.userRole;
      }
    },

    getFullName(): string | undefined {
      const fullName = this.accessTokenPayload?.fullname;
      return fullName;
    },
  }
})
