import type { UserQuest } from '../../store/questStore';

interface QuestCardProps {
    quest: UserQuest;
}

export const QuestCard = ({ quest }: QuestCardProps) => {
    const { quest: definition, progress } = quest;

    return (
        <div className="bg-[rgba(107,68,35,0.1)] p-4 rounded border border-[var(--color-leather)]/30 mb-4">
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-[var(--font-heading)] text-[var(--color-gold)] text-lg">
                    {definition.title}
                </h3>
                <span className="text-xs uppercase tracking-wider text-[var(--color-leather)] opacity-70">
                    {quest.status}
                </span>
            </div>

            <p className="text-[var(--color-leather-dark)] text-sm mb-4 italic">
                {definition.description}
            </p>

            <div className="space-y-2 mb-4">
                <h4 className="font-bold text-xs uppercase text-[var(--color-leather)]">Objectives</h4>
                {definition.objectives.map(obj => {
                    const current = progress[obj.id] || 0;
                    const isCompleted = current >= obj.target;

                    return (
                        <div key={obj.id} className="flex items-center gap-2 text-sm">
                            <div className={`w-4 h-4 border rounded flex items-center justify-center
                                ${isCompleted
                                    ? 'bg-[var(--color-gold)] border-[var(--color-gold)] text-[var(--color-leather-darkest)]'
                                    : 'border-[var(--color-leather)]'
                                }`}
                            >
                                {isCompleted && '✓'}
                            </div>
                            <span className={isCompleted ? 'line-through opacity-50' : ''}>
                                {obj.description}
                                {obj.target > 1 && ` (${current}/${obj.target})`}
                            </span>
                        </div>
                    );
                })}
            </div>

            <div className="flex gap-4 text-xs">
                {definition.rewards.xp && (
                    <span className="text-[var(--color-gold)]">+{definition.rewards.xp} XP</span>
                )}
                {definition.rewards.gold && (
                    <span className="text-[var(--color-gold)]">+{definition.rewards.gold} Gold</span>
                )}
                {definition.rewards.items && definition.rewards.items.length > 0 && (
                    <span className="text-[var(--color-gold)]">+{definition.rewards.items.length} Item(s)</span>
                )}
            </div>
        </div>
    );
};
