import { useState } from 'react';
import {
    DndContext,
    DragOverlay,
    useSensor,
    useSensors,
    PointerSensor
} from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { ParchmentPanel, WesternButton } from '../components/ui';
import { useCharacterStore } from '../store/characterStore';
import { useInventoryStore } from '../store/inventoryStore';
import { useQuestStore } from '../store/questStore';
import { Character3DViewer } from '../components/3d/Character3DViewer';
import { InventoryGrid } from '../components/inventory/InventoryGrid';
import { DroppableSlot } from '../components/inventory/DroppableSlot';
import { DraggableItem } from '../components/inventory/DraggableItem';
import { SlotType } from '../types/inventory';
import type { InventoryItem } from '../types/inventory';

export const CharacterPage = () => {
    const { stats, updateAttribute } = useCharacterStore();

    const { items, equipped, equipItem, unequipItem } = useInventoryStore();
    const maxSlots = 20; // Hardcoded for now
    const [activeItem, setActiveItem] = useState<InventoryItem | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const attributeKeys = Object.keys(stats.attributes) as Array<keyof typeof stats.attributes>;

    const handleDragStart = (event: DragStartEvent) => {
        const item = items.find(i => i.id === event.active.id as string) ||
            Object.values(equipped).find(i => i?.id === event.active.id as string);
        if (item) setActiveItem(item as any);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        setActiveItem(null);

        if (!over) return;

        const activeInstanceId = active.id as string;
        const overData = over.data.current;

        if (!overData) return;

        // Find where the item currently is
        const currentSlotEntry = Object.entries(equipped).find(([_, item]) => item?.instanceId === activeInstanceId);
        const currentSlot = currentSlotEntry ? currentSlotEntry[0] as SlotType : null;

        // Dropped on Equipment Slot
        if (overData.type === 'equipment') {
            const targetSlot = overData.id as SlotType;

            // Check if item belongs in this slot
            const item = items.find(i => i.instanceId === activeInstanceId) ||
                Object.values(equipped).find(i => i?.instanceId === activeInstanceId);

            if (item && item.slot === targetSlot) {
                equipItem(activeInstanceId, targetSlot);

                // Quest Trigger: Equip Hat
                if (item.id === 'worn_hat' && targetSlot === SlotType.Head) {
                    useQuestStore.getState().updateObjective('tutorial_01', 'obj_equip_hat', 1);
                }
            }
        }
        // Dropped on Inventory Slot
        else if (overData.type === 'inventory') {
            // If it was equipped, unequip it
            if (currentSlot) {
                unequipItem(currentSlot);
            }
            // If it was already in inventory, we could reorder here
        }
    };

    return (
        <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div>
                <h1 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '3rem',
                    color: 'var(--color-leather-darkest)',
                    marginBottom: 'var(--space-6)',
                    textAlign: 'center'
                }}>
                    Character Sheet
                </h1>

                {/* 3D Character Viewer */}
                <div style={{ marginBottom: 'var(--space-6)' }}>
                    <ParchmentPanel title="Character Preview" seal>
                        <Character3DViewer
                            characterClass="gunslinger"
                            avatar="🤠"
                        />
                    </ParchmentPanel>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
                    <ParchmentPanel title="Attributes">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                            {attributeKeys.map(attr => (
                                <div key={attr} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, textTransform: 'capitalize' }}>
                                        {attr}
                                    </span>
                                    <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                                        <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', color: 'var(--color-gold)', minWidth: '40px', textAlign: 'center' }}>
                                            {stats.attributes[attr]}
                                        </span>
                                        <WesternButton size="sm" onClick={() => updateAttribute(attr, stats.attributes[attr] + 1)}>
                                            +
                                        </WesternButton>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ParchmentPanel>

                    <ParchmentPanel title="Stats">
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                            <div style={{
                                padding: 'var(--space-3)',
                                background: 'rgba(107,68,35,0.1)',
                                borderRadius: 'var(--radius-md)',
                                textAlign: 'center'
                            }}>
                                <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.875rem', marginBottom: 'var(--space-1)' }}>
                                    Level
                                </div>
                                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', color: 'var(--color-gold)' }}>
                                    {stats.level}
                                </div>
                            </div>
                            <div style={{
                                padding: 'var(--space-3)',
                                background: 'rgba(107,68,35,0.1)',
                                borderRadius: 'var(--radius-md)',
                                textAlign: 'center'
                            }}>
                                <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.875rem', marginBottom: 'var(--space-1)' }}>
                                    XP
                                </div>
                                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', color: 'var(--color-gold)' }}>
                                    {stats.xp}/{stats.maxXp}
                                </div>
                            </div>
                            <div style={{
                                padding: 'var(--space-3)',
                                background: 'rgba(107,68,35,0.1)',
                                borderRadius: 'var(--radius-md)',
                                textAlign: 'center'
                            }}>
                                <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.875rem', marginBottom: 'var(--space-1)' }}>
                                    Health
                                </div>
                                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', color: 'var(--color-gold)' }}>
                                    {stats.health}/{stats.maxHealth}
                                </div>
                            </div>
                            <div style={{
                                padding: 'var(--space-3)',
                                background: 'rgba(107,68,35,0.1)',
                                borderRadius: 'var(--radius-md)',
                                textAlign: 'center'
                            }}>
                                <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.875rem', marginBottom: 'var(--space-1)' }}>
                                    Gold
                                </div>
                                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', color: 'var(--color-gold)' }}>
                                    ${stats.gold}
                                </div>
                            </div>
                        </div>
                    </ParchmentPanel>
                </div>

                <div style={{ marginTop: 'var(--space-6)' }}>
                    <ParchmentPanel title="Equipment & Inventory" seal>
                        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
                            {/* Equipment Slots - Paper Doll Layout */}
                            <div className="flex flex-col items-center gap-4 p-4 bg-[rgba(0,0,0,0.05)] rounded-lg border border-[var(--color-leather)]/30">
                                <h3 className="font-[var(--font-heading)] text-[var(--color-gold)] text-lg mb-2">Loadout</h3>

                                {/* Head */}
                                <div className="flex justify-center">
                                    <DroppableSlot
                                        id={SlotType.Head}
                                        type="equipment"
                                        label="Head"
                                        isActive={activeItem?.slot === SlotType.Head}
                                    >
                                        {equipped[SlotType.Head] && (
                                            <DraggableItem id={equipped[SlotType.Head]!.instanceId} item={equipped[SlotType.Head]!} />
                                        )}
                                    </DroppableSlot>
                                </div>

                                {/* Torso & Hands Row */}
                                <div className="flex gap-4 items-center">
                                    <DroppableSlot
                                        id={SlotType.MainHand}
                                        type="equipment"
                                        label="Main Hand"
                                        isActive={activeItem?.slot === SlotType.MainHand}
                                    >
                                        {equipped[SlotType.MainHand] && (
                                            <DraggableItem id={equipped[SlotType.MainHand]!.instanceId} item={equipped[SlotType.MainHand]!} />
                                        )}
                                    </DroppableSlot>

                                    <DroppableSlot
                                        id={SlotType.Body}
                                        type="equipment"
                                        label="Body"
                                        isActive={activeItem?.slot === SlotType.Body}
                                    >
                                        {equipped[SlotType.Body] && (
                                            <DraggableItem id={equipped[SlotType.Body]!.instanceId} item={equipped[SlotType.Body]!} />
                                        )}
                                    </DroppableSlot>

                                    <DroppableSlot
                                        id={SlotType.OffHand}
                                        type="equipment"
                                        label="Off Hand"
                                        isActive={activeItem?.slot === SlotType.OffHand}
                                    >
                                        {equipped[SlotType.OffHand] && (
                                            <DraggableItem id={equipped[SlotType.OffHand]!.instanceId} item={equipped[SlotType.OffHand]!} />
                                        )}
                                    </DroppableSlot>
                                </div>

                                {/* Legs */}
                                <div className="flex justify-center">
                                    <DroppableSlot
                                        id={SlotType.Legs}
                                        type="equipment"
                                        label="Legs"
                                        isActive={activeItem?.slot === SlotType.Legs}
                                    >
                                        {equipped[SlotType.Legs] && (
                                            <DraggableItem id={equipped[SlotType.Legs]!.instanceId} item={equipped[SlotType.Legs]!} />
                                        )}
                                    </DroppableSlot>
                                </div>

                                {/* Feet & Accessory Row */}
                                <div className="flex gap-8 items-center">
                                    <DroppableSlot
                                        id={SlotType.Feet}
                                        type="equipment"
                                        label="Feet"
                                        isActive={activeItem?.slot === SlotType.Feet}
                                    >
                                        {equipped[SlotType.Feet] && (
                                            <DraggableItem id={equipped[SlotType.Feet]!.instanceId} item={equipped[SlotType.Feet]!} />
                                        )}
                                    </DroppableSlot>

                                    <DroppableSlot
                                        id={SlotType.Accessory}
                                        type="equipment"
                                        label="Accessory"
                                        isActive={activeItem?.slot === SlotType.Accessory}
                                    >
                                        {equipped[SlotType.Accessory] && (
                                            <DraggableItem id={equipped[SlotType.Accessory]!.instanceId} item={equipped[SlotType.Accessory]!} />
                                        )}
                                    </DroppableSlot>
                                </div>
                            </div>

                            {/* Inventory Grid */}
                            <div className="flex flex-col gap-2">
                                <h3 className="font-[var(--font-heading)] text-[var(--color-gold)] text-lg mb-2">Backpack</h3>
                                <InventoryGrid items={items} maxSlots={maxSlots} />
                            </div>
                        </div>
                    </ParchmentPanel>
                </div>
            </div>

            <DragOverlay>
                {activeItem ? (
                    <div className="w-12 h-12 bg-[var(--color-parchment)] border border-[var(--color-gold)] rounded flex items-center justify-center text-2xl shadow-lg opacity-80">
                        {activeItem.icon}
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
};
