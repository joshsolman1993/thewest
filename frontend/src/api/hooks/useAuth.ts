import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../store/authStore';

const API_URL = 'http://localhost:3000';

// Types
interface LoginCredentials {
    username: string;
    password: string;
}

interface RegisterData {
    username: string;
    email: string;
    password: string;
}

interface AuthResponse {
    access_token: string;
}

// API Functions
const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
    });

    if (!response.ok) {
        throw new Error('Login failed. Check your credentials.');
    }

    return response.json();
};

const registerUser = async (data: RegisterData): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Registration failed. Username or Email might be taken.');
    }

    // Auto-login after registration
    return loginUser({ username: data.username, password: data.password });
};

// Hooks
export const useLogin = () => {
    const { setAuth } = useAuthStore();

    return useMutation({
        mutationFn: loginUser,
        onSuccess: (data) => {
            setAuth(data.access_token);
        },
    });
};

export const useRegister = () => {
    const { setAuth } = useAuthStore();

    return useMutation({
        mutationFn: registerUser,
        onSuccess: (data) => {
            setAuth(data.access_token);
        },
    });
};

export const useLogout = () => {
    const queryClient = useQueryClient();
    const { logout } = useAuthStore();

    return useMutation({
        mutationFn: async () => {
            // Clear all React Query cache
            queryClient.clear();
            logout();
        },
    });
};
