import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { QuestService } from './src/quest/quest.service';
import { Quest } from './src/quest/quest.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const questRepo = app.get(getRepositoryToken(Quest));

    const quests = [
        {
            title: 'Welcome to Dust',
            description: 'Speak to the Sheriff to get your badge.',
            objectives: [
                { id: 'obj1', type: 'talk', description: 'Talk to Sheriff', target: 1, current: 0 }
            ],
            rewards: { xp: 100, gold: 50, items: [] }
        },
        {
            title: 'Rat Problem',
            description: 'Clear the cellar of giant rats.',
            objectives: [
                { id: 'obj2', type: 'kill', description: 'Kill Rats', target: 5, current: 0 }
            ],
            rewards: { xp: 200, gold: 100, items: [] }
        }
    ];

    for (const q of quests) {
        const exists = await questRepo.findOne({ where: { title: q.title } });
        if (!exists) {
            await questRepo.save(q);
            console.log(`Seeded quest: ${q.title}`);
        } else {
            console.log(`Quest already exists: ${q.title}`);
        }
    }

    await app.close();
}
bootstrap();
