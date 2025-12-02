import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../store/authStore';

const API_URL = 'http://localhost:3000';

// Types
interface Character {
    id: string;
    name: string;
    level: number;
    xp: number;
    gold: number;
    currentHealth: number;
    maxHealth: number;
    strength: number;
    agility: number;
    endurance: number;
    perception: number;
    intelligence: number;
}

interface CreateCharacterData {
    name: string;
}

interface UpdateCharacterData {
    gold?: number;
    currentHealth?: number;
    xp?: number;
    level?: number;
    [key: string]: any;
}

// API Functions
const fetchCharacter = async (token: string): Promise<Character | null> => {
    const response = await fetch(`${API_URL}/character`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error('Failed to fetch character');
    }

    return response.json();
};

const createCharacter = async (data: CreateCharacterData, token: string): Promise<Character> => {
    const response = await fetch(`${API_URL}/character`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error('Failed to create character');
    }

    return response.json();
};

const updateCharacter = async (data: UpdateCharacterData, token: string): Promise<Character> => {
    const response = await fetch(`${API_URL}/character`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error('Failed to update character');
    }

    return response.json();
};

// Hooks
export const useCharacter = () => {
    const { token } = useAuthStore();

    return useQuery({
        queryKey: ['character'],
        queryFn: () => fetchCharacter(token!),
        enabled: !!token,
    });
};

export const useCreateCharacter = () => {
    const queryClient = useQueryClient();
    const { token } = useAuthStore();

    return useMutation({
        mutationFn: (data: CreateCharacterData) => createCharacter(data, token!),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['character'] });
        },
    });
};

export const useUpdateCharacter = () => {
    const queryClient = useQueryClient();
    const { token } = useAuthStore();

    return useMutation({
        mutationFn: (data: UpdateCharacterData) => updateCharacter(data, token!),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['character'] });
        },
    });
};
