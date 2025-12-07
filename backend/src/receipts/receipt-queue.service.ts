import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { RECEIPT_QUEUE } from '../queue/queue.constants';

export interface ReceiptJobData {
    receipt_file_id: string;
    file_storage_key: string;
}

@Injectable()
export class ReceiptQueueService {
    constructor(@InjectQueue(RECEIPT_QUEUE) private readonly queue: Queue) {}

    async enqueueReceiptProcessing(data: ReceiptJobData): Promise<void> {
        await this.queue.add('process-receipt', data);
    }
}
