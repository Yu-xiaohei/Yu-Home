import axios from 'axios';

const api = axios.create({
    baseURL: '/api/auth',
    headers: {
        'Content-Type': 'application/json',
    },
});

export interface LoginData {
    username: string;
    password: string;
}

export interface RegisterData {
    username: string;
    password: string;
    email?: string;
    phone?: string;
    verifyCode: string;
    verifyType: 'email' | 'sms';
}

export interface AuthResponse {
    accessToken: string;
    user: {
        uuid: string;
        username: string;
        email?: string;
        phone?: string;
    };
}

export const authService = {
    async login(data: LoginData): Promise<AuthResponse> {
        const response = await api.post('/login', data);
        return response.data;
    },

    async register(data: RegisterData): Promise<AuthResponse> {
        const response = await api.post('/register', data);
        return response.data;
    },

    async sendCode(target: string, type: 'email' | 'sms'): Promise<void> {
        await api.post('/send-code', { target, type });
    },

    async verifyToken(accessToken: string): Promise<{ valid: boolean; user: any }> {
        const response = await api.post('/verify', { accessToken });
        return response.data;
    },
};
