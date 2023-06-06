import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';

const instance = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL,
  withCredentials: true,
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
});

instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const updatedConfig = { ...config };
    const accessToken = localStorage.getItem('AToken');
    const refreshToken = Cookies.get('RToken');

    if (accessToken) {
      updatedConfig.headers.ACCESS_KEY = `Bearer ${accessToken}`;
      updatedConfig.headers.refresh_token = `Bearer ${refreshToken}`;
    }

    return updatedConfig;
  },
  (error: Error): Promise<never> => Promise.reject(error)
);

instance.interceptors.response.use(
  (response: AxiosResponse<any, any>) => response,
  (error: Error): Promise<never> => {
    console.log(error.message);
    return Promise.reject(error);
  }
);

export default instance;
