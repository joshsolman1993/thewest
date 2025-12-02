import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { createMockRepository, MockRepository, generateTestUser } from '../../test/test-utils';

describe('UsersService', () => {
    let service: UsersService;
    let mockRepository: MockRepository<User>;

    beforeEach(async () => {
        mockRepository = createMockRepository<User>();

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: getRepositoryToken(User),
                    useValue: mockRepository,
                },
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findOne', () => {
        it('should return a user when found by username', async () => {
            // Arrange
            const testUser = generateTestUser({ username: 'john' });
            mockRepository.findOne.mockResolvedValue(testUser);

            // Act
            const result = await service.findOne('john');

            // Assert
            expect(result).toEqual(testUser);
            expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { username: 'john' } });
            expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
        });

        it('should return null when user is not found', async () => {
            // Arrange
            mockRepository.findOne.mockResolvedValue(null);

            // Act
            const result = await service.findOne('nonexistent');

            // Assert
            expect(result).toBeNull();
            expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { username: 'nonexistent' } });
        });

        it('should handle database errors gracefully', async () => {
            // Arrange
            const dbError = new Error('Database connection failed');
            mockRepository.findOne.mockRejectedValue(dbError);

            // Act & Assert
            await expect(service.findOne('testuser')).rejects.toThrow('Database connection failed');
        });
    });

    describe('create', () => {
        it('should create and return a new user', async () => {
            // Arrange
            const userData = {
                username: 'newuser',
                email: 'new@example.com',
                password: 'hashedPassword',
            };
            const createdUser = generateTestUser(userData);

            mockRepository.create.mockReturnValue(createdUser as any);
            mockRepository.save.mockResolvedValue(createdUser);

            // Act
            const result = await service.create(userData);

            // Assert
            expect(result).toEqual(createdUser);
            expect(mockRepository.create).toHaveBeenCalledWith(userData);
            expect(mockRepository.save).toHaveBeenCalledWith(createdUser);
            expect(mockRepository.save).toHaveBeenCalledTimes(1);
        });

        it('should create user with partial data', async () => {
            // Arrange
            const partialUserData = {
                username: 'partial',
                password: 'hashed',
            };
            const createdUser = generateTestUser(partialUserData);

            mockRepository.create.mockReturnValue(createdUser as any);
            mockRepository.save.mockResolvedValue(createdUser);

            // Act
            const result = await service.create(partialUserData);

            // Assert
            expect(result).toBeDefined();
            expect(mockRepository.create).toHaveBeenCalledWith(partialUserData);
        });

        it('should handle save errors', async () => {
            // Arrange
            const userData = { username: 'test', email: 'test@test.com', password: 'hash' };
            const saveError = new Error('Unique constraint violation');

            mockRepository.create.mockReturnValue(userData as any);
            mockRepository.save.mockRejectedValue(saveError);

            // Act & Assert
            await expect(service.create(userData)).rejects.toThrow('Unique constraint violation');
        });
    });
});
