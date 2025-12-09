import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import aiConfig from '../config/ai.config';
import appConfig from '../config/app.config';
import authConfig from '../config/auth.config';
import databaseConfig from '../config/database.config';
import queueConfig from '../config/queue.config';
import redisConfig from '../config/redis.config';
import storageConfig from '../config/storage.config';
import { envValidationSchema } from '../config/env.validation';
import { DatabaseModule } from '../database/database.module';
import { QueueModule } from '../queue/queue.module';
import { StorageModule } from '../storage/storage.module';
import { AiModule } from '../ai/ai.module';
import { TaxCardProcessor } from './tax-card.processor';
import { ReceiptProcessor } from './receipt.processor';
import { TaxScenarioProcessor } from './tax-scenario.processor';
import {
    CALENDAR_QUEUE,
    RECEIPT_QUEUE,
    SCENARIO_QUEUE,
    TAX_CARD_QUEUE,
} from '../queue/queue.constants';
import { CalendarCoreModule } from '../calendar/calendar-core.module';
import { CalendarProcessor } from './calendar.processor';
import { TaxScenariosModule } from '../tax-scenarios/tax-scenarios.module';

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
        QueueModule,
        DatabaseModule,
        StorageModule,
        AiModule,
        CalendarCoreModule,
        TaxScenariosModule,
        BullModule.registerQueue(
            { name: TAX_CARD_QUEUE },
            { name: RECEIPT_QUEUE },
            { name: SCENARIO_QUEUE },
            { name: CALENDAR_QUEUE },
        ),
    ],
    providers: [
        TaxCardProcessor,
        ReceiptProcessor,
        TaxScenarioProcessor,
        CalendarProcessor,
    ],
})
export class WorkerModule {}
