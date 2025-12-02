/**
 * Test utilities for backend testing
 */

import { Repository } from 'typeorm';

/**
 * Type for mocked repository
 */
export type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

/**
 * Creates a mock TypeORM repository with common methods
 */
export function createMockRepository<T = any>(): MockRepository<T> {
    return {
        findOne: jest.fn(),
        find: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        findOneBy: jest.fn(),
        count: jest.fn(),
    };
}

/**
 * Type for any mocked service/class
 */
export type MockType<T> = {
    [P in keyof T]?: jest.Mock;
};

/**
 * Generates a valid RegisterDto for testing
 */
export function generateValidRegisterDto() {
    return {
        username: 'testuser123',
        email: 'test@example.com',
        password: 'Test123!',
    };
}

/**
 * Generates a valid User entity for testing
 */
export function generateTestUser(overrides: any = {}) {
    return {
        id: 'test-uuid-123',
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedPassword123',
        createdAt: new Date(),
        updatedAt: new Date(),
        ...overrides,
    };
}

/**
 * Generates a valid JWT payload for testing
 */
export function generateTestJwtPayload(userId = 'test-uuid-123', username = 'testuser') {
    return {
        sub: userId,
        username,
    };
}
