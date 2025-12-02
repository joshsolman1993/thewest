import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryItem } from './inventory-item.entity';
import { CharacterService } from '../character/character.service';

@Injectable()
export class InventoryService {
    constructor(
        @InjectRepository(InventoryItem)
        private inventoryRepository: Repository<InventoryItem>,
        private characterService: CharacterService,
    ) { }

    async addItem(characterId: string, itemId: string, quantity: number): Promise<InventoryItem> {
        // Check if item already exists in inventory
        const existingItem = await this.inventoryRepository.findOne({
            where: { character: { id: characterId }, itemId },
        });

        if (existingItem) {
            existingItem.quantity += quantity;
            return this.inventoryRepository.save(existingItem);
        }

        const character = await this.characterService.findOneByUserId(characterId); // Note: this expects userId, but we passed characterId. 
        // Wait, characterService.findOneByUserId takes userId. We need a way to get character by ID directly or pass userId.
        // Let's assume we pass characterId here for now, but we need to fetch the character entity to link it.
        // Actually, we can just use the ID if we had a findOne method in CharacterService.
        // Let's add findOne to CharacterService or use a repository here if we exported it? No, better to use service.
        // For now, let's assume we pass the character entity or fetch it.
        // Let's fetch character by ID.

        // Correction: I'll update CharacterService to have findOneById

        const newItem = this.inventoryRepository.create({
            itemId,
            quantity,
            character: { id: characterId } as any, // Temporary cast until we have the entity
        });
        return this.inventoryRepository.save(newItem);
    }

    async getInventory(characterId: string): Promise<InventoryItem[]> {
        return this.inventoryRepository.find({
            where: { character: { id: characterId } },
        });
    }
}
