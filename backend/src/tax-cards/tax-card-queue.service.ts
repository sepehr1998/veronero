import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import {
    TAX_CARD_PROCESS_JOB,
    TAX_CARD_QUEUE,
} from './tax-cards.constants';

export interface ProcessTaxCardJobData {
    tax_card_id: string;
    file_storage_key: string;
}

@Injectable()
export class TaxCardQueueService {
    constructor(
        @InjectQueue(TAX_CARD_QUEUE) private readonly queue: Queue,
    ) {}

    async enqueueProcessTaxCard(data: ProcessTaxCardJobData): Promise<void> {
        await this.queue.add(TAX_CARD_PROCESS_JOB, data);
    }
}
