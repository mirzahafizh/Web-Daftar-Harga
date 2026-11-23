
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('hyundai-token');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    // Pastikan upload FormData menggunakan multipart/form-data
    // dengan boundary yang dibuat otomatis oleh Axios.
    if (config.data instanceof FormData) {
        if (typeof config.headers.delete === 'function') {
            config.headers.delete('Content-Type');
        } else {
            delete config.headers['Content-Type'];
            delete config.headers['content-type'];
        }
    } else {
        config.headers['Content-Type'] = 'application/json';
    }

    return config;
});

export default api;
