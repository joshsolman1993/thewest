import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InventoryService } from './inventory.service';
import { CharacterService } from '../character/character.service';

@Controller('inventory')
@UseGuards(AuthGuard('jwt'))
export class InventoryController {
    constructor(
        private inventoryService: InventoryService,
        private characterService: CharacterService
    ) { }

    @Get()
    async getInventory(@Request() req) {
        const character = await this.characterService.findOneByUserId(req.user.userId);
        if (!character) return [];
        return this.inventoryService.getInventory(character.id);
    }

    @Post('add')
    async addItem(@Request() req, @Body() body: { itemId: string; quantity: number }) {
        const character = await this.characterService.findOneByUserId(req.user.userId);
        if (!character) return null;
        return this.inventoryService.addItem(character.id, body.itemId, body.quantity);
    }
}
