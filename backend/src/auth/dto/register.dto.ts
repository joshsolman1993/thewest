import { IsString, IsEmail, IsNotEmpty, MinLength, MaxLength, Matches } from 'class-validator';

export class RegisterDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(50)
    @Matches(/^[a-zA-Z0-9_-]+$/, {
        message: 'Username can only contain letters, numbers, underscores and hyphens',
    })
    username: string;

    @IsEmail({}, { message: 'Please provide a valid email address' })
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(100)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    })
    password: string;
}
