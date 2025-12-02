interface CombatStats {
    strength: number;
    agility: number;
    weaponDamage?: number;
}

export const calculateDamage = (
    attacker: CombatStats,
    defender: { endurance: number; isDefending?: boolean }
): number => {
    // Base damage from Strength
    let damage = attacker.strength * 1.5;

    // Add weapon damage if available
    if (attacker.weaponDamage) {
        damage += attacker.weaponDamage;
    }

    // Critical hit chance based on Agility (e.g., 1 Agility = 1% crit chance)
    const critChance = Math.min(attacker.agility * 0.01, 0.5); // Cap at 50%
    const isCrit = Math.random() < critChance;

    if (isCrit) {
        damage *= 2;
    }

    // Damage reduction from Endurance
    const reduction = defender.endurance * 0.5;
    damage = Math.max(1, damage - reduction);

    // Defense stance reduces damage by 50%
    if (defender.isDefending) {
        damage *= 0.5;
    }

    // Add some randomness (+/- 10%)
    const variance = 0.9 + Math.random() * 0.2;
    damage *= variance;

    return Math.round(damage);
};
