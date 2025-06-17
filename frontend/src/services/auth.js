import api from './api';

export async function login(username, password) {
    try {
        const response = await api.post('/login', { username, password });
        const { token } = response.data;
        if (token) {
            localStorage.setItem('token', token);
            return true;
        }
        return false;
    } catch (error) {
        console.error('Erro no login:', error.response?.data || error.message);
        return false;
    }
}

export function logout() {
    localStorage.removeItem('token');
}

export function getToken() {
    return localStorage.getItem('token');
}

export function isAuthenticated() {
    return !!getToken();
}