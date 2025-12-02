import { AppDataSource } from '../config/typeorm.config';
import { developmentSeed } from './development.seed';

async function runSeed() {
    try {
        console.log('🚀 Starting database seeding...');
        console.log('');

        // Initialize database connection
        await AppDataSource.initialize();
        console.log('✅ Database connection established');
        console.log('');

        // Run development seeds
        await developmentSeed(AppDataSource);

        // Close connection
        await AppDataSource.destroy();
        console.log('✅ Database connection closed');
        console.log('');
        console.log('🏁 Seeding process completed!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error during seeding:', error);
        process.exit(1);
    }
}

runSeed();
