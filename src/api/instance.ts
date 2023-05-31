import axios from 'axios';

const instance = axios.create({
    baseURL: process.env.REACT_APP_SERVER_URL,
    withCredentials: true, 
    headers: {
        "Access-Control-Allow-Origin": "*",
    },
})

// instance.interceptors.request.use(
//     (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {

//     //   const accessToken = sessionStorage.getItem('access_token');
//     //   const refreshToken = localStorage.getItem('refresh_token');
  
//       return config;
//     }
// );

export default instance;
