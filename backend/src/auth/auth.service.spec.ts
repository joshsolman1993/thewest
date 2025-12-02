import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { MockType, generateTestUser, generateValidRegisterDto } from '../../test/test-utils';

// Mock bcrypt
jest.mock('bcrypt');

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: MockType<UsersService>;
  let jwtService: MockType<JwtService>;

  const mockUsersService = (): MockType<UsersService> => ({
    findOne: jest.fn(),
    create: jest.fn(),
  });

  const mockJwtService = (): MockType<JwtService> => ({
    sign: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useFactory: mockUsersService,
        },
        {
          provide: JwtService,
          useFactory: mockJwtService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user without password when credentials are valid', async () => {
      // Arrange
      const username = 'testuser';
      const password = 'Test123!';
      const hashedPassword = 'hashedPassword';
      const mockUser = generateTestUser({ username, password: hashedPassword });

      usersService.findOne.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      // Act
      const result = await authService.validateUser(username, password);

      // Assert
      expect(result).toBeDefined();
      expect(result.username).toBe(username);
      expect(result.password).toBeUndefined();
      expect(usersService.findOne).toHaveBeenCalledWith(username);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
    });

    it('should return null when user is not found', async () => {
      // Arrange
      usersService.findOne.mockResolvedValue(null);

      // Act
      const result = await authService.validateUser('nonexistent', 'password');

      // Assert
      expect(result).toBeNull();
      expect(usersService.findOne).toHaveBeenCalledWith('nonexistent');
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it('should return null when password does not match', async () => {
      // Arrange
      const mockUser = generateTestUser({ username: 'john', password: 'hashedPass' });
      usersService.findOne.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      // Act
      const result = await authService.validateUser('john', 'wrongpassword');

      // Assert
      expect(result).toBeNull();
      expect(bcrypt.compare).toHaveBeenCalledWith('wrongpassword', 'hashedPass');
    });

    it('should handle bcrypt comparison errors', async () => {
      // Arrange
      const mockUser = generateTestUser();
      usersService.findOne.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockRejectedValue(new Error('Bcrypt error'));

      // Act & Assert
      await expect(authService.validateUser('testuser', 'password')).rejects.toThrow('Bcrypt error');
    });
  });

  describe('login', () => {
    it('should return access token with valid user', async () => {
      // Arrange
      const user = { id: 'user-123', username: 'john' };
      const mockToken = 'jwt.token.here';

      jwtService.sign.mockReturnValue(mockToken);

      // Act
      const result = await authService.login(user);

      // Assert
      expect(result).toEqual({ access_token: mockToken });
      expect(jwtService.sign).toHaveBeenCalledWith({
        username: 'john',
        sub: 'user-123',
      });
    });

    it('should generate different tokens for different users', async () => {
      // Arrange
      const user1 = { id: 'user-1', username: 'alice' };
      const user2 = { id: 'user-2', username: 'bob' };

      jwtService.sign.mockReturnValueOnce('token1').mockReturnValueOnce('token2');

      // Act
      const result1 = await authService.login(user1);
      const result2 = await authService.login(user2);

      // Assert
      expect(result1.access_token).toBe('token1');
      expect(result2.access_token).toBe('token2');
      expect(jwtService.sign).toHaveBeenCalledTimes(2);
    });
  });

  describe('register', () => {
    it('should create a new user with hashed password', async () => {
      // Arrange
      const registerDto: RegisterDto = generateValidRegisterDto();
      const hashedPassword = 'hashedPassword123';
      const createdUser = generateTestUser({
        username: registerDto.username,
        email: registerDto.email,
        password: hashedPassword,
      });

      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      usersService.create.mockResolvedValue(createdUser);

      // Act
      const result = await authService.register(registerDto);

      // Assert
      expect(result).toEqual(createdUser);
      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 10);
      expect(usersService.create).toHaveBeenCalledWith({
        username: registerDto.username,
        email: registerDto.email,
        password: hashedPassword,
      });
    });

    it('should use bcrypt with salt rounds of 10', async () => {
      // Arrange
      const registerDto: RegisterDto = generateValidRegisterDto();
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
      usersService.create.mockResolvedValue(generateTestUser());

      // Act
      await authService.register(registerDto);

      // Assert
      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 10);
    });

    it('should propagate user creation errors', async () => {
      // Arrange
      const registerDto: RegisterDto = generateValidRegisterDto();
      const createError = new Error('Username already exists');

      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
      usersService.create.mockRejectedValue(createError);

      // Act & Assert
      await expect(authService.register(registerDto)).rejects.toThrow('Username already exists');
    });

    it('should handle bcrypt hashing errors', async () => {
      // Arrange
      const registerDto: RegisterDto = generateValidRegisterDto();
      (bcrypt.hash as jest.Mock).mockRejectedValue(new Error('Hashing failed'));

      // Act & Assert
      await expect(authService.register(registerDto)).rejects.toThrow('Hashing failed');
      expect(usersService.create).not.toHaveBeenCalled();
    });
  });
});
