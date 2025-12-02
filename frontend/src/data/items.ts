import { ItemType, Rarity, SlotType } from '../types/inventory';
import type { Item } from '../types/inventory';

export const ITEMS: Record<string, Item> = {
    // Weapons
    'rusty_revolver': {
        id: 'rusty_revolver',
        name: 'Rusty Revolver',
        description: 'Old and reliable. Well, mostly old.',
        type: ItemType.Weapon,
        rarity: Rarity.Common,
        icon: '🔫',
        slot: SlotType.MainHand,
        value: 10,
        stats: { damage: 5, speed: 2 }
    },
    'colt_navy': {
        id: 'colt_navy',
        name: 'Colt Navy',
        description: 'A standard issue sidearm for the discerning gunslinger.',
        type: ItemType.Weapon,
        rarity: Rarity.Uncommon,
        icon: '🔫',
        slot: SlotType.MainHand,
        value: 50,
        stats: { damage: 12, speed: 3, grit: 1 }
    },
    'bowie_knife': {
        id: 'bowie_knife',
        name: 'Bowie Knife',
        description: 'Sharp enough to shave with, big enough to fight with.',
        type: ItemType.Weapon,
        rarity: Rarity.Common,
        icon: '🔪',
        slot: SlotType.OffHand,
        value: 15,
        stats: { damage: 4, speed: 5 }
    },

    // Clothing / Armor
    'worn_hat': {
        id: 'worn_hat',
        name: 'Worn Hat',
        description: 'Keeps the sun out of your eyes.',
        type: ItemType.Armor,
        rarity: Rarity.Common,
        icon: '🤠',
        slot: SlotType.Head,
        value: 5,
        stats: { defense: 1 }
    },
    'leather_vest': {
        id: 'leather_vest',
        name: 'Leather Vest',
        description: 'Offers some protection against scratches and bar fights.',
        type: ItemType.Armor,
        rarity: Rarity.Common,
        icon: '🦺',
        slot: SlotType.Body,
        value: 20,
        stats: { defense: 3, grit: 1 }
    },
    'cowboy_boots': {
        id: 'cowboy_boots',
        name: 'Cowboy Boots',
        description: 'Made for walking and riding.',
        type: ItemType.Armor,
        rarity: Rarity.Uncommon,
        icon: '👢',
        slot: SlotType.Feet,
        value: 30,
        stats: { defense: 2, speed: 2 }
    },
    'poncho': {
        id: 'poncho',
        name: 'Dusty Poncho',
        description: 'Classic western style. Adds mystery.',
        type: ItemType.Armor,
        rarity: Rarity.Rare,
        icon: '🧥',
        slot: SlotType.Body,
        value: 75,
        stats: { defense: 5, grit: 3 }
    },

    // Consumables
    'beans': {
        id: 'beans',
        name: 'Can of Beans',
        description: 'Musical fruit. Restores health.',
        type: ItemType.Consumable,
        rarity: Rarity.Common,
        icon: '🥫',
        value: 2,
        stackable: true,
        stats: { health: 10 }
    },
    'whiskey': {
        id: 'whiskey',
        name: 'Cheap Whiskey',
        description: 'Burns on the way down. Increases grit temporarily.',
        type: ItemType.Consumable,
        rarity: Rarity.Common,
        icon: '🥃',
        value: 5,
        stackable: true,
        stats: { grit: 5 }
    },
    'bandage': {
        id: 'bandage',
        name: 'Dirty Bandage',
        description: 'Better than bleeding out.',
        type: ItemType.Consumable,
        rarity: Rarity.Common,
        icon: '🩹',
        value: 3,
        stackable: true,
        stats: { health: 15 }
    },

    // Materials
    'gold_nugget': {
        id: 'gold_nugget',
        name: 'Gold Nugget',
        description: 'Shiny and valuable.',
        type: ItemType.Material,
        rarity: Rarity.Rare,
        icon: '🪙',
        value: 100,
        stackable: true
    }
};
