import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import type { InventoryItem } from '../../types/inventory';

interface DraggableItemProps {
    item: InventoryItem;
    id: string; // Unique ID for dnd-kit (usually instanceId)
}

export const DraggableItem = ({ item, id }: DraggableItemProps) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: id,
        data: item, // Pass item data for drop handler
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : 1,
        cursor: 'grab',
        touchAction: 'none',
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className="relative group"
        >
            <div className="w-12 h-12 bg-[var(--color-parchment)] border border-[var(--color-leather)] rounded flex items-center justify-center text-2xl shadow-sm hover:border-[var(--color-gold)] transition-colors">
                {item.icon}
            </div>

            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-[var(--color-leather-darkest)] text-[var(--color-parchment)] text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none z-50 transition-opacity">
                <div className="font-bold text-[var(--color-gold)] mb-1">{item.name}</div>
                <div className="mb-1 italic opacity-80">{item.type} • {item.rarity}</div>
                <div className="mb-2">{item.description}</div>
                {item.stats && (
                    <div className="grid grid-cols-2 gap-1 text-[var(--color-gold)]">
                        {Object.entries(item.stats).map(([key, value]) => (
                            <div key={key} className="capitalize">{key}: +{value}</div>
                        ))}
                    </div>
                )}
            </div>

            {item.quantity > 1 && (
                <div className="absolute -bottom-1 -right-1 bg-[var(--color-leather-dark)] text-[var(--color-gold)] text-[10px] px-1 rounded border border-[var(--color-gold)]">
                    {item.quantity}
                </div>
            )}
        </div>
    );
};
