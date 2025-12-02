import { create } from 'zustand';
import type { CombatState, Enemy, CombatLogEntry } from '../types/combat';
import { calculateDamage } from '../utils/combatLogic';
import { useCharacterStore } from './characterStore';
import { useInventoryStore } from './inventoryStore';
import { SlotType } from '../types/inventory';

interface CombatStore extends CombatState {
    startDuel: (enemy: Enemy) => void;
    playerAttack: () => void;
    playerDefend: () => void;
    endCombat: () => void;
    addLog: (message: string, type: 'player' | 'enemy' | 'info') => void;
}

export const useCombatStore = create<CombatStore>((set, get) => ({
    isInCombat: false,
    turn: 'player',
    playerHealth: 100,
    playerMaxHealth: 100,
    enemy: null,
    combatLog: [],
    isDefending: false,

    startDuel: (enemy: Enemy) => {
        const playerStats = useCharacterStore.getState().stats?.attributes;
        // Simple max health calc: 50 + 10 * Endurance
        const maxHealth = playerStats ? 50 + (playerStats.endurance * 10) : 100;

        set({
            isInCombat: true,
            turn: 'player',
            playerHealth: maxHealth,
            playerMaxHealth: maxHealth,
            enemy: { ...enemy }, // Clone enemy
            combatLog: [],
            isDefending: false,
        });
        get().addLog(`Duel started against ${enemy.name}!`, 'info');
    },

    addLog: (message, type) => {
        const entry: CombatLogEntry = {
            id: crypto.randomUUID(),
            message,
            type,
            timestamp: Date.now(),
        };
        set(state => ({ combatLog: [...state.combatLog, entry] }));
    },

    playerAttack: () => {
        const { enemy, addLog } = get();
        if (!enemy) return;

        const player = useCharacterStore.getState().stats;
        const equipped = useInventoryStore.getState().equipped;
        const weapon = equipped[SlotType.MainHand];

        // Calculate Player Damage
        const damage = calculateDamage(
            {
                strength: player?.attributes.strength || 1,
                agility: player?.attributes.agility || 1,
                weaponDamage: weapon?.stats?.damage || 0
            },
            { endurance: enemy.stats.endurance }
        );

        // Apply Damage to Enemy
        const newEnemyHealth = Math.max(0, enemy.currentHealth - damage);
        set(state => ({
            enemy: state.enemy ? { ...state.enemy, currentHealth: newEnemyHealth } : null,
            isDefending: false // Reset defense after acting
        }));

        addLog(`You attacked ${enemy.name} for ${damage} damage!`, 'player');

        // Check Win Condition
        if (newEnemyHealth === 0) {
            addLog(`You defeated ${enemy.name}!`, 'info');
            // TODO: Award rewards
            setTimeout(() => get().endCombat(), 2000);
            return;
        }

        // End Player Turn
        set({ turn: 'enemy' });
        setTimeout(() => {
            executeEnemyTurn();
        }, 1000);
    },

    playerDefend: () => {
        set({ isDefending: true, turn: 'enemy' });
        get().addLog('You take a defensive stance.', 'player');

        setTimeout(() => {
            executeEnemyTurn();
        }, 1000);
    },

    endCombat: () => {
        set({ isInCombat: false, enemy: null });
    }
}));

// Helper to execute enemy turn logic
const executeEnemyTurn = () => {
    const store = useCombatStore.getState();
    const { enemy, playerHealth, isDefending, addLog } = store;

    if (!enemy) return;

    // Enemy Attack Logic
    const damage = calculateDamage(
        {
            strength: enemy.stats.strength,
            agility: enemy.stats.agility,
            weaponDamage: 0 // Assume base stats include "weapon" for simplicity or add to enemy type
        },
        {
            endurance: useCharacterStore.getState().stats?.attributes.endurance || 1,
            isDefending: isDefending
        }
    );

    const newPlayerHealth = Math.max(0, playerHealth - damage);
    useCombatStore.setState({ playerHealth: newPlayerHealth, turn: 'player' });

    addLog(`${enemy.name} attacked you for ${damage} damage!`, 'enemy');

    // Check Loss Condition
    if (newPlayerHealth === 0) {
        addLog(`You were defeated by ${enemy.name}...`, 'info');
        setTimeout(() => store.endCombat(), 2000);
    }
};
