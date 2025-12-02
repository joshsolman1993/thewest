import { Controller, Post, Get, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CharacterService } from './character.service';
import { User } from '../users/user.entity';

@Controller('character')
@UseGuards(AuthGuard('jwt'))
export class CharacterController {
    constructor(private characterService: CharacterService) { }

    @Post()
    async create(@Request() req, @Body() body: { name: string }) {
        // req.user contains { userId: ... } from JwtStrategy
        // We need to pass an object that looks like a User entity (at least with id)
        return this.characterService.create({ id: req.user.userId } as User, body.name);
    }

    @Get()
    async findOne(@Request() req) {
        return this.characterService.findOneByUserId(req.user.userId);
    }

    @Patch()
    async update(@Request() req, @Body() body) {
        // First get the character to ensure ownership
        const character = await this.characterService.findOneByUserId(req.user.userId);
        if (character) {
            return this.characterService.update(character.id, body);
        }
    }
}
