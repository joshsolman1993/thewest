import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    id: string;
    username: string;
    email: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (username: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string) => Promise<void>;
    logout: () => void;
}

const API_URL = 'http://localhost:3000';

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            login: async (username, password) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await fetch(`${API_URL}/auth/login`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ username, password }),
                    });

                    if (!response.ok) {
                        throw new Error('Login failed. Check your credentials.');
                    }

                    const data = await response.json();

                    set({
                        token: data.access_token,
                        isAuthenticated: true,
                        isLoading: false,
                        user: { id: 'jwt-id', username: username, email: '' }
                    });

                } catch (err) {
                    set({
                        error: err instanceof Error ? err.message : 'Login failed',
                        isLoading: false
                    });
                }
            },

            register: async (username, email, password) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await fetch(`${API_URL}/auth/register`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ username, email, password }),
                    });

                    if (!response.ok) {
                        throw new Error('Registration failed. Username or Email might be taken.');
                    }

                    // Auto-login after registration
                    const loginResponse = await fetch(`${API_URL}/auth/login`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ username, password }),
                    });

                    if (loginResponse.ok) {
                        const data = await loginResponse.json();
                        set({
                            token: data.access_token,
                            isAuthenticated: true,
                            isLoading: false,
                            user: { id: 'new-id', username, email }
                        });
                    } else {
                        set({ isLoading: false });
                    }

                } catch (err) {
                    set({
                        error: err instanceof Error ? err.message : 'Registration failed',
                        isLoading: false
                    });
                }
            },

            logout: () => {
                set({ user: null, token: null, isAuthenticated: false });
            }
        }),
        {
            name: 'dust-auth-storage',
        }
    )
);
