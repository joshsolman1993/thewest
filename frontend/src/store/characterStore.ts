import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useAuthStore } from './authStore';

interface CharacterStats {
    level: number;
    xp: number;
    maxXp: number;
    health: number;
    maxHealth: number;
    gold: number;
    attributes: {
        strength: number;
        agility: number;
        endurance: number;
        perception: number;
        intelligence: number;
    };
}

interface CharacterState {
    name: string;
    stats: CharacterStats;
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchCharacter: () => Promise<void>;
    createCharacter: (name: string) => Promise<void>;
    gainXp: (amount: number) => void;
    takeDamage: (amount: number) => void;
    heal: (amount: number) => void;
    addGold: (amount: number) => void;
    removeGold: (amount: number) => boolean;
    updateAttribute: (attr: keyof CharacterStats['attributes'], value: number) => void;
}

const API_URL = 'http://localhost:3000';

export const useCharacterStore = create<CharacterState>()(
    persist(
        (set, get) => ({
            name: 'Drifter',
            stats: {
                level: 1,
                xp: 0,
                maxXp: 100,
                health: 100,
                maxHealth: 100,
                gold: 50,
                attributes: {
                    strength: 5,
                    agility: 5,
                    endurance: 5,
                    perception: 5,
                    intelligence: 5
                }
            },
            isLoading: false,
            error: null,

            fetchCharacter: async () => {
                const token = useAuthStore.getState().token;
                if (!token) return;

                set({ isLoading: true, error: null });
                try {
                    const response = await fetch(`${API_URL}/character`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });

                    if (response.ok) {
                        const data = await response.json();
                        if (data) {
                            set({
                                name: data.name,
                                stats: {
                                    level: data.level,
                                    xp: data.xp,
                                    maxXp: data.level * 100, // Simple formula
                                    health: data.currentHealth,
                                    maxHealth: data.maxHealth,
                                    gold: data.gold,
                                    attributes: {
                                        strength: data.strength,
                                        agility: data.agility,
                                        endurance: data.endurance,
                                        perception: data.perception,
                                        intelligence: data.intelligence
                                    }
                                },
                                isLoading: false
                            });
                        } else {
                            // No character found, maybe prompt creation?
                            set({ isLoading: false });
                        }
                    } else {
                        throw new Error('Failed to fetch character');
                    }
                } catch (err) {
                    set({ error: 'Could not load character', isLoading: false });
                }
            },

            createCharacter: async (name: string) => {
                const token = useAuthStore.getState().token;
                if (!token) return;

                set({ isLoading: true });
                try {
                    const response = await fetch(`${API_URL}/character`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ name })
                    });

                    if (response.ok) {
                        const data = await response.json();
                        set({
                            name: data.name,
                            stats: {
                                ...get().stats, // Reset to defaults or use response
                                level: data.level,
                                xp: data.xp,
                                gold: data.gold,
                                health: data.currentHealth,
                                maxHealth: data.maxHealth,
                            },
                            isLoading: false
                        });
                    }
                } catch (err) {
                    set({ error: 'Failed to create character', isLoading: false });
                }
            },

            // Helper to sync changes to backend
            // In a real app, we might debounce this or use a separate sync mechanism
            // For now, we'll just fire and forget for simplicity, or await if critical

            gainXp: (amount) => {
                const { stats } = get();
                const newXp = stats.xp + amount;
                let newLevel = stats.level;
                let currentXp = newXp;
                let maxXp = stats.maxXp;

                // Level up logic
                if (currentXp >= maxXp) {
                    currentXp -= maxXp;
                    newLevel += 1;
                    maxXp = newLevel * 100;
                }

                set({
                    stats: {
                        ...stats,
                        xp: currentXp,
                        level: newLevel,
                        maxXp
                    }
                });

                // Sync
                const token = useAuthStore.getState().token;
                if (token) {
                    fetch(`${API_URL}/character`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            xp: currentXp,
                            level: newLevel
                        })
                    });
                }
            },

            takeDamage: (amount) => {
                const { stats } = get();
                const newHealth = Math.max(0, stats.health - amount);
                set({ stats: { ...stats, health: newHealth } });

                // Sync
                const token = useAuthStore.getState().token;
                if (token) {
                    fetch(`${API_URL}/character`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ currentHealth: newHealth })
                    });
                }
            },

            heal: (amount) => {
                const { stats } = get();
                const newHealth = Math.min(stats.maxHealth, stats.health + amount);
                set({ stats: { ...stats, health: newHealth } });

                // Sync
                const token = useAuthStore.getState().token;
                if (token) {
                    fetch(`${API_URL}/character`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ currentHealth: newHealth })
                    });
                }
            },

            addGold: (amount) => {
                const { stats } = get();
                const newGold = stats.gold + amount;
                set({ stats: { ...stats, gold: newGold } });

                // Sync
                const token = useAuthStore.getState().token;
                if (token) {
                    fetch(`${API_URL}/character`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ gold: newGold })
                    });
                }
            },

            removeGold: (amount) => {
                const { stats } = get();
                if (stats.gold >= amount) {
                    const newGold = stats.gold - amount;
                    set({ stats: { ...stats, gold: newGold } });

                    // Sync
                    const token = useAuthStore.getState().token;
                    if (token) {
                        fetch(`${API_URL}/character`, {
                            method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify({ gold: newGold })
                        });
                    }
                    return true;
                }
                return false;
            },

            updateAttribute: (attr, value) => {
                const { stats } = get();
                set({
                    stats: {
                        ...stats,
                        attributes: {
                            ...stats.attributes,
                            [attr]: value
                        }
                    }
                });

                // Sync
                const token = useAuthStore.getState().token;
                if (token) {
                    fetch(`${API_URL}/character`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ [attr]: value })
                    });
                }
            }
        }),
        {
            name: 'dust-character-storage',
        }
    )
);
