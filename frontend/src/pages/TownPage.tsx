import { ParchmentPanel, WesternButton } from '../components/ui';
import { useQuestStore } from '../store/questStore';
import { useCombatStore } from '../store/combatStore';

export const TownPage = () => {
    const buildings = [
        { name: 'Town Hall', icon: '🏛️', level: 5 },
        { name: 'Bank', icon: '🏦', level: 3 },
        { name: 'Saloon', icon: '🍺', level: 4 },
        { name: 'Gunsmith', icon: '🔫', level: 2 },
        { name: 'Stable', icon: '🐴', level: 3 },
        { name: 'Market', icon: '🛒', level: 4 },
    ];

    return (
        <div>
            <h1 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '3rem',
                color: 'var(--color-leather-darkest)',
                marginBottom: 'var(--space-6)',
                textAlign: 'center'
            }}>
                Dusty Gulch
            </h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--space-4)' }}>
                {buildings.map(building => (
                    <ParchmentPanel key={building.name} title={building.name}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '4rem', margin: 'var(--space-4) 0' }}>
                                {building.icon}
                            </div>
                            <div style={{
                                fontFamily: 'var(--font-ui)',
                                fontSize: '0.875rem',
                                color: 'var(--color-leather)',
                                marginBottom: 'var(--space-3)'
                            }}>
                                Level {building.level}
                            </div>
                            <div className="flex flex-col gap-2 mt-2">
                                <WesternButton
                                    variant="primary"
                                    size="sm"
                                    onClick={() => {
                                        if (building.name === 'Saloon') {
                                            useQuestStore.getState().updateObjective('tutorial_01', 'obj_visit_saloon', 1);
                                        }
                                    }}
                                >
                                    Enter
                                </WesternButton>
                                {building.name === 'Saloon' && (
                                    <WesternButton
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => {
                                            const { startDuel } = useCombatStore.getState();
                                            startDuel({
                                                id: 'sheriff_01',
                                                name: 'Sheriff McCoy',
                                                level: 5,
                                                maxHealth: 100,
                                                currentHealth: 100,
                                                stats: { strength: 5, agility: 3, endurance: 4 },
                                                avatar: '⭐',
                                                rewards: { xp: 50, gold: 20 }
                                            });
                                            window.location.hash = '#duel';
                                        }}
                                    >
                                        Challenge Sheriff
                                    </WesternButton>
                                )}
                            </div>
                        </div>
                    </ParchmentPanel>
                ))}
            </div>
        </div>
    );
};
