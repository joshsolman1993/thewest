import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Character } from './character.entity';
import { User } from '../users/user.entity';

@Injectable()
export class CharacterService {
    constructor(
        @InjectRepository(Character)
        private characterRepository: Repository<Character>,
    ) { }

    async create(user: User, name: string): Promise<Character> {
        const character = this.characterRepository.create({
            user,
            name,
            // Default stats are handled by entity defaults
        });
        return this.characterRepository.save(character);
    }

    async findOneByUserId(userId: string): Promise<Character | null> {
        return this.characterRepository.findOne({
            where: { user: { id: userId } },
            relations: ['inventory'],
        });
    }

    async findOneById(id: string): Promise<Character | null> {
        return this.characterRepository.findOne({ where: { id } });
    }

    async update(id: string, updateData: Partial<Character>): Promise<Character | null> {
        await this.characterRepository.update(id, updateData);
        return this.characterRepository.findOne({ where: { id } });
    }
}
