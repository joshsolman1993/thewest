import { Controller, Get, Post, Delete, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InventoryService } from './inventory.service';
import { AddItemDto } from './dto/add-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Controller('inventory')
@UseGuards(AuthGuard('jwt'))
export class InventoryController {
    constructor(
        private inventoryService: InventoryService,
    ) { }

    @Get()
    async getInventory(@Request() req) {
        return this.inventoryService.getInventory(req.user.userId);
    }

    @Get(':itemId')
    async getItem(@Request() req, @Param('itemId') itemId: string) {
        return this.inventoryService.getItem(req.user.userId, itemId);
    }

    @Post('add')
    async addItem(@Request() req, @Body() addItemDto: AddItemDto) {
        return this.inventoryService.addItem(req.user.userId, addItemDto);
    }

    @Delete(':itemId')
    async removeItem(
        @Request() req,
        @Param('itemId') itemId: string,
        @Body('quantity') quantity: number
    ) {
        return this.inventoryService.removeItem(req.user.userId, itemId, quantity);
    }

    @Patch(':itemId')
    async updateItem(
        @Request() req,
        @Param('itemId') itemId: string,
        @Body() updateDto: UpdateItemDto
    ) {
        return this.inventoryService.updateItem(req.user.userId, itemId, updateDto);
    }

    @Patch(':itemId/equip')
    async toggleEquipped(@Request() req, @Param('itemId') itemId: string) {
        return this.inventoryService.toggleEquipped(req.user.userId, itemId);
    }
}
