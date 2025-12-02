import { useEffect, useRef } from 'react';
import { useCombatStore } from '../store/combatStore';
import { HealthBar } from '../components/combat/HealthBar';
import { WesternButton, ParchmentPanel } from '../components/ui';

export const DuelPage = () => {
    const {
        isInCombat,
        enemy,
        playerHealth,
        playerMaxHealth,
        turn,
        combatLog,
        playerAttack,
        playerDefend
    } = useCombatStore();

    const logEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll log
    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [combatLog]);

    if (!isInCombat || !enemy) {
        return (
            <div className="text-center p-8">
                <h2 className="text-2xl font-[var(--font-heading)] text-[var(--color-leather-darkest)] mb-4">
                    No Active Duel
                </h2>
                <WesternButton onClick={() => window.location.hash = '#town'}>
                    Return to Town
                </WesternButton>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto h-full flex flex-col gap-4">
            {/* Arena Header */}
            <div className="text-center mb-2">
                <h1 className="font-[var(--font-display)] text-3xl text-[var(--color-leather-darkest)]">
                    Duel at High Noon
                </h1>
            </div>

            {/* Battle Area */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">

                {/* Player Side */}
                <ParchmentPanel title="You">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-24 h-24 bg-[var(--color-leather-dark)] rounded-full border-4 border-[var(--color-gold)] flex items-center justify-center text-4xl shadow-lg">
                            🤠
                        </div>
                        <HealthBar current={playerHealth} max={playerMaxHealth} label="Health" />

                        <div className="mt-4 flex flex-col gap-2 w-full">
                            <WesternButton
                                variant="primary"
                                onClick={playerAttack}
                                disabled={turn !== 'player'}
                            >
                                Attack ⚔️
                            </WesternButton>
                            <WesternButton
                                variant="secondary"
                                onClick={playerDefend}
                                disabled={turn !== 'player'}
                            >
                                Defend 🛡️
                            </WesternButton>
                        </div>

                        {turn === 'player' && (
                            <div className="text-[var(--color-success)] font-bold animate-pulse">
                                Your Turn!
                            </div>
                        )}
                    </div>
                </ParchmentPanel>

                {/* Combat Log (Center) */}
                <div className="bg-[rgba(0,0,0,0.2)] rounded-lg p-4 border border-[var(--color-leather)] overflow-y-auto h-[300px] md:h-auto flex flex-col gap-2 font-[var(--font-ui)] text-sm">
                    {combatLog.length === 0 && (
                        <div className="text-center text-[var(--color-parchment)] opacity-50 italic mt-4">
                            The duel begins...
                        </div>
                    )}
                    {combatLog.map(entry => (
                        <div
                            key={entry.id}
                            className={`p-2 rounded ${entry.type === 'player' ? 'bg-[rgba(0,255,0,0.1)] text-[var(--color-parchment)]' :
                                    entry.type === 'enemy' ? 'bg-[rgba(255,0,0,0.1)] text-[var(--color-error)]' :
                                        'text-[var(--color-gold)] text-center font-bold'
                                }`}
                        >
                            {entry.message}
                        </div>
                    ))}
                    <div ref={logEndRef} />
                </div>

                {/* Enemy Side */}
                <ParchmentPanel title={enemy.name}>
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-24 h-24 bg-[var(--color-leather-dark)] rounded-full border-4 border-[var(--color-error)] flex items-center justify-center text-4xl shadow-lg">
                            {enemy.avatar}
                        </div>
                        <HealthBar current={enemy.currentHealth} max={enemy.maxHealth} label="Health" />

                        <div className="mt-4 p-4 bg-[rgba(0,0,0,0.1)] rounded w-full text-center">
                            <div className="text-xs uppercase text-[var(--color-leather)] mb-1">Stats</div>
                            <div className="grid grid-cols-3 gap-2 text-sm font-bold text-[var(--color-leather-darkest)]">
                                <div>STR: {enemy.stats.strength}</div>
                                <div>AGI: {enemy.stats.agility}</div>
                                <div>END: {enemy.stats.endurance}</div>
                            </div>
                        </div>

                        {turn === 'enemy' && (
                            <div className="text-[var(--color-error)] font-bold animate-pulse">
                                Enemy Turn...
                            </div>
                        )}
                    </div>
                </ParchmentPanel>
            </div>
        </div>
    );
};
