import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useAuthStore } from './authStore';

// We need to match the backend entity structure roughly
export interface Quest {
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

export interface UserQuest {
    id: string;
    status: 'ACTIVE' | 'COMPLETED';
    progress: { [objectiveId: string]: number };
    quest: Quest;
}

interface QuestState {
    availableQuests: Quest[];
    activeQuests: UserQuest[];
    completedQuests: UserQuest[];
    isLoading: boolean;
    error: string | null;

    fetchQuests: () => Promise<void>;
    acceptQuest: (questId: string) => Promise<void>;
    completeQuest: (questId: string) => Promise<void>;

    // Helper to update local progress optimistically (optional, or we rely on refetch)
    // For now, let's rely on refetch or simple local update
}

const API_URL = 'http://localhost:3000';

export const useQuestStore = create<QuestState>()(
    persist(
        (set, get) => ({
            availableQuests: [],
            activeQuests: [],
            completedQuests: [],
            isLoading: false,
            error: null,

            fetchQuests: async () => {
                const token = useAuthStore.getState().token;
                if (!token) return;

                set({ isLoading: true, error: null });
                try {
                    // 1. Fetch all definitions
                    const questsRes = await fetch(`${API_URL}/quest`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    const allQuests: Quest[] = await questsRes.json();

                    // 2. Fetch user progress
                    const myQuestsRes = await fetch(`${API_URL}/quest/my`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    const myQuests: UserQuest[] = await myQuestsRes.json();

                    const active = myQuests.filter(q => q.status === 'ACTIVE');
                    const completed = myQuests.filter(q => q.status === 'COMPLETED');

                    set({
                        availableQuests: allQuests,
                        activeQuests: active,
                        completedQuests: completed,
                        isLoading: false
                    });
                } catch (err) {
                    set({ error: 'Failed to fetch quests', isLoading: false });
                }
            },

            acceptQuest: async (questId) => {
                const token = useAuthStore.getState().token;
                if (!token) return;

                try {
                    const res = await fetch(`${API_URL}/quest/${questId}/accept`, {
                        method: 'POST',
                        headers: { 'Authorization': `Bearer ${token}` }
                    });

                    if (res.ok) {
                        const newQuest: UserQuest = await res.json();
                        set(state => ({
                            activeQuests: [...state.activeQuests, newQuest]
                        }));
                    }
                } catch (err) {
                    console.error('Failed to accept quest', err);
                }
            },

            completeQuest: async (questId) => {
                const token = useAuthStore.getState().token;
                if (!token) return;

                try {
                    const res = await fetch(`${API_URL}/quest/${questId}/complete`, {
                        method: 'POST',
                        headers: { 'Authorization': `Bearer ${token}` }
                    });

                    if (res.ok) {
                        const completedQuest: UserQuest = await res.json();
                        set(state => ({
                            activeQuests: state.activeQuests.filter(q => q.quest.id !== questId),
                            completedQuests: [...state.completedQuests, completedQuest]
                        }));

                        // Trigger character/inventory refresh?
                        // Ideally we should verify this in the UI by reloading stats
                    }
                } catch (err) {
                    console.error('Failed to complete quest', err);
                }
            }
        }),
        {
            name: 'quest-storage-api',
        }
    )
);
