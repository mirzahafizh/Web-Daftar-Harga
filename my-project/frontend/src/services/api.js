
import axios from 'axios';

const api = axios.create({
    baseURL: 'https://web-daftar-harga-1v7t-git-main-mirzahafizhs-projects.vercel.app/api',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('hyundai-token');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    // Upload FormData: biarkan Axios membuat boundary otomatis.
    if (config.data instanceof FormData) {
        delete config.headers['Content-Type'];
        delete config.headers['content-type'];
    } else {
        config.headers['Content-Type'] = 'application/json';
    }

    return config;
});

export default api;
