export interface Enemy {
    id: string;
    name: string;
    level: number;
    maxHealth: number;
    currentHealth: number;
    stats: {
        strength: number;
        agility: number;
        endurance: number;
    };
    avatar: string; // Emoji or image URL
    rewards: {
        xp: number;
        gold: number;
    };
}

export type CombatActionType = 'attack' | 'defend' | 'item';

export interface CombatLogEntry {
    id: string;
    message: string;
    type: 'player' | 'enemy' | 'info';
    timestamp: number;
}

export interface CombatState {
    isInCombat: boolean;
    turn: 'player' | 'enemy';
    playerHealth: number;
    playerMaxHealth: number;
    enemy: Enemy | null;
    combatLog: CombatLogEntry[];
    isDefending: boolean; // Player is defending
}
