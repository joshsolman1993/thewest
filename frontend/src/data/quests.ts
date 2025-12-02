import { QuestType, ObjectiveType } from '../types/quest';
import type { Quest } from '../types/quest';

export const QUESTS: Record<string, Quest> = {
    'tutorial_01': {
        id: 'tutorial_01',
        title: 'Welcome to Dust',
        description: 'You\'ve just arrived in town. Better look the part before you start making trouble.',
        type: QuestType.Main,
        minLevel: 1,
        autoAccept: true,
        objectives: [
            {
                id: 'obj_equip_hat',
                description: 'Equip a Hat',
                type: ObjectiveType.Equip,
                target: 'worn_hat',
                requiredAmount: 1,
                currentAmount: 0,
                completed: false
            },
            {
                id: 'obj_visit_saloon',
                description: 'Visit the Saloon',
                type: ObjectiveType.Visit,
                target: 'saloon',
                requiredAmount: 1,
                currentAmount: 0,
                completed: false
            }
        ],
        rewards: {
            xp: 100,
            gold: 10
        }
    },
    'side_rats_01': {
        id: 'side_rats_01',
        title: 'Rat Problem',
        description: 'The Saloon owner is complaining about rats in the cellar. Go take care of them.',
        type: QuestType.Side,
        minLevel: 1,
        objectives: [
            {
                id: 'obj_kill_rats',
                description: 'Kill Rats',
                type: ObjectiveType.Kill,
                target: 'rat',
                requiredAmount: 5,
                currentAmount: 0,
                completed: false
            }
        ],
        rewards: {
            xp: 50,
            gold: 5,
            items: ['beans']
        }
    }
};
