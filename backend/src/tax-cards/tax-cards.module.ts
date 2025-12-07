import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { BullModule } from '@nestjs/bullmq';
import { DatabaseModule } from '../database/database.module';
import { StorageModule } from '../storage/storage.module';
import { TAX_CARD_QUEUE } from './tax-cards.constants';
import { TaxCardsController } from './tax-cards.controller';
import { TaxCardQueueService } from './tax-card-queue.service';
import { TaxCardsRepository } from './tax-cards.repository';
import { TaxCardsService } from './tax-cards.service';

@Module({
    imports: [
        DatabaseModule,
        AuthModule,
        StorageModule,
        BullModule.registerQueue({
            name: TAX_CARD_QUEUE,
        }),
    ],
    controllers: [TaxCardsController],
    providers: [TaxCardsService, TaxCardsRepository, TaxCardQueueService],
    exports: [TaxCardsService, TaxCardQueueService],
})
export class TaxCardsModule {}
