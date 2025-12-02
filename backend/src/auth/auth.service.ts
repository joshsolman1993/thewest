import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) { }

    async validateUser(username: string, pass: string): Promise<any> {
        console.log(`Validating user: ${username}`);
        const user = await this.usersService.findOne(username);
        if (user) {
            console.log(`User found: ${user.username}`);
            const isMatch = await bcrypt.compare(pass, user.password);
            console.log(`Password match: ${isMatch}`);
            if (isMatch) {
                const { password, ...result } = user;
                return result;
            }
        } else {
            console.log('User not found');
        }
        return null;
    }

    async login(user: any) {
        const payload = { username: user.username, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async register(registerDto: RegisterDto) {
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        return this.usersService.create({
            ...registerDto,
            password: hashedPassword,
        });
    }
}

