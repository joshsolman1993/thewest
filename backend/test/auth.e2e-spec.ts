import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AllExceptionsFilter } from '../src/common/filters/all-exceptions.filter';

describe('Authentication Flow (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();

        // Apply same global pipes and filters as in main.ts
        app.useGlobalFilters(new AllExceptionsFilter());
        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: true,
                transform: true,
            }),
        );

        // Set API prefix
        app.setGlobalPrefix('api');

        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('/api/auth/register (POST)', () => {
        it('should register a new user with valid data', () => {
            const uniqueUsername = `testuser_${Date.now()}`;

            return request(app.getHttpServer())
                .post('/api/auth/register')
                .send({
                    username: uniqueUsername,
                    email: `${uniqueUsername}@example.com`,
                    password: 'Test123!',
                })
                .expect(201)
                .expect((res) => {
                    expect(res.body).toHaveProperty('id');
                    expect(res.body).toHaveProperty('username', uniqueUsername);
                    expect(res.body).toHaveProperty('email');
                    expect(res.body).not.toHaveProperty('password'); // Password should not be returned
                });
        });

        it('should reject registration with weak password', () => {
            return request(app.getHttpServer())
                .post('/api/auth/register')
                .send({
                    username: 'testuser',
                    email: 'test@example.com',
                    password: 'weak', // No uppercase, no numbers
                })
                .expect(400)
                .expect((res) => {
                    expect(res.body).toHaveProperty('statusCode', 400);
                    expect(res.body).toHaveProperty('message');
                });
        });

        it('should reject registration with invalid email', () => {
            return request(app.getHttpServer())
                .post('/api/auth/register')
                .send({
                    username: 'testuser',
                    email: 'not-an-email',
                    password: 'Test123!',
                })
                .expect(400)
                .expect((res) => {
                    expect(res.body).toHaveProperty('statusCode', 400);
                    expect(res.body.message).toContain('email');
                });
        });

        it('should reject registration with short username', () => {
            return request(app.getHttpServer())
                .post('/api/auth/register')
                .send({
                    username: 'ab', // Less than 3 characters
                    email: 'test@example.com',
                    password: 'Test123!',
                })
                .expect(400)
                .expect((res) => {
                    expect(res.body).toHaveProperty('statusCode', 400);
                });
        });

        it('should reject registration with special characters in username', () => {
            return request(app.getHttpServer())
                .post('/api/auth/register')
                .send({
                    username: 'test@user!', // Invalid characters
                    email: 'test@example.com',
                    password: 'Test123!',
                })
                .expect(400)
                .expect((res) => {
                    expect(res.body).toHaveProperty('statusCode', 400);
                });
        });
    });

    describe('/api/auth/login (POST)', () => {
        const testUser = {
            username: `logintest_${Date.now()}`,
            email: `logintest_${Date.now()}@example.com`,
            password: 'Test123!',
        };

        beforeAll(async () => {
            // Register a user for login tests
            await request(app.getHttpServer())
                .post('/api/auth/register')
                .send(testUser)
                .expect(201);
        });

        it('should login with valid credentials and return JWT', () => {
            return request(app.getHttpServer())
                .post('/api/auth/login')
                .send({
                    username: testUser.username,
                    password: testUser.password,
                })
                .expect(201)
                .expect((res) => {
                    expect(res.body).toHaveProperty('access_token');
                    expect(typeof res.body.access_token).toBe('string');
                    expect(res.body.access_token.length).toBeGreaterThan(0);
                });
        });

        it('should reject login with incorrect password', () => {
            return request(app.getHttpServer())
                .post('/api/auth/login')
                .send({
                    username: testUser.username,
                    password: 'WrongPassword123!',
                })
                .expect(401); // Unauthorized
        });

        it('should reject login with non-existent username', () => {
            return request(app.getHttpServer())
                .post('/api/auth/login')
                .send({
                    username: 'nonexistent_user_999',
                    password: 'Test123!',
                })
                .expect(401);
        });
    });

    describe('Protected Routes', () => {
        let authToken: string;
        const protectedUser = {
            username: `protected_${Date.now()}`,
            email: `protected_${Date.now()}@example.com`,
            password: 'Test123!',
        };

        beforeAll(async () => {
            // Register and login to get token
            await request(app.getHttpServer())
                .post('/api/auth/register')
                .send(protectedUser)
                .expect(201);

            const loginResponse = await request(app.getHttpServer())
                .post('/api/auth/login')
                .send({
                    username: protectedUser.username,
                    password: protectedUser.password,
                })
                .expect(201);

            authToken = loginResponse.body.access_token;
        });

        it('should access protected route with valid JWT', () => {
            return request(app.getHttpServer())
                .get('/api/quest') // This is a protected route
                .set('Authorization', `Bearer ${authToken}`)
                .expect((res) => {
                    // Should not be 401 or 403
                    expect([200, 201, 404]).toContain(res.status);
                });
        });

        it('should reject access to protected route without JWT', () => {
            return request(app.getHttpServer())
                .get('/api/quest')
                .expect(401); // Unauthorized
        });

        it('should reject access to protected route with invalid JWT', () => {
            return request(app.getHttpServer())
                .get('/api/quest')
                .set('Authorization', 'Bearer invalid.token.here')
                .expect(401);
        });
    });

    describe('Error Response Format', () => {
        it('should return consistent error format for validation errors', () => {
            return request(app.getHttpServer())
                .post('/api/auth/register')
                .send({
                    username: 'test',
                    // Missing email and password
                })
                .expect(400)
                .expect((res) => {
                    expect(res.body).toHaveProperty('statusCode');
                    expect(res.body).toHaveProperty('message');
                    expect(res.body).toHaveProperty('timestamp');
                    expect(res.body).toHaveProperty('path');
                });
        });
    });
});
