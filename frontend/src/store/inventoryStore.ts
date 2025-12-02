import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useAuthStore } from './authStore';

export interface Item {
    id: string;
    name: string;
    description: string;
    type: 'weapon' | 'armor' | 'consumable' | 'material';
    rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
    value: number;
    stats?: {
        damage?: number;
        defense?: number;
        healing?: number;
    };
    stackable?: boolean;
    quantity?: number;
}

interface InventoryState {
    items: Item[];
    equipped: {
        mainHand: Item | null;
        offHand: Item | null;
        head: Item | null;
        body: Item | null;
        legs: Item | null;
        boots: Item | null;
    };
    addItem: (item: Item) => void;
    removeItem: (itemId: string, amount?: number) => void;
    equipItem: (item: Item, slot: keyof InventoryState['equipped']) => void;
    unequipItem: (slot: keyof InventoryState['equipped']) => void;
    fetchInventory: () => Promise<void>;
}

const API_URL = 'http://localhost:3000';

export const useInventoryStore = create<InventoryState>()(
    persist(
        (set, get) => ({
            items: [],
            equipped: {
                mainHand: null,
                offHand: null,
                head: null,
                body: null,
                legs: null,
                boots: null
            },

            fetchInventory: async () => {
                const token = useAuthStore.getState().token;
                if (!token) return;

                try {
                    const response = await fetch(`${API_URL}/inventory`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });

                    if (response.ok) {
                        const data = await response.json();
                        // Map backend items to frontend Item interface
                        // Note: Backend currently returns InventoryItem entity which has itemId.
                        // We need a way to resolve itemId to full Item details (name, stats, etc.)
                        // For now, we might need a lookup table or fetch item definitions.
                        // Let's assume for this phase we just store what we get, 
                        // BUT we need the item definitions.
                        // TODO: Implement Item Registry/Database on frontend or backend.
                        // For now, let's just log it and maybe mock the details if missing.
                        console.log('Fetched inventory:', data);
                    }
                } catch (err) {
                    console.error('Failed to fetch inventory', err);
                }
            },

            addItem: (newItem) => {
                set((state) => {
                    const existingItem = state.items.find(i => i.id === newItem.id);
                    if (existingItem && existingItem.stackable) {
                        return {
                            items: state.items.map(i =>
                                i.id === newItem.id
                                    ? { ...i, quantity: (i.quantity || 1) + (newItem.quantity || 1) }
                                    : i
                            )
                        };
                    }
                    return { items: [...state.items, { ...newItem, quantity: newItem.quantity || 1 }] };
                });

                // Sync with backend
                const token = useAuthStore.getState().token;
                if (token) {
                    fetch(`${API_URL}/inventory/add`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            itemId: newItem.id,
                            quantity: newItem.quantity || 1
                        })
                    });
                }
            },

            removeItem: (itemId, amount = 1) => {
                set((state) => {
                    const itemIndex = state.items.findIndex(i => i.id === itemId);
                    if (itemIndex === -1) return state;

                    const item = state.items[itemIndex];
                    if (item.quantity && item.quantity > amount) {
                        return {
                            items: state.items.map(i =>
                                i.id === itemId
                                    ? { ...i, quantity: i.quantity! - amount }
                                    : i
                            )
                        };
                    }

                    return {
                        items: state.items.filter(i => i.id !== itemId)
                    };
                });
                // TODO: Sync remove with backend
            },

            equipItem: (item, slot) => {
                set((state) => ({
                    equipped: { ...state.equipped, [slot]: item }
                }));
                // TODO: Sync equip with backend
            },

            unequipItem: (slot) => {
                set((state) => ({
                    equipped: { ...state.equipped, [slot]: null }
                }));
                // TODO: Sync unequip with backend
            }
        }),
        {
            name: 'dust-inventory-storage',
        }
    )
);
