import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';
import { Quest } from './quest.entity';

@Entity()
export class UserQuest {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ default: 'ACTIVE' })
    status: 'ACTIVE' | 'COMPLETED';

    @Column('simple-json', { nullable: true })
    progress: { [objectiveId: string]: number };

    @ManyToOne(() => User)
    user: User;

    @ManyToOne(() => Quest)
    quest: Quest;
}
