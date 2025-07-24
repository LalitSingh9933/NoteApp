import axios from 'axios';
import { API_BASE_URL } from './constants';
const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json'
    },
});
axiosInstance.insterrceptors.response.use(
    (config) =>  {
        const acceptToken = localStorage.getItem('token');
        if(acceptToken) {
            config.headers['Authorization'] = `Bearer ${acceptToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
export default axiosInstance;