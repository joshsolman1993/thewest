import { useDroppable } from '@dnd-kit/core';
import { type ReactNode } from 'react';

interface DroppableSlotProps {
    id: string;
    children?: ReactNode;
    type?: string; // 'inventory' or 'equipment'
    label?: string; // For equipment slots (e.g., "Head")
    isActive?: boolean; // If true, highlights as valid drop target
}

export const DroppableSlot = ({ id, children, type = 'inventory', label, isActive }: DroppableSlotProps) => {
    const { isOver, setNodeRef } = useDroppable({
        id: id,
        data: { type, id }, // Pass slot data for drop handler
    });

    const isEquipment = type === 'equipment';

    const baseClasses = "relative flex items-center justify-center transition-colors border";
    const sizeClasses = isEquipment ? "w-16 h-16" : "w-12 h-12";
    const roundedClasses = "rounded";

    let bgClass = "bg-[rgba(107,68,35,0.1)]";
    let borderClass = "border-[var(--color-leather)]";

    if (isOver) {
        bgClass = "bg-[rgba(212,175,55,0.2)]";
        borderClass = "border-[var(--color-gold)]";
    } else if (isActive) {
        borderClass = "border-[var(--color-gold)] border-dashed";
    }

    return (
        <div className="flex flex-col items-center gap-1">
            <div
                ref={setNodeRef}
                className={`${baseClasses} ${sizeClasses} ${roundedClasses} ${bgClass} ${borderClass}`}
            >
                {children}

                {!children && isEquipment && label && (
                    <span className="text-[10px] uppercase tracking-wider text-[var(--color-leather)] opacity-50 font-bold">
                        {label}
                    </span>
                )}
            </div>
        </div>
    );
};
