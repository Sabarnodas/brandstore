import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('auth_token');
        if (token) {
            try {
                const parsedToken = JSON.parse(token);
                if (parsedToken.token) {
                    config.headers.Authorization = `Bearer ${parsedToken.token}`;
                }
            } catch (error) {
                // Ignore parsing errors
            }
        }
    }
    return config;
});

export default api;
