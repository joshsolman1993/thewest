import * as Joi from 'joi';

export const validationSchema = Joi.object({
    // Application
    NODE_ENV: Joi.string()
        .valid('development', 'production', 'test')
        .default('development'),
    PORT: Joi.number().default(3000),
    API_PREFIX: Joi.string().default('api'),
    CORS_ORIGIN: Joi.string().default('http://localhost:5173'),
    ENABLE_SWAGGER: Joi.boolean().default(true),

    // Database - SQLite
    DATABASE_TYPE: Joi.string().valid('sqlite', 'postgres').default('sqlite'),
    DATABASE_PATH: Joi.string().when('DATABASE_TYPE', {
        is: 'sqlite',
        then: Joi.required(),
        otherwise: Joi.optional(),
    }),

    // Database - PostgreSQL
    DATABASE_HOST: Joi.string().when('DATABASE_TYPE', {
        is: 'postgres',
        then: Joi.required(),
        otherwise: Joi.optional(),
    }),
    DATABASE_PORT: Joi.number().when('DATABASE_TYPE', {
        is: 'postgres',
        then: Joi.required(),
        otherwise: Joi.optional(),
    }),
    DATABASE_USERNAME: Joi.string().when('DATABASE_TYPE', {
        is: 'postgres',
        then: Joi.required(),
        otherwise: Joi.optional(),
    }),
    DATABASE_PASSWORD: Joi.string().when('DATABASE_TYPE', {
        is: 'postgres',
        then: Joi.required(),
        otherwise: Joi.optional(),
    }),
    DATABASE_NAME: Joi.string().when('DATABASE_TYPE', {
        is: 'postgres',
        then: Joi.required(),
        otherwise: Joi.optional(),
    }),

    // JWT
    JWT_SECRET: Joi.string().required(),
    JWT_EXPIRATION: Joi.string().default('24h'),
});
