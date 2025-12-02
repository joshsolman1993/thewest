import { useQuestStore } from '../../store/questStore';
import { QuestCard } from './QuestCard';

export const QuestLog = () => {
    const activeQuests = useQuestStore(state => state.activeQuests);

    return (
        <div className="flex flex-col gap-4">
            {activeQuests.length === 0 ? (
                <div className="text-center p-8 text-[var(--color-leather)] opacity-70 italic">
                    No active quests. Look for work at the Saloon!
                </div>
            ) : (
                activeQuests.map(quest => (
                    <QuestCard key={quest.id} quest={quest} />
                ))
            )}
        </div>
    );
};
