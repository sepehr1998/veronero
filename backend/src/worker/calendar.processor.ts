import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { CalendarGeneratorService } from '../calendar/calendar-generator.service';
import { PrismaService } from '../database/prisma.service';
import { CALENDAR_QUEUE } from '../queue/queue.constants';
import {
    SYNC_ACCOUNT_CALENDAR_JOB,
    SYNC_ALL_CALENDAR_JOB,
} from '../calendar/calendar.constants';

@Processor(CALENDAR_QUEUE)
export class CalendarProcessor extends WorkerHost {
    constructor(
        private readonly calendarGenerator: CalendarGeneratorService,
        private readonly prisma: PrismaService,
    ) {
        super();
    }

    async process(
        job: Job<{ userId: string; accountId: string }>,
    ): Promise<void> {
        if (job.name === SYNC_ALL_CALENDAR_JOB) {
            await this.handleSyncAll();
            return;
        }

        if (job.name === SYNC_ACCOUNT_CALENDAR_JOB) {
            const { userId, accountId } = job.data;
            await this.calendarGenerator.syncAccountCalendar({
                userId,
                accountId,
            });
        }
    }

    private async handleSyncAll(): Promise<void> {
        const memberships = await this.prisma.userAccount.findMany({
            select: { userId: true, accountId: true },
        });

        for (const membership of memberships) {
            await this.calendarGenerator.syncAccountCalendar({
                userId: membership.userId,
                accountId: membership.accountId,
            });
        }
    }
}
