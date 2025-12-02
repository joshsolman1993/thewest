import { useEffect } from 'react';
import { ParchmentPanel } from '../components/ui';
import { QuestLog } from '../components/quests/QuestLog';
import { useQuestStore } from '../store/questStore';

export const QuestsPage = () => {
    const { fetchQuests, activeQuests, availableQuests, acceptQuest } = useQuestStore();

    useEffect(() => {
        fetchQuests();
    }, [fetchQuests]);

    return (
        <div>
            <h1 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '3rem',
                color: 'var(--color-leather-darkest)',
                marginBottom: 'var(--space-6)',
                textAlign: 'center'
            }}>
                Wanted & Work
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ParchmentPanel title="Active Quests" seal>
                    <QuestLog />
                </ParchmentPanel>

                <ParchmentPanel title="Available Jobs">
                    <div className="flex flex-col gap-4">
                        {availableQuests.length === 0 ? (
                            <div className="text-center p-8 text-[var(--color-leather)] opacity-70 italic">
                                No new jobs available.
                            </div>
                        ) : (
                            availableQuests.map(quest => {
                                const isAccepted = activeQuests.some(aq => aq.quest.id === quest.id);
                                if (isAccepted) return null;

                                return (
                                    <div key={quest.id} className="bg-[rgba(107,68,35,0.1)] p-4 rounded border border-[var(--color-leather)]/30">
                                        <h3 className="font-[var(--font-heading)] text-[var(--color-gold)] text-lg mb-1">{quest.title}</h3>
                                        <p className="text-sm text-[var(--color-leather-dark)] mb-3">{quest.description}</p>
                                        <button
                                            onClick={() => acceptQuest(quest.id)}
                                            className="px-3 py-1 bg-[var(--color-gold)] text-[var(--color-leather-darkest)] text-xs font-bold uppercase rounded hover:bg-[var(--color-gold-light)]"
                                        >
                                            Accept Job
                                        </button>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </ParchmentPanel>
            </div>
        </div>
    );
};
