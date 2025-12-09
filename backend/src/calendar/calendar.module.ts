import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { CALENDAR_QUEUE } from '../queue/queue.constants';
import { CalendarCoreModule } from './calendar-core.module';
import { CalendarController } from './calendar.controller';
import { CalendarScheduler } from './calendar.scheduler';
import { CalendarService } from './calendar.service';

@Module({
    imports: [
        AuthModule,
        CalendarCoreModule,
        BullModule.registerQueue({ name: CALENDAR_QUEUE }),
    ],
    controllers: [CalendarController],
    providers: [CalendarService, CalendarScheduler],
    exports: [CalendarService],
})
export class CalendarModule {}
