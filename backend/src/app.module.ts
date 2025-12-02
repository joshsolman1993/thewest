import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './users/user.entity';
import { Character } from './character/character.entity';
import { InventoryItem } from './inventory/inventory-item.entity';
import { Quest } from './quest/quest.entity';
import { UserQuest } from './quest/user-quest.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CharacterModule } from './character/character.module';
import { InventoryModule } from './inventory/inventory.module';
import { QuestModule } from './quest/quest.module';
import configuration from './config/configuration';
import { validationSchema } from './config/validation.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: false,
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbConfig = configService.get('database');

        return {
          type: 'postgres',
          host: dbConfig.host,
          port: dbConfig.port,
          username: dbConfig.username,
          password: dbConfig.password,
          database: dbConfig.database,
          entities: [User, Character, InventoryItem, Quest, UserQuest],
          synchronize: false, // DISABLED - use migrations instead
          migrationsRun: true, // Auto-run pending migrations on startup
          logging: configService.get('app.nodeEnv') === 'development' ? ['query', 'error'] : ['error'],
        };
      },
    }),
    UsersModule,
    AuthModule,
    CharacterModule,
    InventoryModule,
    QuestModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

