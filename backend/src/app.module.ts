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
          type: dbConfig.type,
          ...(dbConfig.type === 'sqlite'
            ? { database: dbConfig.database }
            : {
              host: dbConfig.host,
              port: dbConfig.port,
              username: dbConfig.username,
              password: dbConfig.password,
              database: dbConfig.database,
            }
          ),
          entities: [User, Character, InventoryItem, Quest, UserQuest],
          synchronize: dbConfig.synchronize, // Auto-sync in dev, false in production
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

