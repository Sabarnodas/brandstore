import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        const parsedToken = JSON.parse(token); // The current implementation stores the whole token object as string
        if (parsedToken.token) {
            config.headers.Authorization = `Bearer ${parsedToken.token}`;
        }
    }
    return config;
});

export default api;
