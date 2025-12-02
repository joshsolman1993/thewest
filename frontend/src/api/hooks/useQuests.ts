import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../store/authStore';

const API_URL = 'http://localhost:3000';

// Types
interface Quest {
    id: string;
    title: string;
    description: string;
    objectives: {
        id: string;
        type: string;
        description: string;
        target: number;
        current: number;
    }[];
    rewards: {
        xp: number;
        gold: number;
        items: { itemId: string; quantity: number }[];
    };
}

interface UserQuest {
    id: string;
    status: 'ACTIVE' | 'COMPLETED';
    progress: { [objectiveId: string]: number };
    quest: Quest;
}

// API Functions
const fetchAllQuests = async (token: string): Promise<Quest[]> => {
    const response = await fetch(`${API_URL}/quest`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch quests');
    }

    return response.json();
};

const fetchMyQuests = async (token: string): Promise<UserQuest[]> => {
    const response = await fetch(`${API_URL}/quest/my`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch my quests');
    }

    return response.json();
};

const acceptQuest = async (questId: string, token: string): Promise<UserQuest> => {
    const response = await fetch(`${API_URL}/quest/${questId}/accept`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
        throw new Error('Failed to accept quest');
    }

    return response.json();
};

const completeQuest = async (questId: string, token: string): Promise<UserQuest> => {
    const response = await fetch(`${API_URL}/quest/${questId}/complete`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
        throw new Error('Failed to complete quest');
    }

    return response.json();
};

// Hooks
export const useQuests = () => {
    const { token } = useAuthStore();

    return useQuery({
        queryKey: ['quests'],
        queryFn: () => fetchAllQuests(token!),
        enabled: !!token,
    });
};

export const useMyQuests = () => {
    const { token } = useAuthStore();

    return useQuery({
        queryKey: ['myQuests'],
        queryFn: () => fetchMyQuests(token!),
        enabled: !!token,
    });
};

export const useAcceptQuest = () => {
    const queryClient = useQueryClient();
    const { token } = useAuthStore();

    return useMutation({
        mutationFn: (questId: string) => acceptQuest(questId, token!),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['myQuests'] });
            queryClient.invalidateQueries({ queryKey: ['character'] }); // Quest may affect character
        },
    });
};

export const useCompleteQuest = () => {
    const queryClient = useQueryClient();
    const { token } = useAuthStore();

    return useMutation({
        mutationFn: (questId: string) => completeQuest(questId, token!),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['myQuests'] });
            queryClient.invalidateQueries({ queryKey: ['character'] }); // Rewards affect character
            queryClient.invalidateQueries({ queryKey: ['inventory'] }); // Item rewards
        },
    });
};
