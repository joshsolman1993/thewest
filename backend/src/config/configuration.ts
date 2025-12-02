export interface DatabaseConfig {
    type: 'sqlite' | 'postgres';
    database?: string;
    host?: string;
    port?: number;
    username?: string;
    password?: string;
    synchronize: boolean;
}

export interface JwtConfig {
    secret: string;
    expiresIn: string;
}

export interface AppConfig {
    nodeEnv: string;
    port: number;
    apiPrefix: string;
    corsOrigin: string;
    enableSwagger: boolean;
}

export interface Configuration {
    app: AppConfig;
    database: DatabaseConfig;
    jwt: JwtConfig;
}

export default (): Configuration => {
    const databaseType = (process.env.DATABASE_TYPE || 'sqlite') as 'sqlite' | 'postgres';

    return {
        app: {
            nodeEnv: process.env.NODE_ENV || 'development',
            port: parseInt(process.env.PORT || '3000', 10),
            apiPrefix: process.env.API_PREFIX || 'api',
            corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
            enableSwagger: process.env.ENABLE_SWAGGER === 'true',
        },
        database: {
            type: databaseType,
            ...(databaseType === 'sqlite'
                ? { database: process.env.DATABASE_PATH || 'dust.sqlite' }
                : {
                    host: process.env.DATABASE_HOST || 'localhost',
                    port: parseInt(process.env.DATABASE_PORT || '5432', 10),
                    username: process.env.DATABASE_USERNAME,
                    password: process.env.DATABASE_PASSWORD,
                    database: process.env.DATABASE_NAME,
                }
            ),
            synchronize: process.env.NODE_ENV !== 'production',
        },
        jwt: {
            secret: process.env.JWT_SECRET || 'default-secret-change-in-production',
            expiresIn: process.env.JWT_EXPIRATION || '24h',
        },
    };
};
