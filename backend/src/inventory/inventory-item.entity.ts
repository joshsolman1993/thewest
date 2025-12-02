import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Character } from '../character/character.entity';

@Entity()
export class InventoryItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    itemId: string;

    @Column({ default: 1 })
    quantity: number;

    @Column({ default: false })
    isEquipped: boolean;

    @Column({ nullable: true })
    slot: string; // 'MainHand', 'OffHand', 'Head', 'Body', 'Legs', 'Boots'

    @ManyToOne(() => Character, (character) => character.inventory)
    character: Character;
}
