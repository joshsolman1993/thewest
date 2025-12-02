import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { InventoryItem } from './inventory-item.entity';
import { CharacterModule } from '../character/character.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([InventoryItem]),
    CharacterModule
  ],
  controllers: [InventoryController],
  providers: [InventoryService],
  exports: [InventoryService],
})
export class InventoryModule { }
