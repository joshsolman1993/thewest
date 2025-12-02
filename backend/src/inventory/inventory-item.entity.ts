import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Character } from '../character/character.entity';
import { User } from '../users/user.entity';

@Entity()
export class InventoryItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    itemId: string; // Unique item identifier (e.g., 'sword_iron', 'potion_health')

    @Column()
    itemName: string; // Display name (e.g., 'Iron Sword', 'Health Potion')

    @Column()
    itemType: string; // Type: weapon, armor, consumable, material, etc.

    @Column({ default: 1 })
    quantity: number;

    @Column({ default: false })
    equipped: boolean; // Whether item is currently equipped

    @Column({ nullable: true })
    slot: string; // Equipment slot: weapon, armor, helmet, boots, etc.

    @ManyToOne(() => User, { eager: false })
    user: User; // User who owns this item

    @ManyToOne(() => Character, (character) => character.inventory, { nullable: true })
    character: Character; // Optional: Character relationship (for backward compatibility)

    @CreateDateColumn()
    createdAt: Date; // When item was added to inventory

    @UpdateDateColumn()
    lastModified: Date; // Last time item was modified
}
