import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import aiConfig from './config/ai.config';
import appConfig from './config/app.config';
import authConfig from './config/auth.config';
import databaseConfig from './config/database.config';
import { envValidationSchema } from './config/env.validation';
import queueConfig from './config/queue.config';
import redisConfig from './config/redis.config';
import storageConfig from './config/storage.config';
import { StorageModule } from './storage/storage.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';
import { QueueModule } from './queue/queue.module';
import { RedisModule } from './redis/redis.module';
import { TaxProfilesModule } from './tax-profiles/tax-profiles.module';
import { TaxCardsModule } from './tax-cards/tax-cards.module';
import { ExpensesModule } from './expenses/expenses.module';
import { ReceiptsModule } from './receipts/receipts.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            cache: true,
            expandVariables: true,
            envFilePath: ['.env.local', '.env'],
            isGlobal: true,
            load: [
                appConfig,
                databaseConfig,
                redisConfig,
                queueConfig,
                authConfig,
                aiConfig,
                storageConfig,
            ],
            validationSchema: envValidationSchema,
        }),
        DatabaseModule,
        RedisModule,
        QueueModule,
        HealthModule,
        AuthModule,
        StorageModule,
        TaxProfilesModule,
        TaxCardsModule,
        ExpensesModule,
        ReceiptsModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
