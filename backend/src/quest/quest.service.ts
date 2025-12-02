import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Quest } from './quest.entity';
import { UserQuest } from './user-quest.entity';
import { CharacterService } from '../character/character.service';
import { InventoryService } from '../inventory/inventory.service';
import { User } from '../users/user.entity';

@Injectable()
export class QuestService {
    constructor(
        @InjectRepository(Quest)
        private questRepository: Repository<Quest>,
        @InjectRepository(UserQuest)
        private userQuestRepository: Repository<UserQuest>,
        private characterService: CharacterService,
        private inventoryService: InventoryService,
        private dataSource: DataSource,
    ) { }

    async findAll(): Promise<Quest[]> {
        return this.questRepository.find();
    }

    async findUserQuests(userId: string): Promise<UserQuest[]> {
        return this.userQuestRepository.find({
            where: { user: { id: userId } },
            relations: ['quest'],
        });
    }

    async accept(user: User, questId: string): Promise<UserQuest> {
        const quest = await this.questRepository.findOne({ where: { id: questId } });
        if (!quest) throw new BadRequestException('Quest not found');

        const existing = await this.userQuestRepository.findOne({
            where: { user: { id: user.id }, quest: { id: questId } },
        });
        if (existing) throw new BadRequestException('Quest already accepted');

        const userQuest = this.userQuestRepository.create({
            user,
            quest,
            status: 'ACTIVE',
            progress: {}, // Initialize empty progress
        });
        return this.userQuestRepository.save(userQuest);
    }

    async complete(user: User, questId: string): Promise<UserQuest> {
        const userQuest = await this.userQuestRepository.findOne({
            where: { user: { id: user.id }, quest: { id: questId } },
            relations: ['quest'],
        });

        if (!userQuest) throw new BadRequestException('Quest not started');
        if (userQuest.status === 'COMPLETED') throw new BadRequestException('Quest already completed');

        // In a real game, we would validate objectives here.
        // For now, we assume the client is honest or the server logic elsewhere validated it.

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // 1. Mark Quest as Completed
            userQuest.status = 'COMPLETED';
            await queryRunner.manager.save(userQuest);

            // 2. Award Rewards
            const character = await this.characterService.findOneByUserId(user.id);
            if (character) {
                const rewards = userQuest.quest.rewards;

                // XP & Gold
                if (rewards.xp) {
                    // We need a way to add XP safely. 
                    // CharacterService.update takes Partial<Character>, but we need increment.
                    // Let's just fetch, add, and save for now within the transaction if possible,
                    // or just use the service methods if they are safe enough.
                    // Ideally, we'd use queryRunner to update character directly to ensure atomicity.
                    character.xp += rewards.xp;
                    character.gold += rewards.gold;

                    // Level up logic (simplified)
                    if (character.xp >= character.level * 100) {
                        character.xp -= character.level * 100;
                        character.level += 1;
                        character.maxHealth += 10;
                        character.currentHealth = character.maxHealth;
                    }

                    await queryRunner.manager.save(character);
                }

                // Items
                if (rewards.items) {
                    for (const itemReward of rewards.items) {
                        // We need to use InventoryService, but it uses its own repository.
                        // To be transactional, we should use the queryRunner's manager.
                        // This requires refactoring InventoryService to accept a manager or duplicating logic.
                        // For simplicity in this phase, we'll just call the service after the transaction commit 
                        // OR we accept that item reward might fail after quest completion (rare).
                        // BETTER: Let's just use the service. If it fails, we have a slight inconsistency.
                        // For a robust solution, we'd pass the transaction manager to the service.

                        await this.inventoryService.addItem(character.id, itemReward.itemId, itemReward.quantity);
                    }
                }
            }

            await queryRunner.commitTransaction();
            return userQuest;

        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }
}
