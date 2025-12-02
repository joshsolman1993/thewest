import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useAuthStore } from './authStore';
import type { InventoryItem, SlotType } from '../types/inventory';

interface InventoryState {
    items: InventoryItem[];
    equipped: {
        mainHand: InventoryItem | null;
        offHand: InventoryItem | null;
        head: InventoryItem | null;
        body: InventoryItem | null;
        legs: InventoryItem | null;
        boots: InventoryItem | null;
        feet: InventoryItem | null;
        accessory: InventoryItem | null;
    };
    addItem: (item: InventoryItem) => void;
    removeItem: (itemId: string, amount?: number) => void;
    equipItem: (instanceId: string, slot: SlotType) => void;
    unequipItem: (slot: SlotType) => void;
    fetchInventory: () => Promise<void>;
}

const API_URL = 'http://localhost:3000';

export const useInventoryStore = create<InventoryState>()(
    persist(
        (set) => ({
            items: [],
            equipped: {
                mainHand: null,
                offHand: null,
                head: null,
                body: null,
                legs: null,
                boots: null,
                feet: null,
                accessory: null,
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
                        console.log('Fetched inventory:', data);
                        // TODO: Map backend data to InventoryItem format
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
                                    ? { ...i, quantity: i.quantity + newItem.quantity }
                                    : i
                            )
                        };
                    }
                    return { items: [...state.items, newItem] };
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
                            itemName: newItem.name,
                            itemType: newItem.type,
                            quantity: newItem.quantity
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
            },

            equipItem: (instanceId, slot) => {
                set((state) => {
                    const item = state.items.find(i => i.instanceId === instanceId);
                    if (!item) return state;

                    return {
                        equipped: { ...state.equipped, [slot]: item }
                    };
                });
            },

            unequipItem: (slot) => {
                set((state) => ({
                    equipped: { ...state.equipped, [slot]: null }
                }));
            }
        }),
        {
            name: 'dust-inventory-storage',
        }
    )
);
