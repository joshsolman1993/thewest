import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryItem } from './inventory-item.entity';
import { UsersService } from '../users/users.service';
import { AddItemDto } from './dto/add-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Injectable()
export class InventoryService {
    private readonly logger = new Logger(InventoryService.name);

    constructor(
        @InjectRepository(InventoryItem)
        private inventoryRepository: Repository<InventoryItem>,
        private usersService: UsersService,
    ) { }

    /**
     * Add item to user's inventory (server-side only)
     * Uses transaction to prevent race conditions
     */
    async addItem(userId: string, addItemDto: AddItemDto): Promise<InventoryItem> {
        // Validate user exists
        const user = await this.usersService.findOneById(userId);
        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }

        // Use transaction to prevent race condition
        return await this.inventoryRepository.manager.transaction(async (manager) => {
            // Check if item already exists (with pessimistic lock)
            const existingItem = await manager
                .createQueryBuilder(InventoryItem, 'item')
                .setLock('pessimistic_write') // Prevent concurrent updates
                .where('item.userId = :userId', { userId })
                .andWhere('item.itemId = :itemId', { itemId: addItemDto.itemId })
                .getOne();

            if (existingItem) {
                // Update quantity
                const oldQuantity = existingItem.quantity;
                existingItem.quantity += addItemDto.quantity;

                // Enforce max limit
                if (existingItem.quantity > 9999) {
                    throw new BadRequestException('Item quantity cannot exceed 9999');
                }

                // Log audit trail
                this.logInventoryChange(
                    userId,
                    'ADD',
                    addItemDto.itemId,
                    addItemDto.quantity,
                    oldQuantity,
                    existingItem.quantity
                );

                return manager.save(existingItem);
            }

            // Create new item
            const newItem = manager.create(InventoryItem, {
                ...addItemDto,
                user: { id: userId },
            });

            const savedItem = await manager.save(newItem);

            // Log audit trail
            this.logInventoryChange(
                userId,
                'ADD',
                addItemDto.itemId,
                addItemDto.quantity,
                0,
                savedItem.quantity
            );

            return savedItem;
        });
    }

    /**
     * Remove item from inventory
     */
    async removeItem(userId: string, itemId: string, quantity: number): Promise<void> {
        if (quantity <= 0) {
            throw new BadRequestException('Quantity must be positive');
        }

        if (quantity > 9999) {
            throw new BadRequestException('Quantity cannot exceed 9999');
        }

        return await this.inventoryRepository.manager.transaction(async (manager) => {
            const item = await manager
                .createQueryBuilder(InventoryItem, 'item')
                .setLock('pessimistic_write')
                .where('item.userId = :userId', { userId })
                .andWhere('item.itemId = :itemId', { itemId })
                .getOne();

            if (!item) {
                throw new NotFoundException('Item not found in inventory');
            }

            if (item.quantity < quantity) {
                throw new BadRequestException(
                    `Not enough ${item.itemName}. Have ${item.quantity}, need ${quantity}`
                );
            }

            const oldQuantity = item.quantity;
            item.quantity -= quantity;

            if (item.quantity === 0) {
                await manager.remove(item);

                this.logInventoryChange(
                    userId,
                    'REMOVE_ALL',
                    itemId,
                    -quantity,
                    oldQuantity,
                    0
                );
            } else {
                await manager.save(item);

                this.logInventoryChange(
                    userId,
                    'REMOVE',
                    itemId,
                    -quantity,
                    oldQuantity,
                    item.quantity
                );
            }
        });
    }

    /**
     * Get user's inventory
     */
    async getInventory(userId: string): Promise<InventoryItem[]> {
        return this.inventoryRepository.find({
            where: { user: { id: userId } },
            order: { itemType: 'ASC', itemName: 'ASC' },
        });
    }

    /**
     * Get specific item from inventory
     */
    async getItem(userId: string, itemId: string): Promise<InventoryItem> {
        const item = await this.inventoryRepository.findOne({
            where: { user: { id: userId }, itemId },
        });

        if (!item) {
            throw new NotFoundException('Item not found in inventory');
        }

        return item;
    }

    /**
     * Equip/unequip item
     */
    async toggleEquipped(userId: string, itemId: string): Promise<InventoryItem> {
        return await this.inventoryRepository.manager.transaction(async (manager) => {
            const item = await manager
                .createQueryBuilder(InventoryItem, 'item')
                .setLock('pessimistic_write')
                .where('item.userId = :userId', { userId })
                .andWhere('item.itemId = :itemId', { itemId })
                .getOne();

            if (!item) {
                throw new NotFoundException('Item not found');
            }

            const wasEquipped = item.equipped;
            item.equipped = !item.equipped;

            // Log audit trail
            this.logInventoryChange(
                userId,
                item.equipped ? 'EQUIP' : 'UNEQUIP',
                itemId,
                0,
                item.quantity,
                item.quantity
            );

            return manager.save(item);
        });
    }

    /**
     * Update item quantity or properties
     */
    async updateItem(userId: string, itemId: string, updateDto: UpdateItemDto): Promise<InventoryItem> {
        return await this.inventoryRepository.manager.transaction(async (manager) => {
            const item = await manager
                .createQueryBuilder(InventoryItem, 'item')
                .setLock('pessimistic_write')
                .where('item.userId = :userId', { userId })
                .andWhere('item.itemId = :itemId', { itemId })
                .getOne();

            if (!item) {
                throw new NotFoundException('Item not found');
            }

            const oldQuantity = item.quantity;

            // Update fields
            if (updateDto.quantity !== undefined) {
                item.quantity = updateDto.quantity;
            }
            if (updateDto.equipped !== undefined) {
                item.equipped = updateDto.equipped;
            }
            if (updateDto.slot !== undefined) {
                item.slot = updateDto.slot;
            }

            // Log if quantity changed
            if (updateDto.quantity !== undefined && updateDto.quantity !== oldQuantity) {
                this.logInventoryChange(
                    userId,
                    'UPDATE',
                    itemId,
                    updateDto.quantity - oldQuantity,
                    oldQuantity,
                    item.quantity
                );
            }

            return manager.save(item);
        });
    }

    /**
     * Audit log for inventory changes
     * TODO: Save to database table in future for persistent auditing
     */
    private logInventoryChange(
        userId: string,
        action: string,
        itemId: string,
        quantityChange: number,
        oldQuantity: number,
        newQuantity: number,
    ): void {
        const logEntry = {
            timestamp: new Date().toISOString(),
            userId,
            action,
            itemId,
            quantityChange,
            oldQuantity,
            newQuantity,
        };

        this.logger.log(`[INVENTORY AUDIT] ${JSON.stringify(logEntry)}`);
    }
}
