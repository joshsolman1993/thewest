import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../store/authStore';
import type { InventoryItem } from '../../types/inventory';

const API_URL = 'http://localhost:3000';

// Types
interface AddItemData {
    itemId: string;
    itemName: string;
    itemType: string;
    quantity: number;
}

// API Functions
const fetchInventory = async (token: string): Promise<InventoryItem[]> => {
    const response = await fetch(`${API_URL}/inventory`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch inventory');
    }

    return response.json();
};

const addItem = async (data: AddItemData, token: string): Promise<InventoryItem> => {
    const response = await fetch(`${API_URL}/inventory/add`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error('Failed to add item');
    }

    return response.json();
};

const removeItem = async (itemId: string, quantity: number, token: string): Promise<void> => {
    const response = await fetch(`${API_URL}/inventory/${itemId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ quantity })
    });

    if (!response.ok) {
        throw new Error('Failed to remove item');
    }
};

const toggleEquip = async (itemId: string, token: string): Promise<InventoryItem> => {
    const response = await fetch(`${API_URL}/inventory/${itemId}/equip`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
        throw new Error('Failed to toggle equip');
    }

    return response.json();
};

// Hooks
export const useInventory = () => {
    const { token } = useAuthStore();

    return useQuery({
        queryKey: ['inventory'],
        queryFn: () => fetchInventory(token!),
        enabled: !!token,
    });
};

export const useAddItem = () => {
    const queryClient = useQueryClient();
    const { token } = useAuthStore();

    return useMutation({
        mutationFn: (data: AddItemData) => addItem(data, token!),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['inventory'] });
        },
    });
};

export const useRemoveItem = () => {
    const queryClient = useQueryClient();
    const { token } = useAuthStore();

    return useMutation({
        mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
            removeItem(itemId, quantity, token!),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['inventory'] });
        },
    });
};

export const useToggleEquip = () => {
    const queryClient = useQueryClient();
    const { token } = useAuthStore();

    return useMutation({
        mutationFn: (itemId: string) => toggleEquip(itemId, token!),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['inventory'] });
        },
    });
};
