import type { InventoryItem } from '../../types/inventory';
import { DraggableItem } from './DraggableItem';
import { DroppableSlot } from './DroppableSlot';

interface InventoryGridProps {
    items: InventoryItem[];
    maxSlots: number;
}

export const InventoryGrid = ({ items, maxSlots }: InventoryGridProps) => {
    // Create array of slots
    const slots = Array.from({ length: maxSlots }, (_, index) => {
        const slotId = `inventory-slot-${index}`;
        // Find item at this "index" if we were tracking positions, 
        // but for now we just fill slots sequentially or find by some logic.
        // The store currently just has a list of items. 
        // To map them to specific grid slots, we'd need a 'position' field in InventoryItem.
        // For MVP, let's just fill the first N slots with items.

        const item = items[index];

        return (
            <DroppableSlot key={slotId} id={slotId} type="inventory">
                {item && <DraggableItem id={item.instanceId} item={item} />}
            </DroppableSlot>
        );
    });

    return (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(3rem,1fr))] gap-2 p-4 bg-[rgba(0,0,0,0.1)] rounded-lg border border-[var(--color-leather)]">
            {slots}
        </div>
    );
};
