import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { StorageModule } from '../storage/storage.module';
import { ExpensesModule } from '../expenses/expenses.module';
import { RECEIPT_QUEUE } from '../queue/queue.constants';
import { ReceiptsController } from './receipts.controller';
import { ReceiptsService } from './receipts.service';
import { ReceiptsRepository } from './receipts.repository';
import { ReceiptQueueService } from './receipt-queue.service';

@Module({
    imports: [
        DatabaseModule,
        AuthModule,
        StorageModule,
        ExpensesModule,
        BullModule.registerQueue({ name: RECEIPT_QUEUE }),
    ],
    controllers: [ReceiptsController],
    providers: [
        ReceiptsService,
        ReceiptsRepository,
        ReceiptQueueService,
    ],
    exports: [ReceiptsService],
})
export class ReceiptsModule {}
