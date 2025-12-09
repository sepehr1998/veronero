import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Queue } from 'bullmq';
import { CALENDAR_QUEUE } from '../queue/queue.constants';
import { SYNC_ALL_CALENDAR_JOB } from './calendar.constants';

@Injectable()
export class CalendarScheduler implements OnModuleInit {
    constructor(
        @InjectQueue(CALENDAR_QUEUE) private readonly queue: Queue,
    ) {}

    async onModuleInit(): Promise<void> {
        await this.ensureSyncJob();
    }

    private async ensureSyncJob(): Promise<void> {
        const existing = await this.queue.getRepeatableJobs();
        const alreadyRegistered = existing.some(
            (job) => job.name === SYNC_ALL_CALENDAR_JOB,
        );

        if (alreadyRegistered) {
            return;
        }

        await this.queue.add(
            SYNC_ALL_CALENDAR_JOB,
            {},
            {
                jobId: SYNC_ALL_CALENDAR_JOB,
                repeat: { pattern: '0 3 * * *' },
                removeOnComplete: true,
                removeOnFail: 10,
            },
        );
    }
}
