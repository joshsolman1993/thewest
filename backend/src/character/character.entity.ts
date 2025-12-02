import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../users/user.entity';
import { InventoryItem } from '../inventory/inventory-item.entity';

@Entity()
export class Character {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ default: 1 })
    level: number;

    @Column({ default: 0 })
    xp: number;

    @Column({ default: 100 })
    gold: number;

    @Column({ default: 100 })
    currentHealth: number;

    @Column({ default: 100 })
    maxHealth: number;

    // Attributes
    @Column({ default: 5 })
    strength: number;

    @Column({ default: 5 })
    agility: number;

    @Column({ default: 5 })
    endurance: number;

    @Column({ default: 5 })
    perception: number;

    @Column({ default: 5 })
    intelligence: number;

    @OneToOne(() => User, (user) => user.character)
    @JoinColumn()
    user: User;

    @OneToMany(() => InventoryItem, (item) => item.character)
    inventory: InventoryItem[];
}
