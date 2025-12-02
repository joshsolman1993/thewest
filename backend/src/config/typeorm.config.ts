import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { User } from '../users/user.entity';
import { Character } from '../character/character.entity';
import { InventoryItem } from '../inventory/inventory-item.entity';
import { Quest } from '../quest/quest.entity';
import { UserQuest } from '../quest/user-quest.entity';

// Load environment variables
config();

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432', 10),
    username: process.env.DATABASE_USERNAME || 'postgres',
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME || 'dust_dev',
    entities: [User, Character, InventoryItem, Quest, UserQuest],
    migrations: ['src/migrations/*.ts'],
    synchronize: false, // CRITICAL: Never use true in production
    logging: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
});
