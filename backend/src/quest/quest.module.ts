import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestService } from './quest.service';
import { QuestController } from './quest.controller';
import { Quest } from './quest.entity';
import { UserQuest } from './user-quest.entity';
import { CharacterModule } from '../character/character.module';
import { InventoryModule } from '../inventory/inventory.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Quest, UserQuest]),
    CharacterModule,
    InventoryModule
  ],
  controllers: [QuestController],
  providers: [QuestService],
})
export class QuestModule { }
