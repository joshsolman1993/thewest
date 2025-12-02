import { Test, TestingModule } from '@nestjs/testing';
import { InventoryService } from './inventory.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { InventoryItem } from './inventory-item.entity';
import { UsersService } from '../users/users.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { createMockRepository, MockType, generateTestUser } from '../../test/test-utils';

describe('InventoryService', () => {
  let service: InventoryService;
  let inventoryRepository: MockType<Repository<InventoryItem>>;
  let usersService: MockType<UsersService>;

  const mockUser = generateTestUser();
  const mockItem = {
    id: 'item-uuid-1',
    itemId: 'sword_iron',
    itemName: 'Iron Sword',
    itemType: 'weapon',
    quantity: 1,
    equipped: false,
    slot: 'weapon',
    user: mockUser,
    createdAt: new Date(),
    lastModified: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventoryService,
        {
          provide: getRepositoryToken(InventoryItem),
          useValue: createMockRepository(),
        },
        {
          provide: UsersService,
          useValue: {
            findOneById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<InventoryService>(InventoryService);
    inventoryRepository = module.get(getRepositoryToken(InventoryItem));
    usersService = module.get(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addItem', () => {
    const addItemDto = {
      itemId: 'sword_iron',
      itemName: 'Iron Sword',
      itemType: 'weapon',
      quantity: 5,
    };

    it('should add a new item to inventory', async () => {
      // Arrange
      usersService.findOneById.mockResolvedValue(mockUser);

      const mockTransaction = {
        createQueryBuilder: jest.fn().mockReturnValue({
          setLock: jest.fn().mockReturnThis(),
          where: jest.fn().mockReturnThis(),
          andWhere: jest.fn().mockReturnThis(),
          getOne: jest.fn().mockResolvedValue(null), // No existing item
        }),
        create: jest.fn().mockReturnValue({ ...mockItem, quantity: addItemDto.quantity }),
        save: jest.fn().mockResolvedValue({ ...mockItem, quantity: addItemDto.quantity }),
      };

      inventoryRepository.manager.transaction.mockImplementation(async (cb) => cb(mockTransaction));

      // Act
      const result = await service.addItem(mockUser.id, addItemDto);

      // Assert
      expect(usersService.findOneById).toHaveBeenCalledWith(mockUser.id);
      expect(result.quantity).toBe(addItemDto.quantity);
      expect(mockTransaction.create).toHaveBeenCalled();
      expect(mockTransaction.save).toHaveBeenCalled();
    });

    it('should update quantity if item already exists', async () => {
      // Arrange
      usersService.findOneById.mockResolvedValue(mockUser);

      const existingItem = { ...mockItem, quantity: 3 };
      const mockTransaction = {
        createQueryBuilder: jest.fn().mockReturnValue({
          setLock: jest.fn().mockReturnThis(),
          where: jest.fn().mockReturnThis(),
          andWhere: jest.fn().mockReturnThis(),
          getOne: jest.fn().mockResolvedValue(existingItem),
        }),
        save: jest.fn().mockResolvedValue({ ...existingItem, quantity: 8 }),
      };

      inventoryRepository.manager.transaction.mockImplementation(async (cb) => cb(mockTransaction));

      // Act
      const result = await service.addItem(mockUser.id, addItemDto);

      // Assert
      expect(result.quantity).toBe(8); // 3 + 5
      expect(mockTransaction.save).toHaveBeenCalledWith(expect.objectContaining({ quantity: 8 }));
    });

    it('should throw NotFoundException if user does not exist', async () => {
      // Arrange
      usersService.findOneById.mockResolvedValue(null);

      // Act & Assert
      await expect(service.addItem('invalid-user-id', addItemDto))
        .rejects
        .toThrow(NotFoundException);
    });

    it('should throw BadRequestException if quantity exceeds max limit', async () => {
      // Arrange
      usersService.findOneById.mockResolvedValue(mockUser);

      const existingItem = { ...mockItem, quantity: 9995 };
      const mockTransaction = {
        createQueryBuilder: jest.fn().mockReturnValue({
          setLock: jest.fn().mockReturnThis(),
          where: jest.fn().mockReturnThis(),
          andWhere: jest.fn().mockReturnThis(),
          getOne: jest.fn().mockResolvedValue(existingItem),
        }),
      };

      inventoryRepository.manager.transaction.mockImplementation(async (cb) => cb(mockTransaction));

      // Act & Assert
      await expect(service.addItem(mockUser.id, { ...addItemDto, quantity: 10 }))
        .rejects
        .toThrow(BadRequestException);
    });

    it('should use pessimistic lock to prevent race conditions', async () => {
      // Arrange
      usersService.findOneById.mockResolvedValue(mockUser);

      const mockQueryBuilder = {
        setLock: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      };

      const mockTransaction = {
        createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
        create: jest.fn().mockReturnValue(mockItem),
        save: jest.fn().mockResolvedValue(mockItem),
      };

      inventoryRepository.manager.transaction.mockImplementation(async (cb) => cb(mockTransaction));

      // Act
      await service.addItem(mockUser.id, addItemDto);

      // Assert
      expect(mockQueryBuilder.setLock).toHaveBeenCalledWith('pessimistic_write');
    });
  });

  describe('removeItem', () => {
    it('should remove partial quantity from inventory', async () => {
      // Arrange
      const existingItem = { ...mockItem, quantity: 10 };
      const mockTransaction = {
        createQueryBuilder: jest.fn().mockReturnValue({
          setLock: jest.fn().mockReturnThis(),
          where: jest.fn().mockReturnThis(),
          andWhere: jest.fn().mockReturnThis(),
          getOne: jest.fn().mockResolvedValue(existingItem),
        }),
        save: jest.fn().mockResolvedValue({ ...existingItem, quantity: 5 }),
      };

      inventoryRepository.manager.transaction.mockImplementation(async (cb) => cb(mockTransaction));

      // Act
      await service.removeItem(mockUser.id, 'sword_iron', 5);

      // Assert
      expect(mockTransaction.save).toHaveBeenCalledWith(expect.objectContaining({ quantity: 5 }));
    });

    it('should remove item completely if quantity becomes 0', async () => {
      // Arrange
      const existingItem = { ...mockItem, quantity: 5 };
      const mockTransaction = {
        createQueryBuilder: jest.fn().mockReturnValue({
          setLock: jest.fn().mockReturnThis(),
          where: jest.fn().mockReturnThis(),
          andWhere: jest.fn().mockReturnThis(),
          getOne: jest.fn().mockResolvedValue(existingItem),
        }),
        remove: jest.fn().mockResolvedValue(existingItem),
      };

      inventoryRepository.manager.transaction.mockImplementation(async (cb) => cb(mockTransaction));

      // Act
      await service.removeItem(mockUser.id, 'sword_iron', 5);

      // Assert
      expect(mockTransaction.remove).toHaveBeenCalledWith(existingItem);
    });

    it('should throw NotFoundException if item does not exist', async () => {
      // Arrange
      const mockTransaction = {
        createQueryBuilder: jest.fn().mockReturnValue({
          setLock: jest.fn().mockReturnThis(),
          where: jest.fn().mockReturnThis(),
          andWhere: jest.fn().mockReturnThis(),
          getOne: jest.fn().mockResolvedValue(null),
        }),
      };

      inventoryRepository.manager.transaction.mockImplementation(async (cb) => cb(mockTransaction));

      // Act & Assert
      await expect(service.removeItem(mockUser.id, 'nonexistent', 1))
        .rejects
        .toThrow(NotFoundException);
    });

    it('should throw BadRequestException if not enough quantity', async () => {
      // Arrange
      const existingItem = { ...mockItem, quantity: 3 };
      const mockTransaction = {
        createQueryBuilder: jest.fn().mockReturnValue({
          setLock: jest.fn().mockReturnThis(),
          where: jest.fn().mockReturnThis(),
          andWhere: jest.fn().mockReturnThis(),
          getOne: jest.fn().mockResolvedValue(existingItem),
        }),
      };

      inventoryRepository.manager.transaction.mockImplementation(async (cb) => cb(mockTransaction));

      // Act & Assert
      await expect(service.removeItem(mockUser.id, 'sword_iron', 5))
        .rejects
        .toThrow(BadRequestException);
    });

    it('should throw BadRequestException for negative quantity', async () => {
      // Act & Assert
      await expect(service.removeItem(mockUser.id, 'sword_iron', -1))
        .rejects
        .toThrow(BadRequestException);
    });
  });

  describe('getInventory', () => {
    it('should return user inventory sorted by type and name', async () => {
      // Arrange
      const mockInventory = [mockItem, { ...mockItem, id: 'item-2', itemName: 'Shield' }];
      inventoryRepository.find.mockResolvedValue(mockInventory);

      // Act
      const result = await service.getInventory(mockUser.id);

      // Assert
      expect(result).toEqual(mockInventory);
      expect(inventoryRepository.find).toHaveBeenCalledWith({
        where: { user: { id: mockUser.id } },
        order: { itemType: 'ASC', itemName: 'ASC' },
      });
    });
  });

  describe('toggleEquipped', () => {
    it('should equip an unequipped item', async () => {
      // Arrange
      const unequippedItem = { ...mockItem, equipped: false };
      const mockTransaction = {
        createQueryBuilder: jest.fn().mockReturnValue({
          setLock: jest.fn().mockReturnThis(),
          where: jest.fn().mockReturnThis(),
          andWhere: jest.fn().mockReturnThis(),
          getOne: jest.fn().mockResolvedValue(unequippedItem),
        }),
        save: jest.fn().mockResolvedValue({ ...unequippedItem, equipped: true }),
      };

      inventoryRepository.manager.transaction.mockImplementation(async (cb) => cb(mockTransaction));

      // Act
      const result = await service.toggleEquipped(mockUser.id, 'sword_iron');

      // Assert
      expect(result.equipped).toBe(true);
    });

    it('should unequip an equipped item', async () => {
      // Arrange
      const equippedItem = { ...mockItem, equipped: true };
      const mockTransaction = {
        createQueryBuilder: jest.fn().mockReturnValue({
          setLock: jest.fn().mockReturnThis(),
          where: jest.fn().mockReturnThis(),
          andWhere: jest.fn().mockReturnThis(),
          getOne: jest.fn().mockResolvedValue(equippedItem),
        }),
        save: jest.fn().mockResolvedValue({ ...equippedItem, equipped: false }),
      };

      inventoryRepository.manager.transaction.mockImplementation(async (cb) => cb(mockTransaction));

      // Act
      const result = await service.toggleEquipped(mockUser.id, 'sword_iron');

      // Assert
      expect(result.equipped).toBe(false);
    });

    it('should throw NotFoundException if item not found', async () => {
      // Arrange
      const mockTransaction = {
        createQueryBuilder: jest.fn().mockReturnValue({
          setLock: jest.fn().mockReturnThis(),
          where: jest.fn().mockReturnThis(),
          andWhere: jest.fn().mockReturnThis(),
          getOne: jest.fn().mockResolvedValue(null),
        }),
      };

      inventoryRepository.manager.transaction.mockImplementation(async (cb) => cb(mockTransaction));

      // Act & Assert
      await expect(service.toggleEquipped(mockUser.id, 'nonexistent'))
        .rejects
        .toThrow(NotFoundException);
    });
  });

  describe('Security & Audit', () => {
    it('should log inventory changes', async () => {
      // Arrange
      const logSpy = jest.spyOn((service as any).logger, 'log');
      usersService.findOneById.mockResolvedValue(mockUser);

      const mockTransaction = {
        createQueryBuilder: jest.fn().mockReturnValue({
          setLock: jest.fn().mockReturnThis(),
          where: jest.fn().mockReturnThis(),
          andWhere: jest.fn().mockReturnThis(),
          getOne: jest.fn().mockResolvedValue(null),
        }),
        create: jest.fn().mockReturnValue(mockItem),
        save: jest.fn().mockResolvedValue(mockItem),
      };

      inventoryRepository.manager.transaction.mockImplementation(async (cb) => cb(mockTransaction));

      // Act
      await service.addItem(mockUser.id, {
        itemId: 'sword_iron',
        itemName: 'Iron Sword',
        itemType: 'weapon',
        quantity: 1,
      });

      // Assert
      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('[INVENTORY AUDIT]'));
      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('"action":"ADD"'));
    });
  });
});
