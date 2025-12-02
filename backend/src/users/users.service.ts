import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async findOne(username: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { username } });
    }

    async create(userData: Partial<User>): Promise<User> {
        // Check if username already exists
        if (userData.username) {
            const existingUsername = await this.usersRepository.findOne({
                where: { username: userData.username }
            });
            if (existingUsername) {
                throw new ConflictException('Username already exists');
            }
        }

        // Check if email already exists
        if (userData.email) {
            const existingEmail = await this.usersRepository.findOne({
                where: { email: userData.email }
            });
            if (existingEmail) {
                throw new ConflictException('Email already exists');
            }
        }

        const user = this.usersRepository.create(userData);
        return this.usersRepository.save(user);
    }

    async findOneById(id: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { id } });
    }
}
