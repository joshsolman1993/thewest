import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Quest {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column('simple-json')
    objectives: {
        id: string;
        type: string;
        description: string;
        target: number;
        current: number;
    }[];

    @Column('simple-json')
    rewards: {
        xp: number;
        gold: number;
        items: { itemId: string; quantity: number }[];
    };
}
