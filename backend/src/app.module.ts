import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './users/user.entity';
import { Character } from './character/character.entity';
import { InventoryItem } from './inventory/inventory-item.entity';
import { Quest } from './quest/quest.entity';
import { UserQuest } from './quest/user-quest.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CharacterModule } from './character/character.module';
import { InventoryModule } from './inventory/inventory.module';
import { QuestModule } from './quest/quest.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'dust.sqlite',
      entities: [User, Character, InventoryItem, Quest, UserQuest],
      synchronize: true, // Auto-create tables (dev only)
    }),
    UsersModule,
    AuthModule,
    CharacterModule,
    InventoryModule,
    QuestModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
