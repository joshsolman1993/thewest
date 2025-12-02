export const ItemType = {
    Weapon: 'weapon',
    Armor: 'armor',
    Consumable: 'consumable',
    Material: 'material',
    Quest: 'quest'
} as const;

export type ItemType = typeof ItemType[keyof typeof ItemType];

export const Rarity = {
    Common: 'common',
    Uncommon: 'uncommon',
    Rare: 'rare',
    Epic: 'epic',
    Legendary: 'legendary'
} as const;

export type Rarity = typeof Rarity[keyof typeof Rarity];

export const SlotType = {
    Head: 'head',
    Body: 'body',
    Legs: 'legs',
    Feet: 'feet',
    MainHand: 'mainHand',
    OffHand: 'offHand',
    Accessory: 'accessory'
} as const;

export type SlotType = typeof SlotType[keyof typeof SlotType];

export interface ItemStats {
    damage?: number;
    defense?: number;
    health?: number;
    speed?: number;
    grit?: number;
}

export interface Item {
    id: string; // Template ID (e.g., 'rusty_revolver')
    name: string;
    description: string;
    type: ItemType;
    rarity: Rarity;
    icon: string; // Emoji or image path
    stats?: ItemStats;
    slot?: SlotType; // Only for equippable items
    value: number;
    stackable?: boolean;
}

export interface InventoryItem extends Item {
    instanceId: string; // Unique ID for this specific item instance
    quantity: number;
}

export type EquipmentSlots = {
    [key in SlotType]?: InventoryItem | null;
};
