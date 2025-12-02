export const QuestType = {
    Main: 'main',
    Side: 'side',
    Daily: 'daily'
} as const;

export type QuestType = typeof QuestType[keyof typeof QuestType];

export const ObjectiveType = {
    Kill: 'kill',
    Collect: 'collect',
    Visit: 'visit',
    Equip: 'equip',
    Talk: 'talk'
} as const;

export type ObjectiveType = typeof ObjectiveType[keyof typeof ObjectiveType];

export interface QuestReward {
    xp?: number;
    gold?: number;
    items?: string[]; // Item IDs
}

export interface QuestObjective {
    id: string;
    description: string;
    type: ObjectiveType;
    target?: string; // Target ID (e.g., 'rat', 'saloon', 'rusty_revolver')
    requiredAmount: number;
    currentAmount: number;
    completed: boolean;
}

export interface Quest {
    id: string;
    title: string;
    description: string;
    type: QuestType;
    minLevel: number;
    objectives: QuestObjective[];
    rewards: QuestReward;
    autoAccept?: boolean; // If true, automatically added when requirements met
}

export interface ActiveQuest extends Quest {
    acceptedAt: number;
    isCompleted: boolean;
    isTracked: boolean;
}
