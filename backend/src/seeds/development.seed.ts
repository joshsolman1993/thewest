import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';
import { Character } from '../character/character.entity';
import { Quest } from '../quest/quest.entity';
import { InventoryItem } from '../inventory/inventory-item.entity';

export async function developmentSeed(dataSource: DataSource) {
    const userRepository = dataSource.getRepository(User);
    const characterRepository = dataSource.getRepository(Character);
    const questRepository = dataSource.getRepository(Quest);
    const inventoryRepository = dataSource.getRepository(InventoryItem);

    console.log('🌱 Seeding development data...');

    // Check if data already exists
    const existingUsers = await userRepository.count();
    if (existingUsers > 0) {
        console.log('⚠️  Database already has data. Skipping seed.');
        return;
    }

    // Create test users
    console.log('Creating test users...');
    const hashedPassword = await bcrypt.hash('Test123!', 10);

    const testUsers = [
        {
            username: 'testuser1',
            email: 'test1@example.com',
            password: hashedPassword,
        },
        {
            username: 'testuser2',
            email: 'test2@example.com',
            password: hashedPassword,
        },
        {
            username: 'admin',
            email: 'admin@example.com',
            password: hashedPassword,
        },
    ];

    const users = await userRepository.save(testUsers);
    console.log(`✅ Created ${users.length} test users`);
    console.log('   Credentials: username/Test123!');

    // Create characters for users
    console.log('Creating characters...');
    const characters = await characterRepository.save([
        {
            user: users[0],
            name: 'Warrior One',
            level: 5,
            health: 100,
            maxHealth: 100,
            energy: 50,
            maxEnergy: 50,
            strength: 15,
            defense: 10,
            agility: 8,
        },
        {
            user: users[1],
            name: 'Mage Two',
            level: 3,
            health: 80,
            maxHealth: 80,
            energy: 100,
            maxEnergy: 100,
            strength: 5,
            defense: 5,
            agility: 12,
        },
        {
            user: users[2],
            name: 'Admin Hero',
            level: 10,
            health: 200,
            maxHealth: 200,
            energy: 100,
            maxEnergy: 100,
            strength: 25,
            defense: 20,
            agility: 15,
        },
    ]);
    console.log(`✅ Created ${characters.length} characters`);

    // Create sample quests
    console.log('Creating quests...');
    const quests = await questRepository.save([
        {
            title: 'First Steps',
            description: 'Complete your first training mission',
            objectives: [
                {
                    id: 'obj1',
                    type: 'kill',
                    description: 'Defeat 5 training dummies',
                    target: 5,
                    current: 0,
                },
            ],
            rewards: {
                xp: 50,
                gold: 100,
                items: [],
            },
        },
        {
            title: 'Gather Resources',
            description: 'Collect 10 iron ore from the mines',
            objectives: [
                {
                    id: 'obj1',
                    type: 'collect',
                    description: 'Collect iron ore',
                    target: 10,
                    current: 0,
                },
            ],
            rewards: {
                xp: 100,
                gold: 250,
                items: [{ itemId: 'iron_ore', quantity: 10 }],
            },
        },
        {
            title: 'Defeat the Boss',
            description: 'Defeat the dungeon boss',
            objectives: [
                {
                    id: 'obj1',
                    type: 'kill',
                    description: 'Defeat Dungeon Boss',
                    target: 1,
                    current: 0,
                },
            ],
            rewards: {
                xp: 500,
                gold: 1000,
                items: [{ itemId: 'legendary_sword', quantity: 1 }],
            },
        },
    ]);
    console.log(`✅ Created ${quests.length} quests`);

    // Create sample inventory items
    console.log('Creating inventory items...');
    const items = await inventoryRepository.save([
        {
            user: users[0],
            itemId: 'sword_basic',
            itemName: 'Basic Sword',
            itemType: 'weapon',
            quantity: 1,
            equipped: true,
        },
        {
            user: users[0],
            itemId: 'potion_health',
            itemName: 'Health Potion',
            itemType: 'consumable',
            quantity: 5,
            equipped: false,
        },
        {
            user: users[1],
            itemId: 'staff_fire',
            itemName: 'Fire Staff',
            itemType: 'weapon',
            quantity: 1,
            equipped: true,
        },
        {
            user: users[2],
            itemId: 'armor_legendary',
            itemName: 'Legendary Armor',
            itemType: 'armor',
            quantity: 1,
            equipped: true,
        },
    ]);
    console.log(`✅ Created ${items.length} inventory items`);

    console.log('');
    console.log('🎉 Development seed completed successfully!');
    console.log('');
    console.log('📝 Test Accounts:');
    console.log('   - testuser1 / Test123!');
    console.log('   - testuser2 / Test123!');
    console.log('   - admin / Test123!');
    console.log('');
}
